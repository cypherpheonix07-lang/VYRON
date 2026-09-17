/**
 * VYRON — LIVE ENGINEERING SIGNAL FIELD (PHASE 07)
 * Continuous anomaly detection, telemetry correlations, and cross-subsystem signals.
 * Covers 10 Signal Categories: Architecture, Runtime, Dependency, Schema, Security,
 * Release, AI, Connector, Telemetry, and Project.
 * Implements the interaction chain:
 * SIGNAL → INVESTIGATE → CORRELATE → ATLAS → COPILOT → IMPACT → SIMULATION → MITIGATION.
 * Strictly ZERO SQL. Strictly Zero Capital 'B' "Brahma" branding.
 */

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandCenter } from "@/state/commandCenter/commandCenterStore";
import { eventSimulator } from "@/services/demo/eventSimulator";
import { anomalyCorrelationEngine } from "@/services/intelligence/anomalyCorrelationEngine";
import { generateVerificationHash } from "@/services/ai/cryptoUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Fingerprint,
  Layers,
  Network,
  Play,
  Radio,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

export interface EngineeringSignal {
  id: string;
  type:
    | "Architecture anomaly"
    | "Runtime anomaly"
    | "Dependency anomaly"
    | "Schema anomaly"
    | "Security anomaly"
    | "Release anomaly"
    | "AI anomaly"
    | "Connector anomaly"
    | "Telemetry anomaly"
    | "Project anomaly";
  source: string;
  time: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number; // 0 to 1
  project: string;
  component: string;
  details: string;
  evidenceHash: string;
  impactBlastRadius: string;
}

const BASELINE_SIGNALS: EngineeringSignal[] = [
  {
    id: "SIG-8812",
    type: "Architecture anomaly",
    source: "AST Structural Scanner",
    time: "2m ago",
    severity: "HIGH",
    confidence: 0.96,
    project: "Aurora Payments Gateway",
    component: "srv-settlement",
    details: "Unmapped direct query execution detected in services/billing/query.ts:42 bypassing governed repository.",
    evidenceHash: generateVerificationHash("SIG-8812:DRIFT_BOUNDARY"),
    impactBlastRadius: "HIGH_BLAST_RADIUS",
  },
  {
    id: "SIG-8811",
    type: "Security anomaly",
    source: "Bandit AST Analyzer",
    time: "14m ago",
    severity: "CRITICAL",
    confidence: 0.98,
    project: "Aurora Payments Gateway",
    component: "finledger/payment/processor.py",
    details: "Flagged potential dynamic SQL formatting (CWE-89) in settlement batch accumulator.",
    evidenceHash: generateVerificationHash("SIG-8811:CWE-89:BANDIT"),
    impactBlastRadius: "CRITICAL_BLAST_RADIUS",
  },
  {
    id: "SIG-8810",
    type: "Runtime anomaly",
    source: "OpenTelemetry Ingestion Queue",
    time: "28m ago",
    severity: "MEDIUM",
    confidence: 0.91,
    project: "Aurora Payments Gateway",
    component: "srv-gateway",
    details: "Acquirer callback p95 latency rose from 110ms to 142ms during merchant morning settlement.",
    evidenceHash: generateVerificationHash("SIG-8810:LATENCY_P95"),
    impactBlastRadius: "MODERATE",
  },
  {
    id: "SIG-8809",
    type: "Dependency anomaly",
    source: "NIST NVD Supply Chain Watcher",
    time: "1h ago",
    severity: "MEDIUM",
    confidence: 0.94,
    project: "MediSync Patient Portal",
    component: "package.json / pyproject.toml",
    details: "Detected vulnerable transitive package dependency in gRPC protocol buffers runner.",
    evidenceHash: generateVerificationHash("SIG-8809:NVD_CVE_DEP"),
    impactBlastRadius: "MODERATE",
  },
  {
    id: "SIG-8808",
    type: "Release anomaly",
    source: "Release Policy Gate Monitor",
    time: "2h ago",
    severity: "LOW",
    confidence: 0.99,
    project: "Aurora Payments Gateway",
    component: "REL-2026-09-PROD",
    details: "Milestone Defense check pending manual signature from Chief Architect.",
    evidenceHash: generateVerificationHash("SIG-8808:GATE_SIGNATURE"),
    impactBlastRadius: "LOCALIZED",
  },
];

export function LiveSignalRadarField() {
  const { selectEntity, setFocusedSurface } = useCommandCenter();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"signals" | "clusters">("signals");
  const [signals, setSignals] = useState<EngineeringSignal[]>(BASELINE_SIGNALS);
  const [activeSignal, setActiveSignal] = useState<EngineeringSignal>(BASELINE_SIGNALS[0]!);

  const anomalyClusters = useMemo(() => {
    return anomalyCorrelationEngine.listClusters();
  }, []);

  const filteredSignals = useMemo(() => {
    if (selectedCategory === "ALL") return signals;
    return signals.filter((s) => s.type.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [signals, selectedCategory]);

  const handleInjectAnomalyWave = () => {
    eventSimulator.injectAnomalyWave(3);
    const newSignal: EngineeringSignal = {
      id: `SIG-${Math.floor(Math.random() * 9000) + 1000}`,
      type: "Runtime anomaly",
      source: "Simulation Twin Engine",
      time: "Just now",
      severity: "HIGH",
      confidence: 0.95,
      project: "Aurora Payments Gateway",
      component: "srv-settlement",
      details: "Synthetic burst carding spike injected: 5 anomalous transactions generated for evaluation.",
      evidenceHash: generateVerificationHash(`SIM_SIG_${Date.now()}`),
      impactBlastRadius: "HIGH_BLAST_RADIUS",
    };
    setSignals([newSignal, ...signals]);
    setActiveSignal(newSignal);
    toast.success("Injected real-time signal into Live Engineering Field.");
  };

  const handleInspectSignal = (signal: EngineeringSignal) => {
    setActiveSignal(signal);
    selectEntity({
      type: "anomaly",
      id: signal.id,
      name: `${signal.type} (${signal.component})`,
      severity: signal.severity,
      confidence: signal.confidence,
      details: `${signal.details} Source: ${signal.source}. Project: ${signal.project}.`,
      evidenceHash: signal.evidenceHash,
      metadata: {
        type: signal.type,
        source: signal.source,
        component: signal.component,
        project: signal.project,
        impactBlastRadius: signal.impactBlastRadius,
      },
    });
  };

  const handleInspectCluster = (cluster: (typeof anomalyClusters)[0]) => {
    selectEntity({
      type: "anomaly",
      id: cluster.clusterId,
      name: cluster.title,
      severity: cluster.signals.some((s) => s.severity === "CRITICAL") ? "CRITICAL" : "HIGH",
      confidence: cluster.confidence,
      details: `Correlated Anomaly Cluster: ${cluster.primaryHypothesis}. Correlated signals: ${cluster.signals.length}. Status: ${cluster.hypothesisStatus}.`,
      metadata: {
        clusterId: cluster.clusterId,
        primaryHypothesis: cluster.primaryHypothesis,
        hypothesisStatus: cluster.hypothesisStatus,
        blastRadiusTier: cluster.blastRadiusTier,
        correlatedSignals: cluster.signals,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* 3 TOP RADAR TELEMETRY CARDS */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/40 bg-zinc-950/40 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">AST Health Radar</span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              NOMINAL
            </Badge>
          </div>
          <div className="text-lg font-bold font-mono text-foreground">98.4%</div>
          <p className="text-[11px] text-muted-foreground">Syntactic AST parsing error rate &lt; 0.02%</p>
        </div>

        <div className="rounded-lg border border-border/40 bg-zinc-950/40 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Anomaly Spikes</span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              {signals.length} MONITORED
            </Badge>
          </div>
          <div className="text-lg font-bold font-mono text-foreground">0 in 24h</div>
          <p className="text-[11px] text-muted-foreground">Z-score anomaly detector operating within SLA</p>
        </div>

        <div className="rounded-lg border border-border/40 bg-zinc-950/40 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Model Calibration</span>
            <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/20 bg-purple-500/10">
              OPTIMAL
            </Badge>
          </div>
          <div className="text-lg font-bold font-mono text-foreground">96.2%</div>
          <p className="text-[11px] text-muted-foreground">Embedding fidelity and retrieval confidence</p>
        </div>
      </div>

      {/* FILTER TABS & SIMULATION TRIGGER */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-border/40 bg-zinc-950/40 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-0.5 mr-2 border-r border-border/40 pr-2">
            <Button
              variant={viewMode === "signals" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("signals")}
              className="h-6 px-2 text-[10px] font-mono"
            >
              Signals
            </Button>
            <Button
              variant={viewMode === "clusters" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("clusters")}
              className="h-6 px-2 text-[10px] font-mono gap-1"
            >
              <Layers className="size-2.5 text-primary" /> Correlated Clusters ({anomalyClusters.length})
            </Button>
          </div>

          {viewMode === "signals" && ["ALL", "Architecture", "Security", "Runtime", "Dependency", "Release"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="h-6 px-2 text-[10px] font-mono"
            >
              {cat}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleInjectAnomalyWave}
          className="h-6 px-2 text-[10px] font-mono gap-1 text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
        >
          <Zap className="size-2.5" /> Inject Test Wave
        </Button>
      </div>

      {/* SIGNAL / CLUSTER LIST VIEW */}
      {viewMode === "clusters" ? (
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {anomalyClusters.map((cluster) => (
            <div
              key={cluster.clusterId}
              onClick={() => handleInspectCluster(cluster)}
              className="p-3 rounded-lg border border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors cursor-pointer space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{cluster.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[9px] font-mono text-purple-400 border-purple-500/30 bg-purple-500/10">
                    {cluster.blastRadiusTier}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] font-mono text-amber-400 border-amber-500/30 bg-amber-500/10">
                    {cluster.hypothesisStatus}
                  </Badge>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{cluster.primaryHypothesis}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground border-t border-border/20">
                <span>Correlated Signals: {cluster.signals.length}</span>
                <span className="text-primary">Confidence: {Math.round(cluster.confidence * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {filteredSignals.map((sig) => (
            <div
              key={sig.id}
              onClick={() => handleInspectSignal(sig)}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors",
                activeSignal.id === sig.id
                  ? "border-primary bg-primary/10"
                  : "border-border/30 bg-zinc-950/40 hover:bg-zinc-900/40",
              )}
            >
              <div className="min-w-0 pr-3 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{sig.type}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">({sig.component})</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">{sig.details}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-muted-foreground">{sig.time}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-mono",
                    sig.severity === "CRITICAL" && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                    sig.severity === "HIGH" && "text-orange-400 border-orange-500/30 bg-orange-500/10",
                    sig.severity === "MEDIUM" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                    sig.severity === "LOW" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                  )}
                >
                  {sig.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIONABLE CHAIN: SIGNAL → INVESTIGATE → CORRELATE → ATLAS → COPILOT → IMPACT → SIMULATION → MITIGATION */}
      <div className="p-3.5 rounded-lg border border-primary/20 bg-zinc-950/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="size-3.5 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              Signal Correlation Chain: {activeSignal.id}
            </span>
            <Badge variant="outline" className="text-[9px] font-mono text-primary bg-primary/10">
              {Math.round(activeSignal.confidence * 100)}% Confidence
            </Badge>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px] gap-1 font-mono"
            onClick={() => handleInspectSignal(activeSignal)}
          >
            <Sparkles className="size-2.5 text-primary" /> Investigate in Universal Drawer
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono p-2 rounded border border-border/30 bg-zinc-900/40 overflow-x-auto">
          <span className="text-primary font-bold">SIGNAL: {activeSignal.id}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-indigo-300 font-bold">CORRELATE: ATLAS ({activeSignal.component})</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-amber-400 font-bold">BLAST: {activeSignal.impactBlastRadius}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-cyan-400 font-bold">TWIN: SIMULATE</span>
          <ArrowRight className="size-3 text-muted-foreground" />
          <span className="text-emerald-400 font-bold">MITIGATION: PATCH</span>
        </div>
      </div>
    </div>
  );
}
