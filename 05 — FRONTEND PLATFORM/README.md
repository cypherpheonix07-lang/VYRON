# 05 — FRONTEND PLATFORM

**Layer ID:** 05  
**Architecture Category:** FRONTEND  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Vite/TanStack Start client platform, website generation wizard, and reactive UI component trees.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/routes/`
- `src/components/`
- `src/types/websiteStudio.ts`

## 4. Layer Verification Scripts & Runners
- `node "05 — FRONTEND PLATFORM/verify-step1-8.mjs"`
- `node "05 — FRONTEND PLATFORM/verify-wizard-v2.mjs"`
- `node "05 — FRONTEND PLATFORM/verify-website-generation.mjs"`
- `node "05 — FRONTEND PLATFORM/scratch-probe-newproject.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
