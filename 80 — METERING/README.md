# 80 — METERING

**Layer ID:** 80  
**Architecture Category:** COMMERCE  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Fine-grained resource consumption metering, execution event billing, and metric aggregation.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/intelligence/meteringEngine.ts`

## 4. Layer Verification Scripts & Runners
- `node "80 — METERING/test-macro-batch-3.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
