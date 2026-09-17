/**
 * VYRON — TEMPORAL ENGINEERING HEALTH EXPLORER (PHASE 04)
 * Interactive temporal health analysis with time zoom, point selection, period & release comparison,
 * event overlays, and contextual health change chain.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { timeMachineEngine } from "@/services/intelligence/timeMachineEngine";
import { healthCausalityEngine } from "@/services/intelligence/healthCausalityEngine";
import { cn } from "@/lib/utils";
import {
  Calendar,
  GitCommit,
  Rocket,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface HealthPoint {
  month: string;
  date: string;
  health: number;
  security: number;
  risk: number;
  events: Array<{
    type: "deployment" | "commit" | "drift" | "incident" | "security";
    title: string;
    details: string;
    changeset?: string;
    component?: string;
    release?: string;
    evidenceHash?: string;
  }>;
}

const TEMPORAL_HEALTH_SERIES: HealthPoint[] = [
  {
    month: "Mar",
    date: "2026-03-15",
    health: 61,
    security: 55,
    risk: 72,
    events: [
      {
        type: "deployment",
        title: "Release v2.1.0 Initial Migration",
        details: "Legacy database cutover to microservice architecture.",
        changeset: "commit_9a12c4b",
        component: "srv-settlement",
        release: "v2.1.0",
        evidenceHash: "sha256_9a12c4b81092e001",
      },
    ],
  },
  {
    month: "Apr",
    date: "2026-04-12",
    health: 66,
    security: 60,
    risk: 66,
    events: [
      {
        type: "commit",
        title: "EARS Requirements Harmonization",
        details: "FR-01 through FR-05 requirement definitions validated.",
        changeset: "commit_e4510ad",
        component: "req-idem-02",
        release: "v2.1.4",
        evidenceHash: "sha256_e4510ad819230192",
      },
    ],
  },
  {
    month: "May",
    date: "2026-05-18",
    health: 70,
    security: 64,
    risk: 58,
    events: [
      {
        type: "drift",
        title: "Direct Database Query Boundary Drift",
        details: "Direct query introduced in billing worker bypassing DAO.",
        changeset: "commit_7718fa0",
        component: "services/billing/query.ts",
        release: "v2.2.0",
        evidenceHash: "sha256_7718fa0092147162",
      },
    ],
  },
  {
    month: "Jun",
    date: "2026-06-20",
    health: 75,
    security: 71,
    risk: 51,
    events: [
      {
        type: "security",
        title: "Bandit AST Security Scanner Activated",
        details: "Lizard CCN and Bandit automated checks wired into CI.",
        changeset: "commit_b881920",
        component: "finledger/auth",
        release: "v2.2.8",
        evidenceHash: "sha256_b881920198273619",
      },
    ],
  },
  {
    month: "Jul",
    date: "2026-07-22",
    health: 79,
    security: 76,
    risk: 44,
    events: [
      {
        type: "deployment",
        title: "Release v2.3.0 Milestone 1 Baseline",
        details: "GoTrue token auth and API gateway rate limiting.",
        changeset: "commit_31a48ff",
        component: "srv-gateway",
        release: "v2.3.0",
        evidenceHash: "sha256_31a48ff991028374",
      },
    ],
  },
  {
    month: "Aug",
    date: "2026-08-25",
    health: 84,
    security: 81,
    risk: 38,
    events: [
      {
        type: "incident",
        title: "Acquirer Callback Latency Spike",
        details: "Payment gateway transient timeout mitigated with Redis idempotency.",
        changeset: "commit_15c90aa",
        component: "srv-settlement",
        release: "v2.3.9",
        evidenceHash: "sha256_15c90aa771029384",
      },
    ],
  },
];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function TemporalHealthExplorer() {
  const {
    activeOverlays,
    toggleOverlay,
    selectEntity,
    activeTimeTravelSnapshot,
    setTimeTravelSnapshot,
  } = useCommandCenter();

  const [timeZoom, setTimeZoom] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("6M");
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(TEMPORAL_HEALTH_SERIES.length - 1);
  const [compareEnv, setCompareEnv] = useState<boolean>(false);

  const selectedPoint: HealthPoint = TEMPORAL_HEALTH_SERIES[selectedPointIndex] ?? TEMPORAL_HEALTH_SERIES[0]!;

  const causality = useMemo(() => {
    return healthCausalityEngine.evaluateCausality(
      selectedPoint.health,
      selectedPoint.security,
      selectedPoint.date,
    );
  }, [selectedPoint]);

  const filteredData = useMemo(() => {
    if (timeZoom === "1M") return TEMPORAL_HEALTH_SERIES.slice(-1);
    if (timeZoom === "3M") return TEMPORAL_HEALTH_SERIES.slice(-3);
    return TEMPORAL_HEALTH_SERIES;
  }, [timeZoom]);

  const handlePointClick = (data: HealthPoint) => {
    const idx = TEMPORAL_HEALTH_SERIES.findIndex((p) => p.month === data.month);
    if (idx !== -1) {
      setSelectedPointIndex(idx);
    }
  };

  return (
    <div className="space-y-4">
      {/* TIME CONTROLS & OVERLAYS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border/40 bg-zinc-950/40 text-xs">
        {/* TIME ZOOM BUTTONS */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground mr-1 text-[11px]">Range:</span>
          {(["1M", "3M", "6M", "ALL"] as const).map((z) => (
            <Button
              key={z}
              variant={timeZoom === z ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeZoom(z)}
              className="h-6 px-2 text-[10px] font-mono"
            >
              {z}
            </Button>
          ))}
        </div>

        {/* EVENT OVERLAY TOGGLES */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-muted-foreground mr-1 text-[11px]">Overlays:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleOverlay("deployments")}
            className={cn(
              "h-6 px-2 text-[10px] font-mono gap-1",
              activeOverlays.deployments ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "opacity-50",
            )}
          >
            <Rocket className="size-2.5" /> Deployments
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleOverlay("commits")}
            className={cn(
              "h-6 px-2 text-[10px] font-mono gap-1",
              activeOverlays.commits ? "bg-primary/15 text-primary border-primary/30" : "opacity-50",
            )}
          >
            <GitCommit className="size-2.5" /> Commits
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleOverlay("drift")}
            className={cn(
              "h-6 px-2 text-[10px] font-mono gap-1",
              activeOverlays.drift ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "opacity-50",
            )}
          >
            <AlertTriangle className="size-2.5" /> Drift
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleOverlay("security")}
            className={cn(
              "h-6 px-2 text-[10px] font-mono gap-1",
              activeOverlays.security ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "opacity-50",
            )}
          >
            <ShieldAlert className="size-2.5" /> Security
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompareEnv(!compareEnv)}
            className={cn(
              "h-6 px-2 text-[10px] font-mono gap-1",
              compareEnv ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/40" : "opacity-50",
            )}
          >
            Compare Staging
          </Button>
        </div>
      </div>

      {/* INTERACTIVE AREA CHART */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ left: -18, right: 6, top: 6 }}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload[0]) {
                handlePointClick(e.activePayload[0].payload as HealthPoint);
              }
            }}
          >
            <defs>
              <linearGradient id="gHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="health"
              name="Portfolio Health"
              stroke="var(--chart-1)"
              fill="url(#gHealth)"
              strokeWidth={2}
              activeDot={{ r: 6, onClick: (_, event) => event.stopPropagation() }}
            />
            <Area
              type="monotone"
              dataKey="security"
              name="Security Baseline"
              stroke="var(--chart-2)"
              fill="url(#gSec)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* REQUIRED CHAIN: HEALTH CHANGE → TIME → EVENTS → CHANGESET → COMPONENT → DEPENDENCY → RELEASE → RUNTIME → EVIDENCE */}
      <div className="p-3.5 rounded-lg border border-primary/25 bg-zinc-950/60 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" /> Selected Temporal Snapshot: {selectedPoint.month} ({selectedPoint.date})
            </span>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10">
              Score: {selectedPoint.health}/100
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-mono",
                causality.causalityTier === "VERIFIED_CAUSAL_RELATIONSHIP" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                causality.causalityTier === "INFERRED_CAUSAL_HYPOTHESIS" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                causality.causalityTier === "OBSERVED_CORRELATION" && "text-sky-400 border-sky-500/30 bg-sky-500/10",
              )}
            >
              {causality.causalityTier}
            </Badge>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px] gap-1 font-mono"
            onClick={() => {
              selectEntity({
                type: "health_point",
                id: `snap_${selectedPoint.date}`,
                name: `Health Snapshot ${selectedPoint.month} 2026`,
                severity: selectedPoint.health < 70 ? "HIGH" : "LOW",
                status: "EVALUATED",
                details: `Portfolio health reached ${selectedPoint.health} points with security score ${selectedPoint.security}. Causality evaluated as ${causality.causalityTier}.`,
                evidenceHash: selectedPoint.events[0]?.evidenceHash,
                metadata: {
                  health: selectedPoint.health,
                  security: selectedPoint.security,
                  events: selectedPoint.events,
                  causalityTier: causality.causalityTier,
                  causalityConfidence: causality.confidence,
                  causalFactors: causality.causalFactors,
                },
              });
            }}
          >
            <Sparkles className="size-2.5 text-primary" /> Inspect Full Chain in Drawer
          </Button>
        </div>

        {/* CAUSALITY REASONING SUMMARY */}
        <div className="text-[11px] text-muted-foreground flex flex-wrap items-center justify-between border-t border-border/20 pt-1.5 px-0.5">
          <span>Leading Causal Factor: <strong className="text-foreground">{causality.causalFactors[0]?.factor || "Nominal telemetry"}</strong> ({Math.round((causality.causalFactors[0]?.weight ?? 0.85) * 100)}% weight)</span>
          <span className="font-mono text-primary text-[10px]">Causal Confidence: {Math.round(causality.confidence * 100)}%</span>
        </div>

        {/* CHAIN DISPLAY */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono p-2 rounded border border-border/30 bg-zinc-900/40 overflow-x-auto">
          <span className="text-emerald-400 font-bold">HEALTH: {selectedPoint.health}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-primary font-bold">TIME: {selectedPoint.date}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-indigo-300 font-bold">EVENT: {selectedPoint.events[0]?.title || "Nominal Operation"}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-amber-400 font-bold">CHANGESET: {selectedPoint.events[0]?.changeset || "HEAD"}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-purple-400 font-bold">COMPONENT: {selectedPoint.events[0]?.component || "Gateway"}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-cyan-400 font-bold">RELEASE: {selectedPoint.events[0]?.release || "v2.4.0"}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-foreground font-bold truncate max-w-[120px]">
            EVIDENCE: {selectedPoint.events[0]?.evidenceHash?.slice(0, 12)}...
          </span>
        </div>
      </div>
    </div>
  );
}
