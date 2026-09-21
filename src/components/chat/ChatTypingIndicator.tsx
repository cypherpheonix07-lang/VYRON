/**
 * PROJECT BRAHMA — CHAT TYPING INDICATOR (FL-03-A)
 * Animated thinking dots shown while streaming or awaiting responses.
 */

import React from "react";
import { Bot, Sparkles } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";

export function ChatTypingIndicator() {
  const { isDemo } = useDemoMode();

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`size-7 rounded-lg flex items-center justify-center shrink-0 border ${
          isDemo
            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-violet-500/10 border-violet-500/30 text-violet-400"
        }`}
      >
        {isDemo ? <Sparkles className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div className="rounded-xl px-3.5 py-2 bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="size-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="size-1.5 rounded-full bg-amber-400 animate-bounce" />
        <span className="text-[11px] font-mono text-zinc-400 ml-1.5">Thinking...</span>
      </div>
    </div>
  );
}
