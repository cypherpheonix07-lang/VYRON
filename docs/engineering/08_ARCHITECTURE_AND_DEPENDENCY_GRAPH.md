# 08 — ARCHITECTURE AND DEPENDENCY GRAPH
**Project:** VYRON / PROJECT BRAHMA v2.0  
**Repository Working Directory:** `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Git Remote:** `origin` -> `https://github.com/cypherpheonix07-lang/VYRON.git` (`main`)  
**Timestamp:** 2026-11-01T17:13:00+05:30  
**Classification:** `ARCHITECTURE & TOPOLOGY`  

---

## 1. System Topology Overview

VYRON / PROJECT BRAHMA v2.0 utilizes a modular modern architecture powered by TanStack Start with Vite 8 and Nitro SSR on the frontend, coordinating with Supabase PostgreSQL and Edge Functions on the backend, styled with Tailwind CSS and shadcn/ui primitives.

---

## 2. High-Level Component & Service Topology

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Browser / SPA)"]
        UI_Shell["Brahma App Shell (Header, Sidebar, Breadcrumbs)"]
        Routes["TanStack Router (File-based Routes)"]
        CanvasView["ATLAS Architecture Canvas (@xyflow/react)"]
        CopilotView["ATHER Conversational Copilot"]
        DashboardView["WorkPulse Fleet Telemetry"]
    end

    subgraph StateLayer ["State & Context Management"]
        AuthCtx["AuthContext & DemoModeContext"]
        ArchStore["Zustand Architecture Store (Nodes, Edges, AST)"]
        AnalysisStore["16-State Analysis FSM Store"]
        QueryCache["TanStack Query Cache"]
    end

    subgraph ServiceLayer ["Service & Business Logic Layer"]
        ReqService["Requirement Intelligence Service"]
        KpiService["Business KPI Mapper Service"]
        HealthService["Code Health & Metrics Service"]
        SecService["Security Reviewer Service (CVE/CWE)"]
        RiskService["Delivery Risk Predictor Service"]
        PdfService["PDF Export & Reporting Service"]
    end

    subgraph DataLayer ["Data & Integration Layer"]
        SupabaseClient["Supabase JS Client SDK (v2)"]
        PostgREST["PostgREST API Engine"]
        StorageEngine["Supabase Storage Buckets"]
        PostgresDB[("PostgreSQL 15 (RLS Enforced)")]
        OfflineFixtures["5 Deterministic Offline Scenarios (JSON)"]
    end

    UI_Shell --> Routes
    Routes --> CanvasView
    Routes --> CopilotView
    Routes --> DashboardView

    CanvasView --> ArchStore
    CopilotView --> AuthCtx
    DashboardView --> AnalysisStore

    ArchStore --> ReqService
    ArchStore --> KpiService
    AnalysisStore --> HealthService
    AnalysisStore --> SecService
    AnalysisStore --> RiskService

    ReqService --> SupabaseClient
    KpiService --> SupabaseClient
    HealthService --> SupabaseClient
    SecService --> SupabaseClient
    RiskService --> SupabaseClient
    PdfService --> StorageEngine

    SupabaseClient --> PostgREST
    PostgREST --> PostgresDB
    AuthCtx -.->|Offline Fallback| OfflineFixtures
```

---

## 3. Data Flow & Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Engineer
    participant Shell as Brahma App Shell
    participant Router as TanStack Router
    participant Store as State Store (Zustand)
    participant Hook as Custom Hook (useProjects)
    participant SDK as Supabase SDK (lib/api.ts)
    participant DB as Postgres Database

    User->>Shell: Clicks "New Architecture Project"
    Shell->>Router: Navigate to /app/projects/new
    Router->>Hook: Initialize ProjectWizard (Check Auth & Draft)
    Hook->>Hook: Validate UUID via isValidUuid()
    alt Demo Mode Active
        Hook->>Store: Read draft from localStorage
        Store-->>Shell: Render Wizard with pre-populated draft
    else Authenticated Live Session
        Hook->>SDK: Query projects table (owner_id = eq.UUID)
        SDK->>DB: PostgREST SELECT * WHERE owner_id = $1
        DB-->>SDK: Return project rows
        SDK-->>Hook: Hydrate projects
        Hook-->>Shell: Render Wizard
    end
    User->>Shell: Updates Architecture Node on Canvas
    Shell->>Store: Dispatch updateNode()
    Store->>Store: Sync AST & Recalculate KPIs
    Store-->>User: Instant visual feedback (60 FPS)
```

---

## 4. Package Dependency Graph & Module Hierarchy

```mermaid
graph LR
    Core["@tanstack/react-router + @tanstack/start"] --> React["React 18 + React DOM"]
    UI["shadcn/ui + Tailwind CSS"] --> Lucide["lucide-react Icons"]
    Canvas["@xyflow/react"] --> ReactFlowStyles["@xyflow/react/dist/style.css"]
    Charts["recharts"] --> D3Scale["d3-scale / d3-shape"]
    Backend["@supabase/supabase-js"] --> PostgrestJS["@supabase/postgrest-js"]
    Backend --> GotrueJS["@supabase/gotrue-js (Auth)"]
    State["zustand"] --> Immer["immer (Immutable state)"]
```

---

## 5. Security & Isolation Boundaries

1. **Authentication Boundary**: All routes beneath `/app/*` and `/dashboard/*` are encapsulated by `<ProtectedRoute>` which checks the active session in `AuthContext`. Unauthenticated requests redirect to `/login?next=<path>`.
2. **Postgres RLS Boundary**: Every table in Supabase (`projects`, `profiles`, `analyses`, `findings`, `proposals`) enforces Row Level Security based on `auth.uid() = owner_id`.
3. **Demo Mode Boundary**: Demo users receive isolated mock state and are prevented from transmitting malformed queries (such as non-UUID identifiers) to Postgres.
4. **Secret Isolation Boundary**: All sensitive keys remain isolated on the server; client bundles contain zero private credentials.
