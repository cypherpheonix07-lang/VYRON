/**
 * PROJECT BRAHMA — BRAHMA CHATBOT FLOATING DRAWER (PHASE N.1)
 * Floating Action Button on all /app/* routes with 400x600px slide-in drawer.
 * Includes Cmd+Shift+K keyboard shortcut, focus trap, and Escape handling.
 */

import React, { useState, useEffect } from "react";
import { MessageSquare, X, Bot, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { ChatShell } from "@/components/chat/ChatShell";
import { Badge } from "@/components/ui/badge";

export function BrahmaChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDemo, demoDomain } = useDemoMode();

  // Cmd+Shift+K toggle shortcut & Escape close
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-full shadow-2xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center ${
            isDemo
              ? "bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
              : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          }`}
          aria-label="Open Brahma AI Copilot (Cmd+Shift+K)"
          title="Open Brahma AI Copilot (Cmd+Shift+K)"
        >
          {isDemo ? <Sparkles className="size-6" /> : <Bot className="size-6" />}
        </button>
      )}

      {/* Slide-in Drawer Container (400px x 600px) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[620px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          <div className="relative h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-zinc-800">
            {/* Drawer Header Toolbar */}
            <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-700/60 transition-colors"
                aria-label="Close Copilot"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Embedded ChatShell */}
            <ChatShell className="h-full rounded-none border-0" />
          </div>
        </div>
      )}
    </>
  );
}
