/**
 * VYRON — OPENROUTER CLIENT PROVIDER
 * Routes requests securely through server-side /api/ai/gateway with provider: "openrouter".
 * Strict Multi-Model Routing across Anthropic, Meta, DeepSeek, Google.
 * Strictly ZERO Raw SQL.
 */

import {
  IAIProviderClient,
  ClientAIProviderId,
  ClientAIRequest,
  ClientAIResponse,
} from "./clientProviderTypes";

export class OpenRouterClientProvider implements IAIProviderClient {
  public readonly id: ClientAIProviderId = "openrouter";
  public readonly name = "OpenRouter Hub";
  private static instance: OpenRouterClientProvider | null = null;

  private constructor() {}

  public static getInstance(): OpenRouterClientProvider {
    if (!OpenRouterClientProvider.instance) {
      OpenRouterClientProvider.instance = new OpenRouterClientProvider();
    }
    return OpenRouterClientProvider.instance;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch("/api/ai/health");
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.openrouter?.isHealthy);
    } catch {
      return false;
    }
  }

  public async generate(request: ClientAIRequest): Promise<ClientAIResponse> {
    const startTime = Date.now();
    try {
      const res = await fetch("/api/ai/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: request.task,
          providerOverride: "openrouter",
          modelOverride: request.modelOverride || "anthropic/claude-3.5-sonnet",
          systemPrompt: request.systemPrompt,
          messages: request.messages,
          temperature: request.temperature ?? 0.2,
          maxTokens: request.maxTokens ?? 2048,
          tools: request.tools,
          structuredOutputSchema: request.structuredOutputSchema,
          projectId: request.projectId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          ok: data.ok ?? true,
          text: data.text || "",
          structuredData: data.structuredData,
          provider: "openrouter",
          model: data.model || "anthropic/claude-3.5-sonnet",
          usage: data.usage ? { totalTokens: data.usage.totalTokens, estimatedCostUsd: data.usage.estimatedCostUsd } : undefined,
          latencyMs: Date.now() - startTime,
          fallbackUsed: Boolean(data.fallbackUsed),
          sha256: data.sha256,
          error: data.error,
        };
      }
      return {
        ok: false,
        text: "",
        provider: "openrouter",
        model: request.modelOverride || "anthropic/claude-3.5-sonnet",
        latencyMs: Date.now() - startTime,
        fallbackUsed: false,
        error: { code: `HTTP_${res.status}`, message: `OpenRouter Gateway error: ${res.statusText}` },
      };
    } catch (err: unknown) {
      return {
        ok: false,
        text: "",
        provider: "openrouter",
        model: request.modelOverride || "anthropic/claude-3.5-sonnet",
        latencyMs: Date.now() - startTime,
        fallbackUsed: false,
        error: { code: "NETWORK_ERROR", message: (err as Error).message },
      };
    }
  }

  public async generateStructured<T>(
    request: ClientAIRequest,
    schema: Record<string, unknown>,
  ): Promise<ClientAIResponse<T>> {
    const reqWithSchema: ClientAIRequest = {
      ...request,
      structuredOutputSchema: schema,
    };
    return (await this.generate(reqWithSchema)) as ClientAIResponse<T>;
  }
}

export const openRouterClientProvider = OpenRouterClientProvider.getInstance();
