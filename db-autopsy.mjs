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

async function runAutopsy() {
  console.log("====================================================");
  console.log("SUPABASE DATABASE AUTOPSY & REST PROBE");
  console.log("====================================================\n");

  // 1. Check access to public tables
  const knownTables = [
    "profiles",
    "auth_events",
    "user_integrations",
    "integration_events",
    "projects",
    "notifications",
    "github_tokens",
  ];

  console.log("--- 1. KNOWN PUBLIC TABLES CHECK ---");
  for (const table of knownTables) {
    try {
      const { data, count, error } = await serviceClient
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) {
        console.log(`Table "${table}": ERROR (${error.code}) - ${error.message}`);
      } else {
        console.log(`Table "${table}": EXISTS (Row count: ${count ?? "unknown"})`);
      }
    } catch (e) {
      console.log(`Table "${table}": EXCEPTION - ${e.message}`);
    }
  }

  // 2. Inspect profiles schema by fetching sample / schema info
  console.log("\n--- 2. PROFILES TABLE COLUMNS & SAMPLE ROW ---");
  try {
    const { data: sample, error } = await serviceClient.from("profiles").select("*").limit(1);
    if (error) {
      console.log("Error querying profiles:", error.message);
    } else if (sample && sample.length > 0) {
      console.log("Profiles columns present:", Object.keys(sample[0]));
      console.log("Sample profile:", JSON.stringify(sample[0], null, 2));
    } else {
      console.log("Profiles table is empty or no rows returned.");
    }
  } catch (e) {
    console.log("Exception querying profiles:", e.message);
  }

  // 3. Test Anon RLS protection on profiles
  console.log("\n--- 3. ANON RLS PERMISSIONS PROBE ---");
  try {
    const { data: anonData, error: anonErr } = await anonClient.from("profiles").select("*");
    console.log("Anon select on profiles:", { count: anonData?.length, error: anonErr?.message });
  } catch (e) {
    console.log("Anon select exception:", e.message);
  }

  // 4. Test Anon RLS on auth_events
  try {
    const { data: anonEvents, error: anonEventsErr } = await anonClient
      .from("auth_events")
      .select("*");
    console.log("Anon select on auth_events:", {
      count: anonEvents?.length,
      error: anonEventsErr?.message,
    });
  } catch (e) {
    console.log("Anon events exception:", e.message);
  }

  // 5. Test RPC functions availability
  console.log("\n--- 4. RPC FUNCTIONS PROBE ---");
  const rpcs = [
    { name: "get_dashboard_stats", args: {} },
    { name: "is_admin", args: {} },
    {
      name: "set_user_role",
      args: { target_user_id: "00000000-0000-0000-0000-000000000000", target_role: "admin" },
    },
  ];

  for (const rpc of rpcs) {
    try {
      const { data, error } = await serviceClient.rpc(rpc.name, rpc.args);
      console.log(
        `RPC "${rpc.name}":`,
        error ? `ERROR: ${error.message}` : `SUCCESS: ${JSON.stringify(data)}`,
      );
    } catch (e) {
      console.log(`RPC "${rpc.name}": EXCEPTION: ${e.message}`);
    }
  }

  console.log("\n====================================================");
  console.log("SUPABASE DATABASE AUTOPSY COMPLETED");
  console.log("====================================================\n");
}

runAutopsy();
