/**
 * PROJECT BRAHMA — LIVE GATE CARD (FL-01-E STEP 2)
 * Real-time architectural gate card supporting pending, running, passed, and failed live states.
 */

import React, { useState } from "react";
import { Check, X, Loader2, Lock, ChevronDown, ChevronUp, AlertOctagon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type LiveGateStatus = "pending" | "running" | "passed" | "failed";

export interface LiveGateCardProps {
  gateName: string;
  status: LiveGateStatus;
  score: number | null;
  threshold: number;
  evidence: string | null;
  className?: string;
}

export function LiveGateCard({
  gateName,
  status,
  score,
  threshold,
  evidence,
  className = "",
}: LiveGateCardProps) {
  const [expanded, setExpanded] = useState(status === "failed");

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        status === "passed"
          ? "bg-emerald-950/20 border-emerald-500/50 shadow-xs"
          : status === "failed"
          ? "bg-rose-950/25 border-rose-500/60 shadow-xs"
          : status === "running"
          ? "bg-violet-950/20 border-violet-500/60 shadow-[0_0_12px_rgba(139,92,246,0.2)] animate-pulse"
          : "bg-zinc-950/60 border-zinc-800/80 opacity-60"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`size-6 rounded-md flex items-center justify-center text-xs shrink-0 ${
              status === "passed"
                ? "bg-emerald-500/20 text-emerald-400"
                : status === "failed"
                ? "bg-rose-500/20 text-rose-400"
                : status === "running"
                ? "bg-violet-500/20 text-violet-400"
                : "bg-zinc-900 text-zinc-600"
            }`}
          >
            {status === "passed" && <Check className="size-3.5 stroke-[3]" />}
            {status === "failed" && <X className="size-3.5 stroke-[3]" />}
            {status === "running" && <Loader2 className="size-3.5 animate-spin" />}
            {status === "pending" && <Lock className="size-3" />}
          </div>

          <span className="text-xs font-semibold text-zinc-100 truncate">{gateName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {score !== null ? (
            <span className="text-[11px] font-mono font-bold text-zinc-200">
              {score} / {threshold}
            </span>
          ) : (
            <span className="text-[11px] font-mono text-zinc-500">Pending</span>
          )}

          <Badge
            variant="outline"
            className={`text-[10px] capitalize ${
              status === "passed"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : status === "failed"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : status === "running"
                ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                : "bg-zinc-800 text-zinc-500 border-zinc-700"
            }`}
          >
            {status}
          </Badge>

          {evidence && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-zinc-400 hover:text-zinc-200 p-0.5"
              aria-label="Toggle gate evidence"
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          )}
        </div>
      </div>

      {expanded && evidence && (
        <div className="mt-2.5 pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-300 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <AlertOctagon className="size-3" />
            <span>Gate Evidence:</span>
          </div>
          <p className="text-zinc-400 pl-4.5">{evidence}</p>
        </div>
      )}
    </div>
  );
}
