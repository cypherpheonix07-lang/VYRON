/**
 * PROJECT BRAHMA — CHAT INPUT COMPONENT (FL-03-A STEP 2)
 * Auto-expanding input area with mode-aware suggestion chips, slash command palette, and keyboard shortcuts.
 */

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Sparkles, CornerDownLeft, Paperclip, Terminal } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

const LIVE_SUGGESTIONS = [
  "Summarize my latest scan results",
  "Which gates are failing and why?",
  "Review high security findings",
  "Generate a blueprint for this repository",
];

const DEMO_SUGGESTIONS = [
  "Explain the FinLedger security failures",
  "What does the AST gate failure mean?",
  "Suggest a remediation plan",
  "What is our release gate status?",
];

export function ChatInput({
  onSendMessage,
  isLoading = false,
  className = "",
  placeholder = "Ask about architecture, static analysis, or release gates (Press Enter to send)...",
}: ChatInputProps) {
  const { isDemo } = useDemoMode();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = isDemo ? DEMO_SUGGESTIONS : LIVE_SUGGESTIONS;

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 shrink-0">
          <Sparkles className="size-3 text-violet-400" /> Prompts:
        </span>
        {suggestions.map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => {
              setText(sug);
              textareaRef.current?.focus();
            }}
            className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 text-[11px] transition-colors cursor-pointer shrink-0 font-medium"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 focus-within:border-violet-500/80 focus-within:ring-1 focus-within:ring-violet-500/40 transition-all shadow-inner">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent resize-none border-none outline-none text-xs text-zinc-100 placeholder-zinc-500 max-h-28 pr-12 font-sans"
        />

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900/90 text-[10px] text-zinc-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center gap-1">
              <Terminal className="size-3 text-zinc-400" />
              <span>/analyze, /gates, /blueprint</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              text.trim() && !isLoading
                ? "bg-violet-600 hover:bg-violet-500 text-white"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <span>Send</span>
            <CornerDownLeft className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
