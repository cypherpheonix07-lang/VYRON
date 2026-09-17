/**
 * VYRON — TIME MACHINE COMPARATOR (PHASE 18)
 * Temporal regression and historical architecture comparator.
 * Answers: "What changed?", "When?", "What caused the regression?", "When did drift begin?".
 * Powered by timeMachineEngine.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { timeMachineEngine } from "@/services/intelligence/timeMachineEngine";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Clock,
  GitBranch,
  GitCompare,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export function TimeMachineComparator() {
  const { setTimeTravelSnapshot } = useCommandCenter();
  const snapshots = useMemo(() => timeMachineEngine.listSnapshots(), []);

  const [baseId, setBaseId] = useState<string>(snapshots[1]?.id || "snap_v239_last");
  const [targetId, setTargetId] = useState<string>(snapshots[0]?.id || "snap_v240_curr");

  const comparison = useMemo(() => {
    try {
      return timeMachineEngine.compareSnapshots(baseId, targetId);
    } catch {
      return null;
    }
  }, [baseId, targetId]);

  return (
    <div className="p-3.5 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-3">
      {/* HEADER WITH SNAPSHOT SELECTORS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/30 pb-2.5">
        <div className="flex items-center gap-2">
          <GitCompare className="size-4 text-primary" />
          <div>
            <div className="text-xs font-semibold text-foreground">Time Machine Architecture Comparator</div>
            <div className="text-[10px] text-muted-foreground">
              Compare architecture, health, and drift evolution across historical releases
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground text-[11px]">Compare:</span>
          <select
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            className="bg-zinc-900 border border-border/50 text-foreground rounded px-2 py-0.5 text-xs font-mono"
          >
            {snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.versionTag}
              </option>
            ))}
          </select>

          <span className="text-muted-foreground">vs</span>

          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="bg-zinc-900 border border-border/50 text-foreground rounded px-2 py-0.5 text-xs font-mono"
          >
            {snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.versionTag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DELTAS & EXPLANATION */}
      {comparison && (
        <div className="space-y-2.5 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded border border-border/30 bg-zinc-900/30">
              <span className="text-[10px] text-muted-foreground">Health Delta</span>
              <div
                className={cn(
                  "text-sm font-mono font-bold mt-0.5 flex items-center gap-1",
                  comparison.healthDelta >= 0 ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {comparison.healthDelta >= 0 ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {comparison.healthDelta > 0 ? `+${comparison.healthDelta}` : comparison.healthDelta} pts
              </div>
            </div>

            <div className="p-2 rounded border border-border/30 bg-zinc-900/30">
              <span className="text-[10px] text-muted-foreground">Drift Delta</span>
              <div
                className={cn(
                  "text-sm font-mono font-bold mt-0.5",
                  comparison.driftDelta <= 0 ? "text-emerald-400" : "text-amber-400",
                )}
              >
                {comparison.driftDelta > 0 ? `+${comparison.driftDelta}` : comparison.driftDelta} findings
              </div>
            </div>

            <div className="p-2 rounded border border-border/30 bg-zinc-900/30">
              <span className="text-[10px] text-muted-foreground">Findings Delta</span>
              <div
                className={cn(
                  "text-sm font-mono font-bold mt-0.5",
                  comparison.findingsDelta <= 0 ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {comparison.findingsDelta > 0 ? `+${comparison.findingsDelta}` : comparison.findingsDelta} vulns
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/40 border border-border/20 text-[11px] text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground">Timeline Regression Analysis:</div>
            <p className="leading-relaxed">{comparison.timelineExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
