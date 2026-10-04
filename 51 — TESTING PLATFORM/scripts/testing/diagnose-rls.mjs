import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

const serviceClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function checkPolicies() {
  console.log("=== CHECKING WHY STUDENT SEES 10 ROWS ===\n");

  // Check what is_admin returns for service role vs anon vs student
  const email = `test_probe_${Date.now()}@brahma.dev`;
  const pass = "ProbePass123!";
  const { data: uData } = await serviceClient.auth.admin.createUser({
    email,
    password: pass,
    email_confirm: true,
    user_metadata: { full_name: "Test Probe Student", role: "student" },
  });

  const studentId = uData.user.id;
  await new Promise((r) => setTimeout(r, 1000));
  await serviceClient.from("profiles").update({ role: "student" }).eq("id", studentId);

  const studentClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  await studentClient.auth.signInWithPassword({ email, password: pass });

  // Test is_admin RPC as student
  const { data: isAdm } = await studentClient.rpc("is_admin");
  console.log("Student caller is_admin() result:", isAdm);

  // Test profiles select as student
  const { data: rows } = await studentClient.from("profiles").select("id, email, role");
  console.log("Student SELECT rows count:", rows?.length);
  console.log("Returned rows:", rows);

  // Cleanup
  await serviceClient.auth.admin.deleteUser(studentId);
}

checkPolicies();
