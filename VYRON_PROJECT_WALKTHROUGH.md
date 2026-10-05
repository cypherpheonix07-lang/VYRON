# VYRON (Project Brahma) — Complete Technical & Architectural Walkthrough

**Document Version:** `1.0.0`  
**System Classification:** Autonomous Engineering Intelligence & Application-Native AI Platform  
**Architecture Style:** Modular Clean Architecture / Event-Driven / Shared Role-Aware Hybrid  
**Core Technologies:** React 19, TypeScript (Strict), Vite 8, TanStack Router, Tailwind CSS, Supabase PostgreSQL, Nitro SSR  
**Remote Git Repository:** `https://github.com/cypherpheonix07-lang/VYRON.git`  
**Last Verified Commit:** `8d76272` (Verified and Synced with Lovable)  

---

## Table of Contents

1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Core Operational Invariants](#2-core-operational-invariants)
3. [Platform Architecture & Tech Stack](#3-platform-architecture--tech-stack)
4. [90-Pillar Enterprise Folder Taxonomy](#4-90-pillar-enterprise-folder-taxonomy)
5. [Persona-Aware Experience Architecture (Role System)](#5-persona-aware-experience-architecture-role-system)
6. [Core Functional Subsystems & Surfaces](#6-core-functional-subsystems--surfaces)
   - [A. Command Center & 12-Surface Living Dashboard (`/app`)](#a-command-center--12-surface-living-dashboard-app)
   - [B. 12-Stage Forensics & Analysis Pipeline (`/app/analysis`)](#b-12-stage-forensics--analysis-pipeline-appanalysis)
   - [C. Living Architecture & Blueprint Studio (`/app/studio`)](#c-living-architecture--blueprint-studio-appstudio)
   - [D. Live System Test Workbench (`/app/admin/workbench`)](#d-live-system-test-workbench-appadminworkbench)
   - [E. Export Center & Artifact Generation (`/app/exports`)](#e-export-center--artifact-generation-appexports)
7. [Mathematical & Cryptographic Verification Engines](#7-mathematical--cryptographic-verification-engines)
8. [Controlled Stress Testing & Performance Benchmark](#8-controlled-stress-testing--performance-benchmark)
9. [Defect Ledger & Boundary Security](#9-defect-ledger--boundary-security)
10. [Local Development & Verification Runbook](#10-local-development--verification-runbook)

---

## 1. Executive Summary & Purpose

**VYRON** is an **Autonomous Engineering Intelligence and Application-Native AI Platform**. Modern software systems suffer from architectural drift, undocumented shadow APIs, stale diagrams, and fragile dependencies. VYRON continuously analyzes source code, telemetry signals, database schemas, and API contracts to maintain an **evidence-backed, living software blueprint**.

### Key Capabilities:
- **Continuous Architectural Observability:** Builds dynamic Directed Acyclic Graphs (DAG) of application services, AST tokens, and data flows using `@xyflow/react`.
- **Drift & Regression Detection:** Evaluates discrepancies between declared architecture and actual implementation.
- **Automated Threat Modeling (STRIDE):** Maps vulnerabilities to Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.
- **Cryptographic Release Decisions:** Seals Architecture Decision Records (ADRs) with bitwise HMAC SHA-256 signatures to guarantee provenance.
- **Role-Aware Workspaces:** Dynamically adapts UX density, templates, and navigation for **Students**, **Faculty/Educators**, and **Working Professionals**, while deferring full administrative design behind verified isolation boundaries.

---

## 2. Core Operational Invariants

The platform enforces four strict operational laws across all code and database interactions:

1. **The Zero-Fiction Architecture Law:**  
   Zero fabricated endpoints, zero synthetic test passes, and zero ungrounded telemetry claims. Every KPI, outlier metric, and status badge must originate from deterministic computation or live database probes.
2. **The Zero Raw SQL Mandate:**  
   All database queries must utilize the Supabase Client SDK query builders (`supabase.from(...)`, `supabase.rpc(...)`) or parameterized ORM calls. Raw string SQL interpolation is strictly forbidden.
3. **Strict Row-Level Security (RLS) & Tenant Isolation:**  
   Database queries run under Postgres RLS policies. Unauthorized cross-tenant reads or privilege escalation attempts (`set_user_role`) must be denied by database rules (`42501 Unauthorized`).
4. **Lovable Sync Invariant:**  
   All git commits must be atomic and forward (`git commit` and `git push origin main`). Rebase, force-push, squash, and commit amendments are forbidden to prevent rewriting history on the Lovable platform.

---

## 3. Platform Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER RUNTIME (SPA)                           │
│  React 19 • TypeScript (Strict) • Tailwind CSS • Radix UI • Lucide    │
├──────────────────────────────────┬─────────────────────────────────────┤
│      TanStack Router (103 Routes)│      Living Canvas (@xyflow/react)  │
│      src/routes/**               │      Interactive System DAG         │
├──────────────────────────────────┴─────────────────────────────────────┤
│                  STATE & CLIENT LOGIC LAYER (Zustand)                  │
│  analysisStore • commandCenterStore • useAuth • useExperienceProfile   │
├────────────────────────────────────────────────────────────────────────┤
│                       ENGINEERING ENGINES                              │
│  driftEngine • decisionEngine • policyEngine • analysisOrchestrator    │
├────────────────────────────────────────────────────────────────────────┤
│                    SUPABASE CLOUD INFRASTRUCTURE                       │
│  PostgreSQL (RLS) • GoTrue Auth • Realtime Broadcast & Presence        │
└────────────────────────────────────────────────────────────────────────┘
```

- **Frontend Core:** React 19, TypeScript with strict index signatures and null checks.
- **Bundler & Dev Server:** Vite 8 with `@tailwindcss/vite` and Nitro SSR worker compilation.
- **Routing:** TanStack Router (`@tanstack/react-router`) with 103 file-based route definitions in `src/routes/`.
- **Database & Identity:** Supabase Cloud (`hbbunfizlwgvripgwzdo.supabase.co`) with GoTrue session persistence.
- **Realtime Mesh:** Supabase Realtime WebSocket engine supporting Postgres Changes, High-Speed Broadcast, and Presence Rosters.

---

## 4. 90-Pillar Enterprise Folder Taxonomy

The project contains a standardized 90-pillar enterprise architectural directory tree:

| Range | Pillar Group | Core Focus |
|---|---|---|
| **01 – 05** | Requirements & Frontend | PRD, System Design, Enterprise Architecture, UI primitives, and TanStack Start frontend platform. |
| **06 – 11** | API & Messaging Mesh | API Gateway, Service Mesh, Domain Services, Workflow Orchestration, Event-Driven Architecture, Queues. |
| **12 – 15** | Data & Storage Platform | PostgreSQL platform, Vector storage (pgvector), Object storage, and Search index engines. |
| **16 – 19** | Identity & Multi-Tenancy | Identity directory, GoTrue Authentication, RBAC/ABAC authorization, and Tenant isolation boundaries. |
| **20 – 23** | Connectors & AI Gateway | External integrations, GitHub/GitLab connectors, Dual-provider AI Gateway, Model routing. |
| **24 – 33** | Copilot & AI Governance | Copilot Orchestrator, Agent runtime, Context/Memory engines, RAG, AI safety guardrails, HITL controls. |
| **34 – 40** | Security & FinOps | Zero-trust access, Secrets management, Audit forensics, Rate limiting, Token cost governance. |
| **41 – 50** | Observability & SRE | Cache, CDN/Edge, Tracing, Metrics, Alerting, Incident management, Automated remediation. |
| **51 – 54** | Testing & Chaos Platform | Acceptance testing, Load/Stress testing, Security audit scripts, Chaos engineering. |
| **55 – 68** | Infrastructure & Cloud | CI/CD pipelines, Release management, IaC, Kubernetes, Autoscaling, Disaster recovery, Multi-region. |
| **69 – 78** | Intelligence & Governance | Data pipelines, Analytics, Recommendation engine, Simulation Twin Lab, Compliance & Privacy. |
| **79 – 90** | Business & Operations | Metering, Subscriptions, Notifications, Admin platform, FinOps, Capacity planning, Business continuity. |

---

## 5. Persona-Aware Experience Architecture (Role System)

VYRON utilizes a **Shared role-aware route** model via `src/services/persona/experienceProfileService.ts` and `src/services/auth/seedUserAccounts.ts`:

### 1. Student Persona (`STUDENT`)
- **Seed User:** Alex Chen (`alex.chen@student.brahma.edu`)
- **Entry Route:** `/app` (Default view: `LEARNER_OVERVIEW`) & `/onboarding`
- **Copilot Density:** `DETAILED_EXPLANATORY` (offers foundational explanations, step-by-step guidance, and architectural definitions).
- **Assigned Scope:** Personal project sandboxes, Capstone Software Requirements Specification (IEEE-830 SRS) generation, ERD relational schemas, REST API contract generators.
- **Access Boundary:** Blocked from administrative workbench via client `isAdmin` session guard (`Access Denied` alert); blocked from `set_user_role` RPC by database RLS.

### 2. Faculty / Educator Persona (`TEACHER`)
- **Seed User:** Dr. Sarah Connor (`dr.sarah.connor@faculty.brahma.edu`)
- **Entry Route:** `/app` (Default view: `EDUCATOR_COHORT`) & `/app/studio/$id/collaborate`
- **Copilot Density:** `PEDAGOGICAL_STRUCTURED` (focuses on rubrics, critique benchmarks, and evaluation frameworks).
- **Assigned Scope:** Cohort supervision, architecture review, peer comment threads, and the 4-stage approval workflow (`Draft` $\rightarrow$ `Under Faculty Review` $\rightarrow$ `Approved` $\rightarrow$ `Ready to Publish`).
- **Access Boundary:** Scoped strictly to assigned student cohorts; prohibited from modifying global billing or database indexing.

### 3. Working Professional Persona (`WORKING_PROFESSIONAL`)
- **Seed User:** Marcus Vance (`marcus.vance@fintech-core.io`)
- **Entry Route:** `/app` (Default view: `ENTERPRISE_CONTROL_PLANE`) & `/app/projects/$id/risk-business`
- **Copilot Density:** `CONCISE_PRODUCTION` (terse, production-grade recommendations without tutorials).
- **Assigned Scope:** Transitive blast-radius analysis across microservices, STRIDE threat matrices, AST architecture drift detection, cryptographic sealed ADR contracts, and PCI-DSS/SOC2 compliance checks.
- **Access Boundary:** Bound to team project membership; SOC2 immutable audit trail enforced.

### 4. Administrator (`ADMIN`)
- **Seed User:** Priya Nair (`priya.nair@brahma.dev`)
- **Entry Route:** `/app/admin` (Protected by `isAdmin` session guard)
- **Status:** **Design intentionally deferred per user master prompt.**
- **Access Boundary:** Non-admin accounts navigating to `/app/admin` receive an immediate `Access Denied` shield alert with redirect prompt. Backend RPC `set_user_role` rejects non-admin callers via RLS.

---

## 6. Core Functional Subsystems & Surfaces

### A. Command Center & 12-Surface Living Dashboard (`/app`)
Located at `src/routes/app.index.tsx`, this surface features 12 synchronized components:
1. **Global Command Context Bar:** Context switching between `GLOBAL`, `PROJECT`, `SIMULATION`, and `DEMO` modes.
2. **Temporal Health Explorer:** Tracks system health score (0–100) across historical commit tags.
3. **Risk Universe:** Visualizes business impact, technical debt, and delivery risks.
4. **Engineering Readiness System:** Evaluates gating criteria before deployment.
5. **Live Signal Radar Field:** Visualizes anomalies, build failures, and telemetry spikes.
6. **Release Control Surface:** Release gate convergence and blocker resolution.
7. **Living Architecture Canvas:** Interactive DAG graph powered by `@xyflow/react`.
8. **Drift Investigation Surface:** Compares declared architecture against observed AST source code.
9. **Runtime Intelligence Cockpit:** Microservices latency and throughput gauges.
10. **Trust Compliance Surface:** STRIDE threat analysis and regulatory posture.
11. **Atlas System Explorer:** Deep directory tree and package dependency graph.
12. **Copilot Partner Card:** Proactive suggestions tailored to the active user's persona density.

### B. 12-Stage Forensics & Analysis Pipeline (`/app/analysis`)
Located at `src/services/orchestrator/analysisOrchestrator.ts`, the pipeline executes:
1. `INGESTION`: Source code and AST parsing.
2. `DEPENDENCY_GRAPH`: Inter-module DAG construction.
3. `AST_ANALYSIS`: Class, function, and token extraction.
4. `SCHEMA_EXTRACTION`: Relational model extraction.
5. `API_HARVESTING`: OpenAPI/REST endpoint discovery.
6. `SECURITY_STRIDE`: Automated threat evaluation.
7. `ANOMALY_DETECTION`: Statistical IQR outlier calculation.
8. `RISK_AGGREGATION`: Weighted triad scoring.
9. `DRIFT_EVALUATION`: Specification vs reality diff.
10. `POLICY_GATES`: Enterprise guardrail enforcement.
11. `ADR_SYNTHESIS`: Architecture Decision Record generation.
12. `CRYPTOGRAPHIC_SEAL`: HMAC SHA-256 telemetry seal generation.

### C. Living Architecture & Blueprint Studio (`/app/studio`)
Located at `src/routes/app.studio.*`, provides tools to:
- Visually design microservice boundaries and API contracts.
- Import repositories directly from GitHub.
- Generate production-grade boilerplate and documentation.
- Manage collaborative reviews and approval gates.

### D. Live System Test Workbench (`/app/admin/workbench`)
Located at `src/components/testing/LiveSystemTestWorkbench.tsx`, this built-in console provides:
- **Instant Persona Switching:** Live toggle between Student, Teacher, Professional, and Admin.
- **Realtime Signal Monitor:** Presence roster, broadcast event dispatching, and Postgres change logs.
- **Roundtrip Latency Ping:** Dispatches `TEST_PING` over WebSocket and calculates roundtrip latency in milliseconds.
- **Live RLS Escalation Probes:** Tests role escalation attempts against Supabase RLS security policies.

### E. Export Center & Artifact Generation (`/app/exports`)
Located at `src/routes/app.exports.tsx`, allowing users to compile and download:
- Academic IEEE-830 Capstone SRS documents.
- Enterprise Sealed ADRs (with cryptographic hashes).
- Complete ZIP archives of generated source code.
- JSON diagnostic dossiers.

---

## 7. Mathematical & Cryptographic Verification Engines

All calculations are mathematically verifiable against independent ground truth:

### 1. Interquartile Range (IQR) Outlier Filter
- **Formula:** $IQR = Q_3 - Q_1$, Outlier Boundaries: $[Q_1 - 1.5 \times IQR, Q_3 + 1.5 \times IQR]$.
- **Verification Example:** Given $[10, 11, 11, 12, 12, 12, 13, 13, 14, 100]$:
  - $Q_1 = 11$, $Q_3 = 13$, $IQR = 2$.
  - Upper Boundary $= 13 + 3 = 16.0$.
  - Outliers Detected: `[100]` (Exact match, 0.00 tolerance).

### 2. Composite Reality Risk Score
- **Formula:** $\text{Round}(\text{Health} \times 0.40 + \text{Security} \times 0.35 + \text{Business} \times 0.25)$.
- **Verification Example:** Triad inputs $[82, 90, 74]$:
  - $(82 \times 0.40) + (90 \times 0.35) + (74 \times 0.25) = 32.8 + 31.5 + 18.5 = 82.8$.
  - Rounded Result: `83` (Exact integer match).

### 3. HMAC SHA-256 Cryptographic Evidence Seal
- **Formula:** $\text{HMAC-SHA256}(K, \text{Payload})$.
- **Verification Example:** Produces an immutable 64-character hexadecimal signature binding run metadata to prevent post-analysis tampering:
  `720d855ea5ce77283fa0eab856dc5d7185ae5d65881d0e66c68c7006d1a06895`.

---

## 8. Controlled Stress Testing & Performance Benchmark

Performance was benchmarked across progressive concurrency ramps:

| Workload Stage | Concurrency | Total Requests | Success Rate | Throughput | P50 Latency | P95 Latency | P99 Latency | Recovery Time |
|---|---|---|---|---|---|---|---|---|
| **Single-User Baseline** | 1 user | 20 | 100% | 2.7 req/s | 325.74 ms | 1119.02 ms | 1119.02 ms | 0 ms |
| **Moderate Ramp** | 2 users | 40 | 100% | 5.4 req/s | 354.58 ms | 466.13 ms | 669.22 ms | 0 ms |
| **Peak Envelope Ramp** | 5 users | 100 | 100% | 10.0 req/s | 460.32 ms | 814.33 ms | 827.20 ms | 12 ms |

**Key Findings:**
- Zero request dropouts (100% HTTP 200).
- P95 latency capped at 814 ms under peak concurrency.
- Zero residual queue lag upon workload reduction.

---

## 9. Defect Ledger & Boundary Security

| Defect ID | Severity | Scope | Component | Description & Remediation |
|---|---|---|---|---|
| `DEF_001` | Low | All Roles | `src/routes/app.admin.tsx` | **Admin Console Design Deferred:** Ordinary roles receive an appropriate `Access Denied` shield alert when navigating directly to `/app/admin`. Admin link is hidden from the sidebar menu when `isAdmin` is false. |
| `DEF_002` | Low | Student / New Registration | GoTrue Auth / Supabase Cloud | **Cloud IP Rate Limiting on Automated Signup:** Repetitive signups from identical IP addresses trigger cloud 429 safeguards. Addressed by utilizing the pre-seeded verified accounts (`alex.chen@student.brahma.edu`, `dr.sarah.connor@faculty.brahma.edu`, `marcus.vance@fintech-core.io`). |

---

## 10. Local Development & Verification Runbook

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v12+`
- Active Supabase Cloud instance configured in `.env`

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server (Port 5173)
npm run dev -- --port 5173

# 3. In another terminal, verify TypeScript compilation
npm run typecheck

# 4. Run verification gates (GoTrue Auth, RLS, Storage, RPCs)
npm test

# 5. Run the master audit suite
node "51 — TESTING PLATFORM/scripts/testing/run-master-audit-suite.mjs"
```

### Git & Lovable Synchronization
```bash
# Forward atomic commit
git add .
git commit -m "feat: description of atomic change"
git push origin main
```
