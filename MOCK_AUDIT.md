# MOCK_AUDIT.md — Mock Data Audit & Zero Leak Enforcement

This document records the comprehensive audit of mock data imports across the codebase, verifies demo mode gating, and defines the replacement strategy for subsequent milestones.

---

## 1. Executive Summary

- **Audit Objective**: Ensure zero mock data leaks into authenticated production sessions when `VITE_DEMO_MODE=false`.
- **Enforcement Mechanism**:
  - `authService.isDemoMode()` checks `import.meta.env.VITE_DEMO_MODE === "true"`.
  - When `VITE_DEMO_MODE=false`, all authentication, session management, user profiles, and security audits connect exclusively to Supabase tables.
  - When `VITE_DEMO_MODE=true`, a prominent amber banner (`Demo Data Active — Read Only`) is rendered across the application header, and demo data presets are used for offline testing.

---

## 2. File-by-File Mock Data Import Inventory

| File Path                                       | Mock Imports                                                  | Gating Status                             | Remediation Plan (Milestone Target)                                                 |
| :---------------------------------------------- | :------------------------------------------------------------ | :---------------------------------------- | :---------------------------------------------------------------------------------- |
| `src/routes/app.index.tsx`                      | `projects`, `healthTrend`, `riskDistribution`, `activityFeed` | Fallback when user has 0 projects         | P2: Replace with live Supabase query against `projects` and `activity_feed` tables. |
| `src/routes/app.projects.index.tsx`             | `projects`                                                    | Gated; empty state rendered if 0 projects | P2: Query `projects` table with RLS filter `user_id = auth.uid()`.                  |
| `src/routes/app.projects.new.tsx`               | `sampleIdea`, `analysisSteps`                                 | Gated placeholder examples                | P2: Replace with live project creation mutation calling `POST /rest/v1/projects`.   |
| `src/routes/app.projects.$id.tsx`               | `getProject`                                                  | Fallback if project not in DB             | P2: TanStack Query hook `useProject(id)` querying `projects` table.                 |
| `src/routes/app.projects.$id.index.tsx`         | `getProject`                                                  | Fallback if project not in DB             | P2: Query project details and child metrics.                                        |
| `src/routes/app.projects.$id.requirements.tsx`  | `requirements`, `RequirementItem`                             | Fallback dataset                          | P3: AI Studio requirements extraction pipeline.                                     |
| `src/routes/app.projects.$id.blueprint.tsx`     | `blueprintNodes`, `blueprintEdges`                            | Fallback dataset                          | P3: Architecture canvas blueprint schema store.                                     |
| `src/routes/app.projects.$id.code-health.tsx`   | `codeHealthMetrics`, `filesList`                              | Fallback dataset                          | P4: Code health engine worker telemetry.                                            |
| `src/routes/app.projects.$id.security.tsx`      | `vulnerabilities`, `remediationChecklist`                     | Fallback dataset                          | P4: Security scanner & vulnerability database.                                      |
| `src/routes/app.projects.$id.risk-business.tsx` | `riskBusiness`, `impactMatrix`                                | Fallback dataset                          | P4: Risk scoring and delivery prediction engine.                                    |
| `src/routes/app.studio.index.tsx`               | `projects`                                                    | Gated in demo mode                        | P3: AI Studio project selection list.                                               |
| `src/routes/app.studio.$id.*.tsx`               | `getProject`, `schemaTables`                                  | Gated in demo mode                        | P3: Live blueprint visualizer & code generator.                                     |
| `src/routes/app.admin.users.tsx`                | `adminUsers`                                                  | Admin demo mode fallback                  | P5: Supabase admin RPC `get_platform_users()`.                                      |
| `src/routes/app.admin.audit.tsx`                | `auditLog`                                                    | Gated in demo mode                        | P5: Query `public.auth_events` table.                                               |
| `src/routes/app.admin.studio.tsx`               | `adminStats`, `systemHealth`                                  | Gated in demo mode                        | P5: Live telemetry dashboard.                                                       |
| `src/components/brahma/reports-view.tsx`        | `reports`, `getProject`                                       | Fallback report template                  | P4: PDF generator from live project metrics.                                        |
| `src/components/brahma/app-shell.tsx`           | `mockNotifications`, `projects`                               | Selector fallback in demo mode            | P2: Query user's real project list.                                                 |

---

## 3. Zero Mock Leak Verification Criteria

1. **Authentication Layer (`src/services/authService.ts`)**:
   - `signInWithPassword`, `signUp`, `getSession`, `signOut`, `sendMagicLink`, `signInWithOAuth`, `exchangeCodeForSession` invoke `@supabase/supabase-js` methods directly.
   - Demo user simulation is strictly constrained to `if (this.isDemoMode())` branches.
2. **Profile Sync (`src/lib/auth.ts`)**:
   - `useAuthSession` queries `public.profiles` via Supabase client with non-recursive RLS.
   - Profile bootstrap executes `ensure_profile()` RPC or safe database insert.
3. **Session Diagnostics (`src/components/brahma/session-diagnostics.tsx`)**:
   - Displays actual Supabase connection status, live auth event timestamps, and masked project URL/anon key.
4. **Environment Isolation**:
   - In production or standard local dev (`VITE_DEMO_MODE=false`), zero synthetic mock profiles are injected into sessions.
