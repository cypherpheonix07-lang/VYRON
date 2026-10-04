# 04 — EXPERIENCE - UI ARCHITECTURE

**Layer ID:** 04  
**Architecture Category:** EXPERIENCE  
**Platform Domain:** VYRON Tech SaaS Platform  

---

## 1. Architectural Scope & Mission
Layout hierarchy, navigation command surfaces, breadcrumbs, and non-visual state machines.

## 2. Core Invariants & Governance Rules
- **Zero-Fiction Architecture Law:** No fabricated endpoints, synthetic passes, or ungrounded telemetry.
- **Zero Raw SQL Mandate:** All queries execute via Supabase client query builders (`supabase.from(...)`) or parameterized RPCs.
- **Strict Multi-Tenancy & RLS:** Every database access enforces user/tenant boundaries.
- **Lovable Sync Invariant:** Forward-only atomic git commits; never force-push, rebase, or squash.

## 3. Associated Source Files & Core Services
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Sidebar.tsx`

## 4. Layer Verification Scripts & Runners
- `node "04 — EXPERIENCE - UI ARCHITECTURE/verify-engineering-navigation.mjs"`
- `node "04 — EXPERIENCE - UI ARCHITECTURE/verify-browser.mjs"`
- `node "04 — EXPERIENCE - UI ARCHITECTURE/scratch-probe-ui.mjs"`

---
*VYRON Autonomous Enterprise Platform — Mechanism-First Architecture*
