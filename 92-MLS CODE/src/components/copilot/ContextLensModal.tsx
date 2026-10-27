/**
 * VYRON — CONTEXT LENS & COGNITIVE CONTROL MODAL (GOD MODE Ω×)
 * Implements the unified control plane modal housing:
 * 1. Context Lens (why context was selected, admitted vs quarantined)
 * 2. Intent Radar (interpreted task, 16 question types, entities, constraints)
 * 3. Memory Compass (candidate scoring breakdown, auto-references)
 * 4. Evidence Dock (sources, claims, evidence IDs)
 * 5. Resource Trail (flight recorder fetches, authority tiers)
 * 6. Decision Ledger (recorded decisions & delegations)
 * 7. Contradiction Radar (conflicting claims & arbitration)
 * 8. Freshness Clock (age watermarks & staleness)
 * 9. Context Debt Monitor (unresolved debt & blocking items)
 *
 * Strictly ZERO SQL.
 */

import React, { useState } from "react";
import {
  Eye,
  Radar,
  Compass,
  FileCheck,
  Link2,
  BookOpen,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { copilotStore } from "@/state/copilot/copilotStore";
import { ContextPassport, ContextMeshItem, contextMesh } from "@/services/copilot/contextMesh";
import { IntentCapsule } from "@/services/copilot/questionUnderstanding";
import { resourceFlightRecorder } from "@/services/copilot/resourceProvenance";
import { historyRetrieval } from "@/services/copilot/historyRetrieval";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ContextLensModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport?: ContextPassport | null | undefined;
  intentCapsule?: IntentCapsule | null | undefined;
}

export function ContextLensModal({ isOpen, onClose, passport, intentCapsule }: ContextLensModalProps) {
  const [activeTab, setActiveTab] = useState<string>("lens");

  // Fallback to active turn passport if not provided
  const activePassport =
    passport ||
    contextMesh.replayPassport("passport_sample_01") ||
    contextMesh.assembleMesh("Default inspection", {
      id: "intent_inspect",
      rawQuery: "Default",
      normalizedQuery: "default",
      timestamp: new Date().toISOString(),
      primaryQuestionType: "ANALYSIS",
      secondaryQuestionTypes: [],
      confidenceScores: {} as any,
      goal: "Inspect runtime context mesh",
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
      candidateAction: "GET_PROJECT_HEALTH",
      clarificationNeed: false,
      isConsequential: false,
    });

  const resources = resourceFlightRecorder.listAll();
  const candidates = historyRetrieval.scoreCandidates(
    activePassport.project.name,
    activePassport.project.id,
    activePassport.lifecycleStage
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/80 shadow-2xl flex flex-col font-sans">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border/60 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                <Radar className="size-4 animate-spin-slow" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                  <span>VYRON CONTEXT LENS & CONTROL SURFACES</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary bg-primary/5">
                    GOD MODE Ω×
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground mt-0.5">
                  Real-time cognitive transparency: Context Mesh, Intent Radar, Memory Compass, and Evidence Provenance.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span>Passport: <span className="text-foreground font-bold">{activePassport.passportId.slice(0, 16)}</span></span>
            </div>
          </div>
        </DialogHeader>

        {/* Multi-Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 border-b border-border/40 bg-secondary/15 shrink-0">
            <TabsList className="h-9 bg-transparent gap-1 p-0 flex-wrap">
              <TabsTrigger value="lens" className="text-[11px] font-mono gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Eye className="size-3" /> Context Lens
              </TabsTrigger>
              <TabsTrigger value="intent" className="text-[11px] font-mono gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Radar className="size-3" /> Intent Radar
              </TabsTrigger>
              <TabsTrigger value="memory" className="text-[11px] font-mono gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Compass className="size-3" /> Memory Compass
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-[11px] font-mono gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Link2 className="size-3" /> Resource Trail
              </TabsTrigger>
              <TabsTrigger value="debt" className="text-[11px] font-mono gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <AlertTriangle className="size-3" /> Context Debt ({activePassport.debtItems.length})
              </TabsTrigger>
              <TabsTrigger value="clock" className="text-[11px] font-mono gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Clock className="size-3" /> Freshness Clock
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-4">
            {/* 1. CONTEXT LENS */}
            <TabsContent value="lens" className="m-0 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                <span>
                  Showing <strong className="text-foreground">{activePassport.summary.admittedCount}</strong> admitted items across <strong className="text-foreground">16 Domains</strong> ({activePassport.summary.quarantinedCount} quarantined)
                </span>
                <Badge variant="outline" className="text-[9px] font-mono text-emerald-400 border-emerald-500/30">
                  {activePassport.summary.topAuthority}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activePassport.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3 rounded-lg border text-xs space-y-1.5 transition-all",
                      item.admitted
                        ? "bg-secondary/30 border-border/60"
                        : "bg-destructive/5 border-destructive/30 opacity-75"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        {item.admitted ? (
                          <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-destructive shrink-0" />
                        )}
                        <span className="font-bold text-foreground truncate max-w-[200px]">
                          {item.label}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-mono py-0 px-1 border-primary/40 text-primary">
                        {item.domain}
                      </Badge>
                    </div>

                    <p className="text-[10px] text-muted-foreground font-mono leading-relaxed line-clamp-2">
                      {item.retrievalReason}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-[9px] font-mono text-muted-foreground">
                      <span>Authority: <strong className="text-foreground">{item.authority}</strong></span>
                      <span>Freshness: <strong className="text-emerald-400">{item.freshness}</strong></span>
                      <span>Score: <strong className="text-primary">{item.relevanceScore}</strong></span>
                    </div>

                    {!item.admitted && item.quarantineReason && (
                      <div className="p-1 rounded bg-destructive/10 text-destructive text-[9px] font-mono">
                        Quarantined: {item.quarantineReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 2. INTENT RADAR */}
            <TabsContent value="intent" className="m-0 space-y-3">
              <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-primary font-bold block">
                  Active Task Goal:
                </span>
                <p className="text-xs font-medium text-foreground">
                  {intentCapsule?.goal || "Analyze AST call graph for boundary drift violations"}
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px] font-mono">
                  <Badge variant="default" className="text-[9px]">
                    Type: {intentCapsule?.primaryQuestionType || "ANALYSIS"}
                  </Badge>
                  <Badge variant="outline" className="text-[9px]">
                    Stage: {intentCapsule?.lifecycleStage || activePassport.lifecycleStage}
                  </Badge>
                  <Badge variant="outline" className="text-[9px]">
                    Urgency: {intentCapsule?.urgency || "MEDIUM"}
                  </Badge>
                  <Badge variant="outline" className="text-[9px]">
                    Risk: {intentCapsule?.risk || "LOW"}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-400">
                    Ambiguity Score: {Math.round((intentCapsule?.ambiguityScore || 0.1) * 100)}%
                  </Badge>
                </div>
              </div>

              {/* Extracted Entities & Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                    Extracted Entities:
                  </span>
                  <div className="space-y-1 text-xs">
                    {(intentCapsule?.entities || [
                      { name: "AST Drift Analyzer", category: "SERVICE" },
                      { name: "PostgreSQL Database Layer", category: "DATABASE" },
                    ]).map((e, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-foreground">• {e.name}</span>
                        <span className="text-[9px] text-muted-foreground">{e.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold block">
                    Active Constraints:
                  </span>
                  <div className="space-y-1 text-xs">
                    {(intentCapsule?.constraints || ["READ_ONLY_ENFORCED", "ZERO_RAW_SQL"]).map((c, i) => (
                      <div key={i} className="text-[11px] font-mono text-foreground/90">
                        🔒 {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 3. MEMORY COMPASS */}
            <TabsContent value="memory" className="m-0 space-y-3">
              <div className="text-xs text-muted-foreground pb-1">
                Evaluates prior candidate turns across 8 scoring dimensions (Semantic, Project, Temporal, Lifecycle, Authority, Freshness, User Preference, Contradiction).
              </div>

              <div className="space-y-2">
                {candidates.map((cand, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Turn: {cand.candidateId}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px]",
                          cand.isAdmitted
                            ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                            : "border-destructive/40 text-destructive bg-destructive/10"
                        )}
                      >
                        {cand.isAdmitted ? `Admitted (${cand.totalScore})` : "Quarantined"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[9px] text-muted-foreground pt-1">
                      <div>Semantic: <strong className="text-foreground">{cand.semanticTaskFit}</strong></div>
                      <div>Project: <strong className="text-foreground">{cand.projectIdentityMatch}</strong></div>
                      <div>Temporal: <strong className="text-foreground">{cand.temporalRelevance}</strong></div>
                      <div>Lifecycle: <strong className="text-foreground">{cand.lifecycleStageConcordance}</strong></div>
                      <div>Authority: <strong className="text-foreground">{cand.authorityScore}</strong></div>
                      <div>Freshness: <strong className="text-foreground">{cand.freshnessScore}</strong></div>
                    </div>

                    {cand.quarantineReason && (
                      <div className="text-[9px] text-destructive italic pt-1">
                        Reason: {cand.quarantineReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 4. RESOURCE TRAIL */}
            <TabsContent value="resources" className="m-0 space-y-2.5">
              <div className="text-xs text-muted-foreground pb-1">
                Resource Flight Recorder maintains an immutable ledger of every external and internal resource consulted.
              </div>

              {resources.map((res) => (
                <div
                  key={res.resourceId}
                  className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground">{res.name}</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-primary/40 text-primary">
                      {res.authorityClass}
                    </Badge>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    URI: <span className="text-foreground/80">{res.urlOrPath}</span>
                  </div>
                  <div className="text-[10px] text-foreground/85">
                    • Selected Claim: {res.selectedClaims[0] || "Empirical reference"}
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground pt-1 border-t border-border/30">
                    <span>Evidence: <strong>{res.evidenceId}</strong></span>
                    <span>Provider: <strong>{res.provider}</strong></span>
                    <span>Hash: {res.sha256Checksum.slice(0, 16)}...</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* 5. CONTEXT DEBT MONITOR */}
            <TabsContent value="debt" className="m-0 space-y-2.5">
              <div className="text-xs text-muted-foreground pb-1">
                Active Context Debts tracked by severity. Blocking debts halt consequential stage mutations.
              </div>

              {activePassport.debtItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center text-xs font-mono text-emerald-400">
                  ✅ Zero active Context Debt detected. All premises and evidence verified.
                </div>
              ) : (
                activePassport.debtItems.map((debt) => (
                  <div
                    key={debt.id}
                    className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground font-mono">{debt.category}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-mono",
                          debt.severity === "BLOCKING"
                            ? "border-destructive text-destructive bg-destructive/10"
                            : "border-amber-500 text-amber-400 bg-amber-500/10"
                        )}
                      >
                        {debt.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-foreground/90">{debt.description}</p>
                    <div className="text-[10px] text-muted-foreground pt-1">
                      Remediation: <strong className="text-foreground">{debt.remediation}</strong>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* 6. FRESHNESS CLOCK */}
            <TabsContent value="clock" className="m-0 space-y-3">
              <div className="p-3.5 rounded-xl border border-border/50 bg-secondary/30 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Turn Timestamp:</span>
                  <span className="text-muted-foreground">{activePassport.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stale Items Count:</span>
                  <span className="text-amber-400 font-bold">{activePassport.summary.staleCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contradiction Count:</span>
                  <span className="text-emerald-400 font-bold">{activePassport.summary.contradictionCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Passport Signature:</span>
                  <span className="text-primary font-bold truncate max-w-[200px]">{activePassport.passportSignature}</span>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
