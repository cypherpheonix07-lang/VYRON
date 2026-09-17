/**
 * VYRON — OPENAI CLIENT PROVIDER
 * Routes requests securely through server-side /api/ai/gateway with provider: "openai".
 * Strictly ZERO API Keys in the browser.
 * Strictly ZERO Raw SQL.
 */

import {
  IAIProviderClient,
  ClientAIProviderId,
  ClientAIRequest,
  ClientAIResponse,
} from "./clientProviderTypes";

export class OpenAiClientProvider implements IAIProviderClient {
  public readonly id: ClientAIProviderId = "openai";
  public readonly name = "OpenAI Direct";
  private static instance: OpenAiClientProvider | null = null;

  private constructor() {}

  public static getInstance(): OpenAiClientProvider {
    if (!OpenAiClientProvider.instance) {
      OpenAiClientProvider.instance = new OpenAiClientProvider();
    }
    return OpenAiClientProvider.instance;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch("/api/ai/health");
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.openai?.isHealthy);
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
          providerOverride: "openai",
          modelOverride: request.modelOverride || "gpt-4o",
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
          provider: "openai",
          model: data.model || "gpt-4o",
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
        provider: "openai",
        model: request.modelOverride || "gpt-4o",
        latencyMs: Date.now() - startTime,
        fallbackUsed: false,
        error: { code: `HTTP_${res.status}`, message: `OpenAI Gateway error: ${res.statusText}` },
      };
    } catch (err: unknown) {
      return {
        ok: false,
        text: "",
        provider: "openai",
        model: request.modelOverride || "gpt-4o",
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

export const openAiClientProvider = OpenAiClientProvider.getInstance();
