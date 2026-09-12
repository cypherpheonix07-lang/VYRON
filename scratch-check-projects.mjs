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
  const { data, error } = await sb.from("projects").select("id, name, owner_id").eq("owner_id", "c7cff994-1fde-44a1-9d90-71c0b1873745");
  console.log("Priya Nair projects:", data);

  // Also check activity_events table
  const { data: actData, error: actError } = await sb.from("activity_events").select("*").limit(1);
  if (actError) {
    console.error("activity_events query error:", actError);
  } else {
    console.log("activity_events count returned:", actData.length);
    if (actData[0]) {
      console.log("activity_events columns:", Object.keys(actData[0]));
    }
  }
}

inspect();
