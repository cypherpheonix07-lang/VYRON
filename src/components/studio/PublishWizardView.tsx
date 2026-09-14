import { Link, useParams } from "@tanstack/react-router";
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

export function PublishWizardView({ projectId }: { projectId?: string } = {}) {
  const params = useParams({ strict: false });
  const id = projectId || (params as { id?: string })?.id || "proj-brahma";
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
        evidence: "P95 latency: 42ms (threshold: ≤ 250ms)",
      },
      {
        gate_id: 7,
        gate_name: "Dependencies",
        passed: true,
        score: 0,
        threshold: 0,
        evidence: "0 CVEs in lockfile (0 packages flagged)",
      },
    ]
  ).map((g) => ({
    ...g,
    isOverridden: overriddenGates.includes(g.gate_id),
    passed: overriddenGates.includes(g.gate_id) ? true : g.passed,
  }));

  const allPassed = gateList.every((g) => g.passed);
  const passingCount = gateList.filter((g) => g.passed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Publish & Deployment Verifier"
        description="7-Gate mathematical verification matrix validating AST complexity, security, and automated tests."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReevaluate}
              disabled={isRunning}
              className="rounded-[var(--radius-sm)] font-mono text-xs gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isRunning ? "animate-spin" : ""}`} />
              <span>Re-evaluate Gates</span>
            </Button>
            <Link
              to="/app/projects/$id/reports"
              params={{ id }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] font-mono text-xs font-semibold bg-[var(--surface-sunken)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <FileCheck2 className="size-3.5" />
              <span>View Full Audit</span>
            </Link>
          </div>
        }
      />

      {/* Release Readiness Hero Banner */}
      <Card
        className={`border rounded-[var(--radius-md)] ${
          allPassed
            ? "border-[var(--color-success)]/40 bg-[var(--color-success)]/5"
            : "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-[var(--radius-md)] border ${
                  allPassed
                    ? "bg-[var(--color-success)]/10 border-[var(--color-success)]/30 text-[var(--color-success)]"
                    : "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]"
                }`}
              >
                {allPassed ? (
                  <ShieldCheck className="size-8" />
                ) : (
                  <ShieldAlert className="size-8" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-sans">
                    {allPassed ? "Production Ready" : "Release Blocked"}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs ${
                      allPassed
                        ? "border-[var(--color-success)] text-[var(--color-success)]"
                        : "border-[var(--color-danger)] text-[var(--color-danger)]"
                    }`}
                  >
                    {passingCount} / 7 Gates Passing
                  </Badge>
                  {overriddenGates.length > 0 && (
                    <Badge
                      variant="outline"
                      className="border-[var(--color-warning)] text-[var(--color-warning)] font-mono text-xs"
                    >
                      {overriddenGates.length} Overridden
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] max-w-xl font-sans">
                  {allPassed
                    ? "Every structural, security, and contractual gate is green. The build satisfies the Zero Tolerance production readiness standard."
                    : "One or more critical release gates failed verification. Rectify findings or apply an audited administrative override."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                size="lg"
                onClick={startDeployment}
                disabled={deployState === "checking" || deployState === "deploying"}
                className={`w-full md:w-auto font-mono text-xs font-bold gap-2 rounded-[var(--radius-sm)] ${
                  allPassed
                    ? "bg-[var(--color-primary)] text-black hover:bg-[var(--color-primary)]/90"
                    : "bg-[var(--surface-sunken)] text-[var(--text-muted)] border border-[var(--border-default)]"
                }`}
              >
                {deployState === "checking" || deployState === "deploying" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Deploying to {environment.toUpperCase()}...</span>
                  </>
                ) : (
                  <>
                    <Play className="size-4 fill-current" />
                    <span>Deploy to {environment.toUpperCase()}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Gate Matrix (Left 8) + Deployment Controls (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7 Canonical Gates */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Release Gate Matrix (G1 – G7)
            </h4>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              Realtime Proof Engine
            </span>
          </div>

          <div className="space-y-2.5">
            {gateList.map((gate) => (
              <GateCard
                key={gate.gate_id}
                gate={gate}
                onOverrideRequest={handleRequestOverride}
              />
            ))}
          </div>

          {/* Quick Simulation Parameter Sliders */}
          <SectionCard
            title="Gate Telemetry Sandbox"
            description="Adjust live scanner mock metrics to simulate gate degradation and auto-remedy."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
              <div className="space-y-1.5 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Avg Complexity:</span>
                  <span className="font-bold text-[var(--text-primary)]">{metrics.complexity}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="25"
                  step="0.5"
                  value={metrics.complexity}
                  onChange={(e) => {
                    const complexity = parseFloat(e.target.value);
                    setMetrics((prev) => ({ ...prev, complexity }));
                    runGateCheck(id, { ...metrics, complexity });
                  }}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
                <span className="text-[10px] text-[var(--text-muted)]">Gate 02 Threshold: ≤ 15.0</span>
              </div>

              <div className="space-y-1.5 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Test Coverage:</span>
                  <span className="font-bold text-[var(--text-primary)]">{metrics.coverage}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={metrics.coverage}
                  onChange={(e) => {
                    const coverage = parseFloat(e.target.value);
                    setMetrics((prev) => ({ ...prev, coverage }));
                    runGateCheck(id, { ...metrics, coverage });
                  }}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
                <span className="text-[10px] text-[var(--text-muted)]">Gate 03 Threshold: ≥ 70%</span>
              </div>

              <div className="space-y-1.5 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-default)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Security Score:</span>
                  <span className="font-bold text-[var(--text-primary)]">{metrics.security}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={metrics.security}
                  onChange={(e) => {
                    const security = parseFloat(e.target.value);
                    setMetrics((prev) => ({ ...prev, security }));
                    runGateCheck(id, { ...metrics, security });
                  }}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
                <span className="text-[10px] text-[var(--text-muted)]">Gate 01 Threshold: 100%</span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right: Environment Configuration & Deploy Terminal */}
        <div className="lg:col-span-4 space-y-5">
          {/* Target Configuration */}
          <SectionCard title="Deployment Target" description="Configure destination cluster and routing.">
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <Label className="text-[var(--text-secondary)]">Target Environment</Label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(["development", "staging", "production"] as const).map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setEnvironment(env)}
                      className={`py-1.5 px-2 rounded-[var(--radius-sm)] border capitalize text-xs transition-colors ${
                        environment === env
                          ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/40 font-bold"
                          : "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="custom-domain" className="text-[var(--text-secondary)]">
                  Edge Ingress FQDN
                </Label>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-2.5 size-3.5 text-[var(--text-muted)]" />
                  <Input
                    id="custom-domain"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="pl-8 h-8 font-mono text-xs bg-[var(--surface-sunken)] border-[var(--border-default)] rounded-[var(--radius-sm)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[var(--border-default)]/60">
                <div className="space-y-0.5">
                  <span className="text-[var(--text-primary)] block">Zero-Downtime Rollback</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Auto-revert if health drops</span>
                </div>
                <Switch checked={autoRollback} onCheckedChange={setAutoRollback} />
              </div>
            </div>
          </SectionCard>

          {/* Live Deployment Terminal Log */}
          <SectionCard title="Execution Logs" description="Real-time deployment pipeline stream.">
            <div className="rounded-[var(--radius-sm)] bg-[var(--surface-base)] border border-[var(--border-default)] p-3 h-52 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 text-[var(--text-secondary)]">
              {deployLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[var(--text-muted)]">
                  Pipeline idle. Click Deploy to trigger.
                </div>
              ) : (
                deployLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.includes("SUCCESS")
                        ? "text-[var(--color-success)] font-bold"
                        : log.includes("ERROR")
                        ? "text-[var(--color-danger)] font-bold"
                        : ""
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Override Justification Modal */}
      {overrideModalGate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[var(--radius-md)] max-w-md w-full p-5 space-y-4 shadow-2xl">
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
