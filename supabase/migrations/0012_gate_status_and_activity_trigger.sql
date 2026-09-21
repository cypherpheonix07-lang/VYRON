-- =====================================================================
--  PROJECT BRAHMA: COMPREHENSIVE SCHEMA REPAIR & ACTIVITY TRIGGER FIX
--  Migration: 0012_gate_status_and_activity_trigger.sql
--  Fixes: 
--    1. Error 0A000: trigger functions can only be called as triggers
--    2. Error 42703: missing gate_status column on projects
--    3. Error 42P01: relation "public.activity_events" does not exist
--    4. Strict TG_OP guard: 'BRA-500: Illegal direct execution'
--    5. Pre-computed severity variable mapping (no inline CASE in INSERT)
-- =====================================================================

-- 0. ENABLE PGCRYPTO FOR SECURE SHA-256 GENERATION
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. DEFINE GATE STATUS ENUM (Idempotent)
DO $$ BEGIN
    CREATE TYPE public.gate_status_type AS ENUM ('pending', 'passed', 'failed', 'overridden');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. ENSURE ACTIVITY_EVENTS TABLE EXISTS (Prerequisite for Trigger)
CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL DEFAULT 'System Operator',
    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'gate',
            'gate_evaluation',
            'scan_completion',
            'publish_attempt',
            'publish_override',
            'report_export',
            'member_invite',
            'role_change',
            'integration_connect',
            'auth_anomaly'
        )
    ),
    severity TEXT NOT NULL DEFAULT 'info' CHECK (
        severity IN ('info', 'low', 'medium', 'high', 'critical', 'success', 'warning')
    ),
    title TEXT NOT NULL,
    description TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    provenance_sha TEXT CHECK (provenance_sha IS NULL OR length(provenance_sha) = 64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure indexes exist on activity_events
CREATE INDEX IF NOT EXISTS idx_activity_events_project_created
    ON public.activity_events (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_type_created
    ON public.activity_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_created
    ON public.activity_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_severity_created
    ON public.activity_events (severity, created_at DESC);

-- Enable RLS on activity_events
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_events_select" ON public.activity_events;
CREATE POLICY "activity_events_select"
    ON public.activity_events FOR SELECT
    TO authenticated, anon
    USING (true);

-- Add table to Realtime publication
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
        EXCEPTION WHEN duplicate_object THEN null;
        END;
    END IF;
END $$;

-- 3. ENSURE GATE_STATUS COLUMN EXISTS ON PROJECTS TABLE
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS gate_status public.gate_status_type DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_projects_gate_status ON public.projects(gate_status);

-- 4. DROP EXISTING TRIGGER & FUNCTION COMPLETELY
DROP TRIGGER IF EXISTS trg_publish_gate_activity ON public.projects;
DROP FUNCTION IF EXISTS public.handle_publish_gate_event() CASCADE;

-- =====================================================================
-- WARNING: Do not execute this function directly. It must only be fired 
-- via the trg_publish_gate_activity trigger.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_publish_gate_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_name TEXT;
    v_severity TEXT;
    v_sha TEXT;
BEGIN
    -- Strict Line 1 Execution Context Guard
    IF TG_OP IS NULL THEN
        RAISE EXCEPTION 'BRA-500: Illegal direct execution';
    END IF;

    -- Route logic strictly through TG_OP = 'UPDATE' blocks
    IF TG_OP = 'UPDATE' THEN
        -- Only fire if the gate status actually changed
        IF NEW.gate_status IS DISTINCT FROM OLD.gate_status THEN

            -- Map severities using a pre-computed variable (no inline CASE in INSERT)
            IF NEW.gate_status = 'passed' THEN
                v_severity := 'success';
            ELSIF NEW.gate_status = 'failed' THEN
                v_severity := 'critical';
            ELSIF NEW.gate_status = 'overridden' THEN
                v_severity := 'warning';
            ELSE
                v_severity := 'info';
            END IF;

            -- Safely fetch actor name
            SELECT full_name INTO v_actor_name 
            FROM public.profiles 
            WHERE id = NEW.owner_id 
            LIMIT 1;

            -- Cryptographic SHA-256 provenance calculation
            BEGIN
                v_sha := encode(digest(
                    jsonb_build_object(
                        'project_id', NEW.id,
                        'old_status', OLD.gate_status,
                        'new_status', NEW.gate_status,
                        'timestamp', NOW()
                    )::text,
                    'sha256'
                ), 'hex');
            EXCEPTION WHEN OTHERS THEN
                v_sha := NULL;
            END;

            -- Insert Activity Event
            INSERT INTO public.activity_events (
                project_id, 
                actor_id, 
                actor_name, 
                event_type, 
                severity, 
                title, 
                description, 
                payload, 
                provenance_sha,
                created_at
            ) VALUES (
                NEW.id, 
                NEW.owner_id, 
                COALESCE(v_actor_name, 'System Operator'),
                'gate', 
                v_severity,
                'Release Gate Status Updated',
                'Gate status changed from ' || COALESCE(OLD.gate_status::text, 'null') || ' to ' || NEW.gate_status::text,
                jsonb_build_object(
                    'project_id', NEW.id, 
                    'old_status', OLD.gate_status, 
                    'new_status', NEW.gate_status,
                    'timestamp', NOW()
                ),
                v_sha,
                timezone('utc'::text, now())
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 5. RE-ATTACH TRIGGER
CREATE TRIGGER trg_publish_gate_activity
AFTER UPDATE OF gate_status ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_publish_gate_event();

-- =====================================================================
-- 6. CORRECTED VERIFICATION TESTING PROTOCOL (DML-BASED)
-- NEVER call handle_publish_gate_event() via SELECT.
-- =====================================================================

-- Step A: Execute DML UPDATE to fire the trigger
-- UPDATE public.projects
-- SET gate_status = CASE 
--     WHEN gate_status = 'passed' THEN 'failed'::public.gate_status_type 
--     ELSE 'passed'::public.gate_status_type 
-- END
-- WHERE id = (SELECT id FROM public.projects LIMIT 1)
-- RETURNING id, name, gate_status;

-- Step B: Verify the resulting event in activity_events
-- SELECT id, project_id, actor_name, event_type, severity, title, provenance_sha, created_at
-- FROM public.activity_events
-- WHERE event_type = 'gate'
-- ORDER BY created_at DESC
-- LIMIT 1;
