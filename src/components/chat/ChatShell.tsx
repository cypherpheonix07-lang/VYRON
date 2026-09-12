/**
 * PROJECT BRAHMA — CHAT SHELL COMPONENT (FL-03-A STEP 3)
 * Full-page / embedded chat shell switching dynamically between live RAG and demo deterministic engines.
 */

import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatTypingIndicator } from "@/components/chat/ChatTypingIndicator";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useLiveChat } from "@/hooks/useLiveChat";
import { useDemoChat } from "@/hooks/useDemoChat";
import { Bot, Sparkles, Trash2, ShieldCheck, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ChatShellProps {
  projectId?: string;
  className?: string;
}

export function ChatShell({ projectId, className = "" }: ChatShellProps) {
  const { isDemo, demoDomain } = useDemoMode();

  const live = useLiveChat("user_active", projectId);
  const demo = useDemoChat();

  const activeChat = isDemo ? demo : live;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages.length]);

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl ${className}`}
    >
      {/* Shell Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg border ${
              isDemo
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-violet-500/10 border-violet-500/30 text-violet-400"
            }`}
          >
            {isDemo ? <Sparkles className="size-4" /> : <Bot className="size-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100">Brahma Intelligence Copilot</h3>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono ${
                  isDemo
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                }`}
              >
                {isDemo ? `DEMO: ${demoDomain?.toUpperCase() || "FINTECH"}` : "LIVE COPILOT"}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
              {isDemo
                ? "Operating over synthetic FinLedger benchmark"
                : "Grounding responses in Supabase architecture telemetry"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={activeChat.clearMessages}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeChat.messages.map((m) => (
          <ChatMessage
            key={m.id}
            role={m.role}
            content={m.content}
            timestamp={m.timestamp}
            isStreaming={m.isStreaming}
            citations={m.citations}
            mode={isDemo ? "demo" : "live"}
          />
        ))}

        {activeChat.isLoading && <ChatTypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40">
        <ChatInput
          onSendMessage={activeChat.sendMessage}
          isLoading={activeChat.isLoading}
        />
      </div>
    </div>
  );
}
