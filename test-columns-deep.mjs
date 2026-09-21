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

async function testCols() {
  const testObj = {
    name: "Probe Tool " + Date.now(),
    slug: "probe-tool-" + Date.now(),
    tagline: "Test tagline",
    description: "Test description",
    website_url: "https://example.com",
    pricing_type: "freemium",
    capabilities: ["Testing"],
  };

  const { data, error } = await sb.from("ai_tools").insert(testObj).select().single();
  console.log("Insert with capabilities:", { data, error });
  if (data?.id) {
    await sb.from("ai_tools").delete().eq("id", data.id);
  }
}

testCols();
