import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useActiveProject } from "@/hooks/useActiveProject";
import { runService } from "@/services/runs/runService";
import {
  Activity,
  FileBarChart2,
  FolderKanban,
  GitBranch,
  Network,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  X,
  CheckSquare,
  Play,
  Layers,
  Cpu,
  Server,
  Lock,
  Compass,
  Sparkles,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  GitPullRequest,
  Box,
  Binary,
  Radio,
  Zap,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppMode } from "@/state/mode/useAppMode";
import { SimulatorControls } from "@/components/demo/SimulatorControls";
import { AnomalyTimeline } from "@/components/demo/AnomalyTimeline";

import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  RiskBadge,
  ScoreBar,
  SectionCard,
  StatCard,
  StatusBadge,
  CountdownCard,
} from "@/components/brahma/primitives";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityFeed, projects as mockProjects } from "@/lib/mock-data";
import { useProjects } from "@/hooks/useProjects";
import { ProactiveInsightsBanner } from "@/components/copilot/ProactiveInsightsBanner";
import { architectureDriftEngine } from "@/services/intelligence/driftEngine";
import { decisionEngine } from "@/services/intelligence/decisionEngine";
import { policyEngine } from "@/services/policy/policyEngine";
import { engineeringKnowledgeGraph } from "@/services/intelligence/knowledgeGraph";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";

// 12-SURFACE INTERACTIVE SYSTEM DIRECTIVE COMPONENTS
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { UniversalDetailDrawer } from "@/components/dashboard/UniversalDetailDrawer";
import { GlobalCommandContextBar } from "@/components/dashboard/GlobalCommandContextBar";
import { TemporalHealthExplorer } from "@/components/dashboard/TemporalHealthExplorer";
import { RiskUniverse } from "@/components/dashboard/RiskUniverse";
import { EngineeringReadinessSystem } from "@/components/dashboard/EngineeringReadinessSystem";
import { LiveSignalRadarField } from "@/components/dashboard/LiveSignalRadarField";
import { ReleaseControlSurface } from "@/components/dashboard/ReleaseControlSurface";
import { LivingArchitectureCanvas } from "@/components/dashboard/LivingArchitectureCanvas";
import { DriftInvestigationSurface } from "@/components/dashboard/DriftInvestigationSurface";
import { RuntimeIntelligenceCockpit } from "@/components/dashboard/RuntimeIntelligenceCockpit";
import { TrustComplianceSurface } from "@/components/dashboard/TrustComplianceSurface";
import { AtlasSystemExplorer } from "@/components/dashboard/AtlasSystemExplorer";
import { CopilotPartnerCard } from "@/components/dashboard/CopilotPartnerCard";
import { EvidenceExplorer } from "@/components/dashboard/EvidenceExplorer";
import { TimeMachineComparator } from "@/components/dashboard/TimeMachineComparator";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — VYRON" },
      {
        name: "description",
        content: "Executive overview of project health, security posture and delivery risk.",
      },
      { property: "og:title", content: "Dashboard — VYRON" },
      {
        property: "og:description",
        content: "Portfolio health, security and delivery risk at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const activityIcon = {
  security: ShieldAlert,
  blueprint: Network,
  report: FileBarChart2,
  risk: TrendingUp,
  repo: GitBranch,
} as const;

type ViewState = "loaded" | "loading" | "empty" | "error";

function Dashboard() {
  const navigate = useNavigate();
  const { mode } = useAppMode();
  const [state, setState] = useState<ViewState>("loaded");
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  const { selectEntity } = useCommandCenter();
  const {
    project: activeProject,
    projectId: activeProjectId,
    availableProjects,
    availability,
  } = useActiveProject();

  const { projects: liveProjects } = useProjects();
  const displayProjects = useMemo(() => {
    if (!liveProjects || liveProjects.length === 0) {
      return mode === "DEMO" ? mockProjects : [];
    }
    return liveProjects.map((lp) => {
      const hScore = lp.health_score ?? (lp as unknown as { healthScore?: number }).healthScore ?? 0;
      return {
        id: lp.id,
        name: lp.name,
        description: lp.description || "",
        domain: lp.domain || "General",
        status:
          (lp.status as "Analyzed" | "Analyzing" | "Draft" | "Needs Review" | "At Risk") ||
          "Draft",
        healthScore: hScore,
        securityScore: (lp as unknown as { securityScore?: number }).securityScore ?? 0,
        businessImpactScore: (lp as unknown as { businessImpactScore?: number }).businessImpactScore ?? 0,
        requirementClarity: (lp as unknown as { requirementClarity?: number }).requirementClarity ?? 0,
        deliveryRisk: (hScore > 80
          ? "Low"
          : hScore > 60
            ? "Medium"
            : "High") as "Low" | "Medium" | "High" | "Critical",
        riskScore: hScore > 0 ? Math.max(0, 100 - hScore) : 0,
        repoConnected: !!lp.repo_full_name,
        teamSize: (lp as unknown as { teamSize?: number }).teamSize ?? 1,
        deadline: (lp as unknown as { deadline?: string }).deadline || "2026-12-31",
        lastUpdated: lp.created_at || new Date().toISOString(),
        lastAnalysis: (lp as unknown as { lastAnalysis?: string }).lastAnalysis || lp.created_at || new Date().toISOString(),
      };
    });
  }, [liveProjects, mode]);

  const avgHealth = useMemo(() => {
    if (displayProjects.length === 0) return 0;
    return Math.round(
      displayProjects.reduce((acc, p) => acc + (p.healthScore || 0), 0) /
        displayProjects.length,
    );
  }, [displayProjects]);

  // Operational Engines Live Telemetry Queries
  const driftEval = useMemo(() => architectureDriftEngine.evaluateDrift(), []);
  const policyEval = useMemo(() => policyEngine.evaluateAllPolicies(), []);
  const decisions = useMemo(
    () =>
      typeof decisionEngine?.listDecisions === "function"
        ? decisionEngine.listDecisions()
        : typeof decisionEngine?.getDecisions === "function"
          ? decisionEngine.getDecisions()
          : [],
    [],
  );
  const graphData = useMemo(() => engineeringKnowledgeGraph.exportGraphData(), []);

  return (
    <>
      <PageHeader
        title="Engineering intelligence overview"
        description="Portfolio-wide health, security posture and delivery risk, recalculated on every analysis run."
        actions={
          <>
            <Tabs value={state} onValueChange={(v) => setState(v as ViewState)}>
              <TabsList aria-label="Preview dashboard states">
                <TabsTrigger value="loaded">Loaded</TabsTrigger>
                <TabsTrigger value="loading">Loading</TabsTrigger>
                <TabsTrigger value="empty">Empty</TabsTrigger>
                <TabsTrigger value="error">Error</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* CONTEXT-SENSITIVE RUN ANALYSIS BUTTON (WORKSTREAM I & K) */}
            <Button
              onClick={async () => {
                if (activeProject) {
                  const run = await runService.createAndDispatchRun({
                    projectId: activeProject.id,
                    operationType: "REPOSITORY_ANALYSIS",
                    originItem: "Command Center Top Action",
                  });
                  toast.success("Repository analysis initiated", {
                    description: `Durable run ${run.runId} dispatched for ${activeProject.name}.`,
                  });
                  navigate({
                    to: "/app/projects/$id/results",
                    params: { id: activeProject.id },
                    search: { runId: run.runId },
                  });
                } else {
                  navigate({ to: "/app/analysis" });
                }
              }}
              className="font-bold text-xs bg-gradient-to-r from-primary via-indigo-500 to-purple-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-md shadow-primary/20 border border-white/20"
            >
              <Play className="size-3.5 fill-current text-white mr-1.5" />
              RUN ANALYSIS
            </Button>

            <Button asChild variant="outline">
              <Link to="/app/projects/new">
                <PlusCircle className="size-4" aria-hidden /> New project
              </Link>
            </Button>
          </>
        }
      />

      {/* PHASE 02: GLOBAL COMMAND CONTEXT BAR */}
      <GlobalCommandContextBar
        showTimeMachine={showTimeMachine}
        onToggleTimeMachine={() => setShowTimeMachine((prev) => !prev)}
      />

      {/* ACTIVE PROJECT COMMAND PANEL (WORKSTREAM F) */}
      {activeProject ? (
        <div className="p-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/80 to-card/60 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold border border-primary/30">
                  ACTIVE PROJECT
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                  {activeProject.origin}
                </Badge>
                <StatusBadge status={activeProject.status} />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {activeProject.name}
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  ({activeProject.domain})
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                {activeProject.description}
              </p>
            </div>

            {/* CONTEXT-SENSITIVE RUN TRIGGER ACTIONS */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-primary/40 bg-primary/5 hover:bg-primary/15 text-primary gap-1.5 h-8 font-semibold shadow-sm"
                onClick={async () => {
                  const run = await runService.createAndDispatchRun({
                    projectId: activeProject.id,
                    operationType: "BLUEPRINT_GENERATION",
                    originItem: "Command Center Blueprint Action",
                  });
                  toast.success("Blueprint synthesis queued", {
                    description: `Run ${run.runId} initiated for ${activeProject.name}.`,
                  });
                  navigate({
                    to: "/app/projects/$id/results",
                    params: { id: activeProject.id },
                    search: { runId: run.runId },
                  });
                }}
              >
                <Sparkles className="size-3.5" />
                Synthesize Blueprint
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="text-xs border-border bg-card/60 hover:bg-card gap-1.5 h-8"
                onClick={async () => {
                  const run = await runService.createAndDispatchRun({
                    projectId: activeProject.id,
                    operationType: "TEST_SUITE_RUN",
                    originItem: "Command Center Test Action",
                  });
                  toast.success("Test verification run queued", {
                    description: `Run ${run.runId} running quality gates.`,
                  });
                  navigate({
                    to: "/app/projects/$id/results",
                    params: { id: activeProject.id },
                    search: { runId: run.runId },
                  });
                }}
              >
                <CheckSquare className="size-3.5" />
                Run Tests
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="text-xs border-border bg-card/60 hover:bg-card gap-1.5 h-8"
                onClick={async () => {
                  const run = await runService.createAndDispatchRun({
                    projectId: activeProject.id,
                    operationType: "SECURITY_SCAN",
                    originItem: "Command Center Security Action",
                  });
                  toast.success("STRIDE security audit queued", {
                    description: `Run ${run.runId} auditing STRIDE surface.`,
                  });
                  navigate({
                    to: "/app/projects/$id/results",
                    params: { id: activeProject.id },
                    search: { runId: run.runId },
                  });
                }}
              >
                <Lock className="size-3.5" />
                Security Scan
              </Button>

              <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground gap-1.5 h-8 shadow-sm">
                <Link to={`/app/projects/${activeProject.id}` as never}>
                  <FolderKanban className="size-3.5" />
                  View Lifecycle
                </Link>
              </Button>
            </div>
          </div>

          {/* PROJECT METRICS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/40 text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">Health Score</span>
              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400" />
                {activeProject.healthScore}/100
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">Security Posture</span>
              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-400" />
                {activeProject.securityScore}/100
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">Delivery Risk</span>
              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <RiskBadge level={activeProject.deliveryRisk} />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">Repository</span>
              <div className="font-medium text-foreground truncate">
                {activeProject.repoConnected ? activeProject.repoUrl || activeProject.repo_full_name || "Connected" : "Native (No Git)"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border bg-card/40 text-center space-y-2">
          <FolderKanban className="size-6 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold">No project selected</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Choose an existing project from the selector above, create a new native blueprint, or connect a GitHub repository.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button asChild size="sm" variant="default" className="text-xs">
              <Link to="/app/projects/new">
                <PlusCircle className="size-3.5 mr-1.5" />
                Create New Project
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link to="/app/github">
                <GitBranch className="size-3.5 mr-1.5" />
                Connect GitHub
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* PHASE 18: TIME MACHINE COMPARATOR */}
      {showTimeMachine && (
        <div className="my-2">
          <TimeMachineComparator />
        </div>
      )}

      {/* DEMO MODE REAL-TIME SIMULATION SUITE */}
      {mode === "DEMO" && (
        <div className="space-y-4 my-2">
          <SimulatorControls />
          <AnomalyTimeline />
        </div>
      )}

      {state === "loading" ? (
        <div className="space-y-4">
          <LoadingSkeleton />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LoadingSkeleton variant="chart" />
            </div>
            <LoadingSkeleton variant="chart" />
          </div>
          <LoadingSkeleton variant="table" />
        </div>
      ) : null}

      {state === "error" ? (
        <ErrorState
          title="Analysis service unavailable"
          description="We couldn't reach the analysis service to compute portfolio metrics."
          onRetry={() => setState("loaded")}
        />
      ) : null}

      {state === "empty" ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to generate a validated blueprint, then connect a repository for code health and security analysis."
          action={
            <Button asChild>
              <Link to="/app/projects/new">
                <PlusCircle className="size-4" aria-hidden /> Create project
              </Link>
            </Button>
          }
        />
      ) : null}

      {state === "loaded" ? (
        <div className="space-y-4">
          <ProactiveInsightsBanner compact maxItems={1} />
          <CountdownCard targetDate="2026-09-15" milestoneTitle="Review 1 Milestone Defense" />

          {/* KPI STAT CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() =>
                selectEntity({
                  type: "project",
                  id: "portfolio-overview",
                  name: `Portfolio Overview (${displayProjects.length} Projects)`,
                  details: "Complete portfolio breakdown across active engineering workspaces.",
                  severity: "LOW",
                  status: "ACTIVE",
                })
              }
            >
              <StatCard
                label="Total projects"
                value={displayProjects.length}
                icon={FolderKanban}
                delta={12}
                hint="live portfolio"
              />
            </div>

            <div
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() =>
                selectEntity({
                  type: "metric",
                  id: "avg-health",
                  name: "Portfolio Average Health Score",
                  details: `Weighted rolling average across ${displayProjects.length} active monitored projects.`,
                  severity: avgHealth >= 70 ? "LOW" : "HIGH",
                  status: "EVALUATED",
                })
              }
            >
              <StatCard
                label="Avg. health score"
                value={String(avgHealth)}
                icon={Activity}
                delta={5}
                tone={avgHealth >= 70 ? "success" : "warning"}
                hint={`portfolio average (${displayProjects.length} projects)`}
              />
            </div>

            <div
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() =>
                selectEntity({
                  type: "finding",
                  id: "security-risk-summary",
                  name: "Security Posture Risk Overview",
                  details: "2 high/critical findings active (CWE-89 and fallback secret).",
                  severity: "CRITICAL",
                  status: "OPEN",
                })
              }
            >
              <StatCard
                label="Security risk"
                value="High"
                icon={ShieldCheck}
                tone="critical"
                hint="2 critical findings open"
              />
            </div>

            <div
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() =>
                selectEntity({
                  type: "risk",
                  id: "delivery-risk-summary",
                  name: "Delivery Risk Overview",
                  details:
                    "VaultLedger Admin Console currently flagged at risk for milestone release.",
                  severity: "MEDIUM",
                  status: "MONITORED",
                })
              }
            >
              <StatCard
                label="Delivery risk"
                value="Medium"
                icon={TrendingUp}
                tone="warning"
                hint="1 project at risk"
              />
            </div>

            <div
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() =>
                selectEntity({
                  type: "evidence",
                  id: "reports-ledger-summary",
                  name: "Compliance Reports Ledger",
                  details: "318 formal tamper-evident analysis reports compiled all-time.",
                  severity: "LOW",
                  status: "SEALED",
                })
              }
            >
              <StatCard
                label="Reports generated"
                value="318"
                icon={FileBarChart2}
                delta={9}
                hint="all time"
              />
            </div>
          </div>

          {/* SECTION 3: ENGINEERING READINESS SYSTEM (PHASE 06) */}
          <EngineeringReadinessSystem />

          {/* SURFACE 1: PROJECT HEALTH TREND & SURFACE 2: RISK DISTRIBUTION (PHASE 04 & PHASE 05) */}
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Project health trend"
              description="Six-month rolling average across all monitored projects."
            >
              <TemporalHealthExplorer />
            </SectionCard>

            <SectionCard
              title="Risk distribution"
              description="Delivery risk across active projects."
            >
              <RiskUniverse />
            </SectionCard>
          </div>

          {/* SECTION 2: RECENT PROJECTS & RECENT ACTIVITY */}
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Recent projects"
              description="Latest analysis results per project."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/projects">View all</Link>
                </Button>
              }
            >
              <div className="-mx-2 overflow-x-auto px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Health</TableHead>
                      <TableHead className="hidden md:table-cell">Security</TableHead>
                      <TableHead>Delivery risk</TableHead>
                      <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayProjects.map((p) => (
                      <TableRow
                        key={p.id}
                        className="cursor-pointer hover:bg-muted/40 transition-colors"
                        onClick={() =>
                          selectEntity({
                            type: "project",
                            id: p.id,
                            name: p.name,
                            details: p.description,
                            status: p.status,
                            severity:
                              p.deliveryRisk === "Critical"
                                ? "CRITICAL"
                                : p.deliveryRisk === "High"
                                  ? "HIGH"
                                  : "LOW",
                            metadata: {
                              domain: p.domain,
                              healthScore: p.healthScore,
                              securityScore: p.securityScore,
                              repoConnected: p.repoConnected,
                              deadline: p.deadline,
                            },
                          })
                        }
                      >
                        <TableCell className="max-w-[220px]">
                          <span className="block truncate font-medium hover:text-primary">
                            {p.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{p.domain}</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {p.healthScore ? (
                            <ScoreBar value={p.healthScore} />
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {p.securityScore ? (
                            <ScoreBar value={p.securityScore} />
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <RiskBadge level={p.deliveryRisk} />
                        </TableCell>
                        <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground lg:table-cell">
                          {new Date(p.lastUpdated).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>

            <SectionCard title="Recent activity" description="Analysis runs, exports and alerts.">
              <ul className="space-y-4">
                {activityFeed.map((a) => {
                  const Icon = activityIcon[a.kind];
                  return (
                    <li
                      key={a.id}
                      className="flex gap-3 cursor-pointer p-1 rounded-lg hover:bg-zinc-900/30 transition-colors"
                      onClick={() =>
                        selectEntity({
                          type: "anomaly",
                          id: a.id,
                          name: a.title,
                          details: a.detail,
                          severity: a.kind === "security" ? "HIGH" : "LOW",
                          timestamp: a.time,
                        })
                      }
                    >
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm leading-snug">{a.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/70">{a.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </div>

          {/* SECTION 3: INTELLIGENCE ENGINE & ANOMALY RADAR & SECTION 4: RELEASE READINESS */}
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Intelligence engine & anomaly radar"
              description="Continuous anomaly detection and telemetry correlations across microservices."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/activity">View pipeline stream</Link>
                </Button>
              }
            >
              <LiveSignalRadarField />
            </SectionCard>

            {/* SECTION 4: RELEASE READINESS & GOVERNANCE GATES */}
            <SectionCard
              title="Release readiness & gates"
              description="Policy evaluation and production promotion status."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/release" as never}>Inspect gates</Link>
                </Button>
              }
            >
              <ReleaseControlSurface />
            </SectionCard>
          </div>

          {/* SECTION 5: ARCHITECTURE TOPOLOGY & SECTION 6: ARCHITECTURE DRIFT */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* SECTION 5: ARCHITECTURE TOPOLOGY */}
            <SectionCard
              title="Architecture topology & services"
              description="Live service contracts and node relationships."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/graph" as never}>Explore graph</Link>
                </Button>
              }
            >
              <LivingArchitectureCanvas />
            </SectionCard>

            {/* SECTION 6: ARCHITECTURE DRIFT */}
            <SectionCard
              title="Architecture drift detection"
              description="Structural divergence between blueprint and implementation."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/drift" as never}>Manage drift</Link>
                </Button>
              }
            >
              <DriftInvestigationSurface />
            </SectionCard>
          </div>

          {/* SECTION 7: SECURITY & COMPLIANCE & SECTION 8: RUNTIME TELEMETRY */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* SECTION 7: SECURITY & COMPLIANCE POSTURE */}
            <SectionCard
              title="Security & compliance posture"
              description="Vulnerability radar, static AST findings, and policy controls."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/compliance" as never}>View audit trail</Link>
                </Button>
              }
            >
              <TrustComplianceSurface />
            </SectionCard>

            {/* SECTION 8: RUNTIME & SUBSYSTEM TELEMETRY */}
            <SectionCard
              title="Runtime & subsystem telemetry"
              description="Live service latencies and availability metrics."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/telemetry" as never}>Full metrics</Link>
                </Button>
              }
            >
              <RuntimeIntelligenceCockpit />
            </SectionCard>
          </div>

          {/* SECTION 9: ATLAS KNOWLEDGE GRAPH & SECTION 10: COPILOT PARTNER */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* SECTION 9: ATLAS KNOWLEDGE GRAPH */}
            <SectionCard
              title="ATLAS knowledge graph topology"
              description="14 engineering relationship types connecting architectural assets."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/graph" as never}>Query ATLAS</Link>
                </Button>
              }
            >
              <AtlasSystemExplorer />
            </SectionCard>

            {/* SECTION 10: COPILOT ENGINEERING PARTNER */}
            <SectionCard
              title="Copilot engineering partner"
              description="AI-augmented orchestration, proactive actions and investigation."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to={"/app/copilot" as never}>Open Copilot</Link>
                </Button>
              }
            >
              <CopilotPartnerCard />
            </SectionCard>
          </div>

          {/* SECTION 11: CRYPTOGRAPHIC EVIDENCE & AUDIT TRAIL */}
          <SectionCard
            title="Cryptographic evidence & audit trail"
            description="Tamper-evident verification hashes sealing all architectural evaluations."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to={"/app/evidence" as never}>View ledger</Link>
              </Button>
            }
          >
            <EvidenceExplorer />
          </SectionCard>
        </div>
      ) : null}

      {/* PHASE 17: UNIVERSAL DETAIL DRAWER */}
      <UniversalDetailDrawer />
    </>
  );
}
