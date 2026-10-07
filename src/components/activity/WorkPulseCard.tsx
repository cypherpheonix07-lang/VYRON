import { useState, useMemo } from "react";
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

export type WorkPulseVariant = "card" | "banner";
export type WorkPulseDensity = "compact" | "normal" | "expanded";

interface WorkPulseCardProps {
  pulse?: ProjectPulse | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClick?: () => void;
  density?: WorkPulseDensity;
  variant?: WorkPulseVariant;
}

export function WorkPulseCard({
  pulse,
  isLoading,
  isError,
  onRetry,
  onClick,
  density = "normal",
  variant = "card",
}: WorkPulseCardProps) {
  const [now] = useState(() => Date.now());
  // Determine state
  const state: "loading" | "empty" | "error" | "live" | "stale" | "anomaly" = useMemo(() => {
    if (isLoading) return "loading";
    if (isError) return "error";
    if (!pulse) return "empty";

    // Check for anomaly: velocity_24h > 3 * mean or momentum > 200%
    if (pulse.velocity_24h > 15 || pulse.momentum > 200) return "anomaly";

    // Check for stale: last event > 48h ago
    if (pulse.last_event_at) {
      const diff = now - new Date(pulse.last_event_at).getTime();
      if (diff > 48 * 3600 * 1000) return "stale";
    }

    return "live";
  }, [isLoading, isError, pulse, now]);

  const heightClass =
    density === "compact" ? "min-h-36 p-3.5" : density === "expanded" ? "min-h-72 p-6" : "min-h-56 p-5";

  // Loading Skeleton State
  if (state === "loading") {
    if (variant === "banner") {
      return (
        <div className="h-16 rounded-lg border border-border/60 bg-card/60 p-3 animate-pulse flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-2.5 bg-muted rounded-full" />
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-4 w-14 bg-muted rounded" />
          </div>
          <div className="h-6 w-16 bg-muted rounded" />
          <div className="hidden sm:flex gap-4">
            <div className="h-5 w-14 bg-muted rounded" />
            <div className="h-5 w-14 bg-muted rounded" />
            <div className="h-5 w-14 bg-muted rounded" />
          </div>
          <div className="hidden md:block h-6 w-28 bg-muted/40 rounded" />
        </div>
      );
    }

    return (
      <div className={`${heightClass} rounded-lg border border-border/60 bg-card/60 animate-pulse space-y-3`}>
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-4 w-14 bg-muted rounded" />
        </div>
        <div className="h-8 w-20 bg-muted rounded" />
        <div className="h-12 w-full bg-muted/40 rounded" />
        <div className="h-3 w-32 bg-muted rounded" />
      </div>
    );
  }

  // Error State
  if (state === "error") {
    if (variant === "banner") {
      return (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Failed to calculate project pulse</span>
          </div>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry} className="h-6 text-xs gap-1">
              <RefreshCw className="size-3" /> Retry
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className={`${heightClass} rounded-lg border border-red-500/30 bg-red-500/5 flex flex-col items-center justify-center text-center space-y-2`}>
        <AlertTriangle className={density === "compact" ? "size-5 text-red-400" : "size-7 text-red-400"} />
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
    if (variant === "banner") {
      return (
        <div className="rounded-lg border border-dashed border-border p-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4 opacity-60" />
            <span>No activity telemetry recorded yet for this project</span>
          </div>
        </div>
      );
    }

    return (
      <div className={`${heightClass} rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground space-y-2`}>
        <Clock className={density === "compact" ? "size-5 opacity-60" : "size-6 opacity-60"} />
        <p className="text-xs font-medium">No activity telemetry yet</p>
        <p className="text-[10px]">Project has zero recorded events in ledger</p>
      </div>
    );
  }

  // Dual Sparkline renderer (SVG mini bars)
  const maxBar = Math.max(...pulse.sparkline_24h, 1);

  // Banner Variant (Horizontal ribbon layout for top page headers)
  if (variant === "banner") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        className={`group relative overflow-hidden rounded-lg border bg-card/70 backdrop-blur-sm p-3 transition-all duration-200 hover:bg-card hover:shadow-md cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 ${
          state === "anomaly"
            ? "border-amber-500/40 ring-1 ring-amber-500/20"
            : state === "stale"
              ? "border-border/40 opacity-80"
              : "border-border/70 hover:border-primary/50"
        }`}
      >
        {/* Left: Project identity & status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`size-2.5 rounded-full shrink-0 ${
              pulse.health >= 85
                ? "bg-emerald-400"
                : pulse.health >= 70
                  ? "bg-amber-400"
                  : "bg-red-400"
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-foreground truncate tracking-tight">
                {pulse.project_name}
              </h4>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] uppercase tracking-wider py-0 px-1.5 h-4 ${
                  pulse.gate_status === "pass"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                    : pulse.gate_status === "warning"
                      ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                      : "border-red-500/30 text-red-400 bg-red-500/10"
                }`}
              >
                Gate: {pulse.gate_status}
              </Badge>
              {state === "anomaly" && (
                <Badge className="font-mono text-[9px] uppercase py-0 px-1.5 h-4 bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse">
                  Anomaly (&gt;3σ)
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="size-2.5" />
              Last: {pulse.last_event_at ? new Date(pulse.last_event_at).toLocaleTimeString() : "None"}
            </span>
          </div>
        </div>

        {/* Center: Health + Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-x border-border/50 pt-2 lg:pt-0 lg:px-5">
          {/* Health Score */}
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground leading-none">
              {pulse.health}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">/100 Health</span>
          </div>

          {/* Velocity */}
          <div>
            <span className="text-[9px] font-mono uppercase text-muted-foreground block">Velocity (24h)</span>
            <span className="font-mono font-semibold text-sm text-foreground">
              {pulse.velocity_24h} <span className="text-[9px] font-normal text-muted-foreground">evts</span>
            </span>
          </div>

          {/* Momentum */}
          <div>
            <span className="text-[9px] font-mono uppercase text-muted-foreground block">Momentum</span>
            <span
              className={`font-mono font-semibold text-sm flex items-center gap-0.5 ${
                pulse.momentum > 0
                  ? "text-emerald-400"
                  : pulse.momentum < 0
                    ? "text-amber-400"
                    : "text-muted-foreground"
              }`}
            >
              {pulse.momentum > 0 ? (
                <TrendingUp className="size-3 inline" />
              ) : pulse.momentum < 0 ? (
                <TrendingDown className="size-3 inline" />
              ) : null}
              {pulse.momentum > 0 ? `+${pulse.momentum}%` : `${pulse.momentum}%`}
            </span>
          </div>

          {/* Open Critical */}
          <div>
            <span className="text-[9px] font-mono uppercase text-muted-foreground block">Critical</span>
            <span
              className={`font-mono font-bold text-sm ${
                pulse.open_critical > 0 ? "text-red-400" : "text-muted-foreground"
              }`}
            >
              {pulse.open_critical}
            </span>
          </div>
        </div>

        {/* Right: Sparkline */}
        <div className="hidden sm:block w-36 shrink-0">
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground mb-0.5">
            <span>24h Velocity</span>
            <span>Peak: {maxBar}</span>
          </div>
          <div className="flex items-end gap-0.5 h-6 w-full bg-muted/20 rounded p-0.5">
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

        {/* Active Scans */}
        {pulse.active_scans > 0 && (
          <div className="shrink-0 text-primary flex items-center gap-1 text-xs font-semibold">
            <Loader2 className="size-3 animate-spin" /> {pulse.active_scans} active scan
          </div>
        )}
      </div>
    );
  }

  // Standard Card Variant (Grid view)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg border bg-card/70 backdrop-blur-sm transition-all duration-200 hover:bg-card hover:shadow-lg cursor-pointer ${
        density === "compact"
          ? "p-3.5 space-y-2.5"
          : density === "expanded"
            ? "p-6 space-y-4 shadow-md hover:shadow-xl"
            : "p-5 space-y-3"
      } ${
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
              className={`rounded-full shrink-0 ${
                density === "compact" ? "size-1.5" : density === "expanded" ? "size-2.5" : "size-2"
              } ${
                pulse.health >= 85
                  ? "bg-emerald-400"
                  : pulse.health >= 70
                    ? "bg-amber-400"
                    : "bg-red-400"
              }`}
            />
            <h4
              className={`font-semibold text-foreground truncate tracking-tight ${
                density === "compact" ? "text-xs" : density === "expanded" ? "text-base font-bold" : "text-sm"
              }`}
            >
              {pulse.project_name}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {/* Gate Chip */}
            <Badge
              variant="outline"
              className={`font-mono uppercase tracking-wider py-0 ${
                density === "compact"
                  ? "text-[9px] px-1 h-3.5"
                  : density === "expanded"
                    ? "text-xs px-2 h-5 font-semibold"
                    : "text-[10px] px-1.5 h-4"
              } ${
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
              <Badge
                className={`font-mono uppercase tracking-wider py-0 bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse ${
                  density === "compact" ? "text-[9px] px-1 h-3.5" : "text-[10px] px-1.5 h-4"
                }`}
              >
                Velocity Anomaly (&gt;3σ)
              </Badge>
            )}

            {/* Stale Badge */}
            {state === "stale" && (
              <Badge
                variant="outline"
                className={`font-mono text-muted-foreground py-0 ${
                  density === "compact" ? "text-[9px] px-1 h-3.5" : "text-[10px] px-1.5 h-4"
                }`}
              >
                Stale (&gt;48h)
              </Badge>
            )}
          </div>
        </div>

        {/* Health Score Mono Dial */}
        <div className="text-right shrink-0">
          <div
            className={`font-mono font-bold tracking-tight text-foreground ${
              density === "compact"
                ? "text-xl leading-none"
                : density === "expanded"
                  ? "text-3xl sm:text-4xl leading-none"
                  : "text-2xl leading-none"
            }`}
          >
            {pulse.health}
            <span
              className={`text-muted-foreground font-normal ${
                density === "compact" ? "text-[10px]" : "text-xs"
              }`}
            >
              /100
            </span>
          </div>
          <span
            className={`uppercase tracking-wider text-muted-foreground font-mono block mt-0.5 ${
              density === "compact" ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Health Score
          </span>
        </div>
      </div>

      {/* 24h & Momentum Metrics Row */}
      <div
        className={`grid grid-cols-3 border-y border-border/50 text-xs ${
          density === "compact"
            ? "mt-2 gap-1.5 py-1.5"
            : density === "expanded"
              ? "mt-4 gap-3 py-3 text-sm"
              : "mt-3 gap-2 py-2.5"
        }`}
      >
        <div>
          <span
            className={`font-mono uppercase text-muted-foreground block ${
              density === "compact" ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Velocity (24h)
          </span>
          <span
            className={`font-mono font-semibold text-foreground ${
              density === "compact" ? "text-xs" : density === "expanded" ? "text-lg font-bold" : "text-sm"
            }`}
          >
            {pulse.velocity_24h}{" "}
            <span className="text-[9px] font-normal text-muted-foreground">evts</span>
          </span>
        </div>

        <div>
          <span
            className={`font-mono uppercase text-muted-foreground block ${
              density === "compact" ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Momentum
          </span>
          <span
            className={`font-mono font-semibold flex items-center gap-0.5 ${
              density === "compact" ? "text-xs" : density === "expanded" ? "text-lg font-bold" : "text-sm"
            } ${
              pulse.momentum > 0
                ? "text-emerald-400"
                : pulse.momentum < 0
                  ? "text-amber-400"
                  : "text-muted-foreground"
            }`}
          >
            {pulse.momentum > 0 ? (
              <TrendingUp className={density === "compact" ? "size-2.5 inline" : "size-3.5 inline"} />
            ) : pulse.momentum < 0 ? (
              <TrendingDown className={density === "compact" ? "size-2.5 inline" : "size-3.5 inline"} />
            ) : null}
            {pulse.momentum > 0 ? `+${pulse.momentum}%` : `${pulse.momentum}%`}
          </span>
        </div>

        <div>
          <span
            className={`font-mono uppercase text-muted-foreground block ${
              density === "compact" ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Open Critical
          </span>
          <span
            className={`font-mono font-bold ${
              density === "compact" ? "text-xs" : density === "expanded" ? "text-lg" : "text-sm"
            } ${
              pulse.open_critical > 0 ? "text-red-400" : "text-muted-foreground"
            }`}
          >
            {pulse.open_critical}
          </span>
        </div>
      </div>

      {/* 24h Hourly Distribution Sparkline */}
      <div className={density === "compact" ? "mt-1.5" : "mt-2.5"}>
        <div
          className={`flex justify-between font-mono text-muted-foreground mb-1 ${
            density === "compact" ? "text-[9px]" : "text-[10px]"
          }`}
        >
          <span>24h Velocity Cadence</span>
          <span>Peak: {maxBar} evts/hr</span>
        </div>
        <div
          className={`flex items-end gap-0.5 w-full bg-muted/20 rounded ${
            density === "compact"
              ? "h-5 p-0.5"
              : density === "expanded"
                ? "h-12 p-1.5"
                : "h-7 p-1"
          }`}
        >
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
      <div
        className={`flex items-center justify-between font-mono text-muted-foreground ${
          density === "compact" ? "mt-2 text-[9px]" : "mt-3 text-[10px]"
        }`}
      >
        <span className="flex items-center gap-1">
          <Clock className={density === "compact" ? "size-2" : "size-2.5"} />
          Last: {pulse.last_event_at ? new Date(pulse.last_event_at).toLocaleTimeString() : "None"}
        </span>

        {pulse.active_scans > 0 && (
          <span className="text-primary flex items-center gap-1 font-semibold">
            <Loader2 className={density === "compact" ? "size-2.5 animate-spin" : "size-3 animate-spin"} />{" "}
            {pulse.active_scans} active scan
          </span>
        )}
      </div>
    </div>
  );
}
