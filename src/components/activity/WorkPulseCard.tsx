import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  Clock,
  Sparkles,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectPulse } from "@/types/activity";

interface WorkPulseCardProps {
  pulse?: ProjectPulse | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClick?: () => void;
}

export function WorkPulseCard({
  pulse,
  isLoading,
  isError,
  onRetry,
  onClick,
}: WorkPulseCardProps) {
  // Determine state
  const state: "loading" | "empty" | "error" | "live" | "stale" | "anomaly" = useMemo(() => {
    if (isLoading) return "loading";
    if (isError) return "error";
    if (!pulse) return "empty";

    // Check for anomaly: velocity_24h > 3 * mean or momentum > 200%
    if (pulse.velocity_24h > 15 || pulse.momentum > 200) return "anomaly";

    // Check for stale: last event > 48h ago
    if (pulse.last_event_at) {
      const diff = Date.now() - new Date(pulse.last_event_at).getTime();
      if (diff > 48 * 3600 * 1000) return "stale";
    }

    return "live";
  }, [isLoading, isError, pulse]);

  // Loading Skeleton State
  if (state === "loading") {
    return (
      <div className="h-56 rounded-lg border border-border/60 bg-card/60 p-5 animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="h-10 w-24 bg-muted rounded" />
        <div className="h-16 w-full bg-muted/40 rounded" />
        <div className="h-3 w-40 bg-muted rounded" />
      </div>
    );
  }

  // Error State
  if (state === "error") {
    return (
      <div className="h-56 rounded-lg border border-red-500/30 bg-red-500/5 p-5 flex flex-col items-center justify-center text-center space-y-3">
        <AlertTriangle className="size-7 text-red-400" />
        <div>
          <p className="text-xs font-semibold text-foreground">Failed to calculate pulse</p>
          <p className="text-[11px] text-muted-foreground">SQL RPC connection interrupted</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="h-7 text-xs gap-1">
            <RefreshCw className="size-3" /> Retry
          </Button>
        )}
      </div>
    );
  }

  // Empty State
  if (state === "empty" || !pulse) {
    return (
      <div className="h-56 rounded-lg border border-dashed border-border p-5 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
        <Clock className="size-6 opacity-60" />
        <p className="text-xs font-medium">No activity telemetry yet</p>
        <p className="text-[10px]">Project has zero recorded events in ledger</p>
      </div>
    );
  }

  // Dual Sparkline renderer (SVG mini bars)
  const maxBar = Math.max(...pulse.sparkline_24h, 1);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg border bg-card/70 backdrop-blur-sm p-5 transition-all duration-200 hover:bg-card hover:shadow-lg cursor-pointer ${
        state === "anomaly"
          ? "border-amber-500/40 ring-1 ring-amber-500/20"
          : state === "stale"
          ? "border-border/40 opacity-80"
          : "border-border/70 hover:border-primary/50"
      }`}
    >
      {/* Top Banner: Name + Status Dot + Anomaly Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${
                pulse.health >= 85
                  ? "bg-emerald-400"
                  : pulse.health >= 70
                  ? "bg-amber-400"
                  : "bg-red-400"
              }`}
            />
            <h4 className="text-sm font-semibold text-foreground truncate tracking-tight">
              {pulse.project_name}
            </h4>
          </div>

          <div className="flex items-center gap-2 mt-1">
            {/* Gate Chip */}
            <Badge
              variant="outline"
              className={`text-[10px] font-mono uppercase tracking-wider py-0 px-1.5 h-4 ${
                pulse.gate_status === "pass"
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : pulse.gate_status === "warning"
                  ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                  : "border-red-500/30 text-red-400 bg-red-500/10"
              }`}
            >
              Gate: {pulse.gate_status}
            </Badge>

            {/* Anomaly Badge */}
            {state === "anomaly" && (
              <Badge className="text-[10px] font-mono uppercase tracking-wider py-0 px-1.5 h-4 bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse">
                Velocity Anomaly (&gt;3σ)
              </Badge>
            )}

            {/* Stale Badge */}
            {state === "stale" && (
              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground py-0 px-1.5 h-4">
                Stale (&gt;48h)
              </Badge>
            )}
          </div>
        </div>

        {/* Health Score Mono Dial */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-mono font-bold tracking-tight text-foreground">
            {pulse.health}
            <span className="text-xs text-muted-foreground font-normal">/100</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
            Health Score
          </span>
        </div>
      </div>

      {/* 24h & Momentum Metrics Row */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border/50 py-3 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Velocity (24h)
          </span>
          <span className="font-mono text-base font-semibold text-foreground">
            {pulse.velocity_24h}{" "}
            <span className="text-[10px] font-normal text-muted-foreground">evts</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Momentum
          </span>
          <span
            className={`font-mono text-base font-semibold flex items-center gap-0.5 ${
              pulse.momentum > 0
                ? "text-emerald-400"
                : pulse.momentum < 0
                ? "text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            {pulse.momentum > 0 ? (
              <TrendingUp className="size-3.5 inline" />
            ) : pulse.momentum < 0 ? (
              <TrendingDown className="size-3.5 inline" />
            ) : null}
            {pulse.momentum > 0 ? `+${pulse.momentum}%` : `${pulse.momentum}%`}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Open Critical
          </span>
          <span
            className={`font-mono text-base font-bold ${
              pulse.open_critical > 0 ? "text-red-400" : "text-muted-foreground"
            }`}
          >
            {pulse.open_critical}
          </span>
        </div>
      </div>

      {/* 24h Hourly Distribution Sparkline */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
          <span>24h Velocity Cadence</span>
          <span>Peak: {maxBar} evts/hr</span>
        </div>
        <div className="flex items-end gap-0.5 h-7 w-full bg-muted/20 rounded p-1">
          {pulse.sparkline_24h.map((v, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all ${
                v > 0 ? "bg-primary/80 group-hover:bg-primary" : "bg-muted/40"
              }`}
              style={{ height: `${Math.max(15, (v / maxBar) * 100)}%` }}
              title={`Hour -${23 - i}: ${v} events`}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-2.5" />
          Last: {pulse.last_event_at ? new Date(pulse.last_event_at).toLocaleTimeString() : "None"}
        </span>

        {pulse.active_scans > 0 && (
          <span className="text-primary flex items-center gap-1 font-semibold">
            <Loader2 className="size-3 animate-spin" /> {pulse.active_scans} active scan
          </span>
        )}
      </div>
    </div>
  );
}
