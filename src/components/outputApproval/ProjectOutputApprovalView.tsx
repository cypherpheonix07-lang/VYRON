/**
 * PROJECT BRAHMA / VYRON — PROJECT OUTPUT & APPROVAL WORKSPACE
 *
 * Dedicated delivery destination after Blueprint (Section 20).
 * Displays candidate output packages, side-by-side difference reviews,
 * and exact-version documentation approval commits.
 *
 * Distinct from deployment: approving documentation does NOT authorize code execution or release.
 * Strictly ZERO Raw SQL.
 */

import React, { useState, useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  FileCheck2,
  GitCompare,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Download,
  Copy,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Check,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  outputApprovalService,
  type CandidatePackageManifest,
  type DifferenceReviewReport,
  type OutputApprovalCommit,
} from "@/services/outputApproval/outputApprovalService";
import { useAiProject } from "@/state/aiProject/aiProjectStore";
import { projectRegistry } from "@/services/project/projectRegistry";
import { getProject } from "@/lib/mock-data";
import { toast } from "sonner";

interface ProjectOutputApprovalViewProps {
  projectId?: string;
}

export const ProjectOutputApprovalView: React.FC<ProjectOutputApprovalViewProps> = ({
  projectId: propProjectId,
}) => {
  const params = useParams({ strict: false });
  const projectId = propProjectId || (params as { id?: string })?.id || "proj-brahma";
  const { state } = useAiProject();
  const canonicalProject = projectRegistry.getProjectById(projectId) || getProject(projectId);

  const [candidateManifest, setCandidateManifest] = useState<CandidatePackageManifest>(() =>
    outputApprovalService.compileCandidatePackage(projectId, state)
  );

  const [diffReport, setDiffReport] = useState<DifferenceReviewReport>(() =>
    outputApprovalService.generateDifferenceReview(candidateManifest.packageId)
  );

  const [approvalCommits, setApprovalCommits] = useState<OutputApprovalCommit[]>(() =>
    outputApprovalService.listApprovalCommitsForProject(projectId)
  );

  const [activeTab, setActiveTab] = useState("manifest");
  const [copiedSeal, setCopiedSeal] = useState(false);

  const handleRecompileCandidate = () => {
    const updated = outputApprovalService.compileCandidatePackage(
      projectId,
      state,
      candidateManifest.candidateNumber + 1
    );
    setCandidateManifest(updated);
    setDiffReport(outputApprovalService.generateDifferenceReview(updated.packageId));
    toast.success(`Compiled Candidate Package #${updated.candidateNumber}!`, {
      description: `Readiness score: ${updated.readinessScore}% across all ${updated.totalSectionsCount} sections.`,
    });
  };

  const handleCommitApproval = () => {
    try {
      const commit = outputApprovalService.commitApproval(
        candidateManifest.packageId,
        "Lead Architect",
        "Lead Architect"
      );
      setApprovalCommits(outputApprovalService.listApprovalCommitsForProject(projectId));
      setCandidateManifest({ ...candidateManifest, isCommitted: true });
      toast.success("Candidate Package Officially Approved!", {
        description: `Cryptographic Seal: ${commit.cryptographicApprovalSeal.slice(0, 16)}...`,
      });
    } catch (err) {
      toast.error("Approval Rejected", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const copySeal = (seal: string) => {
    navigator.clipboard.writeText(seal);
    setCopiedSeal(true);
    setTimeout(() => setCopiedSeal(false), 2000);
    toast.success("HMAC-SHA256 seal copied to clipboard.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* 1. Header Banner */}
      <div className="p-4 md:p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-cyan-400 border-cyan-500/30">
                OUTPUT DESTINATION
              </Badge>
              <Badge variant="secondary" className="font-mono text-[11px]">
                {candidateManifest.packageId}
              </Badge>
              <Badge
                variant={
                  candidateManifest.overallGatingVerdict === "READY_FOR_APPROVAL"
                    ? "default"
                    : candidateManifest.overallGatingVerdict === "CHANGES_REQUIRED"
                    ? "destructive"
                    : "secondary"
                }
                className="text-[10px] font-mono capitalize"
              >
                {candidateManifest.overallGatingVerdict.replace("_", " ")}
              </Badge>
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileCheck2 className="h-6 w-6 text-cyan-400" />
              Project Output & Approval — {canonicalProject?.name || state.name}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Formal candidate delivery package after Section 20 (Blueprint). Reviews differences across all 20 lifecycle sections and commits version-bound acceptance.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRecompileCandidate}
              className="text-xs h-9 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recompile Candidate
            </Button>

            <Button
              size="sm"
              onClick={handleCommitApproval}
              disabled={candidateManifest.blockingIssuesCount > 0 || candidateManifest.isCommitted}
              className={`text-xs h-9 gap-1.5 font-medium shadow-md ${
                candidateManifest.isCommitted
                  ? "bg-emerald-600 text-white hover:bg-emerald-600"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
              }`}
            >
              {candidateManifest.isCommitted ? (
                <>
                  <Check className="h-4 w-4" />
                  Package Approved & Sealed
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Commit Package Approval
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Telemetry Strip & Invariant Alert */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/50 text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase">Readiness Completion</span>
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span>{candidateManifest.readinessScore}%</span>
              <Progress value={candidateManifest.readinessScore} className="h-1.5 w-20" />
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase">Lifecycle Coverage</span>
            <div className="font-semibold text-cyan-400">
              {candidateManifest.completedSectionsCount} / 20 Sections Complete
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase">Approval Scope</span>
            <div className="font-semibold text-purple-400">
              DOCUMENTATION_ACCEPTANCE
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase">Deployment Authority</span>
            <div className="font-semibold text-amber-400">
              DECOUPLED (Code Exec Separate)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 h-10 w-full sm:w-[480px]">
          <TabsTrigger value="manifest" className="text-xs gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            20-Section Manifest
          </TabsTrigger>
          <TabsTrigger value="diff" className="text-xs gap-1.5">
            <GitCompare className="h-3.5 w-3.5" />
            Difference Review
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5">
            <Fingerprint className="h-3.5 w-3.5" />
            Approval Seals ({approvalCommits.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: 20-Section Manifest */}
        <TabsContent value="manifest" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {candidateManifest.sections.map((sec) => (
              <div
                key={sec.stage}
                className="p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-2 text-xs transition-all hover:border-cyan-500/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">
                      S{sec.displayNum}
                    </span>
                    <span className="font-semibold text-foreground">{sec.name}</span>
                  </div>
                  <Badge
                    variant={sec.isAccepted ? "default" : "secondary"}
                    className="text-[9px] uppercase font-mono"
                  >
                    {sec.status}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-[11px] line-clamp-2">{sec.summary}</p>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[200px]">SHA: {sec.contentHash}</span>
                  <Link
                    to="/app/projects/new"
                    search={{ stage: sec.stage }}
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-sans"
                  >
                    Inspect
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: Difference Review */}
        <TabsContent value="diff" className="space-y-4">
          <Card className="border-border/70 bg-card/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">
                    Section-by-Section Difference Analysis
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comparing candidate package against accepted baseline.
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    diffReport.riskAssessment === "LOW"
                      ? "default"
                      : diffReport.riskAssessment === "MEDIUM"
                      ? "secondary"
                      : "destructive"
                  }
                  className="font-mono text-[10px]"
                >
                  Risk: {diffReport.riskAssessment}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {diffReport.sectionDiffs.map((diff) => (
                <div
                  key={diff.stage}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    diff.hasChanged
                      ? "border-cyan-500/40 bg-cyan-500/5"
                      : "border-border/50 bg-background/40 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{diff.name}</span>
                    <Badge variant={diff.hasChanged ? "outline" : "secondary"} className="text-[9px]">
                      {diff.hasChanged ? "Modified Proposal" : "Unchanged Baseline"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{diff.changeSummary}</p>
                  <div className="text-[10px] font-mono text-muted-foreground flex items-center justify-between pt-1">
                    <span>Source: {diff.sourceAttribution}</span>
                    <span>Hash: {diff.candidateHash.slice(0, 10)}...</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Approval Seals */}
        <TabsContent value="history" className="space-y-3">
          {approvalCommits.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Fingerprint className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm">No approved packages committed yet for this project.</p>
              <p className="text-xs">
                Click "Commit Package Approval" above to finalize the candidate manifest and issue a cryptographic seal.
              </p>
            </div>
          ) : (
            approvalCommits.map((commit) => (
              <div
                key={commit.approvalId}
                className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-foreground">{commit.approvalId}</span>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
                    {commit.scope}
                  </Badge>
                </div>

                <div className="space-y-1 text-muted-foreground text-[11px]">
                  <div>Package: {commit.packageId}</div>
                  <div>Actor: {commit.actorId} ({commit.actorRole})</div>
                  <div>Committed At: {new Date(commit.committedAt).toLocaleString()}</div>
                  <div className="text-cyan-400 break-all">
                    HMAC-SHA256 Seal: {commit.cryptographicApprovalSeal}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px]">
                  <span className="text-amber-400/90 font-sans">
                    ✓ Documentation Accepted (Deployment authority separate)
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copySeal(commit.cryptographicApprovalSeal)}
                    className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedSeal ? "Copied" : "Copy Seal"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
