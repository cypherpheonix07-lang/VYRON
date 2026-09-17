/**
 * VYRON — RUNTIME INTELLIGENCE COCKPIT (PHASE 11)
 * Real-time telemetry, queue latencies, and service execution profiles.
 * Explicitly distinguishes observation tiers: OBSERVED, DERIVED, PREDICTED, SIMULATED.
 * Supports tracing: RUNTIME EVENT → RELEASE → COMPONENT → ARCHITECTURE → DECISION → DEPENDENCY.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  Cpu,
  Fingerprint,
  Radio,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

export type ObservationTier = "OBSERVED" | "DERIVED" | "PREDICTED" | "SIMULATED";

export interface TelemetryMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  tier: ObservationTier;
  slaTarget: string;
  status: "NOMINAL" | "ATTENTION" | "DEGRADED";
  traceChain: {
    event: string;
    release: string;
    component: string;
    decision: string;
    dependency: string;
  };
}

const TELEMETRY_METRICS: TelemetryMetric[] = [
  {
    id: "TEL-GW-LAT",
    name: "API Gateway p95 Latency",
    value: "142",
    unit: "ms",
    tier: "OBSERVED",
    slaTarget: "< 200ms",
    status: "NOMINAL",
    traceChain: {
      event: "HTTP POST /v1/payments (200 OK)",
      release: "v2.4.0-rc1",
      component: "srv-gateway",
      decision: "ADR-001 Redis Cache",
      dependency: "GoTrue Auth",
    },
  },
  {
    id: "TEL-AI-INF",
    name: "AI Copilot Inference Latency",
    value: "1.84",
    unit: "s",
    tier: "OBSERVED",
    slaTarget: "< 2.5s",
    status: "NOMINAL",
    traceChain: {
      event: "AI Model Route: Claude 3.7 Sonnet",
      release: "v2.4.0",
      component: "aiRouter.ts",
      decision: "Multi-Model Task Adapter",
      dependency: "Kaggle Dataset Hub",
    },
  },
  {
    id: "TEL-Q-DISP",
    name: "Queue Dispatcher Backlog",
    value: "310",
    unit: "ms",
    tier: "DERIVED",
    slaTarget: "< 500ms",
    status: "NOMINAL",
    traceChain: {
      event: "Batch Settlement Worker Ingestion",
      release: "v2.4.0",
      component: "srv-settlement",
      decision: "Redis Token Bucket",
      dependency: "PostgreSQL 15 Pool",
    },
  },
  {
    id: "TEL-SIM-ANOM",
    name: "Twin Simulation Wave Throughput",
    value: "60",
    unit: "eps",
    tier: "SIMULATED",
    slaTarget: "60 eps target",
    status: "NOMINAL",
    traceChain: {
      event: "Synthetic Fraud Wave Injection",
      release: "v2.4.0 Twin",
      component: "eventSimulator.ts",
      decision: "Air-Gapped Simulation",
      dependency: "IEEE-CIS Benchmark",
    },
  },
  {
    id: "TEL-PRED-BURST",
    name: "Predicted End-of-Day Traffic Load",
    value: "1,450",
    unit: "req/s",
    tier: "PREDICTED",
    slaTarget: "< 2,000 TPS",
    status: "NOMINAL",
    traceChain: {
      event: "EOD Settlement Merchant Batch",
      release: "v2.4.0 Target",
      component: "srv-gateway",
      decision: "Horizontal Pod Autoscaling",
      dependency: "Bank Acquirer Gate",
    },
  },
];

export function RuntimeIntelligenceCockpit() {
  const { selectEntity } = useCommandCenter();
  const [selectedMetric, setSelectedMetric] = useState<TelemetryMetric>(TELEMETRY_METRICS[0]!);

  const handleInspectMetric = (metric: TelemetryMetric) => {
    setSelectedMetric(metric);
    selectEntity({
      type: "metric",
      id: metric.id,
      name: `${metric.name} (${metric.tier})`,
      status: metric.status,
      severity: metric.status === "DEGRADED" ? "HIGH" : metric.status === "ATTENTION" ? "MEDIUM" : "LOW",
      details: `${metric.name}: ${metric.value}${metric.unit} (Target: ${metric.slaTarget}). Tier: ${metric.tier}. Trace: ${metric.traceChain.event}.`,
      evidenceHash: generateVerificationHash(`TEL:${metric.id}:${metric.value}`),
      metadata: {
        value: metric.value,
        unit: metric.unit,
        tier: metric.tier,
        slaTarget: metric.slaTarget,
        traceChain: metric.traceChain,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* 4 OBSERVATION TIER BADGES BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 rounded-lg border border-border/30 bg-zinc-950/40 text-[10px] font-mono">
        <span className="text-muted-foreground mr-1">Observation Tiers:</span>
        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
          OBSERVED
        </Badge>
        <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10">
          DERIVED
        </Badge>
        <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/10">
          PREDICTED
        </Badge>
        <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
          SIMULATED
        </Badge>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TELEMETRY_METRICS.slice(0, 3).map((m) => (
          <div
            key={m.id}
            onClick={() => handleInspectMetric(m)}
            className={cn(
              "p-2.5 rounded-lg border text-xs cursor-pointer transition-colors space-y-1",
              selectedMetric.id === m.id
                ? "border-primary bg-primary/10"
                : "border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground truncate">{m.name.split(" ")[0]}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] font-mono px-1 py-0",
                  m.tier === "OBSERVED" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                  m.tier === "DERIVED" && "text-blue-400 border-blue-500/30 bg-blue-500/10",
                  m.tier === "PREDICTED" && "text-purple-400 border-purple-500/30 bg-purple-500/10",
                  m.tier === "SIMULATED" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                )}
              >
                {m.tier}
              </Badge>
            </div>
            <div className="text-base font-mono font-bold text-foreground">
              {m.value} <span className="text-xs text-muted-foreground font-normal">{m.unit}</span>
            </div>
            <div className="text-[9px] text-muted-foreground font-mono">SLA: {m.slaTarget}</div>
          </div>
        ))}
      </div>

      {/* CLUSTER CPU BAR */}
      <div className="p-2.5 rounded-lg border border-border/30 bg-zinc-950/40 text-xs space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Cluster CPU Utilization</span>
          <span className="font-mono text-foreground">34% (Nominal)</span>
        </div>
        <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: "34%" }} />
        </div>
      </div>

      {/* TRACE CHAIN DISPLAY */}
      <div className="p-3 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Activity className="size-3.5 text-primary" /> Trace Chain: {selectedMetric.name}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-5 px-1.5 text-[9px] gap-1 font-mono"
            onClick={() => handleInspectMetric(selectedMetric)}
          >
            <Sparkles className="size-2 text-primary" /> Trace in Drawer
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono p-1.5 rounded border border-border/30 bg-zinc-900/40 overflow-x-auto">
          <span className="text-primary font-bold">EVENT: {selectedMetric.traceChain.event}</span>
          <ArrowRight className="size-2.5 text-muted-foreground" />
          <span className="text-indigo-300 font-bold">RELEASE: {selectedMetric.traceChain.release}</span>
          <ArrowRight className="size-2.5 text-muted-foreground" />
          <span className="text-emerald-400 font-bold">COMPONENT: {selectedMetric.traceChain.component}</span>
          <ArrowRight className="size-2.5 text-muted-foreground" />
          <span className="text-amber-400 font-bold">DECISION: {selectedMetric.traceChain.decision}</span>
        </div>
      </div>
    </div>
  );
}
