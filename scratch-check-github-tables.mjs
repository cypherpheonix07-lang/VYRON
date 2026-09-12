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
  for (const t of ["activity_events", "github_accounts", "project_repos", "github_repos", "github_tokens"]) {
    const { count, error } = await sb.from(t).select("*", { count: "exact" }).limit(1);
    console.log(t, error ? `ERROR: ${error.message}` : `EXISTS (count = ${count})`);
  }
}

check();
