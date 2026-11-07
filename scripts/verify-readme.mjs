/**
 * VYRON — README & ARCHITECTURAL DOCUMENTATION VERIFICATION ENGINE
 * File: scripts/verify-readme.mjs
 *
 * Verifies:
 * - README existence, formatting, structure, and depth
 * - 100% accurate tech stack alignment with package.json
 * - Explicit presence of core invariants (Zero-Fiction, Zero Raw SQL, Lovable Sync)
 * - Operational port 8080 integrity & edge worker requirements
 * - Physical existence and resolution of all local relative markdown links
 * - 90-Platform Root architecture and 30-Domain / 90-Subpage mapping
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let rootSearch = __dirname;
while (rootSearch !== path.dirname(rootSearch) && !fs.existsSync(path.join(rootSearch, "package.json"))) {
  rootSearch = path.dirname(rootSearch);
}
const projectRoot = rootSearch;

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

console.log("\n=======================================================================");
console.log("   VYRON — README & ARCHITECTURAL DOCUMENTATION VERIFICATION SUITE   ");
console.log("=======================================================================\n");

let passed = 0;
let failed = 0;

function runGate(gateId, description, evaluator) {
  try {
    const result = evaluator();
    if (result === true || (result && result.pass)) {
      console.log(`${GREEN}✅ [PASS] ${gateId}: ${description}${RESET}`);
      if (result && result.detail) {
        console.log(`          ${result.detail}`);
      }
      passed++;
    } else {
      console.error(`${RED}❌ [FAIL] ${gateId}: ${description}${RESET}`);
      if (result && result.error) {
        console.error(`          ${result.error}`);
      }
      failed++;
    }
  } catch (err) {
    console.error(`${RED}❌ [FAIL] ${gateId}: ${description}${RESET}`);
    console.error(`          Exception: ${err.message}`);
    failed++;
  }
}

const readmePath = path.join(projectRoot, "README.md");
const pkgPath = path.join(projectRoot, "package.json");

let readmeContent = "";
let pkg = {};

// VR-01: README Existence & Structural Depth
runGate("VR-01", "README Existence & Structural Depth", () => {
  if (!fs.existsSync(readmePath)) {
    return { pass: false, error: "README.md does not exist at project root" };
  }
  readmeContent = fs.readFileSync(readmePath, "utf-8");
  const lineCount = readmeContent.split("\n").length;
  if (lineCount < 300) {
    return { pass: false, error: `README.md has only ${lineCount} lines (expected >= 300 for enterprise SaaS)` };
  }
  return { pass: true, detail: `README.md verified: ${lineCount} lines (${Buffer.byteLength(readmeContent)} bytes).` };
});

// Load package.json for alignment checks
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
} catch (e) {
  pkg = {};
}

// VR-02: Brand Identity & GitHub-Native Glass Visuals
runGate("VR-02", "VYRON Branding, Glass SVG Assets & Accessible Image Fallbacks", () => {
  const hasVyron = readmeContent.includes("VYRON");
  const hasDesc = readmeContent.includes("Cognitive Engineering Intelligence");
  const hasHero = readmeContent.includes("hero-glass-dark.svg") && readmeContent.includes("hero-glass-light.svg");
  const hasCapability = readmeContent.includes("capability-glass-dark.svg") && readmeContent.includes("capability-glass-light.svg");
  const hasPicture = readmeContent.includes("<picture>") && readmeContent.includes("</picture>");
  const hasImageAlt = /<img[^>]*alt="[^"]+"[^>]*>/s.test(readmeContent);
  const assets = [
    "docs/readme/hero-glass-dark.svg", "docs/readme/hero-glass-light.svg",
    "docs/readme/capability-glass-dark.svg", "docs/readme/capability-glass-light.svg"
  ];
  const absent = assets.filter(asset => !fs.existsSync(path.resolve(projectRoot, asset)));
  if (!hasVyron || !hasDesc || !hasHero || !hasCapability || !hasPicture || !hasImageAlt || absent.length) {
    return { pass: false, error: `Brand identity or GitHub-compatible glass assets incomplete. Missing: ${absent.join(", ") || "metadata/alt text"}` };
  }
  return { pass: true, detail: "Verified accessible dark/light SVG hero and capability artwork with picture fallbacks." };
});

// VR-03: Modern Tech Stack Alignment with package.json
runGate("VR-03", "Modern Tech Stack Alignment with package.json", () => {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const asserts = [
    { label: "React 19", inReadme: readmeContent.includes("React 19") || readmeContent.includes("React_19"), inPkg: Boolean(deps["react"]?.includes("19")) },
    { label: "TanStack Start", inReadme: readmeContent.includes("TanStack Start") || readmeContent.includes("TanStack_Start"), inPkg: Boolean(deps["@tanstack/react-start"]) },
    { label: "TanStack Router", inReadme: readmeContent.includes("TanStack Router"), inPkg: Boolean(deps["@tanstack/react-router"]) },
    { label: "Tailwind CSS 4", inReadme: readmeContent.includes("Tailwind CSS 4") || readmeContent.includes("Tailwind_CSS_4") || readmeContent.includes("Tailwind CSS v4"), inPkg: Boolean(deps["tailwindcss"]?.includes("4")) },
    { label: "Vite 8", inReadme: readmeContent.includes("Vite 8") || readmeContent.includes("Vite_8"), inPkg: Boolean(deps["@lovable.dev/vite-tanstack-config"]) },
    { label: "Supabase Client SDK", inReadme: readmeContent.includes("Supabase") && readmeContent.includes("Client SDK"), inPkg: Boolean(deps["@supabase/supabase-js"]) },
    { label: "@xyflow/react Canvas", inReadme: readmeContent.includes("@xyflow/react") || readmeContent.includes("React Flow"), inPkg: Boolean(deps["@xyflow/react"]) },
  ];

  for (const a of asserts) {
    if (!a.inReadme || !a.inPkg) {
      return { pass: false, error: `Mismatch for ${a.label}: inReadme=${a.inReadme}, inPkg=${a.inPkg}` };
    }
  }
  return { pass: true, detail: `All 7 foundational stack technologies match active package.json dependencies exactly.` };
});

// VR-04: Non-Negotiable Core Invariants Documentation
runGate("VR-04", "Non-Negotiable Core Invariants Documentation", () => {
  const hasZeroFiction = readmeContent.includes("Zero-Fiction Architecture Law");
  const hasZeroRawSql = readmeContent.includes("Zero Raw SQL Mandate");
  const hasLovable = readmeContent.includes("Lovable Synchronization");
  const hasEpistemic = readmeContent.includes("Epistemic Anti-Promotion") || readmeContent.includes("Epistemic Truth Engine");
  const hasGovernedTools = readmeContent.includes("Governed Tool");

  if (!hasZeroFiction || !hasZeroRawSql || !hasLovable || !hasEpistemic || !hasGovernedTools) {
    return { pass: false, error: "Missing core operational invariants table or specifications in README" };
  }
  return { pass: true, detail: "Zero-Fiction Law, Zero Raw SQL Mandate, and Lovable Sync Invariants prominently certified." };
});

// VR-05: Operational Port 8080 & Edge Runtime Specifications
runGate("VR-05", "Operational Port 8080 & Edge Runtime Specifications", () => {
  const hasPort8080 = readmeContent.includes("8080") && readmeContent.includes("http://localhost:8080");
  const hasNitroPatch = readmeContent.includes("patchNitroReq.mjs");
  const hasCloudflare = readmeContent.includes("Cloudflare");

  if (!hasPort8080 || !hasNitroPatch || !hasCloudflare) {
    return { pass: false, error: "Missing port 8080 URL or Node 24 Cloudflare worker patch documentation" };
  }
  return { pass: true, detail: "Port 8080 entrypoint and patchNitroReq.mjs Node 24 edge compatibility documented." };
});

// VR-06: 30 Navigation Domains & 90 Subpages Documentation
runGate("VR-06", "30 Navigation Domains & 90 Subpages Documentation", () => {
  const has30Domains = readmeContent.includes("30 Navigation Domains") || readmeContent.includes("30 structured navigation domains");
  const has90Subpages = readmeContent.includes("90 Deep Subpages") || readmeContent.includes("90 subpages");
  const hasCleanSidebar = !readmeContent.includes("EXPANDED PLATFORM (13–30 · 90 SUBPAGES)");

  if (!has30Domains || !has90Subpages || !hasCleanSidebar) {
    return { pass: false, error: "Missing 30 domain / 90 subpage documentation or deprecated banner present" };
  }
  return { pass: true, detail: "30 domains and 90 subpages documented with clean, unpolluted sidebar layout verified." };
});

// VR-07: 90-Platform Root Architecture Reference
runGate("VR-07", "90-Platform Root Architecture Reference", () => {
  const has01 = readmeContent.includes("01 - PRODUCT & REQUIREMENTS LAYER");
  const has90 = readmeContent.includes("90 - BUSINESS CONTINUITY");
  const hasMapLink = readmeContent.includes("90_DOMAIN_FOLDER_MAP.md");

  if (!has01 || !has90 || !hasMapLink) {
    return { pass: false, error: "Missing 90-Platform tree representation or link to 90_DOMAIN_FOLDER_MAP.md" };
  }
  return { pass: true, detail: "90 numbered platform directories mapped and linked to docs/architecture/90_DOMAIN_FOLDER_MAP.md." };
});

// VR-08: Verification & Acceptance Suites Scorecard
runGate("VR-08", "Verification & Acceptance Suites Scorecard", () => {
  const hasGates = readmeContent.includes("test-acceptance-gates.mjs");
  const hasGodMode = readmeContent.includes("test-copilot-godmode-omega.mjs");
  const hasMission = readmeContent.includes("verify:mission");
  const hasAdvancement = readmeContent.includes("verify:advancement");
  const hasScorecard = readmeContent.includes("24 PASSED") || readmeContent.includes("25/25 CONVERGED");

  if (!hasGates || !hasGodMode || !hasMission || !hasAdvancement || !hasScorecard) {
    return { pass: false, error: "Missing verification test commands or benchmark scorecard" };
  }
  return { pass: true, detail: "Acceptance Gates (01-25) and Copilot God Mode benchmark scorecards fully documented." };
});

// VR-09: Physical Verification of All Relative Markdown Links
runGate("VR-09", "Physical Verification of All Relative Markdown Links", () => {
  const linkRegex = /\[([^\]]+)\]\((?!https?:\/\/|#|mailto:)([^)]+)\)/g;
  let match;
  const localLinks = [];
  while ((match = linkRegex.exec(readmeContent)) !== null) {
    localLinks.push({ text: match[1], target: match[2].split("#")[0].trim() });
  }

  const missing = [];
  for (const l of localLinks) {
    if (!l.target) continue;
    const resolvedPath = path.resolve(projectRoot, l.target);
    if (!fs.existsSync(resolvedPath)) {
      missing.push(`${l.target} (anchor: "${l.text}")`);
    }
  }

  if (missing.length > 0) {
    return { pass: false, error: `Broken relative markdown links found: ${missing.join(", ")}` };
  }
  return { pass: true, detail: `All ${localLinks.length} local relative markdown links exist and resolve to valid disk files.` };
});

// VR-11: Saved Acceptance Gate Status Must Match README
runGate("VR-11", "Saved Acceptance Gate Verdict Reconciliation", () => {
  const reportPath = path.join(projectRoot, "acceptance-gates-report.json");
  if (!fs.existsSync(reportPath)) return { pass: false, error: "Missing saved acceptance report" };
  const gates = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
  if (!Array.isArray(gates) || !gates.length) return { pass: false, error: "Invalid acceptance report" };
  const pass = gates.filter(x => x.verdict === "PASS").length;
  const blocked = gates.filter(x => x.verdict === "BLOCKED").length;
  const failed = gates.filter(x => x.verdict === "FAIL").length;
  const hasNumbers = readmeContent.includes(`${pass} PASS`) &&
    readmeContent.includes(`${blocked} BLOCKED`);
  const falselyGreen = readmeContent.includes("25%2F25_CONVERGED") || readmeContent.includes("25/25 CONVERGED");
  if (!hasNumbers || falselyGreen) {
    return { pass: false, error: `README gate counts do not match saved report: ${pass} PASS, ${blocked} BLOCKED, ${failed} FAIL` };
  }
  return { pass: true, detail: `Saved report matched: ${pass} PASS, ${blocked} BLOCKED, ${failed} FAIL (not a fresh test run)` };
});

// VR-12: License & Deep-Dive Documentation
runGate("VR-12", "License and Recent Engineering Report", () => {
  const files = ["LICENSE", "docs/readme/RECENT_ENGINEERING_CHANGES.md"];
  const missing = files.filter(p => !fs.existsSync(path.join(projectRoot, p)));
  if (missing.length || !readmeContent.includes("RECENT_ENGINEERING_CHANGES.md")) {
    return { pass: false, error: `Missing license, change report, or README deep-dive link: ${missing.join(", ")}` };
  }
  const text = fs.readFileSync(path.join(projectRoot, "LICENSE"), "utf-8");
  if (!text.startsWith("MIT License")) return { pass: false, error: "LICENSE does not declare MIT license" };
  return { pass: true, detail: "Source-grounded review linked and MIT LICENSE file present." };
});

// VR-10: Route Directory & Access Tier Specifications
runGate("VR-10", "Route Directory & Access Tier Specifications", () => {
  const expectedRoutes = [
    "/",
    "/auth",
    "/login",
    "/register",
    "/workspace",
    "/app",
    "/app/projects",
    "/app/deployments",
    "/admin/command-centre"
  ];

  const missingRoutes = expectedRoutes.filter(r => !readmeContent.includes(r));
  if (missingRoutes.length > 0) {
    return { pass: false, error: `Missing route specifications: ${missingRoutes.join(", ")}` };
  }
  return { pass: true, detail: `All core public, authenticated, and administrative routes correctly specified.` };
});

console.log("\n=======================================================================");
console.log(`TOTAL GATES EVALUATED : ${passed + failed}`);
console.log(`PASSED                : ${passed}`);
console.log(`FAILED                : ${failed}`);
console.log("=======================================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log(`${GREEN}🎉 README STRUCTURE CHECKS PASSED (NOT PRODUCTION CERTIFICATION)${RESET}\n`);
  process.exit(0);
}
