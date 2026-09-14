import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ShieldCheck, Activity, X, RotateCcw } from "lucide-react";
import { useAnalysisStream } from "@/state/analysis/useAnalysisStream";
import { analysisOrchestrator } from "@/services/orchestrator/analysisOrchestrator";
import { useAppMode } from "@/state/mode/useAppMode";
import { demoStore } from "@/state/demo/demoStore";
import { AIModelType } from "@/state/copilot/copilotStore";

interface RunAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RunAnalysisModal({ open, onOpenChange }: RunAnalysisModalProps) {
  const { mode } = useAppMode();
  const { run, isRunning, isCompleted, totalProgress } = useAnalysisStream();
  const selectedBenchmark = demoStore.getSelectedDataset();

  const [selectedModel, setSelectedModel] = useState<AIModelType>("CLAUDE_SONNET");
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.5);

  const handleStart = async () => {
    try {
      await analysisOrchestrator.runPipeline({
        mode,
        datasetId: mode === "DEMO" ? selectedBenchmark.id : "prod_stream_dataset",
        datasetName: mode === "DEMO" ? selectedBenchmark.name : "Production Operational Feed",
        speedMultiplier,
      });
    } catch (err) {
      console.error("Pipeline run error:", err);
    }
  };

  const handleCancel = () => {
    analysisOrchestrator.cancelRun();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Brahma 12-Stage Live Analysis Orchestrator
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Run automated ingestion, IQR anomaly evaluation, entity graph centrality, and SHAP
                explainability.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Dataset Details */}
          <div className="p-3.5 rounded-lg border border-border/40 bg-secondary/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">TARGET DATASET</span>
              <span
                className={
                  mode === "DEMO" ? "font-semibold text-amber-400" : "font-semibold text-primary"
                }
              >
                {mode === "DEMO" ? "DEMO MODE (ISOLATED)" : "NORMAL MODE (LIVE FEED)"}
              </span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {mode === "DEMO" ? selectedBenchmark.name : "Active Production Dataset & API Stream"}
            </div>
            <div className="text-xs text-muted-foreground">
              {mode === "DEMO"
                ? selectedBenchmark.description
                : "Connected via verified Kaggle & operational database connectors."}
            </div>
          </div>

          {/* Model Dispatch & Speed Config */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Reasoning Engine</label>
              <select
                disabled={isRunning}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModelType)}
                className="w-full text-xs rounded-md bg-secondary/50 border border-border/60 text-foreground p-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="OPENROUTER_AUTO">OpenRouter Multi-Model (High Availability)</option>
                <option value="OPENAI_GPT4O">GPT-4o (OpenAI Direct / Failover)</option>
                <option value="CLAUDE_SONNET">Claude 3.7 Sonnet (Anthropic)</option>
                <option value="KIMI_K3">Kimi K3 MoE (Moonshot)</option>
                <option value="MOCK_DETERMINISTIC">Deterministic Mock Engine</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Execution Speed</label>
              <select
                disabled={isRunning}
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                className="w-full text-xs rounded-md bg-secondary/50 border border-border/60 text-foreground p-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={1.0}>1.0x (Standard Telemetry)</option>
                <option value={1.5}>1.5x (Accelerated)</option>
                <option value={2.5}>2.5x (Rapid Benchmark)</option>
              </select>
            </div>
          </div>

          {/* Real-time Progress Bar if Running */}
          {(isRunning || isCompleted) && (
            <div className="p-3 rounded-lg border border-border/40 bg-background/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  {isRunning ? (
                    <Activity className="size-3.5 text-primary animate-spin" />
                  ) : (
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                  )}
                  {isRunning
                    ? `Executing Stage ${run.currentStageId || 1} / 12...`
                    : "Pipeline Execution Completed"}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{totalProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-primary to-emerald-400 transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              {run.telemetry.verificationHash && (
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-1 truncate">
                  <ShieldCheck className="size-3" /> Sealed Hash: {run.telemetry.verificationHash}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
          {isRunning ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
            >
              <X className="size-3.5 mr-1" /> Abort Pipeline
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs text-muted-foreground"
            >
              Close
            </Button>
          )}

          <Button
            size="sm"
            disabled={isRunning}
            onClick={handleStart}
            className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 px-4 py-2"
          >
            <Play className="size-3.5 mr-1.5 fill-current" />
            {isRunning
              ? "Running Pipeline..."
              : isCompleted
                ? "Re-Run Analysis"
                : "Launch 12-Stage Pipeline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
