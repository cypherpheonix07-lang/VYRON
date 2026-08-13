import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RiskLevel, Severity } from "@/lib/mock-data";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  delta?: number;
  tone?: "default" | "success" | "warning" | "critical" | "info";
}) {
  const toneRing: Record<string, string> = {
    default: "text-primary",
    success: "text-[var(--success)]",
    warning: "text-[var(--warning)]",
    critical: "text-[var(--critical)]",
    info: "text-[var(--info)]",
  };
  return (
    <Card className="surface gap-0 py-5">
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {Icon ? <Icon className={cn("size-4 shrink-0", toneRing[tone])} aria-hidden /> : null}
        </div>
        <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {typeof delta === "number" ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                delta >= 0 ? "text-[var(--success)]" : "text-[var(--critical)]",
              )}
            >
              {delta >= 0 ? (
                <TrendingUp className="size-3" aria-hidden />
              ) : (
                <TrendingDown className="size-3" aria-hidden />
              )}
              {delta >= 0 ? "+" : ""}
              {delta}%
            </span>
          ) : null}
          {hint ? <span className="truncate">{hint}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ScoreGauge({
  value,
  label,
  size = 132,
  sublabel,
}: {
  value: number;
  label?: string;
  size?: number;
  sublabel?: string;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const color = pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--critical)";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          role="img"
          aria-label={`${label ?? "Score"}: ${pct} out of 100`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * pct) / 100}
            className="transition-[stroke-dashoffset] duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums">{pct}</span>
          {sublabel ? (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {sublabel}
            </span>
          ) : null}
        </div>
      </div>
      {label ? <p className="text-sm font-medium text-muted-foreground">{label}</p> : null}
    </div>
  );
}

const riskClass: Record<RiskLevel, string> = {
  Low: "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]",
  Medium: "border-[var(--warning)]/40 bg-[var(--warning)]/12 text-[var(--warning)]",
  High: "border-[oklch(0.7_0.19_45)]/40 bg-[oklch(0.7_0.19_45)]/12 text-[oklch(0.78_0.17_55)]",
  Critical: "border-[var(--critical)]/40 bg-[var(--critical)]/12 text-[var(--critical)]",
};

export function RiskBadge({ level, label }: { level: RiskLevel | Severity; label?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium", riskClass[level as RiskLevel])}
    >
      {label ?? level}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Analyzed: "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]",
    Completed: "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]",
    Operational: "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]",
    Active: "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]",
    Analyzing: "border-primary/40 bg-primary/12 text-primary",
    Generating: "border-primary/40 bg-primary/12 text-primary",
    Draft: "border-border bg-muted text-muted-foreground",
    Invited: "border-border bg-muted text-muted-foreground",
    "Needs Review": "border-[var(--warning)]/40 bg-[var(--warning)]/12 text-[var(--warning)]",
    Degraded: "border-[var(--warning)]/40 bg-[var(--warning)]/12 text-[var(--warning)]",
    "At Risk": "border-[var(--critical)]/40 bg-[var(--critical)]/12 text-[var(--critical)]",
    Failed: "border-[var(--critical)]/40 bg-[var(--critical)]/12 text-[var(--critical)]",
    Suspended: "border-[var(--critical)]/40 bg-[var(--critical)]/12 text-[var(--critical)]",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", map[status] ?? "")}>
      {status}
    </Badge>
  );
}

export function ScoreBar({ value, label }: { value: number; label?: string }) {
  const color = value >= 80 ? "var(--success)" : value >= 60 ? "var(--warning)" : "var(--critical)";
  return (
    <div className="min-w-24">
      <div className="flex items-center justify-between text-xs">
        {label ? <span className="text-muted-foreground">{label}</span> : null}
        <span className="tabular-nums font-medium">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-3 rounded-xl px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Retry or check back shortly.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--critical)]/30 bg-[var(--critical)]/8 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-[var(--critical)]/15 text-[var(--critical)]">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden /> Retry
        </Button>
      ) : null}
    </div>
  );
}

export function LoadingSkeleton({ variant = "cards" }: { variant?: "cards" | "table" | "chart" }) {
  if (variant === "table") {
    return (
      <Card className="surface">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }
  if (variant === "chart") {
    return (
      <Card className="surface">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full" />
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="surface">
          <CardContent className="space-y-3 pt-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("surface", className)}>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function QuickLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to={to}>{children}</Link>
    </Button>
  );
}
