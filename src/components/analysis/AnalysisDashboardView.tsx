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
  XCircle,
  History,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalysisStream } from "@/state/analysis/useAnalysisStream";
import { useAppMode } from "@/state/mode/useAppMode";
import { AnalysisTimeline } from "./AnalysisTimeline";
import { LiveFindingsPanel } from "./LiveFindingsPanel";
import { RunAnalysisModal } from "./RunAnalysisModal";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { analysisStore, AnalysisRunSummary } from "@/state/analysis/analysisStore";
import { demoStore } from "@/state/demo/demoStore";
import { ProactiveInsightsBanner } from "@/components/copilot/ProactiveInsightsBanner";
import { InlineCopilotAssistant } from "@/components/copilot/InlineCopilotAssistant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AnalysisDashboardView() {
  const { mode } = useAppMode();
  const { run, activeStage, totalProgress, isRunning, isCompleted } = useAnalysisStream();
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [runHistory, setRunHistory] = useState<AnalysisRunSummary[]>(() => analysisStore.getHistory());

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
      setRunHistory(analysisStore.getHistory());
      toast.success("Initiated 12-stage analysis pipeline.");
    } catch (err) {
      console.error("Analysis execution error:", err);
      toast.error("Failed to start analysis run.");
    }
  };

  const handleCancelRun = () => {
    if (!isRunning) return;
    analysisOrchestrator.cancelRun();
    setRunHistory(analysisStore.getHistory());
    toast.warning("Analysis run cancelled by operator.");
  };

  const handleOpenHistory = () => {
    setRunHistory(analysisStore.getHistory());
    setHistoryOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Proactive Copilot Recommendations Banner */}
      <ProactiveInsightsBanner />

      {/* Top Header & Dominant RUN ANALYSIS Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-primary/5 to-card backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              {isRunning ? "Pipeline Running" : isCompleted ? "Pipeline Sealed" : "Ready"}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Dataset: {run.targetDatasetName}
            </span>
            {run.id && (
              <span className="text-[10px] text-muted-foreground/80 font-mono hidden sm:inline">
                Run ID: {run.id}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Vyron AI-Native Analytics Engine
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            12-stage live execution stream integrating statistical IQR outliers, entity relationship
            centrality, and SHAP explainability attribution.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* View Run History Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenHistory}
            className="text-xs border-border/80 text-foreground hover:bg-secondary gap-1.5"
          >
            <History className="size-3.5" />
            <span>History ({runHistory.length})</span>
          </Button>

          {/* Configure Pipeline */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs border-border/80 text-foreground hover:bg-secondary"
          >
            Configure
          </Button>

          {/* If Running: Show Cancel Button & Progress */}
          {isRunning ? (
            <div className="flex items-center gap-2">
              <Button
                size="lg"
                disabled
                className="font-bold text-xs px-5 py-5 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center gap-2"
              >
                <Activity className="size-4 animate-spin text-primary" />
                <span>STAGE {run.currentStageId}/12 ({totalProgress}%)</span>
              </Button>
              <Button
                size="lg"
                onClick={handleCancelRun}
                className="font-bold text-xs px-4 py-5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 border border-rose-500/40 flex items-center gap-1.5"
                title="Abort running pipeline"
              >
                <XCircle className="size-4" />
                <span>Cancel</span>
              </Button>
            </div>
          ) : (
            /* If Idle/Completed: Show Dominant RUN / RERUN Action */
            <Button
              size="lg"
              onClick={handleQuickRun}
              className="w-full sm:w-auto font-black text-sm px-6 py-6 rounded-xl bg-gradient-to-r from-primary via-indigo-500 to-purple-600 text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 border border-white/20"
            >
              {isCompleted ? (
                <>
                  <RotateCw className="size-4 fill-current" />
                  <span>RERUN ANALYSIS</span>
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" />
                  <span>RUN ANALYSIS</span>
                </>
              )}
            </Button>
          )}
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
            <span>ANOMALIES DETECTED</span>
            <AlertTriangle className="size-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {run.telemetry.anomaliesDetected}
          </div>
          <div className="text-[11px] text-muted-foreground">
            IQR Multiplier: 1.5 | Threshold: High
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>AUDIT PROVENANCE</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold font-mono text-emerald-400 truncate">
            {run.status === "COMPLETED" ? "SEALED (SHA-256)" : run.status === "CANCELLED" ? "CANCELLED" : "IN PROGRESS"}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {run.telemetry.endTime ? `Duration: ${(run.telemetry.totalDurationMs / 1000).toFixed(1)}s` : "Awaiting completion"}
          </div>
        </div>
      </div>

      {/* Embedded Contextual Copilot Intelligence */}
      <InlineCopilotAssistant pageContext="analysis" />

      {/* Main Analysis Body: Timeline + Findings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <AnalysisTimeline stages={run.stages} currentStageId={run.currentStageId} />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <LiveFindingsPanel findings={run.findings} />
        </div>
      </div>

      {/* Pipeline Configuration Modal */}
      <RunAnalysisModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Historical Runs Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-2xl bg-zinc-950 border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <History className="size-4 text-primary" />
              <span>Analysis Execution Run History</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 text-xs">
            {runHistory.map((h) => (
              <div
                key={h.id}
                className="p-3.5 rounded-xl border border-border/40 bg-secondary/30 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{h.targetDatasetName}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {h.status}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(h.startedAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground font-mono">
                  <div>Records: {h.recordsProcessed.toLocaleString()}</div>
                  <div>Risk Score: {h.overallRiskScore}/100</div>
                  <div>Findings: {h.findingsCount}</div>
                </div>

                {h.verificationHash && (
                  <div className="pt-1 border-t border-border/20 text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                    <Shield className="size-2.5 text-emerald-400" />
                    <span>Seal: {h.verificationHash}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
