import {
  Activity,
  Layers,
  ShieldAlert,
  AlertTriangle,
  Zap,
  TrendingUp,
} from "lucide-react";
import type { WorkspacePulse } from "@/types/activity";

interface WorkspacePulseHeaderProps {
  pulse: WorkspacePulse | null;
  isLoading: boolean;
}

export function WorkspacePulseHeader({ pulse, isLoading }: WorkspacePulseHeaderProps) {
  if (isLoading || !pulse) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-border/60 bg-card/60 p-3.5 space-y-2">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const METRICS = [
    {
      label: "Events Today",
      value: pulse.events_today,
      unit: "evts",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "Active Projects",
      value: pulse.active_projects,
      unit: "repos",
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Blocked Gates",
      value: pulse.blocked_gates,
      unit: "gates",
      icon: AlertTriangle,
      color: pulse.blocked_gates > 0 ? "text-amber-400" : "text-muted-foreground",
      bg: pulse.blocked_gates > 0 ? "bg-amber-500/10 border-amber-500/30" : "bg-muted/20 border-border/50",
    },
    {
      label: "Open Criticals",
      value: pulse.open_critical,
      unit: "vulns",
      icon: ShieldAlert,
      color: pulse.open_critical > 0 ? "text-red-400" : "text-emerald-400",
      bg: pulse.open_critical > 0 ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Velocity Rate",
      value: pulse.token_rate,
      unit: "evts/hr",
      icon: Zap,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {METRICS.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="group relative overflow-hidden rounded-lg border border-border/70 bg-card/60 backdrop-blur-sm p-3.5 transition-all duration-200 hover:bg-card hover:shadow-md hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
              <div className={`grid size-6 place-items-center rounded ${m.bg}`}>
                <Icon className={`size-3.5 ${m.color}`} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {m.value}
              </span>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                {m.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
