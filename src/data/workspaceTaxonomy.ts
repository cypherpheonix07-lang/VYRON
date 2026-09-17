/**
 * VYRON — WORKSPACE ICON TAXONOMY (24 SEMANTIC CATEGORIES)
 * Canonical metadata registry for workspace identity and architectural classification.
 * Strictly ZERO SQL.
 */

import {
  Folder,
  Globe,
  Smartphone,
  Server,
  Brain,
  Shield,
  Terminal,
  Database,
  Cpu,
  Bot,
  Rocket,
  Layers,
  Code,
  Zap,
  BarChart3,
  Activity,
  Lock,
  Box,
  Workflow,
  Cloud,
  Sparkles,
  Wand2,
  Compass,
  Radio,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceCategory =
  | "Core & Platform"
  | "Application Systems"
  | "Intelligence & AI"
  | "Infrastructure & Operations"
  | "Security & Governance"
  | "Data & Analytics";

export interface WorkspaceIconDefinition {
  id: string;
  index: number;
  name: string;
  shortLabel: string;
  longLabel: string;
  description: string;
  icon: LucideIcon;
  category: WorkspaceCategory;
  suggestedTechnologies: string[];
  suggestedWorkflows: string[];
  suggestedTech: string[];
}

const RAW_WORKSPACE_TAXONOMY: Omit<WorkspaceIconDefinition, "id" | "suggestedTech">[] = [
  {
    index: 1,
    name: "Folder",
    shortLabel: "Core Platform",
    longLabel: "Core Platform & Foundation Systems",
    description: "Enterprise foundation services, shared libraries, core domain kernels, and base system architectures.",
    icon: Folder,
    category: "Core & Platform",
    suggestedTechnologies: ["TypeScript", "Go", "Rust", "Java", "Protobuf"],
    suggestedWorkflows: ["Monorepo Governance", "Core Library Distribution", "API Contract Versioning"],
  },
  {
    index: 2,
    name: "Globe",
    shortLabel: "Web Platform",
    longLabel: "Web Platform & Distributed Portals",
    description: "Modern web applications, high-performance customer portals, SSR architectures, and frontend design systems.",
    icon: Globe,
    category: "Application Systems",
    suggestedTechnologies: ["React", "TanStack Start", "Next.js", "Vite", "Tailwind CSS"],
    suggestedWorkflows: ["Web Vitals Auditing", "Design Token Sync", "Micro-Frontend Federation"],
  },
  {
    index: 3,
    name: "Smartphone",
    shortLabel: "Mobile System",
    longLabel: "Mobile & Embedded Client Systems",
    description: "Cross-platform mobile applications, offline-first client engines, and native device hardware integrations.",
    icon: Smartphone,
    category: "Application Systems",
    suggestedTechnologies: ["React Native", "Flutter", "Swift", "Kotlin", "Capacitor"],
    suggestedWorkflows: ["Mobile CI/CD", "Crash Telemetry Analysis", "Offline Storage Sync"],
  },
  {
    index: 4,
    name: "Server",
    shortLabel: "Backend Services",
    longLabel: "Backend Microservices & Distributed APIs",
    description: "Scalable backend microservices, asynchronous message queues, business process engines, and RPC servers.",
    icon: Server,
    category: "Core & Platform",
    suggestedTechnologies: ["FastAPI", "Node.js", "Express", "gRPC", "RabbitMQ"],
    suggestedWorkflows: ["Service Mesh Telemetry", "OpenAPI Conformance", "Database Connection Pooling"],
  },
  {
    index: 5,
    name: "Brain",
    shortLabel: "AI Intelligence",
    longLabel: "AI Intelligence & Machine Learning Platforms",
    description: "Deep learning models, predictive inference pipelines, feature engineering stores, and embedding spaces.",
    icon: Brain,
    category: "Intelligence & AI",
    suggestedTechnologies: ["PyTorch", "TensorFlow", "Scikit-Learn", "Hugging Face", "MLflow"],
    suggestedWorkflows: ["Model Evaluation Gates", "Embedding Drift Detection", "Feature Pipeline Validation"],
  },
  {
    index: 6,
    name: "Shield",
    shortLabel: "Security Engineering",
    longLabel: "Security Engineering & Vulnerability Defense",
    description: "Static security audits, CWE vulnerability mitigation, zero-trust policy enforcement, and cryptographic signing.",
    icon: Shield,
    category: "Security & Governance",
    suggestedTechnologies: ["Bandit", "Semgrep", "OpenSSL", "OWASP ZAP", "Trivy"],
    suggestedWorkflows: ["CWE AST Scanning", "Dependency Supply-Chain Audit", "Cryptographic Hash Sealing"],
  },
  {
    index: 7,
    name: "Terminal",
    shortLabel: "Developer Platform",
    longLabel: "Developer Platform & CLI Tooling",
    description: "Internal developer platforms, command-line interfaces, local development environments, and toolchains.",
    icon: Terminal,
    category: "Core & Platform",
    suggestedTechnologies: ["Cobra", "Commander", "Node.js", "Bash", "PowerShell"],
    suggestedWorkflows: ["Developer Workflow Telemetry", "CLI Distribution", "Local Container Sandboxing"],
  },
  {
    index: 8,
    name: "Database",
    shortLabel: "Data Platform",
    longLabel: "Data Platform & Storage Architectures",
    description: "Relational, document, and columnar data stores, schema migrations, read-replicas, and data governance.",
    icon: Database,
    category: "Data & Analytics",
    suggestedTechnologies: ["PostgreSQL", "Supabase", "Redis", "DuckDB", "ClickHouse"],
    suggestedWorkflows: ["Schema Parity Verification", "Read-Replica Lag Auditing", "Data Contract Enforcement"],
  },
  {
    index: 9,
    name: "Cpu",
    shortLabel: "Systems & Infrastructure",
    longLabel: "Systems Programming & Infrastructure Kernels",
    description: "Low-level system software, kernel modules, memory-optimized algorithms, and embedded hardware controllers.",
    icon: Cpu,
    category: "Infrastructure & Operations",
    suggestedTechnologies: ["Rust", "C++", "eBPF", "WebAssembly", "LLVM"],
    suggestedWorkflows: ["Cyclomatic Complexity Analysis", "Memory Allocation Profiling", "Wasm Compilation"],
  },
  {
    index: 10,
    name: "Bot",
    shortLabel: "Autonomous Systems",
    longLabel: "Autonomous Systems & Agent Orchestration",
    description: "Autonomous reasoning agents, multi-agent collaboration frameworks, task DAG schedulers, and execution loops.",
    icon: Bot,
    category: "Intelligence & AI",
    suggestedTechnologies: ["LangChain", "AutoGen", "Vyron Agent Framework", "Claude Tools", "LlamaIndex"],
    suggestedWorkflows: ["Autonomous Task Decomposition", "Agent Assertion Verification", "Tool Permission Scoping"],
  },
  {
    index: 11,
    name: "Rocket",
    shortLabel: "Deployment & Cloud",
    longLabel: "Deployment Automation & Cloud Infrastructure",
    description: "GitOps continuous delivery, container orchestrators, infrastructure-as-code, and release coordination.",
    icon: Rocket,
    category: "Infrastructure & Operations",
    suggestedTechnologies: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "ArgoCD"],
    suggestedWorkflows: ["7-Gate Release Evaluation", "Canary Rollout Verification", "Automated Rollback Triggers"],
  },
  {
    index: 12,
    name: "Layers",
    shortLabel: "Enterprise Platform",
    longLabel: "Enterprise Platform & Architecture Governance",
    description: "Multi-tenant enterprise suites, enterprise service buses, architecture fitness functions, and organization models.",
    icon: Layers,
    category: "Core & Platform",
    suggestedTechnologies: ["Spring Boot", "Enterprise TypeScript", "Kafka", "Camunda", "Keycloak"],
    suggestedWorkflows: ["Architecture Law Verification", "ADR Decay Auditing", "Cross-Domain Impact Tracing"],
  },
  {
    index: 13,
    name: "Code",
    shortLabel: "Software Engineering",
    longLabel: "Software Engineering & Code Health Systems",
    description: "AST static code analysis, cyclomatic complexity tracking, test coverage monitoring, and refactoring engines.",
    icon: Code,
    category: "Core & Platform",
    suggestedTechnologies: ["Lizard CCN", "ESLint", "TypeScript AST", "Vitest", "Jest"],
    suggestedWorkflows: ["Lizard Complexity CCN Scans", "Code Smells Extraction", "Automated Refactoring Proposals"],
  },
  {
    index: 14,
    name: "Zap",
    shortLabel: "Real-Time Systems",
    longLabel: "Real-Time Streaming & Event-Driven Systems",
    description: "High-throughput WebSocket streams, pub/sub event brokers, real-time message routing, and microsecond telemetry.",
    icon: Zap,
    category: "Infrastructure & Operations",
    suggestedTechnologies: ["WebSocket", "SSE", "Apache Kafka", "Redis Pub/Sub", "NATS"],
    suggestedWorkflows: ["Event Bus Latency Tracking", "Stream Idempotency Checks", "Backpressure Regulation"],
  },
  {
    index: 15,
    name: "BarChart",
    shortLabel: "Analytics Platform",
    longLabel: "Analytics Platform & Business Intelligence",
    description: "Data warehousing, dimensional modeling, KPI dashboards, time-series aggregation, and statistical reporting.",
    icon: BarChart3,
    category: "Data & Analytics",
    suggestedTechnologies: ["Recharts", "Apache Superset", "dbt", "Snowflake", "Cube.js"],
    suggestedWorkflows: ["Cohort Trend Attribution", "KPI Anomaly Alerting", "Executive Report Compilation"],
  },
  {
    index: 16,
    name: "Activity",
    shortLabel: "Observability Systems",
    longLabel: "Observability & OpenTelemetry Platforms",
    description: "Distributed tracing, metric aggregation, structured log ingestion, span correlation, and SRE alerting.",
    icon: Activity,
    category: "Infrastructure & Operations",
    suggestedTechnologies: ["OpenTelemetry", "Prometheus", "Grafana", "Jaeger", "Vector"],
    suggestedWorkflows: ["Trace-to-Architecture Correlation", "p99 Latency Auditing", "Error Budget Monitoring"],
  },
  {
    index: 17,
    name: "Lock",
    shortLabel: "Identity & Trust",
    longLabel: "Identity, Credential & Trust Governance",
    description: "Authentication protocols, PKCE flows, role-based and attribute-based access control, and cryptographic identities.",
    icon: Lock,
    category: "Security & Governance",
    suggestedTechnologies: ["GoTrue PKCE", "OAuth 2.1", "WebAuthn", "JWT", "Vault"],
    suggestedWorkflows: ["Least-Privilege Enforcement", "Session Invalidation Auditing", "Credential Leak Prevention"],
  },
  {
    index: 18,
    name: "Box",
    shortLabel: "Simulation Environment",
    longLabel: "Simulation Environment & Synthetic Digital Twin",
    description: "Hypothetical system twins, chaos engineering experiments, network latency injection, and what-if analysis.",
    icon: Box,
    category: "Intelligence & AI",
    suggestedTechnologies: ["Vyron Simulation Lab", "Chaos Mesh", "Toxiproxy", "Synthetic Twin Engine"],
    suggestedWorkflows: ["Dependency Failure Simulation", "Traffic Spike Stress Test", "Zero-Mutation Isolation Check"],
  },
  {
    index: 19,
    name: "Workflow",
    shortLabel: "Distributed Systems",
    longLabel: "Distributed Systems & Graph Orchestration",
    description: "Graph dependency resolution, consensus algorithms, distributed transactions, and topological DAG scheduling.",
    icon: Workflow,
    category: "Core & Platform",
    suggestedTechnologies: ["Temporal", "Vyron DAG Planner", "Apache Airflow", "Etcd"],
    suggestedWorkflows: ["Transitive Blast Radius Calculation", "Saga Orchestration", "Topological Dependency Sorting"],
  },
  {
    index: 20,
    name: "Cloud",
    shortLabel: "Cloud Native",
    longLabel: "Cloud Native & Serverless Architectures",
    description: "Serverless edge functions, micro-VM instances, cloud object storage, and multi-region failover topologies.",
    icon: Cloud,
    category: "Infrastructure & Operations",
    suggestedTechnologies: ["AWS Lambda", "Cloudflare Workers", "Supabase Edge", "GCP Cloud Run"],
    suggestedWorkflows: ["Cold Start Optimization", "Multi-Region Failover Testing", "Edge Rate Limit Auditing"],
  },
  {
    index: 21,
    name: "Sparkles",
    shortLabel: "AI-Augmented Engineering",
    longLabel: "AI-Augmented Engineering & Copilot Intelligence",
    description: "Application-native AI copilot surfaces, prompt compilation engines, memory layers, and deterministic failovers.",
    icon: Sparkles,
    category: "Intelligence & AI",
    suggestedTechnologies: ["Claude 3.7 Sonnet", "OpenRouter", "GPT-4o", "Vyron Copilot Engine"],
    suggestedWorkflows: ["Context Injection Verification", "7-Tier Layered Memory Retrieval", "Grounding Evaluation"],
  },
  {
    index: 22,
    name: "Wand2",
    shortLabel: "Automation Platform",
    longLabel: "Automation Platform & Workflow Robotics",
    description: "Event-driven workflow triggers, automated ticket resolution, CI/CD bot actions, and remediation dispatchers.",
    icon: Wand2,
    category: "Application Systems",
    suggestedTechnologies: ["GitHub Actions", "Webhooks", "Zapier", "Vyron Action Engine"],
    suggestedWorkflows: ["1-Click Remediation Dispatch", "Automated Mitigation Rule Synthesis", "Audit Notification Ping"],
  },
  {
    index: 23,
    name: "Compass",
    shortLabel: "Architecture Intelligence",
    longLabel: "Architecture Intelligence & Drift Detection",
    description: "Continuous architectural alignment, intent-vs-reality diffing, component topology mapping, and drift scoring.",
    icon: Compass,
    category: "Security & Governance",
    suggestedTechnologies: ["ATLAS Knowledge Graph", "Vyron Drift Engine", "ArchUnit", "Lizard AST"],
    suggestedWorkflows: ["Intent vs Observed Drift Auditing", "Transitive Impact Analysis", "Architectural Law Validation"],
  },
  {
    index: 24,
    name: "Radio",
    shortLabel: "Connected Systems",
    longLabel: "Connected Systems & MCP Protocol Gateways",
    description: "Model Context Protocol (MCP) integrations, external API connectors, bidirectional sync, and secure token storage.",
    icon: Radio,
    category: "Application Systems",
    suggestedTechnologies: ["Model Context Protocol (MCP)", "GraphQL", "WebSockets", "REST Connectors"],
    suggestedWorkflows: ["MCP Health Latency Testing", "1-Click Token Revocation", "Zero-Trust Tool Authorization"],
  },
];

export const WORKSPACE_ICON_TAXONOMY: WorkspaceIconDefinition[] = RAW_WORKSPACE_TAXONOMY.map((item) => ({
  ...item,
  id: `ws-${item.name.toLowerCase()}`,
  suggestedTech: item.suggestedTechnologies,
}));

export const WORKSPACE_CATEGORIES: WorkspaceCategory[] = [
  "Core & Platform",
  "Application Systems",
  "Intelligence & AI",
  "Infrastructure & Operations",
  "Security & Governance",
  "Data & Analytics",
];

export function getWorkspaceIconByName(name: string): WorkspaceIconDefinition | undefined {
  return WORKSPACE_ICON_TAXONOMY.find((item) => item.name === name);
}

export function getWorkspaceIconByIndex(index: number): WorkspaceIconDefinition | undefined {
  return WORKSPACE_ICON_TAXONOMY.find((item) => item.index === index);
}
