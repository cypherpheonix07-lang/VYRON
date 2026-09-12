import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type {
  TechStackComparison,
  SelectedTechStack,
  FeatureToggles,
} from "@/types/websiteStudio";

const DEFAULT_COMPARISON: TechStackComparison = {
  useCase: "Modern Cloud Application",
  frontendOptions: [
    {
      id: "nextjs",
      name: "Next.js 15 (App Router)",
      category: "frontend",
      score: 95,
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
      score: 89,
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

export function useTechComparison(
  useCase: string,
  featureToggles: FeatureToggles,
  initialStack?: SelectedTechStack
) {
  const [comparison, setComparison] = useState<TechStackComparison>(DEFAULT_COMPARISON);
  const [selectedStack, setSelectedStack] = useState<SelectedTechStack>(
    initialStack || {
      frontend: "Next.js 15 (App Router)",
      backend: "Supabase Edge Functions (Deno)",
      database: "PostgreSQL 16 (Supabase Managed)",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("website-compare-tech", {
        body: {
          use_case: useCase,
          feature_toggles: featureToggles,
        },
      });

      if (fnError || !data?.ok) {
        // Fallback to local default with updated useCase
        setComparison((prev) => ({
          ...prev,
          useCase: useCase || prev.useCase,
        }));
      } else if (data.comparison) {
        setComparison(data.comparison);
        if (!initialStack && data.comparison.recommendedCombo) {
          setSelectedStack({
            frontend: data.comparison.recommendedCombo.frontend,
            backend: data.comparison.recommendedCombo.backend,
            database: data.comparison.recommendedCombo.database,
          });
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to compare tech stacks");
      setComparison((prev) => ({ ...prev, useCase: useCase || prev.useCase }));
    } finally {
      setLoading(false);
    }
  }, [useCase, featureToggles, initialStack]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const setLayerChoice = (category: "frontend" | "backend" | "database", optionName: string) => {
    setSelectedStack((prev) => ({
      ...prev,
      [category]: optionName,
    }));
  };

  const resetToRecommended = () => {
    if (comparison.recommendedCombo) {
      setSelectedStack({
        frontend: comparison.recommendedCombo.frontend,
        backend: comparison.recommendedCombo.backend,
        database: comparison.recommendedCombo.database,
      });
    }
  };

  return {
    comparison,
    selectedStack,
    loading,
    error,
    setLayerChoice,
    resetToRecommended,
    refetch: fetchComparison,
  };
}
