/**
 * PROJECT BRAHMA — MOONSHOT KIMI K3 (MoE) ADAPTER
 * Connects to Moonshot AI for long-context RAG, tabular dataset comprehension, and deep MoE search.
 * Gracefully falls back to deterministic simulation when API credentials are not set.
 */

import type { AIAdapter, AICompletionRequest, AICompletionResponse } from "../types.ts";
import { generateVerificationHash } from "../cryptoUtils.ts";
import { MockAIAdapter } from "./mockAdapter.ts";

export class KimiAdapter implements AIAdapter {
  public id = "KIMI_K3" as const;
  public providerName = "MOONSHOT" as const;
  private fallbackAdapter = new MockAIAdapter();

  public isAvailable(): boolean {
    // Zero secret leakage: Private provider keys are never exposed in browser bundles.
    if (typeof window !== "undefined") {
      return false; // Browser relies on authenticated server endpoints or simulated deterministic fallback
    }
    const serverKey = process.env["MOONSHOT_API_KEY"];
    return Boolean(serverKey && serverKey.length > 5);
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();

    // In browser, attempt server-side gateway if online, otherwise use explicit simulation
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/ai/gateway", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: request.taskType || "long_context_rag",
            providerOverride: "moonshot",
            modelOverride: "moonshot-v1-128k",
            systemPrompt: request.systemPrompt,
            messages: request.messages,
            temperature: request.temperature ?? 0.3,
            maxTokens: request.maxTokens ?? 2048,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.text) {
            const durationMs = Date.now() - startTime;
            return {
              model: "KIMI_K3",
              provider: "MOONSHOT",
              text: data.text,
              usage: data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
              durationMs: data.latencyMs || durationMs,
              verificationHash:
                data.sha256 || generateVerificationHash(`KIMI_K3:${data.text}:${durationMs}`),
              rawResponse: data,
            };
          }
        }
      } catch {
        // Fall through to deterministic simulation
      }

      const mockRes = await this.fallbackAdapter.complete(request);
      return {
        ...mockRes,
        model: "KIMI_K3",
        provider: "MOONSHOT",
        text: `[Moonshot Kimi K3 MoE Simulation Engine]\n\n${mockRes.text}`,
      };
    }

    const apiKey = process.env["MOONSHOT_API_KEY"];

    if (!apiKey || apiKey === "mock_key") {
      const mockRes = await this.fallbackAdapter.complete(request);
      return {
        ...mockRes,
        model: "KIMI_K3",
        provider: "MOONSHOT",
        text: `[Moonshot Kimi K3 MoE Offline Runner]\n\n${mockRes.text}`,
      };
    }

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
