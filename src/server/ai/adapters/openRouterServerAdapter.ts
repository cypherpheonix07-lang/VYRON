/**
 * PROJECT BRAHMA — OFFICIAL OPENROUTER SERVER ADAPTER
 * Server-side execution only. Never exposes keys to browser or client bundles.
 * Multi-model routing across Anthropic, Meta, Google, DeepSeek, and OpenAI.
 * Strictly ZERO SQL.
 */

import crypto from "crypto";
import {
  InferenceRequest,
  InferenceResponse,
  ProviderHealth,
  ToolCallInvocation,
  TokenUsage,
} from "../types";

function computeSha256(data: unknown): string {
  const jsonStr = typeof data === "string" ? data : JSON.stringify(data);
  return crypto.createHash("sha256").update(jsonStr).digest("hex");
}

import { IAIProvider, ProviderCapabilities } from "../providers/types";

export class OpenRouterServerAdapter implements IAIProvider {
  public readonly id: "openrouter" = "openrouter";
  public readonly name = "OpenRouter Hub";
  private static instance: OpenRouterServerAdapter | null = null;
  private readonly baseUrl = process.env["OPENROUTER_BASE_URL"] || `https://${"openrouter.ai"}/api/v1`;

  private constructor() {}

  public static getInstance(): OpenRouterServerAdapter {
    if (!OpenRouterServerAdapter.instance) {
      OpenRouterServerAdapter.instance = new OpenRouterServerAdapter();
    }
    return OpenRouterServerAdapter.instance;
  }

  public getCapabilities(): ProviderCapabilities {
    return {
      providerId: "openrouter",
      name: "OpenRouter Multi-Model Gateway",
      streaming: true,
      toolCalling: true,
      structuredOutput: true,
      multimodal: true,
      defaultModel: "anthropic/claude-3.5-sonnet",
      fallbackProvider: "openai",
      supportedModels: [
        "anthropic/claude-3.5-sonnet",
        "anthropic/claude-3.7-sonnet",
        "meta-llama/llama-3.3-70b-instruct",
        "google/gemini-2.0-flash-001",
        "deepseek/deepseek-r1",
        "openai/gpt-4o-mini",
      ],
    };
  }

  private getApiKey(): string | undefined {
    return process.env["OPENROUTER_API_KEY"];
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.startsWith("sk-or-") && key.length > 20);
  }

  public async healthCheck(): Promise<ProviderHealth> {
    const startTime = Date.now();
    const isConfig = this.isConfigured();

    if (!isConfig) {
      return {
        provider: "openrouter",
        isConfigured: false,
        isHealthy: false,
        lastChecked: new Date().toISOString(),
        latencyMs: 0,
        errorMessage: "OPENROUTER_API_KEY is not configured in server environment.",
        activeModelsCount: 0,
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/auth/key`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.getApiKey()}`,
          "HTTP-Referer": "https://brahma.dev",
          "X-Title": "PROJECT BRAHMA",
          "User-Agent": "Brahma-Enterprise-Gateway/2.0",
        },
        signal: AbortSignal.timeout(6000),
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        return {
          provider: "openrouter",
          isConfigured: true,
          isHealthy: true,
          lastChecked: new Date().toISOString(),
          latencyMs,
          activeModelsCount: 150, // OpenRouter hosts hundreds of models
        };
      } else {
        const errText = await res.text();
        return {
          provider: "openrouter",
          isConfigured: true,
          isHealthy: false,
          lastChecked: new Date().toISOString(),
          latencyMs,
          errorMessage: `OpenRouter HTTP ${res.status}: ${errText.substring(0, 120)}`,
          activeModelsCount: 0,
        };
      }
    } catch (err: unknown) {
      return {
        provider: "openrouter",
        isConfigured: true,
        isHealthy: false,
        lastChecked: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        errorMessage: (err as Error).message || "OpenRouter health check network timeout",
        activeModelsCount: 0,
      };
    }
  }

  public async complete(request: InferenceRequest): Promise<InferenceResponse> {
    const startTime = Date.now();
    const apiKey = this.getApiKey();

    if (!apiKey || !this.isConfigured()) {
      return {
        ok: false,
        text: "",
        provider: "openrouter",
        model: request.modelOverride || "openai/gpt-4o-mini",
        cacheHit: false,
        fallbackUsed: false,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
        latencyMs: 0,
        sha256: "",
        error: {
          code: "OPENROUTER_NOT_CONFIGURED",
          message: "OpenRouter API key is missing or invalid on the server.",
          recoverable: true,
        },
      };
    }

    const model = request.modelOverride || "openai/gpt-4o-mini";
    const messages = [];

    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }

    for (const msg of request.messages) {
      messages.push({
        role: msg.role,
        content: msg.content,
        ...(msg.name ? { name: msg.name } : {}),
        ...(msg.tool_call_id ? { tool_call_id: msg.tool_call_id } : {}),
      });
    }

    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature: request.temperature ?? 0.2,
      max_tokens: request.maxTokens ?? 2048,
    };

    if (request.tools && request.tools.length > 0) {
      payload["tools"] = request.tools.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      }));
    }

    if (request.structuredOutputSchema) {
      payload["response_format"] = { type: "json_object" };
    }

    let lastError: Error | null = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const backoff = Math.pow(2, attempt) * 500;
          await new Promise((resolve) => setTimeout(resolve, backoff));
        }

        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://brahma.dev",
            "X-Title": "PROJECT BRAHMA",
            "User-Agent": "Brahma-AI-Gateway/2.0",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(25000), // 25s timeout for large models
        });

        if (!res.ok) {
          const errBody = await res.text();
          const isRetryable = res.status === 429 || res.status >= 500;
          if (isRetryable && attempt < maxRetries) {
            lastError = new Error(`HTTP ${res.status}: ${errBody}`);
            continue;
          }
          throw new Error(`OpenRouter HTTP ${res.status}: ${errBody}`);
        }

        const data = await res.json();
        const latencyMs = Date.now() - startTime;
        const choice = data.choices?.[0];
        const rawText = choice?.message?.content || "";

        let structuredData = null;
        if (request.structuredOutputSchema || request.task.includes("extraction") || request.task.includes("architecture")) {
          try {
            structuredData = JSON.parse(rawText);
          } catch {
            structuredData = null;
          }
        }

        const toolCalls: ToolCallInvocation[] = [];
        if (Array.isArray(choice?.message?.tool_calls)) {
          for (const tc of choice.message.tool_calls) {
            toolCalls.push({
              id: tc.id,
              type: "function",
              function: {
                name: tc.function?.name || "",
                arguments: tc.function?.arguments || "{}",
              },
            });
          }
        }

        const promptTokens = data.usage?.prompt_tokens || 0;
        const completionTokens = data.usage?.completion_tokens || 0;
        const totalTokens = data.usage?.total_tokens || promptTokens + completionTokens;

        // Pricing estimation based on model
        let promptRate = 0.00015;
        let compRate = 0.0006;
        if (model.includes("sonnet")) {
          promptRate = 0.003;
          compRate = 0.015;
        } else if (model.includes("llama-3.3-70b")) {
          promptRate = 0.0004;
          compRate = 0.0004;
        } else if (model.includes("gemini-2.0-flash")) {
          promptRate = 0.0001;
          compRate = 0.0004;
        }

        const estimatedCostUsd =
          (promptTokens / 1000) * promptRate + (completionTokens / 1000) * compRate;

        const usage: TokenUsage = {
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd,
        };

        const sha256 = computeSha256(rawText || structuredData || choice?.message);

        return {
          ok: true,
          text: rawText,
          structuredData,
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
          provider: "openrouter",
          model,
          cacheHit: false,
          fallbackUsed: false,
          usage,
          latencyMs,
          sha256,
          error: null,
        };
      } catch (err: unknown) {
        lastError = err as Error;
      }
    }

    return {
      ok: false,
      text: "",
      provider: "openrouter",
      model,
      cacheHit: false,
      fallbackUsed: false,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
      latencyMs: Date.now() - startTime,
      sha256: "",
      error: {
        code: "OPENROUTER_REQUEST_FAILED",
        message: lastError?.message || "Failed to complete OpenRouter request",
        recoverable: true,
      },
    };
  }

  public async generate(request: InferenceRequest): Promise<InferenceResponse> {
    return this.complete(request);
  }

  public async generateStructured<T>(
    request: InferenceRequest,
    schema: Record<string, unknown>,
  ): Promise<InferenceResponse<T>> {
    const enrichedRequest: InferenceRequest = {
      ...request,
      structuredOutputSchema: schema,
    };
    return (await this.complete(enrichedRequest)) as InferenceResponse<T>;
  }
}

export const openRouterServerAdapter = OpenRouterServerAdapter.getInstance();
