/**
 * PROJECT BRAHMA — PROACTIVE COPILOT INSIGHTS BANNER
 * Renders non-intrusive, high-value proactive intelligence recommendations.
 * Allows one-click action execution or dismissal.
 */

import React, { useState, useEffect } from "react";
import { AlertTriangle, Sparkles, CheckCircle2, X, ArrowRight, Activity, Database, Cable } from "lucide-react";
import {
  copilotProactiveEngine,
  ProactiveRecommendation,
} from "@/services/copilot/copilotProactiveEngine";
import { copilotActionEngine, ActionType } from "@/services/copilot/copilotActionEngine";
import { useCopilot } from "@/state/copilot/useCopilot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ProactiveInsightsBannerProps {
  className?: string;
  maxItems?: number;
  compact?: boolean;
}

export function ProactiveInsightsBanner({
  className = "",
  maxItems = 2,
  compact = false,
}: ProactiveInsightsBannerProps) {
  const [recommendations, setRecommendations] = useState<ProactiveRecommendation[]>([]);
  const { setDrawerOpen, mode } = useCopilot();

  useEffect(() => {
    return copilotProactiveEngine.subscribe((recs) => {
      setRecommendations(recs);
    });
  }, []);

  if (recommendations.length === 0) return null;

  const displayed = recommendations.slice(0, maxItems);

  const handleExecute = async (rec: ProactiveRecommendation) => {
    try {
      await copilotActionEngine.dispatchAction(
        rec.actionType as ActionType,
        rec.actionLabel,
        rec.description,
        rec.actionPayload || {},
        mode,
        false,
      );
      copilotProactiveEngine.dismissRecommendation(rec.id);
      toast.success(`Executed proactive action: ${rec.actionLabel}`);
    } catch (err: unknown) {
      toast.error(`Action execution failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    copilotProactiveEngine.dismissRecommendation(id);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {displayed.map((rec) => (
        <div
          key={rec.id}
          className={cn(
            "p-3 rounded-xl border flex items-center justify-between gap-3 transition-all",
            rec.severity === "URGENT"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
              : rec.severity === "RECOMMENDED"
                ? "bg-primary/10 border-primary/30 text-foreground"
                : "bg-secondary/40 border-border/40 text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {rec.category === "RISK" ? (
              <AlertTriangle className="size-4 shrink-0 text-rose-400" />
            ) : rec.category === "CONNECTOR" ? (
              <Cable className="size-4 shrink-0 text-amber-400" />
            ) : rec.category === "ANALYSIS" ? (
              <Activity className="size-4 shrink-0 text-primary" />
            ) : (
              <Sparkles className="size-4 shrink-0 text-primary" />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold truncate text-foreground">{rec.title}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-mono h-4 px-1",
                    rec.severity === "URGENT"
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                      : "bg-primary/20 text-primary border-primary/40",
                  )}
                >
                  {rec.severity}
                </Badge>
              </div>
              {!compact && (
                <p className="text-[11px] text-muted-foreground truncate mt-0.5 max-w-xl">
                  {rec.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              onClick={() => handleExecute(rec)}
              className="h-6 text-[11px] font-bold px-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg gap-1"
            >
              <span>{rec.actionLabel}</span>
              <ArrowRight className="size-3" />
            </Button>
            <button
              onClick={(e) => handleDismiss(rec.id, e)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Dismiss recommendation"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
