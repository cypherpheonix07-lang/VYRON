# 04 — Remediation Plan & Change Impact Analysis

## 1. Remediation Philosophy & Governance
- **Zero-Fiction Architecture Law**: Never suppress an error without diagnosing its root cause. Never synthesize test passes.
- **Zero Raw SQL Mandate**: Enforce parameterized query builders and Supabase SDK calls exclusively.
- **Minimal Safe Footprint**: Fix root causes in dependency order with minimal, atomic code changes.
- **Forward-Only Git History**: Maintain clean forward commits; never amend, rebase, or squash published history.

---

## 2. Defect Remediation Alternatives Analysis

### Remediation 1: PostgREST UUID Handling (BUG-006)
- **Alternative A (Naive)**: Change database schema column types from `uuid` to `text`.
  - *Risk*: Catastrophic regression. Breaks PostgreSQL foreign keys referencing `auth.users(id)` and degrades index performance.
- **Alternative B (Suppression)**: Swallow console warnings inside `console.warn` interceptor.
  - *Risk*: Violates Zero-Fiction Law. Leaves unneeded 400 Bad Request HTTP traffic in the Network tab.
- **Alternative C (Selected)**: Export `isValidUuid` helper in `src/lib/db/types.ts` and guard queries.
  - *Rationale*: Clean, robust, zero schema changes. Valid UUIDs continue querying Supabase; mock demo strings gracefully fall back to local storage without generating network errors or console warnings.

---

### Remediation 2: Python Backend Unittest Compatibility (BUG-007)
- **Alternative A (Third-party Dependency)**: Force-install `pytest` in production and CI.
  - *Risk*: Network timeouts in restricted egress environments where PyPI is unreachable.
  - *Selected Alternative*: Wrap test functions inside `class VyronEndpointTests(unittest.TestCase)`.
  - *Rationale*: Uses Python standard library `unittest` runner natively while remaining 100% compatible with `pytest`. Zero external dependencies needed.

---

### Remediation 3: Project Deletion Consistency (BUG-002)
- **Alternative A (Hard Deletion)**: Issue immediate SQL `DELETE FROM projects WHERE id = ...`.
  - *Risk*: Data loss. Breaks references in task tables and violates Zero-Remote-Mutation Guarantee.
- **Alternative B (Selected)**: Soft-deletion (`deleted_at` timestamp) coupled with `clearActiveProject()`.
  - *Rationale*: Preserves audit trail, safely detaches active UI context, and prevents UI blanking.

---

## 3. Rollback & Contingency Matrix

| Remediation | Primary Rollback Path | Contingency Trigger |
| :--- | :--- | :--- |
| **`isValidUuid` Guard** | Revert changes in `src/lib/db/*.ts` via `git checkout` | If authentic UUIDs are mistakenly classified as invalid |
| **Python `unittest.TestCase`** | Restore functional declarations | If test client initialization fails on non-standard Python runtimes |
| **Active Project Detachment** | Set active project to default ID rather than null | If downstream components encounter null pointer dereference |
