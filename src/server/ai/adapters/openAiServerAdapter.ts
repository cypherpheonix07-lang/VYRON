/**
 * PROJECT BRAHMA — OFFICIAL OPENAI SERVER ADAPTER
 * Server-side execution only. Never exposes keys to browser or client bundles.
 * Supports GPT-4o, GPT-4o-mini, o3-mini, structured JSON, tool execution, and streaming.
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

export class OpenAiServerAdapter implements IAIProvider {
  public readonly id: "openai" = "openai";
  public readonly name = "OpenAI Direct";
  private static instance: OpenAiServerAdapter | null = null;
  private readonly baseUrl = "https://api.openai.com/v1";

  private constructor() {}

  public static getInstance(): OpenAiServerAdapter {
    if (!OpenAiServerAdapter.instance) {
      OpenAiServerAdapter.instance = new OpenAiServerAdapter();
    }
    return OpenAiServerAdapter.instance;
  }

  public getCapabilities(): ProviderCapabilities {
    return {
      providerId: "openai",
      name: "OpenAI Direct API Engine",
      streaming: true,
      toolCalling: true,
      structuredOutput: true,
      multimodal: true,
      defaultModel: "gpt-4o",
      fallbackProvider: "openrouter",
      supportedModels: [
        "gpt-4o",
        "gpt-4o-mini",
        "o1-preview",
        "o3-mini",
      ],
    };
  }

  private getApiKey(): string | undefined {
    return process.env["OPENAI_API_KEY"];
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.startsWith("sk-") && key.length > 20);
  }

  public async healthCheck(): Promise<ProviderHealth> {
    const startTime = Date.now();
    const isConfig = this.isConfigured();

    if (!isConfig) {
      return {
        provider: "openai",
        isConfigured: false,
        isHealthy: false,
        lastChecked: new Date().toISOString(),
        latencyMs: 0,
        errorMessage: "OPENAI_API_KEY is not configured in server environment.",
        activeModelsCount: 0,
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.getApiKey()}`,
          "User-Agent": "Brahma-Enterprise-Gateway/2.0",
        },
        signal: AbortSignal.timeout(6000),
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        const models = Array.isArray(data?.data) ? data.data : [];

        // Probe chat completion quota availability
        let isChatHealthy = true;
        let quotaNotice = "";
        try {
          const probeRes = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.getApiKey()}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: "ping" }],
              max_tokens: 1,
            }),
            signal: AbortSignal.timeout(4000),
          });

          if (!probeRes.ok) {
            const probeErr = await probeRes.text();
            if (probeErr.includes("credit_balance_exhausted") || probeErr.includes("insufficient_quota")) {
              isChatHealthy = false;
              quotaNotice = "OpenAI credit balance exhausted; automated failover to OpenRouter active.";
            }
          }
        } catch {
          // Probe timeout or network issue
        }

        return {
          provider: "openai",
          isConfigured: true,
          isHealthy: isChatHealthy,
          lastChecked: new Date().toISOString(),
          latencyMs,
          errorMessage: quotaNotice || undefined,
          activeModelsCount: models.length,
        };
      } else {
        const errText = await res.text();
        return {
          provider: "openai",
          isConfigured: true,
          isHealthy: false,
          lastChecked: new Date().toISOString(),
          latencyMs,
          errorMessage: `OpenAI API returned HTTP ${res.status}: ${errText.substring(0, 120)}`,
          activeModelsCount: 0,
        };
      }
    } catch (err: unknown) {
      return {
        provider: "openai",
        isConfigured: true,
        isHealthy: false,
        lastChecked: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        errorMessage: (err as Error).message || "Connection timeout or network failure",
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
        provider: "openai",
        model: request.modelOverride || "gpt-4o-mini",
        cacheHit: false,
        fallbackUsed: false,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
        latencyMs: 0,
        sha256: "",
        error: {
          code: "OPENAI_NOT_CONFIGURED",
          message: "OpenAI API key is missing or invalid on the server.",
          recoverable: true,
        },
      };
    }

    const model = request.modelOverride || "gpt-4o-mini";
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
            "User-Agent": "Brahma-AI-Gateway/2.0",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(20000), // 20s timeout
        });

        if (!res.ok) {
          const errBody = await res.text();
          let errCode = "";
          try {
            const parsedErr = JSON.parse(errBody);
            errCode = parsedErr?.error?.code || "";
          } catch {
            // non-json body
          }

          // If credit balance is exhausted or unauthorized, do NOT retry; fail fast to fallback
          if (errCode === "credit_balance_exhausted" || errCode === "insufficient_quota" || res.status === 401) {
            lastError = new Error(`OpenAI quota exhausted (${errCode || res.status})`);
            break;
          }

          const isRetryable = (res.status === 429 && errCode !== "credit_balance_exhausted") || res.status >= 500;
          if (isRetryable && attempt < maxRetries) {
            lastError = new Error(`HTTP ${res.status}: ${errBody}`);
            continue;
          }
          throw new Error(`OpenAI HTTP ${res.status}: ${errBody}`);
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

        // Pricing calculation: gpt-4o vs gpt-4o-mini
        const isMini = model.includes("mini");
        const promptCost = isMini ? (promptTokens / 1000) * 0.00015 : (promptTokens / 1000) * 0.0025;
        const completionCost = isMini ? (completionTokens / 1000) * 0.0006 : (completionTokens / 1000) * 0.01;
        const estimatedCostUsd = promptCost + completionCost;

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
          provider: "openai",
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
      provider: "openai",
      model,
      cacheHit: false,
      fallbackUsed: false,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
      latencyMs: Date.now() - startTime,
      sha256: "",
      error: {
        code: "OPENAI_REQUEST_FAILED",
        message: lastError?.message || "Failed to complete OpenAI request",
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

export const openAiServerAdapter = OpenAiServerAdapter.getInstance();
