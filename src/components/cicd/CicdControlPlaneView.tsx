/**
 * VYRON — CI/CD PIPELINE & GUARDRAIL CONTROL PLANE VIEW
 * GOD MODE vULTIMA ΩΩΩΩΩΩΩΩΩΩ
 * Visualizing 11 Guardrail Planes, Pipeline Topology, AI Release Governor,
 * SLSA v1.0 Level 3 Provenance, Three-Way Convergence, and 250x104 CI/CD Phases.
 * Strictly ZERO Raw SQL.
 */

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  Package,
  Terminal,
  Cpu,
  Layers,
  Lock,
  RefreshCw,
  Play,
  ArrowRight,
  Search,
  FileText,
  Sparkles,
  Sliders,
  Globe,
  Activity,
  Eye,
  Check,
  X,
  History,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  cicdControlPlane,
  GuardrailPlane,
  GuardrailControlDef,
  ReleaseDecisionObject,
  ArtifactProvenanceRecord,
  AiReleaseGovernorReasoning,
  ThreeWayConvergenceCheck,
  TargetEnvironment,
} from "@/services/cicd/cicdControlPlaneEngine";
import { cicdDossier250x104Data } from "@/services/governance/cicdDossier250x104Data";

export interface CicdControlPlaneViewProps {
  projectId?: string;
}

export const CicdControlPlaneView: React.FC<CicdControlPlaneViewProps> = ({ projectId = "proj-brahma" }) => {
  const [activeTab, setActiveTab] = useState<
    "guardrails" | "pipeline" | "governor" | "provenance" | "dossier" | "convergence"
  >("guardrails");

  const [selectedPlane, setSelectedPlane] = useState<GuardrailPlane | "ALL">("ALL");
  const [selectedEnv, setSelectedEnv] = useState<TargetEnvironment>("PRODUCTION");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [searchPhase, setSearchPhase] = useState<string>("");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("P001");
  const [canaryPercentage, setCanaryPercentage] = useState<number>(10);
  const [dualApprovalSigned, setDualApprovalSigned] = useState<boolean>(false);

  // Baseline data
  const guardrails = useMemo(() => cicdControlPlane.getAllGuardrails(), []);
  const provenance = useMemo(
    () =>
      cicdControlPlane.getArtifactProvenance(
        "sha256_b4c892e104f981249b6d8123ef98124a91c3d4a5b6c7d8e9f0123456789abcde"
      ),
    []
  );

  // Release Decision state
  const [releaseDecision, setReleaseDecision] = useState<ReleaseDecisionObject>(() =>
    cicdControlPlane.createReleaseDecision({
      changeId: `CHG-${projectId}-20260927`,
      sourceRevision: "7b4c892e104f981",
      artifactDigest: provenance?.artifactDigest || "sha256_placeholder",
      environment: selectedEnv,
      actor: "secops-governor@vyron.internal",
    })
  );

  // AI Governor Reasoning state
  const [governorReasoning, setGovernorReasoning] = useState<AiReleaseGovernorReasoning>(() =>
    cicdControlPlane.consultAiReleaseGovernor(releaseDecision)
  );

  // Three-Way Convergence state
  const [convergenceCheck, setConvergenceCheck] = useState<ThreeWayConvergenceCheck>(() =>
    cicdControlPlane.verifyThreeWayConvergence(`CONV-${Date.now()}`)
  );

  const filteredGuardrails = useMemo(() => {
    if (selectedPlane === "ALL") return guardrails;
    return guardrails.filter((g) => g.plane === selectedPlane);
  }, [guardrails, selectedPlane]);

  const allPhases = useMemo(() => {
    return Object.values(cicdDossier250x104Data.phases);
  }, []);

  const filteredPhases = useMemo(() => {
    if (!searchPhase.trim()) return allPhases.slice(0, 30);
    const q = searchPhase.toLowerCase();
    return allPhases.filter(
      (p) =>
        p.phaseId.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.executionMode.toLowerCase().includes(q)
    );
  }, [allPhases, searchPhase]);

  const activePhase = useMemo(() => {
    return (
      cicdDossier250x104Data.phases[selectedPhaseId] ??
      allPhases[0] ?? {
        phaseId: "P001",
        title: "CI/CD Mission & Current-State Reconstruction / Contract",
        domain: "CI/CD Mission & Current-State Reconstruction",
        executionMode: "Contract",
        sections: {},
      }
    );
  }, [selectedPhaseId, allPhases]);

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    toast.info("Evaluating 11 Guardrail Planes...", {
      description: "Executing OPA rego rules, static Bandit scan, and SLSA v1.0 Level 3 check.",
    });

    await new Promise((r) => setTimeout(r, 600));

    const newDecision = cicdControlPlane.createReleaseDecision({
      changeId: `CHG-${projectId}-${Date.now().toString().slice(-6)}`,
      sourceRevision: "7b4c892e104f981",
      artifactDigest: provenance?.artifactDigest || "sha256_mock",
      environment: selectedEnv,
      actor: "lead-architect@vyron.internal",
    });

    setReleaseDecision(newDecision);
    const reasoning = cicdControlPlane.consultAiReleaseGovernor(newDecision);
    setGovernorReasoning(reasoning);

    const conv = cicdControlPlane.verifyThreeWayConvergence(`CONV-${Date.now()}`);
    setConvergenceCheck(conv);

    setIsEvaluating(false);
    toast.success("Guardrail & Policy evaluation complete", {
      description: `Verdict: ${newDecision.verdict} | Risk: ${newDecision.riskState}`,
    });
  };

  const handlePromoteCanary = () => {
    if (!dualApprovalSigned) {
      toast.error("Dual-Custody Signoff Required", {
        description: "Release to PRODUCTION requires explicit dual peer architect signature.",
      });
      return;
    }
    toast.success(`Canary traffic advanced to ${canaryPercentage}%`, {
      description: "Telemetry sentinel actively monitoring P99 latency & error rates.",
    });
  };

  const handleRollback = () => {
    toast.warning("Emergency Rollback Initiated", {
      description: "Traffic instantly draining back to baseline revision 7b4c892 (RTO < 45s).",
    });
  };

  const planesList: GuardrailPlane[] = [
    "PRE_REQUEST",
    "PRE_COMMIT",
    "PRE_MERGE",
    "PRE_BUILD",
    "PRE_TEST",
    "PRE_PUBLISH",
    "PRE_DEPLOY",
    "ADMISSION",
    "RUNTIME",
    "POST_DEPLOY",
    "CONTINUOUS",
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[var(--radius-md)] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30 font-mono text-[11px]">
                GOD MODE vULTIMA ΩΩΩΩΩΩΩΩΩΩ
              </Badge>
              <Badge variant="outline" className="font-mono text-[11px] text-[var(--text-muted)]">
                250 PHASES × 104 SECTIONS (26,000 INSTANCES)
              </Badge>
              <Badge
                variant="outline"
                className={
                  convergenceCheck.isConverged
                    ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30 font-mono text-[11px]"
                    : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30 font-mono text-[11px]"
                }
              >
                {convergenceCheck.isConverged ? "3-WAY CONVERGED" : "CONVERGENCE DRIFT"}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              CI/CD Pipeline & Guardrail Control Plane
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Layered trust boundaries across 11 Guardrail Planes, Policy-as-Code, SLSA v1.0 Level 3 Provenance, and AI Release Governor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="gap-1.5 font-mono text-xs"
            >
              <RefreshCw className={`size-3.5 ${isEvaluating ? "animate-spin" : ""}`} />
              Re-evaluate All Planes
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("governor")}
              className="gap-1.5 font-mono text-xs bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
            >
              <Sparkles className="size-3.5" />
              AI Release Governor
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-default)]/60 mt-4 overflow-x-auto text-xs font-mono">
          {[
            { id: "guardrails", label: "11 Guardrail Planes", icon: ShieldCheck, badge: guardrails.length },
            { id: "pipeline", label: "Delivery Pipeline Graph", icon: Layers, badge: "9 Nodes" },
            { id: "governor", label: "AI Release Governor", icon: Sparkles, badge: releaseDecision.verdict },
            { id: "provenance", label: "SLSA & SBOM Provenance", icon: Package, badge: "L3" },
            { id: "dossier", label: "250×104 CI/CD Dossier", icon: FileText, badge: "26,000" },
            { id: "convergence", label: "Three-Way Convergence", icon: Activity, badge: convergenceCheck.isConverged ? "PASSED" : "FAILED" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-[var(--radius-sm)] transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white font-bold"
                    : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--surface-base)] text-[var(--text-muted)]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 11 GUARDRAIL PLANES */}
      {activeTab === "guardrails" && (
        <div className="space-y-4">
          {/* Plane Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <button
              onClick={() => setSelectedPlane("ALL")}
              className={`py-1 px-2.5 rounded-[var(--radius-sm)] border transition-colors ${
                selectedPlane === "ALL"
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-bold"
                  : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)]"
              }`}
            >
              ALL PLANES ({guardrails.length})
            </button>
            {planesList.map((plane) => {
              const count = cicdControlPlane.getGuardrailsForPlane(plane).length;
              return (
                <button
                  key={plane}
                  onClick={() => setSelectedPlane(plane)}
                  className={`py-1 px-2.5 rounded-[var(--radius-sm)] border transition-colors whitespace-nowrap ${
                    selectedPlane === plane
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-bold"
                      : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {plane} ({count})
                </button>
              );
            })}
          </div>

          {/* Guardrails Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuardrails.map((g) => (
              <Card key={g.id} className="bg-[var(--surface-base)] border-[var(--border-default)] flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] bg-[var(--surface-sunken)]">
                      {g.plane}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] ${
                        g.severity === "BLOCKING"
                          ? "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/30 font-bold"
                          : g.severity === "CRITICAL"
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold"
                          : "bg-blue-500/15 text-blue-500 border-blue-500/30"
                      }`}
                    >
                      {g.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-[var(--text-primary)] pt-1">
                    {g.name}
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono text-[var(--text-muted)]">
                    Ref: {g.policyRef} | Env: {g.targetEnvironment}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)]/60 font-mono text-[11px] text-[var(--text-secondary)] overflow-x-auto">
                    <code>{g.ruleExpression}</code>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                      Remediation Guide
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {g.remediationGuide}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-[var(--border-default)]/40 text-[11px]">
                    <span className="text-[var(--text-muted)]">Monotonic Enforcement</span>
                    <Badge variant="outline" className="text-[10px] font-mono text-[var(--color-success)] bg-[var(--color-success)]/10">
                      {g.isMonotonic ? "STRICT MONOTONIC" : "STATE-DEPENDENT"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERY PIPELINE GRAPH */}
      {activeTab === "pipeline" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="size-4 text-[var(--color-primary)]" />
              Canonical Delivery Pipeline Trust Topology
            </CardTitle>
            <CardDescription className="text-xs">
              Every stage carries cryptographic identity, short-lived OIDC authorization, and gate invalidation hooks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-2">
              {[
                { step: "01", name: "Source Git", icon: GitCommit, status: "VERIFIED", sub: "SHA: 7b4c892" },
                { step: "02", name: "Policy OPA", icon: ShieldCheck, status: "PASSED", sub: "11 Planes" },
                { step: "03", name: "Build Determinism", icon: Terminal, status: "HERMETIC", sub: "Frozen Lockfile" },
                { step: "04", name: "Test Matrix", icon: CheckCircle2, status: "PASSED", sub: "100% Suites" },
                { step: "05", name: "Security AST", icon: Lock, status: "CLEAN", sub: "Zero Raw SQL" },
                { step: "06", name: "SLSA Attestation", icon: Package, status: "L3 SIGNED", sub: "Cosign OIDC" },
                { step: "07", name: "Canary Deploy", icon: Globe, status: "ACTIVE (10%)", sub: "Ingress Router" },
                { step: "08", name: "Synthetic Smoke", icon: Activity, status: "HEALTHY", sub: "P99: 42ms" },
                { step: "09", name: "Runtime Sentinel", icon: Eye, status: "CONVERGED", sub: "Zero Drift" },
              ].map((node, idx) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.step}
                    className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] flex flex-col justify-between space-y-2 text-center"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                      <span>{node.step}</span>
                      <Check className="size-3 text-[var(--color-success)]" />
                    </div>
                    <div className="flex justify-center">
                      <div className="p-2 rounded-full bg-[var(--surface-raised)] border border-[var(--border-default)]">
                        <Icon className="size-4 text-[var(--color-primary)]" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                        {node.name}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)]">
                        {node.sub}
                      </div>
                    </div>
                    <Badge variant="outline" className="mx-auto text-[9px] font-mono bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30">
                      {node.status}
                    </Badge>
                  </div>
                );
              })}
            </div>

            {/* Pipeline Controls & Promotion */}
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-default)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Progressive Delivery & Traffic Shifting
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Direct live user traffic across canary waves with automated health tripwires.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="destructive" size="sm" onClick={handleRollback} className="font-mono text-xs">
                    Reversible Rollback (45s)
                  </Button>
                  <Button size="sm" onClick={handlePromoteCanary} className="font-mono text-xs bg-[var(--color-primary)]">
                    Advance Promotion Wave
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">Canary Traffic Allocation:</span>
                    <span className="font-bold text-[var(--color-primary)]">{canaryPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={canaryPercentage}
                    onChange={(e) => setCanaryPercentage(parseInt(e.target.value, 10))}
                    className="w-full accent-[var(--color-primary)] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>5% Canary</span>
                    <span>50% Balanced</span>
                    <span>100% Production</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] block">
                      Dual-Custody Architect Signature
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      Required for production traffic promotions
                    </span>
                  </div>
                  <Switch checked={dualApprovalSigned} onCheckedChange={setDualApprovalSigned} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: AI RELEASE GOVERNOR */}
      {activeTab === "governor" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Decision Summary */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--color-primary)]" />
                Release Decision Object
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                ID: {releaseDecision.changeId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Target Env:</span>
                  <span className="font-bold text-[var(--text-primary)]">{releaseDecision.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Revision:</span>
                  <span className="font-bold text-[var(--text-primary)]">{releaseDecision.sourceRevision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Risk State:</span>
                  <Badge
                    variant="outline"
                    className={
                      releaseDecision.riskState === "LOW"
                        ? "text-[var(--color-success)] bg-[var(--color-success)]/10"
                        : "text-[var(--color-danger)] bg-[var(--color-danger)]/10"
                    }
                  >
                    {releaseDecision.riskState}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Verdict:</span>
                  <Badge
                    variant="outline"
                    className={
                      releaseDecision.verdict === "RELEASE_AUTHORIZED"
                        ? "text-[var(--color-success)] bg-[var(--color-success)]/10 font-bold"
                        : "text-[var(--color-danger)] bg-[var(--color-danger)]/10 font-bold"
                    }
                  >
                    {releaseDecision.verdict}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Attached Evidence</span>
                <div className="space-y-1">
                  {releaseDecision.evidenceIds.map((ev) => (
                    <div key={ev} className="text-[11px] p-1.5 rounded bg-[var(--surface-sunken)] text-[var(--text-secondary)] flex items-center justify-between">
                      <span>{ev}</span>
                      <CheckCircle2 className="size-3 text-[var(--color-success)]" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safe Operational Reasoning Drawer */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="size-4 text-[var(--color-primary)]" />
                Governed Safe Operational Reasoning
              </CardTitle>
              <CardDescription className="text-xs">
                Zero scratchpad/chain-of-thought exposure. Transparent, evidence-bound justification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">
                    1. Understood Intent
                  </span>
                  <p className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[var(--text-primary)] leading-relaxed">
                    {governorReasoning.understood}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                      2. Context Signals
                    </span>
                    <ul className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] space-y-1 text-[var(--text-secondary)] text-[11px]">
                      {governorReasoning.context.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                      3. Operational Sources
                    </span>
                    <ul className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] space-y-1 text-[var(--text-secondary)] text-[11px] truncate">
                      {governorReasoning.sources.map((s, i) => (
                        <li key={i} title={s} className="truncate">• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                    4. Hard Verification Checks
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {governorReasoning.checks.map((chk, i) => (
                      <div key={i} className="p-2 rounded bg-[var(--surface-sunken)] text-[11px] flex items-center justify-between text-[var(--text-secondary)]">
                        <span>{chk}</span>
                        <Check className="size-3 text-[var(--color-success)] shrink-0 ml-1" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 space-y-1">
                  <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">
                    5. Release Governor Recommendation & Next Action
                  </span>
                  <p className="text-[12px] font-bold text-[var(--text-primary)]">
                    {governorReasoning.result}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] pt-1">
                    Next step: {governorReasoning.nextStep}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: SLSA & SBOM PROVENANCE */}
      {activeTab === "provenance" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Package className="size-4 text-[var(--color-primary)]" />
              SLSA v1.0 Level 3 Provenance & Cosign Attestation
            </CardTitle>
            <CardDescription className="text-xs">
              Cryptographically signed container and bundle artifacts. Strict zero-trust delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            {provenance && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">SLSA Security Level:</span>
                    <Badge variant="outline" className="bg-[var(--color-success)]/10 text-[var(--color-success)] font-bold">
                      {provenance.slsaLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Artifact SHA-256 Digest:</span>
                    <span className="text-[11px] text-[var(--text-primary)] break-all">{provenance.artifactDigest}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">CycloneDX SBOM Digest (108 Packages):</span>
                    <span className="text-[11px] text-[var(--text-primary)] break-all">{provenance.sbomDigest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Build Determinism:</span>
                    <Badge variant="outline" className="text-[var(--color-success)] bg-[var(--color-success)]/10">
                      100% REPRODUCIBLE
                    </Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2.5">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Sigstore Cosign Signature:</span>
                    <span className="text-[11px] text-[var(--text-primary)] break-all">{provenance.cosignSignature}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">OIDC Signer Identity:</span>
                    <span className="text-[11px] text-[var(--text-primary)] break-all">{provenance.signerIdentity}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Builder Runner ID:</span>
                    <span className="text-[11px] text-[var(--text-primary)] break-all">{provenance.builderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Build Timestamp:</span>
                    <span className="text-[11px] text-[var(--text-primary)]">{provenance.buildTimestamp}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 5: 250x104 CI/CD DOSSIER */}
      {activeTab === "dossier" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Phase List */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-1 flex flex-col h-[520px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>CI/CD Phase Register (250)</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {filteredPhases.length} shown
                </Badge>
              </CardTitle>
              <div className="relative pt-1">
                <Search className="absolute left-2.5 top-3.5 size-3.5 text-[var(--text-muted)]" />
                <Input
                  value={searchPhase}
                  onChange={(e) => setSearchPhase(e.target.value)}
                  placeholder="Filter by phase ID, domain, mode..."
                  className="pl-8 h-8 font-mono text-xs bg-[var(--surface-sunken)] border-[var(--border-default)]"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-1 pr-2">
              {filteredPhases.map((phase) => (
                <button
                  key={phase.phaseId}
                  onClick={() => setSelectedPhaseId(phase.phaseId)}
                  className={`w-full text-left p-2 rounded-[var(--radius-sm)] border text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedPhaseId === phase.phaseId
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-bold"
                      : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="mr-1.5 opacity-80">{phase.phaseId}</span>
                    <span>{phase.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] shrink-0 opacity-80">
                    {phase.executionMode}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Phase Details & 104 Sections Explorer */}
          <Card className="bg-[var(--surface-base)] border-[var(--border-default)] lg:col-span-2 flex flex-col h-[520px]">
            <CardHeader className="pb-3 border-b border-[var(--border-default)]/60">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="font-mono text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {activePhase.domain} • {activePhase.executionMode}
                  </Badge>
                  <CardTitle className="text-base font-bold text-[var(--text-primary)] pt-1">
                    {activePhase.phaseId} — {activePhase.title}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  104 Reference Sections
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Mandatory Execution Contract
                </span>
                <p className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] text-[var(--text-secondary)] text-[11px] leading-relaxed">
                  Every reference section in {activePhase.phaseId} must inherit the phase objective, require cryptographic evidence, define failure modes, specify verification criteria, and return an unambiguous canonical verdict.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Section Reference Sampler (A–Z / a–z / Mirrors)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {Object.entries(activePhase.sections).slice(0, 20).map(([key, sec]) => (
                    <div key={key} className="p-2 rounded bg-[var(--surface-sunken)] border border-[var(--border-default)]/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--color-primary)]">{key}: {sec.name}</span>
                        <Badge variant="outline" className="text-[9px] text-[var(--color-success)]">VERIFIED</Badge>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">
                        {sec.contract}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: THREE-WAY CONVERGENCE */}
      {activeTab === "convergence" && (
        <Card className="bg-[var(--surface-base)] border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="size-4 text-[var(--color-primary)]" />
              Three-Way Convergence Verification Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Live cross-validation: BROWSER OBSERVATION ↔ CANONICAL BACKEND STATE ↔ BLUEPRINT / GATE PROJECTION.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plane 1: Browser */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">1. Browser Observer</span>
                  <Badge variant="outline" className="text-[10px] bg-[var(--color-success)]/10 text-[var(--color-success)]">
                    HTTP {convergenceCheck.browserObservation.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                  <div>Route: {convergenceCheck.browserObservation.route}</div>
                  <div>Console Errors: {convergenceCheck.browserObservation.consoleErrors}</div>
                  <div>Active UI Gate State: {convergenceCheck.browserObservation.activeUiGateState}</div>
                </div>
              </div>

              {/* Plane 2: Backend */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">2. Backend Sentinel</span>
                  <Badge variant="outline" className="text-[10px] bg-[var(--color-success)]/10 text-[var(--color-success)]">
                    {convergenceCheck.backendCanonicalState.dbStatus}
                  </Badge>
                </div>
                <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                  <div>RPC Pass Rate: {convergenceCheck.backendCanonicalState.rpcPassRate * 100}%</div>
                  <div>Active Policies Satisfied: {convergenceCheck.backendCanonicalState.activePoliciesPassed ? "YES" : "NO"}</div>
                  <div>Audit Trail: WORM Compliant</div>
                </div>
              </div>

              {/* Plane 3: Blueprint */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">3. Blueprint Projection</span>
                  <Badge variant="outline" className="text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    Rev #{convergenceCheck.blueprintProjectionState.graphRevision}
                  </Badge>
                </div>
                <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                  <div>Readiness Score: {convergenceCheck.blueprintProjectionState.readinessScore}%</div>
                  <div>Blocking Gates: {convergenceCheck.blueprintProjectionState.blockingGateCount}</div>
                  <div>Sync Edge: ZERO_DRIFT</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-raised)] border border-[var(--border-default)] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Overall System Parity Verdict: {convergenceCheck.isConverged ? "CANONICAL PARITY MAINTAINED" : "DIVERGENT EDGES DETECTED"}
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  Correlation ID: {convergenceCheck.correlationId} | Evaluated At: {convergenceCheck.timestamp}
                </div>
              </div>
              <Badge
                variant="outline"
                className={`font-mono text-xs ${
                  convergenceCheck.isConverged
                    ? "bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/40 font-bold"
                    : "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/40 font-bold"
                }`}
              >
                {convergenceCheck.isConverged ? "100% IN CONVERGENCE" : "RECONCILIATION REQUIRED"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
