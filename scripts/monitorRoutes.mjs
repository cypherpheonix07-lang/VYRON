import http from 'node:http';

const routes = [
  { path: '/app', label: '01. HOME' },
  { path: '/app/reality-map', label: '02. DISCOVER (Reality Map)' },
  { path: '/app/intelligence', label: '03. INTELLIGENCE (Overview)' },
  { path: '/app/projects', label: '04. ENGINEERING (Workspaces)' },
  { path: '/app/analysis', label: '05. ANALYSIS (12-Stage Forensics)' },
  { path: '/app/release', label: '06. RELEASE (Gates & Twin)' },
  { path: '/app/simulation', label: '07. SIMULATION (Twin Lab)' },
  { path: '/app/aether', label: '08. AI (ATHER Command)' },
  { path: '/app/integrations', label: '09. INTEGRATIONS (Control Plane)' },
  { path: '/app/policies', label: '10. GOVERNANCE (Policy-as-Code)' },
  { path: '/app/system-flow', label: '11. SYSTEM FLOW (Topology Flow)' },
  { path: '/app/monitoring', label: '11. SYSTEM FLOW (Sentinel Health)' },
  { path: '/app/deployments', label: '12. DEPLOYMENTS (Platforms)' },
  { path: '/app/workpulse', label: '01. HOME (WorkPulse Telemetry)' },
];

async function probeRoute(item) {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:8080${item.path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - start;
        resolve({
          label: item.label,
          path: item.path,
          status: res.statusCode,
          latencyMs: latency,
          bytes: data.length,
          ok: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        label: item.label,
        path: item.path,
        status: 'ERROR',
        error: err.message,
        ok: false
      });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        label: item.label,
        path: item.path,
        status: 'TIMEOUT',
        ok: false
      });
    });
  });
}

async function run() {
  console.log('=== VYRON LIVE SYSTEM MONITORING: 12 SECTIONS & CORE ROUTES ===');
  let passCount = 0;
  for (const item of routes) {
    const result = await probeRoute(item);
    const badge = result.ok ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${badge} ${result.label.padEnd(36)} -> HTTP ${result.status} (${result.latencyMs}ms, ${result.bytes} bytes)`);
    if (result.ok) passCount++;
  }
  console.log(`\nMonitoring Summary: ${passCount}/${routes.length} core section endpoints active and responsive.`);
}

run();
