/**
 * MASTER BUILD PROMPT: 26 Letters × 20 Phases — Complete Software Development Lifecycle (520 Total Phases)
 * Canonical dataset and query utilities for the VYRON SDLC blueprint & Copilot reasoning engine.
 * Strictly ZERO SQL.
 */

export interface MasterBuildPhase {
  code: string; // e.g. "A.01"
  domainLetter: string; // "A"
  domainName: string; // "Architecture & System Design"
  title: string;
  instruction: string;
  category: string;
}

export interface MasterBuildDomain {
  letter: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  phaseCount: number;
  phases: MasterBuildPhase[];
}

export type PhaseStatus = "PENDING" | "IN_PROGRESS" | "VERIFIED" | "BLOCKED" | "NOT_APPLICABLE";

export interface ProjectPhaseRecord {
  code: string;
  status: PhaseStatus;
  updatedAt: string;
  notes?: string;
  verifiedBy?: string;
}

export const MASTER_BUILD_DOMAINS: MasterBuildDomain[] = [
  {
    "letter": "A",
    "name": "Architecture & System Design",
    "description": "Define the structural foundation before a single line of code is written.",
    "icon": "Layers",
    "color": "blue",
    "phaseCount": 20,
    "phases": [
      {
        "code": "A.01",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Define overall system architecture",
        "instruction": "Decide between monolith, microservices, or modular monolith and document the rationale.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.02",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Create a high-level architecture diagram",
        "instruction": "Show every service, database, and external integration and how they connect.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.03",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Plan component interaction and data flow",
        "instruction": "Define who owns which data and which service calls which.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.04",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Design the API gateway layer",
        "instruction": "Routing, auth enforcement, rate limiting, and load balancing entry point.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.05",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Define service boundaries and responsibilities",
        "instruction": "Ensure no two services own the same domain logic.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.06",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Plan the caching layer strategy",
        "instruction": "Determine where Redis, in-memory, or CDN caching applies across the stack.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.07",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Design event-driven architecture",
        "instruction": "Define events, producers, consumers, and the message broker of choice.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.08",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Plan file storage and CDN strategy",
        "instruction": "Structured vs. unstructured data, S3-compatible buckets, signed URLs.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.09",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Design load balancing approach",
        "instruction": "Layer 4 vs. Layer 7, session stickiness, health check configuration.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.10",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Define disaster recovery plan",
        "instruction": "RPO, RTO, failover regions, and backup verification strategy.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.11",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Plan horizontal and vertical scaling strategy",
        "instruction": "Autoscaling triggers, limits, and costs for each service.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.12",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Design multi-tenant architecture if applicable",
        "instruction": "Data isolation approach, tenant routing, shared vs. dedicated resources.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.13",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Define environment separation (dev / staging / prod)",
        "instruction": "Infrastructure parity, data policies per environment.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.14",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Plan third-party service integrations at architecture level",
        "instruction": "Identify all external dependencies and failure modes.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.15",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Create technical architecture documentation",
        "instruction": "ADRs (Architecture Decision Records) for every major choice.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.16",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Define data consistency and synchronization strategy",
        "instruction": "Eventual consistency zones, strong consistency requirements.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.17",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Plan infrastructure as code approach",
        "instruction": "Terraform, Pulumi, or CDK, with state management and module structure.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.18",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Design network topology",
        "instruction": "VPC layout, subnet segmentation (public/private/isolated), NAT gateways, peering.",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.19",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Define service discovery mechanism",
        "instruction": "DNS-based, sidecar proxy, or service mesh (Istio/Linkerd).",
        "category": "Architecture & System Design"
      },
      {
        "code": "A.20",
        "domainLetter": "A",
        "domainName": "Architecture & System Design",
        "title": "Architecture review and sign-off",
        "instruction": "Present to stakeholders, capture open questions, get written approval before build.",
        "category": "Architecture & System Design"
      }
    ]
  },
  {
    "letter": "B",
    "name": "Backend Development",
    "description": "Build the engine. Controllers, services, business logic — every layer that powers the product.",
    "icon": "Server",
    "color": "emerald",
    "phaseCount": 20,
    "phases": [
      {
        "code": "B.01",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Initialize backend project",
        "instruction": "Choose framework (Express/NestJS/FastAPI/Django), scaffold folder structure, install core dependencies.",
        "category": "Backend Development"
      },
      {
        "code": "B.02",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Set up project folder architecture",
        "instruction": "Controllers, services, repositories, DTOs, utils — enforce module pattern from day one.",
        "category": "Backend Development"
      },
      {
        "code": "B.03",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Configure environment variables and secrets management",
        "instruction": "Dotenv setup, startup validation, no hardcoded values anywhere.",
        "category": "Backend Development"
      },
      {
        "code": "B.04",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Build core application bootstrap and startup logic",
        "instruction": "Database connection, cache warm-up, graceful shutdown handlers.",
        "category": "Backend Development"
      },
      {
        "code": "B.05",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Implement request/response pipeline",
        "instruction": "Middleware chain ordering, logging context attachment, correlation ID injection.",
        "category": "Backend Development"
      },
      {
        "code": "B.06",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Create base controller and service layer pattern",
        "instruction": "Abstract classes, response wrappers, consistent HTTP status usage.",
        "category": "Backend Development"
      },
      {
        "code": "B.07",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Build CRUD operations for all core entities",
        "instruction": "List, read, create, update, delete with proper authorization checks.",
        "category": "Backend Development"
      },
      {
        "code": "B.08",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Implement business logic layer",
        "instruction": "Rules, calculations, state machines, and validations that are framework-agnostic.",
        "category": "Backend Development"
      },
      {
        "code": "B.09",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Set up dependency injection container",
        "instruction": "Wiring services, repositories, and adapters without manual instantiation.",
        "category": "Backend Development"
      },
      {
        "code": "B.10",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Create data transfer objects (DTOs) and mappers",
        "instruction": "Separate internal domain models from API contracts.",
        "category": "Backend Development"
      },
      {
        "code": "B.11",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Build file upload and processing handlers",
        "instruction": "Multipart parsing, size limits, type validation, storage integration.",
        "category": "Backend Development"
      },
      {
        "code": "B.12",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Implement rate limiting logic",
        "instruction": "Per-user, per-IP, and per-endpoint limits with configurable windows.",
        "category": "Backend Development"
      },
      {
        "code": "B.13",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Create health check and ping endpoints",
        "instruction": "Liveness, readiness, and deep dependency checks for orchestrators.",
        "category": "Backend Development"
      },
      {
        "code": "B.14",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Build admin-only backend routes",
        "instruction": "Protected by role, with audit logging on every write operation.",
        "category": "Backend Development"
      },
      {
        "code": "B.15",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Implement pagination and filtering helpers",
        "instruction": "Cursor-based and offset pagination, sort, search, and field-selection utilities.",
        "category": "Backend Development"
      },
      {
        "code": "B.16",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Set up background job runner integration",
        "instruction": "Connect queue adapter, define worker process, handle concurrency.",
        "category": "Backend Development"
      },
      {
        "code": "B.17",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Create event emitters and listeners",
        "instruction": "Internal domain events for decoupled side effects (email, audit, cache).",
        "category": "Backend Development"
      },
      {
        "code": "B.18",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Build webhook receiver and sender",
        "instruction": "Validate inbound signatures, dispatch outbound with retry and secret rotation.",
        "category": "Backend Development"
      },
      {
        "code": "B.19",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Implement data export handlers",
        "instruction": "CSV, PDF, and JSON export endpoints with streaming for large datasets.",
        "category": "Backend Development"
      },
      {
        "code": "B.20",
        "domainLetter": "B",
        "domainName": "Backend Development",
        "title": "Code review, refactor, and backend documentation",
        "instruction": "JSDoc/docstring coverage, README for each service, deprecation notes.",
        "category": "Backend Development"
      }
    ]
  },
  {
    "letter": "C",
    "name": "Components & UI Building",
    "description": "The atoms and molecules of the interface. Build once, reuse everywhere — documented and tested in isolation.",
    "icon": "LayoutGrid",
    "color": "pink",
    "phaseCount": 20,
    "phases": [
      {
        "code": "C.01",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Set up component library baseline",
        "instruction": "Folder structure, naming convention, export barrel files, and design token imports.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.02",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build reusable button component",
        "instruction": "Variants (primary/secondary/ghost/danger), sizes, loading state, disabled state.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.03",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build form input components",
        "instruction": "Text, email, password, number, select, multi-select, checkbox, radio, textarea with validation states.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.04",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build modal and dialog components",
        "instruction": "Focus trap, keyboard dismiss, backdrop click, animation enter/exit.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.05",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build navigation bar and sidebar",
        "instruction": "Responsive collapse, active state, nested menus, mobile drawer variant.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.06",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build table and data grid components",
        "instruction": "Sortable columns, row selection, bulk actions, column resizing, empty state.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.07",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build card and list item components",
        "instruction": "Configurable layout, action menu, status badge slot, responsive stacking.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.08",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build toast and notification components",
        "instruction": "Success/error/warning/info variants, queue management, auto-dismiss timer.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.09",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build loader and skeleton screen components",
        "instruction": "Page-level spinner, inline spinner, skeleton matching content shape.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.10",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build pagination component",
        "instruction": "Page buttons, previous/next, ellipsis for large ranges, items-per-page selector.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.11",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build breadcrumb and tab components",
        "instruction": "Dynamic breadcrumb from route, scrollable tabs, tab panels with lazy render.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.12",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build file upload dropzone",
        "instruction": "Drag-and-drop, click-to-browse, progress bar, file preview, remove button.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.13",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build search and filter bar",
        "instruction": "Debounced input, active filter chips, clear-all, filter drawer on mobile.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.14",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build chart and graph wrapper components",
        "instruction": "Bar, line, pie, donut using a charting library, with loading and empty states.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.15",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build avatar and profile components",
        "instruction": "Image with fallback initials, size variants, group stack, online indicator.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.16",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build empty state and error state components",
        "instruction": "Illustration slot, headline, sub-copy, primary action CTA.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.17",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build responsive layout grid",
        "instruction": "Fixed sidebar + main, full-width, two-column, three-column with gutter control.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.18",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build date picker and calendar component",
        "instruction": "Single date, range, time picker, locale support, keyboard navigation.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.19",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Build tooltip and popover",
        "instruction": "Positioning engine, arrow, delay, click vs. hover trigger, portal rendering.",
        "category": "Components & UI Building"
      },
      {
        "code": "C.20",
        "domainLetter": "C",
        "domainName": "Components & UI Building",
        "title": "Component documentation and Storybook setup",
        "instruction": "Story for every variant, args table, a11y addon, chromatic integration.",
        "category": "Components & UI Building"
      }
    ]
  },
  {
    "letter": "D",
    "name": "Database Design & Management",
    "description": "The source of truth. Design schemas that scale, migrate cleanly, and never lose data.",
    "icon": "Database",
    "color": "amber",
    "phaseCount": 20,
    "phases": [
      {
        "code": "D.01",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Choose database engine",
        "instruction": "PostgreSQL, MySQL, MongoDB, or hybrid — and document the rationale per use case.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.02",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Design entity-relationship (ER) diagram",
        "instruction": "All tables/collections, relationships, cardinalities, and foreign keys.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.03",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Define all table schemas and data types",
        "instruction": "Column names, types, nullability, defaults, and constraints.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.04",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Create initial database migration files",
        "instruction": "Version-controlled, idempotent, and reversible down migrations.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.05",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Set up database connection pooling",
        "instruction": "Pool size, timeout, idle eviction, and overflow handling configuration.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.06",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Implement ORM/ODM configuration",
        "instruction": "Model definitions, relations, lifecycle hooks, and query logging in dev.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.07",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Create seed data for development",
        "instruction": "Realistic fake data with referential integrity, using a repeatable seed script.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.08",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Build database backup strategy",
        "instruction": "Automated daily snapshots, point-in-time recovery, off-site storage, and restore tests.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.09",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Set up read replica for performance",
        "instruction": "Separate read and write connections, replica lag monitoring and alerting.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.10",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Implement soft delete pattern",
        "instruction": "deleted_at timestamp, row filter at ORM level, archive queries for admin.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.11",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Design indexing strategy",
        "instruction": "Composite indexes per query pattern, covering indexes, partial indexes, avoid over-indexing.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.12",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Set up audit trail tables",
        "instruction": "Who changed what and when, with before/after snapshots for all critical entities.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.13",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Create stored procedures or database functions where needed",
        "instruction": "Complex aggregations or constraints enforced at DB level.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.14",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Implement full-text search configuration",
        "instruction": "tsvector columns, GIN indexes, or Elasticsearch sync pipeline.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.15",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Set up database monitoring",
        "instruction": "Slow query log threshold, long-running transaction alerts, connection count dashboards.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.16",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Design multi-tenancy data isolation",
        "instruction": "Row-level security (RLS), separate schemas, or separate databases per tenant.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.17",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Implement data archiving strategy",
        "instruction": "Move old records to cold storage, partition by date for time-series data.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.18",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Create database rollback procedures",
        "instruction": "Tested rollback scripts for every migration, runbook for emergency rollback.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.19",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Set up database migration CI",
        "instruction": "Migrations run automatically in CI, validated against staging before prod deploy.",
        "category": "Database Design & Management"
      },
      {
        "code": "D.20",
        "domainLetter": "D",
        "domainName": "Database Design & Management",
        "title": "Database performance testing",
        "instruction": "EXPLAIN ANALYZE on all hot queries, index tuning, and load test with realistic data volume.",
        "category": "Database Design & Management"
      }
    ]
  },
  {
    "letter": "E",
    "name": "Endpoints & API Design",
    "description": "The contract between systems. Design APIs that are predictable, versioned, and a joy to consume.",
    "icon": "Network",
    "color": "lime",
    "phaseCount": 20,
    "phases": [
      {
        "code": "E.01",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Define RESTful API naming conventions",
        "instruction": "Noun-based URLs, plural resources, consistent casing and nesting rules.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.02",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Design API versioning strategy",
        "instruction": "URL path versioning (/v1/), header versioning, or content negotiation.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.03",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Write OpenAPI / Swagger specification",
        "instruction": "Full schema definitions for every request body, response, and query param.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.04",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build user-related endpoints",
        "instruction": "GET/POST/PATCH/DELETE /users with proper role-gated access.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.05",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build authentication endpoints",
        "instruction": "POST /auth/login, /auth/logout, /auth/refresh, /auth/verify-email.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.06",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build resource/entity endpoints per feature",
        "instruction": "Full CRUD per domain entity, nested resources where logical.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.07",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Implement search and filter endpoints",
        "instruction": "GET with query params for search, filter, sort, and field projection.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.08",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build file upload and download endpoints",
        "instruction": "Multipart upload, signed URL generation, streaming download.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.09",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Create admin-only endpoints",
        "instruction": "Prefixed at /admin/, protected by admin role, with action logging on every call.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.10",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Implement inbound webhook endpoints",
        "instruction": "POST /webhooks/{source}, signature verification, idempotency key check.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.11",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build bulk operation endpoints",
        "instruction": "POST /bulk-create, /bulk-update with transaction wrapping and partial failure reporting.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.12",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Implement export endpoints",
        "instruction": "GET /export?format=csv|pdf with async job dispatch for large datasets.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.13",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Create status and health check endpoints",
        "instruction": "GET /health (liveness), /health/ready (readiness), /health/deep.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.14",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build notification preference endpoints",
        "instruction": "GET/PATCH /me/notification-preferences per channel and event type.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.15",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Implement analytics and reporting endpoints",
        "instruction": "Aggregated data endpoints with date-range, groupBy, and metric params.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.16",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Build payment and billing endpoints",
        "instruction": "Create checkout session, manage subscriptions, retrieve invoices.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.17",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Set up API documentation auto-generation",
        "instruction": "Swagger UI or Redoc hosted at /docs, synced with OpenAPI spec.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.18",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Implement API key management endpoints",
        "instruction": "Issue, list, revoke, and rotate API keys per user or organization.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.19",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "Create public vs. private API boundary",
        "instruction": "Define which endpoints are public, which require auth, which require scopes.",
        "category": "Endpoints & API Design"
      },
      {
        "code": "E.20",
        "domainLetter": "E",
        "domainName": "Endpoints & API Design",
        "title": "API endpoint testing and contract validation",
        "instruction": "Postman/Newman collection runs in CI, schema validation on every response.",
        "category": "Endpoints & API Design"
      }
    ]
  },
  {
    "letter": "F",
    "name": "Frontend Development",
    "description": "Everything the user sees and touches. Pages, state, routing, API integration — the experience that defines the product.",
    "icon": "Monitor",
    "color": "cyan",
    "phaseCount": 20,
    "phases": [
      {
        "code": "F.01",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Initialize frontend project",
        "instruction": "Scaffold with Vite/CRA/Next.js, configure TypeScript, ESLint, Prettier, and path aliases.",
        "category": "Frontend Development"
      },
      {
        "code": "F.02",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Set up folder structure and routing conventions",
        "instruction": "Pages, components, hooks, services, store, types clearly separated.",
        "category": "Frontend Development"
      },
      {
        "code": "F.03",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Configure global state management",
        "instruction": "Redux Toolkit, Zustand, or React Context with clear domain slices.",
        "category": "Frontend Development"
      },
      {
        "code": "F.04",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Set up API client/service layer",
        "instruction": "Axios/fetch wrapper with interceptors for auth tokens, error handling, and retry.",
        "category": "Frontend Development"
      },
      {
        "code": "F.05",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build authentication pages",
        "instruction": "Login, register, forgot password, reset password, email verification landing.",
        "category": "Frontend Development"
      },
      {
        "code": "F.06",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build dashboard home page",
        "instruction": "Summary widgets, recent activity feed, quick-action shortcuts, live data updates.",
        "category": "Frontend Development"
      },
      {
        "code": "F.07",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build user profile and settings pages",
        "instruction": "Personal info, password change, avatar upload, notification preferences.",
        "category": "Frontend Development"
      },
      {
        "code": "F.08",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build main feature pages",
        "instruction": "Resource list with filters, detail/view page, create/edit form, delete confirmation.",
        "category": "Frontend Development"
      },
      {
        "code": "F.09",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build admin panel pages",
        "instruction": "User management, role assignment, feature flags, audit log viewer, system settings.",
        "category": "Frontend Development"
      },
      {
        "code": "F.10",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Implement client-side form validation",
        "instruction": "Real-time field validation, schema-driven (Zod/Yup), accessible error messages.",
        "category": "Frontend Development"
      },
      {
        "code": "F.11",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Set up global error boundary and 404 page",
        "instruction": "Catch unhandled React errors, show graceful fallback, report to Sentry.",
        "category": "Frontend Development"
      },
      {
        "code": "F.12",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Implement responsive design",
        "instruction": "All pages tested at 320px, 768px, 1024px, 1440px with fluid layouts.",
        "category": "Frontend Development"
      },
      {
        "code": "F.13",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Set up internationalization (i18n)",
        "instruction": "react-i18next or next-intl, translation file structure, locale detection.",
        "category": "Frontend Development"
      },
      {
        "code": "F.14",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build onboarding flow",
        "instruction": "Multi-step wizard with progress indicator, skip option, and completion tracking.",
        "category": "Frontend Development"
      },
      {
        "code": "F.15",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Implement infinite scroll or pagination on list pages",
        "instruction": "React Query / SWR with cursor-based loading, scroll restoration.",
        "category": "Frontend Development"
      },
      {
        "code": "F.16",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Build search results and filter pages",
        "instruction": "URL-synced filters, faceted search, highlighted match terms.",
        "category": "Frontend Development"
      },
      {
        "code": "F.17",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Set up analytics tracking",
        "instruction": "Pageview events, custom user action events, funnel tracking with GA4/Mixpanel.",
        "category": "Frontend Development"
      },
      {
        "code": "F.18",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Implement dark mode / theme toggle",
        "instruction": "CSS variables, system preference detection, persisted user preference.",
        "category": "Frontend Development"
      },
      {
        "code": "F.19",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Optimize bundle size",
        "instruction": "Route-based code splitting, dynamic imports, tree shaking audit, bundle analyzer run.",
        "category": "Frontend Development"
      },
      {
        "code": "F.20",
        "domainLetter": "F",
        "domainName": "Frontend Development",
        "title": "Frontend accessibility (a11y) audit",
        "instruction": "axe-core scan, keyboard nav on all flows, ARIA labels, color contrast pass.",
        "category": "Frontend Development"
      }
    ]
  },
  {
    "letter": "G",
    "name": "Git & Version Control",
    "description": "The discipline that keeps teams from stepping on each other. Branching rules, commit hygiene, automated repo management.",
    "icon": "GitBranch",
    "color": "purple",
    "phaseCount": 20,
    "phases": [
      {
        "code": "G.01",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Initialize repository and set default branch",
        "instruction": "Create repo, set main as default, push initial commit with README and LICENSE.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.02",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Define branching strategy",
        "instruction": "Git Flow, trunk-based, or GitHub Flow with clear rules for feature, fix, and release branches.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.03",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up .gitignore and .gitattributes",
        "instruction": "Cover all languages, IDEs, OS files, and enforce LF line endings.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.04",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Create initial commit with project scaffolding",
        "instruction": "Lock files included, no secrets, no generated build artifacts.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.05",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Configure branch protection rules",
        "instruction": "Require PR reviews, passing CI, no force-push on main and staging.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.06",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up pull request / merge request templates",
        "instruction": "Checklist for tests, docs, breaking changes, and screenshots.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.07",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Define commit message convention",
        "instruction": "Conventional Commits spec (feat/fix/chore/docs) enforced via commitlint.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.08",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up code owners file",
        "instruction": "CODEOWNERS maps critical directories to required reviewers.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.09",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Create changelog and versioning strategy",
        "instruction": "semantic-release or standard-version auto-generates CHANGELOG.md from commits.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.10",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up Git hooks",
        "instruction": "pre-commit (lint-staged), pre-push (test run), commit-msg (commitlint) via Husky.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.11",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Configure automated branch cleanup",
        "instruction": "Delete merged branches automatically, stale branch alerts after 30 days.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.12",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up dependency update automation",
        "instruction": "Dependabot or Renovate with auto-merge for patch updates and security fixes.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.13",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Define release tagging strategy",
        "instruction": "SemVer tags (v1.2.3), signed tags for production, GitHub Releases with release notes.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.14",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up monorepo configuration if applicable",
        "instruction": "Turborepo or Nx with shared packages, caching, and task pipelines.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.15",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Create contribution guidelines",
        "instruction": "CONTRIBUTING.md with setup instructions, coding standards, and PR process.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.16",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up code review checklist",
        "instruction": "Required checks: logic, tests, security, performance, a11y, docs.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.17",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Configure merge queue or auto-merge rules",
        "instruction": "Merge only after CI passes, no conflicts, required approvals received.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.18",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Set up stale branch and PR notifications",
        "instruction": "Automated comments and Slack alerts for PRs idle more than 7 days.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.19",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Create Git alias and developer tooling documentation",
        "instruction": "Onboarding checklist for new engineers to get up to speed fast.",
        "category": "Git & Version Control"
      },
      {
        "code": "G.20",
        "domainLetter": "G",
        "domainName": "Git & Version Control",
        "title": "Audit repository permissions and access control",
        "instruction": "Least-privilege roles for all collaborators, rotate deploy keys.",
        "category": "Git & Version Control"
      }
    ]
  },
  {
    "letter": "H",
    "name": "Hosting & Infrastructure",
    "description": "Where the code lives and breathes. Cloud, servers, DNS, SSL, and auto-scaling — the platform that keeps the product alive.",
    "icon": "Cloud",
    "color": "rose",
    "phaseCount": 20,
    "phases": [
      {
        "code": "H.01",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Choose cloud provider",
        "instruction": "AWS, GCP, or Azure based on cost, compliance, team familiarity, and service requirements.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.02",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up cloud account and IAM roles",
        "instruction": "Root account hardened, MFA enforced, least-privilege service accounts created.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.03",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Provision virtual machines or container clusters",
        "instruction": "ECS/EKS/GKE configured with node pools and resource limits.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.04",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure managed database service",
        "instruction": "RDS/Cloud SQL with automated backups, encryption at rest, and private access.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.05",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up object storage",
        "instruction": "S3/GCS buckets with versioning, lifecycle policies, and public-access blocked by default.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.06",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure CDN for static assets",
        "instruction": "CloudFront/Cloudflare with cache rules, origin shield, and custom domain.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.07",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up DNS and domain management",
        "instruction": "A records, CNAMEs, MX records, TTL configuration via Route53/Cloudflare.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.08",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure SSL/TLS certificates",
        "instruction": "ACM/Let's Encrypt auto-renewal, certificate pinning for mobile if applicable.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.09",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up load balancer",
        "instruction": "ALB/NLB with target groups, sticky sessions where required, and access log shipping.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.10",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure auto-scaling groups",
        "instruction": "Scale-out and scale-in policies based on CPU, memory, and request rate metrics.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.11",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up VPC and subnet configuration",
        "instruction": "Public, private, and isolated subnets across multiple availability zones.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.12",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure firewall and security groups",
        "instruction": "Deny-all default, allow only required ports, separate rules per tier.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.13",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up managed cache service",
        "instruction": "ElastiCache Redis in cluster mode with replication, TLS, and auth token.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.14",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure managed queue service",
        "instruction": "SQS/Cloud Pub-Sub with dead-letter queues, visibility timeout, and message retention.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.15",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up serverless functions if applicable",
        "instruction": "Lambda/Cloud Functions with VPC access, concurrency limits, cold start mitigation.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.16",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Configure infrastructure monitoring dashboards",
        "instruction": "CloudWatch/Cloud Monitoring with custom metrics for all services.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.17",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up cost alerts and budget controls",
        "instruction": "Daily/monthly cost thresholds with email and Slack alerts before breach.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.18",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Implement backup and snapshot policies",
        "instruction": "Automated nightly snapshots, weekly cross-region copy, monthly restore drill.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.19",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Set up multi-AZ or multi-region failover",
        "instruction": "Active-passive or active-active with automated failover and DNS health checks.",
        "category": "Hosting & Infrastructure"
      },
      {
        "code": "H.20",
        "domainLetter": "H",
        "domainName": "Hosting & Infrastructure",
        "title": "Infrastructure security audit and hardening",
        "instruction": "CIS benchmark scan, unused resource cleanup, access log review.",
        "category": "Hosting & Infrastructure"
      }
    ]
  },
  {
    "letter": "I",
    "name": "Integration & Third-party Services",
    "description": "No product is an island. Every external dependency wired in, tested, and handled gracefully when it fails.",
    "icon": "Plug",
    "color": "indigo",
    "phaseCount": 20,
    "phases": [
      {
        "code": "I.01",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Identify all third-party services needed",
        "instruction": "Map each to a category (auth/email/payment/analytics) and assess vendor lock-in risk.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.02",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up OAuth provider integrations",
        "instruction": "Google, GitHub, Apple Sign-In with scope definition and token exchange flows.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.03",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate payment gateway",
        "instruction": "Stripe/Razorpay SDK, configure webhooks, set up test and live mode keys.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.04",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate email service provider",
        "instruction": "SendGrid/SES/Mailgun with domain authentication (SPF/DKIM/DMARC) verified.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.05",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate SMS provider",
        "instruction": "Twilio/AWS SNS with number provisioning, opt-out handling, and delivery receipt tracking.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.06",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate push notification service",
        "instruction": "FCM for Android, APNs for iOS, with device token registration and topic management.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.07",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up analytics integration",
        "instruction": "GA4/Mixpanel/PostHog with event schema documentation and identity stitching.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.08",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate error tracking service",
        "instruction": "Sentry with release tracking, environment tagging, and user context attachment.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.09",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate feature flag service",
        "instruction": "LaunchDarkly/Unleash with user targeting, kill-switch flags, and rollout percentages.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.10",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up customer support integration",
        "instruction": "Intercom/Zendesk widget with user identity verification and conversation context.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.11",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate calendar/scheduling service",
        "instruction": "Google Calendar API or Calendly for booking flows with availability sync.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.12",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up cloud storage integration",
        "instruction": "S3/Google Drive/Dropbox picker, upload progress, and shared link generation.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.13",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate maps/geolocation service",
        "instruction": "Google Maps/Mapbox for address autocomplete, geocoding, and map display.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.14",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up CRM integration",
        "instruction": "HubSpot/Salesforce contact sync with field mapping, deduplication, and bi-directional updates.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.15",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate AI/ML service",
        "instruction": "OpenAI/Anthropic Claude API with prompt management, streaming, token budgeting, and fallback.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.16",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up webhook management service",
        "instruction": "ngrok for dev, production webhook routing with retry UI and delivery logs.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.17",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate video/conferencing service",
        "instruction": "Twilio Video/Daily.co/Zoom API with room creation, token generation, recording.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.18",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Set up e-signature integration",
        "instruction": "DocuSign/HelloSign with envelope creation, status webhooks, and PDF retrieval.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.19",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Integrate accounting service",
        "instruction": "QuickBooks/Xero/Zoho Books with invoice sync, payment recording, and account mapping.",
        "category": "Integration & Third-party Services"
      },
      {
        "code": "I.20",
        "domainLetter": "I",
        "domainName": "Integration & Third-party Services",
        "title": "Third-party integration testing and fallback handling",
        "instruction": "Mock all external calls in tests, circuit breaker for each integration.",
        "category": "Integration & Third-party Services"
      }
    ]
  },
  {
    "letter": "J",
    "name": "Jobs & Background Processing",
    "description": "Work that happens outside the request cycle — email sending, report generation, scheduled cleanups — queued and monitored.",
    "icon": "Clock",
    "color": "teal",
    "phaseCount": 20,
    "phases": [
      {
        "code": "J.01",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Set up background job framework",
        "instruction": "Bull/BullMQ (Node), Celery (Python), Sidekiq (Ruby) with Redis as broker.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.02",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Define job queues and priorities",
        "instruction": "High (transactional email), medium (reports), low (cleanup) with separate workers.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.03",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build email sending job",
        "instruction": "Template resolution, recipient list, attachment handling, delivery status tracking.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.04",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build notification dispatch job",
        "instruction": "Fan-out to all channels (push/SMS/in-app) with per-channel preference checks.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.05",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build report generation job",
        "instruction": "Query aggregation, chart rendering, PDF/XLSX packaging, and delivery to requester.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.06",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build data export job",
        "instruction": "Stream large datasets to CSV/JSON, upload to storage, send download link via email.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.07",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build scheduled cleanup job",
        "instruction": "Purge expired tokens, soft-deleted records past retention period, orphaned uploads.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.08",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build scheduled report delivery job",
        "instruction": "Cron-based weekly/monthly report generation and email dispatch per subscription.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.09",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build bulk import processing job",
        "instruction": "Parse CSV/XLSX, validate rows, insert in batches, report errors per row.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.10",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build image processing job",
        "instruction": "Resize to thumbnails, convert to WebP, strip EXIF metadata, upload variants to storage.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.11",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build webhook retry job",
        "instruction": "Exponential backoff (1s/5s/30s/5m), max 5 attempts, dead-letter after final failure.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.12",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build data sync job",
        "instruction": "Bi-directional sync with third-party CRM/accounting service on a scheduled interval.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.13",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build subscription renewal and billing job",
        "instruction": "Process upcoming renewals, charge cards, send receipts, handle failures.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.14",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build cache invalidation job",
        "instruction": "Selectively bust cache keys when underlying data changes via event-driven triggers.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.15",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build search index update job",
        "instruction": "Sync database changes to Elasticsearch/Typesense/Algolia with delta updates.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.16",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build audit log archiving job",
        "instruction": "Move logs older than 90 days from hot DB to S3 cold storage in compressed JSON.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.17",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Set up dead letter queue and failed job handling",
        "instruction": "Persist failed jobs, admin UI to inspect, requeue, or discard.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.18",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Build job monitoring and alerting",
        "instruction": "Dashboard for queue depth, processing rate, failure rate, and average latency.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.19",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Implement job concurrency and throttling",
        "instruction": "Max workers per queue, rate limits per external API, backpressure handling.",
        "category": "Jobs & Background Processing"
      },
      {
        "code": "J.20",
        "domainLetter": "J",
        "domainName": "Jobs & Background Processing",
        "title": "Job performance and stress testing",
        "instruction": "Flood queues with synthetic jobs, measure throughput, identify bottlenecks.",
        "category": "Jobs & Background Processing"
      }
    ]
  },
  {
    "letter": "K",
    "name": "Keys & Configuration Management",
    "description": "Secrets, credentials, environment configs — managed, rotated, audited, and never hardcoded. The layer that keeps you safe.",
    "icon": "Key",
    "color": "amber",
    "phaseCount": 20,
    "phases": [
      {
        "code": "K.01",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Define all required environment variables",
        "instruction": "Catalogue every key, its purpose, its format, and which services consume it.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.02",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Set up secrets manager",
        "instruction": "AWS Secrets Manager, HashiCorp Vault, or GCP Secret Manager with fine-grained access.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.03",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Create .env.example with all keys documented",
        "instruction": "No real values, descriptive comments, defaults where safe.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.04",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Configure environment-specific config files",
        "instruction": "Separate dev/staging/prod overrides with validation on startup.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.05",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Set up API key generation and rotation strategy",
        "instruction": "Cryptographically random keys, expiry policy, rotation runbook.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.06",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Implement database credential rotation",
        "instruction": "Automated rotation via Secrets Manager with zero-downtime connection re-use.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.07",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Configure JWT secret management",
        "instruction": "RS256 key pair, scheduled rotation, public key endpoint for verification.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.08",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Set up encryption keys for sensitive data at rest",
        "instruction": "AES-256 keys in KMS, envelope encryption pattern per field.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.09",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Manage third-party API keys and OAuth credentials",
        "instruction": "Per-service storage, never in code or logs, alert on expiry.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.10",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Implement config validation on startup",
        "instruction": "Fail fast if required env variables are missing or malformed before app boots.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.11",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Set up feature flag configuration store",
        "instruction": "LaunchDarkly/Unleash or database-backed flags with admin UI toggle.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.12",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Configure runtime config for frontend",
        "instruction": "VITE_/NEXT_PUBLIC_ prefix conventions, injected at build or runtime.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.13",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Manage TLS certificates and PKI keys",
        "instruction": "Stored in secrets manager, auto-renewed, expiry monitoring in place.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.14",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Set up SSH key management for servers",
        "instruction": "Per-engineer keys, no shared keys, rotation on personnel change.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.15",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Implement audit trail for config changes",
        "instruction": "Log every read and write of secrets with actor, timestamp, and key name.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.16",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Document all configuration dependencies",
        "instruction": "Which app consumes which key, which IAM role grants access to each secret.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.17",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Set up config drift detection",
        "instruction": "Alert when a deployed service's config diverges from expected values in secrets manager.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.18",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Create emergency key revocation procedure",
        "instruction": "Documented runbook to revoke and re-issue any credential within 15 minutes.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.19",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Implement config versioning",
        "instruction": "Version-pin configs per deployment, roll back config independently of code.",
        "category": "Keys & Configuration Management"
      },
      {
        "code": "K.20",
        "domainLetter": "K",
        "domainName": "Keys & Configuration Management",
        "title": "Config security review",
        "instruction": "Third-party audit of secrets hygiene, scanning for exposed keys in logs, code, and storage.",
        "category": "Keys & Configuration Management"
      }
    ]
  },
  {
    "letter": "L",
    "name": "Logging & Monitoring",
    "description": "You cannot fix what you cannot see. Structured logs, metrics, traces, and alerts that tell you the system's truth.",
    "icon": "Activity",
    "color": "blue",
    "phaseCount": 20,
    "phases": [
      {
        "code": "L.01",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up structured logging framework",
        "instruction": "Winston/Pino (Node) or structlog (Python) with JSON output in production.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.02",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Define log levels and format standards",
        "instruction": "ERROR/WARN/INFO/DEBUG with mandatory fields: timestamp, level, service, traceId.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.03",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Configure centralized log aggregation",
        "instruction": "ELK Stack, CloudWatch Logs, or Datadog Log Management with retention policies.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.04",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up application performance monitoring",
        "instruction": "Datadog APM or New Relic with auto-instrumentation for latency and throughput.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.05",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Configure error tracking",
        "instruction": "Sentry with source maps, release tracking, and email/Slack alerts on new issues.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.06",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up uptime monitoring",
        "instruction": "Pingdom/BetterUptime/Checkly pinging all public endpoints every 60 seconds with SMS escalation.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.07",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Build custom metrics dashboards",
        "instruction": "Grafana/Datadog boards for request rate, error rate, latency p95/p99, queue depth.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.08",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up infrastructure-level monitoring",
        "instruction": "CPU, memory, disk, network I/O, and swap usage per node with alert thresholds.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.09",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Configure database query performance logging",
        "instruction": "Slow query threshold, explain plan capture for queries over 100ms.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.10",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Implement distributed tracing",
        "instruction": "OpenTelemetry spans across services with correlation IDs propagated through headers.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.11",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up alert rules",
        "instruction": "Error rate >1%, p99 latency >2s, queue depth >1000, disk >80% — routed to on-call via PagerDuty.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.12",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Configure on-call escalation policies",
        "instruction": "Primary/secondary rotation, escalation after 5 minutes with no acknowledge.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.13",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Build audit log viewer in admin panel",
        "instruction": "Searchable by user, action type, resource, and date range with CSV export.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.14",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up log retention and archiving policy",
        "instruction": "Hot 30 days, warm 90 days, cold S3 archive 1 year, auto-delete after 2 years.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.15",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Implement security event logging",
        "instruction": "Failed logins, permission denials, config changes, and suspicious request patterns.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.16",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Configure network traffic monitoring",
        "instruction": "VPC flow logs, WAF request logs, DDoS detection baseline.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.17",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Set up synthetic monitoring",
        "instruction": "Playwright/Checkly scripts running the top 5 user journeys every 5 minutes from 3 regions.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.18",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Build SLA dashboard and reporting",
        "instruction": "Uptime percentage, MTTD, MTTR, incident count tracked monthly.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.19",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Implement anomaly detection",
        "instruction": "ML-based baseline for traffic and error rates, alert on statistical deviations.",
        "category": "Logging & Monitoring"
      },
      {
        "code": "L.20",
        "domainLetter": "L",
        "domainName": "Logging & Monitoring",
        "title": "Logging compliance review",
        "instruction": "Verify no PII in logs, GDPR/HIPAA data residency for log storage confirmed and documented.",
        "category": "Logging & Monitoring"
      }
    ]
  },
  {
    "letter": "M",
    "name": "Middleware & Request Handling",
    "description": "The pipeline every request passes through. Authentication, validation, rate limiting — enforced once, applied everywhere.",
    "icon": "GitFork",
    "color": "amber",
    "phaseCount": 20,
    "phases": [
      {
        "code": "M.01",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build global request logging middleware",
        "instruction": "Log method, path, status, duration, and correlation ID on every request.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.02",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement CORS configuration middleware",
        "instruction": "Allowed origins per environment, preflight caching, credentials handling.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.03",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build authentication guard middleware",
        "instruction": "Verify JWT/session on protected routes, attach user context to request object.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.04",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement authorization middleware",
        "instruction": "Role-based access checks per route, resource-level ownership verification.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.05",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build request validation middleware",
        "instruction": "Validate body, query params, and path params against schema before reaching controller.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.06",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement rate limiting middleware",
        "instruction": "Sliding window counter in Redis, per-user and per-IP limits with 429 response.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.07",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build request sanitization middleware",
        "instruction": "Strip XSS patterns, escape SQL special chars, normalize Unicode input.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.08",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement compression middleware",
        "instruction": "Brotli/gzip on response body for content above 1KB, exclude already-compressed types.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.09",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build API versioning middleware",
        "instruction": "Parse version from URL or Accept header, route to correct handler version.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.10",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement IP whitelisting/blacklisting middleware",
        "instruction": "Configurable allow/deny lists loaded from database or config service.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.11",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build request timeout middleware",
        "instruction": "Abort requests exceeding 30 seconds, return 504 with trace ID for debugging.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.12",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement idempotency key middleware",
        "instruction": "Cache POST responses by Idempotency-Key header for 24 hours, replay on retry.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.13",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build file upload middleware",
        "instruction": "Busboy/multer integration, size limit enforcement, MIME type validation pre-processing.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.14",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement cache-control headers middleware",
        "instruction": "Set Cache-Control, ETag, and Last-Modified headers per route type.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.15",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build error formatting middleware",
        "instruction": "Catch all thrown errors, normalize to standard {code, message, details} JSON format.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.16",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement localization middleware",
        "instruction": "Detect Accept-Language header, set locale context, fall back to default language.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.17",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build webhook signature verification middleware",
        "instruction": "HMAC-SHA256 signature check with timing-safe comparison.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.18",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Implement feature flag evaluation middleware",
        "instruction": "Resolve flags for the current user and attach to request context.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.19",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Build request metering middleware",
        "instruction": "Count and log API usage per user/org for billing and quota enforcement.",
        "category": "Middleware & Request Handling"
      },
      {
        "code": "M.20",
        "domainLetter": "M",
        "domainName": "Middleware & Request Handling",
        "title": "Middleware unit and integration testing",
        "instruction": "Each middleware tested in isolation and in the full chain order.",
        "category": "Middleware & Request Handling"
      }
    ]
  },
  {
    "letter": "N",
    "name": "Notifications & Communication",
    "description": "How the product speaks to its users. In-app, email, SMS, push — delivered reliably, respected by preferences.",
    "icon": "Bell",
    "color": "emerald",
    "phaseCount": 20,
    "phases": [
      {
        "code": "N.01",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Design notification system architecture",
        "instruction": "Event-driven dispatch, preference layer, channel adapters, delivery tracking.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.02",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build in-app notification creation logic",
        "instruction": "Trigger conditions, severity levels, recipient resolution, and read/unread tracking.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.03",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build email notification templates",
        "instruction": "HTML (responsive, dark mode) plus plain text fallback, branded header and footer.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.04",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement transactional email sending service",
        "instruction": "Queue-backed, with retry, bounce handling, and open/click tracking.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.05",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build SMS notification sending service",
        "instruction": "OTP, alerts, and reminders with opt-out STOP handling and delivery receipts.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.06",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement push notification sending service",
        "instruction": "Device token management, topic subscriptions, rich notification payloads.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.07",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build notification preference management",
        "instruction": "Per-user settings for channel (email/SMS/push) and event type.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.08",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement delivery status tracking",
        "instruction": "Sent/delivered/failed/opened states stored per notification, queryable in admin.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.09",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build notification center UI",
        "instruction": "Bell icon with unread badge, dropdown list, mark-as-read, mark-all-read, link to source.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.10",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement real-time notification delivery",
        "instruction": "WebSocket push to active sessions for instant in-app alerts without polling.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.11",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build digest notification system",
        "instruction": "Batch multiple events into a single daily/weekly summary email per user preference.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.12",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement notification grouping and batching",
        "instruction": "Group same-type events (5 comments) into one notification to avoid flood.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.13",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build admin broadcast notification tool",
        "instruction": "Send announcement to all users or segments with preview and schedule.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.14",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement notification unsubscribe/opt-out",
        "instruction": "One-click unsubscribe links, GDPR-compliant opt-out with confirmation.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.15",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build notification audit log",
        "instruction": "Full history of every notification sent, to whom, via which channel, and outcome.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.16",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Set up notification failure and retry handling",
        "instruction": "Failed sends retry 3 times with backoff, dead-letter for manual review.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.17",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement multi-language notification templates",
        "instruction": "Locale-resolved template selection with fallback to default language.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.18",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Build notification analytics",
        "instruction": "Delivery rate, open rate, click-through rate, and opt-out rate per notification type.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.19",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Implement deep link support in push notifications",
        "instruction": "Direct the user to the exact in-app screen from the notification tap.",
        "category": "Notifications & Communication"
      },
      {
        "code": "N.20",
        "domainLetter": "N",
        "domainName": "Notifications & Communication",
        "title": "Notification system load testing and deliverability audit",
        "instruction": "SPF/DKIM/DMARC check, inbox placement test, queue stress test.",
        "category": "Notifications & Communication"
      }
    ]
  },
  {
    "letter": "O",
    "name": "Optimization & Performance",
    "description": "Fast is a feature. Measure first, optimize with evidence — caching, bundling, indexing, and lazy loading for every user.",
    "icon": "Gauge",
    "color": "red",
    "phaseCount": 20,
    "phases": [
      {
        "code": "O.01",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Establish performance baseline",
        "instruction": "Run Lighthouse, WebPageTest, and k6 to record starting metrics before any optimization.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.02",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement frontend asset minification and bundling",
        "instruction": "CSS/JS minified, tree-shaken, and hashed for cache busting.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.03",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Set up image optimization pipeline",
        "instruction": "WebP/AVIF conversion, responsive srcset, lazy loading, blur placeholder.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.04",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Configure HTTP/2 and Brotli compression",
        "instruction": "Server push for critical assets, Brotli over gzip for better compression ratios.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.05",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement Redis caching for hot data",
        "instruction": "Cache user sessions, permission sets, and frequently queried aggregations.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.06",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Set up database query caching layer",
        "instruction": "Cache repeated read queries with TTL invalidation tied to mutation events.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.07",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Optimize database indexes",
        "instruction": "EXPLAIN ANALYZE every query over 50ms, add composite indexes, remove unused ones.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.08",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement API response pagination and field selection",
        "instruction": "Never return full records when a list view needs only 3 fields.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.09",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Set up CDN caching for static and semi-dynamic content",
        "instruction": "Cache-control headers tuned per resource type and update frequency.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.10",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement frontend code splitting and lazy routing",
        "instruction": "Route-level dynamic imports so only the needed chunk loads per page.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.11",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Optimize third-party script loading",
        "instruction": "Async/defer all non-critical scripts, load analytics and chat widgets after interaction.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.12",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement virtual scrolling for large lists",
        "instruction": "react-virtual or tanstack-virtual to render only visible rows in long tables.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.13",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Set up SSR or SSG where applicable",
        "instruction": "Next.js SSR for SEO-critical pages, static generation for marketing pages.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.14",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Optimize connection pooling",
        "instruction": "PgBouncer in transaction mode, tune pool size per service to max DB connections.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.15",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Reduce cold start times for serverless",
        "instruction": "Provisioned concurrency for critical Lambda functions, warm-up pings.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.16",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Profile and optimize memory usage",
        "instruction": "Heap profiling in production, fix memory leaks, right-size container resource limits.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.17",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement service worker and offline caching",
        "instruction": "Cache API responses and shell app for offline-capable experience.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.18",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Optimize WebSocket message payload size",
        "instruction": "Binary frames with MessagePack or Protobuf instead of verbose JSON.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.19",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Implement persisted GraphQL queries if applicable",
        "instruction": "Replace query strings with hash IDs to reduce request payload size.",
        "category": "Optimization & Performance"
      },
      {
        "code": "O.20",
        "domainLetter": "O",
        "domainName": "Optimization & Performance",
        "title": "Performance regression testing",
        "instruction": "Integrate Lighthouse CI in PR pipeline, fail builds that regress Core Web Vitals.",
        "category": "Optimization & Performance"
      }
    ]
  },
  {
    "letter": "P",
    "name": "Payment & Billing Systems",
    "description": "Revenue is sacred. Every checkout, invoice, refund, and retry handled with precision, auditability, and zero revenue leakage.",
    "icon": "CreditCard",
    "color": "blue",
    "phaseCount": 20,
    "phases": [
      {
        "code": "P.01",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Define pricing model",
        "instruction": "Subscription, one-time, usage-based, or hybrid; document plan tiers and feature entitlements.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.02",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Set up payment gateway account and sandbox",
        "instruction": "Stripe/Razorpay test mode with test cards and webhook simulation.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.03",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Integrate payment gateway SDK",
        "instruction": "Server-side charge/subscription creation, client-side Elements/Drop-in UI integration.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.04",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build checkout flow UI",
        "instruction": "Plan selection, payment method entry, order summary, and confirmation page.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.05",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement subscription plan management",
        "instruction": "Create, upgrade, downgrade, pause, cancel with immediate and end-of-period options.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.06",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build invoice generation system",
        "instruction": "Auto-generate on payment, PDF rendering, line-item breakdown, and email delivery.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.07",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement payment method management",
        "instruction": "Add/remove cards, set default, 3DS authentication, saved payment methods.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.08",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build billing portal / customer self-service",
        "instruction": "View invoices, update card, manage subscription, download receipts.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.09",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement proration logic",
        "instruction": "Calculate credits and charges when users switch plans mid-cycle, test edge cases.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.10",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build payment failure and retry handling",
        "instruction": "Smart retry schedule (1d/3d/7d), email alerts, grace period before suspension.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.11",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement dunning management flow",
        "instruction": "Escalating email sequence for failed payments before account cancellation.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.12",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build coupon and discount code system",
        "instruction": "Percentage/fixed discounts, expiry, max uses, single-use codes, stackability rules.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.13",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement refund processing",
        "instruction": "Full and partial refunds via API and admin UI with reason capture and audit log.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.14",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build revenue reporting and MRR dashboard",
        "instruction": "MRR, ARR, churn rate, LTV, and net revenue retention tracked daily.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.15",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement tax calculation and collection",
        "instruction": "Stripe Tax or TaxJar for automatic jurisdictional tax rates on invoices.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.16",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Set up payment webhook receiver",
        "instruction": "Stripe event processing (invoice.paid, payment_intent.failed) with idempotency.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.17",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement billing audit trail",
        "instruction": "Immutable log of every billing event, plan change, charge, credit, and refund.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.18",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Build payment dispute/chargeback handling",
        "instruction": "Internal workflow for responding to disputes with evidence collection.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.19",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Implement multi-currency support",
        "instruction": "Display and charge in user's currency, handle FX conversion and rounding.",
        "category": "Payment & Billing Systems"
      },
      {
        "code": "P.20",
        "domainLetter": "P",
        "domainName": "Payment & Billing Systems",
        "title": "Payment security audit and PCI compliance review",
        "instruction": "No card data touching our servers, SCA enforcement, compliance docs.",
        "category": "Payment & Billing Systems"
      }
    ]
  },
  {
    "letter": "Q",
    "name": "Quality Assurance",
    "description": "Ship with confidence. Manual, automated, exploratory, and load testing — every scenario covered before it reaches a real user.",
    "icon": "CheckCircle",
    "color": "purple",
    "phaseCount": 20,
    "phases": [
      {
        "code": "Q.01",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Define QA strategy and coverage targets",
        "instruction": "80% unit, 70% integration, 100% of critical user journeys covered by e2e.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.02",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Set up QA environment",
        "instruction": "Production-parity infrastructure with anonymized production data snapshot loaded.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.03",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Create manual test cases for all core user flows",
        "instruction": "Written in Given/When/Then format, stored in TestRail/Notion.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.04",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Build automated regression test suite",
        "instruction": "All previously fixed bugs have a test that would have caught them.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.05",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Conduct exploratory testing sessions",
        "instruction": "Unscripted 2-hour sessions per feature, bugs logged with reproduction steps.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.06",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Perform cross-browser compatibility testing",
        "instruction": "Chrome, Firefox, Safari, Edge all pass on latest and n-1 versions.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.07",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Perform cross-device and responsive testing",
        "instruction": "iPhone, Android, tablet, desktop at multiple resolutions verified.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.08",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Conduct performance and load testing",
        "instruction": "500 concurrent users sustained for 10 minutes with p99 latency under target.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.09",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Perform security penetration testing",
        "instruction": "OWASP Top 10 manually tested, automated scan with OWASP ZAP or Burp Suite.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.10",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Conduct accessibility audit",
        "instruction": "WCAG 2.1 AA compliance verified with automated (axe) and manual screen reader testing.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.11",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Test all third-party integration touchpoints",
        "instruction": "Simulate provider outages, verify graceful degradation and user-facing messages.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.12",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Perform payment flow end-to-end testing",
        "instruction": "Every test card scenario (success, decline, 3DS, insufficient funds) verified.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.13",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Conduct user acceptance testing (UAT)",
        "instruction": "5+ real users complete core tasks with no assistance, feedback documented.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.14",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Test notification delivery across all channels",
        "instruction": "Email inbox, SMS received, push delivered for all trigger events.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.15",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Conduct API contract testing",
        "instruction": "Consumer-driven contracts verified with Pact or OpenAPI schema validation in CI.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.16",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Test all error states and edge cases",
        "instruction": "Empty states, network failures, timeout scenarios, concurrent write conflicts.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.17",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Test data export and import functionality",
        "instruction": "Verify CSV/XLSX integrity, encoding issues, large file handling.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.18",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Conduct localization and i18n testing",
        "instruction": "All supported locales render correctly, dates/currencies/numbers formatted right.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.19",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "Verify all logging and monitoring captures",
        "instruction": "Induce errors and confirm they appear in Sentry and the log aggregator.",
        "category": "Quality Assurance"
      },
      {
        "code": "Q.20",
        "domainLetter": "Q",
        "domainName": "Quality Assurance",
        "title": "QA sign-off, bug triage, and release readiness report",
        "instruction": "P0/P1 count is zero, P2 list acknowledged, go/no-go documented.",
        "category": "Quality Assurance"
      }
    ]
  },
  {
    "letter": "R",
    "name": "Routing & Navigation",
    "description": "How users move through the product. URL structure, guards, deep links, and SEO-friendly paths — the map of the application.",
    "icon": "Compass",
    "color": "amber",
    "phaseCount": 20,
    "phases": [
      {
        "code": "R.01",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Define application URL structure",
        "instruction": "Noun-based, human-readable paths documented in a routing manifest before coding.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.02",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Set up client-side router",
        "instruction": "React Router v6 or Next.js App Router with layout hierarchy and route grouping.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.03",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement protected/authenticated route guards",
        "instruction": "Redirect unauthenticated users to login, preserve intended destination.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.04",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement role-based route access control",
        "instruction": "Block routes by user role, show 403 page with contact admin link.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.05",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Build public and private route separation",
        "instruction": "Clear split between marketing pages (public) and app pages (authenticated).",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.06",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Set up dynamic route parameters",
        "instruction": "/users/:userId/settings with type validation on param before data fetch.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.07",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement query string handling",
        "instruction": "Serialize/deserialize filter/sort/page state to URL, restore on back navigation.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.08",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Build breadcrumb navigation logic",
        "instruction": "Auto-computed from route hierarchy, custom labels for dynamic segments.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.09",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement deep linking support",
        "instruction": "Every meaningful app state is bookmarkable and shareable via URL.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.10",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Set up redirect rules",
        "instruction": "Post-login redirect to intended URL, legacy URL redirects, www-to-apex redirect.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.11",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Build 404 and error page routing",
        "instruction": "Catch-all route for 404, error boundary route for 500, both with navigation out.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.12",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement nested routing for dashboards",
        "instruction": "Sub-tabs rendered in content area without full-page reload.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.13",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Set up server-side routing",
        "instruction": "Backend route groups per domain (auth/, admin/, api/v1/) with middleware attachment.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.14",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement API versioning routing",
        "instruction": "/api/v1 and /api/v2 with deprecation warnings on old version responses.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.15",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Build route-level code splitting",
        "instruction": "Every page route is a lazy import, split at the router level.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.16",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement scroll restoration on navigation",
        "instruction": "Restore scroll position on back navigation, scroll to top on new route.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.17",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Set up canonical URL and SEO-friendly routing",
        "instruction": "Canonical tags, hreflang, clean URL slugs for public-facing pages.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.18",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Implement SPA history management",
        "instruction": "PushState routing, hash fallback for environments that need it, history.block for forms.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.19",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Build sitemap generation",
        "instruction": "Auto-generated XML sitemap from routes, submitted to Google Search Console.",
        "category": "Routing & Navigation"
      },
      {
        "code": "R.20",
        "domainLetter": "R",
        "domainName": "Routing & Navigation",
        "title": "Routing integration tests",
        "instruction": "Verify every route resolves, redirects fire correctly, and guards reject unauthorized access.",
        "category": "Routing & Navigation"
      }
    ]
  },
  {
    "letter": "S",
    "name": "Security & Authentication",
    "description": "The non-negotiable layer. Identity, access, encryption, and hardening — built in from the start, never bolted on after.",
    "icon": "Shield",
    "color": "emerald",
    "phaseCount": 20,
    "phases": [
      {
        "code": "S.01",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Define authentication strategy",
        "instruction": "JWT with refresh rotation, session-based, or OAuth-only; document the chosen flow.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.02",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement user registration with email verification",
        "instruction": "Unique email check, verification token, 24h expiry, resend flow.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.03",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Build login with secure password hashing",
        "instruction": "Bcrypt cost factor 12 or argon2id, timing-safe comparison, no plaintext ever.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.04",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement refresh token rotation",
        "instruction": "Short-lived access tokens (15m), long-lived refresh tokens (7d), single-use rotation.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.05",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Build forgot password and reset password flow",
        "instruction": "Cryptographically random reset token, 1h expiry, invalidated after use.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.06",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement MFA/TOTP",
        "instruction": "QR code enrollment, TOTP verification at login, backup recovery codes, MFA bypass for support.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.07",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Build social OAuth login",
        "instruction": "Google/GitHub strategy with account linking for existing email users.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.08",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement session management and invalidation",
        "instruction": "Server-side session store, logout revokes all sessions or single device.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.09",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Set up CORS and CSRF protection",
        "instruction": "Strict origin allowlist, SameSite cookie attributes, CSRF token for non-idempotent forms.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.10",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement role-based access control (RBAC)",
        "instruction": "Roles (admin/member/viewer) mapped to permissions, checked at service layer.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.11",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Build IP rate limiting and brute force protection",
        "instruction": "Lockout after 5 failed logins, CAPTCHA after 3 attempts.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.12",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement input sanitization",
        "instruction": "DOMPurify on frontend, parameterized queries on backend, no raw SQL string interpolation.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.13",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Set up HTTPS enforcement and HSTS",
        "instruction": "Redirect all HTTP to HTTPS, set max-age=31536000 includeSubDomains preload.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.14",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement data encryption at rest and in transit",
        "instruction": "TLS 1.3 in transit, AES-256 for PII fields at rest via KMS.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.15",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Build account lockout and suspicious login detection",
        "instruction": "New device detection, impossible travel alerts, account recovery flow.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.16",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Set up security headers",
        "instruction": "CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.17",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Implement API key authentication",
        "instruction": "Scoped keys for external integrations, key prefix for identification, hash stored.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.18",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Build security audit log",
        "instruction": "Every sensitive action (login, logout, role change, data delete) immutably logged with actor.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.19",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Conduct OWASP Top 10 vulnerability assessment",
        "instruction": "Injection, XSS, IDOR, SSRF, and misconfiguration all tested and addressed.",
        "category": "Security & Authentication"
      },
      {
        "code": "S.20",
        "domainLetter": "S",
        "domainName": "Security & Authentication",
        "title": "Security penetration test, remediation, and sign-off",
        "instruction": "Third-party pen test, all critical/high findings fixed, report filed.",
        "category": "Security & Authentication"
      }
    ]
  },
  {
    "letter": "T",
    "name": "Testing Strategy",
    "description": "Tests are documentation that executes. Unit, integration, e2e, load, visual — every layer of the pyramid built and enforced.",
    "icon": "CheckSquare",
    "color": "teal",
    "phaseCount": 20,
    "phases": [
      {
        "code": "T.01",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Define testing pyramid",
        "instruction": "70% unit, 20% integration, 10% e2e — and agree on coverage minimums before sprint 1.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.02",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Set up testing framework",
        "instruction": "Jest/Vitest for JS, Pytest for Python, with parallel test runner configured.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.03",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Configure test runner and coverage reporting",
        "instruction": "Istanbul/V8 coverage, thresholds enforced in CI, HTML report per run.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.04",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write unit tests for all utility functions",
        "instruction": "Pure functions, helpers, and formatters at 100% branch coverage.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.05",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write unit tests for all service layer methods",
        "instruction": "Mock repositories, test business logic, all branches and error paths.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.06",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write unit tests for all components",
        "instruction": "React Testing Library, user-event, test user interactions not implementation details.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.07",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write integration tests for all API endpoints",
        "instruction": "Supertest/httpx against real DB in test container, test auth and error cases.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.08",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write integration tests for database operations",
        "instruction": "Test migrations, transactions, cascades, and constraint enforcement.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.09",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write e2e tests for authentication flows",
        "instruction": "Register, verify email, login, MFA, password reset in full browser.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.10",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write e2e tests for core user journeys",
        "instruction": "Top 5 most important flows covered by Playwright/Cypress tests.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.11",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write e2e tests for payment flows",
        "instruction": "Stripe test mode checkout, plan upgrade, cancellation, and invoice download.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.12",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write tests for background jobs",
        "instruction": "Enqueue job in test, process it, assert side effects (email sent, DB updated).",
        "category": "Testing Strategy"
      },
      {
        "code": "T.13",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write tests for notification delivery",
        "instruction": "Assert email/SMS/push triggered with correct content for each event type.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.14",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Implement snapshot testing",
        "instruction": "Critical UI components snapshot-tested, reviewed on diff in PRs.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.15",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Set up visual regression testing",
        "instruction": "Percy or Chromatic captures screenshots on every PR, flags pixel-level changes.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.16",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write load and stress tests",
        "instruction": "k6 or Locust scripts simulating peak traffic, ramping up to 2x expected concurrent users.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.17",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Write security tests",
        "instruction": "Test auth bypass attempts, SQL injection payloads, XSS strings in all input fields.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.18",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Configure test coverage thresholds",
        "instruction": "CI fails if unit coverage drops below 75%, integration below 60%.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.19",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Set up test parallelization",
        "instruction": "Shard tests across 4 workers in CI, run e2e in parallel across 3 browser instances.",
        "category": "Testing Strategy"
      },
      {
        "code": "T.20",
        "domainLetter": "T",
        "domainName": "Testing Strategy",
        "title": "Test reporting and flakiness tracking",
        "instruction": "JUnit XML to CI report, flaky test tracker, auto-quarantine after 3 fails.",
        "category": "Testing Strategy"
      }
    ]
  },
  {
    "letter": "U",
    "name": "UI/UX Design System",
    "description": "The visual language of the product. Tokens, typography, spacing, and patterns that make the interface consistent and beautiful.",
    "icon": "Palette",
    "color": "pink",
    "phaseCount": 20,
    "phases": [
      {
        "code": "U.01",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Define brand identity",
        "instruction": "Primary/secondary color, typography personality, motion language, and visual tone documented.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.02",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Create design tokens",
        "instruction": "CSS custom properties for color, spacing, radius, shadow, and typography exported from Figma.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.03",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Build base typography scale",
        "instruction": "Display/heading/body/label/caption sizes, weights, and line-heights in a clear type ramp.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.04",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Define spacing and layout grid system",
        "instruction": "4px or 8px base unit, named spacing tokens (xs/sm/md/lg/xl/2xl).",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.05",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Create color palette with accessibility checks",
        "instruction": "All text/background pairings pass WCAG AA (4.5:1), AAA for body text.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.06",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Design icon set and illustration style",
        "instruction": "Choose an icon library, create custom icons for brand moments.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.07",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Create wireframes for all key screens",
        "instruction": "Low-fidelity wireframes reviewed with stakeholders before hi-fi design begins.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.08",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Build high-fidelity mockups for all screens",
        "instruction": "Figma designs for every page, including all states (loading, empty, error).",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.09",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Conduct design review and stakeholder approval",
        "instruction": "Design walkthrough session, feedback captured, revisions made, sign-off given.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.10",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Build interactive prototype for usability testing",
        "instruction": "Clickable Figma prototype covering all 5 core user journeys.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.11",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Conduct usability testing sessions",
        "instruction": "5 participants complete tasks unassisted, time-on-task and error rates recorded.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.12",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Implement design system in code",
        "instruction": "Tailwind config, CSS tokens, and base component styles aligned with Figma designs.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.13",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Create design-to-dev handoff documentation",
        "instruction": "Spacing specs, redlines, asset export guide, and interaction notes per component.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.14",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Build dark mode design tokens",
        "instruction": "Separate token set for dark surfaces, text, and borders with semantic naming.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.15",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Define animation and transition style guide",
        "instruction": "Easing curves, duration scale (100ms/200ms/300ms), motion purpose rules.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.16",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Design responsive breakpoint system",
        "instruction": "320/768/1024/1280/1536px breakpoints with layout shift documentation per page.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.17",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Create email design template system",
        "instruction": "Master Figma email template, component blocks, dark mode email variant.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.18",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Design onboarding and empty state screens",
        "instruction": "Illustrated empty states per section, first-run wizard screens, celebrations.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.19",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Create accessibility design guidelines",
        "instruction": "Focus indicators, minimum touch targets (44px), motion-reduced variant designs.",
        "category": "UI/UX Design System"
      },
      {
        "code": "U.20",
        "domainLetter": "U",
        "domainName": "UI/UX Design System",
        "title": "Design system documentation and Storybook publishing",
        "instruction": "Every component documented with usage guidelines, do/don't examples.",
        "category": "UI/UX Design System"
      }
    ]
  },
  {
    "letter": "V",
    "name": "Validation & Error Handling",
    "description": "Bad data in, good error out. Every input validated, every failure handled gracefully — users always know what went wrong.",
    "icon": "AlertOctagon",
    "color": "amber",
    "phaseCount": 20,
    "phases": [
      {
        "code": "V.01",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Define validation strategy",
        "instruction": "Server-side authoritative, client-side for UX enhancement, never trust the client alone.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.02",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Set up validation library",
        "instruction": "Zod (TypeScript), Yup (JS), Joi (Node), or class-validator (NestJS) with shared schemas.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.03",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Write validation schemas for all request DTOs",
        "instruction": "Type, format, length, range, and business rule constraints per field.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.04",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Implement frontend form validation with real-time feedback",
        "instruction": "Validate on blur, submit, and re-validate after backend error.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.05",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Build global error handler",
        "instruction": "Catch unhandled exceptions, log with full context, return 500 without leaking internals.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.06",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Define error code taxonomy",
        "instruction": "Machine-readable error codes (USER_NOT_FOUND, PLAN_LIMIT_EXCEEDED) for all known error states.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.07",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Build standardized API error response format",
        "instruction": "{code, message, details[], traceId} consistently across every endpoint.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.08",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Implement HTTP status standard",
        "instruction": "400 bad request, 401 unauthenticated, 403 forbidden, 422 validation, 429 rate limited.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.09",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Build user-facing error message system",
        "instruction": "Human-readable messages per error code, localized, never expose stack traces.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.10",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Implement field-level validation error display",
        "instruction": "Error message pinned below the field, field highlighted with aria-invalid.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.11",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Build retry logic for transient failures",
        "instruction": "Automatic retry on 503/504 with exponential backoff and jitter.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.12",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Implement circuit breaker pattern",
        "instruction": "Trip after 5 failures in 60s, half-open probe after cooldown, fallback response.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.13",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Handle file upload validation",
        "instruction": "Max size check, MIME type sniffing (not just extension), virus scan integration.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.14",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Implement business rule validation layer",
        "instruction": "Plan limits, ownership checks, state machine transitions enforced at service layer.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.15",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Build duplicate detection and conflict resolution",
        "instruction": "Unique constraint errors caught and translated to user-friendly messages.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.16",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Handle timezone and date validation",
        "instruction": "Store UTC, validate date ranges, handle DST edge cases in scheduling.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.17",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Implement async validation",
        "instruction": "Username availability, email uniqueness checked via debounced API call before submission.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.18",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Build validation for imported/bulk data",
        "instruction": "Row-level error report returned after bulk import with row number and reason.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.19",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Create validation error reporting for admin",
        "instruction": "Dashboard showing top validation failures to identify UX improvements.",
        "category": "Validation & Error Handling"
      },
      {
        "code": "V.20",
        "domainLetter": "V",
        "domainName": "Validation & Error Handling",
        "title": "Validation testing for edge cases",
        "instruction": "Null, empty string, max length +1, special chars, emoji, Unicode RTL in all fields.",
        "category": "Validation & Error Handling"
      }
    ]
  },
  {
    "letter": "W",
    "name": "WebSockets & Real-time Features",
    "description": "Instant experiences. Live updates, presence, chat, collaboration — delivered over persistent connections that survive network hiccups.",
    "icon": "Radio",
    "color": "blue",
    "phaseCount": 20,
    "phases": [
      {
        "code": "W.01",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Define real-time feature requirements",
        "instruction": "List every feature that needs sub-second updates and its acceptable latency budget.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.02",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Choose WebSocket library/protocol",
        "instruction": "Socket.io for ease, native ws for performance, or SSE for one-directional updates.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.03",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Set up WebSocket server and connection management",
        "instruction": "Namespaces/rooms, connection registry, disconnect cleanup.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.04",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement authentication for WebSocket connections",
        "instruction": "JWT handshake on connect, reject unauthenticated connections.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.05",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Build real-time notification delivery",
        "instruction": "Push in-app notification payloads to active user sessions on event trigger.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.06",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement live data dashboard updates",
        "instruction": "Push updated metrics/stats to dashboard subscribers without polling.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.07",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Build collaborative editing / presence features",
        "instruction": "Show who is viewing/editing a resource, conflict-free updates (CRDT/OT).",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.08",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement chat or messaging feature",
        "instruction": "Room creation, message history loading, real-time delivery, read receipts.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.09",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Build real-time activity feed",
        "instruction": "Broadcast user actions (item created, comment added) to subscribed viewers instantly.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.10",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement live status updates",
        "instruction": "Order status, task progress, file upload progress pushed to the initiating client.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.11",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Build WebSocket room/channel management",
        "instruction": "Join/leave rooms dynamically, room permissions, message scoping.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.12",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement reconnection and fallback",
        "instruction": "Exponential backoff reconnect, SSE or polling fallback on WebSocket failure.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.13",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Handle offline message queuing",
        "instruction": "Buffer missed events while disconnected, replay on reconnect in correct order.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.14",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Build typing indicators and read receipts",
        "instruction": "Debounced typing events, seen timestamps synced across devices.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.15",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement real-time validation feedback",
        "instruction": "Server-side validation results pushed back to the form field as the user types.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.16",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Set up WebSocket load balancing",
        "instruction": "Redis adapter (Socket.io) or Pub-Sub fan-out for multi-instance deployments.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.17",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement WebSocket rate limiting",
        "instruction": "Max messages per second per connection, ban on abuse detection.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.18",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Build WebSocket monitoring",
        "instruction": "Active connection count, messages/sec, room sizes, disconnect rate tracked in dashboard.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.19",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "Implement WebSocket heartbeat and keepalive",
        "instruction": "Ping/pong every 30 seconds, close stale connections after 90-second silence.",
        "category": "WebSockets & Real-time Features"
      },
      {
        "code": "W.20",
        "domainLetter": "W",
        "domainName": "WebSockets & Real-time Features",
        "title": "WebSocket load testing",
        "instruction": "10,000 concurrent connections sustained, message broadcast latency measured under load.",
        "category": "WebSockets & Real-time Features"
      }
    ]
  },
  {
    "letter": "X",
    "name": "Cross-platform & Compatibility",
    "description": "Works for everyone, everywhere. Every browser, device, screen size, assistive technology — no user left behind.",
    "icon": "Smartphone",
    "color": "amber",
    "phaseCount": 20,
    "phases": [
      {
        "code": "X.01",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Define supported browsers and OS matrix",
        "instruction": "Document minimum supported versions, update policy, and exception process.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.02",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Set up BrowserStack or Sauce Labs",
        "instruction": "Automated cross-browser test runs on every release candidate.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.03",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test and fix on Chrome (latest and n-1)",
        "instruction": "Primary browser, ensure all features work with no console errors.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.04",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test and fix on Firefox (latest and n-1)",
        "instruction": "CSS grid, flexbox, and font rendering differences addressed.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.05",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test and fix on Safari (latest and n-1)",
        "instruction": "WebKit quirks, date input differences, scroll behavior, PWA support.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.06",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test and fix on Edge (latest and n-1)",
        "instruction": "Chromium-based, focus on Windows-specific rendering and touch support.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.07",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test on iOS Safari",
        "instruction": "iPhone 12+, safe area insets, viewport resize on keyboard show, touch target sizing.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.08",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test on Android Chrome",
        "instruction": "Samsung Galaxy S21+, keyboard behavior, back button handling in SPA, bottom nav clearance.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.09",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test responsive layouts",
        "instruction": "320px, 375px, 768px, 1024px, 1280px, 1440px, 1920px verified for every page.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.10",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Implement progressive enhancement",
        "instruction": "Core functionality works without JS, enhanced experience with JS enabled.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.11",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Set up polyfills for older browser support",
        "instruction": "core-js, whatwg-fetch, IntersectionObserver polyfill via browserslist.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.12",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test with screen readers",
        "instruction": "NVDA+Firefox (Windows), VoiceOver+Safari (Mac/iOS), TalkBack+Chrome (Android).",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.13",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Implement touch gesture support",
        "instruction": "Swipe-to-dismiss, pull-to-refresh, pinch-to-zoom where contextually appropriate.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.14",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test print styles and print layouts",
        "instruction": "@print CSS for key content pages, hide non-essential chrome elements.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.15",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Ensure keyboard-only navigation works",
        "instruction": "Tab order logical, all interactive elements reachable, focus visible at all times.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.16",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test with slow/unstable network",
        "instruction": "Chrome DevTools 3G throttle, verify loaders appear, no missing error states.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.17",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Verify correct behavior without JavaScript",
        "instruction": "Progressive enhancement fallbacks, form submit works noscript.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.18",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Implement mobile app deep linking",
        "instruction": "Universal Links (iOS) and App Links (Android) for email/notification CTAs.",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.19",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Test on different screen sizes",
        "instruction": "320px (small phone), 768px (tablet portrait), 1920px (desktop), 4K (hi-DPI).",
        "category": "Cross-platform & Compatibility"
      },
      {
        "code": "X.20",
        "domainLetter": "X",
        "domainName": "Cross-platform & Compatibility",
        "title": "Cross-platform sign-off and compatibility documentation",
        "instruction": "Test matrix filled, exceptions documented, support SLA defined.",
        "category": "Cross-platform & Compatibility"
      }
    ]
  },
  {
    "letter": "Y",
    "name": "YAML & DevOps Configuration",
    "description": "Infrastructure and pipelines as code. Docker, Kubernetes, Terraform, CI/CD — everything repeatable and automated.",
    "icon": "FileCode",
    "color": "emerald",
    "phaseCount": 20,
    "phases": [
      {
        "code": "Y.01",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write Docker Compose file for local development",
        "instruction": "All services (app, db, cache, queue) running with one command.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.02",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write production Dockerfile per service",
        "instruction": "Multi-stage build, non-root user, minimal base image, .dockerignore configured.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.03",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Create Kubernetes manifests",
        "instruction": "Deployment, Service, Ingress, ConfigMap, Secret, HPA for each service.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.04",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write CI pipeline YAML",
        "instruction": "Lint, type-check, test, build, and image push triggered on every push to PR branches.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.05",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write CD pipeline YAML for staging",
        "instruction": "Auto-deploy on merge to develop branch, run smoke tests post-deploy.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.06",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write CD pipeline YAML for production",
        "instruction": "Manual approval gate, deploy with zero downtime, post-deploy health check.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.07",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Create Helm chart for application",
        "instruction": "values.yaml per environment, templated manifests, chart versioning aligned to app.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.08",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write Terraform/Pulumi scripts",
        "instruction": "All cloud resources provisioned as code, state in remote backend (S3/Terraform Cloud).",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.09",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Configure environment-specific values files",
        "instruction": "Dev/staging/prod overrides for image tags, replica counts, and resource limits.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.10",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Set up secrets injection in CI/CD pipeline",
        "instruction": "Pull from Secrets Manager at runtime, never bake secrets into images.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.11",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Create pipeline for automated database migrations",
        "instruction": "Migrations run before new app version starts, with rollback on failure.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.12",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write build and test pipeline for PR validation",
        "instruction": "Runs on every commit to a PR, blocks merge on failure.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.13",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Configure pipeline for Docker image building and pushing",
        "instruction": "Image tagged with commit SHA and semantic version.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.14",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Create infrastructure provisioning pipeline",
        "instruction": "Plan on PR, apply on merge to main with manual approval for prod changes.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.15",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Set up automated dependency vulnerability scanning",
        "instruction": "Trivy or Snyk scans images and packages in CI, fails on critical CVEs.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.16",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Configure SAST/DAST scanning in pipeline",
        "instruction": "CodeQL or Semgrep static analysis on every PR, OWASP ZAP dynamic scan.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.17",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Write smoke test pipeline post-deployment",
        "instruction": "Automated health check and top-3 journey test run after every deploy.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.18",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Create performance benchmarking pipeline",
        "instruction": "k6 load test runs nightly on staging, results posted to Slack.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.19",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "Configure pipeline failure notifications",
        "instruction": "Slack alert on job failure with link to failing step and commit author tagged.",
        "category": "YAML & DevOps Configuration"
      },
      {
        "code": "Y.20",
        "domainLetter": "Y",
        "domainName": "YAML & DevOps Configuration",
        "title": "DevOps pipeline documentation and runbook",
        "instruction": "README per pipeline explaining trigger, inputs, steps, and failure recovery.",
        "category": "YAML & DevOps Configuration"
      }
    ]
  },
  {
    "letter": "Z",
    "name": "Zero-Downtime Deployment & Release",
    "description": "The final mile. Blue-green, canary, feature flags, rollback plans, and post-deploy verification — ship with confidence.",
    "icon": "Rocket",
    "color": "blue",
    "phaseCount": 20,
    "phases": [
      {
        "code": "Z.01",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Define deployment strategy",
        "instruction": "Blue-green for zero downtime, canary for risk reduction, rolling for resource efficiency.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.02",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Set up blue-green deployment infrastructure",
        "instruction": "Two identical environments, load balancer traffic switch in under 30 seconds.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.03",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Implement database migration compatibility",
        "instruction": "All migrations backward-compatible for 1 version so both app versions can run.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.04",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Configure health check endpoints for LB probes",
        "instruction": "/health/ready returns 200 only when app and all dependencies are up.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.05",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Set up canary release with traffic splitting",
        "instruction": "5% canary then 25% then 100% with automatic error-rate-based halt.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.06",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Implement feature flags for safe feature rollout",
        "instruction": "New features hidden behind flags, enabled per-user or per-percentage.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.07",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Create rollback procedure and scripts",
        "instruction": "One-command rollback to previous image version and migration rollback script ready.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.08",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Set up deployment approval gates for production",
        "instruction": "Required approval from engineering lead and QA lead before prod deploy.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.09",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Implement deployment freeze calendar",
        "instruction": "No deploys on Fridays, major holidays, or peak business periods unless emergency.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.10",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Create pre-deployment checklist",
        "instruction": "Database migration dry run, staging smoke test pass, monitoring dashboard reviewed.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.11",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Build post-deployment smoke test suite",
        "instruction": "Automated test verifying login, core feature, and payment work within 2 minutes.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.12",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Set up deployment notifications",
        "instruction": "Slack alert with version, deployer, link to diff, and post-deploy status from smoke tests.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.13",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Implement automated rollback on health check failure",
        "instruction": "If error rate spikes over 5% within 10 min of deploy, auto-rollback.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.14",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Create runbook for common production incidents",
        "instruction": "Documented steps for DB failover, traffic spike, deploy failure, security event.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.15",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Set up on-call rotation and escalation policy",
        "instruction": "PagerDuty schedule, primary/secondary, escalation after 5-minute no-ack.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.16",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Build change management and release notes process",
        "instruction": "CHANGELOG.md auto-generated, release notes sent to stakeholders.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.17",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Implement database connection draining on deploy",
        "instruction": "Graceful connection handoff, in-flight queries complete before pod termination.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.18",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Create disaster recovery drill and test plan",
        "instruction": "Quarterly DR drill, recovery time measured and compared against RTO target.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.19",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Build deployment metrics dashboard",
        "instruction": "Deployment frequency, lead time, MTTR, and change failure rate tracked weekly.",
        "category": "Zero-Downtime Deployment & Release"
      },
      {
        "code": "Z.20",
        "domainLetter": "Z",
        "domainName": "Zero-Downtime Deployment & Release",
        "title": "Final production readiness review and go-live checklist",
        "instruction": "Security, performance, monitoring, backup, and legal all signed off.",
        "category": "Zero-Downtime Deployment & Release"
      }
    ]
  }
];

export const ALL_MASTER_BUILD_PHASES: MasterBuildPhase[] = MASTER_BUILD_DOMAINS.flatMap(
  (d) => d.phases
);

/**
 * Get domain details by letter (e.g. 'A' through 'Z')
 */
export function getMasterDomain(letter: string): MasterBuildDomain | undefined {
  const norm = letter.trim().toUpperCase();
  return MASTER_BUILD_DOMAINS.find((d) => d.letter === norm);
}

/**
 * Get specific phase by code (e.g. 'A.01', 'S.06', 'Z.20')
 */
export function getMasterPhase(code: string): MasterBuildPhase | undefined {
  const norm = code.trim().toUpperCase();
  return ALL_MASTER_BUILD_PHASES.find((p) => p.code === norm);
}

/**
 * Search across all 520 phases by keyword
 */
export function searchMasterPhases(query: string): MasterBuildPhase[] {
  if (!query || query.trim().length === 0) return ALL_MASTER_BUILD_PHASES;
  const q = query.toLowerCase().trim();
  return ALL_MASTER_BUILD_PHASES.filter(
    (p) =>
      p.code.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.instruction.toLowerCase().includes(q) ||
      p.domainName.toLowerCase().includes(q)
  );
}

/**
 * Calculate progress statistics given a project's phase records map
 */
export function calculateMasterBuildProgress(records: Record<string, ProjectPhaseRecord>) {
  const total = ALL_MASTER_BUILD_PHASES.length;
  let verified = 0;
  let inProgress = 0;
  let blocked = 0;
  let pending = 0;

  for (const phase of ALL_MASTER_BUILD_PHASES) {
    const rec = records[phase.code];
    if (!rec || rec.status === "PENDING") {
      pending++;
    } else if (rec.status === "VERIFIED") {
      verified++;
    } else if (rec.status === "IN_PROGRESS") {
      inProgress++;
    } else if (rec.status === "BLOCKED") {
      blocked++;
    }
  }

  const completionPct = total > 0 ? Math.round((verified / total) * 100) : 0;

  return {
    total,
    verified,
    inProgress,
    blocked,
    pending,
    completionPct,
  };
}
