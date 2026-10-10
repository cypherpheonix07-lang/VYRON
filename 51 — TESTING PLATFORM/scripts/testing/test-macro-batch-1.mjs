/**
 * TEST HARNESS: Macro-Batch 1 (Phases P01 to P10)
 * Evaluates Audit Reconciliation, Blocker Closure, Readiness Gaps,
 * Product Thesis, User Workflows, Competitive Map, Product Boundary Contract,
 * Canonical Domain Model, Source of Truth Architecture, and Evidence Fabric.
 */

import { SYSTEM_TRUTH_MANIFEST } from "../../../src/config/truthManifest.ts";
import { AuditReconciliationEngine } from "../../../src/services/intelligence/auditReconciliation.ts";
import { BlockerClosureEngine } from "../../../src/services/intelligence/blockerClosureEngine.ts";
import { ProductionReadinessGapEngine } from "../../../src/services/intelligence/productionReadinessGap.ts";
import { ProductThesisContract } from "../../../src/services/intelligence/productContract.ts";
import { UserWorkflowIntelligenceEngine } from "../../../src/services/intelligence/userWorkflowIntelligence.ts";
import { CompetitiveCapabilityEngine } from "../../../src/services/intelligence/competitiveCapabilityMap.ts";
import { ProductBoundaryContract } from "../../../src/services/intelligence/productBoundaryContract.ts";
import { CanonicalDomainModelEngine } from "../../../src/services/intelligence/canonicalDomainModel.ts";
import { SourceOfTruthArchitecture } from "../../../src/services/intelligence/sourceOfTruthArchitecture.ts";
import { EvidenceFabricEngine } from "../../../src/services/intelligence/evidenceFabric.ts";

console.log("================================================================================");
console.log("  VYRON GOD MODE vNEXT — MACRO-BATCH 1 VERIFICATION (P01 - P10)");
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
  // P01: Truth Manifest & Audit Reconciliation
  console.log("--- P01: Truth Manifest & Audit Reconciliation ---");
  assert(SYSTEM_TRUTH_MANIFEST.summary.internallyVerified === 83, "Truth manifest records exactly 83 internally verified capabilities");
  assert(SYSTEM_TRUTH_MANIFEST.summary.externallyBlockedQuarantined === 2, "Truth manifest records exactly 2 quarantined blockers");
  const auditResult = AuditReconciliationEngine.validateTruthLock();
  assert(auditResult.isValid === true, "Audit reconciliation engine confirms truth lock integrity");

  // P02: Blocker Closure Engine
  console.log("\n--- P02: Blocker Closure Engine ---");
  const blockers = BlockerClosureEngine.getQuarantinedBlockers();
  assert(blockers.length === 2, "BlockerClosureEngine manages 2 quarantined external services");
  const supabaseTelemetry = BlockerClosureEngine.recordBlockerAccessAttempt("SUPABASE_CLOUD", false);
  assert(supabaseTelemetry.activeFallbackEngaged === true, "Supabase fallback is engaged upon remote 401 error");

  // P03: Production Readiness Gap Engine
  console.log("\n--- P03: Production Readiness Gap Engine ---");
  const readiness = ProductionReadinessGapEngine.evaluateReadiness();
  assert(readiness.totalGapsTracked > 0, `Production readiness engine tracks ${readiness.totalGapsTracked} gaps`);
  assert(readiness.overallReadinessScore >= 65, `Overall readiness score is calibrated: ${readiness.overallReadinessScore}%`);

  // P04: Product Thesis Contract
  console.log("\n--- P04: Product Thesis Contract ---");
  const jtbds = ProductThesisContract.getJobsToBeDone();
  assert(jtbds.length === 4, "Product thesis contract defines 4 canonical Jobs-To-Be-Done");
  const evalJTBD = ProductThesisContract.evaluateJobCapability("JTBD-01");
  assert(evalJTBD.isSupported === true, "JTBD-01 (Incident to Root Cause) is fully supported");

  // P05: User Workflow Intelligence
  console.log("\n--- P05: User Workflow Intelligence ---");
  const personas = UserWorkflowIntelligenceEngine.getAllPersonas();
  assert(personas.length === 5, "Workflow engine defines exactly 5 primary engineering personas");
  const staffEngJourney = UserWorkflowIntelligenceEngine.evaluatePersonaJourney("STAFF_ENGINEER");
  assert(staffEngJourney.coverageScore === 100, "Staff engineer journey has 100% platform coverage");

  // P06: Competitive Capability Map
  console.log("\n--- P06: Competitive Capability Map ---");
  const compMatrix = CompetitiveCapabilityEngine.getCompetitiveMatrix();
  assert(compMatrix.length === 6, "Competitive map analyzes 6 adjacent industry categories");
  const diffEval = CompetitiveCapabilityEngine.evaluateCategory("OBSERVABILITY_APM");
  assert(diffEval.verdict === "VYRON_SUPERIOR_CROSS_SILO", "APM category comparison verifies cross-silo superiority");

  // P07: Product Boundary Contract
  console.log("\n--- P07: Product Boundary Contract ---");
  const nonGoals = ProductBoundaryContract.CORE_NON_GOALS;
  assert(nonGoals.length >= 4, "Product boundary explicitly defines core non-goals");
  const blockedAction = ProductBoundaryContract.evaluateActionAuthority("DROP_TABLE", "LIVE_PRODUCTION", true);
  assert(blockedAction.isPermitted === false, "Destructive operations on LIVE_PRODUCTION are strictly forbidden");
  const demoAction = ProductBoundaryContract.evaluateActionAuthority("SIMULATE_PATCH", "DEMO", true);
  assert(demoAction.assignedTier === "TIER_1_SIMULATED_SANDBOX", "Destructive sandbox operations in Demo are routed to Tier 1");

  // P08: Canonical Domain Model
  console.log("\n--- P08: Canonical Domain Model ---");
  const validTransition = CanonicalDomainModelEngine.transitionIncident("DETECTED", "TRIAGED");
  assert(validTransition.valid === true, "Valid incident lifecycle transition DETECTED -> TRIAGED allowed");
  const invalidTransition = CanonicalDomainModelEngine.transitionIncident("DETECTED", "CLOSED");
  assert(invalidTransition.valid === true, "Incident closing allowed from DETECTED (false alarm)");
  const illegalTransition = CanonicalDomainModelEngine.transitionIncident("CLOSED", "REMEDIATING");
  assert(illegalTransition.valid === false, "Illegal transition from terminal CLOSED blocked");

  // P09: Source of Truth Architecture
  console.log("\n--- P09: Source of Truth Architecture ---");
  const sotSubsystems = SourceOfTruthArchitecture.getAllSubsystems();
  assert(sotSubsystems.length === 6, "Source of Truth architecture defines 6 authority subsystems");
  const commitOwner = SourceOfTruthArchitecture.resolveAuthoritativeOwner("Commit");
  assert(commitOwner === "GIT_SCM_FABRIC", "Git SCM Fabric is the authoritative owner for Commits");

  // P10: Evidence Fabric
  console.log("\n--- P10: Evidence Fabric ---");
  const parentNode = EvidenceFabricEngine.registerEvidence("GIT_SCM_FABRIC", { commitSha: "abc1234", author: "engineer" });
  assert(parentNode.id.startsWith("ev_"), "Registered evidence node has correct prefix");
  const childNode = EvidenceFabricEngine.registerEvidence("ARCHITECTURE_GOVERNANCE", { driftDetected: false }, [parentNode.id]);
  assert(childNode.parentEvidenceIds.includes(parentNode.id), "Evidence node maintains lineage link to parent");
  const verification = EvidenceFabricEngine.verifyEvidenceChain(childNode.id);
  assert(verification.isChainValid === true, "Evidence lineage DAG verification passes cleanly");
  assert(verification.depth === 2, "Evidence lineage DAG traverses both levels");

} catch (err) {
  console.error("Test execution threw exception:", err);
  failed++;
}

console.log("\n================================================================================");
console.log(`MACRO-BATCH 1 RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
