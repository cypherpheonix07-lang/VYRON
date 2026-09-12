/**
 * PROJECT BRAHMA — USE DEMO CHAT HOOK (FL-03-C STEP 3)
 * React hook driving deterministic demo chatbot with character reveal animation.
 */

import { useState, useCallback } from "react";
import { ChatMessage } from "@/lib/chat/liveChatEngine";
import { sendDemoChatMessage } from "@/lib/chat/demoChatEngine";
import { useDemoMode } from "@/contexts/DemoModeContext";

export function useDemoChat() {
  const { demoDomain } = useDemoMode();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-demo",
      role: "assistant",
      content: `Welcome to **PROJECT BRAHMA Demo Mode** [cite:Demo Environment:Synthetic Store:demo001]. I am operating on the **FinLedger Microservices Benchmark**.\n\nYou can ask about our **8 HIGH security findings**, **cyclomatic complexity failures**, **release gate blocks**, or explore the **12 microservice nodes**.`,
      timestamp: new Date(),
      citations: [
        { label: "Demo Environment", source: "Synthetic Store", sha256: "demo001" },
      ],
      mode: "demo",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `demo-user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
        mode: "demo",
      };

      const updated = [...messages, userMsg];
      setMessages(updated);
      setIsLoading(true);

      try {
        const response = await sendDemoChatMessage(updated, demoDomain || "fintech");

        const assistantMsgId = `demo-asst-${Date.now()}`;
        const placeholder: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: response.text,
          timestamp: new Date(),
          isStreaming: false,
          citations: response.citations,
          mode: "demo",
        };

        setMessages([...updated, placeholder]);
      } catch (err: unknown) {
        console.warn("Demo chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, demoDomain]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
