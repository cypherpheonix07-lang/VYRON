-- ==============================================================================
-- PROJECT BRAHMA — GITHUB CONNECTOR REBUILD: MULTI-ACCOUNT + REPO SELECTION
-- Migration: 0011_github_multi_account.sql
-- ==============================================================================

-- 0. ENABLE CRYPTOGRAPHIC EXTENSION
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. GITHUB MULTI-ACCOUNT IDENTITIES TABLE
CREATE TABLE IF NOT EXISTS public.github_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  github_login TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('user', 'organization')),
  avatar_url TEXT,
  access_token_encrypted BYTEA NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['repo', 'read:org', 'read:user']::TEXT[],
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, github_login)
);

-- 2. PROJECT REPOSITORIES BINDING TABLE (SCOPED TO PROJECTS)
CREATE TABLE IF NOT EXISTS public.project_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  github_account_id UUID REFERENCES public.github_accounts(id) ON DELETE CASCADE NOT NULL,
  repo_full_name TEXT NOT NULL,
  repo_id BIGINT,
  private BOOLEAN DEFAULT false NOT NULL,
  language TEXT,
  default_branch TEXT DEFAULT 'main' NOT NULL,
  webhook_id BIGINT,
  webhook_secret TEXT,
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'synced', 'failed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (project_id, repo_full_name)
);

-- 3. OPTIMIZED COVERING INDEXES
CREATE INDEX IF NOT EXISTS idx_github_accounts_user_id ON public.github_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_repos_project_id ON public.project_repos(project_id);
CREATE INDEX IF NOT EXISTS idx_project_repos_account_id ON public.project_repos(github_account_id);
CREATE INDEX IF NOT EXISTS idx_project_repos_repo_name ON public.project_repos(repo_full_name);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_repos ENABLE ROW LEVEL SECURITY;

-- github_accounts: Users can ONLY select their own rows; NO direct client write (enforced via Edge functions & service role)
DROP POLICY IF EXISTS "github_accounts_select_own" ON public.github_accounts;
CREATE POLICY "github_accounts_select_own" ON public.github_accounts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- project_repos: Users can ONLY select repos belonging to projects they own; NO direct client write
DROP POLICY IF EXISTS "project_repos_select_owner" ON public.project_repos;
CREATE POLICY "project_repos_select_owner" ON public.project_repos
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_repos.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- 5. REALTIME PUBLICATION SUBSCRIPTION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_repos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_repos;
  END IF;
END $$;

-- 6. TOKEN ENCRYPTION/DECRYPTION DATABASE RPC HELPERS (Optional PGP Fallback)
CREATE OR REPLACE FUNCTION public.encrypt_github_token(
  p_token TEXT,
  p_secret TEXT
)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN pgp_sym_encrypt(p_token, p_secret);
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_github_token(
  p_encrypted BYTEA,
  p_secret TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN pgp_sym_decrypt(p_encrypted, p_secret);
END;
$$;

-- 7. NOTE: user_integrations is officially DEPRECATED for GitHub.
-- All GitHub tokens and account identities now live exclusively in github_accounts.
