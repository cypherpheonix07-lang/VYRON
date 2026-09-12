/**
 * PROJECT BRAHMA — LIVE CHAT ENGINE (FL-03-B STEP 2)
 * Sends user queries to llmGateway with grounded project context and handles streaming responses.
 */

import { llmGateway } from "@/services/llmGateway";
import { buildLiveChatContext } from "@/lib/chat/liveContextBuilder";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean | undefined;
  citations?: { label: string; source: string; sha256: string }[] | undefined;
  mode?: "live" | "demo" | undefined;
}

export async function sendLiveChatMessage(
  messages: ChatMessage[],
  userId: string,
  projectId?: string
): Promise<{ text: string; sha256: string }> {
  const context = await buildLiveChatContext(userId, projectId);
  const lastUserMsg = messages[messages.length - 1]?.content || "";

  const response = await llmGateway.copilot(
    lastUserMsg,
    {
      systemPrompt: context.systemPrompt,
      history: messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
    },
    projectId
  );

  if (!response.ok || !response.content) {
    throw new Error(response.error?.message || "Failed to generate LLM response");
  }

  const text =
    typeof response.content === "string"
      ? response.content
      : (response.content as any).response || JSON.stringify(response.content);

  return {
    text,
    sha256: response.sha256,
  };
}
