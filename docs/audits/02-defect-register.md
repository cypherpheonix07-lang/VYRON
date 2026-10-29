# 02 — Defect Register & Canonical Incident Log

## Priority Ranking Matrix
- **P0**: Privilege Escalation / Data Loss / Security Boundary Breaches (None currently open)
- **P1**: Authentication / Admin Guarding / Database Persistence Failures (BUG-006, BUG-007)
- **P2**: Workspace Persistence / Multi-Role Workflow Inconsistencies (BUG-002, BUG-003)
- **P3**: Build / Compiler / Testing Harness Anomalies (BUG-001, BUG-004, BUG-005)

---

### BUG-001 — Zod v4 API Compatibility Regression in Form Schemas
- **Severity**: High (P3 — Build Blocker) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Execute `npm run typecheck` (`tsc --noEmit`).
- **WHEN it occurs**: During TypeScript compilation of `src/lib/wizardSchemas.ts`.
- **WHERE it originates**: `src/lib/wizardSchemas.ts:32` and `wizardSchemas.ts:48`.
- **WHICH areas are affected**: Project creation modal, onboarding forms, schema validation pipelines.
- **WHY it occurs**: Zod v4 deprecated the `errorMap` argument in `z.enum` in favor of `{ message: ... }` and strictly requires two schema arguments for `z.record(keySchema, valueSchema)`.
- **WHAT the correction is**: Replace `{ errorMap: ... }` with `{ message: ... }` and update `z.record(z.boolean())` to `z.record(z.string(), z.boolean())`.
- **Regression risks**: Minimal; runtime validation contracts remain identical.

---

### BUG-002 — Type Mismatches on GitHub OAuth and Nullable Active Project
- **Severity**: High (P2 — Runtime Flow) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Run `npm run typecheck` on `src/routes/app.index.tsx` and `src/components/discovery/GitHubDashboard.tsx`.
- **WHEN it occurs**: When detaching an active project or evaluating GitHub connection truthiness.
- **WHERE it originates**: `src/lib/github/oauth.ts`, `src/services/githubService.ts`, `src/routes/app.index.tsx:288`.
- **WHICH areas are affected**: Command Hub project detachment, GitHub PAT integration, portfolio overview.
- **WHY it occurs**: `initiateGitHubOAuth` omitted an explicit boolean return; `GitHubRepoItem` lacked optional `owner` property; `setActiveProject` signature rejected `null`.
- **WHAT the correction is**: Return `boolean` from `initiateGitHubOAuth`, add `owner?: { login: string }` to `GitHubRepoItem`, and accept `id: string | null` in `setActiveProject`.
- **Regression risks**: None; enables safe active project detachment without crashes.

---

### BUG-003 — Missing Python Async Database and Dispatcher Dependencies
- **Severity**: High (P2 — Service Mesh) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Run `uvicorn main:app` in `07 — BACKEND SERVICE MESH/vyron-engine`.
- **WHEN it occurs**: During FastAPI lifespan initialization.
- **WHERE it originates**: `07 — BACKEND SERVICE MESH/vyron-engine/db.py:5` and `task_dispatcher.py:8`.
- **WHICH areas are affected**: Python AST code analysis, PDF report synthesis, tool catalog security scanner.
- **WHY it occurs**: Virtual environment `.venv` lacked `asyncpg`, `psutil`, and `celery` packages.
- **WHAT the correction is**: Install `asyncpg-0.32.0`, `psutil-7.2.2`, and `celery-5.6.3` into `.venv`.
- **Regression risks**: None; satisfies existing import requirements cleanly.

---

### BUG-004 — Recursive Module Self-Import in Master SDLC 520 Script
- **Severity**: Medium (P3 — Testing Harness) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Run `npm run audit:520`.
- **WHEN it occurs**: During module resolution of `scripts/audit-master-sdlc-520.mjs`.
- **WHERE it originates**: `51 — TESTING PLATFORM/scripts/audit-master-sdlc-520.mjs:1`.
- **WHICH areas are affected**: SDLC audit runner, CI/CD verification pipelines.
- **WHY it occurs**: Script contained a duplicated nested directory import path (`.../51 — TESTING PLATFORM/51 — TESTING PLATFORM/...`).
- **WHAT the correction is**: Implement root authoritative `scripts/audit-master-sdlc-520.mjs` reading `docs/master-sdlc-520-audit-report.json` and proxy platform runner to it.
- **Regression risks**: None; enforces accurate 520-checkpoint verification.

---

### BUG-005 — Stale Git Lock File Blocking Atomic Commits
- **Severity**: Medium (P3 — Repository Health) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Run `git commit`.
- **WHEN it occurs**: Following an interrupted or background git process.
- **WHERE it originates**: `.git/index.lock`.
- **WHICH areas are affected**: Git tracking, Lovable synchronization, version control history.
- **WHY it occurs**: Abandoned lock file from an interrupted command prevented index locks.
- **WHAT the correction is**: Verify no active git processes exist and remove `.git/index.lock`.
- **Regression risks**: None; restores atomic forward commit integrity.

---

### BUG-006 — PostgREST UUID Type Syntax Error (22P02) on Non-UUID Identifiers
- **Severity**: Medium (P1 — Query & Persistence) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Navigate to `/dashboard/student`, `/dashboard/faculty`, or `/dashboard/professional` when identity is non-UUID format (e.g. `demo-student-01`).
- **WHEN it occurs**: During initial data retrieval in `getProfile`, `getStudentData`, `getFacultyData`, `getProfessionalData`, and `getUserForms`.
- **WHERE it originates**:
  - `src/lib/db/types.ts`
  - `src/lib/db/profiles.ts:13`
  - `src/lib/db/students.ts:15`
  - `src/lib/db/faculty.ts:15`
  - `src/lib/db/professionals.ts:15`
  - `src/lib/db/forms.ts:187`
- **WHICH areas are affected**: Student, Faculty, and Professional role dashboards during demo or local test sessions.
- **WHY it occurs**: PostgREST executes queries with raw parameters directly against PostgreSQL columns typed as `uuid`. Querying non-UUID strings causes PostgreSQL to reject the query with SQLSTATE 22P02.
- **WHAT the correction is**: Export `isValidUuid` helper in `src/lib/db/types.ts` and wrap remote PostgREST queries with `if (isValidUuid(userId))`, falling back cleanly to localStorage cache and mock fixtures when non-UUID strings are present.
- **Regression risks**: None; authentic UUID accounts continue querying live Supabase tables normally while demo accounts avoid console errors.

---

### BUG-007 — Python Backend Test Incompatibility with Standard `unittest` Discovery Runner
- **Severity**: High (P1 — Testing & CI) | **Status**: **VERIFIED FIXED**
- **HOW to reproduce**: Run `python -m unittest discover -s tests -v` in `07 — BACKEND SERVICE MESH/vyron-engine`.
- **WHEN it occurs**: During backend test discovery when `pytest` is not installed in the environment.
- **WHERE it originates**: `07 — BACKEND SERVICE MESH/vyron-engine/tests/test_endpoints.py`.
- **WHICH areas are affected**: Python backend CI/CD, offline test validation gates.
- **WHY it occurs**: Test functions were declared as standalone functions (`def test_health(): ...`) rather than test methods on a `unittest.TestCase` subclass.
- **WHAT the correction is**: Refactor `test_endpoints.py` to wrap all 7 tests in `class VyronEndpointTests(unittest.TestCase)` using `starlette.testclient.TestClient`.
- **Regression risks**: None; tests execute identically under both standard `unittest` and `pytest`.
