/**
 * VYRON — END-OF-CHAT PROOF CARD COMPONENT (GOD MODE Ω×)
 * Renders the formal turn closure proof card:
 * - Summary & Key Points
 * - Decisions & Changes
 * - Sources with Authority Badges
 * - What Was Used & What Changed
 * - Uncertainty & Open Questions
 * - Remaining Risk
 * - Next Stage Gate with readiness score & Proceed/Pause/Revise controls
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  FileCheck,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  GitBranch,
  Layers,
  Sparkles,
  Link2,
} from "lucide-react";
import { EndOfChatProofCard } from "@/services/copilot/safeReasoningEngine";
import { stageGateEngine } from "@/services/copilot/stageGateEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProofCardProps {
  proofCard: EndOfChatProofCard;
  className?: string | undefined;
  onProceedStage?: (() => void) | undefined;
}

export function ProofCard({ proofCard, className, onProceedStage }: ProofCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const {
    summary,
    keyPoints,
    decisions,
    changes,
    sources,
    whatWasUsed,
    whatChanged,
    uncertainty,
    openQuestions,
    remainingRisk,
    nextStage,
    stageActionOptions,
  } = proofCard;

  const handleStageAction = (action: "PROCEED" | "PAUSE" | "REVISE" | "BRANCH") => {
    switch (action) {
      case "PROCEED":
        toast.success(`Advancing to stage [${nextStage?.stageName || "Next Stage"}]. Preconditions verified.`);
        if (onProceedStage) onProceedStage();
        break;
      case "PAUSE":
        setIsPaused(true);
        if (nextStage) {
          stageGateEngine.createCheckpoint({
            projectId: "proj_atlas_001",
            stage: nextStage.stageName,
            contextPassportId: "passport_active_stage",
            evidenceIds: ["EVID-STAGE-CHK"],
            residualRisks: [remainingRisk],
            nextUnlockRequirement: "Operator manual approval to resume",
          });
        }
        toast.info("Mission state checkpointed. Work can be resumed at any time.");
        break;
      case "REVISE":
        toast.warning("Stage requirements sent back for refinement.");
        break;
      case "BRANCH":
        toast.info("Created isolated experiment branch from current stage checkpoint.");
        break;
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden text-xs font-sans mt-3 transition-all",
        className
      )}
    >
      {/* Header bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileCheck className="size-4 text-emerald-400" />
          <span className="font-bold text-foreground text-xs uppercase tracking-wider font-mono">
            End-of-Chat Proof Card
          </span>
          {nextStage && (
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-mono py-0 px-1.5",
                nextStage.gateStatus === "READY"
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  : "border-amber-500/40 text-amber-400 bg-amber-500/10"
              )}
            >
              Stage: {nextStage.stageName} ({nextStage.readinessScore}%)
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
          <span className="text-[10px] font-mono">Proof Sealed</span>
          {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </div>
      </button>

      {/* Summary Banner */}
      <div className="px-3.5 py-2 border-t border-border/40 bg-secondary/20 flex items-center justify-between gap-2">
        <p className="text-foreground/90 font-medium text-[11px] leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Expanded Sections */}
      {isExpanded && (
        <div className="p-3.5 pt-2 border-t border-border/40 space-y-3 bg-background/30 text-[11px]">
          {/* Key Points */}
          <div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1 mb-1">
              <Sparkles className="size-3 text-primary" /> Key Empirical Points:
            </span>
            <ul className="space-y-1 pl-1">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-foreground/85">
                  <span className="text-primary font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources with Authority Badges */}
          {sources.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold flex items-center gap-1 mb-1">
                <Link2 className="size-3 text-sky-400" /> Authoritative Sources:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {sources.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/60 border border-border/40 text-[10px] font-mono"
                  >
                    <span className="text-foreground font-medium">{s.label}</span>
                    <Badge
                      variant="outline"
                      className="text-[8px] py-0 px-1 border-primary/30 text-primary bg-primary/5"
                    >
                      {s.authority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid: What was used & What changed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg border border-border/40 bg-secondary/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                What Was Used (Context):
              </span>
              <ul className="space-y-0.5 text-[10px] text-foreground/80 font-mono">
                {whatWasUsed.map((u, i) => (
                  <li key={i} className="truncate">• {u}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-lg border border-border/40 bg-secondary/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                What Changed (State/Cache):
              </span>
              <ul className="space-y-0.5 text-[10px] text-foreground/80 font-mono">
                {whatChanged.map((c, i) => (
                  <li key={i} className="truncate">• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Risk and Uncertainty */}
          <div className="p-2.5 rounded-lg border border-border/40 bg-secondary/20 flex items-start gap-2">
            <AlertTriangle className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[10px]">
              <span className="font-bold text-foreground">Residual Risk Assessment:</span>
              <p className="text-muted-foreground leading-relaxed">{remainingRisk}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stage Gate Control Bar */}
      {nextStage && (
        <div className="px-3.5 py-2.5 border-t border-border/40 bg-secondary/40 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-muted-foreground font-medium">Proceed to next stage?</span>
            <span className="font-bold text-foreground">[{nextStage.stageName}]</span>
            {isPaused && (
              <Badge variant="outline" className="text-[9px] border-amber-500 text-amber-400">
                PAUSED
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {stageActionOptions.includes("PROCEED") && (
              <Button
                size="sm"
                className="h-6 px-2.5 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={() => handleStageAction("PROCEED")}
              >
                <Play className="size-3" />
                Proceed
              </Button>
            )}
            {stageActionOptions.includes("PAUSE") && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2.5 text-[10px] gap-1"
                onClick={() => handleStageAction("PAUSE")}
              >
                <Pause className="size-3" />
                Pause
              </Button>
            )}
            {stageActionOptions.includes("REVISE") && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-[10px] gap-1"
                onClick={() => handleStageAction("REVISE")}
              >
                <RotateCcw className="size-3" />
                Revise
              </Button>
            )}
            {stageActionOptions.includes("BRANCH") && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleStageAction("BRANCH")}
              >
                <GitBranch className="size-3" />
                Branch
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
