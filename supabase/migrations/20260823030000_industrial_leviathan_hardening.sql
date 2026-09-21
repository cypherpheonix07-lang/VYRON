-- ==============================================================================
-- PROJECT BRAHMA — INDUSTRIAL LEVIATHAN HARDENING MIGRATION
-- Migration Version: 20260823030000
-- Scope: Optimistic Concurrency Locking, WORM Audit Logs, Webhook Ingest Queue
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. OPTIMISTIC CONCURRENCY CONTROL (VERSION COLUMNS)
-- ------------------------------------------------------------------------------

-- 1.1 Projects Table Versioning
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='projects' AND column_name='version'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
  END IF;
END $$;

-- 1.2 Requirements Table & Versioning
CREATE TABLE IF NOT EXISTS public.requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  req_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'functional' CHECK (category IN ('functional', 'non_functional', 'constraint', 'security')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'implemented', 'verified', 'deprecated')),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(project_id, req_code)
);

ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "requirements_project_owner" ON public.requirements;
CREATE POLICY "requirements_project_owner" ON public.requirements
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = requirements.project_id AND p.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = requirements.project_id AND p.owner_id = auth.uid()));

-- 1.3 Blueprint Nodes Table & Versioning
CREATE TABLE IF NOT EXISTS public.blueprint_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  node_key TEXT NOT NULL,
  label TEXT NOT NULL,
  node_type TEXT NOT NULL DEFAULT 'service' CHECK (node_type IN ('service', 'database', 'cache', 'gateway', 'queue', 'external')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(project_id, node_key)
);

ALTER TABLE public.blueprint_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blueprint_nodes_project_owner" ON public.blueprint_nodes;
CREATE POLICY "blueprint_nodes_project_owner" ON public.blueprint_nodes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = blueprint_nodes.project_id AND p.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = blueprint_nodes.project_id AND p.owner_id = auth.uid()));

-- 1.4 Optimistic Update RPC: update_project_optimistic
CREATE OR REPLACE FUNCTION public.update_project_optimistic(
  p_id UUID,
  p_expected_version INTEGER,
  p_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_health_score INTEGER DEFAULT NULL,
  p_status TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  name TEXT,
  description TEXT,
  health_score INTEGER,
  status TEXT,
  version INTEGER,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_rows INTEGER;
BEGIN
  -- Optimistic update with version increment
  UPDATE public.projects
  SET
    name = COALESCE(p_name, projects.name),
    description = COALESCE(p_description, projects.description),
    health_score = COALESCE(p_health_score, projects.health_score),
    status = COALESCE(p_status, projects.status),
    version = projects.version + 1,
    updated_at = timezone('utc'::text, now())
  WHERE projects.id = p_id AND projects.version = p_expected_version;

  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

  IF v_updated_rows = 0 THEN
    RAISE EXCEPTION 'BRA-409: Conflict (Concurrent Modification) - Expected version %, but the record was modified by another transaction or does not exist.', p_expected_version
      USING ERRCODE = '40001';
  END IF;

  RETURN QUERY
  SELECT 
    p.id, p.owner_id, p.name, p.description, p.health_score, p.status, p.version, p.updated_at
  FROM public.projects p
  WHERE p.id = p_id;
END;
$$;

-- 1.5 Optimistic Update RPC: update_requirement_optimistic
CREATE OR REPLACE FUNCTION public.update_requirement_optimistic(
  p_id UUID,
  p_expected_version INTEGER,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  project_id UUID,
  req_code TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  priority TEXT,
  status TEXT,
  version INTEGER,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_rows INTEGER;
BEGIN
  UPDATE public.requirements
  SET
    title = COALESCE(p_title, requirements.title),
    description = COALESCE(p_description, requirements.description),
    category = COALESCE(p_category, requirements.category),
    priority = COALESCE(p_priority, requirements.priority),
    status = COALESCE(p_status, requirements.status),
    version = requirements.version + 1,
    updated_at = timezone('utc'::text, now())
  WHERE requirements.id = p_id AND requirements.version = p_expected_version;

  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

  IF v_updated_rows = 0 THEN
    RAISE EXCEPTION 'BRA-409: Conflict (Concurrent Modification) - Expected version %, but the requirement was modified by another transaction.', p_expected_version
      USING ERRCODE = '40001';
  END IF;

  RETURN QUERY
  SELECT 
    r.id, r.project_id, r.req_code, r.title, r.description, r.category, r.priority, r.status, r.version, r.updated_at
  FROM public.requirements r
  WHERE r.id = p_id;
END;
$$;


-- ------------------------------------------------------------------------------
-- 2. IMMUTABLE AUDIT LOGS (WORM — WRITE ONCE, READ MANY)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  client_ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow insert and read to authenticated users
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);

DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs;
CREATE POLICY "audit_logs_select" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (actor_id = auth.uid() OR tenant_id = auth.uid() OR public.is_admin());

-- 2.1 WORM Mutation Blocker Trigger
CREATE OR REPLACE FUNCTION public.prevent_audit_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'BRA-403: Forbidden - Audit logs are strictly immutable (WORM policy enforced). UPDATE, DELETE, and TRUNCATE operations are permanently prohibited.'
    USING ERRCODE = '42501';
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_mutation_row ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_mutation_row
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_mutation();

DROP TRIGGER IF EXISTS trg_prevent_audit_mutation_stmt ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_mutation_stmt
  BEFORE TRUNCATE ON public.audit_logs
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.prevent_audit_mutation();

-- 2.2 Hard Revocation of Privileges
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.audit_logs FROM PUBLIC, anon, authenticated;


-- ------------------------------------------------------------------------------
-- 3. ASYNCHRONOUS WEBHOOK INGESTION QUEUE (<50ms GitHub Response)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.webhook_ingest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'github',
  event_type TEXT NOT NULL,
  delivery_id TEXT UNIQUE,
  signature TEXT,
  hmac_verified BOOLEAN NOT NULL DEFAULT true,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  processed_at TIMESTAMPTZ
);

ALTER TABLE public.webhook_ingest ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_webhook_ingest_status_created 
  ON public.webhook_ingest (status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_webhook_ingest_delivery 
  ON public.webhook_ingest (delivery_id);

-- System service policy
DROP POLICY IF EXISTS "webhook_ingest_service" ON public.webhook_ingest;
CREATE POLICY "webhook_ingest_service" ON public.webhook_ingest
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);
