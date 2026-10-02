/**
 * verify-system-live.mjs — Comprehensive integration & verification engine for PROJECT BRAHMA
 */

import http from "http";

const BASE_ENGINE = "http://127.0.0.1:8000";
const BASE_FRONTEND = "http://127.0.0.1:8080";

const results = [];

function record(id, name, pass, detail) {
  results.push({ id, name, pass, detail });
  const status = pass ? "✓ PASS" : "✗ FAIL";
  console.log(`[${status}] #${id}: ${name} — ${detail}`);
}

async function getJson(url, options = {}) {
  const resp = await fetch(url, options);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
}

async function main() {
  console.log("════════════════════════════════════════════════════════════════════");
  console.log("⚡ PROJECT BRAHMA — SYSTEM INTEGRATION & VERIFICATION LEDGER");
  console.log("════════════════════════════════════════════════════════════════════\n");

  // Check 1: Frontend Server
  try {
    const res = await fetch(BASE_FRONTEND);
    record(
      1,
      "Frontend Dev / Production Server",
      res.status === 200,
      `HTTP ${res.status} on port 8080`,
    );
  } catch (e) {
    record(1, "Frontend Dev / Production Server", false, e.message);
  }

  // Check 2: FastAPI Health
  try {
    const data = await getJson(`${BASE_ENGINE}/health`);
    const isHealthy = data.status === "healthy" && data.checks.engine === "healthy";
    record(
      2,
      "FastAPI Engine Health Check",
      isHealthy,
      `Status: ${data.status}, Engine: ${data.checks.engine}, Supabase: ${data.checks.supabase}`,
    );
  } catch (e) {
    record(2, "FastAPI Engine Health Check", false, e.message);
  }

  // Check 3: AST Scan Trigger & Execution
  try {
    const scanResp = await getJson(`${BASE_ENGINE}/analysis/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: "test-proj", repo_url: "https://github.com/brahma/core" }),
    });
    record(
      3,
      "AST Analysis Task Trigger",
      Boolean(scanResp.task_id),
      `Task ID: ${scanResp.task_id}, Status: ${scanResp.status}`,
    );
  } catch (e) {
    record(3, "AST Analysis Task Trigger", false, e.message);
  }

  // Check 4: 7-Check Release Gate Evaluation
  try {
    const gateResp = await getJson(`${BASE_ENGINE}/gate/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: "test-proj",
        complexity_avg: 6.8,
        security_score: 98,
        coverage_pct: 86.0,
        dependency_vulns: 0,
      }),
    });
    const pass = gateResp.overall_pass && gateResp.gates_passed === 7;
    record(
      4,
      "7-Check Deterministic Release Gate",
      pass,
      `${gateResp.gates_passed}/${gateResp.gates_total} gates passed (${gateResp.pass_rate}%)`,
    );
  } catch (e) {
    record(4, "7-Check Deterministic Release Gate", false, e.message);
  }

  // Check 5: LLM Gateway Blueprint Generation
  try {
    const llmResp = await getJson(`${BASE_ENGINE}/llm/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requirement: "Build a secure distributed ledger with HMAC webhook delivery",
      }),
    });
    const valid = Boolean(llmResp.content && llmResp.model);
    record(
      5,
      "LLM Gateway Routing & Spend Control",
      valid,
      `Model: ${llmResp.model}, Cost: $${llmResp.cost}, Tokens: ${llmResp.tokens.total_tokens}`,
    );
  } catch (e) {
    record(5, "LLM Gateway Routing & Spend Control", false, e.message);
  }

  // Check 6: Admin Celery Queue Status
  try {
    const queueResp = await getJson(`${BASE_ENGINE}/admin/queue/status`);
    const valid = Array.isArray(queueResp.workers) && queueResp.workers.length > 0;
    record(
      6,
      "Celery Worker Queue Telemetry",
      valid,
      `${queueResp.workers.length} workers online, depth: ${queueResp.pending_depth}, 24h: ${queueResp.completed_count_24h}`,
    );
  } catch (e) {
    record(6, "Celery Worker Queue Telemetry", false, e.message);
  }

  // Check 7: Admin 3-Way Schema Drift
  try {
    const driftResp = await getJson(`${BASE_ENGINE}/admin/schema/drift`);
    const valid = driftResp.overall_status === "healthy" && driftResp.drift_count === 0;
    record(
      7,
      "3-Way Schema Drift Verification",
      valid,
      `${driftResp.in_sync_count}/${driftResp.total_tables} tables in sync, 0 drift`,
    );
  } catch (e) {
    record(7, "3-Way Schema Drift Verification", false, e.message);
  }

  console.log("\n════════════════════════════════════════════════════════════════════");
  const allPassed = results.every((r) => r.pass);
  console.log(
    `TOTAL VERIFIED: ${results.filter((r) => r.pass).length}/${results.length} CHECKS PASSED.`,
  );
  console.log(`VERIFICATION STATUS: ${allPassed ? "ALL SYSTEMS OPERATIONAL (100%)" : "DEGRADED"}`);
  console.log("════════════════════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Execution error:", err);
  process.exit(1);
});
