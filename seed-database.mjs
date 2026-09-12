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
const key = env.SUPABASE_SECRET_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

async function seed() {
  console.log("=== SEEDING TEST ACCOUNTS & DATA ===");

  // 1. Admin account
  try {
    const { data: u1, error: e1 } = await supabase.auth.admin.createUser({
      email: "testadmin@brahmatest.com",
      password: "TestAdmin@123",
      email_confirm: true,
      user_metadata: { full_name: "Test Admin User", role: "admin" },
    });
    if (e1) console.log("Admin account note:", e1.message);
    else console.log("Admin account created successfully:", u1.user?.id);
  } catch (e) {
    console.log("Admin account note:", e.message);
  }

  // 2. Regular user account
  try {
    const { data: u2, error: e2 } = await supabase.auth.admin.createUser({
      email: "testuser@brahmatest.com",
      password: "TestUser@123",
      email_confirm: true,
      user_metadata: { full_name: "Test Regular User", role: "student" },
    });
    if (e2) console.log("Regular user note:", e2.message);
    else console.log("Regular user created successfully:", u2.user?.id);
  } catch (e) {
    console.log("Regular user note:", e.message);
  }

  // 3. Upsert profiles
  const { data: users } = await supabase.auth.admin.listUsers();
  for (const u of users?.users || []) {
    if (u.email === "testadmin@brahmatest.com") {
      const { error } = await supabase.from("profiles").upsert({
        id: u.id,
        email: u.email,
        full_name: "Test Admin User",
        display_name: "Admin",
        role: "admin",
        onboarded: true,
      });
      console.log("Admin profile upserted:", error ? error.message : "OK");
    } else if (u.email === "testuser@brahmatest.com") {
      const { error } = await supabase.from("profiles").upsert({
        id: u.id,
        email: u.email,
        full_name: "Test Regular User",
        display_name: "TestUser",
        role: "student",
        onboarded: true,
      });
      console.log("Student profile upserted:", error ? error.message : "OK");
    }
  }

  // 4. Sample profiles for team / discovery
  const sampleProfiles = [
    {
      name: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      role: "student",
      title: "Lead Architect",
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      role: "faculty",
      title: "Academic Advisor",
    },
    {
      name: "Vikram Nair",
      email: "vikram.nair@example.com",
      role: "reviewer",
      title: "Security Auditor",
    },
    {
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      role: "student",
      title: "Data Engineer",
    },
  ];

  for (const sp of sampleProfiles) {
    try {
      const { data: su } = await supabase.auth.admin.createUser({
        email: sp.email,
        password: "SampleUserPassword123!",
        email_confirm: true,
        user_metadata: { full_name: sp.name, role: sp.role },
      });
      if (su?.user) {
        await supabase.from("profiles").upsert({
          id: su.user.id,
          email: sp.email,
          full_name: sp.name,
          display_name: sp.name.split(" ")[0],
          title: sp.title,
          role: sp.role,
          onboarded: true,
        });
      }
    } catch (e) {}
  }

  console.log("\n--- ACTIVE PROFILES IN DATABASE ---");
  const { data: profs, error: pErr } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, onboarded");
  if (pErr) console.log("Profiles select err:", pErr.message);
  else console.table(profs);
}

seed();
