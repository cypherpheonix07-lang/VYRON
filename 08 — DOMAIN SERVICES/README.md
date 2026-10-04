# 08 — DOMAIN SERVICES

**Layer ID:** 08  
**Architecture Category:** DOMAIN  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Domain entity CRUD controllers, state mutation services, and project lifecycle handlers.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/orchestrator/analysisOrchestrator.ts`
- `src/state/aiProject/aiProjectStore.ts`

## 4. Layer Verification Scripts & Runners
- `node "08 — DOMAIN SERVICES/test-crud.mjs"`
- `node "08 — DOMAIN SERVICES/test-task-crud.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
