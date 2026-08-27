import React, { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GateResultData {
  gate_id: number;
  gate_name: string;
  passed: boolean;
  score: number;
  threshold: number;
  evidence: string;
  recommendation?: string | null;
}

export interface GateCardProps {
  gate: GateResultData;
  className?: string;
}

export function GateCard({ gate, className }: GateCardProps) {
  const [expanded, setExpanded] = useState(!gate.passed);

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        gate.passed
          ? "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/30"
          : "border-rose-500/30 bg-rose-950/20 hover:border-rose-500/40",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-mono text-xs font-bold",
              gate.passed
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/30",
            )}
          >
            {gate.gate_id}
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-foreground truncate">{gate.gate_name}</h4>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold",
                  gate.passed
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/30",
                )}
              >
                {gate.passed ? (
                  <CheckCircle2 className="size-2.5" />
                ) : (
                  <XCircle className="size-2.5" />
                )}
                {gate.passed ? "PASS" : "FAIL"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono truncate">{gate.evidence}</p>
          </div>
        </div>

        {gate.recommendation && (
          <button
            onClick={() => setExpanded(!expanded)}
            type="button"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle recommendation"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        )}
      </div>

      {expanded && gate.recommendation && (
        <div className="mt-3 pt-3 border-t border-rose-500/20 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
            <AlertCircle className="size-3 text-rose-400" />
            <span>Remediation Recommendation</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-4">
            {gate.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
