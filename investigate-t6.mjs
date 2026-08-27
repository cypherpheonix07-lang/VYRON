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

async function investigate() {
  console.log("=== INVESTIGATING T6 RLS & T10 RPC ISSUES ===\n");

  // 1. Create a fresh test student user
  const email = `test_student_${Date.now()}@brahma.dev`;
  const pass = "StudentPass123!";
  const { data: authData, error: authErr } = await serviceClient.auth.admin.createUser({
    email,
    password: pass,
    email_confirm: true,
    user_metadata: { full_name: "Test Pure Student", role: "student" },
  });

  if (authErr) {
    console.error("Error creating student user:", authErr.message);
    return;
  }

  const studentId = authData.user.id;
  console.log(`Created student user ${studentId}`);

  // Wait for profile trigger
  await new Promise((r) => setTimeout(r, 1500));

  // Verify profile has role = 'student'
  const { data: pData } = await serviceClient
    .from("profiles")
    .select("id, role")
    .eq("id", studentId)
    .single();
  console.log("Profile in DB:", pData);

  // Sign in as this pure student
  const studentClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: loginData, error: loginErr } = await studentClient.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (loginErr) {
    console.error("Login error:", loginErr.message);
  } else {
    // Attempt to select from profiles
    const { data: rows, error: selectErr } = await studentClient.from("profiles").select("*");
    console.log(`Student SELECT profiles result:`, {
      rowsCount: rows?.length,
      selectErr: selectErr?.message,
      rows: rows?.map((r) => ({ id: r.id, email: r.email, role: r.role })),
    });
  }

  // Check RPC is_admin
  console.log("\n--- Checking RPC is_admin and health_recompute ---");
  try {
    const { data: adminCheck, error: adminErr } = await studentClient.rpc("is_admin");
    console.log("is_admin RPC result:", { adminCheck, adminErr: adminErr?.message });
  } catch (e) {
    console.log("is_admin RPC exception:", e.message);
  }

  // Cleanup
  await serviceClient.auth.admin.deleteUser(studentId);
  console.log("Cleaned up test student user.");
}

investigate();
