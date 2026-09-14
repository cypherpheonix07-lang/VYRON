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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Simulation Lab
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              11 Concrete Scenarios Available
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Engineering Simulation Laboratory
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Simulate realistic failure conditions—including architecture drift, SQL injection regressions,
            broken API contracts, and connector outages—through the genuine orchestration pipeline.
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
              <span className="font-mono font-bold text-foreground">{activeScenario.targetSystem}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Simulated Health:</span>
              <span className="font-bold text-rose-400">{activeScenario.simulatedHealthScore}/100</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Expected Findings:</span>
              <span className="font-bold text-foreground">{activeScenario.expectedFindingsCount} findings</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Copilot Aware:</span>
              <span className="font-bold text-emerald-400">Yes (Active Context)</span>
            </div>
          </div>
        </div>
      )}

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
                  <span className="text-[10px] text-muted-foreground font-mono">{scen.category}</span>
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
