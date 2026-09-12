/**
 * PROJECT BRAHMA — LIVE ANALYSIS VIEW (PHASE L.1)
 * Top-level dashboard component wrapping AnalysisPipelineView with project context.
 */

import React from "react";
import { AnalysisPipelineView } from "@/components/connectors/AnalysisPipelineView";

export function LiveAnalysisView({ className = "" }: { className?: string }) {
  return <AnalysisPipelineView className={className} />;
}
