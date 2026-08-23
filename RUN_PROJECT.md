# RUN_PROJECT.md — Project Run & Setup Guide

This guide provides instructions for configuring, running, testing, and building the **PROJECT BRAHMA / STARK Event Agent** application.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+) or `pnpm` (v9+)
- **Supabase Account**: Live Supabase project (or local Supabase instance via Supabase CLI)
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari (supporting Web Standards & Web Storage)

---

## 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Configure the following variables in `.env.local`:

| Variable Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | **Yes** | — | Canonical Supabase project REST API endpoint URL (`https://<project-ref>.supabase.co`). |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | — | Supabase anonymous public API key (`sb_publishable_...` or JWT). Safe for browser exposure. |
| `VITE_DEMO_MODE` | No | `false` | When `true`, enables offline demo mode with mock data and demo user profiles. |
| `VITE_DEBUG_SESSION` | No | `false` | When `true`, emits verbose console diagnostics for Supabase auth state transitions. |
| `VITE_APP_URL` | No | `http://localhost:8080` | Frontend public origin used for OAuth redirect flows and email verification links. |

> [!CAUTION]
> **Zero Service Role Key Exposure**: NEVER place `SUPABASE_SERVICE_ROLE_KEY` in frontend `.env` files or commit service keys to version control. The browser client must only communicate with Supabase using the anonymous key and Row Level Security.

---

## 3. Database & Storage Initialization

To ensure your Supabase database schema matches the frontend requirements:

1. **Apply Migrations**: Execute `src/lib/profiles_schema.sql` (or `supabase/migrations/20260813010000_identity_observability.sql`) in the Supabase SQL Editor.
2. **Tables Created**:
   - `public.profiles` (UUID primary key linked to `auth.users`, role enum, onboarded boolean, timestamps)
   - `public.auth_events` (audit log of login events, IP address, method, user agents)
   - `public.user_integrations` (OAuth connections for GitHub, Jira, AWS, Datadog)
   - `public.blueprint_shares` (shareable architecture blueprints)
   - `public.activity_feed` (real-time platform event stream)
3. **Storage Bucket**:
   - Create bucket `avatars` with `public: true` and 5MB file size limit for user profile avatars.
4. **Trigger & Functions**:
   - `handle_new_user()` trigger auto-creates profile rows on sign-up.
   - `ensure_profile()` RPC provides client-safe profile bootstrap without RLS recursion.

---

## 4. Execution Commands

From the project root or the `brahma-insights-main` directory:

### Development Mode
Starts Vite development server with hot module replacement (HMR) and TanStack Router route tree generation:
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) to access the application.

### TypeScript Strict Typechecking
Executes TypeScript compiler in `noEmit` mode to verify zero type regressions:
```bash
npm run typecheck
```

### Production Build
Compiles client bundles with Vite and optimizes SSR / Nitro server handlers:
```bash
npm run build
```

### Preview Production Build
Locally serves the built production assets:
```bash
npm run preview
```

---

## 5. Failure Modes & Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **"Supabase Environment Missing" screen on `/auth`** | Missing or empty `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local` | Ensure `.env.local` exists in `brahma-insights-main/` and contains valid project credentials, then restart `npm run dev`. |
| **"infinite recursion detected in policy for relation profiles"** | Database RLS policy uses recursive helper functions (e.g. `is_admin()` inside `profiles` policy) | Run the non-recursive RLS policy migration in `profiles_schema.sql` (`USING (auth.uid() = id)`). |
| **User stuck on onboarding screen** | `profiles.onboarded` is `false` or `null` | Complete the 3-step onboarding wizard at `/onboarding` or update `profiles.onboarded = true` via Supabase SQL editor. |
| **OAuth redirect loops back to `/login`** | Redirect URI not allowlisted in Supabase Dashboard | Add `http://localhost:8080/auth/callback` to **Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs**. |
| **Missing `avatars` bucket error during image upload** | Storage bucket not provisioned in Supabase | Create a public storage bucket named `avatars` in Supabase Storage with allowed MIME types `image/*`. |
| **Port 8080 already in use** | Background process occupying port 8080 | Terminate the occupying process or run Vite on a different port: `npm run dev -- --port 8081`. |
