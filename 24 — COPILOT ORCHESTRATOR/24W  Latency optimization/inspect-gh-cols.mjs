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

async function inspect() {
  const res1 = await sb.from("github_accounts").select("*").limit(1);
  console.log("github_accounts cols/err:", res1.error || Object.keys(res1.data[0] || {}));
  const res2 = await sb.from("project_repos").select("*").limit(1);
  console.log("project_repos cols/err:", res2.error || Object.keys(res2.data[0] || {}));
}

inspect();
