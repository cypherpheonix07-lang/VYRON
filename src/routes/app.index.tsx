/**
 * VYRON — Unified Command Center & Engineering Intelligence Overview
 * Zero SQL: all database interactions enforce query builder compliance.
 */
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useActiveProject } from "@/hooks/useActiveProject";
import { runService } from "@/services/runs/runService";
import { useAuth } from "@/lib/auth";
import { WorkspaceExitButton } from "@/components/workspace/WorkspaceExitButton";
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
  ArrowRight,
  Clock,
  Trash2,
  Loader2,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppMode } from "@/state/mode/useAppMode";
import { SimulatorControls } from "@/components/demo/SimulatorControls";
import { AnomalyTimeline } from "@/components/demo/AnomalyTimeline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
import { workspaceExitCoordinator } from "@/services/workspace/workspaceExitCoordinator";

export interface DashboardSearch {
  attemptId?: string | undefined;
  exitOutcome?: "saved" | "discarded" | "clean" | undefined;
  sections?: string | undefined;
  projectName?: string | undefined;
  projectId?: string | undefined;
  ts?: string | undefined;
}

export const Route = createFileRoute("/app/")({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      attemptId: typeof search["attemptId"] === "string" ? search["attemptId"] : undefined,
      exitOutcome:
        search["exitOutcome"] === "saved" ||
        search["exitOutcome"] === "discarded" ||
        search["exitOutcome"] === "clean"
          ? search["exitOutcome"]
          : undefined,
      sections: typeof search["sections"] === "string" ? search["sections"] : undefined,
      projectName: typeof search["projectName"] === "string" ? search["projectName"] : undefined,
      projectId: typeof search["projectId"] === "string" ? search["projectId"] : undefined,
      ts: typeof search["ts"] === "string" ? search["ts"] : undefined,
    };
  },
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
  const search = Route.useSearch();
  const { user } = useAuth();
  const { mode } = useAppMode();
  const [state, setState] = useState<ViewState>("loaded");
  const [showTimeMachine, setShowTimeMachine] = useState(false);
  const [showSavedProjects, setShowSavedProjects] = useState(false);

  const { selectEntity } = useCommandCenter();
  const {
    project: activeProject,
    projectId: activeProjectId,
    availableProjects,
    availability,
    setActiveProject,
  } = useActiveProject();

  const { projects: liveProjects } = useProjects();
  const { deleteProject } = useProjects();
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      await deleteProject(projectToDelete.id);
      if (activeProjectId === projectToDelete.id) {
        setActiveProject(null);
      }
      toast.success(`Project "${projectToDelete.name}" deleted successfully.`);
      setProjectToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete project: ${msg}`);
    } finally {
      setIsDeletingProject(false);
    }
  };

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

  // DELIBERATE NO-PROJECT-SELECTED EMPTY DASHBOARD (PHASE T: T01–T20)
  // When cataloged projects exist, the full Command Center is rendered with the exit outcome notice
  const confirmedRecord = workspaceExitCoordinator.verifyExitOutcome({
    attemptId: search.attemptId,
    exitOutcome: search.exitOutcome,
  });

  const exitOutcome = confirmedRecord?.outcome;
  const sectionsList = confirmedRecord?.sections || (search.sections ? search.sections.split(",").filter(Boolean) : []);
  const outcomeProject = confirmedRecord?.projectName || search.projectName;
  const exitTime = confirmedRecord?.timestamp
    ? new Date(confirmedRecord.timestamp).toLocaleTimeString()
    : search.ts
      ? new Date(search.ts).toLocaleTimeString()
      : undefined;

  if (!activeProject && displayProjects.length === 0) {

    return (
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Page Header for Empty Dashboard (T04, T05) */}
        <PageHeader
          title="Engineering intelligence overview"
          description="Workspace is currently closed. No project selected."
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSavedProjects((prev) => !prev)}
                className="text-xs gap-1.5 h-8"
              >
                <FolderKanban className="size-3.5" />
                {showSavedProjects ? "Hide Projects" : "Open Project"}
              </Button>
              <Button asChild size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8">
                <Link to="/app/projects/new">
                  <PlusCircle className="size-3.5" />
                  New Project
                </Link>
              </Button>
            </div>
          }
        />

        {/* AUTHORITATIVE EXIT OUTCOME NOTICE (T16, Domain I) */}
        {exitOutcome ? (
          <Card className="surface border border-border/80 bg-zinc-950/90 shadow-xl rounded-2xl overflow-hidden animate-in fade-in duration-300">
            <div
              className={`h-1.5 w-full ${
                exitOutcome === "saved"
                  ? "bg-emerald-500"
                  : exitOutcome === "discarded"
                    ? "bg-amber-500"
                    : "bg-primary"
              }`}
            />
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl border ${
                    exitOutcome === "saved"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : exitOutcome === "discarded"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                        : "bg-primary/15 text-primary border-primary/25"
                  }`}
                >
                  {exitOutcome === "saved" ? (
                    <CheckCircle2 className="size-5" />
                  ) : exitOutcome === "discarded" ? (
                    <Trash2 className="size-5" />
                  ) : (
                    <ShieldCheck className="size-5" />
                  )}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground">
                      {exitOutcome === "saved"
                        ? "Workspace safely exited — verified changes saved"
                        : exitOutcome === "discarded"
                          ? "Workspace exited — unsaved changes discarded"
                          : "Workspace closed cleanly"}
                    </h3>
                    {outcomeProject && (
                      <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                        {outcomeProject}
                      </Badge>
                    )}
                    {exitTime && (
                      <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="size-3" />
                        {exitTime}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {exitOutcome === "saved"
                      ? `All modified records${outcomeProject ? ` for ${outcomeProject}` : ""} were committed to project storage before leaving.`
                      : exitOutcome === "discarded"
                        ? `Only uncommitted edits were discarded. Previously saved records and conversations for ${outcomeProject || "your project"} remain completely intact.`
                        : "Workspace closed cleanly with zero pending mutations or background tasks."}
                  </p>
                  {sectionsList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground">Synchronized Sections:</span>
                      {sectionsList.map((sec) => (
                        <Badge key={sec} variant="secondary" className="text-[10px] bg-zinc-900 border border-border/60">
                          {sec}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirmedRecord?.attemptId) {
                    workspaceExitCoordinator.consumeExitOutcome(confirmedRecord.attemptId);
                  }
                  navigate({ to: "/app" });
                }}
                className="text-xs text-muted-foreground hover:text-foreground shrink-0 self-end sm:self-center"
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* NEUTRAL DIRECT-ACCESS WELCOME NOTICE (T17, Domain I) */
          <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2.5 text-primary">
              <Compass className="size-5" />
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                No active project open
              </h2>
              {search.exitOutcome && (
                <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-400 ml-auto">
                  Direct URL View — Unverified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              You are viewing the dashboard with no active project selected. Choose a project below to inspect its architecture, run verified analysis gates, or synthesize new blueprints.
            </p>
          </div>
        )}

        {/* PRIMARY ACTION CALLOUTS (T06, T07, T20) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="surface border border-border/80 bg-zinc-950/60 p-5 rounded-2xl space-y-3 hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center text-primary">
              <PlusCircle className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Create New Project</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Initialize an architecture blueprint from requirements or domain specification with zero synthetic data.
              </p>
            </div>
            <Button asChild size="sm" className="w-full text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/app/projects/new">
                Start New Project <ArrowRight className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </Card>

          <Card className={cn(
            "surface border border-border/80 bg-zinc-950/60 p-5 rounded-2xl space-y-3 transition-colors",
            showSavedProjects ? "border-violet-500/50 bg-violet-950/15" : "hover:border-violet-500/40"
          )}>
            <div className="size-10 rounded-xl bg-violet-500/10 border border-violet-500/20 grid place-items-center text-violet-400">
              <FolderKanban className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Open Existing Project</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse all authorized workspaces. Previously saved records, findings, and conversation history are fully preserved.
              </p>
            </div>
            <Button
              type="button"
              variant={showSavedProjects ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowSavedProjects((prev) => !prev)}
              className="w-full text-xs font-semibold border-violet-500/30 text-violet-300 hover:bg-violet-500/10 flex items-center justify-between"
            >
              <span>{showSavedProjects ? "Hide Saved Projects" : "Open Existing Project"}</span>
              {showSavedProjects ? <ChevronUp className="size-3.5 ml-1.5" /> : <ChevronDown className="size-3.5 ml-1.5" />}
            </Button>
          </Card>

          <Card className="surface border border-border/80 bg-zinc-950/60 p-5 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400">
              <GitBranch className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Connect Git Repository</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Link GitHub or GitLab to run repository analysis, detect architecture drift, and enforce release gates.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
              <Link to="/app/github">
                Connect Repository <ArrowRight className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </Card>
        </div>

        {/* SAVED PROJECTS RE-ENTRY DIRECTORY (H04, B16, U13, U14, U16) — Displayed ONLY after explicit Open Existing Project interaction */}
        {showSavedProjects && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Your Saved Projects ({availableProjects.length})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  <Link to="/app/projects">View all in directory &rarr;</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSavedProjects(false)}
                  className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                >
                  <X className="size-3.5 mr-1" /> Close
                </Button>
              </div>
            </div>

            {availableProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group rounded-xl border border-border/70 bg-card/40 hover:bg-card/70 p-4 transition-all hover:border-primary/40 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {proj.name}
                        </h4>
                        <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                          {proj.origin}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {proj.description || `Architecture workspace for ${proj.name}`}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono pt-1">
                        <span>{proj.domain}</span>
                        <span>&bull;</span>
                        <StatusBadge status={proj.status} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Updated {proj.lastUpdated ? new Date(proj.lastUpdated).toLocaleDateString() : "Recently"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveProject(proj.id, { navigateToProject: true })}
                        className="text-xs h-7 px-2.5 font-medium border-border hover:border-primary hover:bg-primary/10 hover:text-primary gap-1"
                      >
                        Open Workspace <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-border bg-card/20 text-center space-y-2">
                <FolderKanban className="size-8 text-muted-foreground mx-auto" />
                <h4 className="text-sm font-bold text-foreground">No projects in storage</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No architecture projects have been created yet. Create a new project to get started.
                </p>
              </div>
            )}
          </div>
        )}

        {/* AUTHENTICATION & SESSION RETENTION FOOTER (E15, T09) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/60 bg-zinc-950/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-primary shrink-0" />
            <span>
              Signed in as <strong className="text-foreground">{user?.email || "developer@vyron.ai"}</strong>. Your authenticated session remains active across workspace exits.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/app/settings">Account Settings</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/help">Help & Docs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* AUTHORITATIVE EXIT OUTCOME NOTICE (Command Center Banner) */}
      {exitOutcome && (
        <Card className="surface mb-4 border border-border/80 bg-zinc-950/90 shadow-xl rounded-2xl overflow-hidden animate-in fade-in duration-300">
          <div
            className={`h-1.5 w-full ${
              exitOutcome === "saved"
                ? "bg-emerald-500"
                : exitOutcome === "discarded"
                  ? "bg-amber-500"
                  : "bg-primary"
            }`}
          />
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl border ${
                  exitOutcome === "saved"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    : exitOutcome === "discarded"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                      : "bg-primary/15 text-primary border-primary/25"
                }`}
              >
                {exitOutcome === "saved" ? (
                  <CheckCircle2 className="size-5" />
                ) : exitOutcome === "discarded" ? (
                  <Trash2 className="size-5" />
                ) : (
                  <ShieldCheck className="size-5" />
                )}
              </span>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground">
                    {exitOutcome === "saved"
                      ? "Workspace safely exited — verified changes saved"
                      : exitOutcome === "discarded"
                        ? "Workspace exited — unsaved changes discarded"
                        : "Workspace closed cleanly"}
                  </h3>
                  {outcomeProject && (
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      {outcomeProject}
                    </Badge>
                  )}
                  {exitTime && (
                    <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="size-3" />
                      {exitTime}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {exitOutcome === "saved"
                    ? `All modified records${outcomeProject ? ` for ${outcomeProject}` : ""} were committed to project storage before leaving.`
                    : exitOutcome === "discarded"
                      ? `Only uncommitted edits were discarded. Previously saved records and conversations for ${outcomeProject || "your project"} remain completely intact.`
                      : "Workspace closed cleanly with zero pending mutations or background tasks."}
                </p>
                {sectionsList.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Synchronized Sections:</span>
                    {sectionsList.map((sec) => (
                      <Badge key={sec} variant="secondary" className="text-[10px] bg-zinc-900 border border-border/60">
                        {sec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirmedRecord?.attemptId) {
                  workspaceExitCoordinator.consumeExitOutcome(confirmedRecord.attemptId);
                }
                navigate({ to: "/app" });
              }}
              className="text-xs text-muted-foreground hover:text-foreground shrink-0 self-end sm:self-center"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

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

            {/* EXIT WORKSPACE ACTION */}
            {activeProject && (
              <WorkspaceExitButton
                projectId={activeProject.id}
                projectName={activeProject.name}
                variant="outline"
                className="border-border text-xs"
              />
            )}

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
        <div className="p-5 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/80 to-card/60 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold border border-primary/30">
                  PORTFOLIO COMMAND CENTER
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                  {displayProjects.length} Projects In Fleet
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Fleet Architecture Command Hub
              </h2>
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                Global engineering intelligence cockpit. Select any project workspace below to activate deep telemetry and live analysis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8">
                <Link to="/app/projects/new">
                  <PlusCircle className="size-3.5" />
                  New Project
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="text-xs border-border gap-1.5 h-8">
                <Link to="/app/github">
                  <GitBranch className="size-3.5" />
                  Connect GitHub
                </Link>
              </Button>
            </div>
          </div>

          {/* QUICK PROJECT SELECTION GRID */}
          {displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-border/40">
              {displayProjects.slice(0, 6).map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-lg border border-border/60 bg-zinc-950/50 hover:bg-zinc-900/80 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-foreground truncate">{proj.name}</span>
                      <StatusBadge status={proj.status} />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{proj.description || "Enterprise architecture workspace"}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px] font-mono">
                    <span className="text-muted-foreground">Health: <strong className="text-foreground">{proj.healthScore}/100</strong></span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete({ id: proj.id, name: proj.name });
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        title={`Delete ${proj.name}`}
                        aria-label={`Delete ${proj.name}`}
                      >
                        <Trash2 className="size-3 text-rose-400/80 hover:text-rose-400" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveProject(proj.id, { navigateToProject: true })}
                        className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10 gap-1"
                      >
                        Open Workspace <ArrowRight className="size-2.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-lg border border-dashed border-border/60 bg-zinc-950/40 text-center space-y-2">
              <FolderKanban className="size-6 text-muted-foreground mx-auto" />
              <h4 className="text-xs font-bold text-foreground">No Projects In Storage</h4>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                No active project selected. Create a new architecture project or connect a GitHub repository.
              </p>
            </div>
          )}

          {/* CONFIRM PROJECT DELETION DIALOG */}
          <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && !isDeletingProject && setProjectToDelete(null)}>
            <AlertDialogContent className="border-border bg-zinc-950 text-foreground max-w-md shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                  <AlertTriangle className="size-4 shrink-0 text-rose-400" />
                  Delete Project from Command Hub
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground space-y-2.5 pt-1">
                  <p>
                    Are you sure you want to delete <strong className="text-foreground">{projectToDelete?.name}</strong>?
                  </p>
                  <div className="p-2.5 rounded bg-zinc-900/90 border border-border/80 text-[11px] text-zinc-300 space-y-1">
                    <p className="font-semibold text-rose-300">Consequences of Deletion:</p>
                    <p>
                      This operation permanently removes this project record, local analysis runs, and telemetry findings from your internal VYRON workspace.
                    </p>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 p-2 rounded">
                    🛡️ Zero Remote Mutation: Your remote GitHub repository, branches, commits, and external files will NOT be deleted or altered.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 pt-2">
                <AlertDialogCancel
                  disabled={isDeletingProject}
                  onClick={() => setProjectToDelete(null)}
                  className="text-xs h-8 border-border bg-zinc-900 hover:bg-zinc-800"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeletingProject}
                  onClick={handleConfirmDeleteProject}
                  className="text-xs h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold gap-1.5"
                >
                  {isDeletingProject ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-3" />
                      Delete Project
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
