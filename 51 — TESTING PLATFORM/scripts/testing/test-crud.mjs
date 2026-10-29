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

async function testCrud() {
  const testTool = {
    name: "Probe Test Tool",
    slug: "probe-test-tool-" + Date.now(),
    tagline: "Testing tool schema capabilities",
    description: "Full description for testing semantic capabilities",
    website_url: "https://example.com",
    pricing_type: "free",
    starting_price_usd: 0,
    verification_level: "unverified",
    health_status: "active",
    average_rating: 4.8,
    review_count: 12,
    save_count: 5,
  };

  const { data, error } = await sb.from("ai_tools").insert(testTool).select().single();
  console.log("Insert result:", { data, error });

  if (data?.id) {
    const { error: delError } = await sb.from("ai_tools").delete().eq("id", data.id);
    console.log("Delete result error:", delError);
  }
}

testCrud();
