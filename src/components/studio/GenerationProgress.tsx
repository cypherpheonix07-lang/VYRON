import React, { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Database,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { GenerationStage } from "@/hooks/useWebsiteGeneration";

interface GenerationProgressProps {
  stages: GenerationStage[];
  isLoading: boolean;
  error: string | null;
  onContinue: () => void;
  onRetry: () => void;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  stages,
  isLoading,
  error,
  onContinue,
  onRetry,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);
  const isFinished = completedCount === stages.length;

  const getStageIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 2:
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 3:
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 4:
      default:
        return <Globe className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>PROJECT BRAHMA AUTONOMOUS SYNTHESIS</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isFinished ? "Website Architecture Fully Synthesized" : "Generating Your Website Blueprints"}
        </h2>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto">
          AI agents and edge routines are constructing page hierarchies, API routes, PostgreSQL DDL schemas, and mock seed data.
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-6 shadow-xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Synthesis Progress:</span>
            <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsedSeconds}s elapsed</span>
          </div>
        </div>

        <Progress value={progressPercent} className="h-2 bg-muted/40" />

        {/* Stages Checklist */}
        <div className="space-y-4 pt-2">
          {stages.map((stage) => {
            const isDone = stage.status === "completed";
            const isCurrent = stage.status === "running";
            const isFailed = stage.status === "failed";

            return (
              <div
                key={stage.step}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  isCurrent
                    ? "border-cyan-500/60 bg-cyan-950/20 ring-1 ring-cyan-500/40"
                    : isDone
                    ? "border-emerald-500/30 bg-emerald-950/10"
                    : "border-border/40 bg-card/20 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/80 border border-border/60 shrink-0 mt-0.5">
                    {getStageIcon(stage.step)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                      <span>Step 0{stage.step}: {stage.label}</span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{stage.details}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone && (
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-400 bg-cyan-500/10 animate-pulse">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> In Progress
                    </Badge>
                  )}
                  {isFailed && (
                    <Badge variant="destructive" className="text-[10px]">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Failed
                    </Badge>
                  )}
                  {stage.status === "pending" && (
                    <Badge variant="secondary" className="text-[10px]">Queued</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-xs text-destructive flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="destructive" onClick={onRetry} className="h-7 text-xs">
              Retry Generation
            </Button>
          </div>
        )}

        {/* Continue Action */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-end">
          <Button
            onClick={onContinue}
            disabled={!isFinished}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold shadow-lg shadow-cyan-500/20"
          >
            Launch Interactive Blueprint & Preview <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
