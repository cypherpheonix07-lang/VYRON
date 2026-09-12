/**
 * PROJECT BRAHMA — ANALYSIS PIPELINE VIEW (FL-01-E)
 * Unified real-time pipeline monitoring console displaying stepper progress,
 * live 7-gate status cards, findings stream, and virtualized log output.
 */

import React, { useState, useRef, useEffect } from "react";
import { PhaseProgressBar, PipelineStage } from "@/components/connectors/PhaseProgressBar";
import { LiveGateCard, LiveGateStatus } from "@/components/connectors/LiveGateCard";
import { FindingStream } from "@/components/connectors/FindingStream";
import { AnalysisLogStream, LogEntry } from "@/components/analysis/AnalysisLogStream";
import { RunAnalysisButton } from "@/components/analysis/RunAnalysisButton";
import { DemoStageRunner } from "@/components/analysis/DemoStageRunner";
import { CodeFinding } from "@/data/demo/demoScanResults";
import { GateResultData } from "@/components/ui/GateCard";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { DEMO_GATE_RESULTS } from "@/data/demo/demoGateResults";

const INITIAL_GATES: { name: string; threshold: number }[] = [
  { name: "Security & Vulnerability Gate", threshold: 80 },
  { name: "AST & Structural Complexity Gate", threshold: 70 },
  { name: "Test Coverage & Mutation Gate", threshold: 70 },
  { name: "Schema & Contract Invariant Gate", threshold: 90 },
  { name: "Documentation & Provenance Gate", threshold: 75 },
  { name: "Performance & SLA Resilience Gate", threshold: 75 },
  { name: "Licensure & Supply Chain Gate", threshold: 100 },
];

export function AnalysisPipelineView({ className = "" }: { className?: string }) {
  const { isDemo } = useDemoMode();
  const [stage, setStage] = useState<PipelineStage>("Cloning");
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState("Ready to launch analysis pipeline");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [findings, setFindings] = useState<CodeFinding[]>([]);
  const [gateCards, setGateCards] = useState<
    { name: string; status: LiveGateStatus; score: number | null; threshold: number; evidence: string | null }[]
  >(() =>
    INITIAL_GATES.map((g) => ({
      name: g.name,
      status: "pending",
      score: null,
      threshold: g.threshold,
      evidence: null,
    }))
  );

  const runnerRef = useRef<DemoStageRunner | null>(null);

  const startPipeline = () => {
    setIsRunning(true);
    setLogs([]);
    setFindings([]);
    setProgress(0);
    setGateCards(
      INITIAL_GATES.map((g) => ({
        name: g.name,
        status: "pending",
        score: null,
        threshold: g.threshold,
        evidence: null,
      }))
    );

    const runner = new DemoStageRunner();
    runnerRef.current = runner;

    runner.run({
      onStageChange: (newStage, newPercent, msg) => {
        setStage(newStage);
        setProgress(newPercent);
        setStageMessage(msg);
      },
      onLog: (newLogs) => {
        setLogs((prev) => [...prev, ...newLogs]);
      },
      onFinding: (finding) => {
        setFindings((prev) => [...prev, finding]);
      },
      onGateEvaluated: (gate: GateResultData) => {
        setGateCards((prev) =>
          prev.map((card) => {
            if (card.name === gate.gate_name) {
              return {
                ...card,
                status: gate.passed ? "passed" : "failed",
                score: gate.score,
                evidence: gate.evidence,
              };
            }
            return card;
          })
        );
      },
      onComplete: () => {
        setIsRunning(false);
      },
    });
  };

  useEffect(() => {
    return () => {
      runnerRef.current?.cancel();
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
        <div>
          <h2 className="text-base font-bold text-zinc-100">Architectural Analysis Engine</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Static AST verification, Bandit security analysis, and multi-gate release governance.
          </p>
        </div>

        <RunAnalysisButton onStartAnalysis={startPipeline} isRunning={isRunning} />
      </div>

      {/* 5-Stage Horizontal Stepper */}
      <PhaseProgressBar
        currentStage={stage}
        progressPercent={progress}
        stageMessage={stageMessage}
        isRunning={isRunning}
      />

      {/* Grid: 7 Live Gates + Live Finding Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 7 Live Gates */}
        <div className="lg:col-span-6 space-y-2">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">
            Architectural Release Gates (7)
          </h4>
          <div className="space-y-2">
            {gateCards.map((g) => (
              <LiveGateCard
                key={g.name}
                gateName={g.name}
                status={g.status}
                score={g.score}
                threshold={g.threshold}
                evidence={g.evidence}
              />
            ))}
          </div>
        </div>

        {/* Live Findings Stream */}
        <div className="lg:col-span-6">
          <FindingStream findings={findings} maxHeight={430} />
        </div>
      </div>

      {/* Virtualized Log Console */}
      <div>
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1 mb-2">
          Telemetry & Parser Log Stream
        </h4>
        <AnalysisLogStream logs={logs} height={320} />
      </div>
    </div>
  );
}
