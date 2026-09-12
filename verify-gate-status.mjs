/**
 * PROJECT BRAHMA — VERIFICATION OF GATE_STATUS & TRIGGER FIX
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((l) => {
  const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (m) {
    let v = m[2].trim().replace(/^['"]|['"]$/g, "");
    env[m[1]] = v;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY;
const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

async function verifyGateStatus() {
  console.log("===============================================================");
  console.log("PROJECT BRAHMA — GATE STATUS & ACTIVITY TRIGGER VERIFICATION");
  console.log("===============================================================\n");

  console.log("1. Checking column 'gate_status' on table 'projects'...");
  const { data: proj, error: pErr } = await sb
    .from("projects")
    .select("id, name, gate_status")
    .limit(1);

  if (pErr) {
    console.error("❌ Projects query error:", pErr.message, `(Code: ${pErr.code})`);
    if (pErr.code === "PGRST204" || pErr.code === "42703" || pErr.message?.includes("gate_status")) {
      console.log("\n⚠️ Root Cause Confirmed: The column 'gate_status' does NOT exist yet in Supabase.");
      console.log("Run the migration in Supabase Dashboard SQL Editor:");
      console.log(`URL: https://supabase.com/dashboard/project/hbbunfizlwgvripgwzdo/sql/new\n`);
    }
    return false;
  }

  console.log("✅ Column 'gate_status' exists! Sample project:", proj[0]);

  console.log("\n2. Testing UPDATE of gate_status to verify trigger trg_publish_gate_activity...");
  const targetId = proj[0].id;
  const newStatus = proj[0].gate_status === "passed" ? "pending" : "passed";

  const { data: updated, error: uErr } = await sb
    .from("projects")
    .update({ gate_status: newStatus })
    .eq("id", targetId)
    .select();

  if (uErr) {
    console.error("❌ Trigger / Update Error:", uErr.message, `(Code: ${uErr.code})`);
    return false;
  }

  console.log(`✅ Project '${targetId}' updated gate_status to '${newStatus}' successfully!`);

  console.log("\n3. Checking activity_events for generated release gate event...");
  const { data: events, error: eErr } = await sb
    .from("activity_events")
    .select("*")
    .eq("project_id", targetId)
    .eq("event_type", "gate")
    .order("created_at", { ascending: false })
    .limit(1);

  if (eErr) {
    console.warn("⚠️ Could not query activity_events:", eErr.message);
  } else if (events && events.length > 0) {
    console.log("✅ Trigger generated activity event:", events[0]);
  } else {
    console.log("ℹ️ No 'gate' event found yet in activity_events.");
  }

  return true;
}

verifyGateStatus();
