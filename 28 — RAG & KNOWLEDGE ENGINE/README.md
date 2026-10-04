# 28 — RAG & KNOWLEDGE ENGINE

**Layer ID:** 28  
**Architecture Category:** RAG  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Retrieval-Augmented Generation pipeline, chunking, reranking, and document ground truth.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/services/intelligence/sourceOfTruthArchitecture.ts`

## 4. Layer Verification Scripts & Runners
- `node "28 — RAG & KNOWLEDGE ENGINE/seed-database.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
