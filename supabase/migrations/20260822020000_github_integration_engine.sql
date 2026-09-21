-- ==============================================================================
-- PROJECT BRAHMA — GITHUB INTEGRATION ENGINE, CACHE, REALTIME & SECURITY POLICIES
-- Target: Supabase PostgreSQL (SQL Editor / Migration)
-- ==============================================================================

-- 1. GITHUB TOKENS TABLE (ENCRYPTED / SECURED VIA RLS)
CREATE TABLE IF NOT EXISTS public.github_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'bearer',
  scopes TEXT,
  github_user_id BIGINT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. GITHUB API CACHE (TTL & RESILIENCE ENGINE)
CREATE TABLE IF NOT EXISTS public.github_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cache_key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  response_data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(user_id, cache_key)
);

-- 3. GITHUB EVENTS (REALTIME WEBHOOK PAYLOADS & TELEMETRY)
CREATE TABLE IF NOT EXISTS public.github_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  repo_name TEXT,
  payload JSONB NOT NULL,
  github_delivery_id TEXT UNIQUE,
  received_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. GITHUB SYNCED REPOSITORIES (USER'S LIVE CATALOG)
CREATE TABLE IF NOT EXISTS public.github_repos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  github_repo_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  is_fork BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  default_branch TEXT DEFAULT 'main',
  homepage TEXT,
  topics TEXT[] DEFAULT '{}',
  last_synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  github_updated_at TIMESTAMPTZ,
  UNIQUE(user_id, github_repo_id)
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS) ON ALL NEW TABLES
ALTER TABLE public.github_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;

-- 6. STRICT RLS POLICIES (USER OWNS THEIR OWN DATA)
DROP POLICY IF EXISTS "users_own_github_token" ON public.github_tokens;
CREATE POLICY "users_own_github_token" ON public.github_tokens
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_own_github_cache" ON public.github_cache;
CREATE POLICY "users_own_github_cache" ON public.github_cache
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_own_github_events" ON public.github_events;
CREATE POLICY "users_own_github_events" ON public.github_events
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_own_github_repos" ON public.github_repos;
CREATE POLICY "users_own_github_repos" ON public.github_repos
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_github_cache_user_key 
  ON public.github_cache(user_id, cache_key);
CREATE INDEX IF NOT EXISTS idx_github_events_user_received 
  ON public.github_events(user_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_github_repos_user 
  ON public.github_repos(user_id, github_updated_at DESC);

-- 8. SUPABASE REALTIME PUBLICATION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'github_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.github_events;
  END IF;
END $$;

-- 9. TIGHTEN PROFILES RLS POLICY (ELIMINATE CROSS-READ LEAK)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- 10. REPAIR TRIGGER PERMISSIONS FOR SERVICE CLIENT & ADMIN BOOTSTRAP
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  current_user_id UUID := auth.uid();
BEGIN
  IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;

  -- Allow service_role key or background migrations where auth.uid() is null
  IF (auth.jwt() ->> 'role') = 'service_role' OR auth.role() = 'service_role' OR current_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = current_user_id;

  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Permission denied: Cannot modify account role without administrator privileges.';
  END IF;

  RETURN NEW;
END;
$$;
