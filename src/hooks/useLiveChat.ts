/**
 * PROJECT BRAHMA — USE LIVE CHAT HOOK (FL-03-B STEP 3)
 * React hook managing message threads, LLM streaming, and citation anchoring in live mode.
 */

import { useState, useCallback } from "react";
import { ChatMessage, sendLiveChatMessage } from "@/lib/chat/liveChatEngine";
import { toast } from "sonner";

export function useLiveChat(userId = "user_default", projectId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-live",
      role: "assistant",
      content:
        "Hello! I am your **PROJECT BRAHMA Intelligence Copilot**. I have access to your active project codebase, architecture models, static scan findings, and release gate metrics. How can I assist you today?",
      timestamp: new Date(),
      mode: "live",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
        mode: "live",
      };

      const updated = [...messages, userMsg];
      setMessages(updated);
      setIsLoading(true);

      try {
        const assistantPlaceholder: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
          mode: "live",
        };
        setMessages([...updated, assistantPlaceholder]);

        const result = await sendLiveChatMessage(updated, userId, projectId);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantPlaceholder.id
              ? {
                  ...m,
                  content: result.text,
                  isStreaming: false,
                  citations: [{ label: "Live Copilot", source: "LLM Gateway", sha256: result.sha256 }],
                }
              : m
          )
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(`Live chat error: ${msg}`);
        setMessages((prev) =>
          prev.map((m) =>
            m.isStreaming
              ? {
                  ...m,
                  content: `Failed to receive live response: ${msg}. Try asking again.`,
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, userId, projectId]
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
