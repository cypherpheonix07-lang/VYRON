# PROJECT BRAHMA v4 — Navigation, Route & Module Reconciliation Matrix

**Document Reference**: `docs/audits/v4/01_nav_route_module_reconciliation.md`  
**Application Target**: `http://localhost:8080/app`  
**Total Canonical Systems**: 18 Brahma Core Systems  
**Total Navigation Domains**: 13 Primary Navigation Domains (18 Systems + 12 Core Domains)  
**Total Active Routes**: 46 Grounded TanStack Routes  

---

## 1. The 18 Brahma Core Systems Navigation Reconciliation

Every proposed system node from the Brahma architecture is reconciled with an active, functional route in the application:

| System # | System Identifier | System Name | Architectural Layer | Operational Status | Grounded Target Route | Invariant Verification |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `app-shell` | React 19 AppShell | Frontend | Operational | `/app` | Responsive AppShell, TanStack Router tree |
| **02** | `supabase-auth` | Auth Gateway & RLS | Frontend | Enforced | `/app/team` | Supabase JWT session, RBAC policies |
| **03** | `fastapi-gateway` | FastAPI Core Gateway | Core API | Ready | `/app/api-gateway` | OpenAPI schemas, asynchronous dispatch |
| **04** | `realtime-broker` | Realtime Event Bus | Core API | Streaming | `/app/monitoring` | Sentinel WebSocket telemetry, LISTEN/NOTIFY |
| **05** | `lizard-ast` | Lizard AST Analyzer | Analysis | Deterministic | `/app/forensics` | Cyclomatic complexity, maintainability index |
| **06** | `bandit-security` | Bandit AST Security | Analysis | Active | `/app/security-center` | CWE vulnerability detector, OWASP Top 10 |
| **07** | `celery-workers` | Celery Task Workers | Analysis | Synchronized | `/app/system-flow` | Distributed pipeline orchestration |
| **08** | `ai-gateway` | AI Gateway 2.0 | AI & Agents | Multi-Model | `/app/admin/models` | Provider routing, token budget & fallback |
| **09** | `copilot-engine` | Brahma Copilot Engine | AI & Agents | Context-Aware | `/app/chat` | Dynamic AST context, streaming LLM drawer |
| **10** | `specialist-agents` | Specialist Agents Mesh | AI & Agents | Autonomous | `/app/aether` | 8 specialist workers, P2P swarm |
| **11** | `plugin-runtime` | Plugin Sandbox Runtime | AI & Agents | Isolated | `/app/plugins` | Wasm tool sandbox, capability tokens |
| **12** | `connectors-hub` | Connectors Hub (MCP) | External | Connected | `/app/connectors` | Model Context Protocol v1 endpoints |
| **13** | `github-sync` | GitHub Mirror Sync | External | Realtime | `/app/github` | Webhook ingestion, AST delta tree diff |
| **14** | `supabase-postgres`| PostgreSQL Database | Persistence | Postgres RLS | `/app/datasets` | Zero Raw SQL mandate, parameterized ORM |
| **15** | `reportlab-engine` | ReportLab PDF Compiler | Analysis | Verified | `/app/exports` | Evidence artifact compilation |
| **16** | `audit-vault` | Immutable Audit Vault | Persistence | Zero-Tamper | `/app/admin/audit` | Cryptographic hash-chain audit ledger |
| **17** | `release-evaluator`| Release Gate Evaluator | Analysis | Zero-Drift | `/app/release` | Multi-gate release readiness scoring |
| **18** | `demo-sandbox` | Demo Simulation Lab | Core API | Isolated | `/app/simulation` | Ephemeral in-memory mock fixture twin |

---

## 2. Left-Hand Sidebar Navigation Domains Reconciliation

The sidebar in `src/components/brahma/app-shell.tsx` renders all 13 domains, all expanded by default:

```
[+] 18 BRAHMA SYSTEMS
    • 18-System Control Plane (/app/systems)
    • Project Reality Map (/app/reality-map)
    • ATHER Cognitive Center (/app/aether)
    • Lizard AST Forensics (/app/forensics)
    • Bandit AST Security (/app/security-center)
    • MCP Connectors Hub (/app/connectors)
    • Celery Flow & Sentinel (/app/system-flow)

[+] HOME
    • Command Center (/app)
    • Activity Stream (/app/activity)
    • System Alerts (/app/notifications)
    • Workspace Pulse (/app/workpulse)

[+] DISCOVER
    • Project Reality Map (/app/reality-map)
    • Global Discovery Search (/discover)
    • Repository Discovery (/app/github)

[+] INTELLIGENCE
    • Intelligence & Knowledge Graph (/app/intelligence)
    • Architecture Drift (/app/drift)
    • Causal Change Impact (/app/impact)
    • Decisions & Missions (/app/missions)

[+] ENGINEERING
    • Project Workspaces (/app/projects)
    • New Project Blueprint (/app/projects/new)
    • Project Templates (/app/studio/templates)
    • Testing Platform (/app/testing)
    • Tech Radar (/app/tech-radar)

[+] ANALYSIS
    • 12-Stage Forensics (/app/analysis)
    • Reports & Findings (/app/reports)
    • Security & Posture Review (/app/security-center)
    • Deep Code Forensics (/app/forensics)
    • Engineering Theater (/app/preview)

[+] RELEASE
    • Release Gates & Twin (/app/release)
    • Artifact & Export Center (/app/exports)
    • Automated CI/CD (/app/cicd)

[+] SIMULATION
    • Simulation Twin Lab (/app/simulation)
    • Digital Twin & Benchmarks (/app/eval)

[+] AI
    • ATHER Cognitive Center (/app/aether)
    • ATHER Copilot Studio (/app/chat)
    • Autonomous AI Studio (/app/studio)
    • AI Model Governance (/app/admin/models)

[+] INTEGRATIONS
    • Ecosystem Control Plane (/app/integrations)
    • GitHub Mirror & App (/app/github)
    • MCP Connectors (/app/connectors)
    • Plugin Center (/app/plugins)
    • Enterprise API Gateway (/app/api-gateway)
    • Kaggle & Data Sources (/app/datasets)

[+] GOVERNANCE
    • Policy-As-Code Governance (/app/policies)
    • Team & Policy Access (/app/team)
    • Audit & Evidence Ledger (/app/admin/audit)
    • Platform Health & Settings (/app/settings)
    • SLO & Telemetry (/app/admin/usage)
    • Admin Console (/app/admin)

[+] SYSTEM FLOW
    • Live System Flow & Sentinel (/app/system-flow)
    • Sentinel Health & Monitoring (/app/monitoring)
    • WorkPulse Telemetry (/app/workpulse)

[+] DEPLOYMENT PLATFORMS
    • Deployment Platforms (/app/deployments)
    • Cloud Infrastructure Fabric (/app/infra)
```
