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

async function run() {
  for (const t of ['project_personas', 'llm_routing', 'project_templates']) {
    const { data, error } = await sb.from(t).select('*');
    console.log(t, '-> error:', error ? error.message : 'none', 'rows:', data ? data.length : 0);
  }
}
run();
