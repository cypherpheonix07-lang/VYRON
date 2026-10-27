/**
 * PROJECT VYRON / ATHER — ANSWER EXPLANATION & PROOF PANEL
 * Renders the expandable "How this answer was produced" receipt:
 * - Understood Request Contract
 * - Context Used (with version & scope boundaries)
 * - Actual Model & Fallback Transparency (honest attribution)
 * - Specialist, Skills & Connectors
 * - Genuine Tool Receipts (status, latency, hash)
 * - Critic Checks & Invariants (Critique vs Execution, Injection resistance)
 * - Calibrated Uncertainty
 *
 * Strictly ZERO SQL & ZERO fabricated telemetry.
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Brain,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { HowThisAnswerWasProduced } from "@/services/ather/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AtherExplanationPanelProps {
  receipt?: HowThisAnswerWasProduced | undefined;
}

export function AtherExplanationPanel({ receipt }: AtherExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!receipt) return null;

  return (
    <div className="mt-3 pt-2.5 border-t border-white/[0.08] text-xs">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="h-7 px-2.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 flex items-center gap-1.5 transition-colors"
      >
        <Sparkles className="size-3" />
        <span>How this answer was produced</span>
        {isExpanded ? (
          <ChevronUp className="size-3 ml-1" />
        ) : (
          <ChevronDown className="size-3 ml-1" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-2.5 p-3.5 bg-black/40 border border-white/10 rounded-lg space-y-3 font-sans text-muted-foreground animate-in fade-in-50 duration-150">
          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px]">
                Turn {receipt.turnId.slice(-6)}
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]">
                Specialist: {receipt.selectedSpecialist}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">
                Depth: {receipt.executionDepth}
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(receipt.timestamp).toLocaleTimeString([], { hour12: false })}
            </span>
          </div>

          {/* Understood Objective */}
          <div>
            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
              <Brain className="size-3.5 text-cyan-400" />
              <span>Understood Request</span>
            </div>
            <p className="text-xs text-slate-300 bg-white/[0.02] p-2 rounded border border-white/5 font-mono">
              {receipt.understoodRequest}
            </p>
          </div>

          {/* Model Attribution & Fallback Disclosure */}
          <div>
            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
              <Cpu className="size-3.5 text-emerald-400" />
              <span>Model Execution & Attribution</span>
            </div>
            <div className="p-2 rounded bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span>Actual Provider: <strong className="text-white">{receipt.actualModel}</strong></span>
                <span>Requested: <span className="text-slate-400">{receipt.requestedModel}</span></span>
              </div>
              {receipt.modelFallbackOccurred && (
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-300 flex items-start gap-1.5">
                  <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    <strong>Provider Fallback Disclosed:</strong> {receipt.fallbackReason}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Context Used */}
          {receipt.contextUsed.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Layers className="size-3.5 text-blue-400" />
                <span>Context & Memory Fabric Sources</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {receipt.contextUsed.map((ctx, idx) => (
                  <div key={idx} className="p-2 rounded bg-white/[0.02] border border-white/5 text-[11px] flex items-center justify-between">
                    <span className="truncate text-slate-300">{ctx.source}</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 border-white/10 text-slate-400">
                      {ctx.scope}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critic Checks Performed */}
          {receipt.checksPerformed.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="size-3.5 text-indigo-400" />
                <span>Critic Invariant Checks ({receipt.checksPerformed.length})</span>
              </div>
              <div className="space-y-1">
                {receipt.checksPerformed.map((chk, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border text-[11px] flex items-start gap-2 ${
                      chk.passed
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                        : "bg-red-500/5 border-red-500/20 text-red-300"
                    }`}
                  >
                    {chk.passed ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertTriangle className="size-3.5 shrink-0 text-red-400 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">{chk.checkName}</div>
                      <div className="text-[10px] opacity-80">{chk.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tool Receipts */}
          {receipt.toolReceipts.length > 0 ? (
            <div>
              <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Wrench className="size-3.5 text-amber-400" />
                <span>Operational Tool Receipts ({receipt.toolReceipts.length})</span>
              </div>
              <div className="space-y-1 font-mono text-[10px]">
                {receipt.toolReceipts.map((t) => (
                  <div key={t.id} className="p-2 bg-white/[0.02] border border-white/5 rounded flex items-center justify-between">
                    <span className="text-white font-semibold">{t.toolName}</span>
                    <span className="text-slate-400">{t.durationMs}ms · {t.status}</span>
                    <span className="text-cyan-400">{t.verificationHash.slice(0, 12)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic">
              Zero state-mutating tools dispatched (read-only verification path).
            </div>
          )}

          {/* Uncertainty & Boundaries */}
          {receipt.remainingUncertainty && (
            <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-[11px] flex items-start gap-1.5">
              <Info className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Remaining Uncertainty:</strong> {receipt.remainingUncertainty}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
