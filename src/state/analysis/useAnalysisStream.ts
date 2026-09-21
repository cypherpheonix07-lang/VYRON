import { useState, useEffect, useCallback } from "react";
import { analysisStore, AnalysisRun, AnalysisStatus, StageId, Finding } from "./analysisStore";
import { AppMode } from "../mode/modeStore";

export function useAnalysisStream() {
  const [run, setRun] = useState<AnalysisRun>(() => analysisStore.getRun());

  useEffect(() => {
    return analysisStore.subscribe((updatedRun) => {
      setRun({ ...updatedRun });
    });
  }, []);

  const initRun = useCallback((datasetId: string, datasetName: string, mode: AppMode) => {
    return analysisStore.initRun(datasetId, datasetName, mode);
  }, []);

  const setStatus = useCallback((status: AnalysisStatus) => {
    analysisStore.setStatus(status);
  }, []);

  const updateStage = useCallback(
    (stageId: StageId, updates: Parameters<typeof analysisStore.updateStage>[1]) => {
      analysisStore.updateStage(stageId, updates);
    },
    [],
  );

  const addFinding = useCallback((finding: Parameters<typeof analysisStore.addFinding>[0]) => {
    analysisStore.addFinding(finding);
  }, []);

  const addLog = useCallback(
    (level: "INFO" | "WARN" | "ERROR", message: string, stageId?: StageId) => {
      analysisStore.addLog(level, message, stageId);
    },
    [],
  );

  const reset = useCallback(() => {
    analysisStore.reset();
  }, []);

  const activeStage = run.stages.find((s) => s.id === run.currentStageId) || null;
  const isRunning = run.status === "RUNNING";
  const isCompleted = run.status === "COMPLETED";
  const isPaused = run.status === "PAUSED";

  const totalProgress = Math.round(
    run.stages.reduce((acc, stage) => acc + stage.progressPercent, 0) / run.stages.length,
  );

  return {
    run,
    activeStage,
    totalProgress,
    isRunning,
    isCompleted,
    isPaused,
    initRun,
    setStatus,
    updateStage,
    addFinding,
    addLog,
    reset,
  };
}
