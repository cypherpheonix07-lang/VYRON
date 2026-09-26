/**
 * VYRON — 50-PHASE / 26-LETTER CANONICAL PHASE DOSSIER VERIFICATION SUITE
 * GOD MODE vULTIMA Ω — CONVERGENCE EDITION (IMAGE-BOUND, LOOPHOLE-CLOSED)
 *
 * Verifies:
 * 1. Complete A–Z schema contracts across canonical phases
 * 2. Closure of all 10 active loopholes from the Blind-Spot Ledger
 * 3. Exact UI-to-Phase binding for the 7 screenshot-verified screens
 * 4. Blueprint Freeze 26/26 section reconciliation with A–Z registry
 * 5. 14-Stage Lifecycle sidebar ↔ 50-Phase registry reconciliation table
 * 6. Deterministic formula execution under P20 (Posture 94%, Quality%, Code Grade A)
 * 7. Epistemic Demarcation Law on Recommendation Impact Summary
 */

import { canonicalPhaseDossier, CANONICAL_LOOPHOLES, UI_TO_PHASE_BINDINGS, BLUEPRINT_26_SECTION_MAPPINGS, LIFECYCLE_STAGE_RECONCILIATION, DETERMINISTIC_FORMULAS } from "./src/services/governance/canonicalPhaseDossier.ts";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ${GREEN}✅ PASS:${RESET} ${message}`);
  } else {
    failCount++;
    console.error(`  ${RED}❌ FAIL:${RESET} ${message}`);
  }
}

async function runDossierVerification() {
  console.log(`${BOLD}=======================================================================`);
  console.log(`   VYRON — 50-PHASE / 26-LETTER DOSSIER & LOOPHOLE VERIFICATION GATES  `);
  console.log(`=======================================================================${RESET}\n`);

  // --- GATE 1: Loophole & Blind-Spot Ledger Verification ---
  console.log(`[GATE 1] Verifying 10 Closed Loopholes from Blind-Spot Ledger...`);
  assert(CANONICAL_LOOPHOLES.length === 10, `Expected 10 active loopholes, found ${CANONICAL_LOOPHOLES.length}`);
  
  const expectedLoopholeIds = [1, 2, 3, 4, 6, 7, 8, 10, 11, 12];
  for (const id of expectedLoopholeIds) {
    const isEnforced = canonicalPhaseDossier.verifyLoopholeStatus(id);
    assert(isEnforced, `Loophole #${id} is strictly ENFORCED`);
  }

  // --- GATE 2: UI-to-Phase Binding Map (The 7 Real Screens + 3 Cross-Cutting) ---
  console.log(`\n[GATE 2] Verifying UI-to-Phase Binding Map for 7 Screens...`);
  assert(UI_TO_PHASE_BINDINGS.length === 10, `Expected 10 UI bindings (7 screens + 3 cross-cutting), found ${UI_TO_PHASE_BINDINGS.length}`);

  const screenToPhaseMap = {
    "System Architecture Alternatives & Trade-Offs": "P14",
    "Security Engineering & STRIDE Threat Modeling": "P17",
    "Pre-Initialization Blueprint Freeze & Review": "P39",
    "Business KPI Manager": "P20",
    "Code Analysis Engine": "P15",
    "Atomic Requirements Engineering": "P13",
    "Intelligent Recommendation Engine": "P25",
    "Contextual AI Copilot Panel (Cross-Cutting)": "P35",
    "14-Stage Lifecycle Sidebar (Cross-Cutting)": "P49",
    "DEMO Badge & Workspace Pulse (Cross-Cutting)": "P38",
  };

  for (const [screen, expectedPhase] of Object.entries(screenToPhaseMap)) {
    const binding = UI_TO_PHASE_BINDINGS.find((b) => b.screenName === screen);
    assert(binding !== undefined, `Binding exists for "${screen}"`);
    assert(binding?.owningPhase === expectedPhase, `Screen "${screen}" owned by ${binding?.owningPhase} (expected ${expectedPhase})`);
    assert(binding?.renderedArtifacts.length >= 2, `Screen "${screen}" declares at least 2 verified rendered artifacts`);
  }

  // --- GATE 3: Blueprint Freeze 26/26 Section Reconciliation ---
  console.log(`\n[GATE 3] Verifying Blueprint Freeze 26/26 Sections ↔ A-Z Scheme...`);
  assert(BLUEPRINT_26_SECTION_MAPPINGS.length === 26, `Expected exactly 26 blueprint sections, found ${BLUEPRINT_26_SECTION_MAPPINGS.length}`);
  
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let i = 0; i < 26; i++) {
    const section = BLUEPRINT_26_SECTION_MAPPINGS[i];
    const expectedLetter = letters[i];
    assert(section.sectionNumber === i + 1, `Section ${i + 1} indexed correctly`);
    assert(section.sectionLetter === expectedLetter, `Section ${i + 1} maps to Letter '${expectedLetter}'`);
    assert(section.associatedPhases.length > 0, `Section '${expectedLetter}' has assigned phases: ${section.associatedPhases.join(", ")}`);
  }

  // --- GATE 4: 14-Stage Lifecycle Sidebar Reconciliation Table ---
  console.log(`\n[GATE 4] Verifying 14-Stage Lifecycle Sidebar ↔ 50-Phase Reconciliation...`);
  assert(LIFECYCLE_STAGE_RECONCILIATION.length === 14, `Expected 14 lifecycle stages, found ${LIFECYCLE_STAGE_RECONCILIATION.length}`);

  const stageKeys = [
    "01_INTENT", "02_PROBLEM", "03_REQUIREMENTS", "04_SCOPE", "05_CAPABILITY",
    "06_ARCHITECTURE", "07_TECHNOLOGY", "08_DATA", "09_AI_DESIGN", "10_SECURITY",
    "11_RELIABILITY", "12_IMPLEMENTATION", "13_TESTING", "14_BLUEPRINT"
  ];

  for (let i = 0; i < 14; i++) {
    const stage = LIFECYCLE_STAGE_RECONCILIATION[i];
    assert(stage.stageId === stageKeys[i], `Stage ${i + 1} matches ID: ${stageKeys[i]}`);
    assert(stage.owningPhases.length >= 1, `Stage ${stage.stageId} reconciles to: ${stage.owningPhases.join(", ")}`);
    assert(stage.epistemicBoundary.length > 0, `Stage ${stage.stageId} carries epistemic boundary: ${stage.epistemicBoundary}`);
  }

  // --- GATE 5: Deterministic Formula Registry under P20 ---
  console.log(`\n[GATE 5] Verifying Deterministic Formula Registry (P20 Single Source)...`);
  
  // 5.1 STRIDE Security Posture Score (94%)
  const postureScore = canonicalPhaseDossier.evaluateFormula("FORMULA-SEC-POSTURE-01", {
    mitigatedThreats: 3,
    totalThreats: 3,
    auditedBoundaries: 4,
    totalBoundaries: 4,
  });
  assert(postureScore >= 90 && postureScore <= 100, `STRIDE Posture Score evaluates to deterministic value: ${postureScore}%`);

  // 5.2 Requirements Quality% Composite (C/T/A)
  const reqQuality = canonicalPhaseDossier.evaluateFormula("FORMULA-REQ-QUALITY-01", {
    completeness: 96,
    testability: 92,
    atomicity: 98,
  });
  assert(reqQuality === 95, `Requirements Quality% composite evaluates to deterministic value: ${reqQuality}% (expected 95%)`);

  // 5.3 Code Quality Grade A
  const codeGrade = canonicalPhaseDossier.evaluateFormula("FORMULA-CODE-GRADE-01", {
    maintainabilityIndex: 88,
    duplicationPct: 2.4,
    avgComplexity: 6,
  });
  assert(codeGrade === "A", `Code Quality composite evaluates to deterministic Grade: ${codeGrade}`);

  // 5.4 Recommendation Impact Delta (76% -> 92%)
  const impactDelta = canonicalPhaseDossier.evaluateFormula("FORMULA-IMPACT-DELTA-01", {
    baselineHealth: 76,
    totalGain: 16,
  });
  assert(impactDelta === "76% → 92%", `Impact Delta evaluates to exact simulation: ${impactDelta}`);

  // --- GATE 6: Canonical 26-Letter Field Schema Audit on Dossier Phases ---
  console.log(`\n[GATE 6] Auditing Complete A–Z (26-Field) Schema Contracts...`);
  const phases = canonicalPhaseDossier.getAllPhases();
  assert(phases.length >= 12, `Verified ${phases.length} core anchor phases in canonical dossier`);

  const requiredFields = [
    "axiom", "baselinePrecondition", "contractOwned", "dependencies",
    "evidenceRequired", "failureModes", "gateConvergence", "hardLaw",
    "implementationDirectives", "judgmentPassedVsVerified", "kpiMetricLineage",
    "loopholeClosed", "mutationAuthority", "negativeTestsAdversarial",
    "outputArtifacts", "policyEnforcement", "questionsAnswered14Protocol",
    "residualRisk", "securityConditions", "toolingSkillsConnectors",
    "uiBinding", "verificationEvidence", "watchTriggersInvalidation",
    "xenoInputHandling", "yieldDownstreamConsumers", "zeroStateRollback"
  ];

  for (const phase of phases) {
    let allFieldsPresent = true;
    for (const field of requiredFields) {
      if (phase[field] === undefined || phase[field] === null || phase[field] === "") {
        allFieldsPresent = false;
        console.error(`  Phase ${phase.phaseId} missing required field '${field}'`);
      }
    }
    assert(allFieldsPresent, `Phase ${phase.phaseId} (${phase.name}) implements complete A–Z (26-field) schema`);
  }

  // --- GATE 7: Epistemic Demarcation Law for Recommendations ---
  console.log(`\n[GATE 7] Enforcing Epistemic Demarcation Law on Recommendations...`);
  const recPhase = canonicalPhaseDossier.getPhase("P25");
  assert(recPhase !== undefined, "Phase P25 (Recommendation Engine) is registered");
  assert(recPhase?.hardLaw.includes("SIMULATION_RESULT"), "P25 hard law mandates [SIMULATION_RESULT / PREDICTION] label");
  assert(recPhase?.loopholeClosed.includes("Loophole 10"), "P25 explicitly closes Loophole 10 (Impact Summary epistemic label)");

  // --- GATE 8: Tool Broker Exclusivity for Quick Action Buttons ---
  console.log(`\n[GATE 8] Enforcing Tool Broker Exclusivity (P31) for Quick Actions...`);
  const toolBrokerPhase = canonicalPhaseDossier.getPhase("P31");
  assert(toolBrokerPhase !== undefined, "Phase P31 (Tool Broker) is registered");
  assert(toolBrokerPhase?.hardLaw.includes("Never allow a UI button or copilot prompt to execute a tool without P31 broker validation"), "P31 hard law enforces broker routing for all UI actions");
  assert(toolBrokerPhase?.loopholeClosed.includes("Loophole 4"), "P31 explicitly closes Loophole 4 (Quick Action buttons through Tool Broker)");

  // --- GATE 9: Exact 50 Phases × 52 Sections (A–Z + a–z) Schema Contract ---
  console.log(`\n[GATE 9] Auditing Exact 50 Phases × 52 Sections (A–Z + a–z) Contract...`);
  assert(phases.length === 50, `Expected EXACTLY 50 phases (P01–P50), found ${phases.length} (NO P51 law enforced)`);
  assert(canonicalPhaseDossier.getPhase("P51") === undefined, "P51 is strictly undefined (No P51 Law preserved)");

  const capitalSections = [
    "A_mission", "B_scope", "C_inputs", "D_dependencies", "E_preconditions",
    "F_currentForensics", "G_targetState", "H_requirements", "I_architecture",
    "J_implementation", "K_security", "L_accessibility", "M_runtimeUx",
    "N_dataSync", "O_observability", "P_apiSchema", "Q_testingStrategy",
    "R_acceptanceGate", "S_failureModes", "T_invariants", "U_invalidation",
    "V_downstreamConsumers", "W_outputArtifacts", "X_readinessProof",
    "Y_verificationProof", "Z_canonicalExit"
  ];

  const lowerSections = [
    "a_productValue", "b_userImpact", "c_competitive", "d_componentInventory",
    "e_informationArchitecture", "f_designSystem", "g_interactionStates",
    "h_repositoryLinkage", "i_providerLinkage", "j_identityCorrelation",
    "k_permissionsScopes", "l_oauthLifecycle", "m_webhookIngestion",
    "n_pollingReconciliation", "o_realtimeConvergence", "p_rateLimitsQueues",
    "q_epistemicClassification", "r_evidenceProvenance", "s_agentBehavior",
    "t_toolConnectorBehavior", "u_humanApproval", "v_actionSafetyProof",
    "w_metricsSignals", "x_threatModelAbuse", "y_operationalPlaybook",
    "z_selfCritiqueVerdict"
  ];

  let totalSectionsEvidenced = 0;
  for (const phase of phases) {
    let hasAll52 = true;
    for (const cs of capitalSections) {
      if (!phase[cs] || (Array.isArray(phase[cs]) && phase[cs].length === 0 && cs !== "D_dependencies" && cs !== "V_downstreamConsumers")) {
        hasAll52 = false;
        console.error(`Phase ${phase.phaseId} missing capital section '${cs}'`);
      } else {
        totalSectionsEvidenced++;
      }
    }
    for (const ls of lowerSections) {
      if (!phase[ls]) {
        hasAll52 = false;
        console.error(`Phase ${phase.phaseId} missing lowercase section '${ls}'`);
      } else {
        totalSectionsEvidenced++;
      }
    }
    assert(hasAll52, `Phase ${phase.phaseId} implements all 52 sections (A–Z + a–z)`);
  }
  assert(totalSectionsEvidenced === 50 * 52, `Total canonical sections verified: ${totalSectionsEvidenced} / 2,600 (100% complete)`);

  // --- SUMMARY ---
  console.log(`\n${BOLD}=======================================================================`);
  console.log(`   DOSSIER VERIFICATION AUDIT SUMMARY:`);
  console.log(`   TOTAL GATES EVALUATED : 9/9`);
  console.log(`   PASSED CHECKS         : ${passCount}`);
  console.log(`   FAILED CHECKS         : ${failCount}`);
  console.log(`=======================================================================${RESET}\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runDossierVerification().catch((err) => {
  console.error("Unhandled verification exception:", err);
  process.exit(1);
});
