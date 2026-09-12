import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = value;
  }
});

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

async function runMissingColumnReport() {
  console.log("================================================================================");
  console.log("PHASE 0.1 — DRIFT-PROOF COMPANION SCHEMA: MISSING-COLUMN VERIFICATION REPORT");
  console.log("================================================================================\n");

  const requiredProjectColumns = [
    "id",
    "owner_id",
    "name",
    "slug",
    "description",
    "tags",
    "icon",
    "cover",
    "domain",
    "domain_secondary",
    "scale",
    "target_users",
    "accessibility",
    "platforms",
    "stack",
    "repo_full_name",
    "complexity_budget",
    "feature_toggles",
    "ai_tasks",
    "gate_strictness",
    "compliance_pack",
    "allow_override",
    "retention",
    "kpi_targets",
    "budget_cap_usd",
    "milestone",
    "cadence",
    "draft_state",
    "wizard_step",
    "health_score",
    "status",
  ];

  // 1. Check existing columns on projects table
  const { data: sampleRow, error: sampleErr } = await sb.from("projects").select("*").limit(1);
  if (sampleErr) {
    console.error("[-] Failed to query projects table:", sampleErr.message);
    process.exit(1);
  }

  const existingCols = new Set(Object.keys(sampleRow[0] || {}));
  console.log(`[i] Total columns currently detected on 'projects': ${existingCols.size}`);

  const missingColumns = requiredProjectColumns.filter((col) => !existingCols.has(col));

  console.log("\n--------------------------------------------------------------------------------");
  console.log("SQL MISSING-COLUMN REPORT OUTPUT:");
  console.log("--------------------------------------------------------------------------------");
  console.log("| Target Table | Required Column | Status  |");
  console.log("| :----------- | :-------------- | :------ |");

  for (const col of missingColumns) {
    console.log(`| projects     | ${col.padEnd(15)} | MISSING |`);
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(`Total Missing Columns on projects: ${missingColumns.length}`);
  console.log("--------------------------------------------------------------------------------\n");

  // 2. Also check catalog tables
  const catalogTables = ["project_domains", "project_personas", "llm_routing", "project_templates"];
  console.log("Catalog Tables Status:");
  for (const t of catalogTables) {
    const { count, error } = await sb.from(t).select("*", { count: "exact", head: true });
    console.log(`  Table '${t}': ${error ? "PENDING DDL (" + error.message + ")" : "ACTIVE (" + count + " rows)"}`);
  }

  return missingColumns;
}

runMissingColumnReport();
