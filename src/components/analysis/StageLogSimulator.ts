/**
 * PROJECT BRAHMA — STAGE LOG SIMULATOR (PHASE L.2, FL-01-D)
 * Emits realistic high-velocity log lines across the 8 analysis stages.
 */

import { LogEntry, LogSeverity } from "@/components/analysis/AnalysisLogStream";

const STAGE_LOGS: Record<string, { message: string; severity: LogSeverity }[]> = {
  "Cloning": [
    { message: "Initialized git transport protocol over TLS 1.3.", severity: "info" },
    { message: "Enumerating remote repository objects: 428 objects received.", severity: "info" },
    { message: "Verifying cryptographic SHA-256 tree integrity.", severity: "success" },
    { message: "Checked out target branch 'main' (commit e3b0c442).", severity: "info" },
  ],
  "AST Scan": [
    { message: "Discovered 42 Python source modules in finledger/ directory.", severity: "info" },
    { message: "Parsing AST grammar tokens via Tree-sitter Python runtime.", severity: "info" },
    { message: "Computing McCabe cyclomatic complexity numbers (CCN).", severity: "info" },
    { message: "WARNING: finledger/payment/processor.py CCN=34 exceeds threshold 15.", severity: "warning" },
    { message: "WARNING: finledger/risk/engine.py CCN=29 exceeds threshold 15.", severity: "warning" },
    { message: "AST tree parsing completed across 14,890 lines of code.", severity: "success" },
  ],
  "Security": [
    { message: "Launching Bandit security ruleset against target codebase.", severity: "info" },
    { message: "CRITICAL: B106 hardcoded password parameter detected in auth/token_manager.py:48.", severity: "critical" },
    { message: "CRITICAL: B101 assert statement used in security-sensitive path in payment/processor.py:210.", severity: "critical" },
    { message: "CRITICAL: B303 insecure MD5 hashing in ledger/hash_chain.py:38.", severity: "critical" },
    { message: "Auditing dependency manifest against National Vulnerability Database (NVD).", severity: "info" },
    { message: "Security scan completed: 8 HIGH, 24 MEDIUM findings flagged.", severity: "warning" },
  ],
  "Gates": [
    { message: "Evaluating Gate 1 (Security): Score 45 / Threshold 80 -> FAIL", severity: "critical" },
    { message: "Evaluating Gate 2 (AST Complexity): Score 61 / Threshold 70 -> FAIL", severity: "critical" },
    { message: "Evaluating Gate 3 (Test Coverage): Score 72 / Threshold 70 -> PASS", severity: "success" },
    { message: "Evaluating Gate 4 (Schema Invariants): Score 100 / Threshold 90 -> PASS", severity: "success" },
    { message: "Evaluating Gate 5 (Documentation & Provenance): Score 81 / Threshold 75 -> PASS", severity: "success" },
    { message: "Evaluating Gate 6 (Performance & SLA): Score 77 / Threshold 75 -> PASS", severity: "success" },
    { message: "Evaluating Gate 7 (Licensure): Score 100 / Threshold 100 -> PASS", severity: "success" },
    { message: "Architectural Gate Evaluation Finished: RELEASE BLOCKED (2 Gates Failed).", severity: "critical" },
  ],
  "Complete": [
    { message: "Compiling consolidated engineering SRS report bundle.", severity: "info" },
    { message: "Generating cryptographic artifact provenance checksums.", severity: "info" },
    { message: "Analysis pipeline execution complete. Telemetry persisted.", severity: "success" },
  ],
};

export function getLogsForStage(stageName: string): LogEntry[] {
  const templates = STAGE_LOGS[stageName] || [
    { message: `Processing stage: ${stageName}`, severity: "info" },
  ];

  return templates.map((t, idx) => ({
    id: `log-${stageName.toLowerCase()}-${Date.now()}-${idx}`,
    timestamp: new Date().toISOString(),
    stageName,
    message: t.message,
    severity: t.severity,
  }));
}
