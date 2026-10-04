-- ==============================================================================
-- PROJECT BRAHMA: 0008_llm_gateway.sql
-- Idempotent Migration: Vector Extension, LLM Gateway Schema, RLS & Routing Tables
-- ==============================================================================

-- 1. Enable Vector Extension for Embeddings & Semantic Caching
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. LLM Usage / Metering Table
CREATE TABLE IF NOT EXISTS public.llm_usage (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  task TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0.000000,
  latency_ms INT DEFAULT 0,
  cache_hit BOOLEAN DEFAULT false,
  fallback_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. AI Artifacts / Provenance Vault Table
CREATE TABLE IF NOT EXISTS public.ai_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  content JSONB NOT NULL,
  provider TEXT,
  model TEXT,
  sha256 TEXT CHECK (length(sha256) = 64),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. LLM Semantic & Exact Cache Table
CREATE TABLE IF NOT EXISTS public.llm_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  embedding vector(384),
  content JSONB NOT NULL,
  provider TEXT,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. LLM Dynamic Routing Policy Table
CREATE TABLE IF NOT EXISTS public.llm_routing (
  task TEXT PRIMARY KEY,
  chain JSONB NOT NULL,
  cache_ttl_h INT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 6. Indexes for Performance & Vector Cosine Distance
CREATE INDEX IF NOT EXISTS idx_llm_usage_user_time ON public.llm_usage(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_usage_project ON public.llm_usage(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_artifacts_project ON public.ai_artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_artifacts_kind ON public.ai_artifacts(kind);
CREATE INDEX IF NOT EXISTS idx_llm_cache_hash ON public.llm_cache(task, prompt_hash);

-- Create HNSW Vector Index if supported, fallback to IVFFlat or standard index
DO $$
BEGIN
  BEGIN
    CREATE INDEX idx_llm_cache_embedding ON public.llm_cache USING hnsw (embedding vector_cosine_ops);
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      CREATE INDEX idx_llm_cache_embedding ON public.llm_cache USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END;
END $$;

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.llm_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_routing ENABLE ROW LEVEL SECURITY;

-- LLM Usage Policies (Read own + Admin all; Client cannot directly insert/update)
DROP POLICY IF EXISTS "Users can view own llm usage" ON public.llm_usage;
CREATE POLICY "Users can view own llm usage"
  ON public.llm_usage FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- AI Artifacts Policies (Read own/project-owner + Admin all; Edge service writes)
DROP POLICY IF EXISTS "Users can view ai artifacts" ON public.ai_artifacts;
CREATE POLICY "Users can view ai artifacts"
  ON public.ai_artifacts FOR SELECT
  TO authenticated
  USING (
    project_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = ai_artifacts.project_id AND (p.owner_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
    )
  );

-- LLM Routing Policies (Read public/auth; Update only via Admin RPC)
DROP POLICY IF EXISTS "Authenticated can view routing" ON public.llm_routing;
CREATE POLICY "Authenticated can view routing"
  ON public.llm_routing FOR SELECT
  TO authenticated
  USING (true);

-- LLM Cache Policies (Protected; Edge service writes)
DROP POLICY IF EXISTS "Authenticated read cache" ON public.llm_cache;
CREATE POLICY "Authenticated read cache"
  ON public.llm_cache FOR SELECT
  TO authenticated
  USING (true);

-- 8. Seed Locked LLM Routing Policy
INSERT INTO public.llm_routing (task, chain, cache_ttl_h)
VALUES
  (
    'requirement_extraction',
    '[
      {"provider": "openrouter", "model": "openai/gpt-4o-mini", "tier": "mid"},
      {"provider": "openrouter", "model": "meta-llama/llama-3.1-8b-instruct:free", "tier": "free"},
      {"provider": "hf", "model": "sentence-transformers/all-MiniLM-L6-v2", "tier": "hf-open"}
    ]'::jsonb,
    24
  ),
  (
    'architecture_generation',
    '[
      {"provider": "openrouter", "model": "anthropic/claude-3.5-sonnet", "tier": "heavy"},
      {"provider": "openrouter", "model": "openai/gpt-4o-mini", "tier": "mid"},
      {"provider": "template", "model": "deterministic-architect", "tier": "template"}
    ]'::jsonb,
    12
  ),
  (
    'code_review',
    '[
      {"provider": "openrouter", "model": "openai/gpt-4o-mini", "tier": "mid"},
      {"provider": "openrouter", "model": "meta-llama/llama-3.1-8b-instruct:free", "tier": "free"},
      {"provider": "template", "model": "deterministic-reviewer", "tier": "template"}
    ]'::jsonb,
    24
  ),
  (
    'test_generation',
    '[
      {"provider": "openrouter", "model": "openai/gpt-4o-mini", "tier": "mid"},
      {"provider": "openrouter", "model": "meta-llama/llama-3.1-8b-instruct:free", "tier": "free"},
      {"provider": "template", "model": "deterministic-tester", "tier": "template"}
    ]'::jsonb,
    12
  ),
  (
    'report_prose',
    '[
      {"provider": "openrouter", "model": "anthropic/claude-3.5-sonnet", "tier": "heavy"},
      {"provider": "openrouter", "model": "openai/gpt-4o-mini", "tier": "mid"}
    ]'::jsonb,
    0
  ),
  (
    'copilot',
    '[
      {"provider": "openrouter", "model": "openai/gpt-4o-mini", "tier": "mid"},
      {"provider": "openrouter", "model": "meta-llama/llama-3.1-8b-instruct:free", "tier": "free"},
      {"provider": "hf", "model": "meta-llama/Llama-3.2-3B-Instruct", "tier": "hf-open"}
    ]'::jsonb,
    0
  )
ON CONFLICT (task) DO UPDATE SET
  chain = EXCLUDED.chain,
  cache_ttl_h = EXCLUDED.cache_ttl_h,
  updated_at = timezone('utc'::text, now());

-- 9. Admin RPC: Set LLM Routing
CREATE OR REPLACE FUNCTION public.set_llm_routing(
  p_task TEXT,
  p_chain JSONB,
  p_cache_ttl_h INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Administrator privileges required to configure LLM routing.';
  END IF;

  INSERT INTO public.llm_routing (task, chain, cache_ttl_h, updated_at)
  VALUES (p_task, p_chain, p_cache_ttl_h, timezone('utc'::text, now()))
  ON CONFLICT (task) DO UPDATE SET
    chain = EXCLUDED.chain,
    cache_ttl_h = EXCLUDED.cache_ttl_h,
    updated_at = timezone('utc'::text, now());

  RETURN jsonb_build_object('success', true, 'task', p_task);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_llm_routing(TEXT, JSONB, INT) TO authenticated;

-- 10. Admin RPC: Get LLM Spend Aggregations
CREATE OR REPLACE FUNCTION public.get_llm_spend(days_n INT DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_spend NUMERIC;
  v_total_calls BIGINT;
  v_cache_hits BIGINT;
  v_fallbacks BIGINT;
  v_daily_spend JSONB;
  v_by_provider JSONB;
  v_by_task JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Administrator privileges required to access LLM financial analytics.';
  END IF;

  SELECT
    COALESCE(SUM(cost_usd), 0),
    COUNT(*),
    COUNT(*) FILTER (WHERE cache_hit = true),
    COUNT(*) FILTER (WHERE fallback_used = true)
  INTO v_total_spend, v_total_calls, v_cache_hits, v_fallbacks
  FROM public.llm_usage
  WHERE created_at >= (now() - (days_n || ' days')::interval);

  SELECT COALESCE(jsonb_agg(d), '[]'::jsonb) INTO v_daily_spend
  FROM (
    SELECT
      to_char(created_at, 'YYYY-MM-DD') AS day,
      COALESCE(SUM(cost_usd), 0) AS spend,
      COUNT(*) AS calls
    FROM public.llm_usage
    WHERE created_at >= (now() - (days_n || ' days')::interval)
    GROUP BY to_char(created_at, 'YYYY-MM-DD')
    ORDER BY day ASC
  ) d;

  SELECT COALESCE(jsonb_agg(p), '[]'::jsonb) INTO v_by_provider
  FROM (
    SELECT
      provider,
      COALESCE(SUM(cost_usd), 0) AS spend,
      COUNT(*) AS calls
    FROM public.llm_usage
    WHERE created_at >= (now() - (days_n || ' days')::interval)
    GROUP BY provider
    ORDER BY spend DESC
  ) p;

  SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) INTO v_by_task
  FROM (
    SELECT
      task,
      COALESCE(SUM(cost_usd), 0) AS spend,
      COUNT(*) AS calls
    FROM public.llm_usage
    WHERE created_at >= (now() - (days_n || ' days')::interval)
    GROUP BY task
    ORDER BY spend DESC
  ) t;

  RETURN jsonb_build_object(
    'total_spend_usd', v_total_spend,
    'total_calls', v_total_calls,
    'cache_hits', v_cache_hits,
    'fallbacks', v_fallbacks,
    'daily_spend', v_daily_spend,
    'by_provider', v_by_provider,
    'by_task', v_by_task
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_llm_spend(INT) TO authenticated;

-- 11. RPC: Semantic Match in LLM Cache
CREATE OR REPLACE FUNCTION public.match_llm_cache(
  query_embedding vector(384),
  match_task TEXT,
  match_threshold FLOAT,
  ttl_hours INT
)
RETURNS TABLE (
  id UUID,
  content JSONB,
  provider TEXT,
  model TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.content,
    c.provider,
    c.model,
    (1 - (c.embedding <=> query_embedding))::FLOAT AS similarity
  FROM public.llm_cache c
  WHERE c.task = match_task
    AND (ttl_hours = 0 OR c.created_at >= (now() - (ttl_hours || ' hours')::interval))
    AND (1 - (c.embedding <=> query_embedding)) >= match_threshold
  ORDER BY c.embedding <=> query_embedding ASC
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.match_llm_cache(vector(384), TEXT, FLOAT, INT) TO authenticated;
