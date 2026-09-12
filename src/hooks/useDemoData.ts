/**
 * PROJECT BRAHMA — USE DEMO DATA HOOK (FL-02-B STEP 4)
 * Returns seeded FinLedger data with simulated async latencies and cryptographic session provenance.
 */

import { useCallback } from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { DEMO_PROJECT, DemoProject } from "@/data/demo/demoProject";
import { DEMO_SCAN_RESULTS, DemoScanResult } from "@/data/demo/demoScanResults";
import { DEMO_GATE_RESULTS, DEMO_RELEASE_SUMMARY, DemoReleaseSummary } from "@/data/demo/demoGateResults";
import {
  DEMO_BLUEPRINT_NODES,
  DEMO_BLUEPRINT_EDGES,
  DemoBlueprintNode,
  DemoBlueprintEdge,
} from "@/data/demo/demoBlueprint";
import { GateResultData } from "@/components/ui/GateCard";

export interface DemoDataProvenance<T> {
  data: T;
  provenance: {
    provider: "demo:seeded";
    sessionId: string;
    timestamp: string;
    domain: string;
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useDemoData() {
  const { isDemo, demoSessionId, demoDomain } = useDemoMode();

  const getProject = useCallback(async (): Promise<DemoProject | null> => {
    if (!isDemo) return null;
    await sleep(200);
    return DEMO_PROJECT;
  }, [isDemo]);

  const getScanResult = useCallback(async (): Promise<DemoScanResult | null> => {
    if (!isDemo) return null;
    await sleep(800);
    return DEMO_SCAN_RESULTS;
  }, [isDemo]);

  const getGateResults = useCallback(async (): Promise<GateResultData[] | null> => {
    if (!isDemo) return null;
    await sleep(500);
    return DEMO_GATE_RESULTS;
  }, [isDemo]);

  const getReleaseSummary = useCallback(async (): Promise<DemoReleaseSummary | null> => {
    if (!isDemo) return null;
    await sleep(400);
    return DEMO_RELEASE_SUMMARY;
  }, [isDemo]);

  const getBlueprintNodes = useCallback(async (): Promise<DemoBlueprintNode[] | null> => {
    if (!isDemo) return null;
    await sleep(300);
    return DEMO_BLUEPRINT_NODES;
  }, [isDemo]);

  const getBlueprintEdges = useCallback(async (): Promise<DemoBlueprintEdge[] | null> => {
    if (!isDemo) return null;
    await sleep(300);
    return DEMO_BLUEPRINT_EDGES;
  }, [isDemo]);

  const withProvenance = useCallback(
    <T>(data: T): DemoDataProvenance<T> => ({
      data,
      provenance: {
        provider: "demo:seeded",
        sessionId: demoSessionId || "demo-session-default",
        timestamp: new Date().toISOString(),
        domain: demoDomain || "fintech",
      },
    }),
    [demoSessionId, demoDomain]
  );

  return {
    isDemo,
    getProject,
    getScanResult,
    getGateResults,
    getReleaseSummary,
    getBlueprintNodes,
    getBlueprintEdges,
    withProvenance,
    // Direct sync access for components that don't need async delay
    rawProject: isDemo ? DEMO_PROJECT : null,
    rawScanResult: isDemo ? DEMO_SCAN_RESULTS : null,
    rawGateResults: isDemo ? DEMO_GATE_RESULTS : null,
    rawBlueprintNodes: isDemo ? DEMO_BLUEPRINT_NODES : [],
    rawBlueprintEdges: isDemo ? DEMO_BLUEPRINT_EDGES : [],
  };
}
