import { copilotEpistemicEngine } from "./src/services/copilot/copilotEpistemicEngine.ts";
import { mutationEngine } from "./src/services/aiProject/controlPlane/mutationEngine.ts";
import { createInitialProjectState } from "./src/state/aiProject/aiProjectStore.ts";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

console.log(`${BOLD}=======================================================================`);
console.log(`   VYRON — DEEP ADVERSARIAL ENGINE EXECUTION AUDIT                     `);
console.log(`=======================================================================${RESET}\n`);

let passed = 0;
let failed = 0;

function assert(condition, title, details) {
  if (condition) {
    passed++;
    console.log(`${GREEN}✅ [PASS] ${title}${RESET}\n          ${details}`);
  } else {
    failed++;
    console.log(`${RED}❌ [FAIL] ${title}${RESET}\n          ${details}`);
  }
}

// ---------------------------------------------------------------------------
// TEST 1: Adversarial Attempt to promote SIMULATION_RESULT to FACT
// ---------------------------------------------------------------------------
const simClaim = copilotEpistemicEngine.registerClaim({
  statement: "Synthetic AST stress test suggests 99.9% cache hit ratio under 10k RPS",
  state: "SIMULATION_RESULT",
  confidence: 0.95,
  source: "Chaos Simulator Engine",
  evidenceRef: "SIM-TRACE-99",
});

const simPromotionResult = copilotEpistemicEngine.attemptPromotion(simClaim.id, "FACT", {
  proofType: "TEST_EXECUTION",
  proofReference: "SIM-RUN-101",
  verifiedBy: "AdversarialTester",
});

assert(
  simPromotionResult.success === false &&
    simPromotionResult.reason.includes(
      "Simulation results cannot be promoted to production reality",
    ),
  "ADV-01: Block Illegal Simulation -> Reality Promotion",
  `Rejected with message: "${simPromotionResult.reason}"`,
);

// ---------------------------------------------------------------------------
// TEST 2: Adversarial Attempt to promote INFERENCE to FACT without empirical proof
// ---------------------------------------------------------------------------
const infClaim = copilotEpistemicEngine.registerClaim({
  statement: "Memory growth pattern indicates probable circular reference in AST parser",
  state: "INFERENCE",
  confidence: 0.75,
  source: "Copilot Heuristic Scanner",
  evidenceRef: "HEUR-042",
});

const unverifiedProofResult = copilotEpistemicEngine.attemptPromotion(infClaim.id, "FACT", {
  proofType: "OPERATOR_SIGN_OFF", // Insufficient for mathematical/empirical fact
  proofReference: "SIGN-OFF-001",
  verifiedBy: "DevUser",
});

assert(
  unverifiedProofResult.success === false &&
    unverifiedProofResult.reason.includes("Promotion from INFERENCE to FACT requires"),
  "ADV-02: Block Unproven Inference -> Fact Promotion",
  `Rejected with message: "${unverifiedProofResult.reason}"`,
);

// ---------------------------------------------------------------------------
// TEST 3: Legitimate Promotion with Empirical Static AST Proof
// ---------------------------------------------------------------------------
const validProofResult = copilotEpistemicEngine.attemptPromotion(infClaim.id, "FACT", {
  proofType: "AST_VALIDATION",
  proofReference: "AST-STATIC-VALIDATION-OK",
  verifiedBy: "BrahmaAstEngine",
});

assert(
  validProofResult.success === true && validProofResult.newState === "FACT",
  "ADV-03: Legitimate Epistemic Promotion via AST Validation",
  `Successfully promoted claim to FACT with verification hash: ${validProofResult.verificationHash?.slice(0, 16)}...`,
);

// ---------------------------------------------------------------------------
// TEST 4: Governed Mutation Transaction & Snapshot Ledger
// ---------------------------------------------------------------------------
const baselineState = createInitialProjectState();
const initialVersion = baselineState.version;

const testProposal = {
  id: "prop-adv-01",
  stage: "01_INTENT",
  title: "Adversarial Architecture Change Proposal",
  sensitivityLevel: "L2_PROJECT_MODIFICATION",
  proposedChanges: {
    name: "Vyron Hardened Mesh Core",
  },
  status: "approved",
};

baselineState.pendingProposals = [testProposal];

const mutationResult = mutationEngine.commitProposal(
  baselineState,
  testProposal,
  "operator_audit_agent",
);

assert(
  mutationResult.success === true &&
    mutationResult.newState.version === initialVersion + 1 &&
    mutationResult.newState.name === "Vyron Hardened Mesh Core" &&
    mutationResult.newState.mutationAuditTrail.length === 1 &&
    mutationResult.newState.mutationAuditTrail[0].snapshotHash.startsWith("sha256_"),
  "ADV-04: Atomic Proposal Commitment & Snapshot Hash Chain",
  `Committed version ${initialVersion} -> ${mutationResult.newState.version}, snapshotHash: ${mutationResult.newState.mutationAuditTrail[0].snapshotHash}`,
);

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log(`\n${BOLD}=======================================================================`);
console.log(`   DEEP ADVERSARIAL VERIFICATION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log(`=======================================================================${RESET}\n`);

if (failed > 0) {
  process.exit(1);
}
