/**
 * PROJECT BRAHMA — DEMO BLUEPRINT TOPOLOGY (FL-02-B STEP 1)
 * High-fidelity 12-microservice topology for FinLedger platform.
 */

export interface DemoBlueprintNode {
  id: string;
  label: string;
  kind: "Frontend" | "Backend" | "Database" | "Auth" | "AI" | "Worker" | "Storage" | "External";
  tech: string;
  detail: string;
  x: number;
  y: number;
  healthScore: number;
  criticality: "High" | "Medium" | "Low";
}

export interface DemoBlueprintEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  animated?: boolean;
}

export const DEMO_BLUEPRINT_NODES: DemoBlueprintNode[] = [
  {
    id: "APIGateway",
    label: "API Gateway",
    kind: "Backend",
    tech: "Kong / Envoy + Python Fastify",
    detail: "Edge routing, rate limiting (2000 rps), and cryptographic request verification.",
    x: 50,
    y: 180,
    healthScore: 92,
    criticality: "High",
  },
  {
    id: "AuthService",
    label: "Auth Service",
    kind: "Auth",
    tech: "OAuth2 / OIDC + RSA-4096",
    detail: "M2M token exchange, scope enforcement, and tenant identity management.",
    x: 300,
    y: 60,
    healthScore: 78,
    criticality: "High",
  },
  {
    id: "PaymentProcessor",
    label: "Payment Processor",
    kind: "Backend",
    tech: "Python FastAPI / Celery",
    detail: "Dual-ledger transaction orchestration, idempotency locking, and settlement routing.",
    x: 300,
    y: 200,
    healthScore: 64,
    criticality: "High",
  },
  {
    id: "UserService",
    label: "User Service",
    kind: "Backend",
    tech: "Python SQLAlchemy + PostgreSQL",
    detail: "Merchant profile metadata, account settings, and tiered permissions.",
    x: 300,
    y: -60,
    healthScore: 89,
    criticality: "Medium",
  },
  {
    id: "LedgerService",
    label: "Ledger Service",
    kind: "Database",
    tech: "PostgreSQL 16 + Append-Only WAL",
    detail: "PCI-DSS compliant immutable double-entry journal with cryptographic hash chaining.",
    x: 550,
    y: 120,
    healthScore: 85,
    criticality: "High",
  },
  {
    id: "RiskEngine",
    label: "Risk Engine",
    kind: "AI",
    tech: "PyTorch + ONNX Runtime",
    detail: "Real-time anomaly detection scoring fraud probability within 25ms SLA.",
    x: 550,
    y: 280,
    healthScore: 58,
    criticality: "High",
  },
  {
    id: "AuditLogger",
    label: "Audit Logger",
    kind: "Storage",
    tech: "ClickHouse + S3 Archive",
    detail: "Non-repudiation audit trails for all state transitions and financial mutations.",
    x: 800,
    y: 180,
    healthScore: 95,
    criticality: "High",
  },
  {
    id: "DataWarehouse",
    label: "Data Warehouse",
    kind: "Storage",
    tech: "DuckDB / Parquet S3",
    detail: "Reconciled ledger snapshots and analytical aggregates for compliance reporting.",
    x: 800,
    y: 40,
    healthScore: 91,
    criticality: "Medium",
  },
  {
    id: "ComplianceChecker",
    label: "Compliance Checker",
    kind: "Worker",
    tech: "Python Background Daemon",
    detail: "Automated PCI-DSS, SOC2, and AML rule validation against transaction windows.",
    x: 800,
    y: 320,
    healthScore: 61,
    criticality: "High",
  },
  {
    id: "NotificationService",
    label: "Notification Service",
    kind: "Worker",
    tech: "Redis Streams + Twilio/SendGrid",
    detail: "Webhook dispatcher and real-time merchant alert broadcast engine.",
    x: 50,
    y: -60,
    healthScore: 94,
    criticality: "Low",
  },
  {
    id: "ReportEngine",
    label: "Report Engine",
    kind: "Backend",
    tech: "Go / Headless Chromium",
    detail: "PDF/CSV ledger reconciliation generation and scheduled statement distribution.",
    x: 550,
    y: -60,
    healthScore: 82,
    criticality: "Medium",
  },
  {
    id: "MessageBroker",
    label: "Message Broker",
    kind: "Worker",
    tech: "RabbitMQ / Kafka Cluster",
    detail: "Decoupled async event spine with dead-letter queueing and strict delivery guarantees.",
    x: 300,
    y: 350,
    healthScore: 88,
    criticality: "High",
  },
];

export const DEMO_BLUEPRINT_EDGES: DemoBlueprintEdge[] = [
  { id: "e-gw-auth", source: "APIGateway", target: "AuthService", protocol: "gRPC", animated: true },
  { id: "e-gw-pay", source: "APIGateway", target: "PaymentProcessor", protocol: "HTTP/2", animated: true },
  { id: "e-gw-usr", source: "APIGateway", target: "UserService", protocol: "HTTP/2" },
  { id: "e-auth-usr", source: "AuthService", target: "UserService", protocol: "mTLS" },
  { id: "e-pay-ledger", source: "PaymentProcessor", target: "LedgerService", protocol: "TCP/Pool", animated: true },
  { id: "e-pay-risk", source: "PaymentProcessor", target: "RiskEngine", protocol: "gRPC", animated: true },
  { id: "e-pay-broker", source: "PaymentProcessor", target: "MessageBroker", protocol: "AMQP" },
  { id: "e-ledger-audit", source: "LedgerService", target: "AuditLogger", protocol: "Syslog/mTLS" },
  { id: "e-ledger-wh", source: "LedgerService", target: "DataWarehouse", protocol: "Batch CDC" },
  { id: "e-risk-comp", source: "RiskEngine", target: "ComplianceChecker", protocol: "Async Event" },
  { id: "e-risk-audit", source: "RiskEngine", target: "AuditLogger", protocol: "Syslog/mTLS" },
  { id: "e-notif-usr", source: "NotificationService", target: "UserService", protocol: "Internal RPC" },
  { id: "e-report-wh", source: "ReportEngine", target: "DataWarehouse", protocol: "Read Replica SQL" },
];
