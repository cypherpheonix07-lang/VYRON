/**
 * PROJECT BRAHMA — DEMO GATE RESULTS (FL-02-B STEP 3)
 * Seeded validation metrics across all 7 architectural gates.
 * Enforces RELEASE BLOCKED due to Gate 1 (Security) and Gate 2 (AST Complexity) failures.
 */

import { GateResultData } from "@/components/ui/GateCard";

export interface DemoReleaseSummary {
  status: "RELEASE BLOCKED" | "RELEASE READY" | "ADVISORY WARNING";
  blockedGateCount: number;
  passedGateCount: number;
  totalGates: number;
  evaluatedAt: string;
  gates: GateResultData[];
}

export const DEMO_GATE_RESULTS: GateResultData[] = [
  {
    gate_id: 1,
    gate_name: "Security & Vulnerability Gate",
    passed: false,
    score: 45,
    threshold: 80,
    evidence: "8 HIGH severity findings detected (Hardcoded secrets, plaintext PAN logging, untrusted pickle deserialization).",
    recommendation: "Remediate all 8 HIGH Bandit findings before deploying to production.",
  },
  {
    gate_id: 2,
    gate_name: "AST & Structural Complexity Gate",
    passed: false,
    score: 61,
    threshold: 70,
    evidence: "Avg CCN 18.3, threshold 15.0. 15 functions exceed max cyclomatic bounds (peak CCN 34 in settlement).",
    recommendation: "Refactor `process_multi_currency_settlement` and `evaluate_transaction_risk` into pipeline stages.",
  },
  {
    gate_id: 3,
    gate_name: "Test Coverage & Mutation Gate",
    passed: true,
    score: 72,
    threshold: 70,
    evidence: "Unit test line coverage 78.4%, mutation kill rate 72.1% across 142 test specs.",
    recommendation: "Maintain test suites above 70% threshold.",
  },
  {
    gate_id: 4,
    gate_name: "Schema & Contract Invariant Gate",
    passed: true,
    score: 100,
    threshold: 90,
    evidence: "100% adherence to OpenAPI 3.1 schema specs and Postgres DDL foreign key constraints.",
    recommendation: null,
  },
  {
    gate_id: 5,
    gate_name: "Documentation & Provenance Gate",
    passed: true,
    score: 81,
    threshold: 75,
    evidence: "Complete docstrings and cryptographic SHA-256 provenance hashes generated for all architecture artifacts.",
    recommendation: null,
  },
  {
    gate_id: 6,
    gate_name: "Performance & SLA Resilience Gate",
    passed: true,
    score: 77,
    threshold: 75,
    evidence: "P99 latency measured at 24.2ms (< 25.0ms SLA target) under 2000 rps load profile.",
    recommendation: "Monitor memory allocation during sliding window velocity calculations.",
  },
  {
    gate_id: 7,
    gate_name: "Licensure & Supply Chain Gate",
    passed: true,
    score: 100,
    threshold: 100,
    evidence: "All 38 third-party dependencies carry permissible MIT / Apache 2.0 / BSD licenses. Zero GPL contamination.",
    recommendation: null,
  },
];

export const DEMO_RELEASE_SUMMARY: DemoReleaseSummary = {
  status: "RELEASE BLOCKED",
  blockedGateCount: 2,
  passedGateCount: 5,
  totalGates: 7,
  evaluatedAt: "2026-09-10T14:23:00Z",
  gates: DEMO_GATE_RESULTS,
};
