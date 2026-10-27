import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  ChevronDown,
  ChevronRight,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { AnalysisStageState, StageId } from "@/state/analysis/analysisStore";
import { cn } from "@/lib/utils";

interface AnalysisTimelineProps {
  stages: AnalysisStageState[];
  currentStageId: StageId | null;
  className?: string;
}

export function AnalysisTimeline({ stages, currentStageId, className }: AnalysisTimelineProps) {
  const [expandedStage, setExpandedStage] = useState<StageId | null>(null);

  const toggleExpand = (id: StageId) => {
    setExpandedStage((prev) => (prev === id ? null : id));
  };

  const getStatusIcon = (status: AnalysisStageState["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="size-4 text-emerald-400" />;
      case "RUNNING":
        return <Activity className="size-4 text-blue-400 animate-spin" />;
      case "FAILED":
        return <AlertTriangle className="size-4 text-rose-400" />;
      case "SKIPPED":
        return <Clock className="size-4 text-zinc-500" />;
      default:
        return <Clock className="size-4 text-zinc-600" />;
    }
  };

  const getStatusBadge = (status: AnalysisStageState["status"]) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            DONE
          </span>
        );
      case "RUNNING":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            RUNNING
          </span>
        );
      case "FAILED":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            FAILED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 text-zinc-500">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className={cn("space-y-2 font-sans", className)}>
      <div className="flex items-center justify-between px-1 pb-2 border-b border-border/40 text-xs text-muted-foreground">
        <span>12-STAGE ORCHESTRATION PIPELINE</span>
        <span>STATUS & METRICS</span>
      </div>

      <div className="divide-y divide-border/20 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        {stages.map((stage) => {
          const isCurrent = stage.id === currentStageId;
          const isExpanded = expandedStage === stage.id;

          return (
            <div
              key={stage.id}
              className={cn(
                "transition-colors",
                isCurrent && "bg-blue-500/5",
                stage.status === "COMPLETED" && "hover:bg-accent/30",
              )}
            >
              <div
                onClick={() => toggleExpand(stage.id)}
                className="flex items-center justify-between p-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-6 rounded-full bg-background border border-border/80">
                    {getStatusIcon(stage.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {String(stage.id).padStart(2, "0")}.
                      </span>
                      <span className="text-sm font-medium text-foreground">{stage.name}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                        {stage.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                      {stage.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {stage.durationMs > 0 && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {stage.durationMs}ms
                    </span>
                  )}
                  {getStatusBadge(stage.status)}
                  {isExpanded ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3 pt-1 bg-secondary/30 text-xs border-t border-border/20 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(stage.metrics).map(([k, v]) => (
                      <div key={k} className="p-2 rounded bg-background/60 border border-border/30">
                        <span className="text-muted-foreground text-[11px] block truncate">
                          {k}
                        </span>
                        <span className="font-mono font-medium text-foreground text-xs mt-0.5 block truncate">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                    {Object.keys(stage.metrics).length === 0 && (
                      <div className="text-muted-foreground col-span-3 py-1">
                        No additional metrics recorded for this stage yet.
                      </div>
                    )}
                  </div>
                  {stage.error && (
                    <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs">
                      Error: {stage.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
