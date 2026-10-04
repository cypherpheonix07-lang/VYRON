import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf8");
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
const supabase = createClient(url, serviceKey);

async function testAll() {
  const tables = [
    "profiles",
    "auth_events",
    "user_integrations",
    "integration_events",
    "projects",
    "notifications",
    "user_settings",
  ];
  console.log("--- TABLES STATUS ---");
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
    if (error) {
      console.log(`Table [${t}]: ERROR -> ${error.message}`);
    } else {
      console.log(`Table [${t}]: EXISTS (row count: ${count})`);
    }
  }

  console.log("\n--- PROFILES SAMPLE ROW / COLUMNS ---");
  const { data: pSample, error: pErr } = await supabase.from("profiles").select("*").limit(1);
  if (pSample && pSample.length > 0) {
    console.log("Profiles columns:", Object.keys(pSample[0]).join(", "));
    console.log("Sample profile row:", JSON.stringify(pSample[0], null, 2));
  } else {
    console.log("Profiles sample query error or empty:", pErr, pSample);
  }
}

testAll();
