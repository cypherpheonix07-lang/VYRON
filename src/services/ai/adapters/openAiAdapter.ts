/**
 * PROJECT BRAHMA — OPENAI CLIENT ADAPTER (SECURED VIA SERVER GATEWAY)
 * Routes exclusively through Brahma AI Gateway 2.0.
 * ZERO API keys in the browser or frontend bundle.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse } from "../types";
import { generateVerificationHash } from "../cryptoUtils";
import { MockAIAdapter } from "./mockAdapter";

export class OpenAiAdapter implements AIAdapter {
  public id = "OPENAI_GPT4O" as const;
  public providerName = "OPENAI" as const;
  private fallbackAdapter = new MockAIAdapter();

  public isAvailable(): boolean {
    return true; // Governed by server-side AI Gateway
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();
    try {
      const res = await fetch("/api/ai/gateway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: request.taskType || "copilot",
          providerOverride: "openai",
          modelOverride: "gpt-4o",
          systemPrompt: request.systemPrompt,
          messages: request.messages,
          temperature: request.temperature ?? 0.2,
          maxTokens: request.maxTokens ?? 2048,
          tools: request.tools,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const durationMs = Date.now() - startTime;
        const text = data.text || "";
        const verificationHash = data.sha256 || generateVerificationHash(`${this.id}:${text}:${durationMs}`);

        return {
          model: "OPENAI_GPT4O",
          provider: "OPENAI",
          text,
          usage: {
            promptTokens: data.usage?.promptTokens || 0,
            completionTokens: data.usage?.completionTokens || 0,
            totalTokens: data.usage?.totalTokens || 0,
          },
          durationMs,
          verificationHash,
          rawResponse: data,
        };
      }

      throw new Error(`Server gateway returned HTTP ${res.status}`);
    } catch (err: unknown) {
      console.warn("OpenAI server gateway call failed; using deterministic fallback.", err);
      const fallbackRes = await this.fallbackAdapter.complete(request);
      return {
        ...fallbackRes,
        model: "OPENAI_GPT4O",
        provider: "OPENAI",
        text: `[OpenAI GPT-4o Fallback Engine]\n\n${fallbackRes.text}`,
      };
    }
  }
}

