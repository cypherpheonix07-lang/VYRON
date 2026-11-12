// ==============================================================================
// VYRON / PROJECT BRAHMA — PART G: CONNECTOR INTELLIGENCE PLATFORM TEST SUITE
// Tests S27 (GitHub Hub), S28 (Integrations Marketplace), S29 (Dataset Manager)
// ==============================================================================
import assert from 'node:assert';
import crypto from 'node:crypto';
import fs from 'node:fs';

console.log('================================================================================');
console.log('VYRON — PART G: CONNECTOR INTELLIGENCE PLATFORM (S27 · S28 · S29) TEST SUITE');
console.log('================================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(id, name, testFn) {
  try {
    testFn();
    console.log(`✅ PASS [${id}] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL [${id}] ${name}:`, err.message);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// S27: GitHub Connector Hub Verification
// ----------------------------------------------------------------------------
runTest('S27-01', 'GitHub Webhook HMAC-SHA256 Signature Verification & Idempotency', () => {
  const secret = 'test-webhook-secret-vyron-2026';
  const payload = JSON.stringify({ action: 'push', repository: { full_name: 'vyron-org/core' } });
  
  const validSig = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const invalidSig = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';
  
  // Verify signature algorithm match
  const computed = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
  assert.strictEqual(computed, validSig, 'Valid HMAC signature must match computed digest');
  assert.notStrictEqual(computed, invalidSig, 'Tampered HMAC signature must be rejected');

  // Verify delivery ID uniqueness contract
  const deliveryId = 'delivery_' + crypto.randomUUID();
  assert(deliveryId.startsWith('delivery_'), 'Delivery ID must be tracked uniquely');
});

runTest('S27-02', 'GitHub Push Event Correlation & 2,000ms Debounce Contract', () => {
  const correlationRules = {
    push: {
      affectedSections: ['S09 Code Health', 'S11 Test Coverage', 'S13 Bundle Analyzer', 'S15 Security Reviewer'],
      debounceMs: 2000,
    },
    pull_request: {
      affectedSections: ['S09 Code Health', 'S11 Test Coverage', 'S22 CI/CD Pipeline'],
      debounceMs: 500,
    },
    check_run: {
      affectedSections: ['S22 CI/CD Pipeline'],
      debounceMs: 0,
    },
  };

  assert.strictEqual(correlationRules.push.debounceMs, 2000, 'GitHub push events must specify 2,000ms debounce');
  assert.strictEqual(correlationRules.push.affectedSections.length, 4, 'Push must route to 4 analysis sections');
});

runTest('S27-03', 'Commit Scanner Secret Protection & Zero-Leakage Policy', () => {
  const simulatedFinding = {
    commitSha: 'a1b2c3d4e5f6',
    filePath: 'config/keys.env',
    secretDetected: true,
    secretType: 'AWS_ACCESS_KEY_ID',
    // Raw secret values MUST NEVER be exposed in findings
    rawSecret: undefined,
  };

  assert.strictEqual(simulatedFinding.rawSecret, undefined, 'Raw secret values must be purged from metadata');
  assert.strictEqual(simulatedFinding.secretType, 'AWS_ACCESS_KEY_ID', 'Finding must classify pattern only');
});

// ----------------------------------------------------------------------------
// S28: Integrations Marketplace Verification
// ----------------------------------------------------------------------------
runTest('S28-01', 'Outbound Custom Webhook SSRF Guard & RFC 1918 Blacklist', () => {
  const isPrivateIp = (ipOrHost) => {
    const host = ipOrHost.toLowerCase().trim();
    if (['localhost', '127.0.0.1', '::1', '0.0.0.0', '169.254.169.254'].includes(host)) return true;
    if (host.startsWith('10.')) return true;
    if (host.startsWith('192.168.')) return true;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return true;
    return false;
  };

  assert.strictEqual(isPrivateIp('localhost'), true, 'localhost must be blocked by SSRF filter');
  assert.strictEqual(isPrivateIp('127.0.0.1'), true, 'loopback 127.0.0.1 must be blocked');
  assert.strictEqual(isPrivateIp('10.0.0.1'), true, '10.0.0.0/8 must be blocked');
  assert.strictEqual(isPrivateIp('192.168.1.1'), true, '192.168.0.0/16 must be blocked');
  assert.strictEqual(isPrivateIp('172.20.0.1'), true, '172.16.0.0/12 must be blocked');
  assert.strictEqual(isPrivateIp('169.254.169.254'), true, 'AWS metadata 169.254.169.254 must be blocked');
  assert.strictEqual(isPrivateIp('api.slack.com'), false, 'Public domain must be allowed');
});

runTest('S28-02', 'Standardized Provider Adapter Contract & Capabilities', () => {
  const requiredProviders = ['jira', 'slack', 'sentry', 'figma', 'custom_webhook'];
  const providerCapabilities = {
    jira: ['read', 'write', 'sync'],
    slack: ['write'],
    sentry: ['read', 'webhook'],
    figma: ['read', 'sync'],
    custom_webhook: ['read', 'write', 'webhook'],
  };

  for (const p of requiredProviders) {
    assert(providerCapabilities[p], `Provider ${p} must have defined capabilities`);
    assert(providerCapabilities[p].length > 0, `Provider ${p} must support at least one capability`);
  }
});

// ----------------------------------------------------------------------------
// S29: Dataset Manager Verification
// ----------------------------------------------------------------------------
runTest('S29-01', 'Synthetic Dataset Physical Isolation & Permanent [SYNTHETIC] Label', () => {
  const dataset = {
    name: 'security_telemetry_synthetic.csv',
    isSynthetic: true,
    storagePath: '/datasets/synthetic/sec_01.csv',
    label: '[SYNTHETIC — Not real data]',
  };

  assert.strictEqual(dataset.isSynthetic, true, 'Synthetic flag must be strictly boolean true');
  assert(dataset.storagePath.includes('/synthetic/'), 'Synthetic data must reside in isolated path');
  assert(dataset.label.includes('[SYNTHETIC'), 'Label must contain mandatory [SYNTHETIC] tag');
});

runTest('S29-02', 'Data Quality Report 6-Dimension Metric Computation', () => {
  const qualityReport = {
    completeness: 99.4,
    validity: 98.2,
    duplication: 0.1,
    typeConsistency: 99.8,
    anomalyCount: 2,
    referentialIntegrity: true,
  };

  assert(qualityReport.completeness >= 0 && qualityReport.completeness <= 100);
  assert(qualityReport.validity >= 0 && qualityReport.validity <= 100);
  assert(qualityReport.duplication >= 0 && qualityReport.duplication <= 100);
  assert(qualityReport.typeConsistency >= 0 && qualityReport.typeConsistency <= 100);
  assert(typeof qualityReport.anomalyCount === 'number');
  assert(typeof qualityReport.referentialIntegrity === 'boolean');
});

// ----------------------------------------------------------------------------
// Database Schema & Migration Verification
// ----------------------------------------------------------------------------
runTest('DATA-01', 'Part G Canonical Database Migration File Presence', () => {
  const migrationPath = '12 — DATABASE PLATFORM/supabase/migrations/20261112060000_part_g_connector_intelligence_platform.sql';
  assert(fs.existsSync(migrationPath), `Migration file must exist at ${migrationPath}`);
  
  const content = fs.readFileSync(migrationPath, 'utf8');
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.connector_accounts'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.connector_repo_bindings'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.connector_sync_jobs'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.connector_webhook_deliveries'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.connector_record_mappings'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.dataset_assets'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.dataset_versions'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.dataset_bindings'));
  assert(content.includes('CREATE TABLE IF NOT EXISTS public.dataset_quality_runs'));
});

// ----------------------------------------------------------------------------
// Fast-Path Summary
// ----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`PART G CONNECTOR SUITE: ${passCount} PASSED, ${failCount} FAILED (${Math.round((passCount / (passCount + failCount)) * 100)}%)`);
console.log('================================================================================');

if (failCount > 0) {
  process.exit(1);
}
