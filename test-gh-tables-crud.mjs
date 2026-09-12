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

const serviceClient = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const anonClient = createClient(env.SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  console.log("=== Checking github_accounts & project_repos via Service Client ===");
  const testUserId = "4666a9f0-f28d-4845-9a21-9b9210b18af9"; // Arjun Mehta
  
  // Test insert into github_accounts
  const testAccount = {
    user_id: testUserId,
    github_login: "test-brahma-user",
    account_type: "user",
    avatar_url: "https://github.com/test-brahma-user.png",
    access_token_encrypted: "\\x0102030405060708", // sample bytea hex
    scopes: ["repo", "read:org", "read:user"],
  };

  const { data: insAcc, error: insErr } = await serviceClient
    .from("github_accounts")
    .upsert(testAccount, { onConflict: "user_id,github_login" })
    .select();

  console.log("github_accounts upsert result:", { insAcc, insErr });

  if (insAcc && insAcc[0]) {
    const accountId = insAcc[0].id;
    // Get a project for this user
    const { data: projs } = await serviceClient
      .from("projects")
      .select("id")
      .eq("owner_id", testUserId)
      .limit(1);

    if (projs && projs[0]) {
      const projectId = projs[0].id;
      const testRepo = {
        project_id: projectId,
        github_account_id: accountId,
        repo_full_name: "test-brahma-user/brahma-sample-repo",
        repo_id: 12345678,
        private: true,
        language: "TypeScript",
        default_branch: "main",
        webhook_id: 998877,
        webhook_secret: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        sync_status: "pending",
      };

      const { data: insRepo, error: repoErr } = await serviceClient
        .from("project_repos")
        .upsert(testRepo, { onConflict: "project_id,repo_full_name" })
        .select();

      console.log("project_repos upsert result:", { insRepo, repoErr });

      // Clean up test rows
      await serviceClient.from("project_repos").delete().eq("repo_full_name", "test-brahma-user/brahma-sample-repo");
    }
    await serviceClient.from("github_accounts").delete().eq("github_login", "test-brahma-user");
  }
}

check();
