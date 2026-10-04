# 07 — BACKEND SERVICE MESH

**Layer ID:** 07  
**Architecture Category:** BACKEND  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Backend microservice mesh, Sentinel health monitors, and process supervision.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/sentinel/openAiBackendSentinel.ts`
- `vyron-engine/`

## 4. Layer Verification Scripts & Runners
- `node "07 — BACKEND SERVICE MESH/verify-backend-sentinel-nuclear.mjs"`
- `node "07 — BACKEND SERVICE MESH/generate-backend-artifacts.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
