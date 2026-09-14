/**
 * PROJECT BRAHMA — ARCHITECTURE DRIFT VIEW
 * Visualizes structural divergence between declared blueprints and repository AST.
 * Allows snapshot capture, finding inspection, and one-click remediation dispatch.
 */

import React, { useState } from "react";
import {
  Compass,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Camera,
  History,
  ArrowRight,
  Layers,
  Wrench,
  RotateCcw,
} from "lucide-react";
import {
  architectureDriftEngine,
  DriftFinding,
  ArchitectureSnapshot,
} from "@/services/intelligence/driftEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ArchitectureDriftView() {
  const [driftData, setDriftData] = useState(() => architectureDriftEngine.evaluateDrift());
  const [snapshots, setSnapshots] = useState<ArchitectureSnapshot[]>(() =>
    architectureDriftEngine.getSnapshots(),
  );

  const handleTakeSnapshot = () => {
    const snap = architectureDriftEngine.takeSnapshot("proj-brahma", "2.4.0");
    setSnapshots(architectureDriftEngine.getSnapshots());
    toast.success(`Captured Architecture Snapshot ${snap.id.substring(0, 15)}...`);
  };

  const handleResolve = (id: string, title: string) => {
    architectureDriftEngine.resolveDriftFinding(id);
    setDriftData(architectureDriftEngine.evaluateDrift());
    toast.success(`Resolved drift item: ${title}`);
  };

  const handleReset = () => {
    architectureDriftEngine.resetToBaseline();
    setDriftData(architectureDriftEngine.evaluateDrift());
    setSnapshots(architectureDriftEngine.getSnapshots());
    toast.info("Reset architecture drift state to baseline.");
  };

  const getSeverityBadge = (sev: DriftFinding["severity"]) => {
    switch (sev) {
      case "CRITICAL":
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">CRITICAL</Badge>;
      case "HIGH":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">HIGH</Badge>;
      case "MEDIUM":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">MEDIUM</Badge>;
      default:
        return <Badge className="bg-zinc-500/20 text-zinc-300 border-zinc-500/30">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Drift Intelligence Engine
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Drift Score: {driftData.summary.overallDriftScore}/100
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Architecture Drift & Boundary Alignment
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Continuously compares intended architecture blueprint against repository AST analysis,
            service dependencies, and OpenAPI contracts.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs border-border/80 gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
          <Button
            size="sm"
            onClick={handleTakeSnapshot}
            className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-md shadow-primary/20"
          >
            <Camera className="size-3.5" />
            <span>Capture Snapshot</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Critical Drift</p>
              <p className="text-2xl font-black text-rose-400">{driftData.summary.criticalCount}</p>
            </div>
            <ShieldAlert className="size-6 text-rose-400/50" />
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">High Severity</p>
              <p className="text-2xl font-black text-amber-400">{driftData.summary.highCount}</p>
            </div>
            <AlertTriangle className="size-6 text-amber-400/50" />
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Medium / Low</p>
              <p className="text-2xl font-black text-blue-400">
                {driftData.summary.mediumCount + driftData.summary.lowCount}
              </p>
            </div>
            <Layers className="size-6 text-blue-400/50" />
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Snapshots Stored</p>
              <p className="text-2xl font-black text-emerald-400">{snapshots.length}</p>
            </div>
            <History className="size-6 text-emerald-400/50" />
          </CardContent>
        </Card>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
          Active Divergence Findings ({driftData.findings.length})
        </h2>

        {driftData.findings.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <CheckCircle2 className="size-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-foreground">Zero Architectural Drift Detected</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Repository implementation perfectly aligns with declared blueprint v2.4.0.
            </p>
          </div>
        ) : (
          driftData.findings.map((finding) => (
            <div
              key={finding.id}
              className="p-4 rounded-xl border border-border/80 bg-card/70 hover:border-primary/40 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(finding.severity)}
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary/80 text-foreground border border-border">
                    {finding.type}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    Entity: {finding.entityId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Confidence: {Math.round(finding.confidence * 100)}%
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(finding.id, finding.title)}
                    className="h-7 text-xs gap-1 border-border/60 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    <CheckCircle2 className="size-3" />
                    <span>Acknowledge & Resolve</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">{finding.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                    <span className="font-semibold text-primary block mb-1">Expected Architecture:</span>
                    <p className="text-muted-foreground">{finding.expectedState}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                    <span className="font-semibold text-rose-400 block mb-1">Observed Repository AST:</span>
                    <p className="text-muted-foreground">{finding.observedState}</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/40 text-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Wrench className="size-4 text-primary shrink-0" />
                  <span className="truncate text-muted-foreground">
                    <strong className="text-foreground">Remediation: </strong>
                    {finding.remediation}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
