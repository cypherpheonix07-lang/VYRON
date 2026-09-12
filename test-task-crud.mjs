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

async function testTaskCrud() {
  const testTask = {
    name: "Presentation Generation",
    slug: "presentation-generation-" + Date.now(),
    category: "Design",
    intent_patterns: ["create presentation", "slides from paper", "pitch deck AI"],
    popularity_score: 95
  };

  const { data, error } = await sb.from("ai_tasks").insert(testTask).select().single();
  console.log("Task insert result:", { data, error });

  if (data?.id) {
    const { error: delError } = await sb.from("ai_tasks").delete().eq("id", data.id);
    console.log("Task delete result error:", delError);
  }
}

testTaskCrud();
