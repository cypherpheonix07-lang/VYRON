/**
 * VYRON / ATHER — NATURAL CONVERSATION & EXACT ANSWER CARD
 * Implements Workstream B, J, and K:
 * 1. Direct answer presented cleanly first without heavy visual noise or mandatory labels.
 * 2. Progressive disclosure for deeper technical views:
 *    - Sources & Evidence (expandable)
 *    - Why this recommendation? (expandable)
 *    - What was checked? (expandable)
 *    - Technical Details (expandable)
 * 3. Natural conversational flow for simple and mixed queries.
 * 4. Context Lens & Time Machine available under progressive disclosure.
 * 5. Strictly ZERO SQL.
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
  History,
  Radar,
  FileText,
  Info,
} from "lucide-react";
import { ExactAnswerPayload, CopilotAction, copilotStore } from "@/state/copilot/copilotStore";
import { EvidenceProvenancePanel } from "./EvidenceProvenancePanel";
import { AutoReferenceCard } from "./AutoReferenceCard";
import { ProofCard } from "./ProofCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExactAnswerCardProps {
  exactAnswer?: ExactAnswerPayload | undefined;
  fallbackText: string;
  agentName?: string | undefined;
  autoReferences?: import("@/services/copilot/historyRetrieval").AutoReferenceExplanation[] | undefined;
  proofCard?: import("@/services/copilot/safeReasoningEngine").EndOfChatProofCard | undefined;
  contextPassport?: import("@/services/copilot/contextMesh").ContextPassport | undefined;
  intentCapsule?: import("@/services/copilot/questionUnderstanding").IntentCapsule | undefined;
  onExecuteAction?: ((action: CopilotAction) => void) | undefined;
  className?: string | undefined;
}

export function ExactAnswerCard({
  exactAnswer,
  fallbackText,
  agentName,
  autoReferences,
  proofCard,
  contextPassport,
  intentCapsule,
  onExecuteAction,
  className,
}: ExactAnswerCardProps) {
  const [activeTab, setActiveTab] = useState<"none" | "sources" | "why" | "checks" | "details">("none");

  const toggleTab = (tab: "sources" | "why" | "checks" | "details") => {
    setActiveTab((current) => (current === tab ? "none" : tab));
  };

  const textToRender = exactAnswer?.directAnswer || fallbackText;
  const reasoningSummary = exactAnswer?.reasoningSummary;
  const evidenceBadges = exactAnswer?.evidenceBadges;
  const detailedExplanation = exactAnswer?.detailedExplanation;
  const assumptions = exactAnswer?.assumptions;
  const uncertainties = exactAnswer?.uncertainties;
  const recommendedNextStep = exactAnswer?.recommendedNextStep;
  const proposedActions = exactAnswer?.proposedActions;

  const hasSources = (evidenceBadges && evidenceBadges.length > 0) || (contextPassport?.items && contextPassport.items.length > 0);
  const hasWhy = Boolean(reasoningSummary?.understood || reasoningSummary?.conclusion || (assumptions && assumptions.length > 0));
  const hasChecks = Boolean(reasoningSummary?.checks && reasoningSummary.checks.length > 0);
  const hasDetails = Boolean(detailedExplanation && detailedExplanation.trim() && detailedExplanation !== textToRender);

  return (
    <div className={cn("space-y-3 font-sans text-xs leading-relaxed", className)}>
      {/* 0. AUTO-REFERENCE BADGE (if relevant) */}
      {autoReferences && autoReferences.length > 0 && (
        <AutoReferenceCard autoReferences={autoReferences} />
      )}

      {/* 1. PRIMARY ANSWER: Clean, direct, conversational */}
      <div className="text-foreground whitespace-pre-wrap font-normal text-xs leading-relaxed selection:bg-primary/20">
        {textToRender}
      </div>

      {/* 2. PROGRESSIVE DISCLOSURE TOOLBAR: Clean and unobtrusive */}
      {(hasSources || hasWhy || hasChecks || hasDetails || contextPassport) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/30 text-[11px] font-mono">
          {hasSources && (
            <button
              onClick={() => toggleTab("sources")}
              className={cn(
                "px-2 py-0.5 rounded-md border text-[10px] flex items-center gap-1 transition-colors cursor-pointer",
                activeTab === "sources"
                  ? "bg-primary/15 border-primary/40 text-primary font-bold"
                  : "bg-secondary/40 hover:bg-secondary/70 border-border/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Shield className="size-2.5 text-emerald-400" />
              <span>Sources {evidenceBadges?.length ? `(${evidenceBadges.length})` : ""}</span>
              {activeTab === "sources" ? <ChevronDown className="size-2.5" /> : <ChevronRight className="size-2.5" />}
            </button>
          )}

          {hasWhy && (
            <button
              onClick={() => toggleTab("why")}
              className={cn(
                "px-2 py-0.5 rounded-md border text-[10px] flex items-center gap-1 transition-colors cursor-pointer",
                activeTab === "why"
                  ? "bg-primary/15 border-primary/40 text-primary font-bold"
                  : "bg-secondary/40 hover:bg-secondary/70 border-border/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Info className="size-2.5 text-sky-400" />
              <span>Why this recommendation?</span>
              {activeTab === "why" ? <ChevronDown className="size-2.5" /> : <ChevronRight className="size-2.5" />}
            </button>
          )}

          {hasChecks && (
            <button
              onClick={() => toggleTab("checks")}
              className={cn(
                "px-2 py-0.5 rounded-md border text-[10px] flex items-center gap-1 transition-colors cursor-pointer",
                activeTab === "checks"
                  ? "bg-primary/15 border-primary/40 text-primary font-bold"
                  : "bg-secondary/40 hover:bg-secondary/70 border-border/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <CheckCircle2 className="size-2.5 text-emerald-400" />
              <span>What was checked?</span>
              {activeTab === "checks" ? <ChevronDown className="size-2.5" /> : <ChevronRight className="size-2.5" />}
            </button>
          )}

          {hasDetails && (
            <button
              onClick={() => toggleTab("details")}
              className={cn(
                "px-2 py-0.5 rounded-md border text-[10px] flex items-center gap-1 transition-colors cursor-pointer",
                activeTab === "details"
                  ? "bg-primary/15 border-primary/40 text-primary font-bold"
                  : "bg-secondary/40 hover:bg-secondary/70 border-border/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <FileText className="size-2.5 text-muted-foreground" />
              <span>Technical Details</span>
              {activeTab === "details" ? <ChevronDown className="size-2.5" /> : <ChevronRight className="size-2.5" />}
            </button>
          )}

          {/* Quick Context & Time Machine access */}
          <div className="ml-auto flex items-center gap-1 text-[10px]">
            {contextPassport && (
              <button
                onClick={() => copilotStore.setContextLensOpen(true, contextPassport)}
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-secondary/60 cursor-pointer"
                title="Inspect Context Mesh"
              >
                <Radar className="size-2.5 text-primary" />
                <span>Lens</span>
              </button>
            )}
            <button
              onClick={() => copilotStore.setTimeMachineOpen(true)}
              className="text-[10px] text-muted-foreground hover:text-sky-400 transition-colors flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-secondary/60 cursor-pointer"
              title="Open Conversation History"
            >
              <History className="size-2.5 text-sky-400" />
              <span>History</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. EXPANDABLE SECTION: Sources & Evidence */}
      {activeTab === "sources" && (
        <div className="p-3 rounded-xl bg-background/50 border border-border/50 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground font-bold uppercase">
            <Shield className="size-3 text-emerald-400" />
            <span>Verified Sources & Evidence</span>
          </div>
          {evidenceBadges && evidenceBadges.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {evidenceBadges.map((evid) => (
                <EvidenceProvenancePanel key={evid.id} evidence={evid} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-[11px]">
              Grounded in active workspace state: {contextPassport?.project?.name || "Active Project"}.
            </p>
          )}
        </div>
      )}

      {/* 4. EXPANDABLE SECTION: Why this recommendation? */}
      {activeTab === "why" && reasoningSummary && (
        <div className="p-3 rounded-xl bg-background/50 border border-border/50 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground font-bold uppercase">
            <Info className="size-3 text-sky-400" />
            <span>Rationale & Findings</span>
          </div>
          {reasoningSummary.understood && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Understood Goal:</span>
              <p className="text-foreground/90 text-xs">{reasoningSummary.understood}</p>
            </div>
          )}
          {reasoningSummary.findings && reasoningSummary.findings.length > 0 && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Observations:</span>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-foreground/80 mt-0.5">
                {reasoningSummary.findings.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {assumptions && assumptions.length > 0 && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Assumptions:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground mt-0.5">
                {assumptions.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {uncertainties && uncertainties.length > 0 && (
            <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] space-y-0.5">
              <span className="text-amber-400 font-bold block flex items-center gap-1">
                <AlertTriangle className="size-2.5" />
                <span>Uncertainties / Missing Evidence:</span>
              </span>
              {uncertainties.map((u, idx) => (
                <p key={idx} className="text-amber-300/80">• {u}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. EXPANDABLE SECTION: What was checked? */}
      {activeTab === "checks" && reasoningSummary?.checks && (
        <div className="p-3 rounded-xl bg-background/50 border border-border/50 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground font-bold uppercase">
            <CheckCircle2 className="size-3 text-emerald-400" />
            <span>Validations Evaluated</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80">
            {reasoningSummary.checks.map((chk, idx) => (
              <li key={idx}>{chk}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. EXPANDABLE SECTION: Technical Details */}
      {activeTab === "details" && detailedExplanation && (
        <div className="p-3 rounded-xl bg-background/50 border border-border/50 space-y-1.5 text-xs leading-relaxed whitespace-pre-wrap">
          {detailedExplanation}
        </div>
      )}

      {/* 7. RECOMMENDED NEXT STEP (Prominent only when provided) */}
      {recommendedNextStep && (
        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2">
          <ArrowRight className="size-3.5 text-primary mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-primary block">
              Suggested Next Step
            </span>
            <p className="text-xs text-foreground/90 mt-0.5">{recommendedNextStep}</p>
          </div>
        </div>
      )}

      {/* 8. PROPOSED ACTIONS / ACTION PILLS */}
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

      {/* 9. PROOF CARD (Only for formal consequential / release readiness evaluations) */}
      {proofCard && proofCard.nextStage?.isConsequential && (
        <ProofCard proofCard={proofCard} />
      )}
    </div>
  );
}
