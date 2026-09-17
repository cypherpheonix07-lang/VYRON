import React, { useState, useEffect } from "react";
import { Play, Pause, Square, Zap, Sliders, Activity, ShieldAlert, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoStore, BenchmarkDataset } from "@/state/demo/demoStore";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SimulatorControls({ className }: { className?: string }) {
  const [demoState, setDemoState] = useState(() => demoStore.getState());

  useEffect(() => {
    return demoStore.subscribe((state) => {
      setDemoState({ ...state });
    });
  }, []);

  const handleToggle = () => {
    if (demoState.isSimulatorRunning) {
      eventSimulator.stop();
    } else {
      eventSimulator.start(demoState.eventsPerSecond);
    }
  };

  const handleStop = () => {
    eventSimulator.stop();
  };

  const handleResetBaseline = () => {
    eventSimulator.stop();
    demoStore.resetToBaseline();
    toast.success("Demo environment restored to pristine baseline state.");
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    eventSimulator.setSpeed(val);
  };

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    demoStore.selectDataset(e.target.value);
  };

  const handleInjectAnomaly = () => {
    eventSimulator.injectAnomalyWave(6);
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-card/90 via-amber-500/5 to-card/90 backdrop-blur-xl shadow-lg space-y-4",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Activity className={cn("size-5", demoState.isSimulatorRunning && "animate-spin")} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Real-Time Domain Event Simulator</span>
              {demoState.isSimulatorRunning ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  STREAMING ({demoState.eventsPerSecond} EPS)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-800 text-zinc-400">
                  PAUSED
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              Injects domain events into the 12-stage analysis pipeline and Copilot context
            </p>
          </div>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Benchmark:</span>
          <select
            value={demoState.selectedDatasetId}
            onChange={handleDatasetChange}
            className="text-xs rounded-lg bg-secondary/70 border border-border/80 text-foreground px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {demoState.availableDatasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Buttons and Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleToggle}
            className={cn(
              "font-bold text-xs gap-1.5 px-4 h-9 shadow-sm",
              demoState.isSimulatorRunning
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white",
            )}
          >
            {demoState.isSimulatorRunning ? (
              <>
                <Pause className="size-3.5 fill-current" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>Start Stream</span>
              </>
            )}
          </Button>

          {demoState.isSimulatorRunning && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              className="text-xs h-9 border-border/80 text-muted-foreground hover:text-foreground"
            >
              <Square className="size-3.5 mr-1" /> Stop
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleInjectAnomaly}
            className="text-xs h-9 font-semibold border-rose-500/40 text-rose-300 hover:bg-rose-500/15 flex items-center gap-1.5 shadow-sm"
          >
            <ShieldAlert className="size-3.5 text-rose-400 animate-bounce" />
            <span>Inject Anomaly Surge</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetBaseline}
            className="text-xs h-9 text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center gap-1.5"
            title="Reset Demo environment to pristine baseline"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Demo</span>
          </Button>
        </div>

        {/* Throughput Slider */}
        <div className="md:col-span-4 flex items-center gap-3 bg-secondary/30 p-2 rounded-xl border border-border/30">
          <Sliders className="size-4 text-muted-foreground" />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Throughput</span>
              <span className="font-mono font-bold text-foreground">
                {demoState.eventsPerSecond} eps
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={demoState.eventsPerSecond}
              onChange={handleSpeedChange}
              className="w-full h-1.5 rounded-lg bg-secondary cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Telemetry Counter */}
        <div className="md:col-span-3 flex justify-end gap-3 font-mono text-xs">
          <div className="text-right">
            <span className="text-muted-foreground block text-[10px]">TOTAL EVENTS</span>
            <span className="font-bold text-foreground">
              {demoState.totalSimulatedEvents.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-rose-400 block text-[10px]">ANOMALIES</span>
            <span className="font-bold text-rose-400">{demoState.anomaliesTriggered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
