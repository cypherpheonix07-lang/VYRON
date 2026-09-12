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
  for (const t of ["ai_tools", "ai_tasks", "ai_tool_tasks", "tool_health_checks"]) {
    const { data, error } = await sb.from(t).select("*").limit(1);
    console.log(`--- Table: ${t} ---`);
    if (error) {
      console.log("Error:", error.message);
    } else {
      console.log("Sample keys/data:", data);
    }
  }
}

inspect();
