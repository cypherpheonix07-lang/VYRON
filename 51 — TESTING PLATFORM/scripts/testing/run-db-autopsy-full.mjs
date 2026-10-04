import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log("=== SECTION 1 — FORENSIC SWEEP 7 (SUPABASE DATABASE AUTOPSY) ===\n");

  // Check 1: What tables actually exist & row counts
  console.log("--- 1. TABLE INVENTORY & ROW COUNTS ---");
  const tableNames = [
    "profiles",
    "auth_events",
    "user_integrations",
    "integration_events",
    "projects",
    "requirements",
    "blueprint_nodes",
    "notifications",
    "github_tokens",
    "audit_logs",
    "webhook_ingest",
    "llm_configs",
    "llm_usage_logs",
    "llm_prompt_templates",
  ];

  for (const t of tableNames) {
    try {
      const { data, count, error } = await serviceClient
        .from(t)
        .select("*", { count: "exact", head: true });
      if (error) {
        console.log(`Table '${t}': NOT FOUND / ERROR (${error.code}: ${error.message})`);
      } else {
        console.log(`Table '${t}': EXISTS (Rows: ${count ?? 0})`);
      }
    } catch (e) {
      console.log(`Table '${t}': EXCEPTION (${e.message})`);
    }
  }

  // Check 2: Profiles table columns
  console.log("\n--- 2. PROFILES TABLE COLUMNS ---");
  const { data: profCols, error: pErr } = await serviceClient.from("profiles").select("*").limit(1);
  if (pErr) {
    console.log("Error inspecting profiles:", pErr.message);
  } else if (profCols && profCols.length > 0) {
    console.log("Columns in public.profiles:", Object.keys(profCols[0]));
    console.log("Sample row:", JSON.stringify(profCols[0], null, 2));
  } else {
    console.log("No rows returned for schema sample.");
  }

  // Check 3: Anon Client RLS Enforcement Test
  console.log("\n--- 3. ANON CLIENT RLS PERMISSION TEST ---");
  for (const t of ["profiles", "auth_events", "projects", "user_integrations", "audit_logs"]) {
    try {
      const { data, error } = await anonClient.from(t).select("*");
      console.log(
        `Anon SELECT on '${t}': data length = ${data ? data.length : "null"}, error = ${error ? error.message : "none"}`,
      );
    } catch (e) {
      console.log(`Anon SELECT on '${t}': EXCEPTION ${e.message}`);
    }
  }

  // Check 4: RPC & Function Availability
  console.log("\n--- 4. RPC FUNCTIONS CHECK ---");
  const rpcs = [
    { name: "is_admin", args: {} },
    { name: "get_dashboard_stats", args: {} },
    { name: "ensure_profile", args: {} },
    {
      name: "set_user_role",
      args: { target_user_id: "00000000-0000-0000-0000-000000000000", target_role: "admin" },
    },
  ];

  for (const r of rpcs) {
    try {
      const { data, error } = await serviceClient.rpc(r.name, r.args);
      console.log(
        `RPC '${r.name}': status=${error ? "FAILED (" + error.message + ")" : "SUCCESS (" + JSON.stringify(data) + ")"}`,
      );
    } catch (e) {
      console.log(`RPC '${r.name}': EXCEPTION ${e.message}`);
    }
  }
}

main().catch(console.error);
