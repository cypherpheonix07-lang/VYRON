# 16 — IDENTITY

**Layer ID:** 16  
**Architecture Category:** SECURITY  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
User profiles, tenant membership resolution, and identity correlation models.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/contexts/AuthContext.tsx`
- `src/types/activity.ts`

## 4. Layer Verification Scripts & Runners
- `node "16 — IDENTITY/scratch-probe-auth.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
