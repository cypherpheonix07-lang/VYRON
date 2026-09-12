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

async function testEachCol() {
  const probeCols = {
    slug: "probe-test-slug",
    tags: ["test", "probe"],
    icon: "Folder",
    cover: "from-blue-600 to-indigo-800",
    domain: "web",
    domain_secondary: ["mobile"],
    scale: "production",
    target_users: [{ label: "Developer", custom: false, priority: 1 }],
    accessibility: true,
    platforms: ["web", "api"],
    stack: "react-fastapi",
    repo_full_name: "test/repo",
    complexity_budget: 5,
    feature_toggles: { auth: true },
    ai_tasks: { code_review: true },
    gate_strictness: "standard",
    compliance_pack: "soc2",
    allow_override: true,
    retention: "90d",
    kpi_targets: { health_min: 80, coverage_min: 75, max_critical: 0 },
    budget_cap_usd: 15.5,
    milestone: "2026-12-31",
    cadence: "weekly",
    draft_state: null,
    wizard_step: 0,
    status: "draft"
  };

  const existing = [];
  const missing = [];

  for (const [col, val] of Object.entries(probeCols)) {
    const payload = {
      owner_id: "4666a9f0-f28d-4845-9a21-9b9210b18af9",
      name: "Probe " + col,
      [col]: val
    };
    const { data, error } = await sb.from("projects").insert(payload).select("id").single();
    if (error && error.message.includes("Could not find the '" + col + "' column")) {
      missing.push(col);
    } else if (error) {
      existing.push({ col, note: error.message });
    } else {
      existing.push({ col, note: "OK" });
      if (data?.id) await sb.from("projects").delete().eq("id", data.id);
    }
  }

  console.log("=== COLUMN INVENTORY REPORT ===");
  console.log("EXISTING COLUMNS:", existing.map(e => `${e.col} (${e.note})`));
  console.log("MISSING COLUMNS:", missing);
}

testEachCol();
