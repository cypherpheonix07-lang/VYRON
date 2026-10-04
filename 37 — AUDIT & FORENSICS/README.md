# 37 — AUDIT & FORENSICS

**Layer ID:** 37  
**Architecture Category:** AUDIT  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Immutable audit logging, tamper-proof forensic sweeps, and provenance tracking.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/routes/app.admin.audit.tsx`
- `src/services/intelligence/provenancePipeline.ts`

## 4. Layer Verification Scripts & Runners
- `node "37 — AUDIT & FORENSICS/forensic-sweep.mjs"`
- `node "37 — AUDIT & FORENSICS/run-forensic-audit.mjs"`
- `node "37 — AUDIT & FORENSICS/run_full_forensic.mjs"`
- `node "37 — AUDIT & FORENSICS/seed-audit-logs.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
