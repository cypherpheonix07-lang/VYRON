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

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

async function inspectDomains() {
  const { data, count, error } = await sb.from("project_domains").select("*", { count: "exact" });
  console.log("project_domains count:", count, "error:", error?.message);
  console.log("rows:", JSON.stringify(data, null, 2));

  // Check llm_configs or llm tables
  const { data: llmConfigs, error: llmErr } = await sb.from("llm_configs").select("*").limit(5);
  console.log("llm_configs:", llmConfigs ? llmConfigs.length : llmErr?.message);
  if (llmConfigs && llmConfigs.length > 0) {
    console.log("sample llm_config:", llmConfigs[0]);
  }
}

inspectDomains();
