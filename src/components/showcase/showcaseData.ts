import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  FileCheck,
  FileCode2,
  FileText,
  Fingerprint,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Network,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";

// ============================================================================
// 1. TOP NAVIGATION ITEMS (Requirement 033-055, 548-564)
// ============================================================================
export interface NavItem {
  id: string;
  label: string;
  hash: string;
  badge?: string;
  description: string;
}

export const SHOWCASE_NAV_ITEMS: NavItem[] = [
  {
    id: "showcase",
    label: "AI Tool Showcase",
    hash: "#showcase",
    badge: "Flagship",
    description: "Core intelligence engine, architecture generation & intent-to-release workflow",
  },
  {
    id: "github",
    label: "GitHub Mirror",
    hash: "#github",
    badge: "Realtime",
    description: "Repository reality, webhook ingestion, AST delta & change impact pipeline",
  },
  {
    id: "features",
    label: "Features",
    hash: "#features",
    badge: "17 Families",
    description: "Comprehensive capability universe across code, security, data & governance",
  },
  {
    id: "how-it-works",
    label: "How It Works",
    hash: "#how-it-works",
    badge: "10 Phases",
    description: "Operating model, 10-stage engineering lifecycle & deterministic vs AI balance",
  },
  {
    id: "technology",
    label: "Technology",
    hash: "#technology",
    badge: "8 Layers",
    description: "Architectural stack, Python AST, Bandit, FastAPI & AI Gateway 2.0",
  },
];

// ============================================================================
// 2. FEATURE FAMILIES METADATA (17 Capability Families - Requirement 130-165)
// ============================================================================
export interface FeatureFamily {
  id: string;
  name: string;
  category: "Intelligence" | "Extensibility" | "Governance" | "Operations";
  icon: any;
  tagline: string;
  whatItDoes: string;
  whyItExists: string;
  dataInputs: string[];
  outputsProduced: string[];
  copilotIntegration: string;
  status: "Implemented & Verified" | "Core Engine" | "Deterministic Pipeline";
}

export const FEATURE_FAMILIES: FeatureFamily[] = [
  {
    id: "architecture-intelligence",
    name: "Architecture Intelligence",
    category: "Intelligence",
    icon: Network,
    tagline: "Executable blueprints, topological dependency trees, and service boundaries",
    whatItDoes:
      "Synthesizes structural blueprints from natural-language requirements, maps inter-service communication graphs, and verifies that code implementations conform to architectural boundaries.",
    whyItExists:
      "Modern development accelerates so rapidly that architectural intent drifts silently from codebase reality. Brahma makes blueprints living, executable, and verifiable.",
    dataInputs: ["EARS Requirement Specifications", "Database schema DDL", "REST/gRPC API contracts", "Repository directory tree"],
    outputsProduced: ["Interactive React Flow DAG", "Module Coupling Index", "Undocumented Route Manifest", "Boundary Violation Warnings"],
    copilotIntegration: "Copilot queries the topological graph to verify if a proposed pull request crosses forbidden service boundaries before giving merge approval.",
    status: "Implemented & Verified",
  },
  {
    id: "code-intelligence",
    name: "Code Intelligence",
    category: "Intelligence",
    icon: Code2,
    tagline: "Deterministic AST inspection, cyclomatic complexity, and maintainability indexing",
    whatItDoes:
      "Runs static AST parsing via Lizard and Python analyzers across multiple languages (Python, TypeScript, Go, Java) to quantify cyclomatic complexity, token density, duplicate blocks, and maintainability index.",
    whyItExists:
      "Surface-level linters miss systemic architectural decay. Brahma isolates file-level hotspot functions whose complexity exceeds deterministic maintenance budgets.",
    dataInputs: ["Source code files", "Git commit deltas", "Function-level AST nodes", "Language grammar trees"],
    outputsProduced: ["Maintainability Index (0-100)", "Per-Function Cyclomatic Score", "Code Duplication Heatmap", "Technical Debt Hours"],
    copilotIntegration: "When a developer asks to refactor high-risk code, Copilot pinpoints the exact AST nodes exceeding cyclomatic thresholds with refactoring suggestions.",
    status: "Implemented & Verified",
  },
  {
    id: "security-intelligence",
    name: "Security Intelligence",
    category: "Governance",
    icon: ShieldCheck,
    tagline: "Bandit AST scans, STRIDE threat modeling, and CWE-indexed vulnerability triage",
    whatItDoes:
      "Performs deep AST security scanning using Bandit alongside STRIDE threat classification, catching injection vulnerabilities, insecure deserialization, cryptographic weaknesses, and hardcoded secrets.",
    whyItExists:
      "Security scanning usually happens late in CI pipelines or as disconnected alerts. Brahma maps each security vulnerability directly to its originating requirement and architecture module.",
    dataInputs: ["Python & JS AST syntax trees", "Dependency manifests (package.json, pyproject.toml)", "Environment variable usage", "SQL query strings"],
    outputsProduced: ["CWE-Tagged Finding Cards", "STRIDE Risk Categorization", "Exploitability Heuristics", "Remediation Snippets"],
    copilotIntegration: "Copilot activates the Security Specialist Agent to verify whether a detected CWE-89 SQLi has automated test mitigation or triggers an immediate release blocker.",
    status: "Implemented & Verified",
  },
  {
    id: "requirement-intelligence",
    name: "Requirement Intelligence",
    category: "Intelligence",
    icon: FileCheck,
    tagline: "Natural-language SRS extraction, EARS syntax compliance, and ambiguity scoring",
    whatItDoes:
      "Ingests raw product briefs, customer tickets, or PRDs and extracts structured functional and non-functional requirements conforming to the Easy Approach to Requirements Syntax (EARS) standard.",
    whyItExists:
      "80% of software defects originate from ambiguous or conflicting requirements. Brahma scores confidence on every extracted clause and highlights ambiguities before code is written.",
    dataInputs: ["Product Briefs (PDF/Text/MD)", "Jira/GitHub Issue descriptions", "Stakeholder interview notes", "User story templates"],
    outputsProduced: ["Structured Requirement Catalog", "EARS Pattern Classification", "Ambiguity & Confidence Scores", "Acceptance Criteria Rules"],
    copilotIntegration: "Copilot uses requirement nodes to enforce that every generated test case corresponds to at least one explicitly validated functional acceptance criterion.",
    status: "Implemented & Verified",
  },
  {
    id: "test-intelligence",
    name: "Test Intelligence",
    category: "Governance",
    icon: CheckCircle2,
    tagline: "Bi-directional requirement-to-test traceability and scenario coverage verification",
    whatItDoes:
      "Constructs a complete traceability matrix connecting requirements to unit, integration, and E2E test suites, highlighting untested edge cases and phantom tests that verify no documented requirement.",
    whyItExists:
      "High line coverage does not equal requirement coverage. Brahma ensures that critical business requirements have verifiable test proofs rather than just execute code paths.",
    dataInputs: ["Test suite source files (Jest, Pytest, Vitest)", "Test execution logs", "Requirement IDs", "Branch coverage reports"],
    outputsProduced: ["Traceability Matrix (Req ↔ Code ↔ Test)", "Uncovered Requirement Ledger", "Phantom Test Warnings", "Verification Confidence Metric"],
    copilotIntegration: "During release gate checks, Copilot blocks promotion if any Tier-1 requirement lacks an associated passing verification suite.",
    status: "Implemented & Verified",
  },
  {
    id: "github-intelligence",
    name: "GitHub Intelligence",
    category: "Operations",
    icon: GitBranch,
    tagline: "Live webhook mirroring, commit reality sync, and pull-request impact prediction",
    whatItDoes:
      "Synchronizes repository state in real time through webhooks and API mirroring, computing the architectural impact of every commit and PR before code enters the main branch.",
    whyItExists:
      "Git tracks file diffs; it doesn't understand architectural consequences. Brahma transforms git trees into semantic blueprints to show which services and requirements are affected.",
    dataInputs: ["GitHub Webhooks (push, pull_request)", "Commit SHA & commit messages", "Git diff patches", "Tree blobs"],
    outputsProduced: ["Live Git Mirror View", "PR Architecture Impact Score", "Modified Module Highlight", "Drift Delta Alerts"],
    copilotIntegration: "Copilot automatically posts impact summaries on mirrored PRs, indicating whether the changeset introduces architectural drift or breaks release gates.",
    status: "Implemented & Verified",
  },
  {
    id: "data-intelligence",
    name: "Data Intelligence",
    category: "Intelligence",
    icon: Database,
    tagline: "Schema lineage, Kaggle dataset integration, data quality scoring, and null drift",
    whatItDoes:
      "Analyzes database schemas, external data sources, and Kaggle datasets for structural integrity, missing values, column distribution shifts, and relational foreign key health.",
    whyItExists:
      "Software intelligence increasingly relies on data pipelines where schema or distribution shifts break downstream application logic silently.",
    dataInputs: ["PostgreSQL information_schema DDL", "CSV & Parquet data samples", "Kaggle dataset metadata", "Column profiling metrics"],
    outputsProduced: ["Data Quality Scorecard (0-100)", "Nullity & Distribution Gauges", "Schema Evolution Timeline", "Integrity Warning Matrix"],
    copilotIntegration: "Copilot delegates data validation queries to the Data Quality Agent to inspect column cardinality before approving schema migrations.",
    status: "Implemented & Verified",
  },
  {
    id: "ai-copilot",
    name: "AI Copilot Engine",
    category: "Intelligence",
    icon: BrainCircuit,
    tagline: "Autonomous project intelligence orchestrator with multi-step missions & memory",
    whatItDoes:
      "Acts as the central orchestrator that synthesizes context across requirements, code AST, security scans, and test gates to answer complex engineering queries and execute multi-step missions.",
    whyItExists:
      "Generic chatbots lack project context, tools, and authority. Brahma Copilot has tool-calling capability over real engineering artifacts with deterministic verification.",
    dataInputs: ["Active project context vector", "AST metrics database", "Gate policies", "User prompt / goal"],
    outputsProduced: ["Mission Execution Plans", "Evidence-Backed Syntheses", "Refactoring Suggestions", "Cryptographic Release Seals"],
    copilotIntegration: "Serves as the master coordinator that delegates bounded subtasks to specialist agents while retaining final audit responsibility.",
    status: "Implemented & Verified",
  },
  {
    id: "multi-agent-intelligence",
    name: "Multi-Agent Intelligence",
    category: "Intelligence",
    icon: Boxes,
    tagline: "7 bounded specialist agents operating under central Copilot governance",
    whatItDoes:
      "Executes isolated specialist investigations across Data Analysis, Security, Quality, Risk, and Reporting without uncontrolled recursion or token exhaustion.",
    whyItExists:
      "A monolithic model loses focus when evaluating deep multi-domain engineering problems. Bounded specialist agents operate with tailored toolkits and bounded recursion budgets.",
    dataInputs: ["Delegated agent tasks", "Domain-specific schemas", "Tool execution permissions", "Agent state buffers"],
    outputsProduced: ["Specialist Finding Reports", "Domain Confidence Scores", "Triage Recommendations", "Synthesized Mission Steps"],
    copilotIntegration: "Copilot orchestrates agents sequentially: Security Analyst investigates vulnerabilities, Risk Analyst evaluates blast radius, Report Generator writes the audit memo.",
    status: "Implemented & Verified",
  },
  {
    id: "plugins",
    name: "Plugins Framework",
    category: "Extensibility",
    icon: Sparkles,
    tagline: "Manifest-driven custom capabilities, sandboxed execution, and safe tools",
    whatItDoes:
      "Allows engineering teams to install or author modular plugins that register new skills, inspection commands, hooks, and automated workflows into the Brahma engine.",
    whyItExists:
      "Every engineering organization has proprietary governance rules. Brahma plugins make the analysis pipeline customizable without modifying core platform code.",
    dataInputs: ["Plugin YAML/JSON manifests", "Custom hook triggers", "Execution sandbox configurations"],
    outputsProduced: ["Active Capability Catalog", "Sandboxed Tool Registry", "Permission Scope Ledger", "Audit Event Logs"],
    copilotIntegration: "Copilot discovers registered plugin tools at runtime and invokes them with user-approved permission boundaries.",
    status: "Implemented & Verified",
  },
  {
    id: "connectors",
    name: "Connectors Hub",
    category: "Extensibility",
    icon: Globe,
    tagline: "MCP-compatible external integrations for GitHub, Supabase, Kaggle, and Cloud",
    whatItDoes:
      "Establishes authenticated, rate-limited, and audited bridges to external developer tools, cloud data warehouses, and repository hosts via Model Context Protocol (MCP).",
    whyItExists:
      "Engineering data is fragmented across GitHub, databases, cloud providers, and issue trackers. Connectors bring structured context into Brahma safely.",
    dataInputs: ["OAuth tokens & API credentials (server-side)", "External REST endpoints", "Webhook callbacks"],
    outputsProduced: ["Synchronized Connector Feeds", "Connection Health Telemetry", "Rate Limit Budget Tracking", "Encrypted Credential Vault"],
    copilotIntegration: "Copilot invokes connectors to pull fresh git commits or database schemas without leaking raw credentials to the client interface.",
    status: "Implemented & Verified",
  },
  {
    id: "realtime-analysis",
    name: "Realtime Analysis Pipeline",
    category: "Operations",
    icon: Radio,
    tagline: "12-stage asynchronous analysis event bus with WebSocket telemetry",
    whatItDoes:
      "Streams granular progress from background Celery workers and Python analyzers to the frontend over WebSocket connections, updating metrics, graphs, and findings live.",
    whyItExists:
      "Complex AST analysis and security scans take seconds to minutes. Realtime streaming provides instantaneous feedback and progressive UI revelation without page reloads.",
    dataInputs: ["Worker progress events", "AST parse telemetry", "Security scan streams", "WebSocket state packets"],
    outputsProduced: ["Live 12-Stage Timeline UI", "Instant Metric Calculations", "Realtime Alert Ticker", "Server-Confirmed State Sync"],
    copilotIntegration: "Copilot receives live stage events to notify the user the exact moment a critical security flaw or release blocker is detected.",
    status: "Implemented & Verified",
  },
  {
    id: "release-intelligence",
    name: "Release Intelligence",
    category: "Governance",
    icon: Award,
    tagline: "Deterministic policy gates, zero-tolerance blockers, and release certificates",
    whatItDoes:
      "Evaluates codebases against formal gate criteria: zero Critical/High vulnerabilities, maintainability > 70, test traceability > 85%, and architecture drift = 0%.",
    whyItExists:
      "Subjective release meetings lead to regressions and catastrophic outages. Brahma converts release readiness into an objective, verifiable mathematical formula.",
    dataInputs: ["Gate policy configuration", "Latest AST metrics", "Bandit vulnerability list", "Traceability matrix state"],
    outputsProduced: ["Binary Pass/Fail Release Gate", "Blocker Remediation Checklist", "Cryptographic Release Seal", "Signed Verification Manifest"],
    copilotIntegration: "When asked 'Is this project ready for release?', Copilot evaluates all gates deterministically and generates the tamper-evident release certificate.",
    status: "Implemented & Verified",
  },
  {
    id: "reporting",
    name: "Reporting Engine",
    category: "Operations",
    icon: FileText,
    tagline: "Executive, technical, and compliance PDF generation via ReportLab",
    whatItDoes:
      "Compiles high-resolution, multi-page engineering reports including architecture diagrams, security findings, test traceability, and KPI impact charts for stakeholders.",
    whyItExists:
      "Engineering leaders need concrete, shareable documentation for board presentations, compliance audits, and security sign-offs.",
    dataInputs: ["Project metadata", "Health telemetry", "Security finding records", "Architecture graph layout"],
    outputsProduced: ["Executive PDF Summaries", "Academic Technical Reports", "SOC2 / ISO Evidence Packs", "Printable Audit Artifacts"],
    copilotIntegration: "The Report Generator specialist agent compiles analysis evidence directly into structured PDF templates on command.",
    status: "Implemented & Verified",
  },
  {
    id: "audit-provenance",
    name: "Audit & Provenance Vault",
    category: "Governance",
    icon: Fingerprint,
    tagline: "Immutable SHA-256 Merkle logging, change attribution, and tamper verification",
    whatItDoes:
      "Maintains an append-only cryptographic event log of every analysis run, gate evaluation, AI recommendation, and code modification with SHA-256 hashes.",
    whyItExists:
      "In enterprise environments, knowing who approved what and why an AI made a recommendation is mandatory for legal compliance and forensic review.",
    dataInputs: ["User IDs & action types", "Timestamp & IP address", "Input artifact SHA-256", "Output artifact SHA-256"],
    outputsProduced: ["Immutable Audit Ledger", "Cryptographic Provenance Receipts", "Tamper Verification Badges", "Forensic Event Trace"],
    copilotIntegration: "Every suggestion, mission plan, and gate sign-off executed by Copilot is automatically hashed and appended to the immutable audit trail.",
    status: "Implemented & Verified",
  },
  {
    id: "demo-simulation",
    name: "Demo & Simulation Lab",
    category: "Operations",
    icon: RefreshCw,
    tagline: "Zero-credential isolated sandbox with synthetic data and instant scenario resets",
    whatItDoes:
      "Provides a completely isolated sandbox where evaluators can test full platform capabilities, simulate high-severity security breaches, inject architecture drift, and inspect Copilot without credentials.",
    whyItExists:
      "Prospective users and security teams need to evaluate capabilities safely without connecting private repositories or production databases.",
    dataInputs: ["Curated industry scenarios (FinTech, HealthTech, EdTech)", "Deterministic seed data", "Simulated Git events"],
    outputsProduced: ["Isolated Sandbox Workspace", "Deterministic Analysis Outputs", "One-Click Scenario Reset", "Safe Simulation Badge"],
    copilotIntegration: "In Demo Mode, Copilot operates over curated synthetic knowledge bases with full fidelity while prohibiting any mutation of production data.",
    status: "Implemented & Verified",
  },
  {
    id: "project-health",
    name: "Project Health & Decay Predictor",
    category: "Operations",
    icon: TrendingUp,
    tagline: "Multi-dimensional composite scoring, maintainability decay, and business risk",
    whatItDoes:
      "Combines architecture, code health, security, test coverage, and git velocity into a single weighted Health Index (0-100) and predicts technical debt decay over 30/60/90 days.",
    whyItExists:
      "Software debt compounds silently until velocity grinds to a halt. Brahma visualizes the future cost of today's shortcuts in engineering days and monetary impact.",
    dataInputs: ["Historical AST scores", "Git churn rate", "Defect arrival frequency", "Dependency age"],
    outputsProduced: ["Composite Health Score (0-100)", "30/60/90-Day Decay Curves", "Estimated Refactoring Costs", "Business KPI Risk Mapping"],
    copilotIntegration: "Copilot highlights which three files contribute 60%+ of the project's projected technical debt decay and drafts a prioritized remediation plan.",
    status: "Implemented & Verified",
  },
];

// ============================================================================
// 3. 8-TIER TECHNOLOGY FOUNDATION (Requirement 240-278, 778-797)
// ============================================================================
export interface TechTier {
  layer: string;
  name: string;
  technologies: {
    name: string;
    role: string;
    whyChosen: string;
    category: string;
  }[];
}

export const TECHNOLOGY_TIERS: TechTier[] = [
  {
    layer: "01",
    name: "Frontend Application & Visual Canvas",
    technologies: [
      {
        name: "React 19 & TypeScript",
        role: "Component runtime and strict type system",
        whyChosen: "Zero-runtime overhead type safety across 95+ routes with concurrent rendering.",
        category: "Client",
      },
      {
        name: "TanStack Router & Query",
        role: "Type-safe route hierarchy and stale-while-revalidate data cache",
        whyChosen: "First-class search parameter typing, deep-link preservation, and sub-10ms route transitions.",
        category: "Routing & Data",
      },
      {
        name: "React Flow",
        role: "Interactive node-graph visualizer for architecture blueprints",
        whyChosen: "Hardware-accelerated SVG/canvas rendering for complex directed acyclic graphs with 100+ nodes.",
        category: "Visualization",
      },
      {
        name: "Tailwind CSS & Radix UI",
        role: "Token-driven design system with unstyled accessible primitives",
        whyChosen: "WCAG 2.1 AA accessible navigation, dialogs, drawers, and dark-mode engineering palette.",
        category: "Design System",
      },
      {
        name: "Recharts",
        role: "Composable SVG charting for metrics and risk distributions",
        whyChosen: "High-density engineering visualization for cyclomatic complexity and health distributions.",
        category: "Analytics",
      },
    ],
  },
  {
    layer: "02",
    name: "Data & Persistence Layer",
    technologies: [
      {
        name: "Supabase & PostgreSQL",
        role: "Relational persistence, JSONB schemas, and Row-Level Security (RLS)",
        whyChosen: "Enterprise ACID guarantees, multi-tenant isolation policies, and sub-millisecond indexed queries.",
        category: "Database",
      },
      {
        name: "PostgreSQL LISTEN/NOTIFY",
        role: "Low-latency asynchronous event broker",
        whyChosen: "Native database pub/sub eliminates separate Kafka overhead for lightweight state distribution.",
        category: "Event Streaming",
      },
    ],
  },
  {
    layer: "03",
    name: "Static & Dynamic Analysis Layer",
    technologies: [
      {
        name: "Lizard Static Analyzer",
        role: "Multi-language cyclomatic complexity and AST parser",
        whyChosen: "Deterministic AST inspection across C/C++, Java, Python, JavaScript with zero hallucination.",
        category: "Static Analysis",
      },
      {
        name: "Bandit Security Scanner",
        role: "Python AST vulnerability finder mapped to CWE taxonomy",
        whyChosen: "Deep AST syntax inspection catching SQL injection, shell escapes, and hardcoded secret keys.",
        category: "Security Scanning",
      },
      {
        name: "Python FastAPI",
        role: "High-performance asynchronous analysis microservice gateway",
        whyChosen: "Pydantic v2 data validation, OpenAPI automated contract generation, and native async worker calls.",
        category: "Backend Services",
      },
    ],
  },
  {
    layer: "04",
    name: "AI Gateway 2.0 & Orchestration",
    technologies: [
      {
        name: "AI Gateway 2.0 (Dual Provider)",
        role: "Multi-provider LLM router with automatic failover and semantic cache",
        whyChosen: "Instant failover between OpenAI and OpenRouter with 1ms cached replay for deterministic analysis.",
        category: "AI Routing",
      },
      {
        name: "Semantic Cache Engine",
        role: "In-memory exact & similarity prompt response cache",
        whyChosen: "Zero-latency, zero-cost replay of previously validated architectural blueprints and AST audits.",
        category: "Performance",
      },
      {
        name: "Central Copilot Agent Runtime",
        role: "Autonomous context retrieval, multi-step mission planner, and tool caller",
        whyChosen: "Bounded execution with hard recursion caps, safety checks, and deterministic gate verification.",
        category: "AI Agent",
      },
    ],
  },
  {
    layer: "05",
    name: "Integration & External Fabric",
    technologies: [
      {
        name: "GitHub API & Webhooks",
        role: "Repository mirroring, commit sync, and PR comment bot",
        whyChosen: "Direct bidirectional synchronization between git changesets and living architecture models.",
        category: "VCS",
      },
      {
        name: "Model Context Protocol (MCP)",
        role: "Standardized tool calling and connector protocol",
        whyChosen: "Vendor-neutral interface allowing external data sources to act as first-class Copilot tools.",
        category: "Protocols",
      },
    ],
  },
  {
    layer: "06",
    name: "Security, Governance & Audit",
    technologies: [
      {
        name: "Row-Level Security (RLS)",
        role: "Cryptographic multi-tenant database boundary",
        whyChosen: "Guarantees that no tenant can read or mutate another tenant's project blueprints or findings.",
        category: "Data Security",
      },
      {
        name: "SHA-256 Provenance Ledger",
        role: "Immutable cryptographic hashing of artifacts and gate sign-offs",
        whyChosen: "Tamper-evident verification guaranteeing that certified releases match inspected code SHAs.",
        category: "Integrity",
      },
    ],
  },
  {
    layer: "07",
    name: "Reporting & Export Subsystem",
    technologies: [
      {
        name: "ReportLab PDF Engine",
        role: "Vector graphics and PDF publication compiler",
        whyChosen: "Pixel-perfect multi-page engineering reports ready for board, security, and ISO/SOC2 audits.",
        category: "Document Generation",
      },
    ],
  },
  {
    layer: "08",
    name: "Asynchronous Infrastructure & Workers",
    technologies: [
      {
        name: "Celery & Redis Workers",
        role: "Distributed background task queue for heavy AST and security scans",
        whyChosen: "Non-blocking execution of repository-wide scans with priority queuing and automatic retry.",
        category: "Task Distribution",
      },
      {
        name: "Vite Build Engine",
        role: "ESM-native development and optimized production bundling",
        whyChosen: "Instant HMR development workflow with treeshaken, highly optimized production bundles.",
        category: "Build Infrastructure",
      },
    ],
  },
];

// ============================================================================
// 4. 18 INTERACTIVE ARCHITECTURE GRAPH NODES (Requirement 211-239)
// ============================================================================
export interface ArchNode {
  id: string;
  label: string;
  layer: "Frontend" | "Core API" | "Analysis" | "AI & Agents" | "Persistence" | "External";
  icon: any;
  summary: string;
  inputs: string[];
  outputs: string[];
  operationalRole: string;
  whyItMatters: string;
  dependencies: string[];
}

export const ARCHITECTURE_NODES: ArchNode[] = [
  {
    id: "app-shell",
    label: "React 19 AppShell",
    layer: "Frontend",
    icon: Globe,
    summary: "Single-page responsive UI with TanStack routing, dark theme, and microinteractions.",
    inputs: ["User input", "WebSocket telemetry", "REST API JSON"],
    outputs: ["DOM state", "User commands", "Form dispatches"],
    operationalRole: "Hosts the unified workspace, architecture canvas, AST timelines, and Copilot drawer.",
    whyItMatters: "Provides sub-10ms UI responsiveness for dense engineering diagrams without full page reloads.",
    dependencies: ["supabase-auth", "fastapi-gateway", "realtime-broker"],
  },
  {
    id: "supabase-auth",
    label: "Auth Gateway & RLS",
    layer: "Frontend",
    icon: Lock,
    summary: "Supabase JWT session management and row-level security policy enforcement.",
    inputs: ["User credentials", "OAuth callbacks", "Bearer JWT tokens"],
    outputs: ["Scoped User Claims", "Active Session", "Tenant ID"],
    operationalRole: "Verifies user identity and attaches cryptographic tenant scopes to every database transaction.",
    whyItMatters: "Enforces strict project isolation so no user or organization can access unpermitted repositories.",
    dependencies: ["supabase-postgres"],
  },
  {
    id: "fastapi-gateway",
    label: "FastAPI Core Gateway",
    layer: "Core API",
    icon: Server,
    summary: "High-throughput asynchronous Python gateway exposing typed OpenAPI endpoints.",
    inputs: ["HTTP REST requests", "Webhook dispatches", "Internal service payloads"],
    outputs: ["JSON responses", "Celery task dispatches", "SSE event feeds"],
    operationalRole: "Orchestrates API calls, dispatches background scan tasks, and validates Pydantic schemas.",
    whyItMatters: "Coordinates lightweight HTTP operations and offloads CPU-heavy AST parsing to worker queues.",
    dependencies: ["supabase-postgres", "celery-workers", "ai-gateway"],
  },
  {
    id: "realtime-broker",
    label: "Realtime Event Bus",
    layer: "Core API",
    icon: Radio,
    summary: "PostgreSQL LISTEN/NOTIFY backed WebSocket streaming engine.",
    inputs: ["Worker status notifications", "Analysis stage completions", "Copilot agent events"],
    outputs: ["Live WebSocket frames", "Stage progress percentages", "Alert ticker events"],
    operationalRole: "Broadcasts live analysis progress and finding discoveries directly to connected client browsers.",
    whyItMatters: "Eliminates frustrating polling and provides instant visual verification during long-running scans.",
    dependencies: ["supabase-postgres"],
  },
  {
    id: "lizard-ast",
    label: "Lizard AST Analyzer",
    layer: "Analysis",
    icon: Code2,
    summary: "Deterministic static analyzer for cyclomatic complexity, token density, and duplication.",
    inputs: ["Raw source code", "File tree manifest", "Language grammar configurations"],
    outputs: ["Per-function cyclomatic complexity", "Maintainability Index", "Duplication matrix"],
    operationalRole: "Parses source files into abstract syntax trees to measure structural maintainability deterministically.",
    whyItMatters: "Provides objective, repeatable code health metrics with zero hallucination or LLM variance.",
    dependencies: ["celery-workers"],
  },
  {
    id: "bandit-security",
    label: "Bandit AST Security",
    layer: "Analysis",
    icon: ShieldAlert,
    summary: "AST-level vulnerability detector mapping code flaws to official CWE definitions.",
    inputs: ["Python/JS source files", "Syntax node trees", "Security rule definitions"],
    outputs: ["CWE vulnerability findings", "Severity classifications (Low/Med/High)", "Line-level fixes"],
    operationalRole: "Inspects AST nodes for insecure function calls, SQL injections, hardcoded keys, and shell execution.",
    whyItMatters: "Catches critical security vulnerabilities before code is deployed, mapped to compliance standards.",
    dependencies: ["celery-workers"],
  },
  {
    id: "celery-workers",
    label: "Celery Task Workers",
    layer: "Analysis",
    icon: Cpu,
    summary: "Distributed asynchronous worker cluster managing multi-stage repository analysis runs.",
    inputs: ["Queued task IDs", "Repository clone paths", "Scan configuration flags"],
    outputs: ["Analysis results in Postgres", "Realtime progress events", "Failure error records"],
    operationalRole: "Executes AST parsing, dependency checks, and security scans concurrently across worker pools.",
    whyItMatters: "Keeps the web gateway instantly responsive while processing million-line codebases in background threads.",
    dependencies: ["supabase-postgres", "realtime-broker"],
  },
  {
    id: "ai-gateway",
    label: "AI Gateway 2.0",
    layer: "AI & Agents",
    icon: BrainCircuit,
    summary: "Multi-provider LLM gateway with semantic cache, token management, and instant failover.",
    inputs: ["Structured prompts", "Context packets", "Provider routing rules"],
    outputs: ["Generated blueprints", "Copilot syntheses", "Remediation suggestions"],
    operationalRole: "Routes requests between OpenAI and OpenRouter with sub-millisecond semantic cache lookups.",
    whyItMatters: "Prevents downtime from vendor rate limits, reduces token costs by 60%, and ensures resilient AI ops.",
    dependencies: ["supabase-postgres"],
  },
  {
    id: "copilot-engine",
    label: "Brahma Copilot Engine",
    layer: "AI & Agents",
    icon: Sparkles,
    summary: "Autonomous engineering intelligence coordinator with memory, missions, and tool access.",
    inputs: ["User engineering questions", "Current project state", "Analysis findings"],
    outputs: ["Mission plans", "Tool call instructions", "Evidence-backed answers", "Release seals"],
    operationalRole: "Translates high-level goals into multi-step tool calls, agent delegations, and auditable summaries.",
    whyItMatters: "Unlike basic chatbots, Copilot has authoritative access to real project AST metrics and release gates.",
    dependencies: ["ai-gateway", "specialist-agents", "release-evaluator"],
  },
  {
    id: "specialist-agents",
    label: "Specialist Agents Mesh",
    layer: "AI & Agents",
    icon: Boxes,
    summary: "7 bounded specialist workers (Security, Risk, Data Quality, Research, Anomaly, Reporting).",
    inputs: ["Scoped mission tasks", "Specialist toolkits", "Recursion limits"],
    outputs: ["Domain reports", "Risk assessments", "Anomaly verifications"],
    operationalRole: "Carries out deep vertical investigations without distraction or uncontrolled execution loops.",
    whyItMatters: "Ensures specialist domain rigor while the central Copilot maintains overall project perspective.",
    dependencies: ["copilot-engine", "ai-gateway"],
  },
  {
    id: "plugin-runtime",
    label: "Plugin Sandbox Runtime",
    layer: "AI & Agents",
    icon: Terminal,
    summary: "Manifest-driven execution sandbox for custom hooks, commands, and proprietary analyzers.",
    inputs: ["Plugin manifests", "Event trigger hooks", "Scoped data payloads"],
    outputs: ["Custom tool results", "Augmented metrics", "Audit logs"],
    operationalRole: "Executes third-party and enterprise-specific governance extensions with strict permission boundaries.",
    whyItMatters: "Enables deep extensibility without compromising core platform stability or security.",
    dependencies: ["copilot-engine"],
  },
  {
    id: "connectors-hub",
    label: "Connectors Hub (MCP)",
    layer: "External",
    icon: Globe,
    summary: "Model Context Protocol compatible connectors for GitHub, PostgreSQL, Kaggle, and Cloud.",
    inputs: ["External service API calls", "OAuth credentials", "Data queries"],
    outputs: ["Normalized data streams", "Repository trees", "Dataset schemas"],
    operationalRole: "Standardizes external API access and protects vendor credentials behind server boundaries.",
    whyItMatters: "Provides a single unified protocol for pulling outside code, data, and issue tracker intelligence.",
    dependencies: ["fastapi-gateway"],
  },
  {
    id: "github-sync",
    label: "GitHub Mirror Sync",
    layer: "External",
    icon: GitBranch,
    summary: "Bi-directional GitHub integration tracking webhook pushes, PR branches, and commits.",
    inputs: ["GitHub webhook events", "Pull request events", "Git tree hashes"],
    outputs: ["Mirror state updates", "Change impact alerts", "Automated PR comments"],
    operationalRole: "Ingests repository changes the instant developers push, triggering incremental AST analysis.",
    whyItMatters: "Bridges the gap between code authoring in Git and architectural governance in Brahma.",
    dependencies: ["connectors-hub", "fastapi-gateway"],
  },
  {
    id: "supabase-postgres",
    label: "PostgreSQL Database",
    layer: "Persistence",
    icon: Database,
    summary: "Relational storage engine hosting project blueprints, AST metrics, user accounts, and gates.",
    inputs: ["SQL queries", "JSONB documents", "Transaction commits"],
    outputs: ["Query records", "Relational joins", "LISTEN/NOTIFY events"],
    operationalRole: "Authoritative persistent store for all engineering state with strict relational integrity.",
    whyItMatters: "Guarantees transactional consistency, schema versioning, and enterprise data durability.",
    dependencies: [],
  },
  {
    id: "reportlab-engine",
    label: "ReportLab PDF Compiler",
    layer: "Analysis",
    icon: FileText,
    summary: "Automated vector PDF document generator for executive and compliance reporting.",
    inputs: ["Project findings", "Architecture diagrams", "Gate evaluation logs"],
    outputs: ["High-resolution PDF documents", "Printable audit summaries"],
    operationalRole: "Compiles complex multi-dimensional project intelligence into polished executive deliverables.",
    whyItMatters: "Produces tangible, tamper-evident documents for SOC2 compliance, executive sign-offs, and audits.",
    dependencies: ["fastapi-gateway"],
  },
  {
    id: "audit-vault",
    label: "Immutable Audit Vault",
    layer: "Persistence",
    icon: Fingerprint,
    summary: "Append-only SHA-256 Merkle log storing verifiable event receipts and AI actions.",
    inputs: ["Action records", "Generated artifact hashes", "User/Agent signatures"],
    outputs: ["Cryptographic audit receipts", "Provenance chain verification"],
    operationalRole: "Records an unalterable history of every analysis run, gate override, and Copilot recommendation.",
    whyItMatters: "Provides forensic proof of architectural compliance and accountability for every AI decision.",
    dependencies: ["supabase-postgres"],
  },
  {
    id: "release-evaluator",
    label: "Release Gate Evaluator",
    layer: "Analysis",
    icon: Award,
    summary: "Deterministic rule engine that validates metrics against strict deployment policies.",
    inputs: ["AST complexity scores", "Bandit vulnerability list", "Traceability percentage", "Gate rules"],
    outputs: ["Pass/Fail decision", "Blocking violations ledger", "Cryptographic Release Seal"],
    operationalRole: "Acts as the final authoritative release checkpoint, enforcing zero-tolerance quality gates.",
    whyItMatters: "Replaces subjective human release arguments with unambiguous mathematical verification.",
    dependencies: ["lizard-ast", "bandit-security", "audit-vault"],
  },
  {
    id: "demo-sandbox",
    label: "Demo Simulation Lab",
    layer: "Core API",
    icon: RefreshCw,
    summary: "Isolated in-memory simulation container executing safe deterministic demonstration scenarios.",
    inputs: ["Pre-computed scenario seeds", "Interactive simulation commands"],
    outputs: ["Simulated analysis streams", "Pre-packaged finding graphs", "Instant reset confirmations"],
    operationalRole: "Powers public showcases and safe product experimentation with zero risk to production data.",
    whyItMatters: "Allows evaluators to experience full platform power safely without configuring external credentials.",
    dependencies: ["fastapi-gateway"],
  },
];

// ============================================================================
// 5. GITHUB MIRROR STORY PIPELINE (Requirement 166-186)
// ============================================================================
export interface GitHubPipelineStage {
  step: number;
  id: string;
  name: string;
  badge: string;
  summary: string;
  inputData: string;
  processingDetails: string;
  sampleOutput: {
    title: string;
    metrics: { label: string; value: string; status: "good" | "warn" | "bad" }[];
    details: string;
  };
  copilotInsight: string;
}

export const GITHUB_PIPELINE_STAGES: GitHubPipelineStage[] = [
  {
    step: 1,
    id: "webhook-ingest",
    name: "Repository Ingestion & Webhook",
    badge: "Stage 01",
    summary: "Pulls pull_request or push webhook payloads from GitHub with commit SHA and file delta manifests.",
    inputData: "GitHub Webhook Event: pull_request.opened (PR #142, branch: feat/payment-v2)",
    processingDetails: "Validates HMAC SHA-256 signature, resolves author identity, and clones shallow git tree delta into ephemeral sandbox.",
    sampleOutput: {
      title: "Incoming Changeset Detected",
      metrics: [
        { label: "Files Changed", value: "7 files", status: "good" },
        { label: "Lines Added", value: "+342", status: "good" },
        { label: "Lines Deleted", value: "-89", status: "good" },
      ],
      details: "Branch feat/payment-v2 touches src/services/billing.ts, src/api/checkout.py, and migrations/004_cards.sql.",
    },
    copilotInsight: "Copilot logs the incoming pull request and initializes a change impact mission to inspect affected services.",
  },
  {
    step: 2,
    id: "change-ast",
    name: "Change Detection & AST Delta",
    badge: "Stage 02",
    summary: "Executes Lizard AST parser on changed files to calculate complexity changes per function.",
    inputData: "AST trees of checkout.py and billing.ts compared against main branch baseline (SHA 9a3f01b).",
    processingDetails: "Identifies newly introduced functions, calculates cyclomatic complexity deltas, and flags functions exceeding threshold (>15).",
    sampleOutput: {
      title: "AST Complexity Shift",
      metrics: [
        { label: "Max Complexity", value: "18 (process_charge)", status: "warn" },
        { label: "Avg Complexity", value: "4.2 (+0.8)", status: "warn" },
        { label: "Maintainability", value: "68 / 100 (-4)", status: "warn" },
      ],
      details: "Function 'process_charge()' in checkout.py has 18 branching paths (threshold: 15). Recommended: split charge validation.",
    },
    copilotInsight: "Copilot drafts a refactoring suggestion to decouple charge validation from gateway dispatch.",
  },
  {
    step: 3,
    id: "impact-analysis",
    name: "Architecture Impact Analysis",
    badge: "Stage 03",
    summary: "Traverses dependency topology to determine which downstream services rely on modified files.",
    inputData: "Service dependency DAG from architecture blueprint + imported symbols in checkout.py.",
    processingDetails: "Detects direct imports from Auth Service and Order Gateway; checks whether new database calls cross bounded context rules.",
    sampleOutput: {
      title: "Blast Radius Topology",
      metrics: [
        { label: "Direct Impact", value: "2 Services", status: "good" },
        { label: "Downstream Services", value: "Order, Analytics", status: "warn" },
        { label: "Boundary Integrity", value: "Clean (No cross-talk)", status: "good" },
      ],
      details: "Payment service changes impact Order Fulfillment and Billing Analytics. No illegal imports detected.",
    },
    copilotInsight: "Copilot notifies that Order Fulfillment integration tests must be scheduled due to downstream signature changes.",
  },
  {
    step: 4,
    id: "drift-analysis",
    name: "Architecture Drift Analysis",
    badge: "Stage 04",
    summary: "Compares current repository state against the validated system blueprint to catch unapproved endpoints or schemas.",
    inputData: "Blueprint schema contract v1.4 vs migrations/004_cards.sql and new REST route /api/v2/charge.",
    processingDetails: "Flags that /api/v2/charge adds a 'client_secret' query param that is absent from the approved blueprint contract.",
    sampleOutput: {
      title: "Contract Divergence Detected",
      metrics: [
        { label: "Drift Index", value: "12% Divergence", status: "bad" },
        { label: "Unapproved Routes", value: "1 Endpoint", status: "bad" },
        { label: "Schema Drift", value: "0 Violations", status: "good" },
      ],
      details: "GET /api/v2/charge was introduced without a corresponding requirement in the architecture blueprint. Architectural drift flagged.",
    },
    copilotInsight: "Copilot marks the PR as having architectural drift: either update the blueprint with approval or refactor the endpoint.",
  },
  {
    step: 5,
    id: "security-scan",
    name: "Security & Vulnerability Scan",
    badge: "Stage 05",
    summary: "Runs Bandit AST scanner across the PR patch to catch injection, credential leakage, and insecure deserialization.",
    inputData: "Bandit AST analysis on checkout.py and migrations/004_cards.sql.",
    processingDetails: "Evaluates raw string interpolations in SQL statements and verifies cryptographic randomness.",
    sampleOutput: {
      title: "Security Scan Triage",
      metrics: [
        { label: "Critical Findings", value: "0 Vulnerabilities", status: "good" },
        { label: "High Severity", value: "0 Vulnerabilities", status: "good" },
        { label: "Medium Warning", value: "1 (CWE-327 weak hash)", status: "warn" },
      ],
      details: "Use of hashlib.md5 detected in card masking utility. Suggest upgrading to SHA-256 for compliant hashing.",
    },
    copilotInsight: "Security Specialist Agent recommends replacing md5 tokenization with SHA-256 HMAC prior to production promotion.",
  },
  {
    step: 6,
    id: "test-traceability",
    name: "Requirements & Test Traceability",
    badge: "Stage 06",
    summary: "Validates that changes to payment workflows trace back to verified EARS requirements and possess passing test suites.",
    inputData: "Requirement REQ-PAY-004 (Payment Processing) and test files test_checkout.py.",
    processingDetails: "Inspects test coverage on the modified lines and verifies that REQ-PAY-004 acceptance criteria are validated.",
    sampleOutput: {
      title: "Traceability Verification",
      metrics: [
        { label: "Req Coverage", value: "100% (REQ-PAY-004)", status: "good" },
        { label: "Branch Coverage", value: "92% (+4%)", status: "good" },
        { label: "Untested Paths", value: "1 (Timeout retry)", status: "warn" },
      ],
      details: "All main success criteria for REQ-PAY-004 are tested. Network timeout retry condition lacks an explicit unit test assertion.",
    },
    copilotInsight: "Copilot generates an automated Pytest test case template for the network timeout retry condition.",
  },
  {
    step: 7,
    id: "release-intelligence",
    name: "Release Intelligence & Gate Verification",
    badge: "Stage 07",
    summary: "Runs deterministic release gate rules to determine whether this pull request is safe to merge and deploy.",
    inputData: "Consolidated metrics: Cyclomatic (18), Drift (12%), Security (0 High), Traceability (100%).",
    processingDetails: "Evaluates against default policy: Zero critical/high vulnerabilities (PASS), Drift < 5% (FAIL), Cyclomatic < 15 (FAIL).",
    sampleOutput: {
      title: "Release Gate Decision: CONDITIONAL HOLD",
      metrics: [
        { label: "Gate Decision", value: "HOLD (2 Blockers)", status: "bad" },
        { label: "Security Gate", value: "PASSED", status: "good" },
        { label: "Drift Gate", value: "FAILED (12% > 5%)", status: "bad" },
      ],
      details: "Merge is blocked until architectural drift on /api/v2/charge is approved and process_charge complexity is reduced below 15.",
    },
    copilotInsight: "Copilot posts a structured status comment to GitHub PR #142 detailing the two remediation items needed for release approval.",
  },
];

// ============================================================================
// 6. HOW IT WORKS: 10-PHASE LIFECYCLE (Requirement 187-210)
// ============================================================================
export interface LifecyclePhase {
  phase: number;
  name: string;
  headline: string;
  description: string;
  deterministicRole: string;
  aiRole: string;
  keyArtifact: string;
}

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    phase: 1,
    name: "Understand Intent",
    headline: "Transform unstructured briefs into unambiguous EARS requirements",
    description: "Ingests raw product specs, user stories, or briefs and structures them into functional and non-functional requirements with confidence scores.",
    deterministicRole: "Grammar parsing, requirement ID generation, duplicate clause detection.",
    aiRole: "Context understanding, ambiguity resolution, user persona synthesis.",
    keyArtifact: "EARS Requirement Catalog",
  },
  {
    phase: 2,
    name: "Build the Blueprint",
    headline: "Generate verifiable service topology, schema, and API contracts",
    description: "Derives the architectural system graph, database entities, foreign keys, and REST/gRPC contracts directly from validated requirements.",
    deterministicRole: "Relational integrity checks, acyclic DAG validation, schema normalization.",
    aiRole: "Architecture pattern recommendation (event-driven vs monolith, caching strategy).",
    keyArtifact: "Executable System Blueprint (JSON + DAG)",
  },
  {
    phase: 3,
    name: "Observe Implementation",
    headline: "Mirror live Git reality and synchronize file trees with architecture",
    description: "Connects to repository webhooks, mirroring commit history, pull requests, and file trees into the Brahma intelligence model.",
    deterministicRole: "Git tree parsing, SHA tracking, webhook signature authentication.",
    aiRole: "Semantic commit grouping and author intent summarization.",
    keyArtifact: "Live Git Mirror State",
  },
  {
    phase: 4,
    name: "Analyze Code & Architecture",
    headline: "Execute AST parsing for cyclomatic complexity and maintainability",
    description: "Runs Lizard and AST parsers across all source code to isolate hotspot functions, duplicate logic, and structural decay.",
    deterministicRole: "Exact cyclomatic complexity calculation, token count, maintainability index.",
    aiRole: "Root-cause diagnosis of why complexity exists and targeted refactoring advice.",
    keyArtifact: "AST Health Metric Ledger",
  },
  {
    phase: 5,
    name: "Connect Requirements & Tests",
    headline: "Construct bi-directional traceability matrix from requirements to verification",
    description: "Maps every functional requirement to its implementation code files and verification test assertions, exposing coverage voids.",
    deterministicRole: "Regex/AST test runner mapping, symbol lookup, pass/fail assertion tally.",
    aiRole: "Synthesizes missing test assertions for untested requirement edge cases.",
    keyArtifact: "Traceability Matrix (Req ↔ Code ↔ Test)",
  },
  {
    phase: 6,
    name: "Detect Risk & Drift",
    headline: "Identify architectural divergence, schema mutations, and vulnerabilities",
    description: "Compares current repository implementation against initial blueprint intent to catch undocumented endpoints and Bandit security flaws.",
    deterministicRole: "Schema diff calculation, Bandit AST CWE matching, endpoint cataloging.",
    aiRole: "STRIDE threat modeling and business blast radius estimation.",
    keyArtifact: "Drift & Vulnerability Ledger",
  },
  {
    phase: 7,
    name: "Investigate",
    headline: "Conduct deep-dive forensic analysis on anomalies and hotspots",
    description: "Drills into anomalous metrics, unexpected performance bottlenecks, or security alerts with file-level lineage tracking.",
    deterministicRole: "Call-graph traversal, dependency circularity checks, data flow tracing.",
    aiRole: "Specialist agent investigation across data, security, and anomaly domains.",
    keyArtifact: "Forensic Investigation Dossier",
  },
  {
    phase: 8,
    name: "AI Interpretation & Orchestration",
    headline: "Leverage Copilot to coordinate multi-agent missions and tool execution",
    description: "Copilot synthesizes intelligence from all analysis engines to answer high-level engineering questions and coordinate bounded specialist agents.",
    deterministicRole: "Bounded recursion enforcement, tool permission checks, rate limit controls.",
    aiRole: "Multi-step mission planning, semantic cross-domain reasoning, executive synthesis.",
    keyArtifact: "Copilot Mission Execution Plan",
  },
  {
    phase: 9,
    name: "Verify Release Readiness",
    headline: "Execute deterministic release gates with zero-tolerance blockers",
    description: "Applies strict mathematical release policies across security, maintainability, drift, and traceability to make an objective release decision.",
    deterministicRole: "Authoritative pass/fail decision based on strict numeric policy thresholds.",
    aiRole: "Generates clear plain-language remediation instructions for failing blockers.",
    keyArtifact: "Tamper-Evident Release Certificate",
  },
  {
    phase: 10,
    name: "Produce Auditable Outputs",
    headline: "Seal artifacts with SHA-256 provenance and generate executive PDF reports",
    description: "Computes cryptographic hashes for all findings, logs the decision to the immutable audit vault, and compiles board-ready PDF publications.",
    deterministicRole: "SHA-256 Merkle logging, PDF vector layout compilation, cryptographic signing.",
    aiRole: "Drafts executive summary memos and stakeholder sign-off briefs.",
    keyArtifact: "Signed PDF Publication & Merkle Hash",
  },
];

// ============================================================================
// 7. COPILOT RELEASE SCENARIO RUNNER (Requirement 279-307, 718-736)
// ============================================================================
export interface CopilotScenarioStep {
  step: number;
  phase: string;
  agentOrTool: string;
  actionSummary: string;
  evidence: string;
  findingBadge: { text: string; type: "success" | "warning" | "danger" | "info" };
}

export const COPILOT_RELEASE_SCENARIO: {
  question: string;
  projectContext: string;
  steps: CopilotScenarioStep[];
  finalVerdict: {
    status: "READY" | "BLOCKED" | "CONDITIONAL";
    score: number;
    sha256Seal: string;
    summary: string;
    blockers: string[];
    recommendations: string[];
  };
} = {
  question: "Is PROJECT BRAHMA ready for v2.4 Release?",
  projectContext: "Repository: brahma-insights-main | Commit: SHA 4f82d91 | Environment: Staging | 95 Routes",
  steps: [
    {
      step: 1,
      phase: "Context Retrieval",
      agentOrTool: "Copilot Context Engine",
      actionSummary: "Assembled project vector: 18 microservices, 412 source files, 95 routes, 14 requirements.",
      evidence: "Fetched latest AST scan results (2m ago) and active release gate policy: strict_tier1.",
      findingBadge: { text: "Context Loaded (100%)", type: "info" },
    },
    {
      step: 2,
      phase: "Mission Planning",
      agentOrTool: "Copilot Planner",
      actionSummary: "Synthesized 4-stage evaluation mission: Security Scan -> AST Health -> Traceability -> Drift Check.",
      evidence: "Planned sequential tool executions and delegated subtasks to Security and Risk agents.",
      findingBadge: { text: "Plan Formulated", type: "info" },
    },
    {
      step: 3,
      phase: "Security Verification",
      agentOrTool: "Security Specialist Agent (Bandit Tool)",
      actionSummary: "Scanned 14,280 lines of Python & TypeScript AST syntax trees.",
      evidence: "Zero Critical vulnerabilities. Zero High vulnerabilities. 1 Low note (MD5 hashing in non-crypto utility).",
      findingBadge: { text: "Security Gate PASSED", type: "success" },
    },
    {
      step: 4,
      phase: "Maintainability & AST Health",
      agentOrTool: "AST Analysis Tool (Lizard)",
      actionSummary: "Calculated cyclomatic complexity and maintainability index across all modules.",
      evidence: "Average Cyclomatic Complexity: 3.8 (Threshold: <15). Maintainability Index: 82/100 (Threshold: >70).",
      findingBadge: { text: "AST Health PASSED", type: "success" },
    },
    {
      step: 5,
      phase: "Requirement Traceability",
      agentOrTool: "Traceability Engine",
      actionSummary: "Checked bi-directional coverage from EARS requirements to Vitest/Pytest suites.",
      evidence: "14 of 14 Tier-1 requirements have verified passing test suites. Overall coverage: 94.2% (Threshold: >85%).",
      findingBadge: { text: "Traceability PASSED", type: "success" },
    },
    {
      step: 6,
      phase: "Architecture Drift Audit",
      agentOrTool: "Drift Analyzer",
      actionSummary: "Compared blueprint schema and API contract with actual repository routes.",
      evidence: "Zero undocumented API routes. Schema matches PostgreSQL migration ledger. Drift Index: 0.0%.",
      findingBadge: { text: "Zero Drift VERIFIED", type: "success" },
    },
    {
      step: 7,
      phase: "Release Gate Synthesis",
      agentOrTool: "Deterministic Release Evaluator",
      actionSummary: "Evaluated all 4 authoritative gate criteria against deterministic rules.",
      evidence: "All 4 criteria met. Release gate is mathematically satisfied with zero blockers.",
      findingBadge: { text: "Gate Authoritative PASS", type: "success" },
    },
    {
      step: 8,
      phase: "Cryptographic Seal & Provenance",
      agentOrTool: "Audit Vault Signer",
      actionSummary: "Generated tamper-evident release certificate signed with SHA-256 Merkle hash.",
      evidence: "Artifact sealed at 2026-09-14T10:14:00Z. Appended to immutable audit trail.",
      findingBadge: { text: "SHA-256 Provenance Sealed", type: "success" },
    },
  ],
  finalVerdict: {
    status: "READY",
    score: 96,
    sha256Seal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    summary:
      "PROJECT BRAHMA v2.4 meets 100% of the strict release criteria. All 14 Tier-1 requirements are traced to passing test assertions, zero high/critical security vulnerabilities exist, cyclomatic complexity is within safe limits (3.8), and architecture drift is 0.0%. Approved for production deployment.",
    blockers: [],
    recommendations: [
      "Upgrade MD5 hash utility in non-security token generator to SHA-256 in v2.5 sprint.",
      "Archive staging test run logs to cold storage after deployment.",
    ],
  },
};

// ============================================================================
// 8. 7 SPECIALIST AGENTS (Requirement 308-333)
// ============================================================================
export interface SpecialistAgent {
  id: string;
  name: string;
  icon: any;
  role: string;
  boundedScope: string;
  toolsAssigned: string[];
  sampleDelegation: string;
}

export const SPECIALIST_AGENTS: SpecialistAgent[] = [
  {
    id: "data-analyst",
    name: "Data Analyst Agent",
    icon: Database,
    role: "Profiles dataset distributions, missingness matrices, and schema relationships.",
    boundedScope: "Read-only access to database catalog and sample rows. Max recursion depth: 3.",
    toolsAssigned: ["schema_inspector", "null_distribution_profiler", "cardinality_counter"],
    sampleDelegation: "Copilot delegates: 'Validate whether payment_transactions table has duplicate idempotency_key values.'",
  },
  {
    id: "data-quality",
    name: "Data Quality Specialist",
    icon: ShieldCheck,
    role: "Calculates completeness, validity, and consistency scores across tabular datasets.",
    boundedScope: "Evaluates statistical properties against pre-set DQ budgets. Read-only.",
    toolsAssigned: ["data_health_scorer", "outlier_detector", "schema_drift_comparer"],
    sampleDelegation: "Copilot delegates: 'Inspect user onboarding dataset for anomalous null rates exceeding 5%.'",
  },
  {
    id: "dataset-researcher",
    name: "Dataset Researcher",
    icon: Search,
    role: "Connects to Kaggle and public data meshes to evaluate candidate training data.",
    boundedScope: "External query search and metadata extraction. No credential exposure.",
    toolsAssigned: ["kaggle_search", "metadata_parser", "license_verifier"],
    sampleDelegation: "Copilot delegates: 'Find verified MIT-licensed datasets matching healthcare diagnosis classification.'",
  },
  {
    id: "anomaly-investigator",
    name: "Anomaly Investigator",
    icon: AlertTriangle,
    role: "Isolates sudden shifts in latency, cyclomatic spikes, and git churn outliers.",
    boundedScope: "Historical metric delta correlation. Max execution timeout: 15s.",
    toolsAssigned: ["metric_timeseries_analyzer", "git_churn_correlator", "callstack_tracer"],
    sampleDelegation: "Copilot delegates: 'Investigate why checkout.py cyclomatic complexity doubled over the last 3 commits.'",
  },
  {
    id: "risk-analyst",
    name: "Risk Analyst Agent",
    icon: TrendingUp,
    role: "Quantifies technical debt, schedule slip probability, and blast radius of changes.",
    boundedScope: "Calculates impact metrics using heuristic risk tables. Zero direct code mutation.",
    toolsAssigned: ["blast_radius_calculator", "kpi_impact_mapper", "schedule_risk_predictor"],
    sampleDelegation: "Copilot delegates: 'Calculate the business delivery risk if we delay the payment microservice refactor by 2 sprints.'",
  },
  {
    id: "security-analyst",
    name: "Security Analyst Agent",
    icon: ShieldAlert,
    role: "Validates Bandit findings, classifies threats via STRIDE, and checks CWE definitions.",
    boundedScope: "AST syntax security analysis. Read-only inspection of source code and AST nodes.",
    toolsAssigned: ["bandit_ast_checker", "stride_classifier", "cwe_taxonomy_lookup"],
    sampleDelegation: "Copilot delegates: 'Confirm whether SQL query string on line 84 in billing.py allows raw SQL injection.'",
  },
  {
    id: "report-generator",
    name: "Report Generator Agent",
    icon: FileText,
    role: "Synthesizes multi-domain analysis findings into structured ReportLab PDF layouts.",
    boundedScope: "Document compilation and formatting only. Reads finalized audit records.",
    toolsAssigned: ["pdf_compiler", "chart_vectorizer", "executive_memo_formatter"],
    sampleDelegation: "Copilot delegates: 'Compile a 4-page executive release audit report for the v2.4 staging sign-off meeting.'",
  },
];

// ============================================================================
// 9. PRODUCT DIFFERENTIATION MATRIX (Requirement 452-465)
// ============================================================================
export interface DifferentiationRow {
  dimension: string;
  traditionalLinters: string;
  apmObservability: string;
  genericAIChatbots: string;
  projectBrahma: string;
}

export const DIFFERENTIATION_MATRIX: DifferentiationRow[] = [
  {
    dimension: "Core Focus",
    traditionalLinters: "Syntax, formatting & simple static code rules (ESLint, SonarQube)",
    apmObservability: "Runtime server latency & logs (Datadog, New Relic)",
    genericAIChatbots: "General conversational answering & code generation (ChatGPT)",
    projectBrahma: "Intent-to-release architecture governance, living blueprints & verified release readiness",
  },
  {
    dimension: "Architectural Intent vs Reality",
    traditionalLinters: "Blind to architecture diagrams and requirements",
    apmObservability: "Observes runtime network calls, not designed intent",
    genericAIChatbots: "Hallucinates architecture without project context",
    projectBrahma: "Continuously maps source AST and Git reality to executable blueprints and EARS requirements",
  },
  {
    dimension: "Requirement Traceability",
    traditionalLinters: "Zero requirement awareness",
    apmObservability: "Zero requirement awareness",
    genericAIChatbots: "Cannot guarantee test coverage against requirements",
    projectBrahma: "Bi-directional matrix linking every requirement clause to code files and passing assertions",
  },
  {
    dimension: "Release Authority",
    traditionalLinters: "Exit code 1 on style violations; no business risk awareness",
    apmObservability: "Post-facto alerts after production outages occur",
    genericAIChatbots: "No authority to block or certify releases",
    projectBrahma: "Deterministic mathematical release gates with cryptographic SHA-256 provenance seals",
  },
  {
    dimension: "AI Integration & Authority",
    traditionalLinters: "No AI reasoning",
    apmObservability: "Basic anomaly clustering",
    genericAIChatbots: "Unbounded suggestions with high hallucination risk",
    projectBrahma: "Central Copilot orchestrating 7 bounded specialist agents over deterministic AST facts",
  },
  {
    dimension: "Data & Drift Governance",
    traditionalLinters: "No database schema or drift governance",
    apmObservability: "Query execution timing only",
    genericAIChatbots: "Generic SQL tips",
    projectBrahma: "Detects schema divergence, unapproved API routes, and Kaggle/dataset quality drift",
  },
];

// ============================================================================
// 10. USE CASES & AUDIENCE (Requirement 410-450)
// ============================================================================
export interface UseCaseItem {
  id: string;
  title: string;
  audience: string;
  icon: any;
  problem: string;
  brahmaSolution: string;
  keyOutput: string;
  businessImpact: string;
}

export const USE_CASES: UseCaseItem[] = [
  {
    id: "architecture-drift",
    title: "Continuous Architecture Drift Detection",
    audience: "Software Architects & Tech Leads",
    icon: Network,
    problem: "As developers ship fast, services begin importing unauthorized modules and spinning up undocumented API routes.",
    brahmaSolution: "Brahma continuously matches git tree ASTs against the validated blueprint, flagging drift on every commit.",
    keyOutput: "Visual Drift Delta Map with line-level import boundary violations.",
    businessImpact: "Prevents modular architectures from degenerating into unmaintainable distributed monoliths.",
  },
  {
    id: "ai-code-governance",
    title: "AI-Generated Code Verification & Triage",
    audience: "Engineering Managers & Senior Devs",
    icon: BrainCircuit,
    problem: "Copilots and LLMs generate code 10x faster, but the code often lacks tests, introduces subtle CWE flaws, and drifts from SRS.",
    brahmaSolution: "Deterministic AST scanner checks cyclomatic complexity, Bandit scans for security flaws, and traceability engine verifies tests.",
    keyOutput: "Automated PR Triage Memo with blocker checklist and refactoring targets.",
    businessImpact: "Allows teams to safely adopt AI coding assistants without accumulating catastrophic architectural debt.",
  },
  {
    id: "deterministic-release",
    title: "Deterministic Pre-Release Verification",
    audience: "DevOps, QA Leads & Release Managers",
    icon: Award,
    problem: "Release approvals depend on subjective Slack consensus and superficial green CI checks that miss architectural flaws.",
    brahmaSolution: "Rigid mathematical policy gates enforce zero critical CWEs, maintainability > 70, and 100% Tier-1 test traceability.",
    keyOutput: "Tamper-Evident SHA-256 Release Certificate and signed PDF audit pack.",
    businessImpact: "Eliminates post-deployment rollback panics and slashes release cycle sign-off time from days to minutes.",
  },
  {
    id: "security-compliance",
    title: "Zero-Trust Security & CWE Remediation",
    audience: "AppSec & Compliance Teams",
    icon: ShieldCheck,
    problem: "Security scans produce thousands of noisy alerts detached from which software requirements or modules actually matter.",
    brahmaSolution: "Bandit AST scans are mapped directly to affected architecture modules with STRIDE threat classification and fix snippets.",
    keyOutput: "CWE-Mapped Finding Dossier with automated Copilot remediation code.",
    businessImpact: "Empowers developers to resolve vulnerabilities inside their workflow rather than fighting security backlog friction.",
  },
  {
    id: "legacy-refactoring",
    title: "Technical Debt & Maintainability Prioritization",
    audience: "Principal Engineers & CTOs",
    icon: TrendingUp,
    problem: "Engineering teams struggle to convince management where to invest refactoring budget without hard business impact evidence.",
    brahmaSolution: "Quantifies cyclomatic complexity hotspots and models 30/60/90-day technical debt decay in monetary and schedule terms.",
    keyOutput: "Technical Debt Decay Forecast with targeted Top-5 refactoring targets.",
    businessImpact: "Transforms technical debt arguments from vague developer frustration into prioritized business ROI investments.",
  },
  {
    id: "academic-audit",
    title: "Software Engineering Evaluation & Audit",
    audience: "Researchers, Universities & Auditing Firms",
    icon: FileText,
    problem: "Evaluating code quality across large student or enterprise codebases requires manual, subjective rubric grading.",
    brahmaSolution: "Standardized automated assessment of EARS compliance, cyclomatic complexity, AST health, and security posture.",
    keyOutput: "Objective Academic ReportLab PDF scoring every engineering dimension with statistical distributions.",
    businessImpact: "Provides reproducible, scientifically grounded evaluation of software engineering craftsmanship.",
  },
];
