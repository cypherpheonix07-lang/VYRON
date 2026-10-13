/**
 * PROJECT BRAHMA / VYRON — LIFECYCLE INSPECTION & RESOLUTION PANEL
 *
 * Dedicated UI panel for inspecting a lifecycle section:
 * - Compares Manual Submission vs AI Specialist Proposal
 * - Displays Deterministic Checks (Zero Raw SQL, schema validity)
 * - Lists Item-level Findings with stable IDs, blocking policy, and decision options
 * - Commits version-bound acceptance with cryptographic seal
 *
 * Strictly ZERO Raw SQL.
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  RotateCcw,
  Sparkles,
  FileText,
  GitCompare,
  ArrowRight,
  Check,
  X,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  lifecycleInspectionService,
  type SectionInspectionReport,
  type LifecycleFinding,
  type ResolutionAction,
} from "@/services/inspection/lifecycleInspectionService";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import type { ProjectLifecycleStage } from "@/types/aiProjectControlPlane";
import { toast } from "sonner";

interface LifecycleInspectionPanelProps {
  stage: ProjectLifecycleStage;
  projectId: string;
}

export const LifecycleInspectionPanel: React.FC<LifecycleInspectionPanelProps> = ({
  stage,
  projectId,
}) => {
  const { state, updateStageStatus } = useAiProject();
  const [report, setReport] = useState<SectionInspectionReport>(() =>
    lifecycleInspectionService.inspectSection(projectId, stage, state)
  );
  const [activeTab, setActiveTab] = useState("inspect");
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});

  const handleReinspect = () => {
    const updated = lifecycleInspectionService.inspectSection(projectId, stage, state);
    setReport(updated);
    toast.info(`Reinspected ${stage}: ${updated.findings.length} finding(s) detected.`);
  };

  const handleResolveFinding = (findingId: string, action: ResolutionAction) => {
    const note = decisionNotes[findingId] || `Resolved via architect decision: ${action}`;
    try {
      lifecycleInspectionService.resolveFinding(findingId, action, "Lead Architect", note);
      const updated = lifecycleInspectionService.inspectSection(projectId, stage, state);
      setReport(updated);
      toast.success(`Finding ${findingId} resolved (${action}).`);
    } catch (err) {
      toast.error("Failed to resolve finding", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleAcceptSection = () => {
    try {
      const acceptance = lifecycleInspectionService.acceptSectionVersion(
        projectId,
        stage,
        "Lead Architect",
        state
      );
      updateStageStatus(stage, "accepted");
      const updated = lifecycleInspectionService.inspectSection(projectId, stage, state);
      setReport(updated);
      toast.success(`Section ${stage} accepted!`, {
        description: `Cryptographic verification seal: ${acceptance.verificationSeal.slice(0, 16)}...`,
      });
    } catch (err) {
      toast.error("Acceptance Rejected", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return (
    <Card className="border-border/80 bg-card/70 backdrop-blur-md shadow-xl">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px] text-cyan-400 border-cyan-500/30">
                S{report.displayNumber}
              </Badge>
              <CardTitle className="text-base font-bold text-foreground">
                Inspection & Governance: {report.stageName}
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Independent verification of individual claims, deterministic checks, and version-bound acceptance.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReinspect}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="h-3 w-3" />
              Reinspect
            </Button>

            <Button
              size="sm"
              onClick={handleAcceptSection}
              disabled={!report.canAccept || report.status === "accepted"}
              className={`text-xs h-8 gap-1.5 font-medium shadow-sm ${
                report.status === "accepted"
                  ? "bg-emerald-600 text-white hover:bg-emerald-600"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white"
              }`}
            >
              {report.status === "accepted" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Accepted & Sealed
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Accept Section
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
          <span className="text-muted-foreground text-[10px] uppercase">Status:</span>
          <Badge
            variant={
              report.status === "accepted"
                ? "default"
                : report.blockingFindingsCount > 0
                ? "destructive"
                : "secondary"
            }
            className="text-[10px] font-mono capitalize"
          >
            {report.status.replace("_", " ")}
          </Badge>

          <span className="text-muted-foreground text-[10px] uppercase ml-2">Open Blockers:</span>
          <Badge
            variant={report.blockingFindingsCount === 0 ? "outline" : "destructive"}
            className="text-[10px] font-mono"
          >
            {report.blockingFindingsCount}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="inspect" className="text-xs gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Checks ({report.deterministicChecks.length})
            </TabsTrigger>
            <TabsTrigger value="findings" className="text-xs gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Findings ({report.findings.length})
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs gap-1.5">
              <GitCompare className="h-3.5 w-3.5" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="seal" className="text-xs gap-1.5">
              <Fingerprint className="h-3.5 w-3.5" />
              Acceptance Seal
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Deterministic Checks */}
          <TabsContent value="inspect" className="space-y-2.5">
            {report.deterministicChecks.map((chk) => (
              <div
                key={chk.checkId}
                className="p-3 rounded-lg border border-border/70 bg-background/50 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{chk.name}</span>
                    {chk.isBlocking && (
                      <Badge variant="outline" className="text-[9px] text-rose-400 border-rose-500/30">
                        Blocking Gate
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[11px]">{chk.message}</p>
                </div>

                <div className="shrink-0">
                  {chk.passed ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Passed
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1 text-[10px]">
                      <ShieldAlert className="h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* TAB 2: Findings & Human Resolution */}
          <TabsContent value="findings" className="space-y-3">
            {report.findings.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-400/50 mx-auto" />
                <p>Zero findings detected. Section is structurally and semantically verified.</p>
              </div>
            ) : (
              report.findings.map((finding) => (
                <div
                  key={finding.id}
                  className={`p-3.5 rounded-xl border space-y-2 text-xs transition-colors ${
                    finding.status === "resolved"
                      ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                      : finding.isBlocking
                      ? "border-rose-500/40 bg-rose-500/5"
                      : "border-amber-500/40 bg-amber-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{finding.id}</span>
                        <span className="font-bold text-foreground">{finding.title}</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">{finding.details}</p>
                      <p className="text-[10px] font-mono text-cyan-400/80">Evidence: {finding.evidence}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant={finding.isBlocking ? "destructive" : "secondary"}
                        className="text-[9px] uppercase font-mono"
                      >
                        {finding.severity}
                      </Badge>
                      <Badge
                        variant={finding.status === "resolved" ? "default" : "outline"}
                        className="text-[9px] uppercase font-mono"
                      >
                        {finding.status}
                      </Badge>
                    </div>
                  </div>

                  {finding.status === "open" && (
                    <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">
                        Architect Action:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveFinding(finding.id, "ACCEPT_AI_PROPOSAL")}
                          className="h-7 text-[10px] px-2 gap-1 text-cyan-400 hover:text-cyan-300"
                        >
                          <Check className="h-3 w-3" />
                          Accept AI Proposal
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveFinding(finding.id, "RETAIN_MANUAL_BASELINE")}
                          className="h-7 text-[10px] px-2 gap-1 text-muted-foreground hover:text-foreground"
                        >
                          Retain Baseline
                        </Button>
                      </div>
                    </div>
                  )}

                  {finding.status === "resolved" && finding.decision && (
                    <div className="pt-2 border-t border-emerald-500/20 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
                      <span>Resolved: {finding.decision.action} by {finding.decision.decidedBy}</span>
                      <span>Hash: {finding.decision.resultingHash.slice(0, 10)}...</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          {/* TAB 3: Compare View */}
          <TabsContent value="compare" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-2">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Manual Baseline Version
                </span>
                <p className="text-muted-foreground text-[11px]">
                  {report.manualSubmission
                    ? `Authored by ${report.manualSubmission.authorId} at ${new Date(report.manualSubmission.timestamp).toLocaleTimeString()}`
                    : "Using active workspace baseline."}
                </p>
                <div className="p-2.5 rounded-lg bg-card/70 font-mono text-[10px] text-muted-foreground overflow-x-auto">
                  Hash: {report.manualSubmission?.contentHash || "BASELINE_SEEDED"}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-2">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  AI Specialist Assessment
                </span>
                <p className="text-muted-foreground text-[11px]">
                  {report.aiAssessment
                    ? `Generated by ${report.aiAssessment.modelIdentifier} (${report.aiAssessment.effortBudget} effort)`
                    : "Specialist synthesis generated from active control plane."}
                </p>
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30 font-mono text-[10px] text-cyan-300 overflow-x-auto">
                  Confidence: {report.aiAssessment?.confidenceScore || 95}% • Ready for Review
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: Acceptance Seal */}
          <TabsContent value="seal" className="space-y-3 text-xs">
            {report.acceptance ? (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  Section Officially Accepted & Version-Bound
                </div>
                <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                  <div>Accepted At: {report.acceptance.acceptedAt}</div>
                  <div>Actor: {report.acceptance.actorId}</div>
                  <div>Ruleset Version: {report.acceptance.rulesetVersion}</div>
                  <div className="text-cyan-400 break-all">
                    HMAC-SHA256 Evidence Seal: {report.acceptance.verificationSeal}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground space-y-2">
                <Fingerprint className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p>This section has not been formally accepted yet.</p>
                <p className="text-[11px]">
                  Resolve any blocking findings and click "Accept Section" to generate the immutable audit seal.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
