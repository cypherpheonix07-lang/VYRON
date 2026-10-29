import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envPath = fs.existsSync("./.env")
  ? "./.env"
  : fs.existsSync("./.env.example")
    ? "./.env.example"
    : null;

const env = {};
if (envPath) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      let val = match[2].trim().replace(/^['"]|['"]$/g, "");
      env[match[1]] = val;
    }
  });
}

const sbUrl = env.SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const sbKey = env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY || "placeholder-key";
const sb = createClient(sbUrl, sbKey);

async function testRPCs() {
  const testCalls = [
    { name: "store_github_account", args: {} },
    { name: "decrypt_github_account_token", args: {} },
    { name: "upsert_github_account", args: {} },
    { name: "decrypt_user_token", args: {} },
    { name: "upsert_user_integration", args: {} },
  ];

  for (const c of testCalls) {
    const { data, error } = await sb.rpc(c.name, c.args);
    console.log(`RPC ${c.name}:`, error ? `${error.code} - ${error.message}` : "SUCCESS/EXISTS");
  }
}

testRPCs();
