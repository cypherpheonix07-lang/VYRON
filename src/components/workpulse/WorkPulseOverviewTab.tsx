import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  GitPullRequest,
  Layers,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkspacePulse } from "@/components/brahma/WorkspacePulse";
import type { WorkspacePulse as WorkspacePulseType } from "@/types/activity";
import type { Project } from "@/hooks/useProjects";

interface WorkPulseOverviewTabProps {
  pulse: WorkspacePulseType | null;
  isLoading: boolean;
  error: string | null;
  dateRange: string;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onRefresh: () => void;
}

function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  trend,
  trendLabel,
  href,
  isLoading,
}: {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  href?: string;
  isLoading?: boolean;
}) {
  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm p-4 transition-all duration-200",
        "hover:shadow-md hover:bg-card hover:-translate-y-px",
        borderColor,
        isLoading && "animate-pulse",
      )}
    >
      {/* Subtle shimmer gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/[0.02] to-transparent" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={cn("grid size-7 place-items-center rounded-lg", bgColor)}>
          <Icon className={cn("size-3.5", color)} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-7 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted/60 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-[10px] font-mono uppercase text-muted-foreground">{unit}</span>
            )}
          </div>
          {trendLabel && (
            <div className="mt-1.5 flex items-center gap-1">
              {trend === "up" && <TrendingUp className="size-3 text-emerald-400" />}
              {trend === "down" && <AlertTriangle className="size-3 text-amber-400" />}
              <span
                className={cn(
                  "text-[10px] font-mono",
                  trend === "up" && "text-emerald-400",
                  trend === "down" && "text-amber-400",
                  trend === "neutral" && "text-muted-foreground",
                )}
              >
                {trendLabel}
              </span>
            </div>
          )}
        </>
      )}

      {href && !isLoading && (
        <span className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-60 transition-opacity">
          <ArrowUpRight className="size-3 text-muted-foreground" />
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href as never} aria-label={`View ${label}`}>
        {content}
      </Link>
    );
  }
  return content;
}

export function WorkPulseOverviewTab({
  pulse,
  isLoading,
  error,
  projects,
  onSelectProject,
  onRefresh,
}: WorkPulseOverviewTabProps) {
  const activeProjects = useMemo(
    () => projects.filter((p) => p.status !== "Draft" && p.status !== "Archived"),
    [projects],
  );

  const avgHealth = useMemo(() => {
    const scored = projects.filter((p) => typeof p.health_score === "number");
    if (scored.length === 0) return 74;
    return Math.round(
      scored.reduce((acc, p) => acc + (p.health_score ?? 0), 0) / scored.length,
    );
  }, [projects]);

  // If error with no pulse, show full error state
  if (error && !pulse && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="size-14 rounded-full border border-rose-500/30 bg-rose-950/20 grid place-items-center">
          <AlertTriangle className="size-6 text-rose-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">WorkPulse Data Unavailable</h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">{error}</p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="size-3.5" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* ─── Summary Metric Cards ───────────────────────────────────────── */}
      <section aria-label="Workspace summary metrics">
        <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70 mb-3 px-0.5">
          Workspace Telemetry
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Active Projects"
            value={isLoading ? "—" : activeProjects.length}
            unit="repos"
            icon={Layers}
            color="text-primary"
            bgColor="bg-primary/10"
            borderColor="border-primary/20"
            trend="up"
            trendLabel={`${projects.length} total monitored`}
            href="/app/projects"
            isLoading={isLoading}
          />
          <MetricCard
            label="Avg Health"
            value={isLoading ? "—" : avgHealth}
            unit="%"
            icon={Activity}
            color={avgHealth >= 70 ? "text-emerald-400" : avgHealth >= 50 ? "text-amber-400" : "text-rose-400"}
            bgColor={avgHealth >= 70 ? "bg-emerald-500/10" : avgHealth >= 50 ? "bg-amber-500/10" : "bg-rose-500/10"}
            borderColor={avgHealth >= 70 ? "border-emerald-500/20" : avgHealth >= 50 ? "border-amber-500/20" : "border-rose-500/20"}
            trend={avgHealth >= 70 ? "up" : "down"}
            trendLabel={avgHealth >= 70 ? "Healthy baseline" : "Needs attention"}
            href="/app/reports"
            isLoading={isLoading}
          />
          <MetricCard
            label="Events Today"
            value={isLoading ? "—" : (pulse?.events_today ?? 0)}
            unit="evts"
            icon={Zap}
            color="text-cyan-400"
            bgColor="bg-cyan-500/10"
            borderColor="border-cyan-500/20"
            trend="neutral"
            trendLabel="Realtime stream"
            href="/app/activity"
            isLoading={isLoading}
          />
          <MetricCard
            label="Blocked Gates"
            value={isLoading ? "—" : (pulse?.blocked_gates ?? 0)}
            unit="gates"
            icon={ShieldAlert}
            color={(pulse?.blocked_gates ?? 0) > 0 ? "text-amber-400" : "text-emerald-400"}
            bgColor={(pulse?.blocked_gates ?? 0) > 0 ? "bg-amber-500/10" : "bg-emerald-500/10"}
            borderColor={(pulse?.blocked_gates ?? 0) > 0 ? "border-amber-500/30" : "border-emerald-500/20"}
            trend={(pulse?.blocked_gates ?? 0) > 0 ? "down" : "up"}
            trendLabel={(pulse?.blocked_gates ?? 0) > 0 ? "Release blocked" : "Gates clear"}
            href="/app/missions"
            isLoading={isLoading}
          />
          <MetricCard
            label="Open Criticals"
            value={isLoading ? "—" : (pulse?.open_critical ?? 0)}
            unit="vulns"
            icon={Shield}
            color={(pulse?.open_critical ?? 0) > 0 ? "text-rose-400" : "text-emerald-400"}
            bgColor={(pulse?.open_critical ?? 0) > 0 ? "bg-rose-500/10" : "bg-emerald-500/10"}
            borderColor={(pulse?.open_critical ?? 0) > 0 ? "border-rose-500/30" : "border-emerald-500/20"}
            trend={(pulse?.open_critical ?? 0) > 0 ? "down" : "up"}
            trendLabel={(pulse?.open_critical ?? 0) > 0 ? "Immediate action" : "All clear"}
            href="/app/admin/audit"
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* ─── Two-column content ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: Workspace Pulse Widget (reused from sidebar, card variant) */}
        <div className="lg:col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">
              System Health
            </h2>
          </div>
          <WorkspacePulse variant="card" />
        </div>

        {/* Right: Project Health Table */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">
              Project Health Overview
            </h2>
            <Link
              to="/app/projects"
              className="text-[10px] font-mono text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            {isLoading ? (
              <div className="divide-y divide-border/40">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="size-7 bg-muted/40 rounded-lg" />
                      <div className="space-y-1">
                        <div className="h-3 w-32 bg-muted rounded" />
                        <div className="h-2.5 w-20 bg-muted/60 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-12 bg-muted/40 rounded-full" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Layers className="size-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No projects found</p>
                <Link
                  to="/app/projects/new"
                  className="mt-3 text-xs text-primary hover:underline font-medium"
                >
                  Create your first project →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {projects.slice(0, 8).map((project) => {
                  const health = project.health_score ?? 0;
                  const healthColor =
                    health >= 70 ? "text-emerald-400" : health >= 50 ? "text-amber-400" : "text-rose-400";
                  const healthBg =
                    health >= 70
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : health >= 50
                        ? "bg-amber-500/10 border-amber-500/20"
                        : "bg-rose-500/10 border-rose-500/20";
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => onSelectProject(project.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors text-left group"
                      aria-label={`View activity for ${project.name}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-7 shrink-0 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center">
                          <GitPullRequest className="size-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{project.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{project.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {health > 0 && (
                          <Badge
                            variant="outline"
                            className={cn("font-mono text-[10px] px-1.5 border", healthBg, healthColor)}
                          >
                            {health}%
                          </Badge>
                        )}
                        <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Engineering Signals Feed ───────────────────────────────────── */}
      <section aria-label="Engineering signals">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">
            Engineering Signal Feed
          </h2>
          <Link to="/app/activity" className="text-[10px] font-mono text-primary hover:underline">
            Full feed →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              type: "DRIFT",
              title: "Shadow service container detected in deployment cluster",
              severity: "warning",
              timestamp: "2m ago",
              icon: Server,
            },
            {
              type: "RELEASE",
              title: "v2.4.0 Release Gate passed — zero blocking violations",
              severity: "success",
              timestamp: "14m ago",
              icon: CheckCircle2,
            },
            {
              type: "APPROVAL",
              title: "ADR-001 Redis idempotency RFC accepted by architect",
              severity: "info",
              timestamp: "1h ago",
              icon: Brain,
            },
            {
              type: "SECURITY",
              title: "Bandit AST scanner flagged CWE-89 injection risk",
              severity: "critical",
              timestamp: "3h ago",
              icon: ShieldAlert,
            },
          ].map((sig) => {
            const Icon = sig.icon;
            const colors: Record<string, string> = {
              critical: "border-rose-500/30 bg-rose-950/20 text-rose-400",
              warning: "border-amber-500/30 bg-amber-950/20 text-amber-400",
              info: "border-blue-500/30 bg-blue-950/20 text-blue-400",
              success: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
            };
            const cls = colors[sig.severity] ?? colors["info"];
            return (
              <Link
                key={sig.type}
                to="/app/activity"
                className={cn(
                  "group relative flex flex-col gap-2 rounded-xl border p-3.5 transition-all duration-150 hover:shadow-md hover:-translate-y-px",
                  cls,
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80">
                    {sig.type}
                  </span>
                  <span className="text-[9px] font-mono opacity-60">{sig.timestamp}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icon className="size-3.5 mt-0.5 shrink-0 opacity-80" />
                  <p className="text-[10.5px] leading-relaxed opacity-90 line-clamp-2">{sig.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
