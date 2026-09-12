// Deterministic mock data for PROJECT BRAHMA. No backend calls.

export type ProjectStatus = "Analyzed" | "Analyzing" | "Draft" | "Needs Review" | "At Risk";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface Project {
  id: string;
  name: string;
  description: string;
  domain: string;
  status: ProjectStatus;
  healthScore: number;
  securityScore: number;
  businessImpactScore: number;
  requirementClarity: number;
  deliveryRisk: RiskLevel;
  riskScore: number;
  repoConnected: boolean;
  repoUrl?: string;
  teamSize: number;
  deadline: string;
  lastUpdated: string;
  lastAnalysis: string;
}

export const projects: Project[] = [
  {
    id: "brahma-core",
    name: "Aurora Payments Gateway",
    description:
      "PCI-aware payment orchestration service handling card, UPI and wallet settlement for 42 merchants.",
    domain: "Fintech",
    status: "Analyzed",
    healthScore: 91,
    securityScore: 88,
    businessImpactScore: 84,
    requirementClarity: 93,
    deliveryRisk: "Low",
    riskScore: 18,
    repoConnected: true,
    repoUrl: "github.com/aurora-labs/payments-gateway",
    teamSize: 8,
    deadline: "2026-10-14",
    lastUpdated: "2026-08-07T09:12:00Z",
    lastAnalysis: "2026-08-07T09:12:00Z",
  },
  {
    id: "medisync",
    name: "MediSync Patient Portal",
    description:
      "Appointment scheduling, e-prescription and lab report delivery portal for a 5-clinic network.",
    domain: "Healthcare",
    status: "Needs Review",
    healthScore: 74,
    securityScore: 69,
    businessImpactScore: 72,
    requirementClarity: 81,
    deliveryRisk: "Medium",
    riskScore: 46,
    repoConnected: true,
    repoUrl: "github.com/medisync/patient-portal",
    teamSize: 5,
    deadline: "2026-09-30",
    lastUpdated: "2026-08-06T14:40:00Z",
    lastAnalysis: "2026-08-06T14:40:00Z",
  },
  {
    id: "vaultledger",
    name: "VaultLedger Admin Console",
    description:
      "Internal ledger reconciliation console with role-based access and audit trail exports.",
    domain: "Enterprise Ops",
    status: "At Risk",
    healthScore: 58,
    securityScore: 41,
    businessImpactScore: 66,
    requirementClarity: 76,
    deliveryRisk: "Critical",
    riskScore: 82,
    repoConnected: true,
    repoUrl: "github.com/vaultledger/admin-console",
    teamSize: 6,
    deadline: "2026-08-29",
    lastUpdated: "2026-08-07T06:05:00Z",
    lastAnalysis: "2026-08-07T06:05:00Z",
  },
  {
    id: "campusflow",
    name: "CampusFlow Attendance System",
    description:
      "Face-recognition attendance capture with timetable sync for a 3,400 student engineering campus.",
    domain: "Education",
    status: "Draft",
    healthScore: 62,
    securityScore: 71,
    businessImpactScore: 54,
    requirementClarity: 48,
    deliveryRisk: "High",
    riskScore: 64,
    repoConnected: true,
    repoUrl: "github.com/campusflow/attendance",
    teamSize: 4,
    deadline: "2026-11-20",
    lastUpdated: "2026-08-05T11:20:00Z",
    lastAnalysis: "2026-08-05T11:20:00Z",
  },
  {
    id: "freightpulse",
    name: "FreightPulse Logistics Tracker",
    description:
      "Live shipment tracking, driver dispatch and delay prediction for a regional freight operator.",
    domain: "Logistics",
    status: "Analyzing",
    healthScore: 0,
    securityScore: 0,
    businessImpactScore: 61,
    requirementClarity: 69,
    deliveryRisk: "Medium",
    riskScore: 52,
    repoConnected: false,
    teamSize: 7,
    deadline: "2026-12-05",
    lastUpdated: "2026-08-07T08:02:00Z",
    lastAnalysis: "—",
  },
];

export const getProject = (id: string) => projects.find((p) => p.id === id) ?? projects[0]!;

export const healthTrend = [
  { month: "Mar", health: 61, security: 55, risk: 72 },
  { month: "Apr", health: 66, security: 60, risk: 66 },
  { month: "May", health: 70, security: 64, risk: 58 },
  { month: "Jun", health: 75, security: 71, risk: 51 },
  { month: "Jul", health: 79, security: 76, risk: 44 },
  { month: "Aug", health: 84, security: 81, risk: 38 },
];

export const riskDistribution = [
  { name: "Low", value: 6, color: "var(--success)" },
  { name: "Medium", value: 4, color: "var(--warning)" },
  { name: "High", value: 2, color: "oklch(0.7 0.19 45)" },
  { name: "Critical", value: 1, color: "var(--critical)" },
];

export const activityFeed = [
  {
    id: "a1",
    title: "Security scan completed on VaultLedger Admin Console",
    detail: "3 critical findings, 7 high findings",
    time: "12 minutes ago",
    kind: "security" as const,
  },
  {
    id: "a2",
    title: "Blueprint regenerated for Aurora Payments Gateway",
    detail: "Added background worker and idempotency store",
    time: "1 hour ago",
    kind: "blueprint" as const,
  },
  {
    id: "a3",
    title: "Executive summary exported by Priya Nair",
    detail: "MediSync Patient Portal — 14 pages",
    time: "3 hours ago",
    kind: "report" as const,
  },
  {
    id: "a4",
    title: "Requirement clarity dropped below threshold",
    detail: "CampusFlow Attendance System — clarity 48%",
    time: "Yesterday",
    kind: "risk" as const,
  },
  {
    id: "a5",
    title: "Repository connected",
    detail: "github.com/medisync/patient-portal",
    time: "2 days ago",
    kind: "repo" as const,
  },
];

export const notifications = [
  {
    id: "n1",
    title: "Critical vulnerability detected",
    detail: "Hardcoded JWT secret in VaultLedger auth module",
    time: "12m",
    severity: "Critical" as Severity,
  },
  {
    id: "n2",
    title: "Analysis completed",
    detail: "Aurora Payments Gateway health score 91",
    time: "1h",
    severity: "Low" as Severity,
  },
  {
    id: "n3",
    title: "Report ready",
    detail: "MediSync executive summary is available",
    time: "3h",
    severity: "Medium" as Severity,
  },
];

// ---------- Requirements ----------

export interface RequirementItem {
  id: string;
  text: string;
  confidence: number;
  priority?: "Must" | "Should" | "Could";
}

export const requirements = {
  functional: [
    {
      id: "FR-01",
      text: "Merchants can initiate card, UPI and wallet payments through a single API.",
      confidence: 96,
      priority: "Must",
    },
    {
      id: "FR-02",
      text: "System retries failed settlements with idempotency keys for up to 24 hours.",
      confidence: 91,
      priority: "Must",
    },
    {
      id: "FR-03",
      text: "Admins can issue full or partial refunds with an audit reason code.",
      confidence: 88,
      priority: "Must",
    },
    {
      id: "FR-04",
      text: "Merchants receive webhooks for payment success, failure and chargeback events.",
      confidence: 84,
      priority: "Should",
    },
    {
      id: "FR-05",
      text: "Finance team can export daily settlement reconciliation as CSV.",
      confidence: 79,
      priority: "Should",
    },
  ] as RequirementItem[],
  nonFunctional: [
    {
      id: "NFR-01",
      text: "p95 authorization latency must stay under 400 ms at 1,200 TPS.",
      confidence: 92,
    },
    {
      id: "NFR-02",
      text: "All cardholder data must be tokenized; no PAN stored at rest.",
      confidence: 95,
    },
    { id: "NFR-03", text: "Availability target of 99.95% per calendar month.", confidence: 86 },
    {
      id: "NFR-04",
      text: "Every privileged action must be written to an immutable audit log.",
      confidence: 82,
    },
  ] as RequirementItem[],
  actors: [
    { id: "AC-01", text: "Merchant Developer — integrates the payment API", confidence: 94 },
    { id: "AC-02", text: "Finance Operator — reconciles settlements and refunds", confidence: 90 },
    { id: "AC-03", text: "Compliance Auditor — reads audit logs, no write access", confidence: 87 },
    { id: "AC-04", text: "Platform Admin — manages merchants and API credentials", confidence: 92 },
  ] as RequirementItem[],
  modules: [
    { id: "MOD-01", text: "Payment Orchestration", confidence: 95 },
    { id: "MOD-02", text: "Settlement & Reconciliation", confidence: 89 },
    { id: "MOD-03", text: "Merchant Onboarding", confidence: 86 },
    { id: "MOD-04", text: "Webhook Delivery", confidence: 83 },
    { id: "MOD-05", text: "Audit & Compliance", confidence: 81 },
  ] as RequirementItem[],
  constraints: [
    {
      id: "CON-01",
      text: "Must comply with PCI-DSS v4.0 scope reduction guidance.",
      confidence: 90,
    },
    {
      id: "CON-02",
      text: "Deployment restricted to ap-south-1 region for data residency.",
      confidence: 85,
    },
    {
      id: "CON-03",
      text: "Existing Oracle ledger must remain the system of record.",
      confidence: 74,
    },
  ] as RequirementItem[],
  assumptions: [
    {
      id: "ASM-01",
      text: "Acquirer sandbox credentials are available before integration testing.",
      confidence: 68,
    },
    {
      id: "ASM-02",
      text: "Merchant volume will not exceed 2M transactions per month in year one.",
      confidence: 61,
    },
    {
      id: "ASM-03",
      text: "KYC verification is handled by an existing internal service.",
      confidence: 72,
    },
  ] as RequirementItem[],
  entities: [
    {
      id: "ENT-01",
      text: "Merchant, ApiKey, Payment, Refund, SettlementBatch, WebhookEvent, AuditLog",
      confidence: 88,
    },
  ] as RequirementItem[],
};

// ---------- Blueprint ----------

export const blueprintNodes = [
  {
    id: "web",
    label: "Web Frontend",
    kind: "Frontend",
    tech: "React 19 + TypeScript",
    detail:
      "Merchant dashboard and admin console. Server-rendered shell with route-level code splitting.",
    x: 0,
    y: 0,
  },
  {
    id: "gateway",
    label: "API Gateway",
    kind: "Backend",
    tech: "Node.js + Fastify",
    detail: "Rate limiting, request signing verification and routing to internal services.",
    x: 260,
    y: 0,
  },
  {
    id: "auth",
    label: "Authentication",
    kind: "Auth",
    tech: "OAuth2 + JWT (RS256)",
    detail: "Merchant API key exchange, admin SSO and short-lived access tokens.",
    x: 260,
    y: -140,
  },
  {
    id: "core",
    label: "Payment Service",
    kind: "Backend",
    tech: "Node.js + Prisma",
    detail: "Authorization, capture, refund state machine with idempotency keys.",
    x: 520,
    y: 0,
  },
  {
    id: "ai",
    label: "Risk AI Service",
    kind: "AI",
    tech: "Python + FastAPI",
    detail: "Fraud scoring and delay prediction served over gRPC with a 40 ms budget.",
    x: 520,
    y: 150,
  },
  {
    id: "db",
    label: "PostgreSQL",
    kind: "Database",
    tech: "Postgres 16 + PgBouncer",
    detail: "Primary transactional store, logical replication to the reporting replica.",
    x: 780,
    y: -80,
  },
  {
    id: "worker",
    label: "Background Worker",
    kind: "Worker",
    tech: "BullMQ + Redis",
    detail: "Settlement batching, webhook retries and reconciliation jobs.",
    x: 780,
    y: 80,
  },
  {
    id: "storage",
    label: "File Storage",
    kind: "Storage",
    tech: "S3-compatible object store",
    detail: "Settlement CSVs, dispute evidence and generated PDF reports.",
    x: 1040,
    y: 20,
  },
  {
    id: "external",
    label: "Acquirer APIs",
    kind: "External",
    tech: "Visa / NPCI / Wallets",
    detail: "Third-party authorization endpoints with circuit breakers per provider.",
    x: 780,
    y: 220,
  },
];

export const blueprintEdges = [
  { id: "e1", source: "web", target: "gateway", label: "HTTPS" },
  { id: "e2", source: "gateway", target: "auth", label: "verify token" },
  { id: "e3", source: "gateway", target: "core", label: "REST" },
  { id: "e4", source: "core", target: "db", label: "SQL" },
  { id: "e5", source: "core", target: "ai", label: "gRPC" },
  { id: "e6", source: "core", target: "worker", label: "enqueue" },
  { id: "e7", source: "worker", target: "storage", label: "put object" },
  { id: "e8", source: "worker", target: "external", label: "settle" },
  { id: "e9", source: "worker", target: "db", label: "SQL" },
];

export const schemaTables = [
  {
    name: "merchants",
    fields: [
      { name: "id", type: "uuid", pk: true, rel: "—" },
      { name: "legal_name", type: "text", pk: false, rel: "—" },
      { name: "status", type: "merchant_status", pk: false, rel: "—" },
      { name: "created_at", type: "timestamptz", pk: false, rel: "—" },
    ],
  },
  {
    name: "payments",
    fields: [
      { name: "id", type: "uuid", pk: true, rel: "—" },
      { name: "merchant_id", type: "uuid", pk: false, rel: "merchants.id" },
      { name: "amount_minor", type: "bigint", pk: false, rel: "—" },
      { name: "currency", type: "char(3)", pk: false, rel: "—" },
      { name: "state", type: "payment_state", pk: false, rel: "—" },
      { name: "idempotency_key", type: "text", pk: false, rel: "unique" },
    ],
  },
  {
    name: "refunds",
    fields: [
      { name: "id", type: "uuid", pk: true, rel: "—" },
      { name: "payment_id", type: "uuid", pk: false, rel: "payments.id" },
      { name: "amount_minor", type: "bigint", pk: false, rel: "—" },
      { name: "reason_code", type: "text", pk: false, rel: "—" },
    ],
  },
  {
    name: "settlement_batches",
    fields: [
      { name: "id", type: "uuid", pk: true, rel: "—" },
      { name: "merchant_id", type: "uuid", pk: false, rel: "merchants.id" },
      { name: "settled_on", type: "date", pk: false, rel: "—" },
      { name: "file_key", type: "text", pk: false, rel: "storage object" },
    ],
  },
  {
    name: "audit_logs",
    fields: [
      { name: "id", type: "bigserial", pk: true, rel: "—" },
      { name: "actor_id", type: "uuid", pk: false, rel: "users.id" },
      { name: "action", type: "text", pk: false, rel: "—" },
      { name: "payload", type: "jsonb", pk: false, rel: "—" },
    ],
  },
];

export const apiRoutes = [
  { method: "POST", path: "/v1/payments", purpose: "Create and authorize a payment", auth: true },
  {
    method: "GET",
    path: "/v1/payments/:id",
    purpose: "Fetch payment state and timeline",
    auth: true,
  },
  {
    method: "POST",
    path: "/v1/payments/:id/capture",
    purpose: "Capture an authorized payment",
    auth: true,
  },
  { method: "POST", path: "/v1/refunds", purpose: "Issue a full or partial refund", auth: true },
  {
    method: "GET",
    path: "/v1/settlements",
    purpose: "List settlement batches for a merchant",
    auth: true,
  },
  {
    method: "POST",
    path: "/v1/webhooks/test",
    purpose: "Send a test webhook to the merchant endpoint",
    auth: true,
  },
  { method: "GET", path: "/v1/health", purpose: "Liveness and dependency probe", auth: false },
];

export const architectureRecommendations = [
  {
    title: "Introduce an idempotency store with TTL",
    body: "Payment retries currently rely on a unique index. A Redis-backed idempotency store keyed by merchant plus key reduces duplicate authorization risk during acquirer timeouts.",
    impact: "High",
  },
  {
    title: "Split reporting reads onto a replica",
    body: "Settlement exports scan wide date ranges and contend with authorization writes. Route them to the logical replica behind PgBouncer.",
    impact: "Medium",
  },
  {
    title: "Add per-provider circuit breakers",
    body: "A single slow acquirer can exhaust the worker pool. Wrap each external provider with an independent breaker and bulkhead.",
    impact: "High",
  },
  {
    title: "Move PDF generation out of the request path",
    body: "Report generation blocks API workers for up to 6 seconds. Enqueue it and notify via webhook when the object is written.",
    impact: "Medium",
  },
];

// ---------- Code health ----------

export const maintainability = [
  { module: "Payments", score: 84 },
  { module: "Settlement", score: 71 },
  { module: "Webhooks", score: 66 },
  { module: "Onboarding", score: 78 },
  { module: "Audit", score: 88 },
  { module: "Shared", score: 59 },
];

export const complexityTrend = [
  { week: "W1", complexity: 18.4, duplication: 7.1 },
  { week: "W2", complexity: 17.9, duplication: 6.8 },
  { week: "W3", complexity: 19.6, duplication: 7.4 },
  { week: "W4", complexity: 16.2, duplication: 5.9 },
  { week: "W5", complexity: 14.8, duplication: 5.1 },
  { week: "W6", complexity: 13.9, duplication: 4.6 },
];

export const codeHealthMetrics = {
  overall: 78,
  duplication: 4.6,
  coverage: 67,
  dependencyRisk: "Medium" as RiskLevel,
  outdatedDeps: 11,
  loc: 48213,
};

export const fileIssues = [
  {
    file: "src/services/settlement/batchRunner.ts",
    complexity: 34,
    issues: 9,
    severity: "High" as Severity,
    recommendation:
      "Extract batching strategy into pure functions and cover with table-driven tests.",
  },
  {
    file: "src/services/payments/stateMachine.ts",
    complexity: 27,
    issues: 6,
    severity: "High" as Severity,
    recommendation: "Replace nested conditionals with an explicit transition map.",
  },
  {
    file: "src/webhooks/dispatcher.ts",
    complexity: 22,
    issues: 5,
    severity: "Medium" as Severity,
    recommendation: "Move retry backoff into shared utility; add jitter to avoid thundering herd.",
  },
  {
    file: "src/shared/http/client.ts",
    complexity: 19,
    issues: 4,
    severity: "Medium" as Severity,
    recommendation: "Add per-host timeouts; current default of 30s exceeds request budget.",
  },
  {
    file: "src/admin/reconcile/controller.ts",
    complexity: 16,
    issues: 3,
    severity: "Low" as Severity,
    recommendation: "Split controller from mapping logic to enable unit testing.",
  },
  {
    file: "src/shared/currency.ts",
    complexity: 8,
    issues: 2,
    severity: "Low" as Severity,
    recommendation: "Use integer minor units consistently; remove float rounding helper.",
  },
];

// ---------- Security ----------

export const vulnerabilities = [
  {
    id: "V-101",
    title: "Hardcoded signing secret in auth module",
    severity: "Critical" as Severity,
    cwe: "CWE-798",
    location: "src/auth/tokens.ts:41",
    description:
      "The JWT signing secret is committed as a string literal and reused across environments.",
    recommendation:
      "Load the secret from a managed secret store and rotate the exposed key immediately.",
  },
  {
    id: "V-102",
    title: "SQL built from unparameterized merchant filter",
    severity: "Critical" as Severity,
    cwe: "CWE-89",
    description: "Merchant search concatenates user input into a raw query string.",
    location: "src/admin/merchants/search.ts:88",
    recommendation: "Use parameterized queries or the query builder's bind API.",
  },
  {
    id: "V-103",
    title: "Missing authorization check on refund endpoint",
    severity: "High" as Severity,
    cwe: "CWE-862",
    location: "src/routes/refunds.ts:57",
    description: "Any authenticated merchant can refund a payment belonging to another merchant.",
    recommendation:
      "Verify payment.merchant_id equals the caller's merchant before mutating state.",
  },
  {
    id: "V-104",
    title: "Verbose error responses leak stack traces",
    severity: "Medium" as Severity,
    cwe: "CWE-209",
    location: "src/shared/errors/handler.ts:23",
    description: "Unhandled exceptions return the full stack trace to API clients in production.",
    recommendation: "Return a correlation id and log details server-side only.",
  },
  {
    id: "V-105",
    title: "Outdated transitive dependency with known CVE",
    severity: "Medium" as Severity,
    cwe: "CWE-1104",
    location: "package-lock.json",
    description:
      "A nested HTTP parser dependency is pinned to a version with a request smuggling advisory.",
    recommendation: "Upgrade the parent package and add automated dependency scanning to CI.",
  },
  {
    id: "V-106",
    title: "Cookie missing SameSite attribute",
    severity: "Low" as Severity,
    cwe: "CWE-1275",
    location: "src/auth/session.ts:12",
    description: "The admin session cookie sets Secure and HttpOnly but not SameSite.",
    recommendation: "Set SameSite=Lax for the admin console session cookie.",
  },
];

export const remediationChecklist = [
  { id: "r1", label: "Rotate and vault the JWT signing secret", done: false, owner: "Platform" },
  { id: "r2", label: "Parameterize merchant search query", done: false, owner: "Backend" },
  { id: "r3", label: "Add ownership assertion to refund endpoint", done: false, owner: "Backend" },
  { id: "r4", label: "Sanitize production error responses", done: true, owner: "Backend" },
  { id: "r5", label: "Enable dependency scanning in CI", done: true, owner: "DevEx" },
];

// ---------- Risk & business ----------

export const riskBusiness = {
  deliveryRisk: 46,
  technicalDebt: 38,
  releaseReadiness: 72,
  kpis: [
    {
      label: "Cost impact",
      value: "₹18.4L",
      note: "Projected rework if debt is unaddressed",
      tone: "warning" as const,
    },
    {
      label: "Time impact",
      value: "+14 days",
      note: "Estimated schedule slip at current velocity",
      tone: "warning" as const,
    },
    {
      label: "Quality impact",
      value: "-9 pts",
      note: "Expected drop in release quality index",
      tone: "critical" as const,
    },
    {
      label: "Risk exposure",
      value: "High",
      note: "Driven by 2 critical security findings",
      tone: "critical" as const,
    },
    {
      label: "Maintainability",
      value: "78 / 100",
      note: "Above portfolio median of 71",
      tone: "success" as const,
    },
  ],
};

export const impactMatrix = [
  { module: "Payment Orchestration", technical: 82, business: 94, issues: 6 },
  { module: "Settlement", technical: 71, business: 86, issues: 9 },
  { module: "Webhook Delivery", technical: 64, business: 58, issues: 5 },
  { module: "Merchant Onboarding", technical: 44, business: 72, issues: 3 },
  { module: "Audit & Compliance", technical: 31, business: 88, issues: 2 },
  { module: "Shared Utilities", technical: 68, business: 26, issues: 7 },
];

export const businessRecommendations = [
  "Fix the two critical security findings before the release candidate is cut.",
  "Reduce cyclomatic complexity in settlement batching, the highest business-impact module.",
  "Add contract tests for the six payment API routes currently uncovered.",
  "Improve requirement clarity for refund reason codes; clarity is 61% on that flow.",
  "Prioritize Audit & Compliance work: low technical risk but the highest business impact.",
];

// ---------- Reports ----------

export const reports = [
  {
    id: "RPT-118",
    name: "Executive Summary — August",
    type: "Executive summary",
    status: "Completed" as const,
    pages: 14,
    generated: "2026-08-07 09:40",
    by: "Priya Nair",
  },
  {
    id: "RPT-117",
    name: "Technical Architecture Review",
    type: "Technical report",
    status: "Completed" as const,
    pages: 42,
    generated: "2026-08-05 17:11",
    by: "Arjun Mehta",
  },
  {
    id: "RPT-116",
    name: "Capstone Submission Draft",
    type: "Academic report",
    status: "Generating" as const,
    pages: 0,
    generated: "2026-08-07 10:02",
    by: "Priya Nair",
  },
  {
    id: "RPT-115",
    name: "Security Posture Report",
    type: "Technical report",
    status: "Failed" as const,
    pages: 0,
    generated: "2026-08-04 08:55",
    by: "System",
  },
  {
    id: "RPT-114",
    name: "Quarterly Business Impact",
    type: "Executive summary",
    status: "Completed" as const,
    pages: 21,
    generated: "2026-07-30 12:30",
    by: "Neha Rao",
  },
];

// ---------- Admin ----------

export const adminStats = { users: 248, projects: 61, analyses: 1432, reports: 318 };

export const usageTrend = [
  { day: "Mon", analyses: 42, reports: 9 },
  { day: "Tue", analyses: 58, reports: 12 },
  { day: "Wed", analyses: 71, reports: 15 },
  { day: "Thu", analyses: 64, reports: 11 },
  { day: "Fri", analyses: 88, reports: 19 },
  { day: "Sat", analyses: 31, reports: 6 },
  { day: "Sun", analyses: 24, reports: 4 },
];

export const adminUsers = [
  {
    id: "u1",
    name: "Priya Nair",
    email: "priya.nair@brahma.dev",
    role: "Admin",
    projects: 9,
    joined: "2026-02-11",
    status: "Active",
  },
  {
    id: "u2",
    name: "Arjun Mehta",
    email: "arjun.mehta@aurora.io",
    role: "Startup",
    projects: 4,
    joined: "2026-03-02",
    status: "Active",
  },
  {
    id: "u3",
    name: "Dr. S. Krishnan",
    email: "krishnan@univ.edu",
    role: "Faculty",
    projects: 12,
    joined: "2026-01-19",
    status: "Active",
  },
  {
    id: "u4",
    name: "Rahul Verma",
    email: "rahul.v@student.univ.edu",
    role: "Student",
    projects: 2,
    joined: "2026-06-27",
    status: "Invited",
  },
  {
    id: "u5",
    name: "Neha Rao",
    email: "neha.rao@medisync.health",
    role: "Startup",
    projects: 3,
    joined: "2026-05-14",
    status: "Suspended",
  },
];

export const auditLog = [
  {
    id: "l1",
    actor: "priya.nair@brahma.dev",
    action: "Rotated workspace LLM API key",
    target: "workspace:brahma-core",
    time: "2026-08-07 09:58",
  },
  {
    id: "l2",
    actor: "system",
    action: "Security analysis failed after 3 retries",
    target: "project:vaultledger",
    time: "2026-08-07 06:12",
  },
  {
    id: "l3",
    actor: "arjun.mehta@aurora.io",
    action: "Connected GitHub repository",
    target: "project:brahma-core",
    time: "2026-08-06 21:44",
  },
  {
    id: "l4",
    actor: "krishnan@univ.edu",
    action: "Exported academic report",
    target: "project:campusflow",
    time: "2026-08-06 15:03",
  },
  {
    id: "l5",
    actor: "priya.nair@brahma.dev",
    action: "Suspended user account",
    target: "user:neha.rao",
    time: "2026-08-05 10:27",
  },
];

export const systemHealth = [
  { name: "API Gateway", status: "Operational", latency: "142 ms" },
  { name: "Analysis Workers", status: "Operational", latency: "3.2 s avg job" },
  { name: "LLM Provider", status: "Degraded", latency: "1.9 s p95" },
  { name: "Report Renderer", status: "Operational", latency: "4.1 s avg" },
  { name: "Object Storage", status: "Operational", latency: "38 ms" },
];

export const analysisSteps = [
  "Parsing requirements",
  "Generating architecture",
  "Mapping business KPIs",
  "Analyzing code",
  "Calculating risk",
  "Preparing dashboard",
];

export const sampleIdea = `We want to build a payment orchestration platform for mid-market merchants in India. Merchants should integrate a single API to accept cards, UPI and wallets. The platform must retry failed settlements safely, support partial refunds with reason codes, deliver webhooks for payment lifecycle events, and let our finance team export daily reconciliation files. Cardholder data must be tokenized and never stored, p95 authorization latency must stay under 400ms at 1200 TPS, and every privileged action needs an immutable audit trail. Deployment is limited to the ap-south-1 region.`;
