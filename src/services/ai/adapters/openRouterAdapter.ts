/**
 * PROJECT BRAHMA — OPENROUTER CLIENT ADAPTER (SECURED VIA SERVER GATEWAY)
 * Routes exclusively through Brahma AI Gateway 2.0.
 * ZERO API keys in the browser or frontend bundle.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse, AIToolCall } from "../types";
import { generateVerificationHash } from "../cryptoUtils";
import { MockAIAdapter } from "./mockAdapter";
import { AIModelType } from "../../../state/copilot/copilotStore";

export class OpenRouterAdapter implements AIAdapter {
  public id: AIModelType = "OPENROUTER_AUTO";
  public providerName = "OPENROUTER" as const;
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
          providerOverride: "openrouter",
          modelOverride: request.modelOverride || "openai/gpt-4o-mini",
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

        const toolCalls: AIToolCall[] = (data.toolCalls || []).map((tc: any) => ({
          id: tc.id,
          name: tc.function?.name || tc.name,
          arguments: typeof tc.function?.arguments === "string"
            ? JSON.parse(tc.function.arguments)
            : tc.arguments || {},
        }));

        return {
          model: "OPENROUTER_AUTO",
          provider: "OPENROUTER",
          text,
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
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
      console.warn("OpenRouter server gateway call failed; using deterministic fallback.", err);
      const fallbackRes = await this.fallbackAdapter.complete(request);
      return {
        ...fallbackRes,
        model: "OPENROUTER_ROUTER" as any,
        provider: "OPENROUTER" as any,
        text: `[OpenRouter Fallback Engine]\n\n${fallbackRes.text}`,
      };
    }
  }
}
