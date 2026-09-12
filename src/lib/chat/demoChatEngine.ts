/**
 * PROJECT BRAHMA — DEMO CHAT ENGINE (FL-03-C STEP 2)
 * Dispatches demo user prompts to DemoResponseEngine with seeded intent resolution.
 */

import { demoEngine, DemoChatResponse } from "@/services/demoEngine";
import { ChatMessage } from "@/lib/chat/liveChatEngine";

export async function sendDemoChatMessage(
  messages: ChatMessage[],
  domain = "fintech"
): Promise<DemoChatResponse> {
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  // Simulate natural latency (150-300ms)
  await new Promise((resolve) => setTimeout(resolve, 200));
  return demoEngine.match(lastUserMsg);
}
