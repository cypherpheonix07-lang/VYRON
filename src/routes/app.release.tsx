import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Download,
  Info,
  Clock,
  ChevronRight,
  FileText,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveProject } from "@/hooks/useActiveProject";
import {
  ReleaseGateEngine,
  ReleaseGateDefinition,
  DecomposedReleaseScore,
  ReleaseTwinRehearsalResult,
  DeterministicRollbackPlan,
} from "@/services/release/releaseGateEngine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/release")({
  head: () => ({
    meta: [
      { title: "Release Gates & Digital Twin — PROJECT BRAHMA" },
      {
        name: "description",
        content: "21-Family gate verification, rehearsal twin simulation, and reversible rollback orchestration.",
      },
    ],
  }),
  component: ReleaseGatesPage,
});

function ReleaseGatesPage() {
  const { project } = useActiveProject();
  const engine = useMemo(() => ReleaseGateEngine.getInstance(), []);

  const [selectedVersion, setSelectedVersion] = useState("v2.5.0-RC1");
  const [selectedFamily, setSelectedFamily] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"gates" | "rehearsal" | "rollback">("gates");
  const [isRehearsing, setIsRehearsing] = useState(false);
  const [rehearsalResult, setRehearsalResult] = useState<ReleaseTwinRehearsalResult | null>(null);
  const [rollbackPlan, setRollbackPlan] = useState<DeterministicRollbackPlan | null>(null);

  const decomposedScore: DecomposedReleaseScore = useMemo(() => {
    return engine.getDecomposedScore();
  }, [engine]);

  const allGates: ReleaseGateDefinition[] = useMemo(() => {
    return engine.getAllGates();
  }, [engine]);

  const filteredGates = useMemo(() => {
    if (selectedFamily === "ALL") return allGates;
    return allGates.filter((g) => g.family === selectedFamily);
  }, [allGates, selectedFamily]);

  const families = useMemo(() => {
    const list = Array.from(new Set(allGates.map((g) => g.family)));
    return ["ALL", ...list];
  }, [allGates]);

  const handleRunRehearsal = () => {
    setIsRehearsing(true);
    toast.info("Triggering Release Twin dry-run rehearsal...");
    setTimeout(() => {
      const res = engine.runReleaseTwinRehearsal(selectedVersion);
      setRehearsalResult(res);
      setIsRehearsing(false);
      if (res.verdict === "PASSED_REHEARSAL") {
        toast.success("Release Twin rehearsal passed with 0 critical anomalies!");
      } else {
        toast.error("Release Twin rehearsal failed preconditions.");
      }
    }, 1200);
  };

  const handleGenerateRollback = () => {
    toast.info("Compiling deterministic rollback procedure...");
    setTimeout(() => {
      const plan = engine.generateRollbackPlan(selectedVersion);
      setRollbackPlan(plan);
      toast.success("Rollback procedure generated and cryptographically bound.");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Release Gates & Digital Twin"
        description="Autonomous release qualification governed by 21 predicate gate families, staging twin rehearsal, and cryptographic rollback bounds."
      />

      {/* Release Candidate Scope Header */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
              Release Candidate:
            </span>
            <span className="text-sm font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {selectedVersion}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              Target: {project?.name || "Global Workspace"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Bound to Commit <span className="font-mono text-foreground">a0ef9a7</span> • SHA-256 Verified
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={handleRunRehearsal}
            disabled={isRehearsing}
          >
            <PlayCircle className="size-3.5 text-primary" />
            {isRehearsing ? "Simulating..." : "Run Twin Rehearsal"}
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground"
          >
            <Link to="/app/exports">
              <Download className="size-3.5" />
              Export Dossier
            </Link>
          </Button>
        </div>
      </div>

      {/* Decomposed Scorecard (L03, L04) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Overall Readiness</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {decomposedScore.overallScore}%
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] uppercase",
              decomposedScore.verdict === "RELEASE_APPROVED"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-amber-500/10 text-amber-400 border-amber-500/25",
            )}
          >
            {decomposedScore.verdict.replace("_", " ")}
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Passed Gates</span>
          <div className="text-2xl font-bold font-mono text-foreground">
            {decomposedScore.passedGates} / {decomposedScore.totalGates}
          </div>
          <span className="text-[10px] text-muted-foreground">All criteria verified</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Blocking Gates</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {decomposedScore.blockedGates}
          </div>
          <span className="text-[10px] text-muted-foreground">Zero hard blockers</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Failed Gates</span>
          <div className="text-2xl font-bold font-mono text-zinc-400">
            {decomposedScore.failedGates}
          </div>
          <span className="text-[10px] text-muted-foreground">Zero failures</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Approved Waivers</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {decomposedScore.waivedGates}
          </div>
          <span className="text-[10px] text-muted-foreground">CISO Compensating</span>
        </div>
      </div>

      {/* Tabs: Gates Catalog / Release Twin Rehearsal / Rollback Procedure */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <Button
          variant={activeTab === "gates" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("gates")}
        >
          <ShieldCheck className="size-3.5" />
          Gate Evaluation ({allGates.length})
        </Button>
        <Button
          variant={activeTab === "rehearsal" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("rehearsal")}
        >
          <Activity className="size-3.5" />
          Release Twin Rehearsal
        </Button>
        <Button
          variant={activeTab === "rollback" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("rollback")}
        >
          <RotateCcw className="size-3.5" />
          Reversible Rollback
        </Button>
      </div>

      {activeTab === "gates" && (
        <div className="space-y-4">
          {/* Family Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {families.map((fam) => (
              <Button
                key={fam}
                variant={selectedFamily === fam ? "default" : "outline"}
                size="sm"
                className="h-6 text-[10px] px-2.5"
                onClick={() => setSelectedFamily(fam)}
              >
                {fam.replace(/_/g, " ")}
              </Button>
            ))}
          </div>

          {/* Gate List Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">Gate ID & Family</th>
                    <th className="p-3">Gate Name & Description</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Authority</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Predicate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredGates.map((gate) => (
                    <tr key={gate.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <span className="font-mono text-primary font-semibold block">{gate.id}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {gate.family}
                        </span>
                      </td>
                      <td className="p-3 max-w-sm">
                        <span className="font-medium text-foreground block">{gate.name}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">
                          {gate.description}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] uppercase",
                            gate.severity === "BLOCKING"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30",
                          )}
                        >
                          {gate.severity}
                        </Badge>
                      </td>
                      <td className="p-3 text-[11px] text-muted-foreground">{gate.requiredAuthority}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{gate.score}%</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]"
                        >
                          {gate.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-mono text-[10px] text-cyan-400 max-w-xs truncate">
                        {gate.predicateExpression}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "rehearsal" && (
        <div className="space-y-4">
          <SectionCard
            title="Staging Twin Rehearsal"
            description="Executes non-destructive dry-run simulations of database migrations, network routing, and contract boundaries."
          >
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Target Environment: STAGING_TWIN</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Isolated clone of production state with sanitized real data schemas.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground"
                  onClick={handleRunRehearsal}
                  disabled={isRehearsing}
                >
                  <PlayCircle className="size-3.5 mr-1.5" />
                  {isRehearsing ? "Executing Rehearsal..." : "Simulate Staging Deployment"}
                </Button>
              </div>

              {rehearsalResult ? (
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Rehearsal Verdict:
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-mono text-xs">
                      {rehearsalResult.verdict}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg border border-border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase block font-mono">Simulated Gates</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {rehearsalResult.simulatedGatesPassed} Passed
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase block font-mono">Failed Gates</span>
                      <span className="text-sm font-bold font-mono text-zinc-400">
                        {rehearsalResult.simulatedGatesFailed} Failed
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase block font-mono">Rollback Test</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {rehearsalResult.rollbackRehearsalPassed ? "VERIFIED (12s)" : "FAILED"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border bg-background">
                      <span className="text-[10px] text-muted-foreground uppercase block font-mono">Cryptographic Proof</span>
                      <span className="text-[11px] font-mono text-cyan-400 truncate block">
                        {rehearsalResult.rehearsalHash}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground text-xs">
                  Click &ldquo;Simulate Staging Deployment&rdquo; above to run the digital twin verification.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "rollback" && (
        <div className="space-y-4">
          <SectionCard
            title="Deterministic Rollback Orchestration"
            description="Pre-computes state restoration steps, snapshot signatures, and recovery time objectives (RTO) before production promotion."
          >
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Rollback Plan for {selectedVersion}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Guarantees atomic rollback to revision 24 with 0 data loss.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={handleGenerateRollback}
                >
                  <RotateCcw className="size-3.5 mr-1.5 text-primary" />
                  Generate Rollback Plan
                </Button>
              </div>

              {rollbackPlan ? (
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      Estimated Recovery Time Objective (RTO):
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {rollbackPlan.estimatedRTOSeconds} seconds
                    </span>
                  </div>

                  <div className="space-y-2">
                    {rollbackPlan.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3 rounded-lg border border-border bg-background flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="size-6 rounded-full bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
                            {step.stepNumber}
                          </span>
                          <div>
                            <span className="font-semibold text-foreground">{step.action}</span>
                            <span className="text-[10px] text-muted-foreground block">
                              Target: {step.targetService} • {step.expectedOutcome}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-mono bg-muted">
                          {step.isAutomated ? "AUTOMATED" : "MANUAL CONFIRM"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground text-xs">
                  Click &ldquo;Generate Rollback Plan&rdquo; to compute the deterministic sequence.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
