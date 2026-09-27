/**
 * VYRON — CONVERSATION TIME MACHINE MODAL (GOD MODE Ω×)
 * Implements full 9-lens historical timeline exploration:
 * 1. Chronological Timeline
 * 2. Prompt-Based Lineage
 * 3. Picture Intelligence
 * 4. Numerical Calculation Metrics
 * 5. Engineering Lifecycle Progression
 * 6. Resources & Provenance
 * 7. Tools & Activity Traces
 * 8. Decisions & Approvals Ledger
 * 9. Code & State Changes
 * Plus Turn Inspector and Live Replay Lab with Forensic Divergence Detection.
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  History,
  Clock,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Calculator,
  Compass,
  Link2,
  Cpu,
  FileCheck,
  GitBranch,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  Shield,
} from "lucide-react";
import {
  conversationTimeMachine,
  TimeMachineViewLens,
  ImmutableTurnRecord,
  ReplayDivergenceReport,
} from "@/services/copilot/conversationTimeMachine";
import { contextMesh, ContextPassport } from "@/services/copilot/contextMesh";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ConversationTimeMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContextPassport?: ContextPassport | undefined;
}

export function ConversationTimeMachineModal({
  isOpen,
  onClose,
  activeContextPassport,
}: ConversationTimeMachineModalProps) {
  const [activeLens, setActiveLens] = useState<TimeMachineViewLens>("CHRONOLOGICAL");
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null);
  const [divergenceReport, setDivergenceReport] = useState<ReplayDivergenceReport | null>(null);

  const turns = conversationTimeMachine.listAllTurns();
  const selectedTurn = selectedTurnId ? conversationTimeMachine.getTurn(selectedTurnId) : turns[0];
  const viewData = conversationTimeMachine.queryView(activeLens);

  const handleRunReplay = (turnId: string) => {
    const currentPassport =
      activeContextPassport ||
      contextMesh.replayPassport("passport_sample_01") ||
      contextMesh.assembleMesh("Live context probe", {
        id: "probe_replay",
        rawQuery: "Live probe",
        normalizedQuery: "probe",
        timestamp: new Date().toISOString(),
        primaryQuestionType: "ANALYSIS",
        secondaryQuestionTypes: [],
        confidenceScores: {} as any,
        goal: "Probe active context",
        entities: [],
        constraints: [],
        scope: "PROJECT",
        desiredOutput: "EXPLANATION",
        urgency: "LOW",
        risk: "LOW",
        missingInputs: [],
        lifecycleStage: "ARCHITECTURE",
        ambiguityScore: 0,
        alternateInterpretations: [],
        candidateAction: "PROBE",
        clarificationNeed: false,
        isConsequential: false,
      });

    const report = conversationTimeMachine.replayTurnAgainstLiveContext(turnId, currentPassport);
    if (report) {
      setDivergenceReport(report);
      toast.info(`Forensic Replay Complete: Divergence Score ${report.divergenceScore}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/80 shadow-2xl flex flex-col font-sans">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border/60 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <History className="size-4 animate-spin-slow" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                  <span>CONVERSATION TIME MACHINE & 9-VIEW HISTORICAL LEDGER</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-sky-500/30 text-sky-400 bg-sky-500/5">
                    GOD MODE Ω×
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground mt-0.5">
                  Reconstruct and replay prior project knowledge safely across 9 specialized engineering lenses.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span>Recorded Turns: <strong className="text-foreground">{turns.length}</strong></span>
            </div>
          </div>
        </DialogHeader>

        {/* 9-Lens Navigation Tabs */}
        <div className="px-4 border-b border-border/40 bg-secondary/15 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1 py-1.5 min-w-max">
            {(
              [
                { id: "CHRONOLOGICAL", label: "Chronological", icon: Clock },
                { id: "PROMPT_BASED", label: "Prompt Lineage", icon: Sparkles },
                { id: "PICTURE_BASED", label: "Picture Intelligence", icon: ImageIcon },
                { id: "NUMERICAL", label: "Numerical Metrics", icon: Calculator },
                { id: "ENGINEERING_LIFECYCLE", label: "Lifecycle Stages", icon: Compass },
                { id: "RESOURCES", label: "Resource Trail", icon: Link2 },
                { id: "TOOLS_ACTIVITY", label: "Tools & Activity", icon: Cpu },
                { id: "DECISIONS", label: "Decisions Ledger", icon: FileCheck },
                { id: "CHANGES", label: "Code Changes", icon: GitBranch },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveLens(item.id);
                    setDivergenceReport(null);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 transition-colors",
                    activeLens === item.id
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  <Icon className="size-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area: Split View (List + Inspector/Replay) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Filtered List */}
          <div className="w-1/2 border-r border-border/50 flex flex-col overflow-hidden bg-background/50">
            <div className="p-2.5 border-b border-border/40 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
              <span>{activeLens} View ({viewData.length} records)</span>
              <span>Click to inspect</span>
            </div>

            <ScrollArea className="flex-1 p-3 space-y-2">
              {viewData.map((item: any, idx: number) => {
                const isSelected = selectedTurn?.turnId === item.turnId;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.turnId) setSelectedTurnId(item.turnId);
                    }}
                    className={cn(
                      "p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-1.5 mb-2",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/50 bg-secondary/20 hover:bg-secondary/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bold text-foreground truncate max-w-[200px]">
                        {item.userQuery || item.prompt || item.name || item.metricName || item.label || item.toolName || item.decision || "Historical Record"}
                      </span>
                      {item.stage && (
                        <Badge variant="outline" className="text-[8px] font-mono py-0 px-1 border-primary/30 text-primary">
                          {item.stage}
                        </Badge>
                      )}
                    </div>

                    <div className="text-[10px] text-muted-foreground font-mono truncate">
                      {item.assistantAnswerExcerpt || item.goal || item.description || item.formula || item.purpose || `Record ID: ${item.turnId || idx}`}
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground pt-1 border-t border-border/30">
                      <span>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Timestamped"}</span>
                      {item.value !== undefined && (
                        <span className="text-emerald-400 font-bold">{item.value} {item.unit}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>

          {/* Right Column: Turn Inspector & Replay Lab */}
          <div className="w-1/2 flex flex-col overflow-hidden bg-secondary/10">
            <div className="p-2.5 border-b border-border/40 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
              <span>Historical Turn Inspector & Replay Lab</span>
              {selectedTurn && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-[10px] font-mono gap-1 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => handleRunReplay(selectedTurn.turnId)}
                >
                  <Play className="size-3" /> Replay vs Current Context
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1 p-4 space-y-3">
              {selectedTurn ? (
                <div className="space-y-3.5 text-xs font-sans">
                  {/* Query & Answer Snapshot */}
                  <div className="p-3 rounded-lg border border-border/60 bg-background/60 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                      Historical Prompt:
                    </span>
                    <p className="text-foreground font-medium text-[11px] leading-relaxed">
                      "{selectedTurn.userQuery}"
                    </p>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block pt-1.5">
                      Assistant Response Excerpt:
                    </span>
                    <p className="text-foreground/85 text-[11px] leading-relaxed">
                      {selectedTurn.assistantAnswer.slice(0, 200)}...
                    </p>
                  </div>

                  {/* Context Passport Details */}
                  <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-2 text-[10px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Passport ID:</span>
                      <span className="text-primary truncate max-w-[180px]">{selectedTurn.contextPassport.passportId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Project:</span>
                      <span className="text-foreground">{selectedTurn.contextPassport.project.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Head Commit SHA:</span>
                      <span className="text-muted-foreground">{selectedTurn.contextPassport.project.headSha.slice(0, 12)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lifecycle Stage:</span>
                      <span className="text-emerald-400 font-bold">{selectedTurn.lifecycleStage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Admitted Context Items:</span>
                      <span>{selectedTurn.contextPassport.summary.admittedCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verification Hash:</span>
                      <span className="text-muted-foreground truncate max-w-[160px]">{selectedTurn.verificationHash}</span>
                    </div>
                  </div>

                  {/* Forensic Replay Divergence Report */}
                  {divergenceReport && (
                    <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="size-3.5" /> Replay Divergence Report
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-mono",
                            divergenceReport.divergenceScore === 0
                              ? "border-emerald-500 text-emerald-400"
                              : "border-amber-500 text-amber-400"
                          )}
                        >
                          Score: {divergenceReport.divergenceScore}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-foreground/90 leading-relaxed font-sans">
                        {divergenceReport.forensicSummary}
                      </p>

                      {divergenceReport.divergentItems.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                            Divergent Domain Deltas:
                          </span>
                          {divergenceReport.divergentItems.map((div, i) => (
                            <div key={i} className="p-2 rounded bg-background/60 border border-border/40 text-[10px] font-mono">
                              <span className="text-primary font-bold">[{div.domain} / {div.key}]:</span>{" "}
                              <span className="text-muted-foreground line-through">{String(div.historicalContent)}</span>{" "}
                              <span className="text-emerald-400 font-bold">→ {String(div.currentContent)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-xs font-mono">
                  Select a turn from the timeline to inspect its cognitive passport.
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
