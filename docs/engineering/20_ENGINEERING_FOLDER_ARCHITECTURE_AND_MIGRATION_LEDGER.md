# 20 — ENGINEERING FOLDER ARCHITECTURE AND MIGRATION LEDGER
**Project:** VYRON / PROJECT BRAHMA v2.0  
**Repository Working Directory:** `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Git Remote:** `origin` -> `https://github.com/cypherpheonix07-lang/VYRON.git` (`main`)  
**Timestamp:** 2026-11-01T17:22:30+05:30  
**Classification:** `ARCHITECTURE TOPOLOGY & MIGRATION LEDGER`  

---

## 1. Enterprise 01–90 Logical Layer Architecture

The VYRON platform maintains an enterprise logical domain taxonomy organized across 01–90 numbered tiers. This taxonomy structures architectural concerns while preserving modern frontend framework conventions:

| Layer Identifier | Domain Classification | Architectural Function | Physical Source Target |
|---|---|---|---|
| `01` | Product & Requirements Layer | SRS documents, user journeys, AST schemas, acceptance criteria. | `docs/blueprint/`, `src/services/requirementService.ts` |
| `05` | Frontend Platform | TanStack Router, UI Shell, React components, theme tokens, Tailwind styles. | `src/components/`, `src/routes/`, `src/index.css` |
| `10` | Backend & Services | API adapters, PostgREST query builders, business logic services. | `src/services/`, `src/lib/api.ts` |
| `15` | Data & Storage Layer | PostgreSQL schemas, migrations, RLS policies, storage bucket abstractions. | `src/lib/db/`, `src/lib/storage.ts`, `supabase/` |
| `20` | AI & Copilot Engine | ATHER Copilot provider, dynamic thinking depth FSM, prompt templates. | `src/components/copilot/`, `src/services/ai/` |
| `25` | Security & Compliance | CVE/CWE scanner, secret isolation audits, RBAC authorization gates. | `src/services/securityReviewService.ts`, `src/lib/validators.ts` |
| `30` | Cloud & DevOps Infrastructure | Docker compose, CI/CD workflows, build configurations. | `.github/workflows/`, `vite.config.ts`, `package.json` |
| `40` | Enterprise Integrations | GitHub OAuth integration hub, webhook dispatchers, third-party connectors. | `src/components/github/`, `src/services/githubService.ts` |
| `50` | Quality Assurance & Benchmarks | Benchmark scripts, performance budgets, end-to-end user journeys. | `scripts/`, `test-*.mjs` |
| `51` | Testing Platform | Acceptance gates suite, GodMode scratch tests, two-phase verifications. | `51 — TESTING PLATFORM/`, `test-acceptance-gates.mjs` |
| `90` | Master Engineering Command Centre | Multi-agent coordination manifests, audit reports, master SDLC ledgers. | `docs/engineering/`, `docs/audits/` |

---

## 2. NTFS Junction & Symlink Topology Audit

1. **Physical Framework Source Preservation**:
   - Modern bundlers (Vite 8, Nitro SSR, TanStack Start) require strict conventional physical file layouts (`src/`, `src/routes/`, `vite.config.ts`, `tsconfig.json`).
   - Moving physical source files into numbered folders (e.g. moving `src/router.tsx` to `05 - FRONTEND PLATFORM/router.tsx`) would break module resolution, SSR entrypoints, and Nitro worker compilation.
2. **Junction Architecture**:
   - Numbered directories (`01 - PRODUCT & REQUIREMENTS LAYER` through `90 - MASTER ENGINEERING COMMAND CENTRE`) exist as NTFS junctions and symlinks linking directly to relevant domain directories.
   - This allows developers to browse by enterprise architectural layer while guaranteeing seamless build performance.
3. **Migration Policy**:
   - Zero destructive source file migrations are permitted without explicit architectural proof and automated import rewriting.
   - All physical source code remains anchored under `src/`.
