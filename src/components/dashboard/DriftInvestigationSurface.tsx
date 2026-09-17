/**
 * VYRON — DRIFT INVESTIGATION SURFACE (PHASE 10)
 * Structural divergence analysis across the 5 architectural states:
 * INTENDED → DECLARED → IMPLEMENTED → DEPLOYED → OBSERVED.
 * Explains: EXPECTED, ACTUAL, WHEN DIVERGED, POSSIBLE CAUSE, AFFECTED SYSTEM, BLAST RADIUS, CONFIDENCE, EVIDENCE.
 * Actions: REMEDIATE, SIMULATE, DEFER, ACCEPT RISK, CREATE DECISION.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { architectureDriftEngine, DriftFinding } from "@/services/intelligence/driftEngine";
import { decisionEngine } from "@/services/intelligence/decisionEngine";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileCode,
  Layers,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

export function DriftInvestigationSurface() {
  const { selectEntity, userAuthority } = useCommandCenter();
  const [driftState, setDriftState] = useState(0);

  const driftEval = useMemo(() => {
    return architectureDriftEngine.evaluateDrift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driftState]);

  const [selectedFinding, setSelectedFinding] = useState<DriftFinding>(
    driftEval.findings[0] || {
      id: "drift-01",
      type: "BOUNDARY_VIOLATION",
      title: "Unauthorized Service-to-Database Direct Access",
      severity: "HIGH",
      entityId: "srv-settlement",
      expectedState: "Must route persistence queries strictly via Data Access Object layer.",
      observedState: "Direct raw query execution detected in services/billing/query.ts:42.",
      evidence: "Direct database client invocation bypassing governed repository layer.",
      confidence: 0.96,
      remediation: "Refactor billing query builder to use typed repository interfaces.",
      detectedAt: new Date().toISOString(),
    },
  );

  // Actions
  const handleRemediate = (finding: DriftFinding) => {
    architectureDriftEngine.resolveDriftFinding(finding.id);
    toast.success(`Applied remediation patch for drift: ${finding.title}`);
    setDriftState((s) => s + 1);
  };

  const handleSimulate = (finding: DriftFinding) => {
    eventSimulator.injectAnomalyWave(3);
    toast.info(`Simulating drift impact for ${finding.entityId} in Simulation Twin.`);
  };

  const handleAcceptRisk = (finding: DriftFinding) => {
    if (userAuthority !== "CHIEF_ARCHITECT") {
      toast.error("Accepting architectural drift requires 'CHIEF_ARCHITECT' authority.");
      return;
    }
    architectureDriftEngine.resolveDriftFinding(finding.id);
    toast.success(`Drift finding ${finding.id} accepted under Chief Architect risk policy.`);
    setDriftState((s) => s + 1);
  };

  const handleCreateDecision = (finding: DriftFinding) => {
    const adr = decisionEngine.recordDecision({
      title: `ADR: Resolve ${finding.title}`,
      context: finding.observedState,
      options: [
        {
          id: "opt-refactor",
          title: "Refactor to Typed Repository Interfaces",
          description: finding.remediation,
          pros: ["Zero architecture divergence", "Strict contract governance"],
          cons: ["Requires 8 developer hours"],
          estimatedEffortHours: 8,
        },
      ],
      chosenOptionId: "opt-refactor",
      rationale: `Approved by ${userAuthority} to eliminate architectural drift.`,
      affectedArchitectureNodes: [finding.entityId],
      actor: userAuthority,
    });
    toast.success(`Created Architecture Decision Record ${adr.id}.`);
  };

  const handleInspectInDrawer = (finding: DriftFinding) => {
    setSelectedFinding(finding);
    selectEntity({
      type: "drift",
      id: finding.id,
      name: finding.title,
      severity: finding.severity,
      confidence: finding.confidence,
      details: `${finding.title}. Expected: ${finding.expectedState} Observed: ${finding.observedState}`,
      evidenceHash: finding.evidence,
      metadata: {
        type: finding.type,
        entityId: finding.entityId,
        expectedState: finding.expectedState,
        observedState: finding.observedState,
        confidence: finding.confidence,
        remediation: finding.remediation,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* SCORE BANNER & 5-STATE PIPELINE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-border/40 bg-zinc-950/40">
        <div>
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Compass className="size-3.5 text-primary" /> Architecture Alignment Score
          </div>
          <div className="text-[10px] text-muted-foreground">
            Structural conformance across active repository AST vs declared blueprints
          </div>
        </div>

        <div className="text-xl font-mono font-bold text-emerald-400">
          {driftEval.summary.overallDriftScore}/100
        </div>
      </div>

      {/* 5-STAGE STATE LIFECYCLE */}
      <div className="flex items-center justify-between p-2 rounded-lg border border-border/30 bg-zinc-900/30 text-[10px] font-mono overflow-x-auto">
        <span className="text-emerald-400 font-bold">1. INTENDED</span>
        <ArrowRight className="size-2.5 text-muted-foreground" />
        <span className="text-primary font-bold">2. DECLARED</span>
        <ArrowRight className="size-2.5 text-muted-foreground" />
        <span className="text-indigo-300 font-bold">3. IMPLEMENTED</span>
        <ArrowRight className="size-2.5 text-muted-foreground" />
        <span className="text-amber-400 font-bold">4. DEPLOYED</span>
        <ArrowRight className="size-2.5 text-muted-foreground" />
        <span className="text-rose-400 font-bold">5. OBSERVED</span>
      </div>

      {/* DRIFT FINDINGS LIST */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {driftEval.findings.map((finding) => (
          <div
            key={finding.id}
            onClick={() => handleInspectInDrawer(finding)}
            className={cn(
              "p-2.5 rounded-lg border text-xs cursor-pointer transition-colors space-y-1.5",
              selectedFinding.id === finding.id
                ? "border-primary bg-primary/10"
                : "border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                <AlertTriangle className="size-3 text-amber-400 shrink-0" />
                {finding.title}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] font-mono shrink-0",
                  finding.severity === "CRITICAL"
                    ? "text-rose-400 border-rose-500/20 bg-rose-500/10"
                    : finding.severity === "HIGH"
                      ? "text-orange-400 border-orange-500/20 bg-orange-500/10"
                      : "text-amber-400 border-amber-500/20 bg-amber-500/10",
                )}
              >
                {finding.severity}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">{finding.observedState}</p>
          </div>
        ))}
      </div>

      {/* ACTIVE DRIFT INVESTIGATION & ACTION CONTROLS */}
      <div className="p-3 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Compass className="size-3.5 text-primary" /> Active Investigation: {selectedFinding.id}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-5 px-1.5 text-[9px] gap-1 font-mono"
            onClick={() => handleInspectInDrawer(selectedFinding)}
          >
            <Sparkles className="size-2 text-primary" /> Full Investigation in Drawer
          </Button>
        </div>

        <div className="text-[11px] text-muted-foreground space-y-1 bg-zinc-900/30 p-2 rounded border border-border/20">
          <div>Expected: <span className="font-mono text-foreground">{selectedFinding.expectedState}</span></div>
          <div>Actual: <span className="font-mono text-amber-300">{selectedFinding.observedState}</span></div>
          <div>Confidence: <span className="font-mono text-emerald-400">{Math.round(selectedFinding.confidence * 100)}%</span></div>
        </div>

        {/* 5 AUTHORIZED ACTIONS */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRemediate(selectedFinding)}
            className="h-6 px-2 text-[10px] font-mono text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
          >
            Remediate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulate(selectedFinding)}
            className="h-6 px-2 text-[10px] font-mono text-primary border-primary/30 hover:bg-primary/10"
          >
            Simulate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCreateDecision(selectedFinding)}
            className="h-6 px-2 text-[10px] font-mono text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
          >
            Create ADR
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAcceptRisk(selectedFinding)}
            className="h-6 px-2 text-[10px] font-mono text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
          >
            Accept Risk
          </Button>
        </div>
      </div>
    </div>
  );
}
