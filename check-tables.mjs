import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = val;
  }
});

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

async function check() {
  const tables = [
    "profiles",
    "projects",
    "auth_events",
    "user_integrations",
    "blueprint_shares",
    "activity_feed",
    "llm_usage",
    "ai_artifacts",
    "llm_cache",
    "llm_routing",
    "user_settings",
    "webhook_ingest"
  ];

  for (const t of tables) {
    const { data, count, error } = await sb.from(t).select("*", { count: "exact" }).limit(1);
    if (error) {
      console.log(`${t}: ERROR (${error.code}) - ${error.message}`);
    } else {
      const keys = data && data[0] ? Object.keys(data[0]) : "[]";
      console.log(`${t}: EXISTS (count = ${count}) cols:`, keys);
    }
  }

  const { data: prof, error: pErr } = await sb.from("profiles").select("*").limit(1);
  if (prof && prof[0]) {
    console.log("\nPROFILES COLUMNS:", Object.keys(prof[0]));
  }
}

check();
