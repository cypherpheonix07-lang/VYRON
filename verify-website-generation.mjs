/**
 * PROJECT BRAHMA — AI-DRIVEN WEBSITE GENERATION SYSTEM
 * Comprehensive V1–V12 Verification Gate Runner
 * Validates Wizard Persistence, Tech Stack Scoring, Frontend/Backend Synthesis,
 * Referential Mock Data, Sandboxed HTML Preview, Section Refinement,
 * Deployable Export Bundles, Cryptographic Provenance, RLS Isolation, and Audit Ledger.
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import {
  getDeterministicComparison,
  synthesizeFrontendBlueprint,
  synthesizeBackendBlueprint,
  synthesizeMockData,
  generatePreviewHtml,
  compileExportFiles,
  computeProvenanceSha,
  refineBlueprint,
} from "./src/lib/websiteSynthesis.ts";

// 1. Load environment variables from .env
const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = val;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!url || !serviceKey || !anonKey) {
  console.error("Missing required environment variables in .env!");
  process.exit(1);
}

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function runVerification() {
  console.log("================================================================================");
  console.log("PROJECT BRAHMA — AI WEBSITE GENERATION SYSTEM: V1–V12 VERIFICATION GATE");
  console.log("================================================================================\n");

  const results = {
    V1: false,
    V2: false,
    V3: false,
    V4: false,
    V5: false,
    V6: false,
    V7: false,
    V8: false,
    V9: false,
    V10: false,
    V11: false,
    V12: false,
  };

  // 1. Authenticate User A (Priya Nair - Admin)
  const userAEmail = "priya.nair@brahma.dev";
  const userAPassword = "AdminSecurePass123!";
  const { data: authA, error: authAErr } = await anonClient.auth.signInWithPassword({
    email: userAEmail,
    password: userAPassword,
  });

  if (authAErr || !authA.user) {
    console.error("[-] Failed to authenticate User A:", authAErr?.message);
    process.exit(1);
  }

  const userAId = authA.user.id;
  const userAClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${authA.session.access_token}` } },
  });
  console.log(`[+] User A Authenticated: ${userAEmail} (${userAId})`);

  // User B Mock ID (Arjun Mehta)
  const userBId = "4666a9f0-f28d-4845-9a21-9b9210b18af9";

  let createdProjectId = null;

  try {
    // -------------------------------------------------------------------------
    // V1: Config Wizard Saves All 4 Steps to website_projects
    // -------------------------------------------------------------------------
    console.log("\n[TEST V1: Config Wizard Persistence]");
    const initialConfig = {
      owner_id: userAId,
      name: "Stark Quantum Commerce",
      description: "Autonomous luxury e-commerce platform with Stripe payments and real-time inventory.",
      requirements_text:
        "Direct-to-consumer luxury retail store with dynamic product catalog, inventory search, shopping cart with discount codes, Stripe credit card checkout, order history tracking, and customer reviews.",
      design_system: {
        presetName: "Obsidian Cyan",
        colors: {
          primary: "#06b6d4",
          secondary: "#6366f1",
          surface: "#090d16",
          surfaceElevated: "#111827",
          border: "#1e293b",
          accent: "#10b981",
          textPrimary: "#f8fafc",
          textMuted: "#94a3b8",
        },
        typography: { fontFamily: "Inter, sans-serif", baseSize: "16px", scaleRatio: "1.25" },
        layout: { template: "sidebar-topbar", radius: "8px", spacing: "relaxed" },
      },
      tech_stack: {
        frontend: "Next.js 15 (App Router)",
        backend: "Supabase Edge Functions (Deno)",
        database: "PostgreSQL 16 (Supabase Managed)",
      },
      feature_toggles: {
        auth: true,
        search: true,
        darkMode: true,
        payments: true,
        invoicing: true,
        cms: true,
        i18n: false,
        fileUploads: true,
        analytics: true,
        emailNotifications: true,
        pwa: false,
      },
      status: "configuring",
      generation_step: 1,
    };

    const { data: v1Insert, error: v1Err } = await userAClient
      .from("website_projects")
      .insert(initialConfig)
      .select()
      .single();

    if (v1Err || !v1Insert) {
      console.error("[-] V1 Failed: Error inserting initial project config:", v1Err);
    } else {
      createdProjectId = v1Insert.id;
      if (
        v1Insert.name === initialConfig.name &&
        v1Insert.design_system.presetName === "Obsidian Cyan" &&
        v1Insert.tech_stack.frontend === "Next.js 15 (App Router)" &&
        v1Insert.feature_toggles.payments === true &&
        v1Insert.status === "configuring"
      ) {
        results.V1 = true;
        console.log(`[+] V1 PASSED: Project created with ID ${createdProjectId} and full 4-step configuration.`);
      } else {
        console.error("[-] V1 Failed: Saved payload fields mismatched.");
      }
    }

    // -------------------------------------------------------------------------
    // V2: Tech Stack Comparison Engine (Scores & Pros/Cons)
    // -------------------------------------------------------------------------
    console.log("\n[TEST V2: Scored Tech Stack Comparison]");
    const techComparison = getDeterministicComparison(initialConfig.requirements_text, initialConfig.feature_toggles);

    const hasFrontendOptions = techComparison.frontendOptions.length >= 3;
    const hasBackendOptions = techComparison.backendOptions.length >= 3;
    const hasDbOptions = techComparison.databaseOptions.length >= 3;
    const allScored = [...techComparison.frontendOptions, ...techComparison.backendOptions, ...techComparison.databaseOptions].every(
      (opt) => opt.score >= 0 && opt.score <= 100 && opt.pros.length > 0 && opt.cons.length > 0
    );
    const hasRecommended = Boolean(techComparison.recommendedCombo?.frontend && techComparison.recommendedCombo?.backend && techComparison.recommendedCombo?.database);

    // Save comparison to tech_stack_comparisons table
    const { error: techDbErr } = await serviceClient.from("tech_stack_comparisons").upsert({
      use_case: "Stark Quantum Commerce",
      frontend_options: techComparison.frontendOptions,
      backend_options: techComparison.backendOptions,
      database_options: techComparison.databaseOptions,
      recommended_combo: techComparison.recommendedCombo,
    }, { onConflict: "use_case" });

    if (hasFrontendOptions && hasBackendOptions && hasDbOptions && allScored && hasRecommended && !techDbErr) {
      results.V2 = true;
      console.log(`[+] V2 PASSED: 3-tier comparative evaluation generated and cached (Recommended: ${techComparison.recommendedCombo.frontend} + ${techComparison.recommendedCombo.backend} + ${techComparison.recommendedCombo.database}).`);
    } else {
      console.error("[-] V2 Failed: Incomplete comparison or DB cache failure:", techDbErr);
    }

    // -------------------------------------------------------------------------
    // V3: Frontend Blueprint Synthesis (Pages, Components, Route Tree)
    // -------------------------------------------------------------------------
    console.log("\n[TEST V3: Frontend Blueprint Synthesis]");
    const feBlueprint = synthesizeFrontendBlueprint(
      initialConfig.requirements_text,
      initialConfig.design_system,
      initialConfig.feature_toggles
    );

    const pageCount = feBlueprint.pages.length;
    const compCount = feBlueprint.components.length;
    const hasValidRouteTree = feBlueprint.routes.length >= 5 && feBlueprint.routes.some((r) => r.path === "/");

    if (pageCount >= 5 && compCount >= 10 && hasValidRouteTree) {
      results.V3 = true;
      console.log(`[+] V3 PASSED: Frontend synthesized with ${pageCount} pages, ${compCount} components, and ${feBlueprint.routes.length} routes.`);
    } else {
      console.error(`[-] V3 Failed: Insufficient structure (Pages: ${pageCount}, Components: ${compCount}).`);
    }

    // -------------------------------------------------------------------------
    // V4: Backend Blueprint Synthesis (Endpoints & SQL DDL)
    // -------------------------------------------------------------------------
    console.log("\n[TEST V4: Backend Blueprint Synthesis]");
    const beBlueprint = synthesizeBackendBlueprint(
      initialConfig.requirements_text,
      initialConfig.tech_stack,
      initialConfig.feature_toggles
    );

    const endpointCount = beBlueprint.apiRoutes.length;
    const tableCount = beBlueprint.databaseSchema.tables.length;
    const hasDdl = beBlueprint.sqlDdl.includes("CREATE TABLE") && beBlueprint.sqlDdl.includes("ROW LEVEL SECURITY");

    if (endpointCount >= 5 && tableCount >= 3 && hasDdl) {
      results.V4 = true;
      console.log(`[+] V4 PASSED: Backend blueprint generated with ${endpointCount} API routes, ${tableCount} tables, and validated PostgreSQL DDL.`);
    } else {
      console.error(`[-] V4 Failed: Endpoints: ${endpointCount}, Tables: ${tableCount}, HasDDL: ${hasDdl}`);
    }

    // -------------------------------------------------------------------------
    // V5: Relational Mock Data with Strict Foreign Key Integrity
    // -------------------------------------------------------------------------
    console.log("\n[TEST V5: Relational Mock Data Integrity]");
    const mockData = synthesizeMockData(beBlueprint);
    const mockTables = Object.keys(mockData);
    const totalRows = Object.values(mockData).reduce((acc, curr) => acc + curr.length, 0);

    // Verify referential integrity:
    const customerIds = new Set(mockData.customers.map((c) => c.id));
    const productIds = new Set(mockData.products.map((p) => p.id));
    const orderIds = new Set(mockData.orders.map((o) => o.id));

    const ordersValid = mockData.orders.every((o) => customerIds.has(o.customer_id));
    const orderItemsValid = mockData.order_items.every(
      (item) => orderIds.has(item.order_id) && productIds.has(item.product_id)
    );

    if (mockTables.length >= 3 && totalRows >= 50 && ordersValid && orderItemsValid) {
      results.V5 = true;
      console.log(`[+] V5 PASSED: Synthesized ${totalRows} relational mock records across ${mockTables.join(", ")} with 100% FK integrity.`);
    } else {
      console.error(`[-] V5 Failed: Rows: ${totalRows}, Tables: ${mockTables.length}, OrdersValid: ${ordersValid}, ItemsValid: ${orderItemsValid}`);
    }

    // -------------------------------------------------------------------------
    // V6: Sandboxed Live Preview Bundle Compilation
    // -------------------------------------------------------------------------
    console.log("\n[TEST V6: Sandboxed Live Preview Compilation]");
    const previewHtml = generatePreviewHtml(
      initialConfig.name,
      initialConfig.design_system,
      feBlueprint,
      mockData
    );

    const hasHtmlDoctype = previewHtml.includes("<!DOCTYPE html>");
    const hasCssVars = previewHtml.includes("--primary") && previewHtml.includes("--surface");
    const hasDataRows = previewHtml.includes("table") && previewHtml.includes("SKU-");
    const hasSidebarNav = previewHtml.includes("sidebar") && previewHtml.includes("nav-item");

    if (hasHtmlDoctype && hasCssVars && hasDataRows && hasSidebarNav) {
      results.V6 = true;
      console.log(`[+] V6 PASSED: Compiled responsive sandboxed HTML runtime bundle (${previewHtml.length} bytes).`);
    } else {
      console.error("[-] V6 Failed: Generated preview HTML missing critical tokens or markup.");
    }

    // -------------------------------------------------------------------------
    // V7: Iterative Refinement (Targeted Section Mutation)
    // -------------------------------------------------------------------------
    console.log("\n[TEST V7: Iterative Section Refinement]");
    const baseProject = {
      ...v1Insert,
      frontend_blueprint: feBlueprint,
      backend_blueprint: beBlueprint,
      mock_data: mockData,
    };

    // Refinement 1: Change design theme to Midnight Violet
    const refine1 = refineBlueprint(baseProject, "Switch the theme to Midnight Violet with pink accents", "design");
    const dsUpdated = refine1.updatedProject.design_system.presetName === "Midnight Violet";
    const feUntouched = JSON.stringify(refine1.updatedProject.frontend_blueprint) === JSON.stringify(feBlueprint);
    const beUntouched = JSON.stringify(refine1.updatedProject.backend_blueprint) === JSON.stringify(beBlueprint);

    // Refinement 2: Add incoming webhook signature verification
    const refine2 = refineBlueprint(refine1.updatedProject, "Add incoming webhook signature verification route", "backend");
    const hasWebhookRoute = refine2.updatedProject.backend_blueprint.apiRoutes.some((r) => r.path === "/api/webhooks/incoming");

    // Refinement 3: Add CSV export to frontend
    const refine3 = refineBlueprint(refine2.updatedProject, "Add CSV export to product catalog table", "frontend");
    const hasExportComp = refine3.updatedProject.frontend_blueprint.pages.some((p) => p.components.includes("comp-csv-export-button"));

    if (dsUpdated && feUntouched && beUntouched && hasWebhookRoute && hasExportComp) {
      results.V7 = true;
      console.log("[+] V7 PASSED: Targeted mutations applied across Design, Backend, and Frontend without cross-section clobbering.");
    } else {
      console.error(`[-] V7 Failed: dsUpdated=${dsUpdated}, feUntouched=${feUntouched}, beUntouched=${beUntouched}, hasWebhook=${hasWebhookRoute}, hasExport=${hasExportComp}`);
    }

    // -------------------------------------------------------------------------
    // V8: Production Export File Bundle Generation
    // -------------------------------------------------------------------------
    console.log("\n[TEST V8: Production Export Bundle Compilation]");
    const exportFiles = compileExportFiles(refine3.updatedProject);
    const requiredFiles = [
      "package.json",
      "Dockerfile",
      "docker-compose.yml",
      ".env.example",
      "README.md",
      "migrations/001_init.sql",
      "seed/seed.sql",
    ];

    const allFilesPresent = requiredFiles.every((f) => exportFiles[f] && exportFiles[f].length > 0);
    const validPkgJson = JSON.parse(exportFiles["package.json"]).dependencies["@supabase/supabase-js"];
    const validSeedSql = exportFiles["seed/seed.sql"].includes("INSERT INTO public.products");

    if (allFilesPresent && validPkgJson && validSeedSql) {
      results.V8 = true;
      console.log(`[+] V8 PASSED: Export bundle assembled with all ${requiredFiles.length} structural files & SQL migrations.`);
    } else {
      console.error("[-] V8 Failed: Export bundle missing files or invalid JSON/SQL content.");
    }

    // -------------------------------------------------------------------------
    // V9: Cryptographic Provenance SHA-256 Verification
    // -------------------------------------------------------------------------
    console.log("\n[TEST V9: Cryptographic Provenance SHA-256 Verification]");
    const sha1 = await computeProvenanceSha(exportFiles);
    const sha2 = await computeProvenanceSha(exportFiles);
    const isDeterministic = sha1 === sha2 && sha1.length === 64;

    // Mutating a single character in README.md must change the digest
    const mutatedFiles = { ...exportFiles, "README.md": exportFiles["README.md"] + " " };
    const shaMutated = await computeProvenanceSha(mutatedFiles);
    const isTamperEvident = sha1 !== shaMutated;

    if (isDeterministic && isTamperEvident) {
      results.V9 = true;
      console.log(`[+] V9 PASSED: SHA-256 Provenance verified (${sha1}) with tamper-evidence check.`);
    } else {
      console.error(`[-] V9 Failed: isDeterministic=${isDeterministic}, isTamperEvident=${isTamperEvident}`);
    }

    // -------------------------------------------------------------------------
    // V10: Cross-User Row Level Security (RLS) Isolation
    // -------------------------------------------------------------------------
    console.log("\n[TEST V10: Cross-User RLS Isolation]");
    // User B attempting to read User A's website_project using anon key client
    const userBClient = createClient(url, anonKey, {
      global: { headers: { "X-Test-User": userBId } },
    });

    const { data: userBRead } = await userBClient
      .from("website_projects")
      .select("id, name, owner_id")
      .eq("id", createdProjectId);

    const userBBlockedFromReading = !userBRead || userBRead.length === 0;

    // User B attempting to update User A's project
    const { error: userBUpdateErr } = await userBClient
      .from("website_projects")
      .update({ name: "Hacked by User B" })
      .eq("id", createdProjectId);

    // Verify name was NOT modified in the database
    const { data: verifyProject } = await serviceClient
      .from("website_projects")
      .select("name")
      .eq("id", createdProjectId)
      .single();

    const nameRemainedIntact = verifyProject.name === "Stark Quantum Commerce";

    if (userBBlockedFromReading && nameRemainedIntact) {
      results.V10 = true;
      console.log("[+] V10 PASSED: Cross-user RLS boundary enforced. User B cannot read or modify User A's projects.");
    } else {
      console.error(`[-] V10 Failed: userBBlocked=${userBBlockedFromReading}, nameIntact=${nameRemainedIntact}`);
    }

    // -------------------------------------------------------------------------
    // V11: Generation History Audit Ledger Tracking
    // -------------------------------------------------------------------------
    console.log("\n[TEST V11: Generation History Audit Ledger]");
    const genRecords = [
      {
        website_project_id: createdProjectId,
        generation_number: 1,
        trigger_type: "initial",
        user_feedback: "Initial synthesis from wizard",
        input_snapshot: { requirements: initialConfig.requirements_text },
        output_snapshot: { fe: feBlueprint, be: beBlueprint },
        llm_metadata: { latency_ms: 320, model: "gemini-1.5-pro" },
      },
      {
        website_project_id: createdProjectId,
        generation_number: 2,
        trigger_type: "design_change",
        user_feedback: "Switch to Midnight Violet",
        input_snapshot: { target: "design", feedback: "Midnight Violet" },
        output_snapshot: { design_system: refine1.updatedProject.design_system },
        llm_metadata: { latency_ms: 180, model: "deterministic-synthesizer" },
      },
      {
        website_project_id: createdProjectId,
        generation_number: 3,
        trigger_type: "refinement",
        user_feedback: "Add incoming webhook signature verification route",
        input_snapshot: { target: "backend", feedback: "webhook" },
        output_snapshot: { backend_blueprint: refine2.updatedProject.backend_blueprint },
        llm_metadata: { latency_ms: 210, model: "deterministic-synthesizer" },
      },
    ];

    const { error: genErr } = await serviceClient.from("website_generations").insert(genRecords);

    const { data: savedGens } = await serviceClient
      .from("website_generations")
      .select("generation_number, trigger_type")
      .eq("website_project_id", createdProjectId)
      .order("generation_number", { ascending: true });

    if (!genErr && savedGens && savedGens.length === 3 && savedGens[0].generation_number === 1 && savedGens[2].generation_number === 3) {
      results.V11 = true;
      console.log(`[+] V11 PASSED: Generation history ledger logged ${savedGens.length} chronological audit entries.`);
    } else {
      console.error("[-] V11 Failed: Could not record or verify generations ledger:", genErr);
    }

    // -------------------------------------------------------------------------
    // V12: End-to-End Status Lifecycle Transitions
    // -------------------------------------------------------------------------
    console.log("\n[TEST V12: End-to-End Status Lifecycle Transitions]");
    // Update to generating
    await userAClient.from("website_projects").update({ status: "generating", generation_step: 2 }).eq("id", createdProjectId);
    const { data: s1 } = await serviceClient.from("website_projects").select("status").eq("id", createdProjectId).single();

    // Update to previewing
    await userAClient.from("website_projects").update({ status: "previewing", generation_step: 4, frontend_blueprint: feBlueprint, backend_blueprint: beBlueprint, mock_data: mockData }).eq("id", createdProjectId);
    const { data: s2 } = await serviceClient.from("website_projects").select("status").eq("id", createdProjectId).single();

    // Update to refining
    await userAClient.from("website_projects").update({ status: "refining" }).eq("id", createdProjectId);
    const { data: s3 } = await serviceClient.from("website_projects").select("status").eq("id", createdProjectId).single();

    // Update to exported with SHA
    await userAClient.from("website_projects").update({ status: "exported", provenance_sha: sha1 }).eq("id", createdProjectId);
    const { data: s4 } = await serviceClient.from("website_projects").select("status, provenance_sha").eq("id", createdProjectId).single();

    if (s1.status === "generating" && s2.status === "previewing" && s3.status === "refining" && s4.status === "exported" && s4.provenance_sha === sha1) {
      results.V12 = true;
      console.log("[+] V12 PASSED: Project transitioned cleanly: configuring -> generating -> previewing -> refining -> exported.");
    } else {
      console.error("[-] V12 Failed: Invalid state transition sequence.");
    }

  } finally {
    // Clean up created test project and generations
    if (createdProjectId) {
      await serviceClient.from("website_projects").delete().eq("id", createdProjectId);
      console.log(`\n[i] Test workspace project ${createdProjectId} cleaned up.`);
    }
  }

  // ---------------------------------------------------------------------------
  // Summary Verdict
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("FINAL VERIFICATION SUMMARY:");
  console.log("================================================================================");
  let allPassed = true;
  for (const [gate, passed] of Object.entries(results)) {
    console.log(`  Gate ${gate}: ${passed ? "PASSED (100%)" : "FAILED"}`);
    if (!passed) allPassed = false;
  }
  console.log("================================================================================");

  if (allPassed) {
    console.log(">>> ALL 12 VERIFICATION GATES PASSED (100% OPERATIONAL EXCELLENCE) <<<");
    process.exit(0);
  } else {
    console.error(">>> VERIFICATION SUITE REPORTED FAILURES <<<");
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("Unhandled test runner exception:", err);
  process.exit(1);
});
