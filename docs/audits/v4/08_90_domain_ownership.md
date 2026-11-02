# PROJECT BRAHMA v4 — 90-Domain Architecture & Ownership Mapping

**Document Reference**: `docs/audits/v4/08_90_domain_ownership.md`  
**Architectural Framework**: 90 Domain Folders mapped to the 18 Brahma Core Systems  

---

## 1. 90-Folder Architecture Mapping to the 18 Core Systems

| System # | System Name | Responsible Architecture Folders (from 01 to 90) | Operational Responsibility |
| :---: | :--- | :--- | :--- |
| **01** | React 19 AppShell | `04 - EXPERIENCE - UI ARCHITECTURE`, `05 - FRONTEND PLATFORM` | Desktop/mobile layout, TanStack router, dark theme |
| **02** | Auth Gateway & RLS | `16 - IDENTITY`, `17 - AUTHENTICATION`, `18 - AUTHORIZATION - RBAC - ABAC`, `19 - MULTI-TENANCY`, `36 - ZERO-TRUST ACCESS` | Supabase JWT sessions, RLS security policies |
| **03** | FastAPI Core Gateway | `06 - API GATEWAY`, `07 - BACKEND SERVICE MESH`, `08 - DOMAIN SERVICES`, `38 - RATE LIMITING`, `39 - API QUOTAS` | Pydantic v2 endpoints, Celery task dispatches |
| **04** | Realtime Event Bus | `10 - EVENT-DRIVEN ARCHITECTURE`, `11 - MESSAGE & QUEUE INFRASTRUCTURE`, `82 - NOTIFICATIONS`, `83 - WEBHOOKS` | Postgres LISTEN/NOTIFY, WebSocket streaming |
| **05** | Lizard AST Analyzer | `71 - ENGINEERING INTELLIGENCE`, `49 - ERROR INTELLIGENCE` | Static cyclomatic complexity, token density |
| **06** | Bandit AST Security | `34 - SECURITY PLATFORM`, `53 - SECURITY TESTING`, `31 - AI SAFETY & GUARDRAILS` | CWE security analysis, vulnerability taxonomy |
| **07** | Celery Task Workers | `09 - WORKFLOW ORCHESTRATION`, `64 - AUTOSCALING`, `87 - SRE` | Asynchronous task queues, background repository scans |
| **08** | AI Gateway 2.0 | `22 - AI GATEWAY`, `23 - MODEL ROUTER`, `40 - COST & TOKEN GOVERNANCE` | Multi-LLM provider routing, token budgeting |
| **09** | Brahma Copilot Engine | `24 - COPILOT ORCHESTRATOR`, `26 - CONTEXT ENGINE`, `27 - MEMORY ENGINE`, `28 - RAG & KNOWLEDGE ENGINE` | Unified Copilot drawer, dynamic AST context |
| **10** | Specialist Agents Mesh | `25 - AGENT RUNTIME`, `29 - TOOL EXECUTION ENGINE`, `30 - REASONING & PLANNING LAYER`, `33 - HUMAN-IN-THE-LOOP CONTROL` | 8 domain-specific autonomous worker agents |
| **11** | Plugin Sandbox Runtime | `20 - INTEGRATION PLATFORM`, `35 - SECRETS & KEY MANAGEMENT` | Wasm plugin runtime, capability isolation |
| **12** | Connectors Hub (MCP) | `21 - GITHUB & DEV PLATFORM CONNECTORS`, `85 - DEVELOPER PLATFORM` | Model Context Protocol v1 endpoints |
| **13** | GitHub Mirror Sync | `21 - GITHUB & DEV PLATFORM CONNECTORS`, `15 - SEARCH ENGINE` | Webhook ingestion, AST diffing, repo mirror |
| **14** | PostgreSQL Database | `12 - DATABASE PLATFORM`, `13 - VECTOR & KNOWLEDGE STORAGE`, `14 - OBJECT & FILE STORAGE`, `67 - BACKUPS` | Authoritative relational data, zero raw SQL |
| **15** | ReportLab PDF Compiler | `70 - ANALYTICS`, `14 - OBJECT & FILE STORAGE` | Deterministic evidence compilation and PDF builds |
| **16** | Immutable Audit Vault | `37 - AUDIT & FORENSICS`, `74 - GOVERNANCE ENGINE`, `75 - POLICY ENGINE`, `76 - COMPLIANCE`, `77 - DATA GOVERNANCE` | Tamper-proof hash-chained audit ledger |
| **17** | Release Gate Evaluator | `51 - TESTING PLATFORM`, `54 - CHAOS ENGINEERING`, `55 - CI`, `56 - CD`, `57 - RELEASE MANAGEMENT`, `58 - FEATURE FLAGS` | Multi-gate release readiness scoring |
| **18** | Demo Simulation Lab | `73 - SIMULATION ENGINE`, `52 - LOAD & STRESS TESTING`, `59 - ENVIRONMENT MANAGEMENT`, `90 - BUSINESS CONTINUITY` | Non-destructive exploratory simulation twin |
