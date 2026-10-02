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

async function findTables() {
  const candidates = [
    "projects",
    "project_domains",
    "project_personas",
    "personas",
    "domains",
    "llm_routing",
    "llm_configs",
    "llm_models",
    "pricing",
    "project_templates",
    "templates",
    "website_projects",
    "tech_stack_comparisons",
    "profiles",
    "auth_events",
    "user_integrations",
    "integration_events",
    "requirements",
    "blueprint_nodes",
    "notifications",
    "github_tokens",
    "github_accounts",
    "github_repositories",
    "audit_logs",
    "activity_events",
    "workpulse_metrics",
  ];

  console.log("=== CHECKING EXISTING TABLES ===");
  const found = [];
  for (const c of candidates) {
    const { data, error } = await sb.from(c).select("*").limit(1);
    if (!error) {
      found.push(c);
      console.log(`[FOUND] ${c}: columns:`, Object.keys(data[0] || {}));
    }
  }
  console.log("Total found tables:", found);
}

findTables();
