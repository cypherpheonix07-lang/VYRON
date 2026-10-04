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
