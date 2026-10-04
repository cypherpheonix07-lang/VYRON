-- ==============================================================================
-- PROJECT BRAHMA: 0009_profile_center.sql
-- Idempotent Migration: Extended Profile Center, Settings, Server-Enforced Privacy RPCs
-- ==============================================================================

-- 1. Extend Public Profiles with Granular Persona & Visibility Dimensions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS handle TEXT,
  ADD COLUMN IF NOT EXISTS pronouns TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS location_city TEXT,
  ADD COLUMN IF NOT EXISTS location_country TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resume_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS academic JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS professional JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS engineering JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS publications JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS visibility JSONB DEFAULT '{
    "identity": "team",
    "academic": "team",
    "professional": "team",
    "engineering": "team",
    "activity": "team",
    "security": "private"
  }'::jsonb;

-- Ensure unique index on non-null handles
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle ON public.profiles(LOWER(handle)) WHERE handle IS NOT NULL;

-- 2. User Settings & Preferences Table
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  prefs JSONB NOT NULL DEFAULT '{
    "default_template": "academic",
    "density": "comfortable",
    "reduced_motion": false,
    "high_contrast": false,
    "language": "en",
    "date_format": "DD-MM-YYYY",
    "model_tier": "mid",
    "copilot_mode": "architect",
    "digest": "weekly",
    "auto_connect_github": false
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own settings" ON public.user_settings;
CREATE POLICY "Users manage own settings"
  ON public.user_settings
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- 3. Storage Bucket: profiles (Avatars, Covers, Resumes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users upload own profile assets" ON storage.objects;
CREATE POLICY "Users upload own profile assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profiles' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users manage own profile assets" ON storage.objects;
CREATE POLICY "Users manage own profile assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'profiles' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Public read avatars and covers" ON storage.objects;
CREATE POLICY "Public read avatars and covers"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'profiles' AND
    name NOT LIKE '%/resume%'
  );

-- 4. Recompute Profile Completeness Function
CREATE OR REPLACE FUNCTION public.profile_completeness_recompute(p_user_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_p public.profiles%ROWTYPE;
  v_score INT := 0;
BEGIN
  SELECT * INTO v_p FROM public.profiles WHERE id = p_user_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- 1. Identity Dimension (25%)
  IF COALESCE(v_p.full_name, '') <> '' THEN v_score := v_score + 5; END IF;
  IF COALESCE(v_p.handle, '') <> '' THEN v_score := v_score + 5; END IF;
  IF COALESCE(v_p.bio, '') <> '' THEN v_score := v_score + 5; END IF;
  IF COALESCE(v_p.avatar_url, '') <> '' THEN v_score := v_score + 5; END IF;
  IF COALESCE(v_p.location_city, '') <> '' OR COALESCE(v_p.location_country, '') <> '' THEN v_score := v_score + 5; END IF;

  -- 2. Academic Dimension (25%)
  IF (v_p.academic->>'institution') IS NOT NULL AND (v_p.academic->>'institution') <> '' THEN v_score := v_score + 7; END IF;
  IF (v_p.academic->>'department') IS NOT NULL AND (v_p.academic->>'department') <> '' THEN v_score := v_score + 6; END IF;
  IF (v_p.academic->>'register_number') IS NOT NULL AND (v_p.academic->>'register_number') <> '' THEN v_score := v_score + 6; END IF;
  IF (v_p.academic->>'degree') IS NOT NULL AND (v_p.academic->>'degree') <> '' THEN v_score := v_score + 6; END IF;

  -- 3. Professional & Engineering Dimension (25%)
  IF (v_p.professional->>'title') IS NOT NULL AND (v_p.professional->>'title') <> '' THEN v_score := v_score + 5; END IF;
  IF jsonb_array_length(COALESCE(v_p.professional->'skills', '[]'::jsonb)) > 0 THEN v_score := v_score + 10; END IF;
  IF v_p.resume_url IS NOT NULL AND v_p.resume_url <> '' THEN v_score := v_score + 5; END IF;
  IF (v_p.engineering->>'primary_stack') IS NOT NULL THEN v_score := v_score + 5; END IF;

  -- 4. Goals, Publications & Integrity Dimension (25%)
  IF array_length(COALESCE(v_p.goals, '{}'), 1) > 0 THEN v_score := v_score + 10; END IF;
  IF jsonb_array_length(COALESCE(v_p.publications, '[]'::jsonb)) > 0 THEN v_score := v_score + 10; END IF;
  IF v_p.onboarded = true THEN v_score := v_score + 5; END IF;

  IF v_score > 100 THEN v_score := 100; END IF;

  UPDATE public.profiles
  SET profile_completeness = v_score, updated_at = timezone('utc'::text, now())
  WHERE id = p_user_id;

  RETURN v_score;
END;
$$;

GRANT EXECUTE ON FUNCTION public.profile_completeness_recompute(UUID) TO authenticated;

-- 5. RPC: Server-Enforced Public Profile Retrieval with Privacy Filtering
CREATE OR REPLACE FUNCTION public.get_public_profile(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_is_admin BOOLEAN := false;
  v_is_owner BOOLEAN := false;
  v_p public.profiles%ROWTYPE;
  v_vis JSONB;
  v_result JSONB;
BEGIN
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Missing target user ID');
  END IF;

  SELECT * INTO v_p FROM public.profiles WHERE id = target_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Profile not found');
  END IF;

  v_is_admin := public.is_admin();
  v_is_owner := (v_caller_id = target_user_id);
  v_vis := COALESCE(v_p.visibility, '{
    "identity": "team",
    "academic": "team",
    "professional": "team",
    "engineering": "team",
    "activity": "team",
    "security": "private"
  }'::jsonb);

  -- Base public identity
  v_result := jsonb_build_object(
    'ok', true,
    'id', v_p.id,
    'email', CASE WHEN v_is_owner OR v_is_admin THEN v_p.email ELSE NULL END,
    'full_name', v_p.full_name,
    'display_name', v_p.display_name,
    'handle', v_p.handle,
    'role', v_p.role,
    'avatar_url', v_p.avatar_url,
    'cover_url', v_p.cover_url,
    'pronouns', v_p.pronouns,
    'bio', v_p.bio,
    'location_city', v_p.location_city,
    'location_country', v_p.location_country,
    'languages', v_p.languages,
    'profile_completeness', v_p.profile_completeness,
    'onboarded', v_p.onboarded,
    'created_at', v_p.created_at,
    'is_owner', v_is_owner,
    'is_admin', v_is_admin,
    'visibility', CASE WHEN v_is_owner OR v_is_admin THEN v_vis ELSE NULL END
  );

  -- 1. Academic Section Filtering
  IF v_is_owner OR v_is_admin OR (v_vis->>'academic' IN ('team', 'public')) THEN
    v_result := v_result || jsonb_build_object('academic', v_p.academic);
  ELSE
    v_result := v_result || jsonb_build_object('academic', NULL);
  END IF;

  -- 2. Professional Section Filtering
  IF v_is_owner OR v_is_admin OR (v_vis->>'professional' IN ('team', 'public')) THEN
    v_result := v_result || jsonb_build_object(
      'professional', v_p.professional,
      'resume_url', CASE WHEN v_is_owner OR v_is_admin THEN v_p.resume_url ELSE NULL END
    );
  ELSE
    v_result := v_result || jsonb_build_object('professional', NULL, 'resume_url', NULL);
  END IF;

  -- 3. Engineering & DNA Section Filtering
  IF v_is_owner OR v_is_admin OR (v_vis->>'engineering' IN ('team', 'public')) THEN
    v_result := v_result || jsonb_build_object(
      'engineering', v_p.engineering,
      'goals', v_p.goals,
      'proficiency', v_p.proficiency,
      'linked_urls', v_p.linked_urls
    );
  ELSE
    v_result := v_result || jsonb_build_object('engineering', NULL, 'goals', NULL);
  END IF;

  -- 4. Publications & Portfolio Section Filtering
  IF v_is_owner OR v_is_admin OR (v_vis->>'activity' IN ('team', 'public')) THEN
    v_result := v_result || jsonb_build_object('publications', v_p.publications);
  ELSE
    v_result := v_result || jsonb_build_object('publications', '[]'::jsonb);
  END IF;

  -- 5. Security & Audit Summary (ONLY OWNER AND ADMIN EVER RECEIVE THIS)
  IF v_is_owner OR v_is_admin THEN
    v_result := v_result || jsonb_build_object(
      'security_summary', jsonb_build_object(
        'timezone', v_p.timezone,
        'mfa_enabled', false,
        'updated_at', v_p.updated_at
      )
    );
  ELSE
    v_result := v_result || jsonb_build_object('security_summary', NULL);
  END IF;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(UUID) TO authenticated;

-- 6. RPC: Set User Setting (Upsert Preference Key)
CREATE OR REPLACE FUNCTION public.set_user_setting(p_key TEXT, p_value JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_prefs JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;

  INSERT INTO public.user_settings (user_id, prefs, updated_at)
  VALUES (
    v_user_id,
    jsonb_build_object(p_key, p_value),
    timezone('utc'::text, now())
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    prefs = public.user_settings.prefs || jsonb_build_object(p_key, p_value),
    updated_at = timezone('utc'::text, now());

  SELECT prefs INTO v_current_prefs FROM public.user_settings WHERE user_id = v_user_id;
  RETURN jsonb_build_object('ok', true, 'prefs', v_current_prefs);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_user_setting(TEXT, JSONB) TO authenticated;

-- 7. RPC: Delete User Account (Typed Handle Confirmation)
CREATE OR REPLACE FUNCTION public.delete_user_account(p_confirm_handle TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_handle TEXT;
  v_current_email TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;

  SELECT handle, email INTO v_current_handle, v_current_email
  FROM public.profiles
  WHERE id = v_user_id;

  IF (p_confirm_handle IS NULL OR LOWER(p_confirm_handle) NOT IN (LOWER(COALESCE(v_current_handle, '')), LOWER(COALESCE(v_current_email, '')))) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Confirmation handle does not match user account.');
  END IF;

  -- Delete from public.profiles & cascade
  DELETE FROM public.profiles WHERE id = v_user_id;
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN jsonb_build_object('ok', true, 'deleted', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_account(TEXT) TO authenticated;
