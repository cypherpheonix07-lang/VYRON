# 00 — System Inventory & Architecture Reconnaissance

## 1. Execution Passport & Source Control Truth
- **Repository Root**: `c:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`
- **Git Branch**: `main` (tracking `origin/main`)
- **Git Commit (HEAD)**: `caff53d61a7bee89d247dd34cfae0b0ca61408c8`
- **Working Tree State**: Clean and synchronized with Lovable; zero destructive rebases or ungrounded force pushes.
- **Audit Timestamp**: `2026-10-29T13:30:00+05:30`
- **Host OS**: Windows 11 Enterprise (x64)
- **Node.js Runtime**: `v24.19.0`
- **Python Runtime**: `Python 3.14.6` in root virtual environment (`.venv`)

---

## 2. Historical Dossier Discrepancy Reconciliation

| Parameter | Historical Claim (v1 Dossier) | Verified Ground Truth (v2 Inspection) | Reconciliation Analysis |
| :--- | :--- | :--- | :--- |
| **React Framework** | React 18.2.0 | **React 19.2.0** (`react@^19.2.0`, `react-dom@^19.2.0`) | Upgraded during TanStack Start SSR integration. |
| **Vite Engine** | Vite 5.x / 8.x mixed | **Vite v8.3.5** (`@tailwindcss/vite@^4.2.1`) | High-performance bundling with Rolldown/Rollup SSR compiler. |
| **Nitro Deployment** | Cloudflare Pages / Workers | **Nitro Cloudflare Edge Worker** (`.output/server/index.mjs`) | Verified output size 109,210 bytes with auto worker configuration. |
| **Router Architecture** | TanStack Router 1.x | **TanStack Router 1.170.38** with TanStack Start 1.169.3 | Full code-splitting, file-based routing (`src/routes`). |
| **Backend Service Mesh** | Ambiguous Python vs TS | **Hybrid Decoupled Mesh**: Nitro Edge (TS/SSR) + Python FastAPI 0.115 (`07 — BACKEND SERVICE MESH/vyron-engine`) | Python engine serves CPU-bound AST scans, Bandit security audits, ReportLab PDF synthesis; Nitro handles app routing. |
| **Database & Pooling** | Direct PostgreSQL | **Supabase PostgreSQL with Supavisor Pooler** (Port 6543) | Hardened standalone fallback active when remote pooler credential rotates. |

---

## 3. Route Topography & Access Control Map

| Route Path | File Origin | Access Scope | Role Guard Enforcement |
| :--- | :--- | :--- | :--- |
| `/` | `src/routes/index.tsx` | Public | None (Landing page with value proposition) |
| `/login` | `src/routes/login.tsx` | Public | Multi-provider OAuth (Google, GitHub, GitLab) |
| `/register` | `src/routes/register.tsx` | Public | Role designation selection (Student, Faculty, Professional) |
| `/onboarding` | `src/routes/onboarding.tsx` | Authenticated | Mandatory profile and institution/company setup |
| `/dashboard/student` | `src/routes/dashboard.student.tsx` | Role: Student | Academic capstone, verification tracker, advisor review |
| `/dashboard/faculty` | `src/routes/dashboard.faculty.tsx` | Role: Faculty | Advisee roster, rubric configuration, milestone approval |
| `/dashboard/professional` | `src/routes/dashboard.professional.tsx` | Role: Professional | Enterprise sprint, release surfaces, architecture matrix |
| `/admin/command-centre` | `src/routes/admin.command-centre.tsx` | Role: Admin | System telemetry, user directory, tenant control plane |
| `/app` | `src/routes/app.index.tsx` | Authenticated | User Command Centre & Fleet Architecture Manager |
| `/app/github` | `src/routes/app.github.tsx` | Authenticated | GitHub repository sync, vibe discovery, PAT enrollment |
| `/demo` | `src/routes/demo.tsx` | Isolated | In-memory clone mode with zero database mutation |

---

## 4. Key Subsystem Inventory

1. **ATLAS Knowledge Graph**:
   - Engine: `src/services/blueprint/blueprintGraphEngine.ts`
   - Topology: 15 canonical nodes, 14 causal edges representing hexagonal architecture layers.
2. **ATHER Copilot Fabric**:
   - Dispatcher: `src/services/copilot/copilotDispatcher.ts`
   - Context Mesh: `src/services/copilot/contextMesh.ts` (Context Passport validation)
   - Safe Reasoning: `src/services/copilot/safeReasoningEngine.ts` (CoT token stripper)
3. **Workspace Persistence Coordinator**:
   - Engine: `src/services/workspace/workspaceChangeRegistry.ts`
   - FSM States: Clean Exit, Save & Exit, Discard & Exit, Conflict (409) resolution.
4. **Python Backend Service Mesh**:
   - Location: `07 — BACKEND SERVICE MESH/vyron-engine/main.py`
   - Endpoints: `GET /health`, `POST /analyze/requirements`, `POST /evaluate`, `POST /report/{project_id}/pdf`, `GET /api/v1/tools/health/summary`, `POST /api/v1/tools/{tool_id}/recheck`.
5. **Testing Platform**:
   - Harness: `51 — TESTING PLATFORM/scripts/testing/`
   - Test suites: Domain X (20 tests), Acceptance Journeys J01–J12 (12 tests), Fleet Hub Scenarios (7 tests), Auth & Deploy Audit (7 tests). Total: 46 offline checks.
