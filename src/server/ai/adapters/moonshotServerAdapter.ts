/**
 * PROJECT BRAHMA / VYRON — OFFICIAL MOONSHOT KIMI SERVER ADAPTER
 * Server-side execution only. Never exposes keys to browser or client bundles.
 * Supports Moonshot Kimi K3 MoE (moonshot-v1-8k, 32k, 128k).
 * Strictly ZERO SQL.
 */

import crypto from "crypto";
import {
  InferenceRequest,
  InferenceResponse,
  ProviderHealth,
  TokenUsage,
} from "../types";
import { IAIProvider, ProviderCapabilities } from "../providers/types";

function computeSha256(data: unknown): string {
  const jsonStr = typeof data === "string" ? data : JSON.stringify(data);
  return crypto.createHash("sha256").update(jsonStr).digest("hex");
}

export class MoonshotServerAdapter implements IAIProvider {
  public readonly id: "moonshot" = "moonshot";
  public readonly name = "Moonshot Kimi K3 MoE Gateway";
  private static instance: MoonshotServerAdapter | null = null;
  private readonly baseUrl = "https://api.moonshot.cn/v1";

  private constructor() {}

  public static getInstance(): MoonshotServerAdapter {
    if (!MoonshotServerAdapter.instance) {
      MoonshotServerAdapter.instance = new MoonshotServerAdapter();
    }
    return MoonshotServerAdapter.instance;
  }

  public getCapabilities(): ProviderCapabilities {
    return {
      providerId: "moonshot",
      name: "Moonshot AI Engine",
      streaming: false,
      toolCalling: true,
      structuredOutput: true,
      multimodal: false,
      defaultModel: "moonshot-v1-128k",
      fallbackProvider: "deterministic",
      supportedModels: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    };
  }

  private getApiKey(): string | undefined {
    return process.env["MOONSHOT_API_KEY"];
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5 && key !== "mock_key");
  }

  public async healthCheck(): Promise<ProviderHealth> {
    const startTime = Date.now();
    const isConfig = this.isConfigured();

    if (!isConfig) {
      return {
        provider: "moonshot",
        isConfigured: false,
        isHealthy: false,
        lastChecked: new Date().toISOString(),
        latencyMs: 0,
        errorMessage: "MOONSHOT_API_KEY is not configured in server environment.",
        activeModelsCount: 0,
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.getApiKey()}`,
          "User-Agent": "Vyron-Enterprise-Gateway/2.0",
        },
        signal: AbortSignal.timeout(5000),
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        const models = Array.isArray(data?.data) ? data.data : [];
        return {
          provider: "moonshot",
          isConfigured: true,
          isHealthy: true,
          lastChecked: new Date().toISOString(),
          latencyMs,
          activeModelsCount: models.length || 3,
        };
      } else {
        const errText = await res.text();
        return {
          provider: "moonshot",
          isConfigured: true,
          isHealthy: false,
          lastChecked: new Date().toISOString(),
          latencyMs,
          errorMessage: `Moonshot API returned HTTP ${res.status}: ${errText.substring(0, 120)}`,
          activeModelsCount: 0,
        };
      }
    } catch (err: unknown) {
      return {
        provider: "moonshot",
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
        provider: "moonshot",
        model: request.modelOverride || "moonshot-v1-128k",
        cacheHit: false,
        fallbackUsed: false,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
        latencyMs: 0,
        sha256: "",
        error: {
          code: "MOONSHOT_NOT_CONFIGURED",
          message: "MOONSHOT_API_KEY is missing or invalid on the server.",
          recoverable: true,
        },
      };
    }

    const model = request.modelOverride || "moonshot-v1-128k";
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
      temperature: request.temperature ?? 0.3,
      max_tokens: request.maxTokens ?? 2048,
    };

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "User-Agent": "Vyron-Enterprise-Gateway/2.0",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Moonshot HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const usage: TokenUsage = {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
        estimatedCostUsd: (data.usage?.total_tokens || 0) * 0.00001,
      };

      const latencyMs = Date.now() - startTime;
      const sha256 = computeSha256(`${model}:${text}:${latencyMs}`);

      return {
        ok: true,
        text,
        provider: "moonshot",
        model,
        cacheHit: false,
        fallbackUsed: false,
        usage,
        latencyMs,
        sha256,
      };
    } catch (err: unknown) {
      return {
        ok: false,
        text: "",
        provider: "moonshot",
        model,
        cacheHit: false,
        fallbackUsed: false,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
        latencyMs: Date.now() - startTime,
        sha256: "",
        error: {
          code: "MOONSHOT_REQUEST_FAILED",
          message: (err as Error).message,
          recoverable: true,
        },
      };
    }
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

export const moonshotServerAdapter = MoonshotServerAdapter.getInstance();
