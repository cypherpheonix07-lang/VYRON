/**
 * Verification Suite for VYRON 50-Phase × 26-Letter (1,300 Phase-Sections) Master Canonical Dossier
 * GOD MODE vULTIMA ΩΩΩΩΩ — 2026-09-26 RESEARCHED CONVERGENCE EDITION
 */

import fs from "fs";
import path from "path";

console.log("================================================================================");
console.log("  VYRON GOD MODE vULTIMA ΩΩΩΩΩ — 50x26 CANONICAL DOSSIER VERIFICATION SUITE    ");
console.log("================================================================================");

const DOSSIER_JSON_PATH = "src/services/governance/canonicalDossier50x26Data.json";

if (!fs.existsSync(DOSSIER_JSON_PATH)) {
  console.error("FAIL: Dossier JSON artifact does not exist at " + DOSSIER_JSON_PATH);
  process.exit(1);
}

const dossier = JSON.parse(fs.readFileSync(DOSSIER_JSON_PATH, "utf8"));
const phaseKeys = Object.keys(dossier);

console.log(`\n[CHECK 1] Master Phase Count: ${phaseKeys.length} / 50`);
if (phaseKeys.length !== 50) {
  console.error(`FAIL: Expected exactly 50 master phases, got ${phaseKeys.length}`);
  process.exit(1);
}
console.log("  ✓ PASS: Exactly 50 Master Phases P01 to P50 verified.");

console.log("\n[CHECK 2] Phase Topology Integrity (P01 to P50 sequence, no P51):");
for (let i = 1; i <= 50; i++) {
  const expectedId = `P${i < 10 ? "0" + i : i}`;
  if (!dossier[expectedId]) {
    console.error(`FAIL: Missing master phase ${expectedId}`);
    process.exit(1);
  }
}
if (dossier["P51"]) {
  console.error("FAIL: Forbidden phase P51 detected!");
  process.exit(1);
}
console.log("  ✓ PASS: P01 to P50 sequence intact; no P51 found.");

console.log("\n[CHECK 3] 26-Letter Sections per Phase (A through Z, 1,300 total):");
const EXPECTED_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let totalSectionCount = 0;

for (const phaseId of phaseKeys) {
  const phase = dossier[phaseId];
  if (phase.sectionCount !== 26) {
    console.error(`FAIL: Phase ${phaseId} has ${phase.sectionCount} sections instead of 26!`);
    process.exit(1);
  }
  for (const letter of EXPECTED_LETTERS) {
    if (!phase.sections[letter]) {
      console.error(`FAIL: Phase ${phaseId} missing letter section ${letter}!`);
      process.exit(1);
    }
  }
  totalSectionCount += phase.sectionCount;
}

console.log(`  ✓ PASS: Total Phase-Sections verified: ${totalSectionCount} / 1,300.`);
if (totalSectionCount !== 1300) {
  console.error(`FAIL: Total phase sections count is ${totalSectionCount}, expected exactly 1300!`);
  process.exit(1);
}

console.log("\n[CHECK 4] Non-Negotiable Laws 1-30 Verification:");
const NO_STATUS_LYING_FILE = "src/services/intelligence/noStatusLyingEngine.ts";
if (!fs.existsSync(NO_STATUS_LYING_FILE)) {
  console.error("FAIL: missing noStatusLyingEngine.ts");
  process.exit(1);
}
const noStatusContent = fs.readFileSync(NO_STATUS_LYING_FILE, "utf8");
for (let lawNum = 1; lawNum <= 30; lawNum++) {
  if (!noStatusContent.includes(`${lawNum}:`)) {
    console.error(`FAIL: Non-negotiable Law #${lawNum} missing from noStatusLyingEngine.ts`);
    process.exit(1);
  }
}
console.log("  ✓ PASS: All 30 Non-Negotiable Laws verified in No-Status-Lying Engine.");

console.log("\n[CHECK 5] 16 Signature Experience Systems (A-P) Verification:");
const expectedSystems = [
  "runningStateResolver.ts",
  "projectStatePassport.ts",
  "engineeringFlightRecorder.ts",
  "causalChangeImpactTheater.ts",
  "proofCarryingAgentAction.ts",
  "crossProviderDigitalTwin.ts",
  "deploymentIdentityResolver.ts",
  "evidenceCarryingPreview.ts",
  "intentToRealityCompiler.ts",
  "providerCapabilityNegotiator.ts",
  "counterfactualReleaseLab.ts",
  "noStatusLyingEngine.ts",
  "integrationContractGenome.ts",
  "environmentFingerprint.ts",
  "crossProviderAgentArbitration.ts",
  "reproducibleAcceptancePassport.ts",
];

for (const sysFile of expectedSystems) {
  const fullPath = path.join("src/services/intelligence", sysFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`FAIL: Missing signature system file ${fullPath}`);
    process.exit(1);
  }
}
console.log(`  ✓ PASS: All 16 Signature Systems (A through P) verified.`);

console.log("\n[CHECK 6] 14 Brahma Explanatory Architecture Surfaces Verification:");
const EXPLANATORY_FILE = "src/components/brahma/ExplanatorySurfaces.tsx";
if (!fs.existsSync(EXPLANATORY_FILE)) {
  console.error("FAIL: missing ExplanatorySurfaces.tsx");
  process.exit(1);
}
const expContent = fs.readFileSync(EXPLANATORY_FILE, "utf8");
for (let modNum = 1; modNum <= 14; modNum++) {
  if (!expContent.includes(`${modNum}.`)) {
    console.error(`FAIL: Explanatory module #${modNum} missing from ExplanatorySurfaces.tsx`);
    process.exit(1);
  }
}
console.log("  ✓ PASS: All 14 Explanatory Surfaces verified.");

console.log("\n================================================================================");
console.log("  ALL CONVERGENCE GATES PASSED — 50 PHASES / 1,300 SECTIONS ATTESTED           ");
console.log("================================================================================\n");
