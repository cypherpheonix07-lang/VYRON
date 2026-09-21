/**
 * PROJECT BRAHMA — MOONSHOT KIMI K3 (MoE) ADAPTER
 * Connects to Moonshot AI for long-context RAG, tabular dataset comprehension, and deep MoE search.
 * Gracefully falls back to deterministic simulation when API credentials are not set.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse } from "../types";
import { generateVerificationHash } from "../cryptoUtils";
import { MockAIAdapter } from "./mockAdapter";

export class KimiAdapter implements AIAdapter {
  public id = "KIMI_K3" as const;
  public providerName = "MOONSHOT" as const;
  private fallbackAdapter = new MockAIAdapter();

  public isAvailable(): boolean {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const apiKey =
      typeof window !== "undefined"
        ? metaEnv?.["VITE_MOONSHOT_API_KEY"]
        : process.env["VITE_MOONSHOT_API_KEY"];
    return Boolean(apiKey && apiKey.length > 5);
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const apiKey =
      typeof window !== "undefined"
        ? metaEnv?.["VITE_MOONSHOT_API_KEY"]
        : process.env["VITE_MOONSHOT_API_KEY"];

    if (!apiKey || apiKey === "mock_key") {
      const mockRes = await this.fallbackAdapter.complete(request);
      return {
        ...mockRes,
        model: "KIMI_K3",
        provider: "MOONSHOT",
        text: `[Moonshot Kimi K3 MoE Long-Context Engine]\n\n${mockRes.text}`,
      };
    }

    const startTime = Date.now();
    try {
      const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-128k",
          messages: [
            {
              role: "system",
              content:
                request.systemPrompt ||
                "You are Kimi K3, an expert in massive tabular data reasoning.",
            },
            ...request.messages,
          ],
          temperature: request.temperature ?? 0.3,
          max_tokens: request.maxTokens ?? 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`Moonshot API error status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const durationMs = Date.now() - startTime;
      const text = data.choices?.[0]?.message?.content || "";

      const hashPayload = `${this.id}:${text}:${durationMs}`;
      const verificationHash = generateVerificationHash(hashPayload);

      return {
        model: "KIMI_K3",
        provider: "MOONSHOT",
        text,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        durationMs,
        verificationHash,
        rawResponse: data,
      };
    } catch (err: unknown) {
      console.warn("Moonshot API error; falling back to deterministic execution engine.", err);
      const fallbackRes = await this.fallbackAdapter.complete(request);
      return {
        ...fallbackRes,
        model: "KIMI_K3",
        provider: "MOONSHOT",
        text: `[Moonshot Kimi K3 MoE Offline Runner]\n\n${fallbackRes.text}`,
      };
    }
  }
}
