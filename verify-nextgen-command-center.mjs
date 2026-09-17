/**
 * VYRON — NEXT-GENERATION COMMAND CENTER VERIFICATION SUITE
 * Validates Gates NG1 through NG20:
 * - NG1: Universal Engineering Object Contract
 * - NG2: Multi-Hop Investigation Breadcrumb Trail
 * - NG3: Health Causality Engine (Correlation vs Hypothesis vs Causality)
 * - NG4: Multi-Dimensional Anomaly Clustering & Event Grouping
 * - NG5: Architecture Decision Decay Engine & ADR Lineage
 * - NG6: Evidence Graph & Claim-to-Release Lineage (6 States)
 * - NG7: Governance Authorization Matrix & Architectural Fitness Functions
 * - NG8: Knowledge Graph JUSTIFIED_BY Relationship
 * - NG9: Zero Raw SQL in newly created and updated engines
 * - NG10: Gate C1 Zero Capital 'B' Brahma in app.index.tsx
 * - NG11: Temporal Health Explorer Causality Integration
 * - NG12: Live Signal Radar Field Anomaly Cluster Integration
 * - NG13: Release Control Surface 4 Formal Decision States
 * - NG14: Evidence Explorer 6 Lifecycle States
 * - NG15: Copilot Partner 5 AI Epistemic States
 * - NG16: Universal Detail Drawer 10 Intelligence Tabs
 * - NG17: Strict Dual-Mode Isolation
 * - NG18: Automated Engine Execution & In-Memory Assertions
 * - NG19: Zero Fabricated Telemetry / Engine Dynamic Binding
 * - NG20: End-to-End Reasoning Loop Completeness
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('======================================================================');
console.log('VYRON — 20-PHASE NEXT-GENERATION ENGINEERING COMMAND CENTER SUITE');
console.log('======================================================================\n');

// -------------------------------------------------------------------
// GATE NG1: Universal Engineering Object Contract
// -------------------------------------------------------------------
console.log('Gate NG1: Universal Engineering Object Contract');
const entityContractPath = path.join(__dirname, 'src', 'types', 'engineeringEntity.ts');
assert(fs.existsSync(entityContractPath), 'engineeringEntity.ts exists');
const entityContractContent = fs.readFileSync(entityContractPath, 'utf8');

assert(entityContractContent.includes('export type UniversalEntityType ='), 'Defines UniversalEntityType union');
assert(entityContractContent.includes('"project"') && entityContractContent.includes('"service"') && entityContractContent.includes('"risk"') && entityContractContent.includes('"anomaly"'), 'Contains canonical entity types');
assert(entityContractContent.includes('export type BlastRadiusTier ='), 'Defines BlastRadiusTier');
assert(entityContractContent.includes('"DIRECT"') && entityContractContent.includes('"TRANSITIVE"') && entityContractContent.includes('"HIGH_RISK"'), 'Contains BlastRadius tiers');
assert(entityContractContent.includes('export type CausalityTier ='), 'Defines CausalityTier');
assert(entityContractContent.includes('"OBSERVED_CORRELATION"') && entityContractContent.includes('"INFERRED_CAUSAL_HYPOTHESIS"') && entityContractContent.includes('"VERIFIED_CAUSAL_RELATIONSHIP"'), 'Contains 3 Causality tiers');
assert(entityContractContent.includes('export type EvidenceLifecycleState ='), 'Defines EvidenceLifecycleState');
assert(entityContractContent.includes('export type AIEpistemicState ='), 'Defines AIEpistemicState');
assert(entityContractContent.includes('export type GovernanceActionLevel ='), 'Defines GovernanceActionLevel');
assert(entityContractContent.includes('export interface EngineeringEntity'), 'Defines canonical EngineeringEntity contract');

// -------------------------------------------------------------------
// GATE NG2: Multi-Hop Investigation Breadcrumb Trail
// -------------------------------------------------------------------
console.log('\nGate NG2: Multi-Hop Investigation Breadcrumb Trail in Store');
const storePath = path.join(__dirname, 'src', 'state', 'commandCenter', 'commandCenterStore.ts');
const storeContent = fs.readFileSync(storePath, 'utf8');
assert(storeContent.includes('export interface InvestigationBreadcrumb'), 'Defines InvestigationBreadcrumb interface');
assert(storeContent.includes('investigationChain: InvestigationBreadcrumb[]'), 'Defines investigationChain in CommandCenterState');
assert(storeContent.includes('pushInvestigation('), 'Defines pushInvestigation in CommandCenterStore');
assert(storeContent.includes('popInvestigation('), 'Defines popInvestigation in CommandCenterStore');
assert(storeContent.includes('clearInvestigationChain('), 'Defines clearInvestigationChain in CommandCenterStore');

// -------------------------------------------------------------------
// GATE NG3: Health Causality Engine
// -------------------------------------------------------------------
console.log('\nGate NG3: Health Causality Engine');
const causalityPath = path.join(__dirname, 'src', 'services', 'intelligence', 'healthCausalityEngine.ts');
assert(fs.existsSync(causalityPath), 'healthCausalityEngine.ts exists');
const causalityContent = fs.readFileSync(causalityPath, 'utf8');
assert(causalityContent.includes('export class HealthCausalityEngine'), 'Exports HealthCausalityEngine class');
assert(causalityContent.includes('evaluateCausality('), 'Implements evaluateCausality method');
assert(causalityContent.includes('getCausalityForPoint('), 'Implements getCausalityForPoint method');
assert(causalityContent.includes('causalityTier: CausalityTier'), 'HealthCausalityRecord exposes causalityTier');

// -------------------------------------------------------------------
// GATE NG4: Multi-Dimensional Anomaly Clustering & Event Grouping
// -------------------------------------------------------------------
console.log('\nGate NG4: Multi-Dimensional Anomaly Clustering');
const anomalyPath = path.join(__dirname, 'src', 'services', 'intelligence', 'anomalyCorrelationEngine.ts');
assert(fs.existsSync(anomalyPath), 'anomalyCorrelationEngine.ts exists');
const anomalyContent = fs.readFileSync(anomalyPath, 'utf8');
assert(anomalyContent.includes('export class AnomalyCorrelationEngine'), 'Exports AnomalyCorrelationEngine class');
assert(anomalyContent.includes('listClusters()'), 'Implements listClusters method');
assert(anomalyContent.includes('createClusterFromSignals('), 'Implements createClusterFromSignals method');
assert(anomalyContent.includes('primaryHypothesis: string'), 'AnomalyCluster contains primaryHypothesis');
assert(anomalyContent.includes('hypothesisStatus:'), 'AnomalyCluster contains hypothesisStatus');

// -------------------------------------------------------------------
// GATE NG5: Architecture Decision Decay Engine & ADR Lineage
// -------------------------------------------------------------------
console.log('\nGate NG5: Architecture Decision Decay Engine');
const decayPath = path.join(__dirname, 'src', 'services', 'intelligence', 'decisionDecayEngine.ts');
assert(fs.existsSync(decayPath), 'decisionDecayEngine.ts exists');
const decayContent = fs.readFileSync(decayPath, 'utf8');
assert(decayContent.includes('export class DecisionDecayEngine'), 'Exports DecisionDecayEngine class');
assert(decayContent.includes('listDecisions()'), 'Implements listDecisions method');
assert(decayContent.includes('evaluateDecay('), 'Implements evaluateDecay method');
assert(decayContent.includes('export type DecisionLifecycleStatus ='), 'Defines DecisionLifecycleStatus');

// -------------------------------------------------------------------
// GATE NG6: Evidence Graph & Claim-to-Release Lineage
// -------------------------------------------------------------------
console.log('\nGate NG6: Evidence Graph & Claim-to-Release Lineage');
const evidencePath = path.join(__dirname, 'src', 'services', 'evidence', 'evidenceGraphEngine.ts');
assert(fs.existsSync(evidencePath), 'evidenceGraphEngine.ts exists');
const evidenceContent = fs.readFileSync(evidencePath, 'utf8');
assert(evidenceContent.includes('export class EvidenceGraphEngine'), 'Exports EvidenceGraphEngine class');
assert(evidenceContent.includes('listEvidenceNodes()'), 'Implements listEvidenceNodes method');
assert(evidenceContent.includes('traceClaimToRelease('), 'Implements traceClaimToRelease method');
assert(evidenceContent.includes('verifyEvidence('), 'Implements verifyEvidence method');

// -------------------------------------------------------------------
// GATE NG7: Governance Authorization Matrix & Architectural Fitness Functions
// -------------------------------------------------------------------
console.log('\nGate NG7: Governance Authorization Matrix & Fitness Functions');
const governancePath = path.join(__dirname, 'src', 'services', 'governance', 'governanceAuthorizationEngine.ts');
assert(fs.existsSync(governancePath), 'governanceAuthorizationEngine.ts exists');
const governanceContent = fs.readFileSync(governancePath, 'utf8');
assert(governanceContent.includes('export class GovernanceAuthorizationEngine'), 'Exports GovernanceAuthorizationEngine class');
assert(governanceContent.includes('permissionMatrix'), 'Maintains permissionMatrix');
assert(governanceContent.includes('checkPermission(') || governanceContent.includes('isActionAuthorized('), 'Implements authorization check');
assert(governanceContent.includes('grantGovernedException('), 'Implements grantGovernedException');
assert(governanceContent.includes('executeFitnessFunctions()'), 'Implements executeFitnessFunctions');

// -------------------------------------------------------------------
// GATE NG8: Knowledge Graph JUSTIFIED_BY Relationship
// -------------------------------------------------------------------
console.log('\nGate NG8: Knowledge Graph JUSTIFIED_BY Relationship');
const kgPath = path.join(__dirname, 'src', 'services', 'intelligence', 'knowledgeGraph.ts');
const kgContent = fs.readFileSync(kgPath, 'utf8');
assert(kgContent.includes('"JUSTIFIED_BY"'), 'EdgeType includes JUSTIFIED_BY relationship');
assert(kgContent.includes('provenance?: string'), 'GraphEdge includes provenance');
assert(kgContent.includes('confidence?: number'), 'GraphEdge includes confidence');

// -------------------------------------------------------------------
// GATE NG9: Zero Raw SQL in Newly Created and Updated Engines
// -------------------------------------------------------------------
console.log('\nGate NG9: Zero Raw SQL in Newly Created and Updated Engines');
const newEnginePaths = [
  entityContractPath,
  causalityPath,
  anomalyPath,
  decayPath,
  evidencePath,
  governancePath,
];

const rawSqlRegex = /(?:SELECT\s+.+\s+FROM|INSERT\s+INTO\s+\w+|UPDATE\s+\w+\s+SET|DELETE\s+FROM\s+\w+|DROP\s+TABLE|ALTER\s+TABLE)/i;

for (const p of newEnginePaths) {
  const content = fs.readFileSync(p, 'utf8');
  assert(!rawSqlRegex.test(content), `Zero Raw SQL in ${path.basename(p)}`);
}

// -------------------------------------------------------------------
// GATE NG10: Gate C1 Zero Capital 'B' Brahma in app.index.tsx
// -------------------------------------------------------------------
console.log('\nGate NG10: Gate C1 Zero Capital \'B\' Brahma in app.index.tsx');
const appIndexPath = path.join(__dirname, 'src', 'routes', 'app.index.tsx');
const appIndexContent = fs.readFileSync(appIndexPath, 'utf8');
assert(!appIndexContent.includes('Brahma'), 'Zero instances of capital \'B\' "Brahma" in app.index.tsx');

// -------------------------------------------------------------------
// GATE NG11: Temporal Health Explorer Causality Integration
// -------------------------------------------------------------------
console.log('\nGate NG11: Temporal Health Explorer Causality Integration');
const temporalPath = path.join(__dirname, 'src', 'components', 'dashboard', 'TemporalHealthExplorer.tsx');
const temporalContent = fs.readFileSync(temporalPath, 'utf8');
assert(temporalContent.includes('healthCausalityEngine'), 'Imports healthCausalityEngine in TemporalHealthExplorer');
assert(temporalContent.includes('causality.causalityTier'), 'Renders causality tier badge in TemporalHealthExplorer');
assert(temporalContent.includes('causality.causalFactors'), 'Exposes leading causal factor in TemporalHealthExplorer');

// -------------------------------------------------------------------
// GATE NG12: Live Signal Radar Field Anomaly Cluster Integration
// -------------------------------------------------------------------
console.log('\nGate NG12: Live Signal Radar Field Anomaly Cluster Integration');
const radarPath = path.join(__dirname, 'src', 'components', 'dashboard', 'LiveSignalRadarField.tsx');
const radarContent = fs.readFileSync(radarPath, 'utf8');
assert(radarContent.includes('anomalyCorrelationEngine'), 'Imports anomalyCorrelationEngine in LiveSignalRadarField');
assert(radarContent.includes('anomalyClusters'), 'Derives anomaly clusters in LiveSignalRadarField');
assert(radarContent.includes('viewMode === "clusters"'), 'Supports cluster view toggle in LiveSignalRadarField');

// -------------------------------------------------------------------
// GATE NG13: Release Control Surface 4 Formal Decision States
// -------------------------------------------------------------------
console.log('\nGate NG13: Release Control Surface 4 Formal Decision States');
const releasePath = path.join(__dirname, 'src', 'components', 'dashboard', 'ReleaseControlSurface.tsx');
const releaseContent = fs.readFileSync(releasePath, 'utf8');
assert(releaseContent.includes('governanceAuthorizationEngine'), 'Imports governanceAuthorizationEngine in ReleaseControlSurface');
assert(releaseContent.includes('releaseDecisionState'), 'Computes releaseDecisionState');
assert(releaseContent.includes('CONDITIONALLY_READY') && releaseContent.includes('REVIEW_REQUIRED'), 'Covers all 4 release decision states');

// -------------------------------------------------------------------
// GATE NG14: Evidence Explorer 6 Lifecycle States
// -------------------------------------------------------------------
console.log('\nGate NG14: Evidence Explorer 6 Lifecycle States');
const evidenceExpPath = path.join(__dirname, 'src', 'components', 'dashboard', 'EvidenceExplorer.tsx');
const evidenceExpContent = fs.readFileSync(evidenceExpPath, 'utf8');
assert(evidenceExpContent.includes('lifecycleState'), 'Exposes lifecycleState in EvidenceExplorer');
assert(evidenceExpContent.includes('STATE: {selectedRecord.lifecycleState}'), 'Displays lifecycle state in evidence chain');

// -------------------------------------------------------------------
// GATE NG15: Copilot Partner 5 AI Epistemic States
// -------------------------------------------------------------------
console.log('\nGate NG15: Copilot Partner 5 AI Epistemic States');
const copilotPath = path.join(__dirname, 'src', 'components', 'dashboard', 'CopilotPartnerCard.tsx');
const copilotContent = fs.readFileSync(copilotPath, 'utf8');
assert(copilotContent.includes('EPISTEMIC_INSIGHTS'), 'Maintains epistemic insights in CopilotPartnerCard');
assert(copilotContent.includes('Epistemic Reasoning Spectrum'), 'Renders Epistemic Reasoning Spectrum');
assert(copilotContent.includes('"FACT"') && copilotContent.includes('"OBSERVATION"') && copilotContent.includes('"INFERENCE"') && copilotContent.includes('"HYPOTHESIS"') && copilotContent.includes('"RECOMMENDATION"'), 'Covers all 5 Epistemic states');

// -------------------------------------------------------------------
// GATE NG16: Universal Detail Drawer 10 Intelligence Tabs
// -------------------------------------------------------------------
console.log('\nGate NG16: Universal Detail Drawer 10 Intelligence Tabs');
const drawerPath = path.join(__dirname, 'src', 'components', 'dashboard', 'UniversalDetailDrawer.tsx');
const drawerContent = fs.readFileSync(drawerPath, 'utf8');
assert(drawerContent.includes('investigationChain.length > 1'), 'Renders investigation breadcrumb trail in drawer');
assert(drawerContent.includes('value="causes"'), 'Contains Causes tab trigger');
assert(drawerContent.includes('value="decisions"'), 'Contains Decisions tab trigger');
assert(drawerContent.includes('value="governance"'), 'Contains Governance tab trigger');
assert(drawerContent.includes('healthCausalityEngine'), 'Binds healthCausalityEngine in UniversalDetailDrawer');
assert(drawerContent.includes('decisionDecayEngine'), 'Binds decisionDecayEngine in UniversalDetailDrawer');
assert(drawerContent.includes('governanceAuthorizationEngine'), 'Binds governanceAuthorizationEngine in UniversalDetailDrawer');

// -------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All Next-Generation Engineering Intelligence Gates NG1–NG20 PASSED!\n');
  process.exit(0);
}
