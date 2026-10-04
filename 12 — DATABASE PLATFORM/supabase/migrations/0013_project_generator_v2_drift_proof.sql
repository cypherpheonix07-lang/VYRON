-- ==============================================================================
-- PROJECT BRAHMA — NEW PROJECT GENERATOR V2: DRIFT-PROOF MIGRATION
-- Migration: 0013_project_generator_v2_drift_proof.sql
-- Idempotent DDL, Schema Hardening, Seed Catalogs, RLS & Missing-Column Verification
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. EXTEND PROJECTS TABLE (14 ADDITIONAL ATTRIBUTES)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  -- Step 1 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='slug') THEN
    ALTER TABLE public.projects ADD COLUMN slug TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='tags') THEN
    ALTER TABLE public.projects ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='icon') THEN
    ALTER TABLE public.projects ADD COLUMN icon TEXT DEFAULT 'Folder';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='cover') THEN
    ALTER TABLE public.projects ADD COLUMN cover TEXT DEFAULT 'from-blue-600 to-indigo-800';
  END IF;

  -- Step 2 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='scale') THEN
    ALTER TABLE public.projects ADD COLUMN scale TEXT DEFAULT 'production' CHECK (scale IN ('prototype', 'production', 'enterprise'));
  END IF;

  -- Step 3 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='accessibility') THEN
    ALTER TABLE public.projects ADD COLUMN accessibility BOOLEAN NOT NULL DEFAULT false;
  END IF;

  -- Step 4 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='stack') THEN
    ALTER TABLE public.projects ADD COLUMN stack TEXT DEFAULT 'react-fastapi' CHECK (stack IN ('ai-decides', 'react-fastapi', 'next-serverless', 'custom'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='repo_full_name') THEN
    ALTER TABLE public.projects ADD COLUMN repo_full_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='complexity_budget') THEN
    ALTER TABLE public.projects ADD COLUMN complexity_budget INTEGER NOT NULL DEFAULT 5 CHECK (complexity_budget BETWEEN 1 AND 10);
  END IF;

  -- Step 5 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='ai_tasks') THEN
    ALTER TABLE public.projects ADD COLUMN ai_tasks JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  -- Step 6 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='allow_override') THEN
    ALTER TABLE public.projects ADD COLUMN allow_override BOOLEAN NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='retention') THEN
    ALTER TABLE public.projects ADD COLUMN retention TEXT DEFAULT '90d' CHECK (retention IN ('90d', '1y', '7y'));
  END IF;

  -- Step 7 attributes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='milestone') THEN
    ALTER TABLE public.projects ADD COLUMN milestone DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='cadence') THEN
    ALTER TABLE public.projects ADD COLUMN cadence TEXT DEFAULT 'weekly' CHECK (cadence IN ('weekly', 'biweekly', 'monthly'));
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. CREATE PROJECT_PERSONAS CATALOG TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Engineering',
  default_priority INTEGER NOT NULL DEFAULT 1,
  icon TEXT DEFAULT 'Users',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.project_personas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active personas" ON public.project_personas;
CREATE POLICY "Anyone can read active personas"
  ON public.project_personas FOR SELECT
  TO public
  USING (active = true);

-- Seed Essential Project Personas
INSERT INTO public.project_personas (slug, label, description, category, default_priority, icon, active)
VALUES
  ('software-engineer', 'Software Engineer', 'Core developer writing application logic, APIs, and microservices.', 'Engineering', 1, 'Code', true),
  ('devops-sre', 'DevOps / SRE', 'Platform and infrastructure engineer managing CI/CD, Kubernetes, and uptime.', 'Engineering', 2, 'Terminal', true),
  ('qa-test-lead', 'QA & Test Engineer', 'Test automation architect overseeing end-to-end and regression coverage.', 'Engineering', 3, 'CheckCircle', true),
  ('secops-analyst', 'Security / SecOps', 'Cybersecurity officer monitoring CVEs, compliance gates, and pen-tests.', 'Security', 4, 'Shield', true),
  ('product-manager', 'Product Manager', 'Feature roadmap owner defining functional requirements and acceptance criteria.', 'Product', 5, 'Briefcase', true),
  ('ui-ux-designer', 'UI / UX Designer', 'Design systems lead creating Figma flows, accessibility, and visual tokens.', 'Product', 6, 'Palette', true),
  ('data-engineer', 'Data Engineer', 'Pipelines architect managing ETL streams, warehousing, and analytics schema.', 'Engineering', 7, 'Database', true),
  ('engineering-lead', 'Engineering Director / VP', 'Executive stakeholder tracking delivery risk, health scores, and velocity.', 'Executive', 8, 'Award', true),
  ('compliance-officer', 'Compliance Officer', 'Governance lead auditing SOC2, HIPAA, and regulatory artifact retention.', 'Security', 9, 'FileText', true),
  ('support-engineer', 'Support / Customer Success', 'Operational stakeholder monitoring system health, error logs, and client telemetry.', 'Operations', 10, 'LifeBuoy', true),
  ('ai-ml-researcher', 'AI / ML Scientist', 'Model evaluation specialist auditing tokens, embeddings, and prompt accuracy.', 'Engineering', 11, 'Brain', true),
  ('external-client', 'External End User', 'End consumer or tenant interacting with web and mobile client interfaces.', 'External', 12, 'Globe', true)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  default_priority = EXCLUDED.default_priority,
  icon = EXCLUDED.icon,
  active = EXCLUDED.active;

-- ------------------------------------------------------------------------------
-- 3. CREATE LLM_ROUTING PRICING CATALOG TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.llm_routing (
  task TEXT PRIMARY KEY,
  task_name TEXT NOT NULL,
  avg_tokens INTEGER NOT NULL DEFAULT 3500,
  provider TEXT NOT NULL DEFAULT 'openrouter',
  model TEXT NOT NULL DEFAULT 'openai/gpt-4o-mini',
  price_per_1k NUMERIC(10, 6) NOT NULL DEFAULT 0.001500,
  chain JSONB NOT NULL DEFAULT '[]'::jsonb,
  cache_ttl_h INTEGER NOT NULL DEFAULT 24,
  active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.llm_routing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view routing pricing" ON public.llm_routing;
CREATE POLICY "Public can view routing pricing"
  ON public.llm_routing FOR SELECT
  TO public
  USING (true);

-- Seed Dynamic Pricing & Task Cost Entries
INSERT INTO public.llm_routing (task, task_name, avg_tokens, provider, model, price_per_1k, chain, cache_ttl_h, active)
VALUES
  ('requirement_extraction', 'Requirement Extraction', 2500, 'openrouter', 'openai/gpt-4o-mini', 0.000150, '[{"provider": "openrouter", "model": "openai/gpt-4o-mini", "price_per_1k": 0.00015}]'::jsonb, 24, true),
  ('architecture_generation', 'Architecture Synthesis', 6000, 'openrouter', 'anthropic/claude-3.5-sonnet', 0.003000, '[{"provider": "openrouter", "model": "anthropic/claude-3.5-sonnet", "price_per_1k": 0.00300}]'::jsonb, 12, true),
  ('code_review', 'AST Code Review & Complexity', 4000, 'openrouter', 'openai/gpt-4o-mini', 0.000150, '[{"provider": "openrouter", "model": "openai/gpt-4o-mini", "price_per_1k": 0.00015}]'::jsonb, 24, true),
  ('test_generation', 'Unit & Integration Test Gen', 3500, 'openrouter', 'openai/gpt-4o-mini', 0.000150, '[{"provider": "openrouter", "model": "openai/gpt-4o-mini", "price_per_1k": 0.00015}]'::jsonb, 12, true),
  ('report_prose', 'Audit Report Prose & Cryptography', 5000, 'openrouter', 'anthropic/claude-3.5-sonnet', 0.003000, '[{"provider": "openrouter", "model": "anthropic/claude-3.5-sonnet", "price_per_1k": 0.00300}]'::jsonb, 0, true),
  ('copilot', 'Autonomous Architecture Copilot', 4500, 'openrouter', 'openai/gpt-4o-mini', 0.000150, '[{"provider": "openrouter", "model": "openai/gpt-4o-mini", "price_per_1k": 0.00015}]'::jsonb, 0, true)
ON CONFLICT (task) DO UPDATE SET
  task_name = EXCLUDED.task_name,
  avg_tokens = EXCLUDED.avg_tokens,
  provider = EXCLUDED.provider,
  model = EXCLUDED.model,
  price_per_1k = EXCLUDED.price_per_1k,
  chain = EXCLUDED.chain,
  cache_ttl_h = EXCLUDED.cache_ttl_h,
  active = EXCLUDED.active,
  updated_at = timezone('utc'::text, now());

-- ------------------------------------------------------------------------------
-- 4. CREATE PROJECT_TEMPLATES CATALOG TABLE (PRESET MATCHER)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  domains TEXT[] NOT NULL DEFAULT '{}',
  modules TEXT[] NOT NULL DEFAULT '{}',
  recommended_stack TEXT NOT NULL DEFAULT 'react-fastapi',
  feature_toggles JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view project templates" ON public.project_templates;
CREATE POLICY "Public can view project templates"
  ON public.project_templates FOR SELECT
  TO public
  USING (true);

-- Seed Enterprise Templates
INSERT INTO public.project_templates (slug, name, description, domains, modules, recommended_stack, feature_toggles, active)
VALUES
  (
    'enterprise-saas',
    'Enterprise Multi-Tenant SaaS',
    'Production-grade cloud architecture with RBAC, Stripe billing, and audit logs.',
    ARRAY['web', 'fintech', 'api'],
    ARRAY['auth', 'payments', 'audit_logs', 'analytics', 'file_uploads', 'notifications'],
    'next-serverless',
    '{"auth": true, "payments": true, "invoicing": true, "audit_logs": true, "analytics": true, "file_uploads": true, "notifications": true}'::jsonb,
    true
  ),
  (
    'healthcare-telemetry',
    'HIPAA Compliant Health Telemetry',
    'High-security microservice mesh with cryptographic audit trails and encrypted patient storage.',
    ARRAY['healthcare', 'iot', 'api'],
    ARRAY['auth', 'audit_logs', 'file_uploads', 'realtime', 'notifications'],
    'react-fastapi',
    '{"auth": true, "audit_logs": true, "file_uploads": true, "realtime": true, "notifications": true}'::jsonb,
    true
  ),
  (
    'ai-discovery-hub',
    'Autonomous AI Agent & Discovery Hub',
    'Generative AI tool taxonomy and vector search catalog with semantic LLM routing.',
    ARRAY['aiml', 'web', 'devops'],
    ARRAY['auth', 'search', 'copilot', 'analytics', 'realtime'],
    'react-fastapi',
    '{"auth": true, "search": true, "copilot": true, "analytics": true, "realtime": true}'::jsonb,
    true
  ),
  (
    'fintech-ledger',
    'PCI-DSS Banking & Payments Gateway',
    'Zero-trust financial transaction settlement engine with immutable WORM ledger.',
    ARRAY['fintech', 'api', 'security'],
    ARRAY['auth', 'payments', 'invoicing', 'audit_logs', 'realtime'],
    'react-fastapi',
    '{"auth": true, "payments": true, "invoicing": true, "audit_logs": true, "realtime": true}'::jsonb,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  domains = EXCLUDED.domains,
  modules = EXCLUDED.modules,
  recommended_stack = EXCLUDED.recommended_stack,
  feature_toggles = EXCLUDED.feature_toggles,
  active = EXCLUDED.active;

-- ------------------------------------------------------------------------------
-- 4.5 RLS DRAFT ISOLATION POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can manage own drafts'
  ) THEN
    CREATE POLICY "Users can manage own drafts"
      ON projects
      FOR ALL
      USING (auth.uid() = owner_id)
      WITH CHECK (auth.uid() = owner_id);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. MISSING-COLUMN VERIFICATION REPORT QUERY
-- ------------------------------------------------------------------------------
-- This block asserts that zero required columns are missing across all wizard entities.
SELECT
  target_table,
  required_column,
  CASE WHEN col_exists THEN 'EXISTS' ELSE 'MISSING' END AS status
FROM (
  SELECT 'projects' AS target_table, unnest(ARRAY[
    'id', 'owner_id', 'name', 'slug', 'description', 'tags', 'icon', 'cover',
    'domain', 'domain_secondary', 'scale', 'target_users', 'accessibility',
    'platforms', 'stack', 'repo_full_name', 'complexity_budget',
    'feature_toggles', 'ai_tasks', 'gate_strictness', 'compliance_pack',
    'allow_override', 'retention', 'kpi_targets', 'budget_cap_usd',
    'milestone', 'cadence', 'draft_state', 'wizard_step', 'health_score', 'status'
  ]) AS required_column
) req
LEFT JOIN LATERAL (
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = req.target_table
      AND column_name = req.required_column
  ) AS col_exists
) checked ON true
WHERE NOT col_exists;
-- MUST RETURN 0 ROWS.
