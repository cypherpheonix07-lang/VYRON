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

const anonClient = createClient(env.SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const serviceClient = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

async function testRLS() {
  console.log("=== Testing RLS on github_accounts and project_repos ===");
  
  // 1. Sign in as Priya Nair (Admin)
  const { data: auth1, error: aErr1 } = await anonClient.auth.signInWithPassword({
    email: "priya.nair@brahma.dev",
    password: "AdminSecurePass123!",
  });
  if (aErr1) {
    console.error("Auth failed for priya:", aErr1);
    return;
  }
  const priyaId = auth1.user.id;
  const priyaClient = createClient(env.SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${auth1.session.access_token}` } }
  });

  // 2. Insert rows for Priya and for someone else via service client
  const otherUserId = "4666a9f0-f28d-4845-9a21-9b9210b18af9"; // Arjun
  
  await serviceClient.from("github_accounts").delete().in("github_login", ["priya-gh", "arjun-gh"]);
  
  const { data: accPriya } = await serviceClient.from("github_accounts").insert({
    user_id: priyaId,
    github_login: "priya-gh",
    account_type: "user",
    access_token_encrypted: "\\x01020304",
  }).select().single();

  const { data: accArjun } = await serviceClient.from("github_accounts").insert({
    user_id: otherUserId,
    github_login: "arjun-gh",
    account_type: "user",
    access_token_encrypted: "\\x05060708",
  }).select().single();

  // Priya queries github_accounts
  const { data: priyaAccounts } = await priyaClient.from("github_accounts").select("*");
  console.log("Priya sees github_accounts count:", priyaAccounts?.length, priyaAccounts?.map(a => a.github_login));

  // Client write test (should fail or be blocked by RLS)
  const { error: priyaWriteErr } = await priyaClient.from("github_accounts").insert({
    user_id: priyaId,
    github_login: "priya-direct",
    account_type: "user",
    access_token_encrypted: "\\x0102",
  });
  console.log("Priya direct client insert error (no client write):", priyaWriteErr ? priyaWriteErr.message : "NO ERROR");

  // Cleanup
  await serviceClient.from("github_accounts").delete().in("github_login", ["priya-gh", "arjun-gh", "priya-direct"]);
}

testRLS();
