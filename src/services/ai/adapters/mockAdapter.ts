/**
 * PROJECT BRAHMA — DETERMINISTIC MOCK AI ADAPTER
 * Generates verified, reproducible analytics reasoning and tool calls without external network dependencies.
 * Used for Demo Mode and offline development.
 */

import { AIAdapter, AICompletionRequest, AICompletionResponse } from "../types";
import { generateVerificationHash } from "../cryptoUtils";

export class MockAIAdapter implements AIAdapter {
  public id = "MOCK_DETERMINISTIC" as const;
  public providerName = "MOCK" as const;

  public isAvailable(): boolean {
    return true;
  }

  public async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const startTime = Date.now();
    const lastUserMessage = request.messages.filter((m) => m.role === "user").pop()?.content || "";
    const lower = lastUserMessage.toLowerCase();

    let textResponse = "";
    let toolCalls = undefined;

    if (lower.includes("drift") || lower.includes("ast") || lower.includes("boundary violation")) {
      textResponse =
        `**Brahma Architecture Drift Analysis [Blueprint vs AST Reality]**\n\n` +
        `• **Evaluated Modules**: 14 declared blueprint services against repository AST.\n` +
        `• **Drift Findings Detected**: 3 structural violations:\n` +
        `  - \`MISSING_COMPONENT\`: Service \`srv-settlement\` declared in blueprint but missing from repository implementation.\n` +
        `  - \`UNAUTHORIZED_DEPENDENCY\`: Package \`pyjwt@2.8.0\` detected without architectural policy sign-off.\n` +
        `  - \`BOUNDARY_VIOLATION\`: Service \`srv-auth\` communicates directly with \`srv-ledger\` bypassing settlement gateway.\n` +
        `• **Confidence**: 98.4% AST parser resolution with zero AST parsing ambiguity.\n` +
        `• **Remediation Recommendation**: Isolate payment gateway boundary and scaffold missing settlement engine.`;
      if (request.tools && request.tools.some((t) => t.name === "detect_architecture_drift")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "detect_architecture_drift",
            arguments: { projectId: "proj-brahma", saveSnapshot: true },
          },
        ];
      }
    } else if (lower.includes("impact") || lower.includes("blast radius") || lower.includes("transitive")) {
      textResponse =
        `**Brahma Change Impact Engine [Blast Radius Analysis]**\n\n` +
        `• **Scope**: Modification to \`src/services/settlementEngine.ts\` and API contracts.\n` +
        `• **Direct Impact**: 4 source modules, 2 API endpoints (\`POST /v1/settlements\`, \`GET /v1/settlements/:id\`).\n` +
        `• **Transitive Blast Radius**: 3 dependent services (\`srv-billing\`, \`srv-reporting\`, \`srv-audit\`).\n` +
        `• **Test Invalidation**: Invalidates 2 test suites (\`test_settlement_idempotency.py\`, \`test_audit_trail.py\`).\n` +
        `• **Release Blocker**: Blocker detected on Gate G4 (Deterministic Verification).\n` +
        `• **Recommended Review Order**: 1. Settlement Engine -> 2. Invalidation Tests -> 3. Idempotency Keys.`;
      if (request.tools && request.tools.some((t) => t.name === "analyze_change_impact")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "analyze_change_impact",
            arguments: { changedFile: "src/services/settlementEngine.ts" },
          },
        ];
      }
    } else if (lower.includes("mission") || lower.includes("review project") || lower.includes("release review") || lower.includes("objective")) {
      textResponse =
        `**Brahma Engineering Mission Coordinator [Autonomous Goal Execution]**\n\n` +
        `• **Mission Objective**: Pre-Release Architecture & Verification Audit.\n` +
        `• **Task Breakdown**:\n` +
        `  1. \`Step 1\`: Scan Architecture & Detect Drift (Specialist: \`DATA_QUALITY\`)\n` +
        `  2. \`Step 2\`: Analyze Security CWEs & AST Findings (Specialist: \`SECURITY_ANALYST\`)\n` +
        `  3. \`Step 3\`: Synthesize Verification Report & Cryptographic Integrity Seal (Specialist: \`REPORT_GENERATOR\`)\n` +
        `• **Audit Verification**: Mission created with SHA-256 evidence chain and operator approval checkpoints.`;
      if (request.tools && request.tools.some((t) => t.name === "start_engineering_mission")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "start_engineering_mission",
            arguments: { title: "Pre-Release Verification Mission", objective: "Audit architecture drift and release gates" },
          },
        ];
      }
    } else if (lower.includes("time machine") || lower.includes("health drop") || lower.includes("why did health") || lower.includes("regression")) {
      textResponse =
        `**Brahma Engineering Time Machine [Historical Regression Analysis]**\n\n` +
        `• **Regression Root Cause**: Project health declined from 94 to 78 starting at Commit \`c-789a1b\` ('Refactor settlement retry loop').\n` +
        `• **Deterioration Factors**:\n` +
        `  - Test coverage dropped by 14% due to un-implemented settlement retry requirement.\n` +
        `  - Hardcoded secret string introduced in \`authService.ts\` triggering CWE-798 alert.\n` +
        `  - Circular dependency introduced between \`srv-auth\` and \`srv-ledger\`.\n` +
        `• **Confidence**: 96.7% deterministic correlation across historical health snapshots.`;
      if (request.tools && request.tools.some((t) => t.name === "compare_time_machine_snapshots")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "compare_time_machine_snapshots",
            arguments: { baseSnapshotId: "snap-baseline", targetSnapshotId: "snap-regression" },
          },
        ];
      }
    } else if (lower.includes("policy") || lower.includes("release gate") || lower.includes("blocking") || lower.includes("exception")) {
      textResponse =
        `**Brahma Policy Engine [Release Gate Evaluation]**\n\n` +
        `• **Evaluation Result**: 5 of 7 release gates passing. 2 blocking violations detected:\n` +
        `  - \`POL-SEC-01\`: Unresolved High-Severity Security finding (CWE-89 SQL query string builder).\n` +
        `  - \`POL-ARCH-02\`: Architecture drift detected without approved exception grant.\n` +
        `• **Active Exceptions**: 0 active exception grants on record.\n` +
        `• **Remediation**: Resolve blocking CWE-89 finding or submit formal exception with cryptographic authorization.`;
      if (request.tools && request.tools.some((t) => t.name === "evaluate_engineering_policies")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "evaluate_engineering_policies",
            arguments: { releaseCandidate: "rc-2.0" },
          },
        ];
      }
    } else if (lower.includes("simulation") || lower.includes("scenario") || lower.includes("lab")) {
      textResponse =
        `**Brahma Engineering Simulation Lab [Scenario State]**\n\n` +
        `• **Active Scenario**: Scenario 01 — Architecture Drift & Boundary Violation.\n` +
        `• **Simulated Anomalies**: Missing settlement component, AST boundary drift, and synthetic transaction velocity deviations.\n` +
        `• **Isolation Guarantee**: Zero live database mutations; state isolated to in-memory session.\n` +
        `• **Controls**: You can switch scenarios or reset the simulation back to pristine baseline at any time.`;
      if (request.tools && request.tools.some((t) => t.name === "run_simulation_scenario")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "run_simulation_scenario",
            arguments: { scenarioId: "SCENARIO_01_DRIFT" },
          },
        ];
      }
    } else if (lower.includes("fraud") || lower.includes("anomaly") || lower.includes("iqr")) {
      textResponse =
        `**Brahma Anomaly Engine [SHAP Analysis & IQR Scoring]**\n\n` +
        `• **Evaluated Records**: 12,480 live transactions across the IEEE-CIS benchmark.\n` +
        `• **High-Risk Anomalies Detected**: 18 transactions deviated by >3.5 standard deviations from median velocity.\n` +
        `• **Primary Attribution**: IP-country mismatch combined with transaction velocity spike (0.87 SHAP importance weight).\n` +
        `• **Recommended Action**: Enable step-up biometric MFA on entity cluster \`ENT-US-9921\` and throttle burst carding attempts.`;
    } else if (lower.includes("risk") || lower.includes("score")) {
      textResponse =
        `**Composite Multi-Factor Risk Assessment**\n\n` +
        `• **Overall Risk Index**: 78.4 / 100 [HIGH ALERT]\n` +
        `• **Factor Breakdown**:\n` +
        `  - Velocity Risk: 92/100 (Unusually short interval between successive checkout events)\n` +
        `  - Geographic Drift: 81/100 (Cross-continental IP jump in < 8 minutes)\n` +
        `  - Device Fingerprint Entropy: 65/100 (Canvas hash rotation detected)\n` +
        `• **Confidence**: 94.2% based on cross-validated isolation forest ensemble.`;
    } else if (
      lower.includes("schema") ||
      lower.includes("contract") ||
      lower.includes("validation")
    ) {
      textResponse =
        `**Data Quality & Contract Verification**\n\n` +
        `• **Target**: Canonical IEEE-CIS Dataset Schema\n` +
        `• **Conformity Score**: 99.8% (0 critical null violations)\n` +
        `• **Type Strictness**: All numeric columns verified within float64 bounds.\n` +
        `• **Drift Check**: Distribution drift is within acceptable tolerance (+0.04 Kolmogorov-Smirnov metric).`;
    } else if (lower.includes("run") || lower.includes("analysis") || lower.includes("pipeline")) {
      textResponse =
        `**Pipeline Orchestration Ready**\n\n` +
        `I have prepared the 12-stage analysis pipeline for execution. All data contracts and Kaggle connectors are verified. ` +
        `You can trigger the pipeline directly using the **RUN ANALYSIS** control.`;
      if (request.tools && request.tools.some((t) => t.name === "trigger_analysis")) {
        toolCalls = [
          {
            id: `call_${Date.now()}`,
            name: "trigger_analysis",
            arguments: { datasetId: "ieee_fraud_benchmark", depth: "COMPREHENSIVE" },
          },
        ];
      }
    } else if (
      lower.includes("demo scenario") ||
      lower.includes("explain current demo") ||
      lower.includes("current demo scenario") ||
      lower.includes("demo mode")
    ) {
      textResponse =
        `**Vyron Demo Copilot — Active Simulation Narration**\n\n` +
        `• **Active Scenario**: Financial Fraud & High-Velocity Carding Benchmark (IEEE-CIS Partition)\n` +
        `• **Telemetry Overview**: 12,480 synthetic transactions with 18 simulated anomalies\n` +
        `• **Top Detected Anomaly**: Transaction \`TX-98421\` ($4,250.00, Card1: 13926, Country mismatch, Velocity Z-score: +4.2)\n` +
        `• **Simulation Safeguard**: All events run strictly in client \`sessionStorage\`. Production database tables are 100% isolated.\n` +
        `• **Reviewer Recommended Actions**:\n` +
        `  1. Click **Inject Anomaly Surge** to test dynamic IQR sensitivity.\n` +
        `  2. Click **Run 12-Stage Pipeline** to observe real-time progress and cryptographic audit report sealing.\n` +
        `  3. Click **Reset Demo** to return to clean baseline at any time.`;
    } else if (lower.includes("plugin")) {
      textResponse =
        `**Vyron Plugin Registry & Capability Center**\n\n` +
        `• **Registered Manifests**: 5 enterprise plugins active in registry:\n` +
        `  1. \`analysis-plugin\` [ACTIVE]: 12-stage pipeline triggers and stage telemetry.\n` +
        `  2. \`chat-plugin\` [ACTIVE]: Contextual Copilot dialog and specialist agent dispatch.\n` +
        `  3. \`data-plugin\` [ACTIVE]: Kaggle dataset discovery, schema preview, and contract validation.\n` +
        `  4. \`github-plugin\` [ACTIVE]: Repository AST synchronization, commit analysis, and PR checks.\n` +
        `  5. \`report-plugin\` [ACTIVE]: Cryptographic audit PDF compilation with SHA-256 seals.\n` +
        `• **Lifecycle State**: All plugins enforce typed boundaries, lifecycle toggles, and audit logging.`;
    } else if (lower.includes("connector") || lower.includes("mcp")) {
      textResponse =
        `**Vyron MCP Connector System Governance**\n\n` +
        `• **Configured Connectors**: 5 enterprise adapters under strict governance:\n` +
        `  - \`github\` [CONNECTED]: Read-only repo access, commit verification, branch status.\n` +
        `  - \`kaggle\` [CONNECTED]: Benchmark search, usability rating assessment, schema preview.\n` +
        `  - \`figma\` [CONFIGURED]: Architecture component wireframe synchronization.\n` +
        `  - \`notion\` [CONFIGURED]: SRS requirement and EARS specification ingestion.\n` +
        `  - \`custom_mcp\` [READY]: Extensible model context protocol tool endpoints.\n` +
        `• **Security Model**: Connector tokens are revocable with 1-click. High-impact operations require explicit operator confirmation.`;
    } else if (lower.includes("dataset") || lower.includes("kaggle")) {
      textResponse =
        `**Vyron Dataset Discovery & Compatibility Profile**\n\n` +
        `• **Primary Benchmark**: IEEE-CIS Fraud Detection Benchmark (498MB, Usability 0.94)\n` +
        `• **Alternative Benchmarks**: Brazilian E-Commerce (100k orders), Medical Appointment No-Shows\n` +
        `• **Data Quality Metrics**: Completeness: 98.4%, Uniqueness: 99.8%, Validity: 97.2%, Consistency: 99.0%\n` +
        `• **Pipeline Compatibility**: 100/100 (Full 12-stage support: Amounts, Velocity, IP Graph, IQR, SHAP).`;
    } else {
      textResponse =
        `**Vyron Intelligence Copilot**\n\n` +
        `Analyzing request: "${lastUserMessage.slice(0, 80)}${lastUserMessage.length > 80 ? "..." : ""}"\n\n` +
        `The Vyron live analytics engine is fully synchronized. Available commands:\n` +
        `1. Run 12-stage analysis on current dataset\n` +
        `2. Detect architecture drift against blueprint\n` +
        `3. Analyze change impact & blast radius\n` +
        `4. Launch autonomous engineering missions\n` +
        `5. Evaluate release policies & gates\n` +
        `6. Review detected entity anomalies and SHAP attribution\n` +
        `7. Simulate synthetic fraud surges in Demo Mode`;
    }

    const durationMs = Math.max(80, Date.now() - startTime);
    const hashPayload = `${request.taskType}:${textResponse}:${durationMs}`;
    const verificationHash = generateVerificationHash(hashPayload);

    return {
      model: "MOCK_DETERMINISTIC",
      provider: "MOCK",
      text: textResponse,
      toolCalls,
      usage: {
        promptTokens: Math.round(lastUserMessage.length / 4) + 50,
        completionTokens: Math.round(textResponse.length / 4),
        totalTokens: Math.round((lastUserMessage.length + textResponse.length) / 4) + 50,
      },
      durationMs,
      verificationHash,
    };
  }
}
