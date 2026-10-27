import React, { useState, useEffect } from "react";
import { AlertCircle, ShieldAlert, Activity, CheckCircle, Radio } from "lucide-react";
import { demoStore, SimulatedDomainEvent } from "@/state/demo/demoStore";
import { cn } from "@/lib/utils";

export function AnomalyTimeline({ className }: { className?: string }) {
  const [events, setEvents] = useState<SimulatedDomainEvent[]>(
    () => demoStore.getState().simulatedEvents,
  );

  useEffect(() => {
    return demoStore.subscribe((state) => {
      setEvents([...state.simulatedEvents]);
    });
  }, []);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 space-y-3",
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Live Simulated Event Stream</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-secondary text-muted-foreground">
            {events.length} buffered
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Rolling buffer</span>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Event stream idle. Click "Start Stream" or "Inject Anomaly Surge" in simulator controls.
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className={cn(
                "p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all",
                evt.isAnomaly
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-200 shadow-sm shadow-rose-500/5"
                  : "bg-background/40 border-border/30 text-foreground hover:bg-background/70",
              )}
            >
              <div className="flex items-center gap-2.5">
                {evt.isAnomaly ? (
                  <ShieldAlert className="size-4 text-rose-400 shrink-0 animate-pulse" />
                ) : (
                  <Activity className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-xs text-foreground">
                      {evt.type}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {evt.entityId}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {evt.payload && typeof evt.payload["amount"] === "number" && (
                  <span className="font-mono text-xs text-muted-foreground">
                    ${Number(evt.payload["amount"]).toFixed(2)}
                  </span>
                )}
                <div
                  className={cn(
                    "px-2 py-0.5 rounded font-mono text-[11px] font-bold",
                    evt.isAnomaly
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  Risk: {evt.riskScore}/100
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
