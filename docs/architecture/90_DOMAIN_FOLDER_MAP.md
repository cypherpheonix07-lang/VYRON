# VYRON / ATHER — 90-DOMAIN ARCHITECTURE & REORGANIZATION MAP

**Directive ID:** UNIVERSAL-AUTONOMOUS-ENGINEERING-520  
**Project:** VYRON / ATHER Engineering Intelligence SaaS  
**Root Path:** `c:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Status:** FULLY MAPPED & OPERATIONAL (Preserving Framework Conventions)

---

## 1. Architectural Principles & Compatibility Rules

1. **Framework-Required Locations Preserved:**  
   Vite, TanStack Start/Router, and Nitro require specific canonical entry points:
   - `src/main.tsx` (Vite DOM bootstrap)
   - `src/routes/**` (TanStack Router route filesystem discovery)
   - `src/server.ts` & `src/start.ts` (Nitro SSR / Server functions)
   - `vite.config.ts`, `tsconfig.json`, `package.json` (Platform build descriptors)
   These paths are permanently preserved in their root/src operational locations to prevent bundling breaks.

2. **Domain Ownership Mapping:**  
   All source components, hooks, services, state stores, adapters, and tests are rigorously mapped to the 90 canonical engineering domains across 9 major architectural tiers.

---

## 2. 90-Domain Canonical Directory & Module Ownership Matrix

### Group 1 — Platform Foundation (01–10)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **01** | Platform Core | `src/lib/utils.ts`, `src/types/` | Runtime utilities, kernel shims, clsx/twMerge adapters | RETAINED / MAPPED |
| **02** | Application Bootstrap | `src/main.tsx`, `src/routes/__root.tsx` | App bootstrap, root providers tree, React strict mode | FRAMEWORK RETAINED |
| **03** | Environment Configuration | `src/lib/env.ts`, `vite.config.ts` | Vite env validators, client-safe configuration schemas | RETAINED / MAPPED |
| **04** | Dependency Injection | `src/services/` singletons | Service container registries, provider singletons | RETAINED / MAPPED |
| **05** | Routing Architecture | `src/routes/`, `src/components/navigation/` | TanStack Router route guards, layout breadcrumbs | FRAMEWORK RETAINED |
| **06** | Shared Types | `src/types/`, `src/types/shared.ts` | Global domain models, TypeScript utility types | RETAINED / MAPPED |
| **07** | Validation Schemas | `src/lib/schemas/`, `src/lib/validation/` | Zod runtime schemas, payload contracts | RETAINED / MAPPED |
| **08** | Error Handling | `src/components/ErrorBoundary.tsx` | Global ErrorBoundary, unhandled crash telemetry | RETAINED / MAPPED |
| **09** | Logging Infrastructure | `src/services/telemetry/logger.ts` | Structured client logger, audit trace collectors | RETAINED / MAPPED |
| **10** | Feature Flags | `src/state/flags/`, `src/lib/features.ts` | Dynamic capability flags, experimental UI gates | RETAINED / MAPPED |

### Group 2 — Authentication & Governance (11–20)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **11** | Authentication | `src/services/auth/`, `src/routes/auth.*` | Supabase Auth adapters, session exchange, OAuth hooks | RETAINED / MAPPED |
| **12** | User Identity | `src/hooks/useAuth.ts`, `src/state/userStore.ts` | Identity claims, avatar generators, credential helpers | RETAINED / MAPPED |
| **13** | Authorization & RBAC | `src/services/governance/governanceAuth.ts` | Role definitions (Student, Faculty, Pro, Admin), guards | RETAINED / MAPPED |
| **14** | Session Management | `src/services/auth/sessionManager.ts` | Token refresh lifecycle, multi-tab broadcast channels | RETAINED / MAPPED |
| **15** | User Profiles | `src/routes/app.profile.tsx` | Profile metadata, user preferences, onboarding status | RETAINED / MAPPED |
| **16** | Student Domain | `src/routes/dashboard.student.tsx` | Academic project workspace, peer submission flows | RETAINED / MAPPED |
| **17** | Faculty Domain | `src/routes/dashboard.faculty.tsx` | Course governance, review rubrics, evaluations | RETAINED / MAPPED |
| **18** | Professional Domain | `src/routes/dashboard.professional.tsx` | Enterprise engineering workflows, SLA trackers | RETAINED / MAPPED |
| **19** | Admin Control Plane | `src/routes/admin.*`, `src/routes/app.admin.*` | System metrics, user management, audit logs, quotas | RETAINED / MAPPED |
| **20** | Tenant Governance | `src/services/tenant/`, `src/state/tenantStore.ts`| Tenant boundaries, workspace isolation rules | RETAINED / MAPPED |

### Group 3 — User Interfaces & Workflows (21–30)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **21** | Design System | `src/styles/tokens.css`, `tailwind.config.ts` | Tailwind configuration, design tokens, color ramps | RETAINED / MAPPED |
| **22** | Shared UI Components | `src/components/ui/` | Primitives: Dialog, Button, Tooltip, Accordion | RETAINED / MAPPED |
| **23** | Navigation & Layouts | `src/components/brahma/app-shell.tsx` | Sidebar, Topbar, Workspace header, Responsive drawer | RETAINED / MAPPED |
| **24** | Forms & Input Validation | `src/components/forms/`, `src/lib/forms/` | React Hook Form bindings, field level error displays | RETAINED / MAPPED |
| **25** | Notifications | `src/components/ui/sonner.tsx` | Sonner / Toast managers, in-app notification center | RETAINED / MAPPED |
| **26** | Search & Filtering | `src/routes/app.search.tsx` | Fuzzy search indexing, latency profiling, filters | RETAINED / MAPPED |
| **27** | Dashboards | `src/routes/app.index.tsx` | Analytics cards, metric grids, status visualizers | RETAINED / MAPPED |
| **28** | WorkPulse | `src/routes/app.workpulse.tsx` | Real-time engineering throughput & pulse telemetry | RETAINED / MAPPED |
| **29** | Workspace Management | `src/state/workspaceStore.ts` | Workspace switcher, member invites, settings modals | RETAINED / MAPPED |
| **30** | Project Command Centre | `src/routes/app.projects.index.tsx` | Project CRUD, lifecycle states, archive/restore | RETAINED / MAPPED |

### Group 4 — Intelligence Architecture (31–40)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **31** | ATHER Copilot | `src/components/copilot/`, `src/hooks/useCopilot.ts`| ATHER chat drawer, copilot studio, streaming UI | RETAINED / MAPPED |
| **32** | AI Model Gateway | `src/services/copilot/copilotModelGateway.ts` | Multi-provider abstraction (Gemini, Claude, OpenAI) | RETAINED / MAPPED |
| **33** | Prompt Orchestration | `src/services/copilot/promptOrchestrator.ts` | Dynamic system prompt templates, few-shot injects | RETAINED / MAPPED |
| **34** | Context Management | `src/services/copilot/copilotContextEngine.ts` | Token budgeting, sliding window context managers | RETAINED / MAPPED |
| **35** | Memory Architecture | `src/services/copilot/copilotMemory.ts` | 7-tier vector memory, session conversation store | RETAINED / MAPPED |
| **36** | Agent Orchestration | `src/services/copilot/copilotAgentOrchestrator.ts` | Specialist agents, goal planners, contracts | RETAINED / MAPPED |
| **37** | Tool Capability Broker | `src/services/copilot/copilotToolRegistry.ts` | Tool capability classification, execution hashes | RETAINED / MAPPED |
| **38** | ATLAS Knowledge Graph | `src/services/atlas/`, `src/routes/discover.tsx` | ATLAS interactive dependency graph, entity canvas | RETAINED / MAPPED |
| **39** | Architecture Analysis | `src/services/intelligence/analysisEngine.ts` | Source AST parsing, 12-stage forensics pipeline | RETAINED / MAPPED |
| **40** | Drift Detection | `src/services/intelligence/driftEngine.ts` | Architecture drift scoring, violation detection | RETAINED / MAPPED |

### Group 5 — Data and Backend (41–50)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **41** | API Gateway | `src/services/api/`, `src/routes/app.api-gateway.tsx` | HTTP client interceptors, unified error transformers | RETAINED / MAPPED |
| **42** | Backend Services | `src/server.ts`, `src/start.ts` | Nitro edge functions, server functions, CSRF shield | FRAMEWORK RETAINED |
| **43** | Database Access | `src/services/db/`, `src/services/supabaseClient.ts` | Supabase SDK query builders (Zero Raw SQL Mandate) | RETAINED / MAPPED |
| **44** | Supabase Integration | `src/integrations/supabase/` | Supabase client singleton, Realtime channel managers | RETAINED / MAPPED |
| **45** | Schema & Migrations | `supabase/migrations/` | Postgres schema migrations, DDL governance | RETAINED / MAPPED |
| **46** | Repository Patterns | `src/services/repositories/` | Data Access Objects (DAO), abstracted storage access | RETAINED / MAPPED |
| **47** | Caching | `src/lib/queryClient.ts` | TanStack Query caching configurations & policies | RETAINED / MAPPED |
| **48** | Data Validation | `src/lib/validation/wireValidation.ts` | Incoming wire payload sanitation, type guards | RETAINED / MAPPED |
| **49** | Transaction Management | `src/services/db/transactions.ts` | Atomic multi-table rollback handlers | RETAINED / MAPPED |
| **50** | Event Processing | `src/services/events/domainEvents.ts` | Realtime event dispatchers, domain message bus | RETAINED / MAPPED |

### Group 6 — External Integrations (51–60)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **51** | GitHub Integration | `src/routes/app.github.tsx`, `src/services/github/`| Octokit client, repository mirror, PR sync | RETAINED / MAPPED |
| **52** | GitLab Integration | `src/services/gitlab/` | GitLab API adapters, secondary VCS integrations | RETAINED / MAPPED |
| **53** | OAuth Providers | `src/routes/auth.callback.tsx` | Google, GitHub, and GitLab OAuth handshake handlers | RETAINED / MAPPED |
| **54** | Webhooks | `src/services/webhooks/` | Ingress receivers, signature verifiers, replay defense | RETAINED / MAPPED |
| **55** | Repo Synchronization | `src/services/github/syncService.ts` | Branch syncing, commit diff watchers, clone triggers | RETAINED / MAPPED |
| **56** | External API Adapters | `src/services/connectors/` | Third-party REST/GraphQL integration connectors | RETAINED / MAPPED |
| **57** | Data Import | `src/routes/app.datasets.tsx` | Kaggle & external CSV/JSON dataset importers | RETAINED / MAPPED |
| **58** | Data Export | `src/routes/app.exports.tsx` | Authentic client-side Blob zip & PDF report generator | RETAINED / MAPPED |
| **59** | Connector Credentials | `src/services/connectors/credentialVault.ts` | Encrypted credential vault interfaces, token refresh | RETAINED / MAPPED |
| **60** | Integration Health | `src/routes/app.integrations.tsx` | Third-party service health probes, circuit status | RETAINED / MAPPED |

### Group 7 — Reliability & Operations (61–70)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **61** | Telemetry | `src/services/telemetry/webVitals.ts` | Client Web Vitals reporting, user session telemetry | RETAINED / MAPPED |
| **62** | Error Monitoring | `src/services/telemetry/crashHandler.ts` | Uncaught exception telemetry, crash reporting | RETAINED / MAPPED |
| **63** | Performance Metrics | `src/services/telemetry/perfProfiler.ts` | Component re-render counters, frame profilers | RETAINED / MAPPED |
| **64** | Distributed Tracing | `src/services/telemetry/tracer.ts` | Trace ID propagation, correlation ID headers | RETAINED / MAPPED |
| **65** | Realtime Communication | `src/services/realtime/realtimeChannel.ts` | Supabase WebSockets, Presence channels, room broadcasts | RETAINED / MAPPED |
| **66** | Background Jobs | `src/workers/` | WebWorker wrappers, asynchronous client jobs | RETAINED / MAPPED |
| **67** | Queue Management | `src/services/queue/taskQueue.ts` | Priority task dispatchers, rate-limited queues | RETAINED / MAPPED |
| **68** | Resilience & Retries | `src/lib/retry.ts` | Exponential backoff retry algorithms, circuit breakers | RETAINED / MAPPED |
| **69** | Incident Management | `src/routes/app.status.tsx` | Maintenance mode overlays, degraded service warnings | RETAINED / MAPPED |
| **70** | Audit Evidence Ledger | `src/routes/app.admin.audit.tsx` | Cryptographic tamper-evident action logs (HMAC-SHA256) | RETAINED / MAPPED |

### Group 8 — Security, Quality & Release (71–80)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **71** | Security Policies | `src/services/security/securityPolicies.ts` | Content Security Policy (CSP), anti-XSS filters | RETAINED / MAPPED |
| **72** | Secret Management | `src/lib/secretSanitizer.ts` | Client-side secret leakage guardrails, .env validation | RETAINED / MAPPED |
| **73** | Dependency Security | `package-lock.json`, `npm audit` | npm audit scanners, lockfile integrity validators | RETAINED / MAPPED |
| **74** | Unit Testing | `51 — TESTING PLATFORM/scripts/testing/` | Vitest / Node test runners, pure function tests | RETAINED / MAPPED |
| **75** | Integration Testing | `test-acceptance-gates.mjs` | Component and subsystem integration test harnesses | RETAINED / MAPPED |
| **76** | Browser E2E Testing | `test-vyron-complete-journey.mjs` | Complete end-to-end user journey test suites | RETAINED / MAPPED |
| **77** | Regression Testing | `test-fleet-command-hub-scenarios.mjs` | Defect reproduction and regression suites | RETAINED / MAPPED |
| **78** | Adversarial Testing | `51 — TESTING PLATFORM/scripts/testing/` | Prompt injection guardrails, privilege escalation probes | RETAINED / MAPPED |
| **79** | Build & Release | `vite.config.ts`, `src/routes/app.release.tsx` | Vite rollup bundling, chunk optimization, minify | RETAINED / MAPPED |
| **80** | Deployment Infrastructure | `src/routes/app.deployments.tsx` | Cloudflare Workers, Vercel, Netlify deployment manifests | RETAINED / MAPPED |

### Group 9 — Advanced Architecture & Command Cockpit (81–90)
| Domain | Domain Name | Current Source Location | Code Ownership & Rationale | Status |
|---|---|---|---|---|
| **81** | Architecture Decisions | `src/services/intelligence/adrDecayEngine.ts` | Architecture Decision Records (ADRs) & decay trackers | RETAINED / MAPPED |
| **82** | System Blueprints | `src/routes/app.projects.$id.blueprint.tsx` | C4 architecture models, system context diagrams | RETAINED / MAPPED |
| **83** | Dependency Graph | `src/services/atlas/knowledgeGraph.ts` | Internal package graph, circular reference detectors | RETAINED / MAPPED |
| **84** | Automated Root-Cause | `src/services/intelligence/rootCauseEngine.ts` | Automated error classifiers, stack trace decoders | RETAINED / MAPPED |
| **85** | Change Impact Analysis | `src/routes/app.impact.tsx` | Git diff blast-radius calculators & DAG traversals | RETAINED / MAPPED |
| **86** | Quality Gates | `51 — TESTING PLATFORM/scripts/testing/verify-gates.js` | Pre-commit linter checks, test coverage gates | RETAINED / MAPPED |
| **87** | Git Automation | `src/services/github/syncService.ts` | Lovable sync safety, atomic forward-commit helpers | RETAINED / MAPPED |
| **88** | Documentation Reports | `docs/audits/` | Master audit reports, executive compliance briefings | RETAINED / MAPPED |
| **89** | Disaster Recovery | `src/services/storage/disasterRecovery.ts` | IndexedDB snapshot recovery, offline fallback stores | RETAINED / MAPPED |
| **90** | Master Command Centre | `src/routes/app.index.tsx`, `admin.command-centre.tsx` | Unified Engineering Command Cockpit | RETAINED / MAPPED |
