/**
 * PROJECT BRAHMA — SIMULATION LAB VIEW
 * Interactive laboratory for running 11 concrete engineering failure scenarios.
 * Connects directly to the real orchestration pipeline with synthetic adapters.
 */

import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Play,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  simulationLabEngine,
  SimulationScenario,
  SimulationScenarioId,
} from "@/services/demo/simulationLab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SimulationLabView() {
  const [scenarios] = useState<SimulationScenario[]>(() => simulationLabEngine.getScenarios());
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(() =>
    simulationLabEngine.getActiveScenario(),
  );

  useEffect(() => {
    return simulationLabEngine.subscribe((scen) => {
      setActiveScenario(scen);
    });
  }, []);

  const handleActivate = (id: SimulationScenarioId) => {
    const scen = simulationLabEngine.activateScenario(id);
    toast.success(`Activated Simulation Scenario: ${scen.name}`);
  };

  const handleReset = () => {
    simulationLabEngine.resetToPristineBaseline();
    toast.info("Reset Simulation Lab to pristine baseline state.");
  };

  const getSeverityBadge = (sev: SimulationScenario["severity"]) => {
    switch (sev) {
      case "CRITICAL":
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">CRITICAL</Badge>;
      case "HIGH":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">HIGH</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">MEDIUM</Badge>;
    }
  };

  const [customLatency, setCustomLatency] = useState(250);
  const [faultRate, setFaultRate] = useState(15);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Simulation Twin Lab
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Fidelity: L2 Synthetic Twin
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Engineering Simulation Twin Laboratory
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Execute controlled failure conditions, synthetic regressions, and blast radius simulations.
            All scenarios execute in an isolated sandbox with zero production mutation.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs border-border/80 gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Baseline</span>
          </Button>
        </div>
      </div>

      {/* Explicit Assumptions & Fidelity Limits Disclosure (N2.08) */}
      <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <FlaskConical className="size-4 text-cyan-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-cyan-300">
              Simulation Boundary &amp; Fidelity Disclosure:
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              This environment runs on an isolated synthetic state mirror. Metrics, latency spikes, and failure scenarios represent simulated models, not observed production telemetry. External cloud resources and production databases remain strictly untouched.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 shrink-0 font-mono text-[10px]">
          ISOLATION: 100%
        </Badge>
      </div>

      {/* Comparative Model: Baseline vs. Active Simulated Twin */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Baseline Health</span>
          <div className="text-2xl font-black font-mono text-emerald-400">98 / 100</div>
          <span className="text-[10px] text-muted-foreground">Pristine Production SLA</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Simulated Health</span>
          <div className="text-2xl font-black font-mono text-rose-400">
            {activeScenario ? `${activeScenario.simulatedHealthScore} / 100` : "98 / 100"}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {activeScenario ? `Degraded by ${98 - activeScenario.simulatedHealthScore}%` : "No Active Fault"}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Fault Injections</span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {activeScenario ? activeScenario.expectedFindingsCount : 0}
          </div>
          <span className="text-[10px] text-muted-foreground">Synthetic CVEs &amp; Drifts</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md space-y-1">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Blast Radius</span>
          <div className="text-2xl font-black font-mono text-foreground">
            {activeScenario ? "3 Services" : "0 Services"}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {activeScenario ? activeScenario.targetSystem.substring(0, 16) : "Quiescent"}
          </span>
        </div>
      </div>

      {/* Active Scenario Banner */}
      {activeScenario && (
        <div className="p-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 backdrop-blur-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-rose-500" />
              </span>
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Active Simulation: {activeScenario.name}
              </span>
            </div>
            {getSeverityBadge(activeScenario.severity)}
          </div>

          <p className="text-sm text-foreground">{activeScenario.storyline}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-rose-500/20">
            <div>
              <span className="text-muted-foreground block">Target System:</span>
              <span className="font-mono font-bold text-foreground">
                {activeScenario.targetSystem}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Simulated Health:</span>
              <span className="font-bold text-rose-400">
                {activeScenario.simulatedHealthScore}/100
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Expected Findings:</span>
              <span className="font-bold text-foreground">
                {activeScenario.expectedFindingsCount} findings
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Copilot Aware:</span>
              <span className="font-bold text-emerald-400">Yes (Active Context)</span>
            </div>
          </div>
        </div>
      )}

      {/* Parameter Injection Lab Controls */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-primary" />
            <h3 className="font-bold text-foreground">Synthetic Twin Parameter Adjuster</h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">Interactive Stress Test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Synthetic Latency Injection:</span>
              <span className="font-mono font-bold text-foreground">{customLatency}ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              step="50"
              value={customLatency}
              onChange={(e) => setCustomLatency(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Synthetic Error Injection Rate:</span>
              <span className="font-mono font-bold text-foreground">{faultRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={faultRate}
              onChange={(e) => setFaultRate(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 11 Scenarios Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
          Failure & Regression Scenarios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              className={cn(
                "p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3",
                activeScenario?.id === scen.id
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border/60 bg-card/60 hover:border-border",
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getSeverityBadge(scen.severity)}
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {scen.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground line-clamp-1">{scen.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{scen.storyline}</p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Target: {scen.targetSystem.substring(0, 18)}
                </span>
                <Button
                  size="sm"
                  variant={activeScenario?.id === scen.id ? "secondary" : "default"}
                  onClick={() => handleActivate(scen.id)}
                  className="h-7 text-xs font-bold gap-1"
                >
                  <Play className="size-3" />
                  <span>{activeScenario?.id === scen.id ? "Re-Inject" : "Simulate"}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
