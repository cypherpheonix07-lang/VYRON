import fs from "fs";

const raw = fs.readFileSync("./src/services/governance/canonicalPhaseDossier.ts", "utf-8");
const isCRLF = raw.includes("\r\n");
const lines = raw.split(/\r?\n/);

const startIdx = lines.findIndex((l) => l.startsWith("export const CANONICAL_PHASE_DOSSIER: Record<"));
const endIdx = lines.findIndex((l, idx) => idx > startIdx && l.trim() === "};" && lines[idx + 3]?.includes("6. DOSSIER ACCESSOR"));

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find start or end index:", { startIdx, endIdx });
  process.exit(1);
}

// Also update getPhase and getAllPhases return types from PhaseDossier26 to PhaseDossier52
for (let i = endIdx; i < lines.length; i++) {
  if (lines[i].includes("PhaseDossier26 | undefined {")) {
    lines[i] = lines[i].replace("PhaseDossier26", "PhaseDossier52");
  }
  if (lines[i].includes("getAllPhases(): PhaseDossier26[] {")) {
    lines[i] = lines[i].replace("PhaseDossier26[]", "PhaseDossier52[]");
  }
}

const before = lines.slice(0, startIdx);
const after = lines.slice(endIdx + 1);

const newLines = [
  ...before,
  "// EXACTLY 50 MASTER PHASES × EXACTLY 52 SECTIONS PER PHASE (A–Z + a–z) — NO P51",
  "export const CANONICAL_PHASE_DOSSIER: Record<`P${string}`, PhaseDossier52> = CANONICAL_50_PHASES_DATA;",
  ...after,
];

fs.writeFileSync("./src/services/governance/canonicalPhaseDossier.ts", newLines.join(isCRLF ? "\r\n" : "\n"), "utf-8");
console.log("Successfully updated canonicalPhaseDossier.ts to 50 phases × 52 sections!");
