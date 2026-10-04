# 29 — TOOL EXECUTION ENGINE

**Layer ID:** 29  
**Architecture Category:** TOOLS  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Safe tool dispatch sandbox, parameter validation, and execution audit passports.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/intelligence/toolBrokerEngine.ts`
- `src/services/skills/skillSandbox.ts`

## 4. Layer Verification Scripts & Runners
- `node "29 — TOOL EXECUTION ENGINE/scratch-probe-tables.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
