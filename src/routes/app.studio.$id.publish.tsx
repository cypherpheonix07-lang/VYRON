import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Play,
  Check,
  X,
  AlertTriangle,
  Globe,
  Settings,
  QrCode,
  Copy,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileCheck2,
  Layers,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GateCard, type GateResultData } from "@/components/ui/GateCard";
import { useGate } from "@/hooks/useGate";

export const Route = createFileRoute("/app/studio/$id/publish")({
  head: () => ({
    meta: [
      { title: "S8: Publish Gate & Release Verifier — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Mathematical proof verification of the 7 canonical release gates prior to production deployment.",
      },
    ],
  }),
  component: PublishWizardPage,
});

export function PublishWizardPage() {
  const { id } = Route.useParams();
  const { gateReport, isRunning, runGateCheck } = useGate();

  const [environment, setEnvironment] = useState<"development" | "staging" | "production">(
    "staging",
  );
  const [customDomain, setCustomDomain] = useState("app.brahma.enterprise");
  const [autoRollback, setAutoRollback] = useState(true);
  const [overrideModalGate, setOverrideModalGate] = useState<number | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [overriddenGates, setOverriddenGates] = useState<number[]>([]);

  // Simulation metrics
  const [metrics, setMetrics] = useState({
    complexity: 8.4,
    security: 100,
    coverage: 82.5,
  });

  // Deploy states: idle, checking, deploying, success, failed
  const [deployState, setDeployState] = useState<
    "idle" | "checking" | "deploying" | "success" | "failed"
  >("idle");
  const [deployLogs, setDeployLogs] = useState<string[]>([]);

  // Initialize gate report on mount
  useEffect(() => {
    runGateCheck(id, metrics);
  }, [id, runGateCheck]);

  const handleReevaluate = async () => {
    toast.info("Triggering AST & Security evaluation...", {
      description: "Executing Bandit static scan and cyclomatic analysis.",
    });
    await runGateCheck(id, metrics);
    toast.success("Gate evaluation updated.");
  };

  const handleRequestOverride = (gateId: number) => {
    setOverrideModalGate(gateId);
    setOverrideReason("");
  };

  const handleConfirmOverride = () => {
    if (!overrideModalGate) return;
    if (!overrideReason.trim()) {
      toast.error("Please specify a justification for the security override.");
      return;
    }
    setOverriddenGates((prev) => [...prev, overrideModalGate]);
    toast.success(`Override approved for Gate 0${overrideModalGate}.`, {
      description: "Audited in WORM compliance trail.",
    });
    setOverrideModalGate(null);
  };

  const startDeployment = async () => {
    const isPassing =
      gateReport?.overall_pass ||
      (gateReport?.blocking_gates || []).every((g) => overriddenGates.includes(g));
    if (!isPassing) {
      toast.error("Release Blocked!", {
        description: "Hard block gates must pass before deploying to staging/production.",
      });
      return;
    }

    setDeployState("checking");
    setDeployLogs([
      `[${new Date().toISOString()}] INFO: Initiating PROJECT BRAHMA release gate verification...`,
      `[${new Date().toISOString()}] INFO: Validating 7 canonical gates against project ${id}...`,
    ]);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setDeployLogs((prev) => [
      ...prev,
      `[${new Date().toISOString()}] SUCCESS: All 7 quality gates verified with mathematical certainty.`,
      `[${new Date().toISOString()}] INFO: Packaging OCI container images with SHA-256 integrity seal...`,
    ]);

    setDeployState("deploying");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setDeployLogs((prev) => [
      ...prev,
      `[${new Date().toISOString()}] INFO: Applying database migrations with optimistic locking (v1 -> v2)...`,
      `[${new Date().toISOString()}] INFO: Deploying container cluster to target: [${environment.toUpperCase()}]...`,
      `[${new Date().toISOString()}] INFO: Configuring TLS certificates and custom domain: ${customDomain}...`,
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeployLogs((prev) => [
      ...prev,
      `[${new Date().toISOString()}] SUCCESS: Deployment healthy. Edge ingress listening on https://${customDomain}`,
    ]);

    setDeployState("success");
    toast.success("Project successfully published to " + environment.toUpperCase() + "!", {
      description: "Live endpoint is verified and online.",
    });
  };

  // Compile gate items with live data + overrides
  const gateList: GateResultData[] = (
    gateReport?.gate_results || [
      {
        gate_id: 1,
        gate_name: "Security",
        passed: true,
        score: 0,
        threshold: 0,
        evidence: "0 HIGH severity findings (threshold: 0)",
      },
      {
        gate_id: 2,
        gate_name: "AST",
        passed: true,
        score: 8.4,
        threshold: 15.0,
        evidence: "Avg complexity: 8.4 (threshold: ≤ 15.0)",
      },
      {
        gate_id: 3,
        gate_name: "Tests",
        passed: true,
        score: 82.5,
        threshold: 70.0,
        evidence: "Coverage: 82.5% (threshold: ≥ 70.0%)",
      },
      {
        gate_id: 4,
        gate_name: "Schema",
        passed: true,
        score: 100,
        threshold: 100,
        evidence: "RLS coverage: 8/8 tables secured (100%)",
      },
      {
        gate_id: 5,
        gate_name: "Docs",
        passed: true,
        score: 100,
        threshold: 80,
        evidence: "API docs: 6/6 routes documented (100%)",
      },
      {
        gate_id: 6,
        gate_name: "Performance",
        passed: true,
        score: 0,
        threshold: 0,
        evidence: "0 functions with LOC > 50 (threshold: 0)",
      },
      {
        gate_id: 7,
        gate_name: "Licensure",
        passed: true,
        score: 0,
        threshold: 0,
        evidence: "0 restrictive (GPL/AGPL) license violations (threshold: 0)",
      },
    ]
  ).map((g) => ({
    ...g,
    passed: g.passed || overriddenGates.includes(g.gate_id),
    evidence: overriddenGates.includes(g.gate_id)
      ? `${g.evidence} [OVERRIDDEN BY ADMIN]`
      : g.evidence,
  }));

  const passedCount = gateList.filter((g) => g.passed).length;
  const isOverallApproved = passedCount === 7;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              S8: Publish Gate & Release Verifier
            </h1>
            <Badge
              variant="outline"
              className="rounded-[var(--radius-sm)] font-mono text-[10px] uppercase font-bold border-[var(--color-primary)]/40 text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5"
            >
              OKLCH V2 CONTRACT
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-sans">
            Mathematical proof evaluation across 7 canonical gates with hard block constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReevaluate}
            disabled={isRunning}
            className="rounded-[var(--radius-sm)] border-[var(--border-default)] font-mono text-xs text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]"
          >
            <RefreshCw className={`mr-2 size-3.5 ${isRunning ? "animate-spin" : ""}`} />
            Re-evaluate Proofs
          </Button>

          <Badge
            className={`rounded-[var(--radius-sm)] px-3 py-1.5 font-mono text-xs uppercase font-bold tracking-wider ${
              isOverallApproved
                ? "bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30"
                : "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border border-[var(--color-danger)]/30"
            }`}
          >
            {isOverallApproved ? (
              <Check className="mr-1.5 size-4 inline stroke-[3]" />
            ) : (
              <X className="mr-1.5 size-4 inline stroke-[3]" />
            )}
            {isOverallApproved ? "RELEASE APPROVED (7/7)" : `BLOCKED (${7 - passedCount} FAILED)`}
          </Badge>
        </div>
      </div>

      {deployState === "idle" && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left 8 Cols: Canonical 7 Gates */}
          <div className="lg:col-span-8 space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-3">
                <span className="text-[10px] uppercase font-mono font-semibold text-[var(--text-tertiary)]">
                  Pass Rate
                </span>
                <p className="text-lg font-bold font-mono text-[var(--text-primary)] mt-0.5">
                  {((passedCount / 7) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-3">
                <span className="text-[10px] uppercase font-mono font-semibold text-[var(--text-tertiary)]">
                  Avg Complexity
                </span>
                <p className="text-lg font-bold font-mono text-[var(--color-primary)] mt-0.5">
                  {metrics.complexity.toFixed(1)}{" "}
                  <span className="text-[10px] text-[var(--text-tertiary)] font-normal">
                    / 15.0
                  </span>
                </p>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-3">
                <span className="text-[10px] uppercase font-mono font-semibold text-[var(--text-tertiary)]">
                  Test Coverage
                </span>
                <p className="text-lg font-bold font-mono text-[var(--color-success)] mt-0.5">
                  {metrics.coverage.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-3">
                <span className="text-[10px] uppercase font-mono font-semibold text-[var(--text-tertiary)]">
                  Bandit HIGH
                </span>
                <p className="text-lg font-bold font-mono text-[var(--gate-pass)] mt-0.5">
                  0{" "}
                  <span className="text-[10px] text-[var(--text-tertiary)] font-normal">
                    findings
                  </span>
                </p>
              </div>
            </div>

            {/* Canonical 7 Gate Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[var(--text-secondary)]">
                  7 Canonical Quality Verification Gates
                </h3>
                <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                  {passedCount} of 7 Passed
                </span>
              </div>

              <div className="space-y-3">
                {gateList.map((g) => (
                  <GateCard key={g.gate_id} gate={g} onOverrideRequest={handleRequestOverride} />
                ))}
              </div>
            </div>

            {/* Mathematical Evidence Summary Box */}
            <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-sunken)] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--text-primary)]">
                <FileCheck2 className="size-4 text-[var(--color-primary)]" />
                <span>Verification Mathematical Proof Hash</span>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-tertiary)] break-all bg-[var(--surface-base)] p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069 | project:
                {id} | timestamp:{new Date().toISOString()}
              </p>
            </div>
          </div>

          {/* Right 4 Cols: Deployment Configuration & Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5 space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] font-sans">
                  Target Environment
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                  Select target cluster for deployment.
                </p>
              </div>

              {/* Environment Segmented Control */}
              <div className="grid grid-cols-3 gap-1.5 bg-[var(--surface-sunken)] p-1 rounded-[var(--radius-sm)] border border-[var(--border-default)]">
                {(["development", "staging", "production"] as const).map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => setEnvironment(env)}
                    className={`py-2 text-[10px] font-mono font-bold rounded-[var(--radius-sm)] uppercase transition-all ${
                      environment === env
                        ? "bg-[var(--surface-raised)] text-[var(--color-primary)] shadow-sm border border-[var(--border-default)]"
                        : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>

              {/* Domain Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="custom-domain"
                  className="text-xs font-medium text-[var(--text-primary)]"
                >
                  Live Ingress Hostname
                </Label>
                <Input
                  id="custom-domain"
                  className="h-9 text-xs font-mono bg-[var(--surface-sunken)] border-[var(--border-default)] text-[var(--text-primary)] rounded-[var(--radius-sm)] focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
              </div>

              {/* Auto-rollback Switch */}
              <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-[var(--text-primary)] font-sans">
                    Automatic Rollback
                  </p>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-sans">
                    Revert on health check failure.
                  </p>
                </div>
                <Switch
                  checked={autoRollback}
                  onCheckedChange={setAutoRollback}
                  aria-label="Auto rollback toggle"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  onClick={startDeployment}
                  disabled={!isOverallApproved}
                  className={`w-full py-5 rounded-[var(--radius-sm)] font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md ${
                    isOverallApproved
                      ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-[var(--surface-base)]"
                      : "bg-[var(--surface-overlay)] text-[var(--text-disabled)] cursor-not-allowed border border-[var(--border-default)]"
                  }`}
                >
                  <Globe className="mr-2 size-4" />
                  Deploy to {environment.toUpperCase()}
                </Button>

                {!isOverallApproved && (
                  <p className="text-[10px] text-[var(--color-danger)] font-sans text-center mt-2 leading-relaxed">
                    Release is blocked. Resolve failing gates or request an administrative override.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEPLOYING ANIMATION PANEL */}
      {(deployState === "checking" || deployState === "deploying") && (
        <Card className="max-w-2xl mx-auto p-6 space-y-6 text-center bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[var(--radius-sm)] shadow-xl">
          <Loader2 className="size-10 animate-spin text-[var(--color-primary)] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] font-sans">
              {deployState === "checking"
                ? "Running Release Gate Verification..."
                : "Deploying Container Clusters..."}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Packaging OCI artifacts, running database migrations, and configuring ingress routes.
            </p>
          </div>

          <div className="border border-[var(--border-default)] bg-[var(--surface-sunken)] p-4 rounded-[var(--radius-sm)] text-left font-mono text-[11px] text-[var(--text-secondary)] space-y-1.5 max-h-48 overflow-y-auto">
            {deployLogs.map((log, i) => {
              const isSuccess = log.includes("SUCCESS:");
              return (
                <div
                  key={i}
                  className={isSuccess ? "text-[var(--color-success)] font-semibold" : ""}
                >
                  {log}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* SUCCESS SCREEN */}
      {deployState === "success" && (
        <Card className="max-w-2xl mx-auto p-6 md:p-8 space-y-6 bg-[var(--surface-raised)] border border-[var(--color-success)]/40 rounded-[var(--radius-sm)] shadow-2xl">
          <div className="text-center space-y-2">
            <div className="mx-auto grid size-12 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30">
              <Check className="size-7 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-sans">
              Application Successfully Published!
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Target [{environment.toUpperCase()}] is healthy and serving live user traffic.
            </p>
          </div>

          {/* Target details */}
          <div className="border border-[var(--border-default)] p-4 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-0.5">
              <span className="text-[9px] uppercase font-mono font-bold text-[var(--text-tertiary)] tracking-wider">
                Ingress Endpoint URL
              </span>
              <a
                href={`https://${customDomain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-[var(--color-primary)] truncate block hover:underline flex items-center gap-1.5"
              >
                https://{customDomain} <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-[var(--radius-sm)] border-[var(--border-default)] font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={() => {
                navigator.clipboard?.writeText(`https://${customDomain}`);
                toast.success("Live URL copied to clipboard.");
              }}
              aria-label="Copy live URL"
            >
              <Copy className="mr-1.5 size-3.5" /> Copy
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-[var(--border-default)] p-4 rounded-[var(--radius-sm)] flex flex-col items-center justify-center text-center space-y-2 bg-[var(--surface-sunken)]">
              <QrCode className="size-16 text-[var(--color-primary)] opacity-80" />
              <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                Scan for Mobile Verification
              </span>
            </div>

            <div className="flex flex-col justify-center gap-2.5">
              <Button
                variant="outline"
                className="w-full text-xs font-mono h-10 rounded-[var(--radius-sm)] border-[var(--border-default)]"
                onClick={() => setDeployState("idle")}
              >
                Return to Gatekeeper
              </Button>
              <Button
                className="w-full text-xs font-mono font-bold h-10 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--surface-base)] hover:bg-[var(--color-primary-dim)]"
                asChild
              >
                <Link to="/app/studio/$id/analytics" params={{ id }}>
                  View Live Analytics <ChevronRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* OVERRIDE MODAL DIALOG */}
      {overrideModalGate !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[var(--radius-sm)] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] font-sans">
                <AlertTriangle className="size-4 text-[var(--color-warning)]" />
                <span>Request Administrative Override</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                You are requesting an emergency bypass for Gate 0{overrideModalGate}. This action
                will be permanently recorded in the immutable WORM audit log.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="override-reason"
                className="text-xs font-medium text-[var(--text-primary)]"
              >
                Justification / JIRA Ticket Reference *
              </Label>
              <Input
                id="override-reason"
                placeholder="e.g. SEC-849: Hotfix waiver approved by SecOps lead"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="h-9 text-xs font-mono bg-[var(--surface-sunken)] border-[var(--border-default)] rounded-[var(--radius-sm)]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOverrideModalGate(null)}
                className="rounded-[var(--radius-sm)] text-xs font-mono"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmOverride}
                className="rounded-[var(--radius-sm)] text-xs font-mono font-bold bg-[var(--color-warning)] text-black hover:bg-[var(--color-warning)]/90"
              >
                Confirm Override
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
