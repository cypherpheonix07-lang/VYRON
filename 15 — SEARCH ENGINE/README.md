# 15 — SEARCH ENGINE

**Layer ID:** 15  
**Architecture Category:** SEARCH  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Full-text search, AST indexers, and AI-driven entity discovery taxonomy.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/semanticSearch.ts`

## 4. Layer Verification Scripts & Runners
- `node "15 — SEARCH ENGINE/seed-ai-discovery.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
