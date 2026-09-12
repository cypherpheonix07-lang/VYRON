/**
 * PROJECT BRAHMA — CHAT PLUGIN (PHASE B.2)
 * MCP Tool "chat_completion": Live LLM Gateway vs Deterministic Demo Engine.
 * Supports streaming and citation anchoring.
 */

import { PluginTool, PluginContext, ToolResult } from "./types";
import { llmGateway } from "@/services/llmGateway";

interface ChatMessageInput {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

export const chatPluginTool: PluginTool = {
  name: "chat_completion",
  description: "Executes chat completion with contextual grounding, provenance citations, and dual-mode dispatch.",
  inputSchema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        description: "List of conversation messages",
      },
      model: { type: "string", description: "Optional model name override" },
      stream: { type: "boolean", description: "Whether to return streaming output" },
    },
    required: ["messages"],
  },
  handler: async (args: unknown, ctx: PluginContext): Promise<ToolResult> => {
    const { messages } = (args as { messages: ChatMessageInput[]; model?: string; stream?: boolean }) || {};
    const lastUserMsg = messages?.filter((m) => m.role === "user").pop()?.content || "";

    if (ctx.isDemo) {
      if (ctx.demoEngine) {
        const demoRes = ctx.demoEngine.match(lastUserMsg, { projectId: ctx.projectId });
        const contentBlocks: ToolResult["content"] = [
          {
            type: "text",
            value: demoRes.text,
            metadata: {
              intentCategory: demoRes.intentCategory,
              confidence: demoRes.confidence,
              simulated: true,
            },
          },
        ];

        if (demoRes.citations && demoRes.citations.length > 0) {
          demoRes.citations.forEach((c) => {
            contentBlocks.push({
              type: "citation",
              value: `cite:sha256:${c.sha256}`,
              metadata: {
                sha256: c.sha256,
                label: c.label,
                source: c.source,
              },
            });
          });
        }

        if (demoRes.artifacts && demoRes.artifacts.length > 0) {
          demoRes.artifacts.forEach((a) => {
            contentBlocks.push({
              type: "artifact",
              value: a.content,
              metadata: {
                artifactType: a.type,
                title: a.title,
                language: a.language,
              },
            });
          });
        }

        return {
          isError: false,
          content: contentBlocks,
        };
      }

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: `In Demo Mode, I analyze the FinLedger Microservices platform. Ask about our 8 HIGH security vulnerabilities, cyclomatic complexity violations, or release gate status.`,
          },
        ],
      };
    }

    // Live mode: route through LLM Gateway
    try {
      const response = await llmGateway.copilot(
        lastUserMsg,
        { messages },
        ctx.projectId
      );

      if (!response.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              value: `LLM Gateway Error: ${response.error?.message || "Failed to generate response"}`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: "text",
            value: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
            metadata: {
              model: response.model,
              provider: response.provider,
              cost_usd: response.cost_usd,
              latency_ms: response.latency_ms,
            },
          },
          {
            type: "citation",
            value: `cite:sha256:${response.sha256}`,
            metadata: {
              sha256: response.sha256,
              label: `${response.model} Provenance Token`,
              source: `OpenRouter Gateway`,
            },
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", value: `Chat completion error: ${msg}` }],
      };
    }
  },
};
