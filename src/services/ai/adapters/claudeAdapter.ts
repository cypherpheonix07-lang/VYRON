/**
 * PROJECT BRAHMA — ANTHROPIC CLAUDE ADAPTER (SECURED VIA SERVER GATEWAY)
 * Routes exclusively through Brahma AI Gateway 2.0 (via OpenRouter or Server Direct).
 * ZERO API keys in the browser or frontend bundle.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse, AIToolCall } from "../types";
import { generateVerificationHash } from "../cryptoUtils";
import { MockAIAdapter } from "./mockAdapter";

export class ClaudeAdapter implements AIAdapter {
  public id = "CLAUDE_SONNET" as const;
  public providerName = "ANTHROPIC" as const;
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
          task: request.taskType || "architecture_review",
          providerOverride: "openrouter",
          modelOverride: "anthropic/claude-3.5-sonnet",
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
          model: "CLAUDE_SONNET",
          provider: "ANTHROPIC",
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
      console.warn("Claude server gateway call failed; using deterministic fallback.", err);
      const fallbackRes = await this.fallbackAdapter.complete(request);
      return {
        ...fallbackRes,
        model: "CLAUDE_SONNET",
        provider: "ANTHROPIC",
        text: `[Anthropic Claude 3.5 Sonnet Fallback Engine]\n\n${fallbackRes.text}`,
      };
    }
  }
}
