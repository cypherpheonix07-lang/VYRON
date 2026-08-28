import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hbbunfizlwgvripgwzdo.supabase.co";
const SERVICE_KEY = "sb_secret_eOpvHkdQra1PTfdrsa1Fqw_F0RcG5wR";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log("════════════════════════════════════════════════════════════════════");
  console.log("⚡ SEEDING 10,000 WORM LLM AUDIT LOGS (MATCHING LIVE SCHEMA)");
  console.log("════════════════════════════════════════════════════════════════════");

  const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 10 });
  const anchorUserId = usersData.users[0].id;

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
        user_id: anchorUserId,
        action: "llm.inference",
        resource: model,
        details: JSON.stringify({
          model: model,
          prompt_tokens: tokensIn,
          completion_tokens: tokensOut,
          cost_usd: Number(((tokensIn * 0.000003) + (tokensOut * 0.000015)).toFixed(6)),
          latency_ms: 120 + Math.floor(Math.random() * 450),
          cache_hit: Math.random() > 0.65,
        }),
        ip: "10.0.4.88",
        status: "success",
        created_at: new Date(Date.now() - Math.floor(Math.random() * 14 * 86400000)).toISOString(),
      });
    }
    const { error } = await supabase.from("audit_logs").insert(auditBatch);
    if (error) {
      console.warn(`[SEED] Audit batch ${b} error:`, error.message);
    }
  }

  const { count: lCount } = await supabase.from("audit_logs").select("*", { count: "exact", head: true });
  console.log(`\n✓ SUCCESS: Audit / LLM Logs live count: ${lCount} rows`);
}

main().catch(console.error);
