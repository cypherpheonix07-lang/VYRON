# 03 — REQUIREMENT CONFLICT REGISTER
**Project:** VYRON / PROJECT BRAHMA v2.0  
**Repository Working Directory:** `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Git Remote:** `origin` -> `https://github.com/cypherpheonix07-lang/VYRON.git` (`main`)  
**Timestamp:** 2026-11-01T17:09:05+05:30  
**Classification:** `OBSERVED` & `RESOLVED`  

---

## 1. Conflict Register Overview

Pursuant to Mission 3 of the Unified Master Directive, this register itemizes all material contradictions and divergences discovered among Input A (Continuation & Repair), Input B (Sequential 20-Section Testing), Input C (Project Brahma v1.0), and the physical repository state.

No conflicts have been silently discarded. Each conflict is assigned a unique identifier (`CR-01` through `CR-14`), impact severity, source evidence, and an authoritative resolution enforced across all engineering activities.

---

## 2. Itemized Conflict Register

### CR-01: Git Remote Destination & Repository Identity
- **Severity:** P0 (Critical - Data Loss & Sync Risk)
- **Source A / Repository Truth:** Git remote `origin` points to `https://github.com/cypherpheonix07-lang/VYRON.git`, branch `main`.
- **Source C Specification:** References pushing to `https://github.com/cypherpheonix07-lang/project-brahma`.
- **Root Cause / Divergence:** Source C was drafted against a prospective standalone repository name, whereas the active development repository is `VYRON`.
- **Authoritative Resolution:** All commits and pushes must target the observed remote `origin` (`https://github.com/cypherpheonix07-lang/VYRON.git`) on branch `main`. Never push to hypothetical or guessed remotes.

### CR-02: Target Evaluation Granularity (520 vs 10,400 vs 208,000)
- **Severity:** P1 (Verification & Truthfulness)
- **Source A:** Defines 520 SDLC checkpoints (26 lenses × 20 SDLC stages).
- **Source B:** Defines 10,400 section-phase slots (20 sections × 26 domains × 20 phases).
- **Source C:** Proposes 208,000 atomic slots (20 sections × 26 domains × 20 phases × 20 subtests).
- **Root Cause / Divergence:** The three totals describe four nested levels of abstraction rather than mutually exclusive test suites.
- **Authoritative Resolution:** Maintain all four tiers in the reporting hierarchy. Concrete execution focuses on the 520 concrete functional checkpoints (`project_brahma_v2_section_targets.csv`). The 208,000 theoretical grid is represented via `BRAHMA_208000_MATRIX_SCHEMA.json`, with unexecuted cells truthfully labeled `NOT_EXECUTED` or `NOT_APPLICABLE` rather than manufactured green passes.

### CR-03: Section Taxonomy (UI Navigation vs Full-Stack Architectural Modules)
- **Severity:** P1 (Architecture Alignment)
- **Source B:** Implies 20 user-navigable Engineering navigation tabs.
- **Source C:** Specifies 20 named full-stack modules, several of which are non-navigable infrastructure layers (S12 Supabase Auth, S13 Database, S14 Storage, S15 AI Pipeline, S19 Type System, S20 Build/CI).
- **Root Cause / Divergence:** Confusion between UI routing views and architectural module definitions.
- **Authoritative Resolution:** Adopt Source C's 20 named modules as the primary specification targets. For infrastructure modules (S12–S15, S19, S20), verify contract schemas, unit/integration test suites, and service interfaces; mark UI-only checkpoints (e.g., rendering, responsive layout) as `NOT_APPLICABLE` with explicit technical justification.

### CR-04: Tooling & Agentic Orchestration Surface
- **Severity:** P2 (Execution Platform)
- **Source C:** Formatted with `CLAUDE CODE` CLI commands and conventions.
- **Master Directive:** Executed within Google Antigravity (Gemini 3.8 Flash / Gemini 2.5 Pro).
- **Root Cause / Divergence:** Protocol document originated in a different agentic environment.
- **Authoritative Resolution:** Translate all tool invocation semantics to native Antigravity capabilities (native tools, subagents, background task management, workspace commands, markdown artifacts).

### CR-05: Preflight "12 Green Checks or Halt" Policy
- **Severity:** P1 (Process Blocking)
- **Source C:** Demands 12 preflight checks pass unconditionally before proceeding, including `supabase db push` and remote storage connectivity.
- **Source A & Reality:** The remote Supabase cloud project may have paused keys, rate limits, or require offline execution; mutating commands like `supabase db push` pose data destruction risks.
- **Authoritative Resolution:** Treat preflight as capability classification. Separate mandatory app boot/security prerequisites from optional live cloud capabilities. Engage deterministic offline scenario lanes when remote credentials are unavailable, logging `BLOCKED` on remote-only operations while permitting offline verification to proceed.

### CR-06: Client Secret Isolation vs Client-Exposed `VITE_` Variables
- **Severity:** P0 (Security Vulnerability)
- **Source C (S08):** Suggests checking `VITE_CVE_API_KEY` for vulnerability scanning.
- **Invariant (Input A & Security Law):** Vite client bundles expose all `VITE_*` environment variables in plaintext JavaScript shipped to the browser.
- **Authoritative Resolution:** Zero server secrets or third-party API keys in `VITE_` variables. Vulnerability scanner keys and service role credentials must reside strictly on the server or in Supabase Edge Functions. Client code interacts with backend proxies.

### CR-07: Auth Token Storage & Plaintext `localStorage` Invariant
- **Severity:** P1 (Security Architecture)
- **Source C (S01-S):** Demands auth tokens are never stored in `localStorage`.
- **Source A & Supabase SDK:** Supabase JS SDK defaults to storing session tokens in browser `localStorage` under PKCE key management for SPA continuity.
- **Authoritative Resolution:** Supabase SDK handles session tokens using PKCE and encrypted/scoped key patterns. Plaintext custom token writes to `localStorage` are strictly prohibited. In demo mode, sessions use isolated local storage without leaking production credentials.

### CR-08: Rigid Performance Thresholds vs Empirical Calibration
- **Severity:** P2 (Quality Metrics)
- **Source C:** Sets rigid performance thresholds (e.g., LCP < 2.5s, bundle < 500kB, canvas strictly 60fps).
- **Source A & Environment Reality:** Build output includes comprehensive SSR Nitro bundles (~3,800 modules); local dev hardware and virtualization may cause slight benchmark variance.
- **Authoritative Resolution:** Treat Source C thresholds as calibrated engineering design targets. Report both empirical measurements and target thresholds transparently, highlighting regressions without fabricating artificial pass marks.

### CR-09: TypeScript Typecheck Invocation Strategy
- **Severity:** P1 (Build System)
- **Source C:** Calls `tsc --noEmit --strict` with arbitrary CLI flags.
- **Repository Truth:** Project contains a tailored `tsconfig.json` with TanStack Start, React 18, and Vite configurations.
- **Authoritative Resolution:** Invoke typechecking strictly via configured project scripts (`npm run typecheck`, executing `tsc --noEmit`). Do not inject conflicting CLI flags that override project references or compiler settings.

### CR-10: Demo Data vs Live Production Data
- **Severity:** P1 (Epistemic Honesty)
- **Source C:** References test accounts (`admin@vyron.dev`) and fixed scenario data.
- **Repository Truth:** Supabase Postgres enforces RFC 4122 UUID foreign key constraints (`owner_id`, `user_id`). Passing raw strings like `"demo-admin-uuid"` triggers HTTP 400 Bad Request.
- **Authoritative Resolution:** Enforce UUID validation via `isValidUuid()` before executing PostgREST queries. Intercept demo users in frontend hooks (`useProjects.ts`, `useGitHubAccounts.ts`) and route them to offline fixtures (`localStorage.getItem("brahma_project_wizard_draft_v2")`). Never fabricate production database rows.

### CR-11: Failure Progression & Section Gate Semantics
- **Severity:** P1 (Workflow Flow)
- **Source C:** Halts the entire mission on any failure within a section.
- **Source B:** Advances through section gates and logs blocked areas while continuing safe independent modules.
- **Authoritative Resolution:** P0 critical failures (security breaches, data corruption) immediately halt the affected section and trigger an escalation gate. P1–P3 functional defects or missing remote credentials mark the affected subtest as `FAIL` or `BLOCKED`, allowing independent verification of other modules to proceed.

### CR-12: Duplicate Semantics in Phase 20 & Subtest 20
- **Severity:** P2 (Audit Precision)
- **Source C:** Defines Phase 20 ("Reconciliation, evidence, status") and Subtest 20 ("Evidence integrity, result flag") as separate tests.
- **Authoritative Resolution:** Explicitly designate Phase 20 and Subtest 20 as evidence recordkeeping and audit operations, not substantive behavioral tests. Passing Phase 20/Subtest 20 verifies evidence completeness, not underlying functional behavior.

### CR-13: UI Domain Applicability for Infrastructure Sections
- **Severity:** P2 (Audit Integrity)
- **Source C:** Applies 26 domain lenses (A–Z) uniformly across all 20 sections, including non-UI modules (S12–S15, S19, S20).
- **Authoritative Resolution:** For infrastructure modules lacking a visual interface, evaluate domains like A (Accessibility), C (Component Render), K (Keyboard), and R (Responsive) as `NOT_APPLICABLE` with technical rationale, avoiding fake DOM tests.

### CR-14: Directory Structure: 01–90 Taxonomy vs Framework Source
- **Severity:** P1 (Architecture & Tooling)
- **Source A:** Enforces 01–90 logical enterprise taxonomy.
- **Source C:** Assumes classic flat React directory structures.
- **Repository Truth:** The repo maintains 01–90 directories as NTFS junctions/symlinks for conceptual categorization, while physical build source lives in `src/`, `tests/`, and `scripts/`.
- **Authoritative Resolution:** Retain physical implementation code in `src/` to satisfy Vite/TanStack build requirements. Maintain 01–90 as logical domain mappings. Prohibit arbitrary moving of source files.

---

## 3. Conflict Resolution Sign-Off
All 14 conflicts are formally reconciled. The resulting policies are codified in `04_FINAL_CONSOLIDATED_REQUIREMENTS.md` and enforced in all verification scripts.
