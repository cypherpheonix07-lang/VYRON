import fs from "fs";

async function run() {
  console.log("==================================================================");
  console.log("   VYRON BLACK-BOX QA: NEW PROJECT AI CONTROL PLANE AUDIT         ");
  console.log("==================================================================\n");

  const res = await fetch("http://localhost:8080/app/projects/new");
  const html = await res.text();

  console.log("HTTP Status:", res.status);
  console.log("HTML Size (bytes):", html.length);

  const stages = [
    "01_INTENT",
    "02_PROBLEM",
    "03_REQUIREMENTS",
    "04_SCOPE",
    "05_CAPABILITY",
    "06_ARCHITECTURE",
    "07_TECHNOLOGY",
    "08_DATA",
    "09_AI_DESIGN",
    "10_SECURITY",
    "11_RELIABILITY",
    "12_IMPLEMENTATION",
    "13_TESTING",
    "14_BLUEPRINT",
  ];

  console.log("\n[1] 14-STAGE WORKSPACE COVERAGE IN SSR HTML:");
  stages.forEach((st) => {
    const present = html.includes(st);
    console.log(`  Stage [${st}]: ${present ? "RENDERED / INCLUDED" : "NOT FOUND"}`);
  });

  console.log("\n[2] AI PROVIDER FABRIC CONTROLS:");
  console.log(
    "  OpenRouter mentioned:",
    html.includes("OpenRouter") || html.includes("openrouter"),
  );
  console.log("  OpenAI mentioned:", html.includes("OpenAI") || html.includes("openai"));
  console.log(
    "  Deterministic Mode mentioned:",
    html.includes("Deterministic") || html.includes("mock"),
  );
  console.log("  Token Budgeting mentioned:", html.includes("Token") || html.includes("budget"));

  console.log("\n[3] ARCHITECTURAL GOVERNANCE CONTROLS:");
  console.log("  ADR / Technology Rationale:", html.includes("ADR") || html.includes("Decision"));
  console.log(
    "  RLS Policy Enforcement:",
    html.includes("RLS") || html.includes("Row Level Security"),
  );
  console.log(
    "  Reliability / Circuit Breakers:",
    html.includes("Circuit Breaker") || html.includes("timeout"),
  );
  console.log(
    "  Traceability Matrix / Assertion Contracts:",
    html.includes("Traceability") || html.includes("Assertion"),
  );
  console.log(
    "  Pre-Initialization Freeze Dialog:",
    html.includes("Freeze") || html.includes("Blueprint") || html.includes("Provision"),
  );
}

run().catch(console.error);
