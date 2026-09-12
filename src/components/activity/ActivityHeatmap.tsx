import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ActivityEvent, ActivityEventType } from "@/types/activity";

interface ActivityHeatmapProps {
  events: ActivityEvent[];
  onCellClick: (eventType: ActivityEventType, hour: number) => void;
}

const EVENT_TYPES: ActivityEventType[] = [
  "gate_evaluation",
  "scan_completion",
  "publish_attempt",
  "publish_override",
  "report_export",
  "member_invite",
  "role_change",
  "integration_connect",
  "auth_anomaly",
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ActivityHeatmap({ events, onCellClick }: ActivityHeatmapProps) {
  // Compute frequency matrix: [eventType][hour] => count
  const matrix = useMemo(() => {
    const data: Record<string, Record<number, number>> = {};
    EVENT_TYPES.forEach((t) => {
      const row: Record<number, number> = {};
      HOURS.forEach((h) => {
        row[h] = 0;
      });
      data[t] = row;
    });

    events.forEach((e) => {
      const h = new Date(e.created_at).getHours();
      const typeData = data[e.event_type];
      if (typeData && typeof typeData[h] === "number") {
        typeData[h] = (typeData[h] ?? 0) + 1;
      }
    });

    return data;
  }, [events]);

  // Find max count for scaling intensity
  const maxCount = useMemo(() => {
    let max = 1;
    EVENT_TYPES.forEach((t) => {
      const row = matrix[t];
      if (!row) return;
      HOURS.forEach((h) => {
        const val = row[h] ?? 0;
        if (val > max) max = val;
      });
    });
    return max;
  }, [matrix]);

  // Color intensity calculation using OKLCH tint
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-muted/15 border-transparent hover:bg-muted/30";
    const ratio = count / maxCount;
    if (ratio < 0.25) return "bg-primary/20 border-primary/30 text-foreground";
    if (ratio < 0.5) return "bg-primary/40 border-primary/50 text-foreground";
    if (ratio < 0.75) return "bg-primary/65 border-primary/70 text-primary-foreground";
    return "bg-primary border-primary text-primary-foreground font-bold";
  };

  return (
    <div className="rounded-lg border border-border/70 bg-card p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Activity Density Matrix</h4>
          <p className="text-xs text-muted-foreground">
            Distribution of events by type across the 24-hour cycle. Click any cell to filter the stream.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
          <span>Less</span>
          <div className="size-3 rounded bg-muted/20 border border-border/40" />
          <div className="size-3 rounded bg-primary/25" />
          <div className="size-3 rounded bg-primary/50" />
          <div className="size-3 rounded bg-primary" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          {/* Hour Headers */}
          <div className="grid grid-cols-[160px_repeat(24,1fr)] gap-1 text-[10px] font-mono text-muted-foreground mb-1 text-center">
            <span className="text-left pl-2">Event Category</span>
            {HOURS.map((h) => (
              <span key={h} className="truncate">
                {h.toString().padStart(2, "0")}
              </span>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1">
            {EVENT_TYPES.map((type) => (
              <div
                key={type}
                className="grid grid-cols-[160px_repeat(24,1fr)] gap-1 items-center"
              >
                <span className="text-xs text-foreground/90 font-medium truncate pl-2 capitalize">
                  {type.replace(/_/g, " ")}
                </span>

                {HOURS.map((h) => {
                  const count = matrix[type]?.[h] ?? 0;
                  return (
                    <Tooltip key={h}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onCellClick(type, h)}
                          className={`size-6 rounded border flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-110 cursor-pointer ${getCellColor(
                            count,
                          )}`}
                        >
                          {count > 0 ? count : ""}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-mono">
                        <div className="font-semibold capitalize">{type.replace(/_/g, " ")}</div>
                        <div>
                          Hour {h.toString().padStart(2, "0")}:00 — <span className="text-primary font-bold">{count}</span> events
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
