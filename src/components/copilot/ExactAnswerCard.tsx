/**
 * VYRON — EXACT ANSWER CARD COMPONENT (GOD MODE vNEXT)
 * Directives: 180-205, 206-238, 239-267, 440-459
 *
 * Renders assistant response in exact structured order:
 * 1. DIRECT ANSWER (prominent callout, answers question first)
 * 2. USER-SAFE REASONING SUMMARY (collapsible, zero private scratchpad)
 * 3. EVIDENCE (interactive badges opening provenance popover)
 * 4. DETAILED EXPLANATION (responsive to detail level)
 * 5. ASSUMPTIONS & UNCERTAINTIES
 * 6. RECOMMENDED NEXT STEP
 * 7. ACTION / APPROVAL BUTTONS
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Layers,
  Cpu,
  Eye,
  Lock,
} from "lucide-react";
import { ExactAnswerPayload, CopilotAction } from "@/state/copilot/copilotStore";
import { EvidenceProvenancePanel } from "./EvidenceProvenancePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExactAnswerCardProps {
  exactAnswer?: ExactAnswerPayload | undefined;
  fallbackText: string;
  agentName?: string | undefined;
  onExecuteAction?: ((action: CopilotAction) => void) | undefined;
  className?: string | undefined;
}

export function ExactAnswerCard({
  exactAnswer,
  fallbackText,
  agentName,
  onExecuteAction,
  className,
}: ExactAnswerCardProps) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

  if (!exactAnswer) {
    // Graceful fallback for non-exact messages
    return (
      <div className={cn("text-xs leading-relaxed whitespace-pre-wrap", className)}>
        {fallbackText}
      </div>
    );
  }

  const {
    directAnswer,
    reasoningSummary,
    evidenceBadges,
    detailedExplanation,
    assumptions,
    uncertainties,
    recommendedNextStep,
    proposedActions,
  } = exactAnswer;

  return (
    <div className={cn("space-y-3 font-sans text-xs", className)}>
      {/* 1. DIRECT ANSWER */}
      <div className="p-3.5 rounded-xl bg-background/80 border border-primary/30 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
            <Sparkles className="size-3" />
            <span>Direct Answer</span>
            {agentName && (
              <span className="text-muted-foreground font-normal">
                • {agentName}
              </span>
            )}
          </div>
          {reasoningSummary && (
            <Badge
              variant="outline"
              className="text-[9px] font-mono border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
            >
              {Math.round(reasoningSummary.confidence * 100)}% Confidence
            </Badge>
          )}
        </div>
        <p className="text-foreground text-xs leading-relaxed font-medium">
          {directAnswer}
        </p>
      </div>

      {/* 2. USER-SAFE REASONING SUMMARY (Collapsible) */}
      {reasoningSummary && (
        <div className="rounded-xl border border-border/50 bg-secondary/30 overflow-hidden transition-all">
          <button
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {isSummaryExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
              <span className="font-bold">Reasoning Summary</span>
              <span className="text-[10px] text-muted-foreground/70">
                (Checks, Findings & Constraints)
              </span>
            </div>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-background/60 border border-border/40 font-bold">
              User-Safe
            </span>
          </button>

          {isSummaryExpanded && (
            <div className="px-3.5 pb-3.5 pt-1 border-t border-border/40 space-y-2.5 text-[11px] font-mono bg-background/30">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Understood:
                </span>
                <p className="text-foreground/90">{reasoningSummary.understood}</p>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Context Used:
                </span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {reasoningSummary.contextUsed.map((ctx, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/40 text-[10px]"
                    >
                      {ctx}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Validations Checked:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-foreground/80 mt-0.5">
                    {reasoningSummary.checks.map((chk, idx) => (
                      <li key={idx}>{chk}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Derived Findings:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-foreground/80 mt-0.5">
                    {reasoningSummary.findings.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {reasoningSummary.unknown.length > 0 && (
                <div className="p-2 rounded-lg bg-zinc-500/10 border border-zinc-500/20 text-[10px] space-y-0.5">
                  <span className="text-zinc-400 font-bold uppercase block flex items-center gap-1">
                    <HelpCircle className="size-3" />
                    <span>Epistemic Boundaries / Unknowns:</span>
                  </span>
                  {reasoningSummary.unknown.map((unk, idx) => (
                    <p key={idx} className="text-muted-foreground">
                      • {unk}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. EVIDENCE BADGES (Directive 440-459) */}
      {evidenceBadges && evidenceBadges.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground font-bold uppercase">
            <Shield className="size-3 text-emerald-400" />
            <span>Verified Evidence Lineage</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {evidenceBadges.map((evid) => (
              <EvidenceProvenancePanel key={evid.id} evidence={evid} />
            ))}
          </div>
        </div>
      )}

      {/* 4. DETAILED EXPLANATION */}
      {detailedExplanation && (
        <div className="rounded-xl border border-border/40 bg-secondary/20 overflow-hidden">
          <button
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-bold flex items-center gap-1">
              {isDetailsExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
              Detailed Technical Explanation
            </span>
          </button>
          {isDetailsExpanded && (
            <div className="p-3 pt-1 border-t border-border/30 text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans">
              {detailedExplanation}
            </div>
          )}
        </div>
      )}

      {/* 5. ASSUMPTIONS & UNCERTAINTIES */}
      {(assumptions || uncertainties) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
          {assumptions && assumptions.length > 0 && (
            <div className="p-2 rounded-lg bg-secondary/30 border border-border/40">
              <span className="text-muted-foreground font-bold block mb-0.5 uppercase">
                Assumptions:
              </span>
              <ul className="space-y-0.5 text-muted-foreground">
                {assumptions.map((a, idx) => (
                  <li key={idx}>• {a}</li>
                ))}
              </ul>
            </div>
          )}
          {uncertainties && uncertainties.length > 0 && (
            <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <span className="text-amber-400 font-bold block mb-0.5 uppercase flex items-center gap-1">
                <AlertTriangle className="size-2.5" />
                <span>Uncertainties:</span>
              </span>
              <ul className="space-y-0.5 text-amber-300/80">
                {uncertainties.map((u, idx) => (
                  <li key={idx}>• {u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 6. RECOMMENDED NEXT STEP */}
      {recommendedNextStep && (
        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2">
          <ArrowRight className="size-3.5 text-primary mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-primary block">
              Recommended Next Step
            </span>
            <p className="text-xs text-foreground/90 mt-0.5">{recommendedNextStep}</p>
          </div>
        </div>
      )}

      {/* 7. PROPOSED ACTIONS */}
      {proposedActions && proposedActions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {proposedActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onExecuteAction && onExecuteAction(action)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Zap className="size-3 text-primary animate-pulse" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
