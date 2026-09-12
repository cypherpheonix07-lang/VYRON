import React, { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert } from "lucide-react";
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
  strictness?: "advisory" | "standard" | "strict" | string;
  className?: string;
  onOverrideRequest?: (gateId: number) => void;
}

export function GateCard({ gate, strictness, className, onOverrideRequest }: GateCardProps) {
  const [expanded, setExpanded] = useState(!gate.passed);
  const isHardBlock = !gate.passed && (gate.gate_id === 1 || gate.gate_id === 2);
  const canOverride = !gate.passed && gate.gate_id >= 3 && gate.gate_id <= 7;

  return (
    <div
      className={cn(
        "rounded-[0.75rem] border p-4 transition-all bg-[var(--surface-raised)]",
        gate.passed
          ? "border-[var(--color-success)]/20 hover:border-[var(--color-success)]/40"
          : "border-[var(--color-danger)]/30 hover:border-[var(--color-danger)]/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "size-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-mono text-xs font-bold",
              gate.passed
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20"
                : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/30",
            )}
          >
            {String(gate.gate_id).padStart(2, "0")}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-semibold text-[var(--text-primary)] font-sans">
                {gate.gate_name}
              </h4>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-mono uppercase font-bold tracking-wider",
                  gate.passed
                    ? "bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30"
                    : "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border border-[var(--color-danger)]/30",
                )}
              >
                {gate.passed ? (
                  <Check className="size-3 stroke-[2.5]" />
                ) : (
                  <X className="size-3 stroke-[2.5]" />
                )}
                {gate.passed ? "PASS" : "FAIL"}
              </span>

              {strictness && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-mono uppercase font-bold tracking-wider",
                    strictness === "strict"
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      : strictness === "advisory"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-sky-500/15 text-sky-400 border border-sky-500/30",
                  )}
                >
                  {strictness}
                </span>
              )}

              {isHardBlock && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-mono uppercase font-bold bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/40">
                  <ShieldAlert className="size-3" /> HARD BLOCK — Cannot override
                </span>
              )}
            </div>

            <p className="text-[12px] text-[var(--text-secondary)] font-mono">{gate.evidence}</p>

            {strictness === "advisory" && !gate.passed && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-mono mt-1">
                <AlertTriangle className="size-3.5 shrink-0" />
                <span>Advisory Mode: Non-blocking warning logged. Pipeline execution will not be halted.</span>
              </div>
            )}

            {/* Score vs Threshold horizontal bar */}
            <div className="w-full bg-[var(--surface-sunken)] rounded-[var(--radius-sm)] h-1.5 overflow-hidden mt-2">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  gate.passed ? "bg-[var(--gate-pass)]" : "bg-[var(--gate-fail)]",
                )}
                style={{
                  width: `${Math.min(100, Math.max(10, (gate.score / (gate.threshold || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {canOverride && onOverrideRequest && (
            <button
              onClick={() => onOverrideRequest(gate.gate_id)}
              type="button"
              className="px-2 py-1 rounded-[var(--radius-sm)] text-[11px] font-mono border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Request Override
            </button>
          )}

          {gate.recommendation && (
            <button
              onClick={() => setExpanded(!expanded)}
              type="button"
              className="p-1 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
              aria-label="Toggle recommendation"
            >
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {expanded && gate.recommendation && (
        <div className="mt-3 pt-3 border-t border-[var(--color-warning)]/20 border-l-2 border-l-[var(--color-warning)] pl-3 space-y-1 text-left bg-[var(--color-warning)]/5 rounded-r-[var(--radius-sm)] py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-warning)] font-sans">
            <AlertTriangle className="size-3.5" />
            <span>Remediation Recommendation</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed font-sans">
            {gate.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
