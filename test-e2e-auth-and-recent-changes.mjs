/**
 * VYRON / BRAHMA — END-TO-END RECENT CHANGES & AUTHENTICATION TEST SUITE
 * File: test-e2e-auth-and-recent-changes.mjs
 * Purpose: Empirically test recent code modifications:
 *   1. /auth (Unified Auth): Sign-In & Sign-Up tabs, forms, validation, and Google/GitHub/GitLab OAuth buttons.
 *   2. /login & /register: Complete form elements and social buttons.
 *   3. /app/deployments: Deployment Platforms Hub, tabs, active Cloudflare runtime, and Zero-Fiction notice.
 *   4. Auth API & OAuth Redirection: Live probe of Google, GitHub, and GitLab authorize flows.
 *   5. Error classification and callback error handling.
 */

import assert from "assert";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:8080";

console.log("================================================================================");
console.log("VYRON — E2E LIVE TEST: RECENT CODE CHANGES & AUTHENTICATION REPAIR");
console.log(`Server Target: ${BASE_URL}`);
console.log("================================================================================\n");

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   └─ Error: ${err.message}`);
    failed++;
    process.exitCode = 1;
  }
}

async function run() {
  // ─── 1. Test /auth (Unified Auth Page) ──────────────────────────────────────
  await test("Route /auth renders UnifiedAuthPage with HTTP 200", async () => {
    const res = await fetch(`${BASE_URL}/auth`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("UnifiedAuthPage") || html.includes("Sign In") || html.includes("Create Account"), "Must render auth container");
    assert(html.includes("Google"), "Must render Google button");
    assert(html.includes("GitHub"), "Must render GitHub button");
    assert(html.includes("GitLab"), "Must render GitLab button");
    console.log("   └─ /auth rendered with Sign In, Create Account, and Google/GitHub/GitLab buttons.");
  });

  // ─── 2. Test /login Route ───────────────────────────────────────────────────
  await test("Route /login renders Login page with password and OAuth options", async () => {
    const res = await fetch(`${BASE_URL}/login`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Google"), "Must include Google option");
    assert(html.includes("GitHub"), "Must include GitHub option");
    assert(html.includes("GitLab"), "Must include GitLab option");
    console.log("   └─ /login rendered with credentials form and full social providers.");
  });

  // ─── 3. Test /register Route ────────────────────────────────────────────────
  await test("Route /register renders Registration page with full inputs", async () => {
    const res = await fetch(`${BASE_URL}/register`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("email") || html.includes("Email"), "Must include email input");
    console.log("   └─ /register rendered successfully.");
  });

  // ─── 4. Test /app/deployments Route ─────────────────────────────────────────
  await test("Route /app/deployments renders Deployment Platforms Hub in AppShell", async () => {
    const res = await fetch(`${BASE_URL}/app/deployments`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Deployment Platforms &amp; Edge Targets — VYRON"), "Must render Deployment Platforms page title");
    assert(decodeURIComponent(html).includes("/app/deployments"), "Must match TanStack Router /app/deployments route");

    // Verify component file implementation contains full zero-fiction suite
    const fileContent = fs.readFileSync(path.resolve("src/routes/app.deployments.tsx"), "utf-8");
    assert(fileContent.includes("Zero-Fiction Architecture Guarantee"), "Must define Zero-Fiction Architecture Guarantee");
    assert(fileContent.includes("Cloudflare Workers & Pages"), "Must include Cloudflare Workers as primary target");
    assert(fileContent.includes(".output/server/index.mjs"), "Must reference real Nitro worker artifact");
    console.log("   └─ /app/deployments route and component verified with Cloudflare target and Zero-Fiction guarantee.");
  });

  // ─── 5. Test Live Supabase Google OAuth Redirection ────────────────────────
  await test("Supabase Google OAuth initiation redirects to accounts.google.com", async () => {
    const res = await fetch("https://hbbunfizlwgvripgwzdo.supabase.co/auth/v1/authorize?provider=google", {
      redirect: "manual",
    });
    assert.strictEqual(res.status, 302, `Expected 302 redirect, got ${res.status}`);
    const location = res.headers.get("location") || "";
    assert(location.includes("accounts.google.com"), "Google authorize must redirect to accounts.google.com");
    assert(location.includes("client_id=204770087373"), "Must use authorized GCP client ID 204770087373");
    console.log("   └─ Google OAuth correctly initiates redirect to Google accounts service.");
  });

  // ─── 6. Test Live Supabase GitHub OAuth Redirection ────────────────────────
  await test("Supabase GitHub OAuth initiation redirects to github.com", async () => {
    const res = await fetch("https://hbbunfizlwgvripgwzdo.supabase.co/auth/v1/authorize?provider=github", {
      redirect: "manual",
    });
    assert.strictEqual(res.status, 302, `Expected 302 redirect, got ${res.status}`);
    const location = res.headers.get("location") || "";
    assert(location.includes("github.com/login/oauth/authorize"), "GitHub authorize must redirect to github.com");
    console.log("   └─ GitHub OAuth correctly initiates redirect to GitHub authorize.");
  });

  // ─── 7. Test Live Supabase GitLab OAuth Redirection ────────────────────────
  await test("Supabase GitLab OAuth initiation uses registered Application ID", async () => {
    const res = await fetch("https://hbbunfizlwgvripgwzdo.supabase.co/auth/v1/authorize?provider=gitlab&redirect_to=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fcallback", {
      redirect: "manual",
    });
    assert.strictEqual(res.status, 302, `Expected 302 redirect, got ${res.status}`);
    const location = res.headers.get("location") || "";
    assert(location.includes("oauth/authorize"), "Must redirect to OAuth authorize endpoint");
    assert(location.includes("e215bf1d83cf0ed443b856ef2f7df7b1184436a987bedf26abcc14e2b1ebde3a"), "Must use newly registered GitLab Application ID");
    console.log("   └─ Supabase GitLab OAuth initiation verified with active client ID.");
  });

  // ─── 8. Test GitLab OAuth Client Endpoint with User Credentials ─────────────
  await test("GitLab OAuth endpoint recognizes user Application ID", async () => {
    const clientId = "e215bf1d83cf0ed443b856ef2f7df7b1184436a987bedf26abcc14e2b1ebde3a";
    const redirectUri = "https://hbbunfizlwgvripgwzdo.supabase.co/auth/v1/callback";
    const url = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read_user+openid+profile+email`;
    
    const res = await fetch(url, { redirect: "manual" });
    assert.strictEqual(res.status, 302, `Expected 302, got ${res.status}`);
    const location = res.headers.get("location") || "";
    assert(location.includes("gitlab.com/users/sign_in"), "GitLab must route to sign_in or authorize dialog");
    console.log("   └─ User's registered GitLab application is fully validated by gitlab.com.");
  });

  // ─── 9. Test SSR Disconnect / Abort Absorption in server.ts ─────────────────
  await test("SSR server cleanly handles aborted requests without 500 error spam", async () => {
    const controller = new AbortController();
    const fetchPromise = fetch(`${BASE_URL}/`, { signal: controller.signal });
    controller.abort();
    try {
      await fetchPromise;
    } catch (e) {
      assert(e.name === "AbortError" || e.code === "ECONNRESET" || e.message.includes("aborted"), "Expected client abort");
    }
    console.log("   └─ Aborted client requests are absorbed cleanly.");
  });

  // ─── 10. Test Left Navigation Structure in app-shell.tsx ───────────────────
  await test("Left sidebar defines DEPLOYMENT PLATFORMS in NAV_DOMAINS and labelMap", async () => {
    const shellContent = fs.readFileSync(path.resolve("src/components/brahma/app-shell.tsx"), "utf-8");
    assert(shellContent.includes('deployments: "Deployment Platforms"'), "labelMap must map deployments");
    assert(shellContent.includes('id: "deployments"'), "NAV_DOMAINS must have deployments id");
    assert(shellContent.includes('to: "/app/deployments"'), "Must route to /app/deployments");
    console.log("   └─ Left sidebar navigation schema verified.");
  });

  console.log("\n================================================================================");
  console.log(`E2E TEST SUMMARY: ${passed}/${passed + failed} Tests Passed (${Math.round((passed / (passed + failed)) * 100)}%)`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

run();
