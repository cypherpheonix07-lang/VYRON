import { withSupabase } from "npm:@supabase/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CompareTechRequest {
  use_case?: string;
  requirements_summary?: string;
  feature_toggles?: Record<string, boolean>;
}

function getDeterministicComparison(useCase: string, features: Record<string, boolean> = {}) {
  const isEcommerce = useCase.toLowerCase().includes("commerce") || features.payments;
  const isRealtime = features.search || features.analytics;

  return {
    useCase: useCase || "Modern Web Application",
    frontendOptions: [
      {
        id: "nextjs",
        name: "Next.js 15 (App Router)",
        category: "frontend",
        score: isEcommerce ? 96 : 94,
        pros: ["Server Components & SSR for fast initial loads", "Built-in image optimization and SEO routes", "Turbopack dev velocity"],
        cons: ["Edge runtime bundle constraints", "Vercel vendor-tie subtleties"],
        synergyReasoning: "Seamless hydration and high Lighthouse performance with TypeScript.",
        recommended: true,
      },
      {
        id: "vite-react",
        name: "Vite + React 19 + TanStack",
        category: "frontend",
        score: 91,
        pros: ["Instant HMR and zero lock-in", "TanStack Router provides type-safe routes", "Lightweight bundle"],
        cons: ["Client-side rendered by default unless static/SSR configured", "Manual SEO configuration"],
        synergyReasoning: "Excellent for dashboard-heavy SPAs with complex local state.",
        recommended: false,
      },
      {
        id: "remix",
        name: "Remix / React Router v7",
        category: "frontend",
        score: 87,
        pros: ["Nested routing & web standard Request/Response", "Resilient progressive enhancement", "Fine-grained caching"],
        cons: ["Smaller community ecosystem than Next.js", "Hosting adapter complexity"],
        synergyReasoning: "Great for data-mutation heavy applications with robust form handling.",
        recommended: false,
      },
    ],
    backendOptions: [
      {
        id: "supabase-edge",
        name: "Supabase Edge Functions (Deno)",
        category: "backend",
        score: 95,
        pros: ["Sub-50ms cold starts on global edge nodes", "Native JWT verification and Supabase client bindings", "Zero server maintenance"],
        cons: ["Limited CPU time per invocation (150s)", "WASM memory caps"],
        synergyReasoning: "Direct cryptographic bridge to PostgreSQL Row Level Security.",
        recommended: true,
      },
      {
        id: "fastapi",
        name: "FastAPI + Python 3.12",
        category: "backend",
        score: isRealtime ? 92 : 88,
        pros: ["Asynchronous asyncio throughput", "Pydantic automated OpenAPI documentation", "Ideal for AI/ML and data pipelines"],
        cons: ["Requires persistent container hosting", "Manual token refresh plumbing"],
        synergyReasoning: "Optimal if heavy computational pipelines or vector scoring are required.",
        recommended: false,
      },
      {
        id: "node-express",
        name: "Node.js 22 + Fastify",
        category: "backend",
        score: 85,
        pros: ["Massive NPM package ecosystem", "High JSON serialization speed", "Familiar full-stack JavaScript syntax"],
        cons: ["Single-threaded event loop blocking pitfalls", "More boilerplate than serverless"],
        synergyReasoning: "Solid corporate standard for generic microservices.",
        recommended: false,
      },
    ],
    databaseOptions: [
      {
        id: "supabase-pg",
        name: "PostgreSQL 16 (Supabase Managed)",
        category: "database",
        score: 98,
        pros: ["Declarative Row Level Security (RLS)", "pgvector for semantic search", "Realtime WebSockets pub/sub"],
        cons: ["Connection pooling required for high concurrency", "Strict relational schemas require migrations"],
        synergyReasoning: "Zero-latency database security with built-in audit capabilities.",
        recommended: true,
      },
      {
        id: "planetscale",
        name: "PlanetScale / MySQL Vitess",
        category: "database",
        score: 86,
        pros: ["Horizontal auto-sharding", "Zero-downtime branching migrations", "High write resilience"],
        cons: ["No native foreign key enforcement", "Third-party auth integration needed"],
        synergyReasoning: "Suited for hyper-scale multi-tenant transactional systems.",
        recommended: false,
      },
      {
        id: "mongodb",
        name: "MongoDB Atlas",
        category: "database",
        score: 81,
        pros: ["Flexible schema-less document model", "Rapid early prototyping", "Rich aggregation pipeline"],
        cons: ["Weak relational integrity enforcement", "Eventual consistency risks"],
        synergyReasoning: "Good for deeply nested, unstructured document storage.",
        recommended: false,
      },
    ],
    recommendedCombo: {
      frontend: "Next.js 15 (App Router)",
      backend: "Supabase Edge Functions (Deno)",
      database: "PostgreSQL 16 (Supabase Managed)",
      rationale:
        "The Next.js 15 + Supabase Edge + PostgreSQL 16 stack provides an exceptional developer velocity, enterprise-grade Row Level Security, sub-100ms global response latencies, and unified TypeScript types from DB to UI.",
    },
  };
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const body: CompareTechRequest = await req.json().catch(() => ({}));
      const useCase = body.use_case || "SaaS Platform";
      const normalizedUseCaseKey = useCase.trim().toLowerCase();

      // Check cache in tech_stack_comparisons
      if (ctx.supabase) {
        const { data: cached } = await ctx.supabase
          .from("tech_stack_comparisons")
          .select("*")
          .eq("use_case", normalizedUseCaseKey)
          .maybeSingle();

        if (cached) {
          return new Response(
            JSON.stringify({
              ok: true,
              from_cache: true,
              comparison: {
                useCase: cached.use_case,
                frontendOptions: cached.frontend_options,
                backendOptions: cached.backend_options,
                databaseOptions: cached.database_options,
                recommendedCombo: cached.recommended_combo,
              },
            }),
            { headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      // Generate comparison
      const comparison = getDeterministicComparison(useCase, body.feature_toggles);

      // Attempt to cache in tech_stack_comparisons
      if (ctx.supabase) {
        await ctx.supabase.from("tech_stack_comparisons").upsert(
          {
            use_case: normalizedUseCaseKey,
            frontend_options: comparison.frontendOptions,
            backend_options: comparison.backendOptions,
            database_options: comparison.databaseOptions,
            recommended_combo: comparison.recommendedCombo,
          },
          { onConflict: "use_case" }
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          from_cache: false,
          comparison,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err: any) {
      console.error("[website-compare-tech] Error:", err);
      // Fail-open deterministic fallback
      const fallback = getDeterministicComparison("Web Application");
      return new Response(
        JSON.stringify({
          ok: true,
          from_cache: false,
          fallback_used: true,
          comparison: fallback,
          error: err?.message,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }),
};
