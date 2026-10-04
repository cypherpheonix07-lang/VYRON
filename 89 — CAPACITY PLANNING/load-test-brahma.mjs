import { performance } from "perf_hooks";

const SUPABASE_URL = "https://hbbunfizlwgvripgwzdo.supabase.co";
const ANON_KEY = "sb_publishable_RwMBCD1LJxI4927JDU5fbQ_0tfswec4";
const SERVICE_KEY = "sb_secret_eOpvHkdQra1PTfdrsa1Fqw_F0RcG5wR";

const TARGETS = [
  {
    name: "FastAPI Health Gateway",
    url: "http://127.0.0.1:8000/health",
    method: "GET",
    headers: {},
    tier: "FastAPI Engine",
  },
  {
    name: "FastAPI Gate Evaluation",
    url: "http://127.0.0.1:8000/gate/evaluate",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_id: "00000000-0000-0000-0000-000000000001",
      complexity_avg: 7.2,
      security_score: 98,
      coverage_pct: 84.0,
      dependency_vulns: 0,
    }),
    tier: "Analysis Pipeline",
  },
  {
    name: "Vite Frontend SSR Root",
    url: "http://localhost:8080/",
    method: "GET",
    headers: {},
    tier: "Frontend Surface",
  },
  {
    name: "Supabase Projects REST Query",
    url: `${SUPABASE_URL}/rest/v1/projects?select=id,name,health_score,status&limit=20`,
    method: "GET",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    tier: "PostgreSQL Database",
  },
  {
    name: "Supabase LLM Audit Logs Query",
    url: `${SUPABASE_URL}/rest/v1/audit_logs?action=eq.llm.inference&limit=50`,
    method: "GET",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    tier: "PostgreSQL Database",
  },
];

async function executeRequest(target) {
  const start = performance.now();
  try {
    const options = {
      method: target.method,
      headers: target.headers,
    };
    if (target.body) {
      options.body = target.body;
    }
    const res = await fetch(target.url, options);
    const latency = performance.now() - start;
    return {
      name: target.name,
      tier: target.tier,
      status: res.status,
      ok: res.ok,
      latency,
    };
  } catch (err) {
    const latency = performance.now() - start;
    return {
      name: target.name,
      tier: target.tier,
      status: 0,
      ok: false,
      error: err.message,
      latency,
    };
  }
}

function calculatePercentiles(latencies) {
  if (latencies.length === 0) return { p50: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  const avg = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
  return {
    p50: Number(p50.toFixed(2)),
    p95: Number(p95.toFixed(2)),
    p99: Number(p99.toFixed(2)),
    avg: Number(avg.toFixed(2)),
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
  };
}

async function runLoadSimulation() {
  console.log("════════════════════════════════════════════════════════════════════");
  console.log("⚡ PROJECT BRAHMA — SYNTHETIC INDUSTRIAL LOAD SIMULATION (15s)");
  console.log("════════════════════════════════════════════════════════════════════");

  const DURATION_MS = 12000;
  const CONCURRENCY = 15;
  const results = [];
  const startTime = Date.now();

  console.log(
    `[LOAD-TEST] Launching ${CONCURRENCY} concurrent workers against 5 platform tiers...`,
  );

  async function worker(workerId) {
    while (Date.now() - startTime < DURATION_MS) {
      const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      const result = await executeRequest(target);
      results.push(result);
      // Small jitter between requests
      await new Promise((r) => setTimeout(r, 10 + Math.random() * 20));
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  const totalTimeSec = (Date.now() - startTime) / 1000;
  const totalRequests = results.length;
  const successfulRequests = results.filter((r) => r.ok).length;
  const failedRequests = totalRequests - successfulRequests;
  const errorRate = ((failedRequests / totalRequests) * 100).toFixed(2);
  const throughput = (totalRequests / totalTimeSec).toFixed(2);

  const allLatencies = results.map((r) => r.latency);
  const globalMetrics = calculatePercentiles(allLatencies);

  // Group by tier
  const tierMap = new Map();
  for (const r of results) {
    if (!tierMap.has(r.tier)) {
      tierMap.set(r.tier, []);
    }
    tierMap.get(r.tier).push(r);
  }

  console.log("\n════════════════════════════════════════════════════════════════════");
  console.log("📊 GLOBAL LOAD TEST RESULTS");
  console.log("════════════════════════════════════════════════════════════════════");
  console.log(`- Duration:          ${totalTimeSec.toFixed(2)}s`);
  console.log(`- Total Requests:    ${totalRequests}`);
  console.log(
    `- Success Rate:      ${((successfulRequests / totalRequests) * 100).toFixed(2)}% (${successfulRequests}/${totalRequests})`,
  );
  console.log(`- Error Rate:        ${errorRate}%`);
  console.log(`- Throughput:        ${throughput} req/s`);
  console.log(`- Global P50:        ${globalMetrics.p50} ms`);
  console.log(`- Global P95:        ${globalMetrics.p95} ms`);
  console.log(`- Global P99:        ${globalMetrics.p99} ms`);
  console.log(`- Global Avg:        ${globalMetrics.avg} ms`);
  console.log(`- Global Min / Max:  ${globalMetrics.min} ms / ${globalMetrics.max} ms`);

  console.log("\n📊 PER-TIER LATENCY BREAKDOWN");
  console.log("────────────────────────────────────────────────────────────────────");
  for (const [tier, records] of tierMap.entries()) {
    const tierLatencies = records.map((r) => r.latency);
    const tierMetrics = calculatePercentiles(tierLatencies);
    const tierErrors = records.filter((r) => !r.ok).length;
    console.log(
      `► ${tier.padEnd(22)}: Req: ${String(records.length).padEnd(4)} | P50: ${String(tierMetrics.p50 + "ms").padEnd(8)} | P95: ${String(tierMetrics.p95 + "ms").padEnd(8)} | Avg: ${String(tierMetrics.avg + "ms").padEnd(8)} | Errors: ${tierErrors}`,
    );
  }
  console.log("════════════════════════════════════════════════════════════════════");
}

runLoadSimulation().catch(console.error);
