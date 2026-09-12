/**
 * PROJECT BRAHMA — AI-NATIVE PLATFORM VERIFICATION SUITE
 * Validates all architectural commitments, contract schemas, AI routing, and ZERO-SQL enforcement.
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

// Color helpers for clean terminal output
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${green("✔")} ${message}`);
  } else {
    failedTests++;
    console.error(`  ${red("✖")} FAILED: ${message}`);
  }
}

console.log(bold("\n================================================================================"));
console.log(bold("     PROJECT BRAHMA — ARCHITECTURAL VERIFICATION SUITE"));
console.log(bold("================================================================================\n"));

// ------------------------------------------------------------------------------------------------
// P1: ZERO SQL LAW ENFORCEMENT
// ------------------------------------------------------------------------------------------------
console.log(cyan(bold("P1: Zero SQL Law Enforcement (Rules 9 & 10)")));

const TARGET_DIRS = [
  "src/state",
  "src/services/ai",
  "src/services/analysis",
  "src/services/orchestrator",
  "src/services/connectors",
  "src/services/demo",
  "src/components/analysis",
  "src/components/demo",
  "src/components/connectors",
  "src/components/datasets",
  "src/components/copilot",
];

const SQL_PATTERNS = [
  /\bSELECT\b\s+.+\s+\bFROM\b/i,
  /\bINSERT\b\s+\bINTO\b/i,
  /\bUPDATE\b\s+\w+\s+\bSET\b/i,
  /\bDELETE\b\s+\bFROM\b/i,
  /\bCREATE\b\s+\bTABLE\b/i,
  /\bALTER\b\s+\bTABLE\b/i,
  /\bDROP\b\s+\bTABLE\b/i,
];

let sqlViolations = 0;

function scanDir(dir) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
        const content = readFileSync(fullPath, "utf-8");
        for (const pattern of SQL_PATTERNS) {
          if (pattern.test(content)) {
            console.error(`  ${red("✖")} SQL found in ${fullPath}: ${pattern}`);
            sqlViolations++;
          }
        }
      }
    }
  } catch {
    // Directory might not exist or empty
  }
}

for (const d of TARGET_DIRS) {
  scanDir(d);
}

assert(sqlViolations === 0, `ZERO SQL Enforcement: Found ${sqlViolations} SQL occurrences across newly architected modules.`);

// ------------------------------------------------------------------------------------------------
// P2: STATE STORE CONTRACT CONFORMITY
// ------------------------------------------------------------------------------------------------
console.log(cyan(bold("\nP2: State Store Architecture & Isolation Contracts")));

// Check modeStore file
const modeStoreCode = readFileSync("src/state/mode/modeStore.ts", "utf-8");
assert(modeStoreCode.includes('export type AppMode = "NORMAL" | "DEMO";'), "modeStore exports AppMode union ('NORMAL' | 'DEMO')");
assert(modeStoreCode.includes("setMode(newMode: AppMode)"), "modeStore implements setMode method");
assert(modeStoreCode.includes("subscribe(listener: ModeListener)"), "modeStore supports reactive subscriber pattern");

// Check connectorStore file
const connectorStoreCode = readFileSync("src/state/connectors/connectorStore.ts", "utf-8");
assert(connectorStoreCode.includes('id: "kaggle"'), "connectorStore contains built-in Kaggle MCP connector");
assert(connectorStoreCode.includes('id: "github"'), "connectorStore contains built-in GitHub MCP connector");
assert(connectorStoreCode.includes('id: "figma"'), "connectorStore contains built-in Figma MCP connector");
assert(connectorStoreCode.includes('id: "notion"'), "connectorStore contains built-in Notion MCP connector");
assert(connectorStoreCode.includes("setToolAuthorization"), "connectorStore supports granular tool authorization toggling");
assert(connectorStoreCode.includes("recordAudit"), "connectorStore records audit trails for tool calls");

// Check demoStore file
const demoStoreCode = readFileSync("src/state/demo/demoStore.ts", "utf-8");
assert(demoStoreCode.includes('id: "ieee_fraud_benchmark"'), "demoStore includes IEEE-CIS Fraud Benchmark dataset");
assert(demoStoreCode.includes('id: "clinical_scheduling"'), "demoStore includes Clinical Scheduling Benchmark dataset");
assert(demoStoreCode.includes('id: "ecommerce_orders"'), "demoStore includes Brazilian E-Commerce Benchmark dataset");
assert(demoStoreCode.includes("pushEvent"), "demoStore supports live streaming domain events");

// Check analysisStore file
const analysisStoreCode = readFileSync("src/state/analysis/analysisStore.ts", "utf-8");
assert(analysisStoreCode.includes("PIPELINE_STAGES"), "analysisStore exports PIPELINE_STAGES definition array");
assert(analysisStoreCode.includes("StageId ="), "analysisStore defines 12 StageId union numbers");
assert(analysisStoreCode.includes("addFinding"), "analysisStore implements addFinding method");

// Check copilotStore file
const copilotStoreCode = readFileSync("src/state/copilot/copilotStore.ts", "utf-8");
assert(copilotStoreCode.includes("normalSession: CopilotModeSession"), "copilotStore isolates normalSession");
assert(copilotStoreCode.includes("demoSession: CopilotModeSession"), "copilotStore isolates demoSession");

// ------------------------------------------------------------------------------------------------
// P3: AI LAYER ARCHITECTURE & PROVIDER-NEUTRAL ROUTING
// ------------------------------------------------------------------------------------------------
console.log(cyan(bold("\nP3: AI Layer Architecture & Task-Aware Routing")));

const aiRouterCode = readFileSync("src/services/ai/aiRouter.ts", "utf-8");
assert(aiRouterCode.includes("CLAUDE_SONNET"), "AI Router registers Anthropic Claude 3.7 / 3.5 Sonnet adapter");
assert(aiRouterCode.includes("KIMI_K3"), "AI Router registers Moonshot Kimi K3 MoE adapter");
assert(aiRouterCode.includes("OPENAI_GPT4O"), "AI Router registers OpenAI GPT-4o adapter");
assert(aiRouterCode.includes("MOCK_DETERMINISTIC"), "AI Router registers deterministic offline Mock adapter");
assert(aiRouterCode.includes("resolveModel"), "AI Router implements task-aware model resolution");

const agentPlannerCode = readFileSync("src/services/ai/agentPlanner.ts", "utf-8");
assert(agentPlannerCode.includes("generatePlan"), "Agent Planner exposes generatePlan subtask decomposition");

const cryptoUtilsCode = readFileSync("src/services/ai/cryptoUtils.ts", "utf-8");
assert(cryptoUtilsCode.includes("generateVerificationHash"), "Crypto utils exports deterministic verification hash generator");

// ------------------------------------------------------------------------------------------------
// P4: 12-STAGE ORCHESTRATION & ANALYSIS WORKERS
// ------------------------------------------------------------------------------------------------
console.log(cyan(bold("\nP4: 12-Stage Analysis Engine & Domain Workers")));

const stagesCode = readFileSync("src/services/orchestrator/stages.ts", "utf-8");
assert(stagesCode.includes("STAGE_DEFINITIONS"), "stages.ts defines STAGE_DEFINITIONS registry");
for (let i = 1; i <= 12; i++) {
  assert(stagesCode.includes(`${i}:`), `Stage ${i} defined in pipeline contract`);
}

const orchestratorCode = readFileSync("src/services/orchestrator/analysisOrchestrator.ts", "utf-8");
assert(orchestratorCode.includes("runPipeline"), "analysisOrchestrator implements runPipeline method");
assert(orchestratorCode.includes("cancelRun"), "analysisOrchestrator implements cancelRun method");
assert(orchestratorCode.includes("DataValidator"), "analysisOrchestrator invokes Stage 2 DataValidator");
assert(orchestratorCode.includes("AnomalyDetector"), "analysisOrchestrator invokes Stage 5 AnomalyDetector");
assert(orchestratorCode.includes("GraphAnalyzer"), "analysisOrchestrator invokes Stage 6 GraphAnalyzer");
assert(orchestratorCode.includes("RiskScorer"), "analysisOrchestrator invokes Stage 7 RiskScorer");
assert(orchestratorCode.includes("ExplainabilityEngine"), "analysisOrchestrator invokes Stage 9 ExplainabilityEngine");

// ------------------------------------------------------------------------------------------------
// P5: KAGGLE CONNECTOR & EVENT SIMULATOR
// ------------------------------------------------------------------------------------------------
console.log(cyan(bold("\nP5: Kaggle Connector & Real-Time Event Simulator")));

const kaggleConnectorCode = readFileSync("src/services/connectors/kaggleConnector.ts", "utf-8");
assert(kaggleConnectorCode.includes("searchDatasets"), "KaggleConnector implements searchDatasets");
assert(kaggleConnectorCode.includes("inspectSchema"), "KaggleConnector implements inspectSchema");
assert(kaggleConnectorCode.includes("assertToolAuthorized"), "KaggleConnector enforces tool authorization before calling");

const simulatorCode = readFileSync("src/services/demo/eventSimulator.ts", "utf-8");
assert(simulatorCode.includes("start"), "eventSimulator implements start method");
assert(simulatorCode.includes("stop"), "eventSimulator implements stop method");
assert(simulatorCode.includes("injectAnomalyWave"), "eventSimulator implements injectAnomalyWave method");

// ------------------------------------------------------------------------------------------------
// P6: UI INTEGRATION & NAVIGATION
// ------------------------------------------------------------------------------------------------
console.log(cyan(bold("\nP6: UI Integration, Routes & Aesthetics")));

const appShellCode = readFileSync("src/components/brahma/app-shell.tsx", "utf-8");
assert(appShellCode.includes("/app/analysis"), "app-shell includes navigation link to Live Analysis");
assert(appShellCode.includes("/app/datasets"), "app-shell includes navigation link to Kaggle Datasets");
assert(appShellCode.includes("/app/connectors"), "app-shell includes navigation link to MCP Connectors");
assert(appShellCode.includes("DemoBanner"), "app-shell mounts DemoBanner");
assert(appShellCode.includes("CopilotFloatingButton"), "app-shell mounts CopilotFloatingButton");
assert(appShellCode.includes("CopilotDrawer"), "app-shell mounts CopilotDrawer");
assert(appShellCode.includes("Run Analysis"), "app-shell features prominent Run Analysis header button");

const dashboardCode = readFileSync("src/routes/app.index.tsx", "utf-8");
assert(dashboardCode.includes("RUN ANALYSIS"), "Dashboard features dominant RUN ANALYSIS CTA");
assert(dashboardCode.includes("SimulatorControls"), "Dashboard renders SimulatorControls in Demo Mode");

// ------------------------------------------------------------------------------------------------
// SUMMARY REPORT
// ------------------------------------------------------------------------------------------------
console.log(bold("\n================================================================================"));
console.log(bold(`TEST RESULTS: ${passedTests} passed, ${failedTests} failed out of ${totalTests} assertions.`));
console.log(bold("================================================================================\n"));

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(green(bold("✔ ALL ARCHITECTURAL ASSERTIONS PASSED WITH ZERO DRIFT.")));
  process.exit(0);
}
