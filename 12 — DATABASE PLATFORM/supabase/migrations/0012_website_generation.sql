-- ==============================================================================
-- PROJECT BRAHMA — AI-DRIVEN WEBSITE GENERATION SYSTEM
-- Migration: 0012_website_generation.sql
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. WEBSITE GENERATION PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.website_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  requirements_text TEXT NOT NULL,
  design_system JSONB DEFAULT '{}'::JSONB NOT NULL,
  tech_stack JSONB DEFAULT '{}'::JSONB NOT NULL,
  feature_toggles JSONB DEFAULT '{}'::JSONB NOT NULL,
  frontend_blueprint JSONB,
  backend_blueprint JSONB,
  tech_comparison JSONB,
  mock_data JSONB DEFAULT '{}'::JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'configuring' CHECK (status IN ('configuring','generating','previewing','refining','exported','failed')),
  generation_step INT DEFAULT 0 NOT NULL,
  provenance_sha TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. WEBSITE GENERATION ITERATION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.website_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_project_id UUID REFERENCES public.website_projects(id) ON DELETE CASCADE NOT NULL,
  generation_number INT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('initial','refinement','tech_change','design_change')),
  user_feedback TEXT,
  input_snapshot JSONB NOT NULL,
  output_snapshot JSONB NOT NULL,
  llm_metadata JSONB DEFAULT '{}'::JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TECH STACK COMPARISONS CACHE TABLE
CREATE TABLE IF NOT EXISTS public.tech_stack_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  use_case TEXT UNIQUE NOT NULL,
  frontend_options JSONB NOT NULL,
  backend_options JSONB NOT NULL,
  database_options JSONB NOT NULL,
  recommended_combo JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. OPTIMIZED COVERING INDEXES
CREATE INDEX IF NOT EXISTS idx_website_projects_owner ON public.website_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_website_projects_status ON public.website_projects(status);
CREATE INDEX IF NOT EXISTS idx_website_generations_project ON public.website_generations(website_project_id);
CREATE INDEX IF NOT EXISTS idx_website_generations_number ON public.website_generations(website_project_id, generation_number);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.website_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stack_comparisons ENABLE ROW LEVEL SECURITY;

-- website_projects: Owner has full CRUD; cross-user isolation
DROP POLICY IF EXISTS "website_projects_owner_all" ON public.website_projects;
CREATE POLICY "website_projects_owner_all" ON public.website_projects
  FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- website_generations: Owner can view generations; insert allowed for project owner or service role
DROP POLICY IF EXISTS "website_generations_owner_select" ON public.website_generations;
CREATE POLICY "website_generations_owner_select" ON public.website_generations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.website_projects wp
      WHERE wp.id = website_generations.website_project_id
      AND wp.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "website_generations_owner_insert" ON public.website_generations;
CREATE POLICY "website_generations_owner_insert" ON public.website_generations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.website_projects wp
      WHERE wp.id = website_generations.website_project_id
      AND wp.owner_id = auth.uid()
    )
  );

-- tech_stack_comparisons: All authenticated users can read; mutations restricted to admin or service role
DROP POLICY IF EXISTS "tech_stack_comparisons_select_auth" ON public.tech_stack_comparisons;
CREATE POLICY "tech_stack_comparisons_select_auth" ON public.tech_stack_comparisons
  FOR SELECT TO authenticated
  USING (true);

-- 6. REALTIME SUBSCRIPTION PUBLICATION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'website_projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.website_projects;
  END IF;
END $$;
