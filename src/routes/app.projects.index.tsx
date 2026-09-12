import { Link, createFileRoute } from "@tanstack/react-router";
import {
  GitBranch,
  LayoutGrid,
  PlusCircle,
  Search,
  Table2,
  Landmark,
  Activity,
  ShoppingBag,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Cpu,
  Layers,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Terminal,
  User,
  FileEdit,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  RiskBadge,
  ScoreBar,
  StatusBadge,
} from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthScore } from "@/components/ui/HealthScore";
import { projects as mockProjects } from "@/lib/mock-data";
import { useProjects, type Project } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Search and filter every monitored project by status, risk level and health score.",
      },
      { property: "og:title", content: "Projects — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "All monitored projects with health, risk and security scores.",
      },
    ],
  }),
  component: ProjectsPage,
});

type ViewState = "loaded" | "loading" | "empty" | "error";

interface DisplayProject {
  id: string;
  name: string;
  slug?: string | undefined;
  domain: string;
  domain_secondary?: string[] | undefined;
  description: string;
  status: string;
  healthScore: number;
  securityScore: number;
  riskScore: number;
  deliveryRisk: "Low" | "Medium" | "High" | "Critical";
  repoConnected: boolean;
  repoUrl: string;
  targetUsers: Array<{ label: string; priority: number; custom?: boolean | undefined }>;
  platforms: string[];
  gateStrictness?: "advisory" | "standard" | "strict" | string | undefined;
  kpiTargets?:
    | {
        health_min?: number | undefined;
        coverage_min?: number | undefined;
        max_critical?: number | undefined;
      }
    | undefined;
  draftState?: unknown;
  wizardStep?: number | undefined;
}

function getDomainIcon(domain?: string | null) {
  const d = (domain || "").toLowerCase();
  if (d.includes("fintech") || d.includes("bank") || d.includes("pay")) return Landmark;
  if (d.includes("health") || d.includes("med") || d.includes("care") || d.includes("clinic"))
    return Activity;
  if (d.includes("commerce") || d.includes("retail") || d.includes("shop")) return ShoppingBag;
  if (d.includes("ai") || d.includes("intel") || d.includes("ml")) return Sparkles;
  if (d.includes("ed") || d.includes("camp") || d.includes("learn") || d.includes("edu"))
    return GraduationCap;
  if (d.includes("sec") || d.includes("gov") || d.includes("audit") || d.includes("risk"))
    return ShieldCheck;
  if (d.includes("dev") || d.includes("cloud") || d.includes("infra")) return Cpu;
  return Layers;
}

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("web") || p.includes("pwa")) return Globe;
  if (p.includes("mobile") || p.includes("ios") || p.includes("android")) return Smartphone;
  if (p.includes("desktop") || p.includes("macos") || p.includes("windows") || p.includes("linux"))
    return Monitor;
  if (p.includes("api") || p.includes("backend") || p.includes("micro")) return Server;
  return Terminal;
}

function ProjectsPage() {
  const [state, setState] = useState<ViewState>("loaded");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");
  const [health, setHealth] = useState("all");

  const { projects: dbProjects, loading: dbLoading, draftCount } = useProjects();

  // Combine dbProjects with mock projects so all catalogs & user-created projects exist
  const unifiedProjects = useMemo<DisplayProject[]>(() => {
    const list: DisplayProject[] = [];
    const seenIds = new Set<string>();

    if (dbProjects && dbProjects.length > 0) {
      for (const p of dbProjects) {
        seenIds.add(p.id);
        const isDraft = p.status === "draft" || !!p.draft_state;
        list.push({
          id: p.id,
          name: p.name,
          slug: p.slug,
          domain: p.domain || "Enterprise Software",
          domain_secondary: p.domain_secondary || [],
          description: p.description || "Generated via Brahma God Mode v2 generator.",
          status: isDraft ? "Draft (Wizard)" : p.status || "Active",
          healthScore: p.health_score || (isDraft ? 85 : 92),
          securityScore: 88,
          riskScore: 24,
          deliveryRisk: "Low",
          repoConnected: !!p.repo_full_name,
          repoUrl: p.repo_full_name || "",
          targetUsers: p.target_users || [
            { label: "Engineering Lead", priority: 1 },
            { label: "SecOps Engineer", priority: 2 },
          ],
          platforms: p.platforms || ["Web App"],
          gateStrictness: p.gate_strictness || "standard",
          kpiTargets: p.kpi_targets || { health_min: 80, coverage_min: 75 },
          draftState: p.draft_state,
          wizardStep: p.wizard_step,
        });
      }
    }

    // Add mock projects not yet in db
    for (const m of mockProjects) {
      if (!seenIds.has(m.id)) {
        list.push({
          id: m.id,
          name: m.name,
          slug: m.id,
          domain: m.domain,
          domain_secondary: [],
          description: m.description ?? "Monitored enterprise asset.",
          status: m.status,
          healthScore: m.healthScore,
          securityScore: m.securityScore,
          riskScore: m.riskScore,
          deliveryRisk: m.deliveryRisk,
          repoConnected: m.repoConnected,
          repoUrl: m.repoUrl || "",
          targetUsers: [
            { label: "Domain Operator", priority: 1 },
            { label: "Auditor", priority: 2 },
          ],
          platforms: ["Web App", "API"],
          gateStrictness: "standard",
          kpiTargets: { health_min: 80, coverage_min: 70 },
        });
      }
    }

    return list;
  }, [dbProjects]);

  const filtered = useMemo(
    () =>
      unifiedProjects.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q);
        const matchesStatus =
          status === "all" ||
          p.status === status ||
          (status === "Draft" && p.status.includes("Draft"));
        const matchesRisk = risk === "all" || p.deliveryRisk === risk;
        const matchesHealth =
          health === "all" ||
          (health === "high" && p.healthScore >= 80) ||
          (health === "mid" && p.healthScore >= 60 && p.healthScore < 80) ||
          (health === "low" && p.healthScore < 60);
        return matchesQuery && matchesStatus && matchesRisk && matchesHealth;
      }),
    [unifiedProjects, query, status, risk, health],
  );

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every project in this workspace with its latest blueprint, health, gate strictness, and risk signals."
        actions={
          <>
            <Tabs value={state} onValueChange={(v) => setState(v as ViewState)}>
              <TabsList aria-label="Preview list states">
                <TabsTrigger value="loaded">Loaded</TabsTrigger>
                <TabsTrigger value="loading">Loading</TabsTrigger>
                <TabsTrigger value="empty">Empty</TabsTrigger>
                <TabsTrigger value="error">Error</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button asChild className="gap-1.5 shadow-sm">
              <Link to="/app/projects/new">
                <PlusCircle className="size-4" aria-hidden />
                <span>Create project</span>
                {draftCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono leading-none">
                    {draftCount} draft
                  </span>
                )}
              </Link>
            </Button>
          </>
        }
      />

      <div className="surface flex flex-col gap-3 rounded-xl p-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, domain or description..."
            className="pl-9"
            aria-label="Search projects"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["Analyzed", "Analyzing", "Needs Review", "At Risk", "Draft"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger aria-label="Filter by risk">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              {["Low", "Medium", "High", "Critical"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s} risk
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={health} onValueChange={setHealth}>
            <SelectTrigger aria-label="Filter by health">
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any health</SelectItem>
              <SelectItem value="high">80 and above</SelectItem>
              <SelectItem value="mid">60 – 79</SelectItem>
              <SelectItem value="low">Below 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
          >
            <LayoutGrid className="size-4" aria-hidden /> Grid
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
          >
            <Table2 className="size-4" aria-hidden /> Table
          </Button>
        </div>
      </div>

      {state === "loading" || dbLoading ? <LoadingSkeleton variant="table" /> : null}
      {state === "error" ? (
        <ErrorState
          description="The project index could not be loaded."
          onRetry={() => setState("loaded")}
        />
      ) : null}
      {state === "empty" ? (
        <EmptyState
          title="No projects in this workspace"
          description="Create a project to generate its first blueprint."
          action={
            <Button asChild>
              <Link to="/app/projects/new">Create project</Link>
            </Button>
          }
        />
      ) : null}

      {state === "loaded" && !dbLoading ? (
        filtered.length === 0 ? (
          <EmptyState
            title="No projects match these filters"
            description="Try clearing the search term or widening the status and risk filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setRisk("all");
                  setHealth("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => {
              const DomainIcon = getDomainIcon(p.domain);
              const isDraft = p.status.includes("Draft") || !!p.draftState;

              return (
                <Card
                  key={p.id}
                  className="surface transition-all hover:border-primary/50 relative overflow-hidden flex flex-col justify-between"
                >
                  <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Header row with domain icon, name, and badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <DomainIcon className="size-4 text-cyan-400" />
                          </div>
                          <div className="min-w-0">
                            {isDraft ? (
                              <Link
                                to="/app/projects/new"
                                className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                              >
                                {p.name}
                              </Link>
                            ) : (
                              <Link
                                to="/app/projects/$id"
                                params={{ id: p.id }}
                                className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                              >
                                {p.name}
                              </Link>
                            )}
                            <span className="mt-0.5 block text-xs text-muted-foreground truncate">
                              {p.domain}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={p.status} />
                          {p.gateStrictness && (
                            <span
                              className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider",
                                p.gateStrictness === "strict"
                                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  : p.gateStrictness === "advisory"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-sky-500/15 text-sky-400 border border-sky-500/30",
                              )}
                            >
                              {p.gateStrictness}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>

                      {/* Top-3 Target User Chips */}
                      {p.targetUsers && p.targetUsers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1 items-center">
                          {p.targetUsers.slice(0, 3).map((u, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono",
                                u.custom
                                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                                  : "bg-secondary text-secondary-foreground border border-border/50",
                              )}
                            >
                              <User className="size-2.5 shrink-0 opacity-70" />
                              <span className="truncate max-w-[95px]">{u.label}</span>
                            </span>
                          ))}
                          {p.targetUsers.length > 3 && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              +{p.targetUsers.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Draft Resume Indicator Tag */}
                      {isDraft && (
                        <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
                          <div className="flex items-center gap-1.5">
                            <FileEdit className="size-3.5 shrink-0" />
                            <span>Draft step {p.wizardStep || 1} of 7 saved</span>
                          </div>
                          <Link
                            to="/app/projects/new"
                            className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-200 underline text-[11px]"
                          >
                            Resume <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* KPI & Health Score Row with Target Mini-Ring */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <HealthScore
                          score={p.healthScore}
                          targetScore={p.kpiTargets?.health_min ?? 80}
                          size="sm"
                          showLabel={false}
                        />
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                            <span>Health {p.healthScore}%</span>
                            <span className="text-[9px] text-cyan-400 font-mono">
                              (Target &ge;{p.kpiTargets?.health_min ?? 80}%)
                            </span>
                          </div>
                          <span className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground">
                            <GitBranch className="size-3 shrink-0" aria-hidden />
                            <span className="truncate max-w-[130px]">
                              {p.repoConnected ? p.repoUrl : "No repository"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <RiskBadge level={p.deliveryRisk} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="surface">
            <CardContent className="overflow-x-auto pt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Strictness</TableHead>
                    <TableHead>Target Users</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Health (Target)</TableHead>
                    <TableHead>Delivery Risk</TableHead>
                    <TableHead className="hidden lg:table-cell">Repository</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const DomainIcon = getDomainIcon(p.domain);
                    const isDraft = p.status.includes("Draft") || !!p.draftState;

                    return (
                      <TableRow key={p.id}>
                        <TableCell className="max-w-[200px]">
                          {isDraft ? (
                            <Link
                              to="/app/projects/new"
                              className="block truncate font-medium hover:text-primary transition-colors"
                            >
                              {p.name}
                            </Link>
                          ) : (
                            <Link
                              to="/app/projects/$id"
                              params={{ id: p.id }}
                              className="block truncate font-medium hover:text-primary transition-colors"
                            >
                              {p.name}
                            </Link>
                          )}
                          {p.slug && (
                            <span className="text-[10px] font-mono text-muted-foreground block truncate">
                              {p.slug}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                            <DomainIcon className="size-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate max-w-[120px]">{p.domain}</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {p.platforms.map((plat, idx) => {
                              const PlatIcon = getPlatformIcon(plat);
                              return (
                                <span
                                  key={idx}
                                  title={plat}
                                  className="p-1 rounded bg-secondary/60 border border-border/40 text-muted-foreground"
                                >
                                  <PlatIcon className="size-3" />
                                </span>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {p.gateStrictness ? (
                            <span
                              className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider",
                                p.gateStrictness === "strict"
                                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  : p.gateStrictness === "advisory"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-sky-500/15 text-sky-400 border border-sky-500/30",
                              )}
                            >
                              {p.gateStrictness}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <div className="flex flex-wrap gap-1">
                            {p.targetUsers.slice(0, 2).map((u, idx) => (
                              <span
                                key={idx}
                                className={cn(
                                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono",
                                  u.custom
                                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                                    : "bg-secondary text-secondary-foreground border border-border/50",
                                )}
                              >
                                <span className="truncate max-w-[70px]">{u.label}</span>
                              </span>
                            ))}
                            {p.targetUsers.length > 2 && (
                              <span className="text-[9px] text-muted-foreground font-mono self-center">
                                +{p.targetUsers.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <HealthScore
                              score={p.healthScore}
                              targetScore={p.kpiTargets?.health_min ?? 80}
                              size="sm"
                              showLabel={false}
                            />
                            <span className="font-mono text-xs tabular-nums font-semibold">
                              {p.healthScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RiskBadge level={p.deliveryRisk} />
                        </TableCell>
                        <TableCell className="hidden max-w-[180px] truncate text-xs text-muted-foreground lg:table-cell">
                          {p.repoConnected ? p.repoUrl : "Not connected"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      ) : null}
    </>
  );
}
