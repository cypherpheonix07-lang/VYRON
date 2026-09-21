import React from "react";
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolHealthStatus } from "@/types/discovery";
import { computeToolHealthScore } from "@/services/toolHealth";
import { cn } from "@/lib/utils";

interface HealthBadgeProps {
  status: ToolHealthStatus;
  latencyMs?: number | undefined;
  httpStatus?: number | undefined;
  showDetails?: boolean | undefined;
  className?: string | undefined;
}

export function HealthBadge({
  status,
  latencyMs = 190,
  httpStatus = 200,
  showDetails = false,
  className,
}: HealthBadgeProps) {
  const breakdown = computeToolHealthScore({
    health_status: status,
    latency_ms: latencyMs,
    http_status: httpStatus,
  });

  const getStatusIcon = () => {
    switch (breakdown.status) {
      case "healthy":
      case "active":
        return <CheckCircle2 className="size-3 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="size-3 text-amber-400" />;
      case "degraded":
        return <Activity className="size-3 text-yellow-400" />;
      case "critical":
      case "offline":
        return <XCircle className="size-3 text-rose-400" />;
      default:
        return <Clock className="size-3 text-muted-foreground" />;
    }
  };

  const getBadgeStyle = () => {
    switch (breakdown.status) {
      case "healthy":
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15";
      case "degraded":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/15";
      case "critical":
      case "offline":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/15";
      default:
        return "bg-muted/30 text-muted-foreground border-border";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-help transition-colors",
              getBadgeStyle(),
              className,
            )}
          >
            <span className="relative flex size-2 items-center justify-center">
              <span
                className={cn(
                  "absolute inline-flex size-full rounded-full opacity-75 animate-ping",
                  breakdown.status === "healthy" || breakdown.status === "active"
                    ? "bg-emerald-400"
                    : breakdown.status === "offline"
                      ? "bg-rose-400"
                      : "bg-amber-400",
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-1.5 rounded-full",
                  breakdown.status === "healthy" || breakdown.status === "active"
                    ? "bg-emerald-400"
                    : breakdown.status === "offline"
                      ? "bg-rose-400"
                      : "bg-amber-400",
                )}
              />
            </span>
            <span>{breakdown.statusLabel}</span>
            {showDetails && (
              <span className="text-[10px] opacity-75 border-l pl-1.5 ml-0.5 border-current/20">
                {latencyMs}ms
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-3 text-xs bg-popover/95 backdrop-blur-md border-border"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold border-b border-border/50 pb-1">
              <span className="flex items-center gap-1">
                {getStatusIcon()} Live Probe Telemetry
              </span>
              <span className="font-mono text-emerald-400">{breakdown.score}/100</span>
            </div>
            <p className="text-muted-foreground">{breakdown.explanation}</p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-muted-foreground font-mono">
              <div>
                Availability: <span className="text-foreground">{breakdown.availabilityRate}%</span>
              </div>
              <div>
                Latency: <span className="text-foreground">{latencyMs}ms</span>
              </div>
              <div>
                HTTP Status: <span className="text-foreground">{httpStatus}</span>
              </div>
              <div>
                Telemetry: <span className="text-emerald-400">Live Heartbeat</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
