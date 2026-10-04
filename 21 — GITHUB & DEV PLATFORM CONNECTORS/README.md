# 21 — GITHUB & DEV PLATFORM CONNECTORS

**Layer ID:** 21  
**Architecture Category:** CONNECTORS  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
GitHub App OAuth, multi-account repo linking, branch sync, and webhook handlers.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `supabase/functions/github-webhook/index.ts`
- `src/state/connectors/connectorStore.ts`

## 4. Layer Verification Scripts & Runners
- `node "21 — GITHUB & DEV PLATFORM CONNECTORS/verify-github-connector.mjs"`
- `node "21 — GITHUB & DEV PLATFORM CONNECTORS/verify-github-browser.mjs"`
- `node "21 — GITHUB & DEV PLATFORM CONNECTORS/scratch-check-github-tables.mjs"`
- `node "21 — GITHUB & DEV PLATFORM CONNECTORS/test-gh-rpcs.mjs"`
- `node "21 — GITHUB & DEV PLATFORM CONNECTORS/test-gh-tables-crud.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
