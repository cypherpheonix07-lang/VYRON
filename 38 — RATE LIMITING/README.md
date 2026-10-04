# 38 — RATE LIMITING

**Layer ID:** 38  
**Architecture Category:** GOVERNANCE  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Sliding-window token-bucket rate limiting, IP throttling, and abuse containment.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/intelligence/operationalControlPlane.ts`

## 4. Layer Verification Scripts & Runners
- `node "38 — RATE LIMITING/test-godmode-vnext-master.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
