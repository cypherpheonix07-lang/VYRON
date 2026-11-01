# 10 — ARCHITECTURAL RISK REGISTER
**Project:** VYRON / PROJECT BRAHMA v2.0  
**Repository Working Directory:** `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Git Remote:** `origin` -> `https://github.com/cypherpheonix07-lang/VYRON.git` (`main`)  
**Timestamp:** 2026-11-01T17:14:20+05:30  
**Classification:** `RISK REGISTER & MITIGATION AUDIT`  

---

## 1. Executive Summary

This register catalogs architectural, security, and operational risks identified across the VYRON / PROJECT BRAHMA v2.0 platform. Each risk is evaluated under the Zero-Fiction Architecture Law, detailing verified root causes, concrete mitigations, and residual exposure levels.

---

## 2. Itemized Risk Ledger

| Risk ID | Category | Severity | Likelihood | Description | Mitigation Strategy | Active Guardrail | Residual Risk |
|---|---|---|---|---|---|---|---|
| **RISK-01** | Database / Auth | Critical (P0) | Low | Supabase Postgres foreign key UUID constraint violations when passing non-UUID strings (e.g. `"demo-admin-uuid"`). | Validate all UUID parameters using RFC 4122 regex before transmitting PostgREST queries; route demo users to offline fixtures. | `isValidUuid()` validation guards deployed across all query hooks (`useProjects.ts`, `useGitHubAccounts.ts`, etc.). | Very Low |
| **RISK-02** | Security | Critical (P0) | Low | Client secret leakage via `VITE_` prefixed environment variables in browser bundles. | Enforce strict isolation; third-party scanner keys and service-role tokens must reside server-side only. | Static audit of `.env` and bundle inspection verifying zero server tokens. | Very Low |
| **RISK-03** | Git & Collaboration | Critical (P0) | Low | Disruption of Lovable synchronization via rebasing, squashing, or force-pushing git history. | Enforce forward atomic commits only (`git commit` and `git push origin main`); strictly ban history rewrites. | Operational invariant codified in `AGENTS.md` and `GEMINI.md`. | Zero |
| **RISK-04** | Process / Runtime | High (P1) | Medium | Zombie Node.js dev server processes holding port 8080, causing ModuleRunner WebSocket transport timeouts. | Inspect active process table before server boot; enforce clean process teardown on shutdown. | Port inspection and process termination procedures in test harnesses. | Low |
| **RISK-05** | UI / Accessibility | Medium (P2) | Low | Text contrast degradation and gradient luminance mismatches in dark mode. | Synchronize text color tokens with background luminance using WCAG AA compliant design tokens (`text-primary`, `bg-card`). | Global palette alignment completed in commit `e56edea`. | Very Low |
| **RISK-06** | Data Integrity | High (P1) | Low | Unsanitized untrusted user input causing AST parser crashes or injection vulnerabilities. | Sanitize all requirement text through strict parser schemas and boundary validators before graph insertion. | Requirement AST schema validation and Gate 7 untrusted input defense. | Very Low |
| **RISK-07** | Performance | Medium (P2) | Medium | Large architecture graphs (>500 nodes) causing React Flow canvas rendering stutter. | Implement node viewport culling, debounced AST updates, and virtualized node rendering. | `@xyflow/react` viewport optimization and Zustand selector memoization. | Low |
| **RISK-08** | Cloud Dependency | High (P1) | Medium | Flakiness or rate-limiting of remote Supabase cloud project during automated test execution. | Implement 5 deterministic offline scenarios (Fintech, Health, Ecommerce, AI, Migration) to run offline test lanes. | Offline test lane (`npm run test:offline`) fully isolated from network connectivity. | Very Low |

---

## 3. Continuous Risk Monitoring Protocol
- Every pull request and release gate re-evaluates the active risk register.
- P0 risks trigger immediate operational freeze until verified resolution is verified by both unit and integration suites.
