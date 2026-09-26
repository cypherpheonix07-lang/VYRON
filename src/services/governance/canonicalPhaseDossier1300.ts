/**
 * VYRON — 50-Phase × 26-Letter (1,300 Phase-Sections) Master Canonical Dossier
 * GOD MODE vULTIMA ΩΩΩΩΩ — 2026-09-26 RESEARCHED CONVERGENCE EDITION
 * 
 * EXACT TOPOLOGY:
 * - EXACTLY 50 MASTER PHASES: P01–P50
 * - EXACTLY 26 LETTER SECTIONS PER PHASE: A–Z
 * - TOTAL PHASE-SECTIONS: 1,300
 * - NO P51
 * - NO LETTER BEYOND Z
 * - NO MERGED PHASES
 * - NO SKIPPED PHASES
 */

import dossierData from "./canonicalDossier50x26Data.json";

export interface PhaseSection26 {
  letter: string;
  title: string;
  fullBody: string;
  requiredEvidence: string;
  failureCondition: string;
  convergenceGate: string;
  status: "PASS_VERIFIED" | "IN_PROGRESS" | "BLOCKED";
}

export interface MasterPhase50 {
  phaseId: string;
  phaseNumber: number;
  title: string;
  objective: string;
  directive: string;
  sectionCount: number;
  sections: Record<string, PhaseSection26>;
}

export const CANONICAL_50x26_DOSSIER = dossierData as Record<string, MasterPhase50>;

export const CANONICAL_PHASE_COUNT = 50;
export const CANONICAL_SECTION_PER_PHASE = 26;
export const CANONICAL_TOTAL_PHASE_SECTIONS = 1300;

export function getPhaseDossier(phaseId: string): MasterPhase50 | undefined {
  return CANONICAL_50x26_DOSSIER[phaseId];
}

export function getPhaseSection(phaseId: string, letter: string): PhaseSection26 | undefined {
  const phase = CANONICAL_50x26_DOSSIER[phaseId];
  return phase?.sections[letter.toUpperCase()];
}
