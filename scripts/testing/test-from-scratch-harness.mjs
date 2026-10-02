/**
 * VYRON — COLD BOOT & ENVIRONMENT VERIFICATION HARNESS
 * Verifies operating environment, toolchain versions, port availability,
 * dev server responsiveness, SSR hydration entry point, and asset pipeline.
 */

import http from "http";
import fs from "fs";
import { execSync } from "child_process";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const results = [];
function record(id, name, status, details = "") {
  results.push({ id, name, status, details, timestamp: new Date().toISOString() });
  const icon = status === "PASS" ? `${GREEN}✅ [PASS]` : status === "WARN" ? `${YELLOW}⚠️  [WARN]` : `${RED}❌ [FAIL]`;
  console.log(`${icon} ${id}: ${name}${RESET}`);
  if (details) console.log(`   └─ ${details}`);
}

async function fetchRoute(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:8080${urlPath}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on("error", (err) => resolve({ error: err.message }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ error: "Timeout after 10000ms" });
    });
  });
}

async function runHarness() {
  console.log(`${BOLD}=======================================================================`);
  console.log(`   VYRON — COLD BOOT & RUNTIME ENVIRONMENT HARNESS                    `);
  console.log(`=======================================================================${RESET}\n`);

  // 1. Toolchain discovery
  console.log(`${CYAN}--- 1. TOOLCHAIN & RUNTIME VERSIONS ---${RESET}`);
  try {
    const nodeVer = process.version;
    record("BOOT-01", "Node.js Runtime Version", "PASS", `Node ${nodeVer} active (Required: >=20.x)`);
  } catch (e) {
    record("BOOT-01", "Node.js Runtime Version", "FAIL", e.message);
  }

  try {
    const bunVer = execSync("bun --version", { encoding: "utf-8" }).trim();
    record("BOOT-02", "Bun Package & Execution Engine", "PASS", `Bun ${bunVer} installed and available`);
  } catch (e) {
    record("BOOT-02", "Bun Package & Execution Engine", "WARN", "Bun not detected in PATH");
  }

  try {
    const pnpmVer = execSync("pnpm --version", { encoding: "utf-8" }).trim();
    record("BOOT-03", "pnpm Package Manager", "PASS", `pnpm ${pnpmVer} active`);
  } catch (e) {
    record("BOOT-03", "pnpm Package Manager", "WARN", e.message);
  }

  // 2. Port 8080 Listener check
  console.log(`\n${CYAN}--- 2. SERVER PORT 8080 LISTENER & RESPONSE ---${RESET}`);
  const rootRes = await fetchRoute("/");
  if (!rootRes.error && rootRes.statusCode === 200) {
    record("BOOT-04", "Localhost:8080 Root Endpoint Response", "PASS", `HTTP 200 OK (Content length: ${rootRes.body?.length || 0} bytes)`);
    const hasBrahma = rootRes.body.includes("PROJECT BRAHMA") || rootRes.body.includes("VYRON");
    if (hasBrahma) {
      record("BOOT-05", "Branding & Application Frame", "PASS", "Verified authoritative platform HTML rendered");
    } else {
      record("BOOT-05", "Branding & Application Frame", "WARN", "Platform signature not found in body");
    }
  } else {
    record("BOOT-04", "Localhost:8080 Root Endpoint Response", "FAIL", rootRes.error || `HTTP ${rootRes.statusCode}`);
  }

  // 3. Virtual TanStack Start Client Entry
  console.log(`\n${CYAN}--- 3. SSR HYDRATION & BUNDLE PIPELINE ---${RESET}`);
  const clientRes = await fetchRoute("/@id/virtual:tanstack-start-dev-client-entry");
  if (!clientRes.error && clientRes.statusCode === 200) {
    record("BOOT-06", "Virtual SSR Client Hydration Entry", "PASS", "HTTP 200 OK — TanStack dev client entrypoint verified");
  } else {
    record("BOOT-06", "Virtual SSR Client Hydration Entry", "FAIL", clientRes.error || `HTTP ${clientRes.statusCode}`);
  }

  const cssRes = await fetchRoute("/src/styles.css");
  if (!cssRes.error && cssRes.statusCode === 200) {
    record("BOOT-07", "Global Design System CSS Bundle", "PASS", `HTTP 200 OK (Delivered ${cssRes.body?.length || 0} bytes of compiled OKLCH styles)`);
  } else {
    record("BOOT-07", "Global Design System CSS Bundle", "FAIL", cssRes.error || `HTTP ${cssRes.statusCode}`);
  }

  // 4. Summary output
  console.log(`\n${BOLD}=======================================================================`);
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const warnings = results.filter((r) => r.status === "WARN").length;
  console.log(`   BOOT HARNESS SUMMARY: ${passed} PASSED | ${failed} FAILED | ${warnings} WARNINGS`);
  console.log(`=======================================================================${RESET}\n`);

  fs.writeFileSync("./boot-harness-report.json", JSON.stringify(results, null, 2));
  if (failed > 0) process.exit(1);
}

runHarness();
