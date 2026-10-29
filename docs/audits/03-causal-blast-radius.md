# 03 — Causal Blast Radius & Dependency Impact Analysis

## 1. Global Architecture Trace Topology
```
[ USER INTERFACE ]
  └─ TanStack Router (src/routes/*.tsx)
      └─ Component Handlers & Local State
          └─ Service Mesh / SDK Layer (src/services/*, src/lib/db/*)
              ├─ Client Query Builders (Supabase SDK) ──> PostgreSQL / Supavisor
              ├─ REST Handlers (TanStack Start / Nitro) ──> Cloudflare Edge Worker
              └─ Async Service Mesh (FastAPI Engine) ──> Lizard / Bandit / ReportLab
                  └─ Event Bus & State Synchronization (Realtime & LocalStorage)
                      └─ Reactive UI State Updates
```

---

## 2. Blast-Radius Analysis per Defect

### BUG-006: PostgREST UUID Syntax Error (22P02)
- **Causal Path**:
  ```
  Dashboard Load (/dashboard/student)
    └─ useEffect() in src/routes/dashboard.student.tsx
        └─ loadData() -> getProfile(user.id), getStudentData(user.id), getUserForms(user.id)
            └─ supabase.from("student_data").select("*").eq("user_id", "demo-student-01")
                └─ PostgREST HTTP 400 Bad Request (22P02 invalid input syntax for type uuid)
                    └─ Console Warning: [getProfile] Query warning: ...
                        └─ Fallback to LocalStorage / defaultData
  ```
- **Blast Radius**:
  - `src/routes/dashboard.student.tsx`
  - `src/routes/dashboard.faculty.tsx`
  - `src/routes/dashboard.professional.tsx`
  - `src/components/dashboard/FormStatusTracker.tsx`
  - `src/lib/db/profiles.ts`, `students.ts`, `faculty.ts`, `professionals.ts`, `forms.ts`
- **Mitigation & Isolation**:
  - By placing `isValidUuid()` at the entry of data access methods, invalid format strings never reach PostgREST. The remote database query is bypassed only for non-UUID strings, preserving 100% of the live Supabase query pipeline for authentic UUIDs.

---

### BUG-007: Python Backend Test Incompatibility with `unittest`
- **Causal Path**:
  ```
  CI/CD or Local Test Script
    └─ python -m unittest discover -s tests -v
        └─ inspect test_endpoints.py
            └─ No classes inheriting from unittest.TestCase found
                └─ Exit Code 1: "Ran 0 tests in 0.000s, NO TESTS RAN"
  ```
- **Blast Radius**:
  - `07 — BACKEND SERVICE MESH/vyron-engine/tests/test_endpoints.py`
  - Backend health probes, SSRF security validation, ReportLab PDF synthesis.
- **Mitigation & Isolation**:
  - Wrapping test functions in `VyronEndpointTests(unittest.TestCase)` allows discovery under both `unittest` and `pytest` without altering endpoint logic.

---

### BUG-002: Nullable Active Project Detachment
- **Causal Path**:
  ```
  User Command Centre (/app)
    └─ Delete Project Button Click
        └─ AlertDialog Confirmation -> handleDeleteProject()
            └─ projectRegistry.deleteProject(id)
                └─ setActiveProject(null)
                    └─ Typecheck Error: Argument of type 'null' not assignable to 'string'
  ```
- **Blast Radius**:
  - `src/routes/app.index.tsx`
  - `src/services/projects/projectRegistry.ts`
  - Fleet Command Hub Portfolio View
- **Mitigation & Isolation**:
  - Typing `setActiveProject: (id: string | null) => void` ensures clean detachment when an active project is deleted.

---

## 3. Cross-Subsystem Coupling & Isolation Guarantees

| Subsystem Pair | Coupling Type | Isolation Guarantee Enforced |
| :--- | :--- | :--- |
| **Demo Mode vs Live Database** | Behavioral Split | Demo mode uses in-memory clones (`resetToBaseline()`); zero writes reach Supabase tables. |
| **Nitro Edge vs Python Engine** | HTTP API Bridge | SSR server runs independently; Python backend is contacted via REST endpoints on port 8000. |
| **Student vs Faculty vs Professional** | Route & RLS Boundary | Dashboards are isolated by `useAuth()` designation check and Supabase RLS row policies. |
| **Admin Command Centre vs User Apps** | Layout Guard | `AdminLayout` blocks non-admin users and redirects to `/app` with zero data exposure. |
