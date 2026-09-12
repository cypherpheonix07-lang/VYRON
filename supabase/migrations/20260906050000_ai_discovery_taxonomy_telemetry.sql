-- ==============================================================================
-- PROJECT BRAHMA / AI DISCOVERY PLATFORM
-- Migration: 20260906050000_ai_discovery_taxonomy_telemetry.sql
-- Idempotent DDL: AI Tools, Hierarchical Taxonomy, pgvector, Health Telemetry & RLS
-- ==============================================================================

-- 1. Enable pgvector Extension safely
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Ensure ai_tools table has all discovery, telemetry & vector columns
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  website_url TEXT NOT NULL,
  pricing_type TEXT NOT NULL DEFAULT 'freemium' CHECK (pricing_type IN ('free', 'freemium', 'paid', 'open_source')),
  starting_price_usd NUMERIC(10, 2) DEFAULT 0.00,
  verification_level TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_level IN ('unverified', 'community', 'domain', 'editor', 'data')),
  health_status TEXT NOT NULL DEFAULT 'active' CHECK (health_status IN ('active', 'healthy', 'warning', 'degraded', 'critical', 'offline', 'dead_link', 'deprecated')),
  average_rating NUMERIC(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Safely add extended taxonomy, capability, and telemetry columns if missing
ALTER TABLE public.ai_tools
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS capabilities TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS modalities TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS platforms TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS has_api BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS http_status INTEGER DEFAULT 200,
  ADD COLUMN IF NOT EXISTS last_health_check TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS content_hash TEXT,
  ADD COLUMN IF NOT EXISTS embedding_model TEXT,
  ADD COLUMN IF NOT EXISTS embedded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS embedding vector(384);

-- 3. Ensure ai_tasks table exists with hierarchical parent support
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  intent_patterns TEXT[] NOT NULL DEFAULT '{}',
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Safely add extended taxonomy columns to ai_tasks
ALTER TABLE public.ai_tasks
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.ai_tasks(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS keywords TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS synonyms TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS embedding vector(384);

-- 4. Association Table: Many-to-Many ai_tool_tasks
CREATE TABLE IF NOT EXISTS public.ai_tool_tasks (
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (tool_id, task_id)
);

-- 5. Telemetry Table: Historical Health Checks
CREATE TABLE IF NOT EXISTS public.tool_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'degraded', 'critical', 'offline', 'unknown')),
  http_status INTEGER,
  response_time_ms INTEGER,
  final_url TEXT,
  error_code TEXT,
  error_message TEXT,
  attempt_count INTEGER DEFAULT 1
);

-- 6. Indexes for High-Performance Queries & Vector Search
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON public.ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_health ON public.ai_tools(health_status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_verification ON public.ai_tools(verification_level);
CREATE INDEX IF NOT EXISTS idx_ai_tools_pricing ON public.ai_tools(pricing_type);
CREATE INDEX IF NOT EXISTS idx_ai_tools_rating ON public.ai_tools(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_slug ON public.ai_tasks(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_category ON public.ai_tasks(category);
CREATE INDEX IF NOT EXISTS idx_tool_health_checks_tool_time ON public.tool_health_checks(tool_id, checked_at DESC);

-- HNSW Vector Index on ai_tools embedding
DO $$
BEGIN
  BEGIN
    CREATE INDEX idx_ai_tools_embedding ON public.ai_tools USING hnsw (embedding vector_cosine_ops);
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      CREATE INDEX idx_ai_tools_embedding ON public.ai_tools USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END;
END $$;

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_health_checks ENABLE ROW LEVEL SECURITY;

-- Public and authenticated users can browse active AI tools & tasks
DROP POLICY IF EXISTS "Public can view active ai tools" ON public.ai_tools;
CREATE POLICY "Public can view active ai tools"
  ON public.ai_tools FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active ai tasks" ON public.ai_tasks;
CREATE POLICY "Public can view active ai tasks"
  ON public.ai_tasks FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Public can view tool task mappings" ON public.ai_tool_tasks;
CREATE POLICY "Public can view tool task mappings"
  ON public.ai_tool_tasks FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view health checks" ON public.tool_health_checks;
CREATE POLICY "Public can view health checks"
  ON public.tool_health_checks FOR SELECT
  USING (true);

-- 8. Stored Procedure: match_ai_tools for Vector Semantic Retrieval
CREATE OR REPLACE FUNCTION public.match_ai_tools(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.15,
  match_count int DEFAULT 20,
  filter_category text DEFAULT NULL,
  filter_pricing text DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  tagline TEXT,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  pricing_type TEXT,
  starting_price_usd NUMERIC,
  verification_level TEXT,
  health_status TEXT,
  latency_ms INTEGER,
  average_rating NUMERIC,
  review_count INTEGER,
  save_count INTEGER,
  capabilities TEXT[],
  modalities TEXT[],
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    t.id,
    t.name,
    t.slug,
    t.tagline,
    t.description,
    t.website_url,
    t.logo_url,
    t.pricing_type,
    t.starting_price_usd,
    t.verification_level,
    t.health_status,
    t.latency_ms,
    t.average_rating,
    t.review_count,
    t.save_count,
    t.capabilities,
    t.modalities,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM public.ai_tools t
  WHERE t.is_active = true
    AND t.embedding IS NOT NULL
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
    AND (filter_pricing IS NULL OR t.pricing_type = filter_pricing)
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
