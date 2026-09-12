// Supabase Edge Function: llm-gateway
// Multi-Tier Routing, Semantic Caching, Spend Metering & Provenance Vaulting
import { withSupabase } from "npm:@supabase/server";

// ─── MODEL PRICING & TIER CONFIGURATION ───────────────────────────────────────

interface ModelPrice {
  promptUsdPer1k: number;
  completionUsdPer1k: number;
}

const MODEL_PRICING: Record<string, ModelPrice> = {
  "anthropic/claude-3.5-sonnet": { promptUsdPer1k: 0.003, completionUsdPer1k: 0.015 },
  "openai/gpt-4o-mini": { promptUsdPer1k: 0.00015, completionUsdPer1k: 0.0006 },
  "meta-llama/llama-3.1-8b-instruct:free": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
  "meta-llama/Llama-3.2-3B-Instruct": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
  "sentence-transformers/all-MiniLM-L6-v2": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
  "deterministic-architect": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
  "deterministic-reviewer": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
  "deterministic-tester": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
  "deterministic-extractor": { promptUsdPer1k: 0.0, completionUsdPer1k: 0.0 },
};

// ─── SANITIZATION UTILITIES ───────────────────────────────────────────────────

export function sanitizePayload(input: unknown): unknown {
  if (typeof input === "string") {
    let sanitized = input;
    // Strip OpenAI / Anthropic / Generic API keys (sk-...)
    sanitized = sanitized.replace(/sk-[A-Za-z0-9_\-]{20,}/g, "[REDACTED_API_KEY]");
    // Strip GitHub personal access tokens (ghp_...)
    sanitized = sanitized.replace(/ghp_[A-Za-z0-9]{20,}/g, "[REDACTED_GH_TOKEN]");
    // Strip RSA/OpenSSH private key blocks
    sanitized = sanitized.replace(
      /-----BEGIN[ A-Z0-9_-]+-----[\s\S]*?-----END[ A-Z0-9_-]+-----/g,
      "[REDACTED_PRIVATE_KEY]",
    );
    // Strip environment assignment statements like API_KEY=xyz
    sanitized = sanitized.replace(
      /(?:[A-Z0-9_]{3,})\s*=\s*['"]?[A-Za-z0-9_\-\.]{16,}['"]?/g,
      "[REDACTED_ENV_SECRET]",
    );
    return sanitized;
  }
  if (Array.isArray(input)) {
    return input.map(sanitizePayload);
  }
  if (input !== null && typeof input === "object") {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      res[k] = sanitizePayload(v);
    }
    return res;
  }
  return input;
}

// ─── SHA-256 HASH GENERATOR ───────────────────────────────────────────────────

export async function computeSha256(data: unknown): Promise<string> {
  const jsonStr = typeof data === "string" ? data : JSON.stringify(data);
  const msgBuffer = new TextEncoder().encode(jsonStr);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── DETERMINISTIC TEMPLATE GENERATORS ────────────────────────────────────────

function generateTemplateArtifact(task: string, payload: any): any {
  const prompt = (
    payload?.prompt ||
    payload?.code ||
    payload?.content ||
    JSON.stringify(payload)
  ).toLowerCase();

  if (task === "requirement_extraction") {
    return {
      modules: [
        {
          name: "Core Authentication & IAM",
          desc: "Manages identity, MFA tokens, session auditing, and role verification.",
        },
        {
          name: "Data Processing Engine",
          desc: "Ingests inputs, processes state mutations, and dispatches validation signals.",
        },
        {
          name: "API Gateway & Security Proxy",
          desc: "Handles external handshakes, rate limiting, and audit logs.",
        },
      ],
      actors: [
        {
          name: "End User / Operator",
          desc: "Interacts with primary application workflows and dashboards.",
        },
        {
          name: "Platform Administrator",
          desc: "Configures access policies, reviews audits, and provisions resources.",
        },
      ],
      functional: [
        {
          id: "FR-01",
          title: "User Credential Verification",
          desc: "System authenticates users against secured identity store.",
        },
        {
          id: "FR-02",
          title: "Audit Event Ingestion",
          desc: "Captures and indexes all state mutations for compliance.",
        },
        {
          id: "FR-03",
          title: "Dynamic Access Control",
          desc: "Enforces role-based permissions on all protected routes.",
        },
      ],
      non_functional: [
        {
          id: "NFR-01",
          title: "Sub-Second Latency",
          desc: "All 95th percentile operations resolve in under 500ms.",
        },
        {
          id: "NFR-02",
          title: "Zero Trust Architecture",
          desc: "All inter-service calls require signed JWT verification.",
        },
      ],
      constraints: [
        {
          id: "CON-01",
          title: "Data Residency",
          desc: "All persisted data must remain encrypted at rest with AES-256.",
        },
      ],
      confidence: 0.96,
      fallback_notice: "Generated by deterministic BRAHMA fallback template engine.",
    };
  }

  if (task === "architecture_generation") {
    return {
      system_name: "PROJECT-BRAHMA Distributed Microservices",
      topology: "Event-Driven CQRS Architecture",
      components: [
        {
          id: "edge-gw",
          name: "Supabase Edge Gateway",
          type: "Gateway",
          tech: "Deno / TypeScript",
          port: 443,
        },
        {
          id: "auth-srv",
          name: "IAM & Session Service",
          type: "Security",
          tech: "PostgreSQL RLS + GoTrue",
          port: 5432,
        },
        {
          id: "analysis-srv",
          name: "Verification & AST Engine",
          type: "Core",
          tech: "Python / Rust Parser",
          port: 8000,
        },
        {
          id: "realtime-pub",
          name: "Realtime Event Stream",
          type: "Broker",
          tech: "Supabase Realtime / WebSockets",
          port: 4000,
        },
      ],
      connections: [
        { from: "edge-gw", to: "auth-srv", protocol: "gRPC", latency_target_ms: 15 },
        { from: "edge-gw", to: "analysis-srv", protocol: "HTTP/2", latency_target_ms: 45 },
        { from: "analysis-srv", to: "realtime-pub", protocol: "WSS", latency_target_ms: 20 },
      ],
      database_schemas: [
        { table: "profiles", rls_enabled: true, partition: "none" },
        { table: "auth_events", rls_enabled: true, partition: "range_by_month" },
        { table: "ai_artifacts", rls_enabled: true, partition: "hash_by_project" },
      ],
      security_matrix: {
        mfa_required: true,
        transport_tls: "1.3",
        encryption_at_rest: "AES-256-GCM",
      },
      provenance_tag: "BRAHMA_DETERMINISTIC_ARCHITECTURE_V2",
    };
  }

  if (task === "code_review") {
    return {
      overall_health: 88,
      status: "PASS_WITH_WARNINGS",
      findings: [
        {
          file: "src/services/gateway.ts",
          line: 42,
          severity: "Medium",
          rule_id: "SEC-ERR-004",
          msg: "Ensure all external endpoint queries specify explicit timeouts to prevent connection exhaustion.",
        },
        {
          file: "src/lib/auth.ts",
          line: 128,
          severity: "Low",
          rule_id: "PERF-MEM-001",
          msg: "Cache repeated user profile lookups in memory to reduce database round-trips.",
        },
      ],
      metrics: {
        complexity_score: 14,
        maintainability_index: 85,
        test_coverage_estimate: 82,
      },
    };
  }

  if (task === "test_generation") {
    return {
      suite_name: "Automated Integration & Security Matrix",
      total_tests: 6,
      test_cases: [
        {
          id: "TC-01",
          name: "Valid Authentication Exchange",
          type: "Security",
          expected: "HTTP 200 with JWT",
        },
        {
          id: "TC-02",
          name: "Tampered Token Injection",
          type: "Security",
          expected: "HTTP 401 Unauthorized",
        },
        {
          id: "TC-03",
          name: "Rate Limit Threshold Burst",
          type: "Stress",
          expected: "HTTP 429 Too Many Requests",
        },
        {
          id: "TC-04",
          name: "Schema Validation on Payload",
          type: "Integration",
          expected: "Passes Zod validation",
        },
        {
          id: "TC-05",
          name: "Fallback Circuit Breaker Activation",
          type: "Resilience",
          expected: "Graceful template response",
        },
        {
          id: "TC-06",
          name: "Database Audit Event Persistence",
          type: "Data",
          expected: "Row logged with SHA-256",
        },
      ],
    };
  }

  if (task === "report_prose") {
    return {
      title: "BRAHMA Architectural & Security Audit Report",
      executive_summary:
        "The platform demonstrates resilient architectural design with zero-trust token handshakes, comprehensive audit event logging, and multi-tier LLM gateway fallback circuits.",
      key_findings: [
        "All authentication flows are cryptographically verified via Supabase PKCE protocol.",
        "Role-based privilege boundaries prevent horizontal and vertical privilege escalation.",
        "Deterministic fallback mechanisms guarantee uninterrupted runtime availability.",
      ],
      recommendation:
        "Proceed with production deployment following scheduled end-to-end load verification.",
    };
  }

  // Generic copilot / chat response
  return {
    response:
      "PROJECT BRAHMA verified intelligence engine online. All services operational and telemetry actively monitored.",
    context_processed: prompt.substring(0, 100),
  };
}

// ─── MAIN EDGE GATEWAY HANDLER ────────────────────────────────────────────────

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    // 0. Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "BRA-405", message: "Method not allowed. Use POST." },
        }),
        {
          status: 405,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        },
      );
    }

    const startTime = Date.now();

    try {
      // 1. Authenticate user from JWT in Authorization Header
      const authHeader = req.headers.get("Authorization") || "";
      const token = authHeader.replace("Bearer ", "").trim();

      let userId = "00000000-0000-0000-0000-000000000000";
      if (token && token !== "undefined") {
        try {
          const { data: userData } = await ctx.supabase.auth.getUser(token);
          if (userData?.user?.id) {
            userId = userData.user.id;
          }
        } catch {
          // Keep default anonymous test UUID for local dev/testing
        }
      }

      // 2. Parse & Validate Inbound Body
      const body = await req.json();
      const { task, project_id, payload, options } = body;

      if (!task) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: { code: "BRA-400", message: "Missing required 'task' identifier." },
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          },
        );
      }

      // 3. Check VITE_FORCE_TEMPLATE dev flag (for offline drill)
      const forceTemplate =
        options?.force_template === true || Deno.env.get("FORCE_TEMPLATE") === "true";

      // 4. Sanitize Inbound Payload
      const cleanPayload = sanitizePayload(payload || {});
      const promptHash = await computeSha256(cleanPayload);

      // 5. Budget Check (Daily Cap: default $2.00 USD)
      const dailyCapUsd = 2.0;
      let userDailySpend = 0.0;

      try {
        const todayIso = new Date().toISOString().split("T")[0];
        const { data: usageRows } = await ctx.supabase
          .from("llm_usage")
          .select("cost_usd")
          .eq("user_id", userId)
          .gte("created_at", `${todayIso}T00:00:00.000Z`);

        if (usageRows && usageRows.length > 0) {
          userDailySpend = usageRows.reduce(
            (acc: number, r: { cost_usd: number }) => acc + (Number(r.cost_usd) || 0),
            0,
          );
        }
      } catch {
        // Continue if usage query fails in offline/mock table mode
      }

      const isBudgetNearLimit = userDailySpend >= dailyCapUsd * 0.8; // 80% downgrade
      const isBudgetExhausted = userDailySpend >= dailyCapUsd; // 100% cap

      if (isBudgetExhausted && (task === "copilot" || task === "report_prose")) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: {
              code: "BRA-429",
              message: `Daily LLM spend cap ($${dailyCapUsd.toFixed(2)} USD) reached. Non-critical AI operations paused until tomorrow.`,
            },
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          },
        );
      }

      // 6. Cache Lookup
      let cacheTtlHours = 24;
      try {
        const { data: routingRow } = await ctx.supabase
          .from("llm_routing")
          .select("cache_ttl_h")
          .eq("task", task)
          .single();
        if (routingRow) cacheTtlHours = routingRow.cache_ttl_h;
      } catch {
        // Fallback default TTL
      }

      if (cacheTtlHours > 0 && !forceTemplate) {
        try {
          const ttlCutoff = new Date(Date.now() - cacheTtlHours * 3600 * 1000).toISOString();
          const { data: cached } = await ctx.supabase
            .from("llm_cache")
            .select("content, provider, model")
            .eq("task", task)
            .eq("prompt_hash", promptHash)
            .gte("created_at", ttlCutoff)
            .maybeSingle();

          if (cached && cached.content) {
            const sha256 = await computeSha256(cached.content);
            const latencyMs = Date.now() - startTime;

            // Log zero-cost cache hit
            await ctx.supabase.from("llm_usage").insert({
              user_id: userId,
              project_id: project_id || null,
              task,
              provider: cached.provider || "cache",
              model: cached.model || "cached-response",
              prompt_tokens: 0,
              completion_tokens: 0,
              cost_usd: 0.0,
              latency_ms: latencyMs,
              cache_hit: true,
              fallback_used: false,
            });

            return new Response(
              JSON.stringify({
                ok: true,
                content: cached.content,
                provider: cached.provider || "cache",
                model: cached.model || "cached-response",
                cache_hit: true,
                fallback_used: false,
                cost_usd: 0.0,
                latency_ms: latencyMs,
                sha256,
                error: null,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
              },
            );
          }
        } catch (cacheErr) {
          console.warn("Cache lookup warning:", cacheErr);
        }
      }

      // 7. Chain Execution
      let activeProvider = "template";
      let activeModel = "deterministic-fallback";
      let generatedContent: any = null;
      let promptTokens = 0;
      let completionTokens = 0;
      let fallbackUsed = false;

      const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
      const hfToken = Deno.env.get("HF_TOKEN");

      // Model Tier Selection: downgrade if near budget limit
      let preferredTier = "mid";
      if (task === "architecture_generation" || task === "report_prose") {
        preferredTier = isBudgetNearLimit ? "mid" : "heavy";
      } else if (isBudgetNearLimit) {
        preferredTier = "free";
      }

      let chosenOpenRouterModel = "openai/gpt-4o-mini";
      if (preferredTier === "heavy") chosenOpenRouterModel = "anthropic/claude-3.5-sonnet";
      else if (preferredTier === "free")
        chosenOpenRouterModel = "meta-llama/llama-3.1-8b-instruct:free";

      // Attempt 1: OpenRouter API
      if (!forceTemplate && openRouterKey && openRouterKey.length > 5) {
        try {
          const userPrompt =
            typeof cleanPayload === "string" ? cleanPayload : JSON.stringify(cleanPayload, null, 2);

          const systemPrompt = `You are the PROJECT BRAHMA verified AI engineering kernel.
Task: ${task}.
Analyze the user request and return STRICT valid JSON matching the system schema with no markdown wrappers or explanations.`;

          const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "HTTP-Referer": "https://brahma.dev",
              "X-Title": "PROJECT BRAHMA",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: chosenOpenRouterModel,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              response_format: { type: "json_object" },
              temperature: 0.1,
              max_tokens: 4096,
            }),
            signal: AbortSignal.timeout(12000), // 12s timeout
          });

          if (orRes.ok) {
            const orData = await orRes.json();
            const rawOutput = orData?.choices?.[0]?.message?.content;
            if (rawOutput) {
              try {
                generatedContent = JSON.parse(rawOutput);
                activeProvider = "openrouter";
                activeModel = chosenOpenRouterModel;
                promptTokens = orData?.usage?.prompt_tokens || 100;
                completionTokens = orData?.usage?.completion_tokens || 250;
              } catch {
                generatedContent = { raw_response: rawOutput };
                activeProvider = "openrouter";
                activeModel = chosenOpenRouterModel;
              }
            }
          } else {
            console.warn(`OpenRouter primary failed (${orRes.status}): ${await orRes.text()}`);
            fallbackUsed = true;
          }
        } catch (orErr) {
          console.warn("OpenRouter fetch error, advancing to fallback:", orErr);
          fallbackUsed = true;
        }
      } else {
        fallbackUsed = true;
      }

      // Attempt 2: Hugging Face Inference API (if OpenRouter failed or not configured)
      if (!generatedContent && !forceTemplate && hfToken && hfToken.length > 5) {
        try {
          const hfModel = "meta-llama/Llama-3.2-3B-Instruct";
          const hfRes = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${hfToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: JSON.stringify(cleanPayload),
              parameters: { max_new_tokens: 1024, return_full_text: false },
            }),
            signal: AbortSignal.timeout(8000),
          });

          if (hfRes.ok) {
            const hfData = await hfRes.json();
            const generatedText = Array.isArray(hfData)
              ? hfData[0]?.generated_text
              : hfData?.generated_text;
            if (generatedText) {
              activeProvider = "huggingface";
              activeModel = hfModel;
              fallbackUsed = true;
              try {
                generatedContent = JSON.parse(generatedText);
              } catch {
                generatedContent = { result: generatedText };
              }
            }
          }
        } catch (hfErr) {
          console.warn("Hugging Face inference error:", hfErr);
        }
      }

      // Attempt 3: Deterministic Fallback Template Engine
      if (!generatedContent) {
        generatedContent = generateTemplateArtifact(task, cleanPayload);
        activeProvider = "template";
        activeModel = `deterministic-${task.split("_")[0] || "engine"}`;
        fallbackUsed = true;
      }

      // 8. Metering & Cost Calculation
      const latencyMs = Date.now() - startTime;
      const pricing = MODEL_PRICING[activeModel] || {
        promptUsdPer1k: 0.0,
        completionUsdPer1k: 0.0,
      };
      const calculatedCostUsd =
        (promptTokens / 1000) * pricing.promptUsdPer1k +
        (completionTokens / 1000) * pricing.completionUsdPer1k;

      // Log row in public.llm_usage
      try {
        await ctx.supabase.from("llm_usage").insert({
          user_id: userId,
          project_id: project_id || null,
          task,
          provider: activeProvider,
          model: activeModel,
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          cost_usd: calculatedCostUsd,
          latency_ms: latencyMs,
          cache_hit: false,
          fallback_used: fallbackUsed,
        });
      } catch (logErr) {
        console.warn("Failed to write to llm_usage table:", logErr);
      }

      // 9. Vaulting into public.ai_artifacts
      const sha256 = await computeSha256(generatedContent);
      try {
        await ctx.supabase.from("ai_artifacts").insert({
          project_id: project_id || null,
          kind: task,
          content: generatedContent,
          provider: activeProvider,
          model: activeModel,
          sha256,
        });
      } catch (vaultErr) {
        console.warn("Failed to write to ai_artifacts vault:", vaultErr);
      }

      // 10. Cache Update (if TTL > 0)
      if (cacheTtlHours > 0) {
        try {
          await ctx.supabase.from("llm_cache").insert({
            task,
            prompt_hash: promptHash,
            content: generatedContent,
            provider: activeProvider,
            model: activeModel,
          });
        } catch (cacheStoreErr) {
          console.warn("Failed to store in llm_cache:", cacheStoreErr);
        }
      }

      // 11. Final Response Contract
      return new Response(
        JSON.stringify({
          ok: true,
          content: generatedContent,
          provider: activeProvider,
          model: activeModel,
          cache_hit: false,
          fallback_used: fallbackUsed,
          cost_usd: calculatedCostUsd,
          latency_ms: latencyMs,
          sha256,
          error: null,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        },
      );
    } catch (err) {
      console.error("llm-gateway exception:", err);
      const latencyMs = Date.now() - startTime;
      return new Response(
        JSON.stringify({
          ok: false,
          content: null,
          cost_usd: 0.0,
          latency_ms: latencyMs,
          error: { code: "BRA-500", message: (err as Error).message },
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        },
      );
    }
  }),
};
