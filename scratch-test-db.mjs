import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((l) => {
  const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (m) {
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    env[m[1]] = v;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  const { data, error } = await supabase.from("activity_events").select("*").limit(5);
  console.log("activity_events query:", { count: data?.length, error });
  
  const rpc1 = await supabase.rpc("workspace_pulse");
  console.log("workspace_pulse RPC:", rpc1);

  const { data: projs } = await supabase.from("projects").select("id, name").limit(3);
  console.log("projects:", projs);
  if (projs && projs.length > 0) {
    const rpc2 = await supabase.rpc("project_pulse", { p_project_id: projs[0].id });
    console.log("project_pulse RPC for", projs[0].name, ":", rpc2);
  }
}
run();
