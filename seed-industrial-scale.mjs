import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hbbunfizlwgvripgwzdo.supabase.co";
const SERVICE_KEY = "sb_secret_eOpvHkdQra1PTfdrsa1Fqw_F0RcG5wR";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log("════════════════════════════════════════════════════════════════════");
  console.log("⚡ PROJECT BRAHMA — SYNTHETIC INDUSTRIAL DATA INJECTION ENGINE (V2)");
  console.log("════════════════════════════════════════════════════════════════════");

  const startTime = Date.now();

  const { data: usersData, error: userErr } = await supabase.auth.admin.listUsers({ perPage: 10 });
  if (userErr || !usersData?.users?.length) {
    console.error("Failed to list users:", userErr);
    process.exit(1);
  }
  const anchorUserId = usersData.users[0].id;

  const { data: projectList } = await supabase.from("projects").select("id").limit(100);
  const sampleProjectIds = (projectList || []).map((p) => p.id);
  const primaryProjectId = sampleProjectIds[0] || "00000000-0000-0000-0000-000000000000";

  // 1. Seed 5,000 Auth Events
  console.log("[SEED] Inserting 5,000 auth events in 10 batches of 500...");
  const authMethods = ["password", "magic_link", "sso_saml", "passkey", "oauth_github", "oauth_google"];
  const authStatuses = ["success", "success", "success", "failed", "blocked"];
  const browsers = ["Chrome 124.0", "Firefox 125.0", "Safari 17.4", "Edge 124.0"];
  const countries = ["US", "IN", "DE", "GB", "SG", "JP"];

  const BATCH_SIZE = 500;
  for (let b = 0; b < 10; b++) {
    const authEventsBatch = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const status = authStatuses[Math.floor(Math.random() * authStatuses.length)];
      const method = authMethods[Math.floor(Math.random() * authMethods.length)];
      authEventsBatch.push({
        user_id: anchorUserId,
        event: status === "success" ? (method === "sso_saml" ? "sso_saml_login" : "login_success") : "login_failed",
        method: method,
        status: status,
        country: countries[i % countries.length],
        city: "Industrial Hub",
        device_type: "desktop",
        browser: browsers[i % browsers.length],
        os: "macOS / Linux",
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
      });
    }
    const { error } = await supabase.from("auth_events").insert(authEventsBatch);
    if (error) {
      console.warn(`[SEED] Auth events batch ${b} error:`, error.message);
    }
  }
  console.log("✓ Auth events seeded (5,000 records)");

  // 2. Seed 10,000 Audit & LLM Invocation Logs
  console.log("[SEED] Inserting 10,000 LLM & audit invocation logs in 10 batches of 1000...");
  const models = [
    "claude-3-5-sonnet-20241022",
    "gpt-4o",
    "deepseek-coder",
    "gemini-1.5-pro",
  ];
  for (let b = 0; b < 10; b++) {
    const auditBatch = [];
    for (let i = 0; i < 1000; i++) {
      const model = models[(b * 1000 + i) % models.length];
      const tokensIn = 150 + Math.floor(Math.random() * 2000);
      const tokensOut = 50 + Math.floor(Math.random() * 800);
      auditBatch.push({
        actor_id: anchorUserId,
        action: "llm_inference",
        entity_type: "llm_gateway",
        entity_id: `trace-${b}-${i}`,
        project_id: sampleProjectIds[i % sampleProjectIds.length] || primaryProjectId,
        changes: {
          model: model,
          prompt_tokens: tokensIn,
          completion_tokens: tokensOut,
          cost_usd: Number(((tokensIn * 0.000003) + (tokensOut * 0.000015)).toFixed(6)),
          latency_ms: 120 + Math.floor(Math.random() * 450),
          cache_hit: Math.random() > 0.65,
        },
        created_at: new Date(Date.now() - Math.floor(Math.random() * 14 * 86400000)).toISOString(),
      });
    }
    const { error } = await supabase.from("audit_logs").insert(auditBatch);
    if (error) {
      console.warn(`[SEED] Audit logs batch ${b} error:`, error.message);
    }
  }
  console.log("✓ LLM Audit logs seeded (10,000 records)");

  // 3. Verify Final Counts
  console.log("\n[VERIFY] Querying live database row counts...");
  const [
    { count: pCount },
    { count: aCount },
    { count: lCount },
    { count: nCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("auth_events").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("*", { count: "exact", head: true }),
    supabase.from("notifications").select("*", { count: "exact", head: true }),
  ]);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n════════════════════════════════════════════════════════════════════`);
  console.log(`⚡ SYNTHETIC DATA INJECTION COMPLETE (Elapsed: ${elapsed}s)`);
  console.log(`- Projects:         ${pCount} rows`);
  console.log(`- Auth Events:      ${aCount} rows`);
  console.log(`- Audit / LLM Logs: ${lCount} rows`);
  console.log(`- Notifications:    ${nCount} rows`);
  console.log(`════════════════════════════════════════════════════════════════════`);
}

main().catch(console.error);
