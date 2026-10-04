# 18 — AUTHORIZATION - RBAC - ABAC

**Layer ID:** 18  
**Architecture Category:** SECURITY  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Row-Level Security (RLS) policies, role-based access control, and cross-read leakage defense.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `supabase/migrations/20260823030000_industrial_leviathan_hardening.sql`

## 4. Layer Verification Scripts & Runners
- `node "18 — AUTHORIZATION - RBAC - ABAC/diagnose-rls.mjs"`
- `node "18 — AUTHORIZATION - RBAC - ABAC/test-rls-gh.mjs"`
- `node "18 — AUTHORIZATION - RBAC - ABAC/test-rls-project-repos.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
