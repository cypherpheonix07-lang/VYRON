-- ==============================================================================
-- PROJECT BRAHMA / VYRON — PART G: CONNECTOR INTELLIGENCE PLATFORM
-- Schema Migration: S27 (GitHub Hub), S28 (Integrations), S29 (Datasets)
-- Architecture: Multi-tenant, Project-Scoped, RLS-Enforced, Append-Only Audit
-- ==============================================================================

-- 1. CONNECTOR ACCOUNTS (Provider accounts linked to organizations)
CREATE TABLE IF NOT EXISTS public.connector_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'jira', 'slack', 'sentry', 'figma', 'linear', 'datadog', 'custom_webhook')),
  account_identifier TEXT NOT NULL,
  token_reference TEXT NOT NULL, -- Encrypted vault reference; raw tokens never persisted in plaintext
  scope TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired', 'revoked')),
  connected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_connector_accounts_org_provider ON public.connector_accounts(org_id, provider);
CREATE INDEX IF NOT EXISTS idx_connector_accounts_status ON public.connector_accounts(status);

-- 2. REPOSITORY-TO-PROJECT BINDINGS (S27.3)
CREATE TABLE IF NOT EXISTS public.connector_repo_bindings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  account_id UUID REFERENCES public.connector_accounts(id) ON DELETE CASCADE NOT NULL,
  repo_full_name TEXT NOT NULL,
  repo_provider_id TEXT NOT NULL,
  latest_commit_sha TEXT,
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT NOT NULL DEFAULT 'idle' CHECK (sync_status IN ('idle', 'syncing', 'synced', 'stale', 'error', 'failed')),
  issue_sync_enabled BOOLEAN NOT NULL DEFAULT false,
  issue_sync_direction TEXT NOT NULL DEFAULT 'vyron_to_github' CHECK (issue_sync_direction IN ('vyron_to_github', 'bidirectional')),
  branch_protection JSONB NOT NULL DEFAULT '{"protected": false, "requiredApprovals": 0, "requireStatusChecks": false, "allowForcePushes": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_connector_repo_bindings_project ON public.connector_repo_bindings(project_id);
CREATE INDEX IF NOT EXISTS idx_connector_repo_bindings_repo ON public.connector_repo_bindings(repo_full_name);

-- 3. INTEGRATION SYNC JOBS (Section 6.3 Durable Jobs & Checkpoints)
CREATE TABLE IF NOT EXISTS public.connector_sync_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.connector_accounts(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full', 'incremental', 'webhook_triggered')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  cursor TEXT,
  checkpoint JSONB DEFAULT '{}'::jsonb,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_connector_sync_jobs_project ON public.connector_sync_jobs(project_id, provider);
CREATE INDEX IF NOT EXISTS idx_connector_sync_jobs_status ON public.connector_sync_jobs(status);

-- 4. WEBHOOK DELIVERIES (S27.8 & S28.8 Inbound Deliveries & Audit)
CREATE TABLE IF NOT EXISTS public.connector_webhook_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.connector_accounts(id) ON DELETE SET NULL,
  delivery_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  signature_valid BOOLEAN NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received', 'processed', 'failed', 'ignored', 'duplicate')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  processed_at TIMESTAMPTZ,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_connector_webhook_delivery_id ON public.connector_webhook_deliveries(delivery_id);
CREATE INDEX IF NOT EXISTS idx_connector_webhook_status ON public.connector_webhook_deliveries(processing_status);

-- 5. EXTERNAL/VYRON RECORD MAPPINGS (S27.7, S28.4 Cross-Module Mappings)
CREATE TABLE IF NOT EXISTS public.connector_record_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  external_type TEXT NOT NULL, -- e.g. 'issue', 'ticket', 'frame', 'metric'
  vyron_id TEXT NOT NULL,
  vyron_type TEXT NOT NULL,     -- e.g. 'requirement', 'finding', 'gate_evidence'
  last_synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  conflict_state TEXT NOT NULL DEFAULT 'clean' CHECK (conflict_state IN ('clean', 'conflict', 'pending_review')),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_connector_record_mappings_lookup ON public.connector_record_mappings(project_id, provider, external_id);

-- 6. DATASET ASSETS (S29.1–S29.3 Storage References & Metadata)
CREATE TABLE IF NOT EXISTS public.dataset_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('upload', 'kaggle', 'synthetic')),
  category TEXT NOT NULL CHECK (category IN ('production', 'imported', 'synthetic')),
  storage_path TEXT NOT NULL, -- Path in private bucket
  size_bytes BIGINT NOT NULL DEFAULT 0,
  format TEXT NOT NULL CHECK (format IN ('csv', 'json', 'xlsx', 'parquet')),
  schema_hash TEXT NOT NULL,
  license TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dataset_assets_project ON public.dataset_assets(project_id, category);

-- 7. DATASET VERSIONS (S29.1, S29.7 Version Pinning)
CREATE TABLE IF NOT EXISTS public.dataset_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES public.dataset_assets(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  schema_hash TEXT NOT NULL,
  row_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(dataset_id, version_number)
);

-- 8. DATASET-TO-MODULE BINDINGS (S29.7 Cross-Module Ingestion Feeds)
CREATE TABLE IF NOT EXISTS public.dataset_bindings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES public.dataset_assets(id) ON DELETE CASCADE NOT NULL,
  version_id UUID REFERENCES public.dataset_versions(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL, -- e.g. 'S09_code_health', 'S15_security', 'S20_risk'
  project_id TEXT NOT NULL,
  schema_compatible BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stale', 'invalid')),
  bound_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  bound_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  schema_hash_at_bind TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dataset_bindings_module ON public.dataset_bindings(project_id, module_id);

-- 9. DATASET QUALITY RUNS (S29.6 6-Dimension Quality Metrics)
CREATE TABLE IF NOT EXISTS public.dataset_quality_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES public.dataset_assets(id) ON DELETE CASCADE NOT NULL,
  version_id UUID REFERENCES public.dataset_versions(id) ON DELETE CASCADE NOT NULL,
  scan_coverage TEXT NOT NULL CHECK (scan_coverage IN ('full', 'sample')),
  completeness_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  validity_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  duplication_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  type_consistency_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  anomaly_count INTEGER NOT NULL DEFAULT 0,
  report JSONB NOT NULL DEFAULT '{}'::jsonb,
  run_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.connector_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connector_repo_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connector_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connector_webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connector_record_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_quality_runs ENABLE ROW LEVEL SECURITY;

-- Default authenticated read/write scoped to owner or authenticated user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users access their own connector accounts') THEN
    CREATE POLICY "Users access their own connector accounts"
      ON public.connector_accounts FOR ALL
      TO authenticated
      USING (created_by = auth.uid())
      WITH CHECK (created_by = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users read/write repo bindings') THEN
    CREATE POLICY "Authenticated users read/write repo bindings"
      ON public.connector_repo_bindings FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users read/write datasets') THEN
    CREATE POLICY "Authenticated users read/write datasets"
      ON public.dataset_assets FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
