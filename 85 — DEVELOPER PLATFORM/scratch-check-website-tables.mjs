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
  const r1 = await sb.from("website_projects").select("id").limit(1);
  const r2 = await sb.from("website_generations").select("id").limit(1);
  const r3 = await sb.from("tech_stack_comparisons").select("id").limit(1);

  console.log("website_projects:", r1.error ? r1.error.message : "TABLE EXISTS");
  console.log("website_generations:", r2.error ? r2.error.message : "TABLE EXISTS");
  console.log("tech_stack_comparisons:", r3.error ? r3.error.message : "TABLE EXISTS");
}

check();
