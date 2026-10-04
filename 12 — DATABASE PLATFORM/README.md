# 12 — DATABASE PLATFORM

**Layer ID:** 12  
**Architecture Category:** DATABASE  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Supabase PostgreSQL connection pooling, schema migrations, and forensic db autopsies.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `supabase/migrations/`
- `src/lib/supabaseClient.ts`

## 4. Layer Verification Scripts & Runners
- `node "12 — DATABASE PLATFORM/scratch-test-db.mjs"`
- `node "12 — DATABASE PLATFORM/test-insert.mjs"`
- `node "12 — DATABASE PLATFORM/db-autopsy.mjs"`
- `node "12 — DATABASE PLATFORM/run-db-autopsy-full.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
