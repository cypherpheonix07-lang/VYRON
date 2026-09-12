/**
 * PROJECT BRAHMA — PHASE PROGRESS BAR (FL-01-E STEP 1)
 * Horizontal multi-stage stepper with animated progress bar and elapsed timer.
 */

import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

export type PipelineStage = "Cloning" | "AST Scan" | "Security" | "Gates" | "Complete";

export interface PhaseProgressBarProps {
  currentStage: PipelineStage;
  progressPercent: number;
  stageMessage?: string;
  isRunning?: boolean;
  className?: string;
}

const STAGES: PipelineStage[] = ["Cloning", "AST Scan", "Security", "Gates", "Complete"];

export function PhaseProgressBar({
  currentStage,
  progressPercent,
  stageMessage = "Processing repository analysis...",
  isRunning = true,
  className = "",
}: PhaseProgressBarProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning || currentStage === "Complete") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, currentStage]);

  const currentIndex = STAGES.indexOf(currentStage);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4 ${className}`}>
      {/* Top Header with Stage message and elapsed timer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isRunning && currentStage !== "Complete" && (
            <Loader2 className="size-3.5 text-violet-400 animate-spin" />
          )}
          <span className="font-semibold text-zinc-100">{stageMessage}</span>
        </div>
        <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
          Elapsed: <span className="text-zinc-200">{formatElapsed(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Stepper Dots */}
      <div className="grid grid-cols-5 gap-2 relative">
        {STAGES.map((st, idx) => {
          const isComplete = idx < currentIndex || currentStage === "Complete";
          const isActive = idx === currentIndex && currentStage !== "Complete";

          return (
            <div key={st} className="flex flex-col items-center space-y-1.5">
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isComplete
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                    : isActive
                    ? "bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.6)] animate-pulse"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                }`}
              >
                {isComplete ? <Check className="size-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-mono whitespace-nowrap ${
                  isActive ? "text-violet-400 font-bold" : isComplete ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                {st}
              </span>
            </div>
          );
        })}
      </div>

      {/* Continuous Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.4)]"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
