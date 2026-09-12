import React, { useState } from "react";
import {
  Play,
  Sparkles,
  Activity,
  ShieldCheck,
  Database,
  Layers,
  BarChart3,
  RotateCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalysisStream } from "@/state/analysis/useAnalysisStream";
import { useAppMode } from "@/state/mode/useAppMode";
import { AnalysisTimeline } from "./AnalysisTimeline";
import { LiveFindingsPanel } from "./LiveFindingsPanel";
import { RunAnalysisModal } from "./RunAnalysisModal";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { demoStore } from "@/state/demo/demoStore";

export function AnalysisDashboardView() {
  const { mode } = useAppMode();
  const { run, activeStage, totalProgress, isRunning, isCompleted } = useAnalysisStream();
  const [modalOpen, setModalOpen] = useState(false);

  const selectedBenchmark = demoStore.getSelectedDataset();

  const handleQuickRun = async () => {
    if (isRunning) return;
    try {
      await analysisOrchestrator.runPipeline({
        mode,
        datasetId: mode === "DEMO" ? selectedBenchmark.id : "prod_dataset",
        datasetName:
          mode === "DEMO" ? selectedBenchmark.name : "Production Analytics Ingestion Feed",
        speedMultiplier: 1.5,
      });
    } catch (err) {
      console.error("Analysis execution error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Dominant RUN ANALYSIS Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Live Pipeline
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Dataset: {run.targetDatasetName}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Brahma AI-Native Analytics Engine
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            12-stage live execution stream integrating statistical IQR outliers, entity relationship
            centrality, and SHAP explainability attribution.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs border-border/80 text-foreground hover:bg-secondary"
          >
            Configure Pipeline
          </Button>

          {/* THE DOMINANT RUN ANALYSIS BUTTON */}
          <Button
            size="lg"
            disabled={isRunning}
            onClick={handleQuickRun}
            className="w-full sm:w-auto font-black text-sm px-6 py-6 rounded-xl bg-gradient-to-r from-primary via-indigo-500 to-purple-600 text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 border border-white/20"
          >
            {isRunning ? (
              <>
                <Activity className="size-5 animate-spin" />
                <span>ORCHESTRATING PIPELINE... ({totalProgress}%)</span>
              </>
            ) : (
              <>
                <Play className="size-5 fill-current" />
                <span>RUN ANALYSIS</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>RECORDS EVALUATED</span>
            <Database className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {run.telemetry.recordsProcessed.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Throughput: {run.telemetry.eventsPerSecond} eps
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>OVERALL RISK INDEX</span>
            <Activity className="size-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-foreground flex items-baseline gap-1">
            <span
              className={
                run.telemetry.overallRiskScore > 70
                  ? "text-rose-400"
                  : run.telemetry.overallRiskScore > 40
                    ? "text-amber-400"
                    : "text-emerald-400"
              }
            >
              {run.telemetry.overallRiskScore}
            </span>
            <span className="text-xs text-muted-foreground font-normal">/ 100</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Critical Entities: {run.telemetry.highRiskEntities}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>ANOMALIES FLAGGED</span>
            <AlertTriangle className="size-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            {run.telemetry.anomaliesDetected}
          </div>
          <div className="text-[11px] text-muted-foreground">
            IQR & Isolation Forest score &gt; 3.0σ
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>AUDIT STATUS</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mt-1">
            {run.telemetry.verificationHash
              ? "VERIFIED & SEALED"
              : isRunning
                ? "COMPUTING HASH..."
                : "AWAITING RUN"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground truncate">
            {run.telemetry.verificationHash
              ? run.telemetry.verificationHash.slice(0, 18) + "..."
              : "Tamper-proof SHA-256"}
          </div>
        </div>
      </div>

      {/* Main Two-Column Analysis Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <AnalysisTimeline stages={run.stages} currentStageId={run.currentStageId} />
        </div>

        <div className="lg:col-span-5">
          <LiveFindingsPanel findings={run.findings} />
        </div>
      </div>

      {/* Modal Dialog */}
      <RunAnalysisModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
