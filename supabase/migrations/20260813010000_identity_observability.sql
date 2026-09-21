-- ==============================================================================
-- PROJECT BRAHMA — FULL DATABASE SCHEMA, EXTENSIONS, RPCs & RLS POLICIES
-- Target: Supabase PostgreSQL (SQL Editor / Migration)
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ------------------------------------------------------------------------------
-- 1. EXTENDED PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  title TEXT,
  department TEXT,
  register_number TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'startup', 'admin', 'reviewer')),
  onboarded BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  goals TEXT[] DEFAULT '{}',
  proficiency TEXT DEFAULT 'Intermediate',
  milestone_deadline DATE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  linked_urls JSONB DEFAULT '{}'::jsonb,
  profile_completeness INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure all extended columns exist if table was already created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='display_name') THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='title') THEN
    ALTER TABLE public.profiles ADD COLUMN title TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='department') THEN
    ALTER TABLE public.profiles ADD COLUMN department TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='register_number') THEN
    ALTER TABLE public.profiles ADD COLUMN register_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='goals') THEN
    ALTER TABLE public.profiles ADD COLUMN goals TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='proficiency') THEN
    ALTER TABLE public.profiles ADD COLUMN proficiency TEXT DEFAULT 'Intermediate';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='milestone_deadline') THEN
    ALTER TABLE public.profiles ADD COLUMN milestone_deadline DATE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='timezone') THEN
    ALTER TABLE public.profiles ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='linked_urls') THEN
    ALTER TABLE public.profiles ADD COLUMN linked_urls JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='profile_completeness') THEN
    ALTER TABLE public.profiles ADD COLUMN profile_completeness INT NOT NULL DEFAULT 0;
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. AUTH EVENTS TABLE (SECURITY & AUDIT OBSERVABILITY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.auth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  event TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'blocked')),
  ip INET,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.auth_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. USER INTEGRATIONS TABLE (GITHUB, GITLAB, TOKENS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_integrations (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  external_id TEXT,
  username TEXT NOT NULL,
  avatar_url TEXT,
  access_token BYTEA,
  scopes TEXT[] DEFAULT '{}',
  repo_count INT NOT NULL DEFAULT 0,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, provider)
);

ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4. INTEGRATION EVENTS TABLE (REALTIME PUSH FEED)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'github',
  repo TEXT NOT NULL,
  branch TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  message TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.integration_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  health_score INT NOT NULL DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 7. STORAGE BUCKET: AVATARS
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public avatars access" ON storage.objects;
CREATE POLICY "Public avatars access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- ------------------------------------------------------------------------------
-- 8. TRIGGERS & SECURITY FUNCTIONS
-- ------------------------------------------------------------------------------

-- Helper Function: Check Admin without RLS recursion
DROP FUNCTION IF EXISTS public.is_admin(UUID);
DROP FUNCTION IF EXISTS public.is_admin();
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  is_adm BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN ((auth.jwt() ->> 'role') = 'service_role' OR auth.role() = 'service_role');
  END IF;
  
  SELECT (role = 'admin') INTO is_adm
  FROM public.profiles
  WHERE id = COALESCE(user_id, auth.uid());

  RETURN COALESCE(is_adm, false);
END;
$$;

-- Trigger Function: Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    display_name,
    role,
    onboarded,
    avatar_url,
    goals,
    proficiency
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(LOWER(NEW.raw_user_meta_data->>'role'), 'student'),
    false,
    NEW.raw_user_meta_data->>'avatar_url',
    ARRAY[]::TEXT[],
    'Intermediate'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger Function: Prevent Role Self-Change
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;

  -- Allow service_role key or backend processes where auth.uid() is null
  IF (auth.jwt() ->> 'role') = 'service_role' OR auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Permission denied: Cannot modify account role without administrator privileges.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_prevent_role_self_change ON public.profiles;
CREATE TRIGGER tr_prevent_role_self_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_change();

-- Function: Admin Set User Role
DROP FUNCTION IF EXISTS public.set_user_role(UUID, TEXT);
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id UUID, target_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only platform administrators can assign user roles.';
  END IF;

  IF target_role NOT IN ('student', 'faculty', 'startup', 'admin', 'reviewer') THEN
    RAISE EXCEPTION 'Invalid role: %', target_role;
  END IF;

  UPDATE public.profiles
  SET role = target_role, updated_at = timezone('utc'::text, now())
  WHERE id = target_user_id;
END;
$$;

-- Function: Dashboard Statistics RPC
DROP FUNCTION IF EXISTS public.get_dashboard_stats();
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (projects_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*)::BIGINT
  FROM public.projects
  WHERE owner_id = auth.uid();
END;
$$;

-- Function: Project Trace RPC
DROP FUNCTION IF EXISTS public.project_trace(UUID);
CREATE OR REPLACE FUNCTION public.project_trace(project_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  res JSONB;
BEGIN
  SELECT to_jsonb(p) INTO res
  FROM public.projects p
  WHERE p.id = project_id AND (p.owner_id = auth.uid() OR public.is_admin());
  
  RETURN COALESCE(res, '{}'::jsonb);
END;
$$;

-- Function: Health Recompute RPC
DROP FUNCTION IF EXISTS public.health_recompute(UUID);
CREATE OR REPLACE FUNCTION public.health_recompute(project_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_score INT := 92;
BEGIN
  UPDATE public.projects
  SET health_score = new_score, updated_at = timezone('utc'::text, now())
  WHERE id = project_id AND (owner_id = auth.uid() OR public.is_admin());
  
  RETURN new_score;
END;
$$;

-- ------------------------------------------------------------------------------
-- 8.1 ENSURE PROFILE RPC (CLIENT-SAFE BOOTSTRAP)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_email TEXT;
  v_meta JSONB;
  v_name TEXT;
  v_profile public.profiles%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;

  SELECT email, raw_user_meta_data INTO v_email, v_meta
  FROM auth.users
  WHERE id = v_user_id;

  v_name := COALESCE(v_meta->>'full_name', v_meta->>'name', split_part(v_email, '@', 1), 'User');

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    display_name,
    role,
    onboarded
  )
  VALUES (
    v_user_id,
    v_email,
    v_name,
    v_name,
    COALESCE(LOWER(v_meta->>'role'), 'student'),
    false
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;
  RETURN jsonb_build_object('ok', true, 'profile', to_jsonb(v_profile));
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated;

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES (NO RECURSION)
-- ------------------------------------------------------------------------------

-- PROFILES POLICIES (Strictly non-recursive: auth.uid() = id)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or admin all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full profile access" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- AUTH EVENTS POLICIES
DROP POLICY IF EXISTS "Users can view own auth events" ON public.auth_events;
DROP POLICY IF EXISTS "Admins can view all auth events" ON public.auth_events;
DROP POLICY IF EXISTS "Authenticated users can insert auth events" ON public.auth_events;

CREATE POLICY "Users can view own auth events"
  ON public.auth_events
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can insert auth events"
  ON public.auth_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- USER INTEGRATIONS POLICIES
DROP POLICY IF EXISTS "Users can view own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can update own integrations" ON public.user_integrations;
DROP POLICY IF EXISTS "Users can delete own integrations" ON public.user_integrations;

CREATE POLICY "Users can view own integrations"
  ON public.user_integrations
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own integrations"
  ON public.user_integrations
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- INTEGRATION EVENTS POLICIES
DROP POLICY IF EXISTS "Users can view own integration events" ON public.integration_events;
CREATE POLICY "Users can view own integration events"
  ON public.integration_events
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- PROJECTS POLICIES
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (owner_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Users can insert own projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (owner_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
  WITH CHECK (owner_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (owner_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Users can insert own notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- ------------------------------------------------------------------------------
-- 10. REALTIME REPLICATION CONFIGURATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.integration_events;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;
