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
