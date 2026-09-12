/**
 * PROJECT BRAHMA — THINKING TRACE VISUALIZATION (PHASE F.1, F.2, F.3, F.4)
 * Deep Research Chain Timeline displaying granular reasoning and stage execution.
 * Maps directly to analysis_stages contracts. Always visible for analysis tasks.
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Brain,
} from "lucide-react";

export interface ThinkingStep {
  id: string;
  label: string;
  status: "pending" | "running" | "complete" | "failed";
  duration_ms: number;
  output_summary: string;
}

export interface ThinkingTraceProps {
  steps: ThinkingStep[];
  isExpanded?: boolean;
  className?: string;
}

export function ThinkingTrace({
  steps = [],
  isExpanded: initialExpanded = false,
  className = "",
}: ThinkingTraceProps) {
  const [isOpen, setIsOpen] = useState(initialExpanded);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  if (!steps || steps.length === 0) return null;

  const totalDuration = steps.reduce((sum, s) => sum + (s.duration_ms || 0), 0);
  const completedCount = steps.filter((s) => s.status === "complete").length;
  const isRunning = steps.some((s) => s.status === "running");

  const getStepIcon = (status: ThinkingStep["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />;
      case "running":
        return <Loader2 className="size-3.5 text-cyan-400 animate-spin shrink-0" />;
      case "failed":
        return <AlertCircle className="size-3.5 text-rose-400 shrink-0" />;
      default:
        return <Clock className="size-3.5 text-zinc-600 shrink-0" />;
    }
  };

  const toggleStep = (id: string) => {
    setExpandedStepId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`my-2.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 overflow-hidden text-xs ${className}`}
    >
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900/60 hover:bg-zinc-900/90 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Brain className={`size-3.5 ${isRunning ? "text-cyan-400 animate-pulse" : "text-violet-400"}`} />
          <span className="font-medium text-zinc-200">
            Thinking Process ({completedCount}/{steps.length} steps)
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span>{totalDuration > 0 ? `${totalDuration}ms` : "Live"}</span>
          {isOpen ? <ChevronDown className="size-3.5 text-zinc-400" /> : <ChevronRight className="size-3.5 text-zinc-400" />}
        </div>
      </button>

      {/* Timeline Steps */}
      {isOpen && (
        <div className="p-3 space-y-2 border-t border-zinc-800/60">
          {steps.map((step, idx) => {
            const isStepExpanded = expandedStepId === step.id;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.id} className="relative pl-5">
                {/* Vertical line indicator */}
                {!isLast && (
                  <div className="absolute left-[7px] top-4 bottom-[-8px] w-0.5 bg-zinc-800" />
                )}

                {/* Step indicator */}
                <div className="absolute left-0 top-0.5">{getStepIcon(step.status)}</div>

                {/* Step Content */}
                <div className="space-y-1">
                  <div
                    onClick={() => toggleStep(step.id)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span
                      className={`font-medium transition-colors ${
                        step.status === "running"
                          ? "text-cyan-300 font-semibold"
                          : step.status === "failed"
                          ? "text-rose-400"
                          : "text-zinc-300 group-hover:text-zinc-100"
                      }`}
                    >
                      {step.label}
                    </span>

                    <span className="font-mono text-[10px] text-zinc-500">
                      {step.duration_ms > 0 ? `${step.duration_ms}ms` : ""}
                    </span>
                  </div>

                  {step.output_summary && (
                    <div
                      className={`text-[11px] font-mono text-zinc-400 bg-zinc-900/60 p-2 rounded border border-zinc-800/40 leading-relaxed ${
                        isStepExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {step.output_summary}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
