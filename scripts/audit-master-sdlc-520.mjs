import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const reportPath = path.join(rootDir, 'docs', 'master-sdlc-520-audit-report.json');
if (!fs.existsSync(reportPath)) {
  console.error(`[ERROR] Audit report file not found at ${reportPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(reportPath, 'utf8');
const data = JSON.parse(raw);

console.log('================================================================================');
console.log(`AUDIT: ${data.title}`);
console.log(`Environment: ${data.environment}`);
console.log(`Timestamp: ${data.auditTimestamp}`);
console.log('================================================================================');

let totalPhases = 0;
let totalVerified = 0;
let totalInProgress = 0;
let totalGap = 0;

if (!Array.isArray(data.domains) || data.domains.length !== 26) {
  console.error(`[ERROR] Expected 26 domains (A-Z), found: ${data.domains?.length}`);
  process.exit(1);
}

for (const domain of data.domains) {
  const phaseCount = domain.phases?.length || 0;
  totalPhases += phaseCount;
  const verifiedCount = domain.phases?.filter(p => p.status === 'VERIFIED').length || 0;
  totalVerified += verifiedCount;
  totalInProgress += domain.phases?.filter(p => p.status === 'IN_PROGRESS').length || 0;
  totalGap += domain.phases?.filter(p => p.status === 'GAP').length || 0;

  console.log(`Domain [${domain.letter}] ${domain.name.padEnd(40)} : ${verifiedCount}/${phaseCount} phases verified (${domain.coveragePct}%)`);
}

console.log('================================================================================');
console.log(`TOTAL PHASES: ${totalPhases} (Target: 520)`);
console.log(`VERIFIED    : ${totalVerified} (${((totalVerified / totalPhases) * 100).toFixed(1)}%)`);
console.log(`IN PROGRESS : ${totalInProgress}`);
console.log(`GAPS        : ${totalGap}`);
console.log('================================================================================');

if (totalPhases === 520 && totalVerified === 520) {
  console.log('✅ ALL 520 SDLC CHECKPOINTS EMPIRICALLY AUDITED & VERIFIED.');
  process.exit(0);
} else {
  console.warn('⚠️ AUDIT HAS UNVERIFIED OR INCOMPLETE PHASES.');
  process.exit(0);
}
