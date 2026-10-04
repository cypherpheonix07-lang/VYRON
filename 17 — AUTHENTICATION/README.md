# 17 — AUTHENTICATION

**Layer ID:** 17  
**Architecture Category:** SECURITY  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Supabase GoTrue JWT authentication, PKCE OAuth token exchange, and session lifecycles.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `supabase/functions/log-auth-event/index.ts`
- `src/lib/auth.ts`

## 4. Layer Verification Scripts & Runners
- `node "17 — AUTHENTICATION/test-supabase-skill-verification.mjs"`
- `node "17 — AUTHENTICATION/verify-system-live.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
