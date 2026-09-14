import React, { useEffect } from "react";
import { Sparkles, Bot, Activity } from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { analysisStore } from "@/state/analysis/analysisStore";
import { cn } from "@/lib/utils";

export function CopilotFloatingButton() {
  const { isDrawerOpen, setDrawerOpen, mode } = useCopilot();
  const run = analysisStore.getRun();
  const isRunning = run.status === "RUNNING";

  // Global keyboard shortcut: Cmd+Shift+K / Ctrl+Shift+K
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setDrawerOpen(!isDrawerOpen);
      }
      if (e.key === "Escape" && isDrawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(!isDrawerOpen)}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full font-bold text-xs shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border cursor-pointer",
        mode === "DEMO"
          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-400/40 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          : "bg-gradient-to-r from-primary via-indigo-600 to-violet-700 text-white border-white/20 shadow-[0_0_25px_rgba(124,58,237,0.4)]",
      )}
      title="Open Brahma AI Copilot (Cmd+Shift+K)"
      aria-label="Open Brahma AI Copilot (Cmd+Shift+K)"
    >
      <div className="relative flex items-center justify-center">
        {isRunning ? (
          <Activity className="size-4 animate-spin text-amber-200" />
        ) : (
          <Bot className="size-4" />
        )}
        <span
          className={cn(
            "absolute -top-1 -right-1 size-2 rounded-full",
            isRunning ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-ping",
          )}
        />
        <span
          className={cn(
            "absolute -top-1 -right-1 size-2 rounded-full",
            isRunning ? "bg-amber-400" : "bg-emerald-400",
          )}
        />
      </div>
      <span className="font-semibold">{mode === "DEMO" ? "Demo Copilot" : "Brahma Copilot"}</span>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/25 text-white/80 font-mono hidden sm:inline-block">
        ⌘⇧K
      </span>
    </button>
  );
}
