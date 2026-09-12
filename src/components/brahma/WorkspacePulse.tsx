"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { projects } from "@/lib/mock-data";

export type ServiceHealthState =
  | "healthy"
  | "warning"
  | "degraded"
  | "critical"
  | "offline";

export interface SubsystemStatus {
  name: string;
  shortLabel: string;
  state: ServiceHealthState;
  latencyMs: number;
  availability: number;
  details: string;
  metricLabel: string;
  metricValue: string;
}

export interface WorkspacePulseData {
  activeProjects: number;
  totalProjects: number;
  analysesThisWeek: number;
  analysesDeltaPercent: number;
  averageHealthScore: number;
  healthDeltaPercent: number;
  healthTrendDirection: "up" | "down" | "stable";
  healthTrendHistory: number[];
  services: {
    api: SubsystemStatus;
    ai: SubsystemStatus;
    queue: SubsystemStatus;
  };
  overallStatus: "healthy" | "attention" | "degraded" | "critical";
  statusSummary: string;
  lastUpdated: string;
}

export interface WorkspacePulseProps {
  variant?: "sidebar" | "card" | "compact" | undefined;
  className?: string | undefined;
  onNavigate?: (() => void) | undefined;
  customData?: Partial<WorkspacePulseData> | undefined;
  isLoading?: boolean | undefined;
  error?: string | null | undefined;
}

// Compute default data from project model
function getDefaultWorkspaceData(): WorkspacePulseData {
  const activeCount = projects.filter((p) => p.status !== "Draft").length || projects.length;
  const scoredProjects = projects.filter((p) => typeof p.healthScore === "number");
  const avgHealth =
    scoredProjects.length > 0
      ? Math.round(
          scoredProjects.reduce((acc, p) => acc + p.healthScore, 0) /
            projects.length,
        )
      : 57;

  return {
    activeProjects: projects.length, // 5
    totalProjects: projects.length,
    analysesThisWeek: 38,
    analysesDeltaPercent: 12,
    averageHealthScore: avgHealth || 57,
    healthDeltaPercent: 8,
    healthTrendDirection: "up",
    healthTrendHistory: [48, 50, 52, 49, 53, 55, 57],
    services: {
      api: {
        name: "REST / GraphQL Gateway",
        shortLabel: "API",
        state: "healthy",
        latencyMs: 142,
        availability: 99.98,
        details: "Supabase GoTrue & REST endpoints responding within SLA",
        metricLabel: "Latency",
        metricValue: "142ms",
      },
      ai: {
        name: "AI Inference & AST Scanners",
        shortLabel: "AI",
        state: "healthy",
        latencyMs: 1840,
        availability: 99.95,
        details: "Lizard AST + Bandit security engine operational",
        metricLabel: "Inference",
        metricValue: "1.8s",
      },
      queue: {
        name: "Celery Task Dispatcher",
        shortLabel: "Q",
        state: "warning",
        latencyMs: 310,
        availability: 99.8,
        details: "Task queue processing background PDF/AST jobs; 12 in queue",
        metricLabel: "Backlog",
        metricValue: "12 jobs",
      },
    },
    overallStatus: "attention",
    statusSummary: "1 queue task processing; core services nominal",
    lastUpdated: "Just now",
  };
}

/**
 * Precision mini sparkline path generator
 */
function generateSparklinePath(
  data: number[],
  width: number,
  height: number,
  padding = 2,
) {
  if (!data || data.length < 2) {
    return {
      linePath: `M 0,${height / 2} L ${width},${height / 2}`,
      areaPath: `M 0,${height / 2} L ${width},${height / 2} L ${width},${height} L 0,${height} Z`,
    };
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points: { x: number; y: number }[] = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y =
      height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) {
    return {
      linePath: `M 0,${height / 2} L ${width},${height / 2}`,
      areaPath: `M 0,${height / 2} L ${width},${height / 2} L ${width},${height} L 0,${height} Z`,
    };
  }

  // Create smooth cubic bezier or line
  let linePath = `M ${first.x.toFixed(1)},${first.y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (prev && curr) {
      const midX = (prev.x + curr.x) / 2;
      linePath += ` C ${midX.toFixed(1)},${prev.y.toFixed(1)} ${midX.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }
  }

  const areaPath = `${linePath} L ${last.x.toFixed(1)},${height} L ${first.x.toFixed(1)},${height} Z`;

  return { linePath, areaPath };
}

export function WorkspacePulse({
  variant = "sidebar",
  className,
  onNavigate,
  customData,
  isLoading = false,
  error = null,
}: WorkspacePulseProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const data = useMemo(() => {
    const def = getDefaultWorkspaceData();
    return { ...def, ...customData };
  }, [customData]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setPulseKey((k) => k + 1);
    }, 600);
  };

  const sparkline = useMemo(() => {
    return generateSparklinePath(data.healthTrendHistory, 44, 15, 1.5);
  }, [data.healthTrendHistory]);

  const stateColors: Record<
    ServiceHealthState,
    { dot: string; text: string; bg: string; border: string }
  > = {
    healthy: {
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    warning: {
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    degraded: {
      dot: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]",
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    critical: {
      dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-ping",
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    offline: {
      dot: "bg-zinc-500",
      text: "text-zinc-400",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/20",
    },
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/50 bg-zinc-950/60 p-3.5 space-y-3 animate-pulse",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-24 bg-muted rounded" />
          <div className="h-2 w-12 bg-muted/60 rounded" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-2.5 w-20 bg-muted/40 rounded" />
            <div className="h-3 w-6 bg-muted/60 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-2.5 w-24 bg-muted/40 rounded" />
            <div className="h-3 w-8 bg-muted/60 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-2.5 w-24 bg-muted/40 rounded" />
            <div className="h-3 w-10 bg-muted/60 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-2 text-xs",
          className,
        )}
      >
        <div className="flex items-center justify-between text-rose-400">
          <span className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="size-3.5" /> Pulse Disconnected
          </span>
          <button
            onClick={handleRefresh}
            className="hover:text-rose-300"
            aria-label="Retry connection"
          >
            <RefreshCw className="size-3" />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        key={pulseKey}
        className={cn(
          "group/pulse relative rounded-xl border border-border/60 bg-gradient-to-b from-zinc-900/60 via-zinc-950/80 to-zinc-950/90 p-3.5 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]",
          variant === "card" && "p-4.5 sm:p-5",
          className,
        )}
      >
        {/* Subtle decorative inner corner accent */}
        <div className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* 1. HEADER SECTION */}
        <div className="flex items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                  data.overallStatus === "healthy"
                    ? "bg-emerald-400"
                    : "bg-amber-400",
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  data.overallStatus === "healthy"
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                )}
              />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary/95 font-mono drop-shadow-[0_0_10px_rgba(var(--primary),0.2)]">
              Workspace Pulse
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-muted-foreground/60 hover:text-foreground transition-colors p-0.5 rounded"
                  aria-label="Refresh workspace metrics"
                >
                  <RefreshCw
                    className={cn(
                      "size-2.5 transition-transform",
                      isRefreshing && "animate-spin text-primary",
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[11px]">
                Refresh pulse telemetry
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* 2. PRIMARY METRICS LIST */}
        <div className="mt-2.5 space-y-1.5">
          {/* Active Projects Metric */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/app/projects"
                onClick={onNavigate}
                className="flex items-baseline justify-between py-0.5 rounded px-1 -mx-1 hover:bg-white/[0.04] transition-colors group/row cursor-pointer"
              >
                <span className="text-[11px] text-muted-foreground group-hover/row:text-foreground/90 transition-colors">
                  Active projects
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-mono text-foreground tracking-tight">
                    {data.activeProjects}
                  </span>
                  <span className="text-[10px] text-muted-foreground/40 font-mono hidden sm:inline">
                    / {data.totalProjects}
                  </span>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs space-y-1 p-2.5">
              <p className="font-semibold text-foreground">Project Allocation</p>
              <p className="text-muted-foreground text-[11px]">
                {data.activeProjects} monitored repositories across active analysis tracks:
              </p>
              <div className="pt-1 text-[10px] font-mono space-y-0.5 text-muted-foreground/90">
                <div>• Aurora Payments: Health 91</div>
                <div>• MediSync Portal: Health 74</div>
                <div>• VaultLedger Console: Health 58</div>
                <div>• CampusFlow Attendance: Health 62</div>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Analyses This Week Metric */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/app/activity"
                onClick={onNavigate}
                className="flex items-baseline justify-between py-0.5 rounded px-1 -mx-1 hover:bg-white/[0.04] transition-colors group/row cursor-pointer"
              >
                <span className="text-[11px] text-muted-foreground group-hover/row:text-foreground/90 transition-colors">
                  Analyses this week
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold font-mono text-foreground tracking-tight">
                    {data.analysesThisWeek}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                    <ArrowUpRight className="size-2.5 inline" />
                    {data.analysesDeltaPercent}%
                  </span>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs space-y-1 p-2.5">
              <p className="font-semibold text-foreground">Weekly Run Velocity</p>
              <p className="text-muted-foreground text-[11px]">
                38 static and AI analyses completed (+12% vs last 7 days):
              </p>
              <div className="pt-1 text-[10px] font-mono space-y-0.5 text-muted-foreground/90">
                <span className="text-emerald-400">✓ 35 Successful AST Scans</span>
                <br />
                <span className="text-amber-400">⚠ 3 Flagged Security Hotspots</span>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Average Health Score Metric with Sparkline Focal Point */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/app/projects"
                onClick={onNavigate}
                className="flex items-center justify-between py-1 rounded px-1 -mx-1 hover:bg-white/[0.04] transition-colors group/row cursor-pointer"
              >
                <span className="text-[11px] text-muted-foreground group-hover/row:text-foreground/90 transition-colors">
                  Avg health score
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-bold font-mono tracking-tight",
                      data.averageHealthScore >= 70
                        ? "text-emerald-400"
                        : data.averageHealthScore >= 50
                          ? "text-emerald-400"
                          : "text-rose-400",
                    )}
                  >
                    {data.averageHealthScore}%
                  </span>

                  {/* Compact High-Fidelity SVG Sparkline */}
                  <div className="relative flex items-center">
                    <svg
                      className="h-3.5 w-11 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]"
                      viewBox="0 0 44 15"
                      fill="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="pulseHealthGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="currentColor"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="currentColor"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d={sparkline.areaPath}
                        fill="url(#pulseHealthGrad)"
                        className="opacity-60"
                      />
                      <path
                        d={sparkline.linePath}
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-0.5">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs space-y-1.5 p-2.5">
              <p className="font-semibold text-foreground flex items-center justify-between">
                <span>Portfolio Health Index</span>
                <span className="text-emerald-400 font-mono">
                  {data.averageHealthScore}/100
                </span>
              </p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Calculated dynamically from:
              </p>
              <div className="space-y-0.5 text-[10px] font-mono text-muted-foreground/90">
                <div className="flex justify-between">
                  <span>• Cyclomatic Complexity:</span>
                  <span className="text-foreground">82/100</span>
                </div>
                <div className="flex justify-between">
                  <span>• Security Posture:</span>
                  <span className="text-foreground">64/100</span>
                </div>
                <div className="flex justify-between">
                  <span>• Architecture Alignment:</span>
                  <span className="text-foreground">78/100</span>
                </div>
              </div>
              <div className="pt-1 text-[10px] text-emerald-400 font-mono border-t border-border/40">
                ↗ Trajectory: +8% over rolling 7-day window
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 3. SUBSYSTEM STATUS INDICATORS (API, AI, Q) */}
        <div className="mt-3 border-t border-border/40 pt-2.5">
          <div className="grid grid-cols-3 gap-1">
            {/* API Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/[0.04] transition-colors cursor-help">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover/pulse:scale-110",
                      stateColors[data.services.api.state].dot,
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-mono font-semibold text-muted-foreground/90 tracking-wide">
                    {data.services.api.shortLabel}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs space-y-1 p-2.5 max-w-[200px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {data.services.api.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {data.services.api.availability}%
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {data.services.api.details}
                </p>
                <div className="pt-1 text-[10px] font-mono text-muted-foreground/80 flex justify-between border-t border-border/40">
                  <span>Status: Operational</span>
                  <span className="text-foreground font-semibold">
                    {data.services.api.metricValue}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>

            {/* AI Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/[0.04] transition-colors cursor-help">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover/pulse:scale-110",
                      stateColors[data.services.ai.state].dot,
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-mono font-semibold text-muted-foreground/90 tracking-wide">
                    {data.services.ai.shortLabel}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs space-y-1 p-2.5 max-w-[210px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {data.services.ai.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {data.services.ai.availability}%
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {data.services.ai.details}
                </p>
                <div className="pt-1 text-[10px] font-mono text-muted-foreground/80 flex justify-between border-t border-border/40">
                  <span>Model: GPT-4o / Claude</span>
                  <span className="text-foreground font-semibold">
                    {data.services.ai.metricValue}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>

            {/* Q (Queue) Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/[0.04] transition-colors cursor-help">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      stateColors[data.services.queue.state].dot,
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-mono font-semibold text-muted-foreground/90 tracking-wide">
                    {data.services.queue.shortLabel}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs space-y-1 p-2.5 max-w-[210px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {data.services.queue.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Processing
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {data.services.queue.details}
                </p>
                <div className="pt-1 text-[10px] font-mono text-muted-foreground/80 flex justify-between border-t border-border/40">
                  <span>Active Workers: 4</span>
                  <span className="text-amber-400 font-semibold">
                    {data.services.queue.metricValue}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* 4. ACTIVITY FEED CTA WITH SMOOTH MICRO-INTERACTION */}
        <div className="mt-2.5 pt-1">
          <Link
            to="/app/activity"
            onClick={onNavigate}
            className="group/cta flex items-center justify-between text-[10.5px] font-semibold text-primary transition-all duration-200 hover:text-primary-foreground hover:bg-primary/10 rounded-md px-1.5 py-1 -mx-1"
          >
            <span className="tracking-tight">View activity feed</span>
            <span className="inline-block transition-transform duration-200 ease-out group-hover/cta:translate-x-1 font-mono">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default WorkspacePulse;
