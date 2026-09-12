import React from "react";
import { Sparkles, Bot } from "lucide-react";
import { useCopilot } from "@/state/copilot/useCopilot";
import { cn } from "@/lib/utils";

export function CopilotFloatingButton() {
  const { isDrawerOpen, setDrawerOpen, mode } = useCopilot();

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(!isDrawerOpen)}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full font-bold text-xs shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border",
        mode === "DEMO"
          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-400/40 shadow-amber-500/20"
          : "bg-gradient-to-r from-primary via-indigo-500 to-purple-600 text-white border-white/20 shadow-primary/25",
      )}
    >
      <div className="relative">
        <Bot className="size-4" />
        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400" />
      </div>
      <span>{mode === "DEMO" ? "Demo Copilot" : "Brahma Copilot"}</span>
    </button>
  );
}
