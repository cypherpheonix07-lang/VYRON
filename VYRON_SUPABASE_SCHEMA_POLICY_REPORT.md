# VYRON — SUPABASE SCHEMA & RLS POLICY REPORT
**Generated At:** 2026-09-26T13:48:14.200Z  
**Compliance Standard:** Strict Zero Raw SQL Law & Deny-by-Default RLS  

---

### 1. Row Level Security (RLS) Verification
Every table exposed to client access strictly enforces Row Level Security:
- `public.profiles`:
  - `SELECT`: Authenticated user can only read their own profile row (`auth.uid() = id`) or admin can read all.
  - `UPDATE`: User can only update their own profile; role changes restricted to admin via `set_user_role`.
- `public.projects`:
  - `SELECT`: Restricted to project owner or invited collaborators (`owner_id = auth.uid()`).
  - `INSERT / UPDATE / DELETE`: Restricted strictly to project owner.
- `public.auth_events`:
  - `INSERT`: Direct client insert strictly forbidden (Error 42501); written only by trusted server triggers.
  - `SELECT`: Scoped strictly to authenticated user's own events.

### 2. Persona Experience vs Security Decoupling Law
- **Mandate Verified:** Setting a user persona (`STUDENT`, `TEACHER`, `WORKING_PROFESSIONAL`, `OTHER`) changes experience profile and navigation defaults only.
- Under NO circumstance does persona elevation grant admin privileges or bypass RLS policies.
