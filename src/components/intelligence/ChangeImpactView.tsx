/**
 * PROJECT BRAHMA — CHANGE IMPACT ANALYSIS VIEW
 * Visualizes blast radius of repository changes, affected requirements,
 * APIs, services, and invalidated test suites.
 */

import React, { useState } from "react";
import {
  GitPullRequest,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Layers,
  FileCode2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  changeImpactEngine,
  ChangeImpactAnalysisResult,
  BlastRadiusLevel,
} from "@/services/intelligence/impactEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChangeImpactView() {
  const [history, setHistory] = useState<ChangeImpactAnalysisResult[]>(() =>
    changeImpactEngine.getHistory(),
  );
  const [activeAnalysis, setActiveAnalysis] = useState<ChangeImpactAnalysisResult>(
    () => history[0] || changeImpactEngine.analyzeImpact("PR-4412", ["services/billing/query.ts"]),
  );
  const [filesInput, setFilesInput] = useState("services/billing/query.ts, services/settlement/worker.ts");

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    const files = filesInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (files.length === 0) {
      toast.error("Please enter at least one file path to analyze.");
      return;
    }

    const prId = `PR-${Math.floor(1000 + Math.random() * 9000)}`;
    const res = changeImpactEngine.analyzeImpact(prId, files, "main");
    setHistory(changeImpactEngine.getHistory());
    setActiveAnalysis(res);
    toast.success(`Computed change impact for ${prId} (Blast Radius: ${res.blastRadius})`);
  };

  const getBlastRadiusBadge = (level: BlastRadiusLevel) => {
    switch (level) {
      case "CRITICAL_BLAST_RADIUS":
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">CRITICAL BLAST RADIUS</Badge>;
      case "HIGH_BLAST_RADIUS":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">HIGH BLAST RADIUS</Badge>;
      case "MODERATE":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">MODERATE</Badge>;
      default:
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">LOCALIZED</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Impact Engine 2.0
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Active PR: {activeAnalysis.changeId}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Change Impact & Blast Radius Analysis
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Calculates direct and transitive blast radius of code commits, pull requests, and
            dependencies before merging into release branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {getBlastRadiusBadge(activeAnalysis.blastRadius)}
        </div>
      </div>

      {/* Simulator Form */}
      <form
        onSubmit={handleRunAnalysis}
        className="p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="flex-1 w-full">
          <Input
            value={filesInput}
            onChange={(e) => setFilesInput(e.target.value)}
            placeholder="Enter comma-separated file paths (e.g. services/billing/query.ts)..."
            className="h-9 text-xs bg-background/80"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto h-9 text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-md shadow-primary/20"
        >
          <GitPullRequest className="size-3.5" />
          <span>Analyze Change Impact</span>
        </Button>
      </form>

      {/* Impact Score Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Impact Score</p>
            <p className="text-2xl font-black text-primary">{activeAnalysis.impactScore}/100</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Affected Services</p>
            <p className="text-2xl font-black text-amber-400">{activeAnalysis.affectedServices.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Invalidated Tests</p>
            <p className="text-2xl font-black text-rose-400">{activeAnalysis.invalidatedTests.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Release Blockers</p>
            <p className="text-2xl font-black text-rose-400">{activeAnalysis.releaseBlockersCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Affected Services & Endpoints */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <span>Affected Services & APIs</span>
          </h2>

          <div className="space-y-2">
            {activeAnalysis.affectedServices.map((srv) => (
              <div
                key={srv.id}
                className="p-3 rounded-lg border border-border/70 bg-card/70 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-foreground">{srv.name}</p>
                  <p className="text-muted-foreground mt-0.5">{srv.details}</p>
                </div>
                <Badge
                  className={cn(
                    "text-[10px] shrink-0",
                    srv.impactNature === "DIRECT" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300",
                  )}
                >
                  {srv.impactNature}
                </Badge>
              </div>
            ))}

            {activeAnalysis.affectedAPIs.map((api) => (
              <div
                key={api.id}
                className="p-3 rounded-lg border border-border/70 bg-card/70 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-foreground font-mono">{api.name}</p>
                  <p className="text-muted-foreground mt-0.5">{api.details}</p>
                </div>
                <Badge className="text-[10px] shrink-0 bg-blue-500/20 text-blue-300">
                  {api.impactNature}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Invalidation & Recommendations */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="size-4 text-rose-400" />
            <span>Invalidated Tests & Recommendations</span>
          </h2>

          <div className="space-y-3">
            {activeAnalysis.invalidatedTests.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground mt-0.5">{t.details}</p>
                </div>
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">RE-RUN REQUIRED</Badge>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 text-xs">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                <span>Copilot Merge Recommendations:</span>
              </span>
              <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                {activeAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
