import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  ShieldAlert,
  GitPullRequest,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkspacePulse } from "@/types/activity";
import type { Project } from "@/hooks/useProjects";

interface WorkPulseAnalyticsTabProps {
  pulse: WorkspacePulse | null;
  isLoading: boolean;
  dateRange: string;
  projects: Project[];
}

// ── Mock trend data (will be replaced by real Supabase aggregates) ──────────
function buildHealthTrend(range: string) {
  const periods: Record<string, string[]> = {
    "24h": ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h", "Now"],
    "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "30d": ["W1", "W2", "W3", "W4"],
    all: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  };
  const DEFAULT_LABELS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const labels: string[] = periods[range] ?? DEFAULT_LABELS;
  const seed = [72, 68, 74, 71, 78, 75, 80, 76, 82];
  return labels.map((label, i) => ({
    label,
    health: seed[i % seed.length] ?? 75,
    drift: Math.max(0, 5 - (i % 4)),
    criticals: Math.max(0, 3 - Math.floor(i / 2)),
  }));
}

function buildEventVolume(range: string) {
  const periods: Record<string, string[]> = {
    "24h": ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h"],
    "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "30d": ["W1", "W2", "W3", "W4"],
    all: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  };
  const DEFAULT_LABELS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const labels: string[] = periods[range] ?? DEFAULT_LABELS;
  const gates = [4, 7, 3, 8, 5, 2, 6];
  const scans = [12, 8, 15, 10, 13, 6, 11];
  const reports = [3, 5, 2, 6, 4, 1, 3];
  return labels.map((label, i) => ({
    label,
    gates: gates[i % gates.length] ?? 4,
    scans: scans[i % scans.length] ?? 10,
    reports: reports[i % reports.length] ?? 3,
  }));
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/80 bg-zinc-950/95 px-3 py-2 shadow-xl text-xs backdrop-blur-sm">
      <p className="font-mono font-bold text-foreground mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground capitalize">{p.name}</span>
          <span className="font-mono font-semibold" style={{ color: p.color }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Stat delta badge ─────────────────────────────────────────────────────────
function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-mono text-[10px]">
        <TrendingUp className="size-3" />+{delta}%
      </span>
    );
  if (delta < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-rose-400 font-mono text-[10px]">
        <TrendingDown className="size-3" />
        {delta}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-muted-foreground font-mono text-[10px]">
      <Minus className="size-3" />0%
    </span>
  );
}

export function WorkPulseAnalyticsTab({
  pulse,
  isLoading,
  dateRange,
  projects,
}: WorkPulseAnalyticsTabProps) {
  const healthTrend = useMemo(() => buildHealthTrend(dateRange), [dateRange]);
  const eventVolume = useMemo(() => buildEventVolume(dateRange), [dateRange]);

  const topProjects = useMemo(
    () =>
      [...projects]
        .filter((p) => typeof p.health_score === "number")
        .sort((a, b) => (b.health_score ?? 0) - (a.health_score ?? 0))
        .slice(0, 5),
    [projects],
  );

  return (
    <div className="space-y-7 animate-in fade-in-0 duration-200">
      {/* ─── KPI summary row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Health Trend",
            value: "+8%",
            delta: 8,
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Drift Events",
            value: pulse?.blocked_gates != null ? String(pulse.blocked_gates) : "—",
            delta: -12,
            icon: GitPullRequest,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Criticals Closed",
            value: pulse?.open_critical != null ? String(pulse.open_critical) : "—",
            delta: -5,
            icon: ShieldAlert,
            color: "text-rose-400",
            bg: "bg-rose-500/10 border-rose-500/20",
          },
          {
            label: "Active Repos",
            value: String(projects.filter((p) => p.status !== "Draft" && p.status !== "Archived").length),
            delta: 2,
            icon: Layers,
            color: "text-primary",
            bg: "bg-primary/10 border-primary/20",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={cn(
                "rounded-xl border p-4 space-y-2 backdrop-blur-sm",
                kpi.bg,
                isLoading && "animate-pulse",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </span>
                <Icon className={cn("size-3.5", kpi.color)} />
              </div>
              {isLoading ? (
                <div className="h-6 w-12 bg-muted/40 rounded" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-xl font-mono font-bold", kpi.color)}>{kpi.value}</span>
                  <DeltaBadge delta={kpi.delta} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Health Trend Chart ─────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              Health Score Trajectory
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Average workspace health over time with drift and critical signal overlay
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/40 p-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={healthTrend} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="wkp-health-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="wkp-drift-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="health"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#wkp-health-grad)"
                name="health"
              />
              <Area
                type="monotone"
                dataKey="drift"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fill="url(#wkp-drift-grad)"
                name="drift"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ─── Event Volume Chart + Top Projects ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Event Volume */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-foreground">Event Volume Breakdown</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gate evaluations, AST scans, and report exports
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={eventVolume} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                />
                <Bar dataKey="gates" fill="var(--color-primary)" radius={[3, 3, 0, 0]} name="gates" />
                <Bar dataKey="scans" fill="#22d3ee" radius={[3, 3, 0, 0]} name="scans" />
                <Bar dataKey="reports" fill="#a78bfa" radius={[3, 3, 0, 0]} name="reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top Projects by Health */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-foreground">Top Projects by Health</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by current health score
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            {isLoading ? (
              <div className="divide-y divide-border/40">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted rounded-full" />
                      <div className="h-3 w-28 bg-muted rounded" />
                    </div>
                    <div className="h-5 w-10 bg-muted/40 rounded-full" />
                  </div>
                ))}
              </div>
            ) : topProjects.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-muted-foreground">
                No health-scored projects found
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {topProjects.map((project, i) => {
                  const health = project.health_score ?? 0;
                  const healthColor =
                    health >= 70 ? "text-emerald-400" : health >= 50 ? "text-amber-400" : "text-rose-400";
                  const barColor =
                    health >= 70 ? "bg-emerald-500" : health >= 50 ? "bg-amber-500" : "bg-rose-500";
                  return (
                    <Link
                      key={project.id}
                      to={`/app/projects/${project.id}` as never}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground/60 w-4 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate">{project.name}</span>
                          <Badge
                            variant="outline"
                            className={cn("font-mono text-[9px] px-1 ml-2 shrink-0 border-transparent", healthColor)}
                          >
                            {health}%
                          </Badge>
                        </div>
                        {/* Health bar */}
                        <div className="h-1 w-full rounded-full bg-muted/30">
                          <div
                            className={cn("h-1 rounded-full transition-all duration-500", barColor)}
                            style={{ width: `${health}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
