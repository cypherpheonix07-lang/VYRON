/**
 * PROJECT BRAHMA — CHAT MESSAGE COMPONENT (FL-03-A STEP 1)
 * Renders user and assistant bubbles with Markdown, StreamingText reveal, citation chips, and demo borders.
 */

import React from "react";
import { StreamingText } from "@/components/chatbot/StreamingText";
import { CitationAnchor } from "@/components/chatbot/CitationAnchor";
import { Bot, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Citation {
  label: string;
  source: string;
  sha256: string;
}

export interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean | undefined;
  citations?: Citation[] | undefined;
  mode?: "live" | "demo" | undefined;
  className?: string | undefined;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  isStreaming = false,
  citations = [],
  mode = "live",
  className = "",
}: ChatMessageProps) {
  const isUser = role === "user";
  const isDemo = mode === "demo";

  const timeStr = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex gap-3 py-2.5 ${isUser ? "justify-end" : "justify-start"} ${className}`}
    >
      {!isUser && (
        <div
          className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
            isDemo
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-violet-500/10 border-violet-500/30 text-violet-400"
          }`}
        >
          {isDemo ? <Sparkles className="size-4" /> : <Bot className="size-4" />}
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed space-y-2 shadow-xs ${
          isUser
            ? "bg-violet-600 text-white font-medium rounded-tr-none"
            : isDemo
            ? "bg-zinc-900/90 border border-zinc-800 border-l-3 border-l-amber-500 text-zinc-200 rounded-tl-none"
            : "bg-zinc-900 border border-zinc-800/90 text-zinc-200 rounded-tl-none"
        }`}
      >
        {/* Message Header (for assistant in demo) */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-1 text-[10px] font-mono text-zinc-500">
            <span className={isDemo ? "text-amber-400 font-bold" : "text-violet-400 font-bold"}>
              {isDemo ? "FinLedger Copilot (Demo)" : "Brahma Copilot"}
            </span>
            <span>{timeStr}</span>
          </div>
        )}

        {/* Message Body with Streaming Text Parser */}
        <div className="font-sans break-words whitespace-pre-wrap">
          {isUser ? (
            content
          ) : (
            <StreamingText
              text={content}
              isStreaming={Boolean(isStreaming)}
              speed={isDemo ? 12 : 0}
            />
          )}
        </div>

        {/* Citations block */}
        {citations.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span className="text-zinc-500">Verified Sources:</span>
            {citations.map((c, i) => (
              <CitationAnchor
                key={c.sha256 + i}
                label={c.label}
                source={c.source}
                sha256={c.sha256}
                citationIndex={i + 1}
              />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="size-7 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
          <User className="size-4" />
        </div>
      )}
    </div>
  );
}
