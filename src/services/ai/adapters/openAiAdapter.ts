/**
 * PROJECT BRAHMA — OPENAI GPT-4O ADAPTER
 * Connects to OpenAI API for structured schema extraction and high-speed classification.
 * Falls back to deterministic simulation if API key is not configured.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse } from "../types";
import { generateVerificationHash } from "../cryptoUtils";
import { MockAIAdapter } from "./mockAdapter";

export class OpenAiAdapter implements AIAdapter {
  public id = "OPENAI_GPT4O" as const;
  public providerName = "OPENAI" as const;
  private fallbackAdapter = new MockAIAdapter();

  public isAvailable(): boolean {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const apiKey =
      typeof window !== "undefined"
        ? metaEnv?.["VITE_OPENAI_API_KEY"]
        : process.env["VITE_OPENAI_API_KEY"];
    return Boolean(apiKey && apiKey.length > 5);
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const apiKey =
      typeof window !== "undefined"
        ? metaEnv?.["VITE_OPENAI_API_KEY"]
        : process.env["VITE_OPENAI_API_KEY"];

    if (!apiKey || apiKey === "mock_key") {
      const mockRes = await this.fallbackAdapter.complete(request);
      return {
        ...mockRes,
        model: "OPENAI_GPT4O",
        provider: "OPENAI",
        text: `[OpenAI GPT-4o Structured Pipeline]\n\n${mockRes.text}`,
      };
    }

    const startTime = Date.now();
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                request.systemPrompt ||
                "You are an analytical assistant generating structured analysis.",
            },
            ...request.messages,
          ],
          temperature: request.temperature ?? 0.2,
          max_tokens: request.maxTokens ?? 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const durationMs = Date.now() - startTime;
      const text = data.choices?.[0]?.message?.content || "";

      const hashPayload = `${this.id}:${text}:${durationMs}`;
      const verificationHash = generateVerificationHash(hashPayload);

      return {
        model: "OPENAI_GPT4O",
        provider: "OPENAI",
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
      console.warn("OpenAI API call failed; falling back to deterministic execution engine.", err);
      const fallbackRes = await this.fallbackAdapter.complete(request);
      return {
        ...fallbackRes,
        model: "OPENAI_GPT4O",
        provider: "OPENAI",
        text: `[OpenAI GPT-4o Offline Runner]\n\n${fallbackRes.text}`,
      };
    }
  }
}
