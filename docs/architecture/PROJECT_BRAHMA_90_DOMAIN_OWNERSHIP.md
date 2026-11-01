# VYRON / ATHER — PROJECT BRAHMA: 90-DOMAIN OWNERSHIP & ARCHITECTURE SPECIFICATION

**Directive ID:** PROJECT-BRAHMA-90-DOMAINS  
**Project:** VYRON / ATHER Autonomous Engineering System  
**Architecture:** Hexagonal Modular Monolith with Edge Routing  
**Status:** FULLY MAPPED & RETAINED (Framework Paths Preserved)  

---

## 1. Architectural Principles & Framework Invariants

To avoid disrupting Vite, TanStack Router, and Nitro bundlers, framework-required file locations remain in their canonical paths:
- `src/main.tsx` — Root application entrypoint (Vite client bootstrap)
- `src/routes/**` — TanStack Router filesystem route definitions
- `src/server.ts` & `src/start.ts` — Server entrypoints & Nitro handler
- `vite.config.ts` — Bundling and plugin pipeline
- `supabase/migrations/**` — PostgreSQL declarative schema and RLS policies

Every internal component, hook, service, store, and adapter is mapped to one of the **90 canonical engineering domains** across 9 architectural tiers.

---

## 2. 90 Canonical Engineering Domains Matrix

### Tier 1: Platform Foundation (Domains 01–10)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **01** | Platform Core | `src/lib/utils.ts`, `src/types/` | Utilities, clsx/twMerge adapters, core primitives | RETAINED |
| **02** | Application Bootstrap | `src/main.tsx`, `src/routes/__root.tsx` | React 18 strict mode bootstrap, global providers | FRAMEWORK |
| **03** | Environment Configuration | `src/lib/env.ts`, `vite.config.ts` | Type-safe environment validation, client secret isolation | RETAINED |
| **04** | Dependency Injection | `src/services/` singletons | Singleton service registries, factory functions | RETAINED |
| **05** | Routing Architecture | `src/routes/`, `src/router.tsx` | TanStack Router file-based discovery, layout trees | FRAMEWORK |
| **06** | Shared Types | `src/types/`, `src/types/shared.ts` | Global domain contracts, utility generics | RETAINED |
| **07** | Validation Schemas | `src/lib/schemas/`, `src/lib/validation/` | Zod runtime schemas, payload boundary validators | RETAINED |
| **08** | Error Handling | `src/components/ui/ErrorBoundary.tsx` | Unhandled error boundary, crash diagnostics | RETAINED |
| **09** | Logging Infrastructure | `src/services/telemetry/logger.ts` | Structured JSON loggers, browser console sinks | RETAINED |
| **10** | Feature Flags | `src/state/flags/`, `src/lib/features.ts` | Dynamic feature gates, experimental toggles | RETAINED |

### Tier 2: Authentication & Identity (Domains 11–20)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **11** | Authentication | `src/services/auth/authService.ts` | Supabase Auth client, OAuth handlers | RETAINED |
| **12** | User Identity | `src/hooks/useAuth.ts`, `src/state/userStore.ts` | User claims, session state, avatars | RETAINED |
| **13** | Authorization & RBAC | `src/services/governance/governanceAuth.ts` | Role checks (Student, Faculty, Pro, Admin) | RETAINED |
| **14** | Session Management | `src/services/auth/sessionManager.ts` | Token refresh loops, multi-tab sync | RETAINED |
| **15** | User Profiles | `src/routes/app.profile.tsx` | Profile metadata, onboarding settings | RETAINED |
| **16** | Student Workspace | `src/routes/dashboard.student.tsx` | Student project space, academic workflows | RETAINED |
| **17** | Faculty Workspace | `src/routes/dashboard.faculty.tsx` | Faculty project reviews, grading rubrics | RETAINED |
| **18** | Professional Workspace | `src/routes/dashboard.professional.tsx` | Enterprise project controls, SLA trackers | RETAINED |
| **19** | Admin Control Plane | `src/routes/app.admin.tsx`, `src/routes/admin.*` | Super-admin dashboard, tenant metrics | RETAINED |
| **20** | Tenant Isolation | `src/state/tenantStore.ts` | Multi-tenant boundaries, workspace scopes | RETAINED |

### Tier 3: Design System & UX (Domains 21–30)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **21** | Design Tokens | `src/styles/tokens.css`, `tailwind.config.ts` | Color palettes, typography scales, spacing units | RETAINED |
| **22** | UI Primitives | `src/components/ui/` | Dialog, Button, DropdownMenu, Tabs, Tooltip | RETAINED |
| **23** | Navigation & App Shell | `src/components/brahma/app-shell.tsx` | 12-domain sidebar, mobile drawer, breadcrumbs | RETAINED |
| **24** | Command Palette | `src/components/command/` | Global search dialog, quick navigation shortcuts | RETAINED |
| **25** | Notification Center | `src/routes/app.notifications.tsx` | In-app alerts, sonner toasts, banner broadcasts | RETAINED |
| **26** | Form Infrastructure | `src/components/forms/`, `react-hook-form` | Controlled inputs, Zod form validation resolvers | RETAINED |
| **27** | Table & Grid Virtualization | `src/components/tables/` | Paginated and virtualized data table views | RETAINED |
| **28** | Modals & Dialogs | `src/components/modals/` | Confirmation alerts, edit drawers, overlay system | RETAINED |
| **29** | Themes & Customization | `src/styles/theme.css` | Dark/light theme switching, accent colors | RETAINED |
| **30** | Accessibility (a11y) | `src/components/a11y/` | ARIA labels, keyboard focus traps, screen reader shims | RETAINED |

### Tier 4: Engineering & Project Core (Domains 31–40)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **31** | Project Workspaces | `src/routes/app.projects.index.tsx` | Project listing, filter, search, selection | RETAINED |
| **32** | Project Creation | `src/routes/app.projects.new.tsx` | Multi-step project blueprint scaffolding | RETAINED |
| **33** | Project Templates | `src/routes/app.studio.templates.tsx` | Pre-engineered architecture template gallery | RETAINED |
| **34** | Requirements Engine | `src/routes/app.projects.$id.requirements.tsx` | Requirement traceability, acceptance criteria | RETAINED |
| **35** | Architecture Blueprints | `src/routes/app.projects.$id.blueprint.tsx` | Interactive ReactFlow component AST canvas | RETAINED |
| **36** | Code Health Profiling | `src/routes/app.projects.$id.code-health.tsx` | Cyclomatic complexity, code health index | RETAINED |
| **37** | Security Center | `src/routes/app.security-center.tsx` | OWASP scanning, CVE dependency audit | RETAINED |
| **38** | Testing Platform | `src/routes/app.testing.tsx` | Test execution, verification gate runner | RETAINED |
| **39** | Tech Radar | `src/routes/app.tech-radar.tsx` | Technology quadrant adoption ring mapper | RETAINED |
| **40** | Project Analytics | `src/routes/app.projects.$id.analytics.tsx` | Engineering velocity, drift trend charts | RETAINED |

### Tier 5: Analysis & Forensics (Domains 41–50)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **41** | 12-Stage Forensics Engine | `src/routes/app.analysis.tsx` | Orchestrated 12-stage analysis pipeline | RETAINED |
| **42** | Findings Repository | `src/routes/app.reports.tsx` | Structured defect records, severity scoring | RETAINED |
| **43** | Deep Forensics | `src/routes/app.forensics.tsx` | Thread dump, memory leak, AST deep forensics | RETAINED |
| **44** | Engineering Theater | `src/routes/app.preview.tsx` | Micro-frontend sandboxed component preview | RETAINED |
| **45** | Risk Scoring Engine | `src/services/analysis/riskScorer.ts` | 0-100 composite multi-factor risk scoring | RETAINED |
| **46** | Graph Analysis | `src/services/analysis/graphAnalyzer.ts` | Graph centrality, dependency fan-out analysis | RETAINED |
| **47** | Anomaly Detection | `src/services/analysis/anomalyDetector.ts` | Statistical IQR and outlier detection | RETAINED |
| **48** | Data Validation | `src/services/analysis/dataValidator.ts` | Data contract conformity, boundary assertion | RETAINED |
| **49** | Report Compiler | `src/services/reportCompiler.ts` | Headless report compiler, SHA-256 seal | RETAINED |
| **50** | Evidence Verification | `src/services/ai/cryptoUtils.ts` | Cryptographic evidence hash generators | RETAINED |

### Tier 6: Intelligence & Reality Graph (Domains 51–60)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **51** | Project Reality Map | `src/routes/app.reality-map.tsx` | AST-derived system reality graph | RETAINED |
| **52** | Architecture Drift | `src/routes/app.drift.tsx` | Baseline vs current implementation drift | RETAINED |
| **53** | Causal Change Impact | `src/routes/app.impact.tsx` | Change blast-radius propagation DAG | RETAINED |
| **54** | Decisions & Missions | `src/routes/app.missions.tsx` | Autonomous engineering mission planner | RETAINED |
| **55** | Knowledge Graph | `src/services/intelligence/knowledgeGraph.ts` | Multi-entity engineering knowledge graph | RETAINED |
| **56** | Recommendation Engine | `src/services/intelligence/predictiveRecommendationEngine.ts` | Proactive architecture suggestions | RETAINED |
| **57** | Global Search | `src/routes/discover.tsx` | Multi-project search, semantic indexing | RETAINED |
| **58** | GitHub Discovery | `src/routes/app.github.tsx` | Repository discovery, README classifier | RETAINED |
| **59** | Dependency Parsing | `src/services/discovery/dependencyParser.ts` | Package.json and import graph parser | RETAINED |
| **60** | Provenance Tracking | `src/components/brahma/ProvenancePanel.tsx` | Data lineage and verification trail | RETAINED |

### Tier 7: AI, ATHER & Autonomous Agents (Domains 61–70)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **61** | ATHER Command Hub | `src/routes/app.aether.tsx` | Master Multi-Agent Kernel control plane | RETAINED |
| **62** | Copilot Chat | `src/routes/app.chat.tsx` | Gemini 3.5 Flash streaming copilot interface | RETAINED |
| **63** | Visual Studio | `src/routes/app.studio.tsx` | Visual flow canvas, node graph code gen | RETAINED |
| **64** | Model Registry | `src/routes/app.admin.models.tsx` | LLM model gateway, routing & fallbacks | RETAINED |
| **65** | Context Mesh | `src/services/copilot/contextMesh.ts` | Context passport, candidate admission engine | RETAINED |
| **66** | Intent Radar | `src/services/copilot/questionUnderstanding.ts` | 16-class question intent classifier | RETAINED |
| **67** | Memory Compass | `src/services/copilot/historyRetrieval.ts` | Multi-turn conversational memory retriever | RETAINED |
| **68** | Tool Dispatcher | `src/services/copilot/copilotToolRegistry.ts` | Agent tool broker, permission authorization | RETAINED |
| **69** | Token Budgeting | `src/services/llmGateway.ts` | Per-request token meter and rate limiter | RETAINED |
| **70** | Autonomous Mission Execution | `src/services/aiProject/runtime/agentRuntime.ts` | Multi-agent task execution and status | RETAINED |

### Tier 8: Integrations, Ecosystem & MCP (Domains 71–80)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **71** | Ecosystem Control Plane | `src/routes/app.integrations.tsx` | Integrations directory, connection manager | RETAINED |
| **72** | GitHub Integration | `src/services/githubService.ts` | Octokit GitHub API client, webhooks | RETAINED |
| **73** | MCP Connectors | `src/routes/app.connectors.tsx` | Model Context Protocol server bridge | RETAINED |
| **74** | Runtime Plugin Center | `src/routes/app.plugins.tsx` | Sandboxed plugin marketplace and manager | RETAINED |
| **75** | API Gateway | `src/routes/app.api-gateway.tsx` | Enterprise reverse proxy, rate limiter | RETAINED |
| **76** | Dataset Ingestion | `src/routes/app.datasets.tsx` | Kaggle dataset connector and downloader | RETAINED |
| **77** | Webhook Engine | `src/services/connectors/webhookHandler.ts` | Inbound webhook validator, HMAC signatures | RETAINED |
| **78** | Third-party OAuth | `src/services/auth/oauthProviders.ts` | Google, GitHub, GitLab OAuth clients | RETAINED |
| **79** | External Storage | `src/integrations/supabase/client.ts` | Supabase Storage S3-compatible client | RETAINED |
| **80** | CI/CD Webhooks | `src/routes/app.cicd.tsx` | GitHub Actions and GitLab CI triggers | RETAINED |

### Tier 9: Operations, Telemetry & Deployments (Domains 81–90)
| Domain | Domain Name | Source Locations | Architecture Scope | Status |
|---|---|---|---|---|
| **81** | Live System Flow | `src/routes/app.system-flow.tsx` | Realtime animated topology flow canvas | RETAINED |
| **82** | Sentinel Telemetry | `src/routes/app.monitoring.tsx` | Sentinel health monitor, p95 latency probes | RETAINED |
| **83** | WorkPulse Dashboard | `src/routes/app.workpulse.tsx` | Realtime developer pulse & activity stream | RETAINED |
| **84** | Policy-As-Code | `src/routes/app.policies.tsx` | OPA-style policy engine and blast radius | RETAINED |
| **85** | Audit Ledger | `src/routes/app.admin.audit.tsx` | Tamper-evident immutable event ledger | RETAINED |
| **86** | Platform Settings | `src/routes/app.settings.tsx` | Environment variables, health diagnostics | RETAINED |
| **87** | Usage & SLO Metrics | `src/routes/app.admin.usage.tsx` | Service Level Objective tracking, quotas | RETAINED |
| **88** | Deployment Targets | `src/routes/app.deployments.tsx` | Cloudflare, Vercel, Supabase edge deployments | RETAINED |
| **89** | Cloud Infrastructure Fabric | `src/routes/app.infra.tsx` | Terraform IaC templates, cloud resource state | RETAINED |
| **90** | Release Gates & Rehearsal | `src/routes/app.release.tsx` | 21 digital twin promotion gate families | RETAINED |
