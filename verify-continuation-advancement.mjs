// verify-continuation-advancement.mjs
// Verification suite for Continuation Mission advancements in VYRON platform.
// Zero SQL policy strictly enforced.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = [];
function record(testId, description, passed, detail = '') {
  results.push({ testId, description, passed, detail });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${testId}] ${description}${detail ? ` - ${detail}` : ''}`);
}

console.log('='.repeat(70));
console.log('VYRON CONTINUATION ADVANCEMENT VERIFICATION SUITE');
console.log('='.repeat(70));

// [C1] Brand & Context Coherence
try {
  const contextEngine = fs.readFileSync(path.join(__dirname, 'src/services/copilot/copilotContextEngine.ts'), 'utf-8');
  const hasVyronNormal = contextEngine.includes('Vyron Intelligence Copilot');
  const hasVyronDemo = contextEngine.includes('Vyron Demo Copilot');
  const hasPlatformVyron = contextEngine.includes('for VYRON');

  const routesToCheck = [
    'src/routes/app.index.tsx',
    'src/routes/app.analysis.tsx',
    'src/routes/app.datasets.tsx',
    'src/routes/app.connectors.tsx',
    'src/routes/app.plugins.tsx'
  ];
  let routesAllVyron = true;
  for (const r of routesToCheck) {
    const content = fs.readFileSync(path.join(__dirname, r), 'utf-8');
    if (!content.includes('VYRON') || content.includes('Brahma')) {
      routesAllVyron = false;
      break;
    }
  }

  record(
    'C1',
    'VYRON Branding & System Directive Coherence across Routes & Context Engine',
    hasVyronNormal && hasVyronDemo && hasPlatformVyron && routesAllVyron,
    `Context: normal=${hasVyronNormal}, demo=${hasVyronDemo}; All 5 target routes branded VYRON: ${routesAllVyron}`
  );
} catch (err) {
  record('C1', 'VYRON Branding & System Directive Coherence', false, err.message);
}

// [C2] Kaggle Dataset Discovery Quality Breakdown & Compatibility Matrix
try {
  const kaggleConn = fs.readFileSync(path.join(__dirname, 'src/services/connectors/kaggleConnector.ts'), 'utf-8');
  const kagglePanel = fs.readFileSync(path.join(__dirname, 'src/components/datasets/KaggleDatasetPanel.tsx'), 'utf-8');

  const hasQualityMetricsInterface = kaggleConn.includes('interface DatasetQualityMetrics') &&
    kaggleConn.includes('completenessPct:') &&
    kaggleConn.includes('uniquenessPct:') &&
    kaggleConn.includes('validityPct:') &&
    kaggleConn.includes('consistencyPct:');

  const hasCompatibilityInterface = kaggleConn.includes('interface PipelineCompatibilityInfo') &&
    kaggleConn.includes('supportedStages: number[];');

  const hasNasaDefect = kaggleConn.includes('software-defect-prediction-mccabe');
  const hasNistCve = kaggleConn.includes('nvd-cwe-vulnerabilities');

  const hasGaugesInUi = kagglePanel.includes('Quality Metrics') &&
    kagglePanel.includes('12-Stage Pipeline Suitability') &&
    kagglePanel.includes('handleAskCopilotAboutDataset');

  record(
    'C2',
    'Kaggle Discovery Quality Breakdown, Compatibility Matrix & Benchmark Datasets',
    hasQualityMetricsInterface && hasCompatibilityInterface && hasNasaDefect && hasNistCve && hasGaugesInUi,
    `Metrics Interface: ${hasQualityMetricsInterface}, Compatibility: ${hasCompatibilityInterface}, Benchmarks (NASA/NIST): ${hasNasaDefect && hasNistCve}, UI gauges: ${hasGaugesInUi}`
  );
} catch (err) {
  record('C2', 'Kaggle Discovery Quality Breakdown', false, err.message);
}

// [C3] Schema-Aware 12-Stage Pipeline Partition Ingestion
try {
  const orch = fs.readFileSync(path.join(__dirname, 'src/services/orchestrator/analysisOrchestrator.ts'), 'utf-8');
  const hasSynthesizer = orch.includes('synthesizePartitionForDataset');
  const handlesClinical = orch.includes('scheduled_lag_days') && orch.includes('no_show');
  const handlesSoftware = orch.includes('complexity') && orch.includes('defect');
  const handlesCve = orch.includes('cwe') && orch.includes('cvss');
  const handlesEcommerce = orch.includes('freight_value') && orch.includes('status');
  const handlesFraud = orch.includes('is_cross_border') && orch.includes('velocity_last_hour');

  const allDomainsCovered = hasSynthesizer && handlesClinical && handlesSoftware && handlesCve && handlesEcommerce && handlesFraud;

  record(
    'C3',
    'Domain-Specific Schema-Aware Partition Synthesis (Clinical, Defect, CVE, E-Comm, Fraud)',
    allDomainsCovered,
    `Synthesizer: ${hasSynthesizer}, Clinical: ${handlesClinical}, Software: ${handlesSoftware}, CVE: ${handlesCve}, E-Comm: ${handlesEcommerce}, Fraud: ${handlesFraud}`
  );
} catch (err) {
  record('C3', 'Domain-Specific Partition Synthesis', false, err.message);
}

// [C4] Global Real-Time Event Synchronization in AppShell & FullScreen Studio
try {
  const shell = fs.readFileSync(path.join(__dirname, 'src/components/brahma/app-shell.tsx'), 'utf-8');
  const studio = fs.readFileSync(path.join(__dirname, 'src/components/copilot/CopilotFullScreenStudio.tsx'), 'utf-8');

  const shellInitsListener = shell.includes('copilotRealtimeListener.initialize()');
  const studioInitsListener = studio.includes('copilotRealtimeListener.initialize()');

  record(
    'C4',
    'Global Pipeline Real-Time Event Synchronization in AppShell & Copilot FullScreen Studio',
    shellInitsListener && studioInitsListener,
    `AppShell listener init: ${shellInitsListener}, FullScreen Studio listener init: ${studioInitsListener}`
  );
} catch (err) {
  record('C4', 'Global Real-Time Event Synchronization', false, err.message);
}

// [C5] Deterministic Demo Mode Scenario Switching & Pristine Reset
try {
  const demoStore = fs.readFileSync(path.join(__dirname, 'src/state/demo/demoStore.ts'), 'utf-8');
  const simControls = fs.readFileSync(path.join(__dirname, 'src/components/demo/SimulatorControls.tsx'), 'utf-8');
  const actionEngine = fs.readFileSync(path.join(__dirname, 'src/services/copilot/copilotActionEngine.ts'), 'utf-8');

  const storeHasReset = demoStore.includes('resetToBaseline');
  const storeHasSwitch = demoStore.includes('switchScenario');
  const uiHasResetButton = simControls.includes('Reset Demo') && simControls.includes('resetToBaseline');
  const actionHasResetHandler = actionEngine.includes('case "RESET_DEMO":') && actionEngine.includes('resetToBaseline');

  record(
    'C5',
    'Deterministic Demo Mode Scenario Switching, Pristine Baseline Reset & Copilot Action Binding',
    storeHasReset && storeHasSwitch && uiHasResetButton && actionHasResetHandler,
    `Store reset: ${storeHasReset}, Store switch: ${storeHasSwitch}, UI button: ${uiHasResetButton}, Copilot action handler: ${actionHasResetHandler}`
  );
} catch (err) {
  record('C5', 'Deterministic Demo Mode Controls', false, err.message);
}

// [C6] Dual-Mode Copilot Isolation (Normal vs Demo System Directives)
try {
  const contextEngine = fs.readFileSync(path.join(__dirname, 'src/services/copilot/copilotContextEngine.ts'), 'utf-8');
  const hasBranchingDirective = contextEngine.includes('ctx.mode === "NORMAL"') &&
    contextEngine.includes('You are Vyron Intelligence Copilot') &&
    contextEngine.includes('You are Vyron Demo Copilot');
  const hasDemoSafetyDirective = contextEngine.includes('strictly isolated from production data');

  record(
    'C6',
    'Dual-Mode Copilot Isolation & Dedicated System Prompt Directives',
    hasBranchingDirective && hasDemoSafetyDirective,
    `Branching: ${hasBranchingDirective}, Safety Directive: ${hasDemoSafetyDirective}`
  );
} catch (err) {
  record('C6', 'Dual-Mode Copilot Isolation', false, err.message);
}

// [C7] Zero Raw SQL Verification across Modified Files
try {
  const filesToScan = [
    'src/components/brahma/app-shell.tsx',
    'src/components/copilot/CopilotFullScreenStudio.tsx',
    'src/components/datasets/KaggleDatasetPanel.tsx',
    'src/components/demo/SimulatorControls.tsx',
    'src/routes/app.analysis.tsx',
    'src/routes/app.connectors.tsx',
    'src/routes/app.datasets.tsx',
    'src/routes/app.index.tsx',
    'src/routes/app.plugins.tsx',
    'src/services/connectors/kaggleConnector.ts',
    'src/services/copilot/copilotActionEngine.ts',
    'src/services/copilot/copilotContextEngine.ts',
    'src/services/orchestrator/analysisOrchestrator.ts',
    'src/state/demo/demoStore.ts'
  ];

  // Disallowed raw query patterns (case-insensitive word boundary checks)
  const forbiddenPatterns = [
    /\bSELECT\s+.+\s+FROM\b/i,
    /\bINSERT\s+INTO\b/i,
    /\bUPDATE\s+.+\s+SET\b/i,
    /\bDELETE\s+FROM\b/i,
    /\bCREATE\s+TABLE\b/i,
    /\bDROP\s+TABLE\b/i,
    /\bALTER\s+TABLE\b/i
  ];

  let rawSqlFound = false;
  let offender = null;

  for (const relPath of filesToScan) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf-8');
    for (const pat of forbiddenPatterns) {
      if (pat.test(content)) {
        rawSqlFound = true;
        offender = `${relPath} matches ${pat}`;
        break;
      }
    }
    if (rawSqlFound) break;
  }

  record(
    'C7',
    'Zero Raw SQL Compliance across All Modified Source Files',
    !rawSqlFound,
    rawSqlFound ? `Violation detected in ${offender}` : 'No raw query patterns detected in modified files'
  );
} catch (err) {
  record('C7', 'Zero Raw SQL Compliance', false, err.message);
}

console.log('='.repeat(70));
const total = results.length;
const passed = results.filter(r => r.passed).length;
console.log(`SUMMARY: ${passed}/${total} Continuation Advancement Gates Passed`);
console.log('='.repeat(70));

const reportPath = path.join(__dirname, 'continuation_advancement_report.json');
fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), total, passed, results }, null, 2));

if (passed < total) {
  process.exit(1);
} else {
  process.exit(0);
}
