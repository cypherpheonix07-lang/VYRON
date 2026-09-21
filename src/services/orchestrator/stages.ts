/**
 * PROJECT BRAHMA — 12-STAGE PIPELINE SPECIFICATION
 * Strict contract definitions for each execution phase.
 */

import { StageId } from "../../state/analysis/analysisStore";

export interface PipelineStageDefinition {
  id: StageId;
  name: string;
  category: "INGESTION" | "CORE_ANALYTICS" | "SYNTHESIS";
  description: string;
  prerequisites: StageId[];
  inputs: string[];
  outputs: string[];
  estimatedDurationMs: number;
}

export const STAGE_DEFINITIONS: Record<StageId, PipelineStageDefinition> = {
  1: {
    id: 1,
    name: "Data Acquisition & Ingestion",
    category: "INGESTION",
    description:
      "Fetch source records from Kaggle connector or live transactional feeds into bounded memory buffer.",
    prerequisites: [],
    inputs: ["datasetId", "connectorCredentials"],
    outputs: ["rawRecords", "recordCount", "sourceMetadata"],
    estimatedDurationMs: 400,
  },
  2: {
    id: 2,
    name: "Schema Validation & Quality Contracts",
    category: "INGESTION",
    description:
      "Assert schema types, null boundaries, and field integrity against canonical data contracts.",
    prerequisites: [1],
    inputs: ["rawRecords", "validationRules"],
    outputs: ["validatedRecords", "conformityRate", "violationList"],
    estimatedDurationMs: 350,
  },
  3: {
    id: 3,
    name: "Normalization & Canonical Mapping",
    category: "INGESTION",
    description:
      "Map source-specific column names to canonical schema and scale continuous numerical metrics.",
    prerequisites: [2],
    inputs: ["validatedRecords", "columnMapping"],
    outputs: ["canonicalRecords", "zScoreScaleParams"],
    estimatedDurationMs: 300,
  },
  4: {
    id: 4,
    name: "Feature Preparation & Vector Encoding",
    category: "CORE_ANALYTICS",
    description:
      "Extract time-delta intervals, categorical frequency encodings, and numerical interaction features.",
    prerequisites: [3],
    inputs: ["canonicalRecords"],
    outputs: ["featureMatrix", "featureNames"],
    estimatedDurationMs: 450,
  },
  5: {
    id: 5,
    name: "Anomaly Detection (IQR + Isolation Forest)",
    category: "CORE_ANALYTICS",
    description:
      "Evaluate statistical distribution boundaries (Q1/Q3/IQR) and compute individual anomaly scores.",
    prerequisites: [4],
    inputs: ["featureMatrix", "canonicalRecords"],
    outputs: ["anomalies", "outlierScores", "iqrBounds"],
    estimatedDurationMs: 550,
  },
  6: {
    id: 6,
    name: "Graph Analysis & Entity Centrality",
    category: "CORE_ANALYTICS",
    description:
      "Construct entity relationship graph, calculate degree centrality, and detect high-fanout hubs.",
    prerequisites: [4],
    inputs: ["canonicalRecords"],
    outputs: ["graphNodes", "graphEdges", "topHubs", "centralityMap"],
    estimatedDurationMs: 450,
  },
  7: {
    id: 7,
    name: "Multi-Factor Composite Risk Scoring",
    category: "CORE_ANALYTICS",
    description:
      "Synthesize statistical anomaly, structural centrality, and velocity factors into a 0-100 composite risk index.",
    prerequisites: [5, 6],
    inputs: ["outlierScores", "centralityMap", "velocityMetrics"],
    outputs: ["overallRiskScore", "riskDistribution", "topRiskEntities"],
    estimatedDurationMs: 400,
  },
  8: {
    id: 8,
    name: "Cross-Factor Correlation & Trend Linkage",
    category: "CORE_ANALYTICS",
    description:
      "Compute cross-metric Pearson and Spearman correlation matrices to identify coupled risk drivers.",
    prerequisites: [4],
    inputs: ["featureMatrix"],
    outputs: ["correlationMatrix", "primaryCouplings"],
    estimatedDurationMs: 350,
  },
  9: {
    id: 9,
    name: "Attribution & SHAP Explainability",
    category: "SYNTHESIS",
    description:
      "Compute relative feature importance weights and formulate human-readable risk narratives.",
    prerequisites: [7],
    inputs: ["topRiskEntities", "canonicalRecords"],
    outputs: ["entityExplanations", "shapWaterfalls"],
    estimatedDurationMs: 500,
  },
  10: {
    id: 10,
    name: "Actionable Recommendation Synthesis",
    category: "SYNTHESIS",
    description:
      "Synthesize targeted mitigation strategies and rule adjustments based on detected patterns.",
    prerequisites: [7, 9],
    inputs: ["topRiskEntities", "entityExplanations"],
    outputs: ["recommendations", "suggestedRules"],
    estimatedDurationMs: 450,
  },
  11: {
    id: 11,
    name: "Dashboard Metric & Time-Series Synthesis",
    category: "SYNTHESIS",
    description:
      "Aggregate time-bucketed event counts, anomaly spikes, and risk distributions for instant UI visualization.",
    prerequisites: [7, 8],
    inputs: ["canonicalRecords", "topRiskEntities"],
    outputs: ["timeSeriesAggregates", "dashboardCards"],
    estimatedDurationMs: 350,
  },
  12: {
    id: 12,
    name: "Cryptographic Audit & Report Finalization",
    category: "SYNTHESIS",
    description:
      "Generate deterministic SHA-256 execution verification hash and seal the tamper-evident audit record.",
    prerequisites: [10, 11],
    inputs: ["allStageOutputs"],
    outputs: ["verificationHash", "sealedReportSummary", "completedAt"],
    estimatedDurationMs: 250,
  },
};
