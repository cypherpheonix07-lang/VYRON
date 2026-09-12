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

async function testInsert() {
  const { data, error } = await sb.from("ai_tools").insert({ id: "00000000-0000-0000-0000-000000000000" });
  console.log("Insert into ai_tools error:", error);

  const { data: taskData, error: taskError } = await sb.from("ai_tasks").insert({ id: "00000000-0000-0000-0000-000000000000" });
  console.log("Insert into ai_tasks error:", taskError);
}

testInsert();
