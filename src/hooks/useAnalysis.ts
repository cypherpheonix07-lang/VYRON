import { useState, useEffect, useCallback } from "react";
import { engineApi, type ScanStatusResult } from "@/lib/engineClient";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { DEMO_SCAN_HISTORY } from "@/data/demoSeedData";

export function useAnalysis(projectId?: string) {
  const { isDemoMode } = useDemoMode();
  const [history, setHistory] = useState(DEMO_SCAN_HISTORY);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<ScanStatusResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const triggerScan = async (repoUrl: string, pid: string = projectId || "default") => {
    setIsScanning(true);
    if (isDemoMode) {
      setTimeout(() => {
        const mockResult: ScanStatusResult = {
          complexity_avg: 6.8,
          complexity_max: 11.2,
          total_functions: 52,
          total_lines: 1650,
          security_score: 97,
          bandit_findings: [],
          files_analyzed: 18,
        };
        setLatestResult(mockResult);
        setIsScanning(false);
      }, 1500);
      return "demo-task-id";
    }

    try {
      const resp = await engineApi.triggerScan({ repo_url: repoUrl, project_id: pid });
      setActiveTask(resp.task_id);
      setTaskStatus("PROCESSING");
      return resp.task_id;
    } catch (e) {
      console.warn("[useAnalysis] Engine trigger failed, using client simulation:", e);
      setIsScanning(false);
      return null;
    }
  };

  // Poll active task
  useEffect(() => {
    if (!activeTask || activeTask.startsWith("demo-")) return;

    const interval = setInterval(async () => {
      try {
        const statusResp = await engineApi.getScanStatus(activeTask);
        setTaskStatus(statusResp.status);
        if (statusResp.status === "SUCCESS" && statusResp.result) {
          setLatestResult(statusResp.result);
          setIsScanning(false);
          setActiveTask(null);
        }
      } catch {
        // keep polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTask]);

  return {
    history,
    isScanning,
    taskStatus,
    latestResult,
    triggerScan,
  };
}
