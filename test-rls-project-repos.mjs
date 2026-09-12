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

async function testProjectReposRLS() {
  console.log("=== Testing RLS on project_repos ===");
  
  const { data: auth1 } = await anonClient.auth.signInWithPassword({
    email: "priya.nair@brahma.dev",
    password: "AdminSecurePass123!",
  });
  const priyaId = auth1.user.id;
  const priyaClient = createClient(env.SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${auth1.session.access_token}` } }
  });

  const otherUserId = "4666a9f0-f28d-4845-9a21-9b9210b18af9"; // Arjun

  // 1. Get or create a project for Arjun and Priya
  const { data: arjunProj } = await serviceClient
    .from("projects")
    .select("id")
    .eq("owner_id", otherUserId)
    .limit(1)
    .single();

  const { data: priyaProj } = await serviceClient
    .from("projects")
    .select("id")
    .eq("owner_id", priyaId)
    .limit(1)
    .single();

  const { data: priyaAcc } = await serviceClient.from("github_accounts").insert({
    user_id: priyaId,
    github_login: "priya-acc-repo-test",
    account_type: "user",
    access_token_encrypted: "\\x01020304",
  }).select().single();

  const { data: arjunAcc } = await serviceClient.from("github_accounts").insert({
    user_id: otherUserId,
    github_login: "arjun-acc-repo-test",
    account_type: "user",
    access_token_encrypted: "\\x05060708",
  }).select().single();

  // Insert project_repos for both
  if (priyaProj && priyaAcc) {
    await serviceClient.from("project_repos").insert({
      project_id: priyaProj.id,
      github_account_id: priyaAcc.id,
      repo_full_name: "priya/proj-repo-1",
      sync_status: "pending",
    });
  }

  if (arjunProj && arjunAcc) {
    await serviceClient.from("project_repos").insert({
      project_id: arjunProj.id,
      github_account_id: arjunAcc.id,
      repo_full_name: "arjun/proj-repo-1",
      sync_status: "pending",
    });
  }

  // Priya queries project_repos
  const { data: priyaRepos } = await priyaClient.from("project_repos").select("*");
  console.log("Priya sees project_repos:", priyaRepos?.map(r => ({ name: r.repo_full_name, project_id: r.project_id })));

  // Priya queries for Arjun's project specifically
  if (arjunProj) {
    const { data: crossProjectRepos } = await priyaClient
      .from("project_repos")
      .select("*")
      .eq("project_id", arjunProj.id);
    console.log("Priya querying Arjun's project repos (should be 0):", crossProjectRepos?.length);
  }

  // Client write test on project_repos (should fail)
  if (priyaProj && priyaAcc) {
    const { error: writeErr } = await priyaClient.from("project_repos").insert({
      project_id: priyaProj.id,
      github_account_id: priyaAcc.id,
      repo_full_name: "priya/direct-client-repo",
      sync_status: "pending",
    });
    console.log("Priya direct client write on project_repos (blocked):", writeErr ? writeErr.message : "NO ERROR");
  }

  // Cleanup
  await serviceClient.from("project_repos").delete().in("repo_full_name", ["priya/proj-repo-1", "arjun/proj-repo-1", "priya/direct-client-repo"]);
  await serviceClient.from("github_accounts").delete().in("github_login", ["priya-acc-repo-test", "arjun-acc-repo-test"]);
}

testProjectReposRLS();
