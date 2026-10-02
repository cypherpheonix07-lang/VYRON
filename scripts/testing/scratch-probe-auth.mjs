import fs from "fs";

async function run() {
  console.log("==================================================================");
  console.log("   VYRON BLACK-BOX QA: AUTHENTICATION & REGISTRATION AUDIT        ");
  console.log("==================================================================\n");

  // Probe /login
  const loginRes = await fetch("http://localhost:8080/login");
  const loginHtml = await loginRes.text();

  console.log("[1] LOGIN VIEW AUDIT (/login):");
  console.log("  HTTP Status:", loginRes.status);
  console.log("  Page Length:", loginHtml.length);
  const loginInputs = [...loginHtml.matchAll(/<input[^>]*name=["']([^"']+)["'][^>]*>/gi)].map(
    (m) => m[1],
  );
  console.log("  Form Inputs:", loginInputs);
  console.log(
    "  Supports Magic Link Tab:",
    loginHtml.includes("Magic Link") || loginHtml.includes("magic-link"),
  );
  console.log(
    "  Supports Google OAuth:",
    loginHtml.includes("Google") || loginHtml.includes("google"),
  );
  console.log(
    "  Supports GitHub OAuth:",
    loginHtml.includes("GitHub") || loginHtml.includes("github"),
  );
  console.log(
    "  Has Demo Mode Switch / Bypass:",
    loginHtml.includes("Demo") || loginHtml.includes("demo"),
  );
  console.log(
    "  Has Anti-Open Redirect Guard:",
    loginHtml.includes("redirect") || loginHtml.includes("returnUrl"),
  );

  // Probe /register
  const regRes = await fetch("http://localhost:8080/register");
  const regHtml = await regRes.text();

  console.log("\n[2] REGISTRATION WIZARD AUDIT (/register):");
  console.log("  HTTP Status:", regRes.status);
  console.log("  Page Length:", regHtml.length);
  const regInputs = [...regHtml.matchAll(/<input[^>]*name=["']([^"']+)["'][^>]*>/gi)].map(
    (m) => m[1],
  );
  console.log("  Form Inputs:", regInputs);
  console.log(
    "  Supports Multi-Stage Wizard:",
    regHtml.includes("step") || regHtml.includes("Stage") || regHtml.includes("Role"),
  );
  console.log(
    "  Has Password Strength Meter:",
    regHtml.includes("Strength") || regHtml.includes("strength") || regHtml.includes("entropy"),
  );
  console.log(
    "  Has Draft Persistence:",
    regHtml.includes("draft") || regHtml.includes("sessionStorage"),
  );
  console.log("  Anti-Trapping Link to Sign-In:", regHtml.includes("/login"));

  // Probe /app protection
  const appRes = await fetch("http://localhost:8080/app");
  const appHtml = await appRes.text();
  console.log("\n[3] PROTECTED ROUTE ACCESS (/app):");
  console.log("  HTTP Status:", appRes.status);
  console.log("  Page Length:", appHtml.length);
  console.log(
    "  Redirected to login:",
    appRes.redirected || (appHtml.includes("/login") && !appHtml.includes("Dashboard")),
  );
}

run().catch(console.error);
