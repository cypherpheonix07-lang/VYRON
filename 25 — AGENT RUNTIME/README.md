# 25 — AGENT RUNTIME

**Layer ID:** 25  
**Architecture Category:** AGENTS  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Sandboxed specialist agent runtime, autonomous execution loops, and state passports.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/intelligence/specialistAgentRuntime.ts`
- `src/services/intelligence/proofCarryingAgentAction.ts`

## 4. Layer Verification Scripts & Runners
- `node "25 — AGENT RUNTIME/verify-new-project-god-mode-vnext.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
