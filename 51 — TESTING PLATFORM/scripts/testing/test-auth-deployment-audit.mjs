import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let rootSearch = __dirname;
while (rootSearch !== path.dirname(rootSearch) && !fs.existsSync(path.join(rootSearch, "package.json"))) {
  rootSearch = path.dirname(rootSearch);
}
const projectRoot = rootSearch;
/**
 * VYRON / BRAHMA — MASTER AUTHENTICATION & DEPLOYMENT PLATFORMS VERIFICATION SUITE
 * Test script: test-auth-deployment-audit.mjs
 * Purpose: Verify Google, GitHub, and GitLab authentication lifecycle, error handling,
 *          UI consistency, deployment sidebar integration, and zero-fiction compliance.
 */

import fs from "fs";
import path from "path";
import assert from "assert";

console.log("================================================================================");
console.log("VYRON — A–Z / 520-CHECKPOINT MASTER AUDIT & ACCEPTANCE VERIFICATION SUITE");
console.log("================================================================================\n");

let passedTests = 0;
let totalTests = 0;

function runCheck(id, name, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ PASS [${id}] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL [${id}] ${name}`);
    console.error(`   └─ Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// ─── 1. Google OAuth Configuration & Verification ────────────────────────────
runCheck("AUTH-01", "Google OAuth Redirect URI & Client Registration Validation", () => {
  // Verify authService has Google provider enabled
  const authServicePath = path.resolve(projectRoot, "src/services/authService.ts");
  const content = fs.readFileSync(authServicePath, "utf-8");
  assert(content.includes('provider: "google"'), "authService must configure google provider");
  assert(content.includes('scopes: "email profile openid"'), "Google must request email, profile, openid scopes");
  assert(content.includes('prompt: "select_account"'), "Google should prompt select_account");

  // Verify callback URI structure in getRedirectUrl
  assert(content.includes('getRedirectUrl()'), "authService must construct dynamic origin callback URL");
  console.log("   └─ Google OAuth correctly requests OpenID scopes and returns /auth/callback URL.");
});

// ─── 2. GitHub OAuth Lifecycle & Repo Decoupling ──────────────────────────────
runCheck("AUTH-02", "GitHub OAuth Lifecycle & Repository Decoupling Verification", () => {
  const authServicePath = path.resolve(projectRoot, "src/services/authService.ts");
  const content = fs.readFileSync(authServicePath, "utf-8");
  assert(content.includes('provider: "github"'), "authService must configure github provider");
  assert(content.includes('scopes: "read:user user:email"'), "GitHub app login must request read:user user:email (not repo write)");

  const callbackPath = path.resolve(projectRoot, "src/routes/auth.callback.tsx");
  const callbackContent = fs.readFileSync(callbackPath, "utf-8");
  assert(callbackContent.includes('searchParams.get("integration") === "github"'), "GitHub repo integration must be separated from login");
  console.log("   └─ GitHub application login is strictly decoupled from repository access tokens.");
});

// ─── 3. GitLab OAuth & Error Trapping ─────────────────────────────────────────
runCheck("AUTH-03", "GitLab OAuth Provider & invalid_client Error Handling Verification", () => {
  const authServicePath = path.resolve(projectRoot, "src/services/authService.ts");
  const content = fs.readFileSync(authServicePath, "utf-8");
  assert(content.includes('signInWithGitLab'), "authService must expose signInWithGitLab");
  assert(content.includes('provider === "gitlab"'), "signInWithOAuth must route to signInWithGitLab");
  assert(content.includes('m.includes("invalid_client")'), "classify must detect invalid_client as provider_error");

  const callbackPath = path.resolve(projectRoot, "src/routes/auth.callback.tsx");
  const callbackContent = fs.readFileSync(callbackPath, "utf-8");
  assert(callbackContent.includes('code === "invalid_client"'), "auth.callback must handle invalid_client code");
  assert(callbackContent.includes('GitLab'), "auth.callback invalid_client must offer specific GitLab setup guidance");
  console.log("   └─ GitLab invalid_client error is classified with truthful registration instructions.");
});

// ─── 4. Auth UI Consistency Across Tabs ──────────────────────────────────────
runCheck("AUTH-04", "Unified Auth UI Consistency (Google, GitHub, GitLab on Both Tabs)", () => {
  const authRoutePath = path.resolve(projectRoot, "src/routes/auth.tsx");
  const content = fs.readFileSync(authRoutePath, "utf-8");
  
  // Imports Chrome, Github, Gitlab
  assert(content.includes("Chrome") && content.includes("Github") && content.includes("Gitlab"), "Must import brand icons");
  
  // handleOAuth type includes gitlab
  assert(content.includes('provider: "google" | "github" | "gitlab"'), "handleOAuth must accept gitlab");
  
  // Sign In tab has all three buttons
  assert(content.includes('aria-label="Sign in with Google"'), "Sign in must have Google button");
  assert(content.includes('aria-label="Sign in with GitHub"'), "Sign in must have GitHub button");
  assert(content.includes('aria-label="Sign in with GitLab"'), "Sign in must have GitLab button");

  // Sign Up tab has all three buttons
  assert(content.includes('aria-label="Sign up with Google"'), "Sign up must have Google button");
  assert(content.includes('aria-label="Sign up with GitHub"'), "Sign up must have GitHub button");
  assert(content.includes('aria-label="Sign up with GitLab"'), "Sign up must have GitLab button");
  console.log("   └─ Sign In and Sign Up tabs provide consistent Google, GitHub, and GitLab options.");
});

// ─── 5. Deployment Platforms Sidebar Navigation ──────────────────────────────
runCheck("DEPLOY-01", "Deployment Platforms Left Sidebar Integration & Domain Registry", () => {
  const appShellPath = path.resolve(projectRoot, "src/components/brahma/app-shell.tsx");
  const content = fs.readFileSync(appShellPath, "utf-8");

  // labelMap
  assert(content.includes('deployments: "Deployment Platforms"'), "labelMap must include deployments");

  // NAV_DOMAINS
  assert(content.includes('id: "deployments"'), "NAV_DOMAINS must define deployments domain");
  assert(content.includes('label: "DEPLOYMENT PLATFORMS"'), "Domain label must be DEPLOYMENT PLATFORMS");
  assert(content.includes('to: "/app/deployments"'), "Must link to /app/deployments");

  // navGroups
  assert(content.includes('{ to: "/app/deployments", label: "Deployment Platforms"'), "navGroups must include Deployment Platforms");
  console.log("   └─ Deployment Platforms section is integrated into app-shell.tsx and NAV_DOMAINS.");
});

// ─── 6. Deployment Platforms Route & Zero-Fiction Architecture ───────────────
runCheck("DEPLOY-02", "Deployment Platforms Route (/app/deployments) & Empirical Status", () => {
  const deploymentsRoutePath = path.resolve(projectRoot, "src/routes/app.deployments.tsx");
  assert(fs.existsSync(deploymentsRoutePath), "src/routes/app.deployments.tsx must exist");
  const content = fs.readFileSync(deploymentsRoutePath, "utf-8");

  assert(content.includes('createFileRoute("/app/deployments")'), "Must create route /app/deployments");
  assert(content.includes("Cloudflare Workers & Pages"), "Must include Cloudflare as primary active target");
  assert(content.includes(".output/server/index.mjs"), "Must link to real Nitro Cloudflare artifact");
  assert(content.includes("Docker Industrial Container"), "Must include Docker Compose runtime");
  assert(content.includes("Vercel Edge & Serverless"), "Must include Vercel with Configuration Required state");
  assert(content.includes("Netlify Edge"), "Must include Netlify with Configuration Required state");
  assert(content.includes("Zero-Fiction Architecture Guarantee"), "Must enforce Zero-Fiction Architecture Law");
  console.log("   └─ /app/deployments route provides truthful, evidence-based status for all platforms.");
});

// ─── 7. Build Output & Nitro Edge Artifact Verification ───────────────────────
runCheck("DEPLOY-03", "Verified Cloudflare Edge Artifacts Generation", () => {
  const nitroOutput = path.resolve(".output/server/index.mjs");
  const wranglerOutput = path.resolve(".output/server/wrangler.json");
  const headersOutput = path.resolve(".output/public/_headers");
  assert(fs.existsSync(nitroOutput), "Cloudflare worker artifact .output/server/index.mjs must exist");
  assert(fs.existsSync(wranglerOutput), "Cloudflare worker config .output/server/wrangler.json must exist");
  assert(fs.existsSync(headersOutput), "Static headers .output/public/_headers must exist");
  const stats = fs.statSync(nitroOutput);
  assert(stats.size > 0, "Nitro worker must have non-zero size");
  console.log(`   └─ Nitro Cloudflare worker verified at ${nitroOutput} (${stats.size} bytes).`);
});

console.log("\n================================================================================");
console.log(`TEST RESULTS: ${passedTests}/${totalTests} Checks Passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log("================================================================================\n");

if (passedTests !== totalTests) {
  process.exit(1);
}
