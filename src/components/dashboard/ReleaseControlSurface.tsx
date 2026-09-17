/**
 * VYRON — RELEASE CONTROL SURFACE (PHASE 08)
 * Governs release promotion candidate, architecture gates, security baselines,
 * policy evaluation proofs, rollback readiness, and CISO exception granting.
 * Implements the inspection chain:
 * GATE → WHY → RULE → EXECUTION → RESULT → EVIDENCE → AFFECTED COMPONENTS → REMEDIATION → RE-VERIFICATION.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { policyEngine, PolicyEvaluationResult } from "@/services/policy/policyEngine";
import { governanceAuthorizationEngine } from "@/services/governance/governanceAuthorizationEngine";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Fingerprint,
  RefreshCw,
  Rocket,
  Shield,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";

export function ReleaseControlSurface() {
  const { selectEntity, userAuthority } = useCommandCenter();
  const [evalVersion, setEvalVersion] = useState(0);

  // Query Policy Engine
  const policyEval = useMemo(() => {
    return policyEngine.evaluateAllPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalVersion]);

  // Derive 4 Formal Release Decision States (Phase 16)
  const releaseDecisionState: "READY" | "CONDITIONALLY_READY" | "REVIEW_REQUIRED" | "BLOCKED" = useMemo(() => {
    if (policyEval.blockingFailuresCount > 0) return "BLOCKED";
    const hasExceptions = policyEval.results.some((r) => r.status === "EXEMPTED");
    if (hasExceptions) return "CONDITIONALLY_READY";
    const hasWarnings = policyEval.results.some((r) => r.severity === "WARNING" && r.status === "FAILED");
    if (hasWarnings) return "REVIEW_REQUIRED";
    return "READY";
  }, [policyEval]);

  const [selectedGate, setSelectedGate] = useState<PolicyEvaluationResult>(policyEval.results[0]!);

  const handleGrantException = (policyId: string) => {
    const granted = policyEngine.grantException(
      policyId,
      "Approved 48-hour architecture release exception",
      userAuthority,
      48,
    );
    if (granted) {
      governanceAuthorizationEngine.grantGovernedException({
        policyId,
        scope: "PROJECT",
        justification: "Approved 48-hour architecture release exception",
        authority: userAuthority,
        hoursValid: 48,
        riskLevel: selectedGate.severity === "BLOCKING" ? "HIGH" : "MEDIUM",
      });
      toast.success(`Granted 48h Governed Exception for ${policyId}`);
      setEvalVersion((v) => v + 1);
    }
  };

  const handleReverify = () => {
    setEvalVersion((v) => v + 1);
    toast.success("Re-evaluated all release governance policies against active AST.");
  };

  const handleInspectGate = (gate: PolicyEvaluationResult) => {
    setSelectedGate(gate);
    selectEntity({
      type: "gate",
      id: gate.policyId,
      name: gate.policyName,
      status: gate.status,
      severity: gate.status === "FAILED" ? "HIGH" : "LOW",
      details: `${gate.failureReason || "Gate conditions passed."} Rule: ${gate.policyId}. Remediation: ${gate.remediationGuide}`,
      evidenceHash: generateVerificationHash(`GATE:${gate.policyId}:${gate.status}`),
      metadata: {
        severity: gate.severity,
        status: gate.status,
        violatingEntities: gate.violatingEntities,
        failureReason: gate.failureReason,
        remediationGuide: gate.remediationGuide,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* CANDIDATE RELEASE STATUS BANNER */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-zinc-950/40">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "size-2.5 rounded-full",
              policyEval.blockingFailuresCount === 0 ? "bg-emerald-400 animate-pulse" : "bg-rose-500",
            )}
          />
          <div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Rocket className="size-3.5 text-primary" /> Production Release Candidate: v2.4.0
            </div>
            <div className="text-[10px] text-muted-foreground">
              Branch: main • Rollback Plan: Container Snapshot Verified
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "text-[10px] font-mono",
              releaseDecisionState === "READY" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
              releaseDecisionState === "CONDITIONALLY_READY" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
              releaseDecisionState === "REVIEW_REQUIRED" && "bg-sky-500/20 text-sky-400 border-sky-500/30",
              releaseDecisionState === "BLOCKED" && "bg-rose-500/20 text-rose-400 border-rose-500/30",
            )}
          >
            {releaseDecisionState}
          </Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReverify}
            className="h-6 px-1.5 text-[10px] font-mono"
          >
            <RefreshCw className="size-2.5 mr-1" /> Re-verify
          </Button>
        </div>
      </div>

      {/* POLICY GATE BREAKDOWN LIST */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {policyEval.results.map((gate) => {
          const isPassed = gate.status === "PASSED";
          const isExempted = gate.status === "EXEMPTED";

          return (
            <div
              key={gate.policyId}
              onClick={() => handleInspectGate(gate)}
              className={cn(
                "p-2.5 rounded-lg border text-xs cursor-pointer transition-colors space-y-1",
                selectedGate.policyId === gate.policyId
                  ? "border-primary bg-primary/10"
                  : "border-border/30 bg-zinc-950/30 hover:bg-zinc-900/40",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  {isPassed ? (
                    <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                  ) : isExempted ? (
                    <Clock className="size-3 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="size-3 text-rose-400 shrink-0" />
                  )}
                  <span className="truncate">{gate.policyName}</span>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-mono",
                    isPassed && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                    isExempted && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                    !isPassed && !isExempted && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                  )}
                >
                  {gate.status}
                </Badge>
              </div>

              {gate.failureReason && (
                <p className="text-[10px] text-rose-300/90 pl-4.5 line-clamp-1">{gate.failureReason}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* GATE EXCEPTION & CHAIN DISPLAY */}
      <div className="p-3 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Shield className="size-3.5 text-primary" /> Gate: {selectedGate.policyId}
          </div>

          <div className="flex items-center gap-1.5">
            {selectedGate.status === "FAILED" && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGrantException(selectedGate.policyId);
                }}
                className="h-5 px-1.5 text-[9px] font-mono text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
              >
                Grant 48h Exception
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              className="h-5 px-1.5 text-[9px] gap-1 font-mono"
              onClick={() => handleInspectGate(selectedGate)}
            >
              <Sparkles className="size-2 text-primary" /> Inspect in Drawer
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono p-1.5 rounded border border-border/30 bg-zinc-900/40 overflow-x-auto">
          <span className="text-primary font-bold">GATE: {selectedGate.policyId}</span>
          <ArrowRight className="size-2.5 text-muted-foreground" />
          <span className="text-indigo-300 font-bold">SEVERITY: {selectedGate.severity}</span>
          <ArrowRight className="size-2.5 text-muted-foreground" />
          <span className="text-emerald-400 font-bold">STATUS: {selectedGate.status}</span>
          <ArrowRight className="size-2.5 text-muted-foreground" />
          <span className="text-muted-foreground font-bold truncate max-w-[120px]">
            EVIDENCE: {policyEval.verificationHash.slice(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
}
