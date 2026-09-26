/**
 * TEST HARNESS: Macro-Batch 3 (Phases P21 to P30)
 * Evaluates KPI Intelligence, Context Compiler, AI Gateway Router, Copilot Context,
 * Specialist Agent Runtime, Tool Broker, Skill Sandbox, Connector Fabric,
 * Action Transaction Engine, and Postcondition Verification Engine.
 */

import { KpiIntelligenceEngine } from "./src/services/intelligence/kpiIntelligenceEngine.ts";
import { ContextCompiler } from "./src/services/intelligence/contextCompiler.ts";
import { AiGatewayRouter } from "./src/services/intelligence/aiGatewayRouter.ts";
import { CopilotContextArchitecture } from "./src/services/intelligence/copilotContextArchitecture.ts";
import { SpecialistAgentRuntime } from "./src/services/intelligence/specialistAgentRuntime.ts";
import { ToolBrokerEngine } from "./src/services/intelligence/toolBrokerEngine.ts";
import { SkillSandboxEngine } from "./src/services/intelligence/skillSandboxEngine.ts";
import { ConnectorFabricEngine } from "./src/services/intelligence/connectorFabricEngine.ts";
import { ActionTransactionEngine } from "./src/services/intelligence/actionTransactionEngine.ts";
import { PostconditionVerificationEngine } from "./src/services/intelligence/postconditionVerificationEngine.ts";

console.log("================================================================================");
console.log("  VYRON GOD MODE vNEXT — MACRO-BATCH 3 VERIFICATION (P21 - P30)");
console.log("================================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

try {
  // P21: KPI Intelligence Engine
  console.log("--- P21: KPI Intelligence Engine ---");
  const healthIndex = KpiIntelligenceEngine.calculateHealthIndex({
    codeHealth: 92,
    architectureHealth: 95,
    operationalHealth: 88,
    securityHealth: 100
  });
  assert(healthIndex.compositeScore >= 90, `Composite health index is optimal: ${healthIndex.compositeScore}`);
  assert(healthIndex.rating === "OPTIMAL", "Rating classified as OPTIMAL");

  // P22: Context Compiler
  console.log("\n--- P22: Context Compiler ---");
  const testChunks = [
    { id: "c1", priority: "LOW_FILE_SURROUND", content: "background code context", estimatedTokens: 500 },
    { id: "c2", priority: "CRITICAL_EVIDENCE", content: "sha256:abc1234 failure trace", estimatedTokens: 200 },
    { id: "c3", priority: "HIGH_ADR", content: "ADR-004 boundary contract", estimatedTokens: 300 }
  ];
  const compiled = ContextCompiler.compileContext(testChunks, 600);
  assert(compiled.includedChunks.some((c) => c.priority === "CRITICAL_EVIDENCE"), "Critical evidence prioritized in token budget");
  assert(compiled.droppedChunkIds.includes("c1"), "Low priority file surround dropped when budget constrained");

  // P23: AI Gateway Router
  console.log("\n--- P23: AI Gateway Router ---");
  const advancedRoute = AiGatewayRouter.routeTask("HIGH_REASONING", 2000);
  assert(advancedRoute.selectedModel.tier === "ADVANCED_REASONING", "Complex task routed to Advanced Reasoning model tier");
  const fastRoute = AiGatewayRouter.routeTask("FAST_LOOKUP", 500);
  assert(fastRoute.selectedModel.tier === "LOW_LATENCY_EXACT", "Fast lookup routed to Low Latency model tier");

  // P24: Grounded Copilot Context Architecture
  console.log("\n--- P24: Grounded Copilot Context Architecture ---");
  const sanitized = CopilotContextArchitecture.sanitizeModelOutput("Hello <think>secret thoughts</think> World!");
  assert(sanitized === "Hello  World!", "<think> reasoning scratchpad tags successfully sanitized");
  const groundedContext = CopilotContextArchitecture.buildGroundedContext("Show architecture status");
  assert(groundedContext.truthAnchors.length >= 3, "Authoritative truth anchors injected into copilot context");

  // P25: Specialist Agent Runtime
  console.log("\n--- P25: Specialist Agent Runtime ---");
  const specialists = SpecialistAgentRuntime.getSpecialists();
  assert(specialists.length === 10, "Specialist runtime orchestrates exactly 10 domain specialists");
  const codeJob = SpecialistAgentRuntime.dispatchJob("CODE_HEALTH_SPECIALIST", "COMPUTE_CCN", { file: "test.ts" });
  assert(codeJob.status === "COMPLETED", "Allowed task completed by Code Health Specialist");
  const illegalJob = SpecialistAgentRuntime.dispatchJob("CODE_HEALTH_SPECIALIST", "DEPLOY_PRODUCTION", {});
  assert(illegalJob.status === "REJECTED_OUT_OF_BOUNDS", "Disallowed action rejected by specialist CANNOT boundary");

  // P26: Tool Broker Engine
  console.log("\n--- P26: Tool Broker Engine ---");
  const readTool = ToolBrokerEngine.executeTool("ast_scan", { path: "src" }, 0);
  assert(readTool.isExecuted === true, "Read-only tool executed at authority level 0");
  const prodToolBlocked = ToolBrokerEngine.executeTool("deploy_production", {}, 1);
  assert(prodToolBlocked.isExecuted === false, "Production deployment tool blocked for insufficient authority level");

  // P27: Skill Sandbox Engine
  console.log("\n--- P27: Skill Sandbox Engine ---");
  const validSkill = SkillSandboxEngine.validateSkill({
    id: "skill-ast-metrics",
    name: "AST Metrics Scanner",
    version: "1.0.0",
    description: "Computes AST cyclomatic complexity",
    sourceCode: "export function analyze() { return 42; }",
    requiredAuthorityLevel: 1
  });
  assert(validSkill.isFullyCertified === true, "Valid custom skill passes 9-stage sandbox verification");
  const maliciousSkill = SkillSandboxEngine.validateSkill({
    id: "skill-eval-bad",
    name: "Eval Skill",
    version: "1.0.0",
    description: "Bad skill",
    sourceCode: "eval('process.exit(1)');",
    requiredAuthorityLevel: 1
  });
  assert(maliciousSkill.isQuarantined === true, "Dynamic code execution (eval) skill quarantined at Stage 2");

  // P28: Connector Fabric Engine
  console.log("\n--- P28: Connector Fabric Engine ---");
  const allConnectors = ConnectorFabricEngine.getAllConnectors();
  assert(allConnectors.length >= 5, "Connector fabric registers external integrations");
  const quarantinedConnectors = ConnectorFabricEngine.getQuarantinedConnectors();
  assert(quarantinedConnectors.length === 2, "Connector fabric explicitly tracks 2 quarantined external blockers");

  // P29: Action Transaction Engine
  console.log("\n--- P29: Action Transaction Engine ---");
  const tx = ActionTransactionEngine.stageTransaction("MUTATE_CONFIG", { timeout: 5000 }, { timeout: 3000 });
  assert(tx.phase === "STAGED", "Transaction successfully staged in 2PC engine");
  const committed = ActionTransactionEngine.commitTransaction(tx.txId, { timeout: 5000 });
  assert(committed.success === true && committed.tx.phase === "COMMITTED", "Transaction committed with snapshot verification");
  const rollTx = ActionTransactionEngine.stageTransaction("FAIL_ACTION", {}, {});
  const rolledBack = ActionTransactionEngine.rollbackTransaction(rollTx.txId, "Postcondition failed");
  assert(rolledBack.success === true, "Rollback reverted transaction to pre-execution snapshot");

  // P30: Postcondition Verification Engine
  console.log("\n--- P30: Postcondition Verification Engine ---");
  const proof = PostconditionVerificationEngine.verifyAction({
    actionId: "ACT-999",
    expectedStateMutated: true,
    zeroRawSqlConfirmed: true,
    preHealthScore: 95,
    postHealthScore: 94,
    testSuitePassRatio: 1.0
  });
  assert(proof.isVerified === true, "Postcondition verification engine generates verified proof node");
  assert(proof.evidenceNodeId.startsWith("ev_"), "Verification generates cryptographic evidence node in fabric");

} catch (err) {
  console.error("Test execution threw exception:", err);
  failed++;
}

console.log("\n================================================================================");
console.log(`MACRO-BATCH 3 RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
