# 07 — PROJECT COMPONENT INVENTORY
**Project:** VYRON / PROJECT BRAHMA v2.0  
**Repository Working Directory:** `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Git Remote:** `origin` -> `https://github.com/cypherpheonix07-lang/VYRON.git` (`main`)  
**Timestamp:** 2026-11-01T17:12:30+05:30  
**Classification:** `OBSERVED CODEBASE INVENTORY`  

---

## 1. Inventory Summary

This catalog provides the verified physical file and module inventory of the VYRON / PROJECT BRAHMA codebase, mapped directly to physical repository locations under `src/`.

---

## 2. Routing & Shell Components

| Route / View Identifier | File Path | Scope & Key Functionality | Status |
|---|---|---|---|
| Root Gateway | `src/routes/index.tsx` | Landing page, hero showcase, marketing CTAs, dynamic login redirection. | `VERIFIED` |
| Authentication | `src/routes/login.tsx` | Supabase PKCE login, Google/GitHub OAuth, demo account switch. | `VERIFIED` |
| Onboarding Stepper | `src/routes/onboarding.tsx` | 3-step organization and project profile initialization flow. | `VERIFIED` |
| Public Discovery | `src/routes/discover.tsx` | Community architectural templates, shared blueprints, catalog. | `VERIFIED` |
| Application Shell | `src/routes/app.tsx` | Protected route layout wrapper with `BrahmaAppShell` integration. | `VERIFIED` |
| Command Center | `src/routes/app.index.tsx` | Master engineering dashboard, fleet telemetry, active project grid. | `VERIFIED` |
| Project Creation Wizard | `src/routes/app.projects.new.tsx` | 8-step project wizard v2 with draft recovery and template selection. | `VERIFIED` |
| Project Workspace | `src/routes/app.projects.$projectId.tsx` | Individual project workspace (Canvas, AST, KPIs, Health, Risks). | `VERIFIED` |
| Requirement Analysis | `src/routes/app.analysis.tsx` | Requirement parsing, AST extraction, validation engine. | `VERIFIED` |
| Security Reviewer | `src/routes/app.security.tsx` | CVE/CWE vulnerability scanner and dependency audit view. | `VERIFIED` |
| System Settings | `src/routes/app.settings.tsx` | Organization settings, GitHub integration tokens, theme toggle. | `VERIFIED` |

---

## 3. Core Architectural Sub-Systems

### 3.1 Brahma Shell & Navigation (`src/components/brahma/`)
- `app-shell.tsx`: Master layout manager handling sidebar collapsible states, header breadcrumbs, and command palette.
- `header.tsx`: Global navigation header containing user avatar, notification center, and ATHER Copilot quick toggle.
- `sidebar.tsx`: Accessible role-gated navigation sidebar supporting Admin, Engineer, and Viewer views.

### 3.2 ATLAS Reactive Architecture Canvas (`src/components/architecture/` & `src/components/canvas/`)
- `Canvas.tsx`: Core interactive canvas wrapping `@xyflow/react` with custom pan/zoom, grid snapping, and mini-map.
- `NodeTypes.tsx`: Custom React Flow nodes: ServiceNode, DatabaseNode, QueueNode, GatewayNode, ExternalAPINode.
- `EdgeTypes.tsx`: Custom animated edges indicating synchronous HTTP, asynchronous PubSub, and gRPC streams.
- `ArchitectureToolbar.tsx`: Canvas manipulation tools (auto-layout, export PNG/SVG, clear canvas, validate graph).

### 3.3 ATHER Conversational Copilot (`src/components/copilot/`)
- `CopilotProvider.tsx`: React Context orchestrating copilot state, streaming responses, and thinking depth levels (L1–L4).
- `CopilotFloatingButton.tsx`: Floating action trigger with contrast-aligned accents and unread badge.
- `CopilotDialog.tsx`: Expandable dialog with chat history, streaming markdown renderer, and tool execution cards.
- `CopilotThinkingBubble.tsx`: Visual representation of model reasoning depth with collapsible thoughts.

### 3.4 WorkPulse Fleet Hub (`src/components/workpulse/` & `src/components/dashboard/`)
- `WorkPulseCommandCenter.tsx`: Fleet overview displaying build velocity, system uptime, and active worker agents.
- `WorkPulseFleetTelemetry.tsx`: Real-time charts of CPU/memory consumption, API latency, and error rates.
- `AnalysisDashboardView.tsx`: Contrast-aligned analysis summary with metric badges and findings table.

---

## 4. State Management, Contexts & Hooks

| Context / Store / Hook | File Location | Responsibility |
|---|---|---|
| `AuthContext` | `src/contexts/AuthContext.tsx` | Manages Supabase session, token renewal, user profile, and demo switch. |
| `DemoModeContext` | `src/contexts/DemoModeContext.tsx` | Global demo mode state isolation across session/local storage. |
| `useProjects` | `src/hooks/useProjects.ts` | CRUD operations for projects with UUID guard and offline draft fallback. |
| `useGitHubAccounts` | `src/hooks/useGitHubAccounts.ts` | Integration hook for GitHub OAuth accounts and repository syncing. |
| `useCopilot` | `src/hooks/useCopilot.ts` | Copilot invocation hook managing prompt submission and tool call capture. |
| `architectureStore` | `src/stores/architectureStore.ts` | Zustand store managing React Flow nodes, edges, undo/redo, and AST sync. |
| `analysisStore` | `src/stores/analysisStore.ts` | 16-state finite state machine governing analysis job lifecycles. |
| `modeStore` | `src/stores/modeStore.ts` | Controls development, staging, and demo environment behavior. |

---

## 5. Services, Client SDKs & Database Layer

| Service / Utility | File Location | Target Functionality |
|---|---|---|
| `supabaseClient` | `src/lib/supabaseClient.ts` | Parameterized Supabase client instance with auto-refresh tokens. |
| `api.ts` | `src/lib/api.ts` | Type-safe REST client adhering to Zero Raw SQL Mandate. |
| `db/types.ts` | `src/lib/db/types.ts` | PostgreSQL table schemas, generated types, and `isValidUuid` validator. |
| `requirementService.ts` | `src/services/requirementService.ts` | AST extraction, ambiguity scoring, and design invariant checks. |
| `kpiService.ts` | `src/services/kpiService.ts` | Financial ROI, latency budget, and KPI projection modeling. |
| `codeHealthService.ts` | `src/services/codeHealthService.ts` | Maintainability index calculation, cyclomatic complexity, code smells. |
| `securityReviewService.ts`| `src/services/securityReviewService.ts` | CVE/CWE vulnerability evaluation and dependency check abstraction. |
| `riskPredictorService.ts` | `src/services/riskPredictorService.ts` | ML-driven delivery risk curve projection and schedule bottleneck flags. |
| `pdfReportService.ts` | `src/services/pdfReportService.ts` | PDF document synthesis with structured tables and architecture diagrams. |
| `storageService.ts` | `src/services/storageService.ts` | Supabase storage bucket interaction for architectural blueprints and exports. |
