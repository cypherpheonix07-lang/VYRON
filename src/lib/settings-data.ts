// Mock data for Settings and Admin surfaces. Deterministic, no random values.

export type MemberRole = "Viewer" | "Editor" | "Reviewer" | "Admin";
export type MemberStatus = "Active" | "Invitation pending" | "Suspended";

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: MemberRole;
  projects: number;
  creditsUsed: number;
  status: MemberStatus;
  lastActive: string;
}

export const currentUser = {
  name: "Priya Nair",
  initials: "PN",
  email: "priya.nair@brahma.dev",
  phone: "+91 98450 22117",
  title: "Head of Engineering Intelligence",
  organization: "BRAHMA Core Platform",
  role: "Admin" as MemberRole,
};

export const credits = { used: 142, total: 200 };
export const creditsPct = Math.round((credits.used / credits.total) * 100);

export const teamMembers: TeamMember[] = [
  { id: "m1", name: "Priya Nair", initials: "PN", email: "priya.nair@brahma.dev", role: "Admin", projects: 9, creditsUsed: 62, status: "Active", lastActive: "2 minutes ago" },
  { id: "m2", name: "Puli Phanindhra", initials: "PP", email: "phanindhra@brahma.dev", role: "Editor", projects: 6, creditsUsed: 31, status: "Active", lastActive: "1 hour ago" },
  { id: "m3", name: "Vishal Madhavan", initials: "VM", email: "vishal.madhavan@brahma.dev", role: "Editor", projects: 4, creditsUsed: 24, status: "Active", lastActive: "Yesterday" },
  { id: "m4", name: "Vishal S", initials: "VS", email: "vishal.s@brahma.dev", role: "Editor", projects: 3, creditsUsed: 19, status: "Active", lastActive: "3 days ago" },
  { id: "m5", name: "Aditi Sharma", initials: "AS", email: "aditi.sharma@brahma.dev", role: "Reviewer", projects: 0, creditsUsed: 6, status: "Invitation pending", lastActive: "Never" },
];

export const workspace = {
  name: "BRAHMA Core Workspace",
  domain: "Developer Tools",
  analysisProfile: "Enterprise (strict security + business impact)",
};

export type IntegrationStatus = "Connected" | "Not connected" | "Error";

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  lastSync: string;
  account: string;
  keyMask: string;
  scopes: string[];
}

export const integrations: Integration[] = [
  { id: "github", name: "GitHub", category: "Source control", status: "Connected", lastSync: "8 minutes ago", account: "brahma-labs (org)", keyMask: "ghp_••••••••••••4f21", scopes: ["repo:read", "pull_request:write", "workflow:read"] },
  { id: "supabase", name: "Supabase", category: "Database", status: "Connected", lastSync: "22 minutes ago", account: "project brahma-core-prod", keyMask: "sbp_••••••••••••9ac0", scopes: ["schema:read", "rls:audit"] },
  { id: "postgres", name: "PostgreSQL", category: "Database", status: "Connected", lastSync: "1 hour ago", account: "ap-south-1 primary replica", keyMask: "pg://••••••••@replica", scopes: ["schema:read"] },
  { id: "openai", name: "OpenAI", category: "AI provider", status: "Connected", lastSync: "3 minutes ago", account: "org-brahma-intel", keyMask: "sk-••••••••••••77bd", scopes: ["chat.completions", "embeddings"] },
  { id: "anthropic", name: "Anthropic", category: "AI provider", status: "Connected", lastSync: "5 minutes ago", account: "brahma-intel", keyMask: "sk-ant-••••••••1d43", scopes: ["messages"] },
  { id: "gemini", name: "Gemini", category: "AI provider", status: "Error", lastSync: "Failed 41 minutes ago", account: "brahma-gcp-intel", keyMask: "AIza••••••••••2ff1", scopes: ["generateContent"] },
  { id: "slack", name: "Slack", category: "Notifications", status: "Connected", lastSync: "12 minutes ago", account: "#brahma-alerts", keyMask: "xoxb-••••••••5510", scopes: ["chat:write", "channels:read"] },
  { id: "smtp", name: "Email (SMTP)", category: "Notifications", status: "Connected", lastSync: "34 minutes ago", account: "alerts@brahma.dev", keyMask: "smtp://••••••@relay", scopes: ["mail:send"] },
  { id: "stripe", name: "Stripe", category: "Billing", status: "Not connected", lastSync: "Never", account: "—", keyMask: "sk_live_••••••••", scopes: ["charges:read"] },
  { id: "webhooks", name: "Webhooks", category: "Automation", status: "Connected", lastSync: "6 minutes ago", account: "2 endpoints", keyMask: "whsec_••••••••b7e2", scopes: ["analysis.completed", "security.alert"] },
];

export const webhookEvents = [
  { id: "analysis.completed", label: "analysis.completed" },
  { id: "security.alert", label: "security.alert" },
  { id: "report.ready", label: "report.ready" },
  { id: "deploy.failed", label: "deploy.failed" },
];

export const webhookDeliveries = [
  { id: "d1", time: "2026-08-09 04:58:12", event: "analysis.completed", status: 200 },
  { id: "d2", time: "2026-08-09 04:31:07", event: "security.alert", status: 200 },
  { id: "d3", time: "2026-08-09 03:12:44", event: "report.ready", status: 500 },
  { id: "d4", time: "2026-08-08 22:04:19", event: "deploy.failed", status: 200 },
  { id: "d5", time: "2026-08-08 19:47:02", event: "analysis.completed", status: 500 },
];

export const notificationGroups = [
  {
    id: "analysis",
    label: "Analysis",
    items: [
      { id: "analysis.completed", label: "Analysis completed", on: true },
      { id: "analysis.failed", label: "Analysis failed", on: true },
      { id: "generation.ready", label: "Generation ready", on: false },
    ],
  },
  {
    id: "security",
    label: "Security",
    items: [
      { id: "security.critical", label: "Critical vulnerability alert", on: true },
      { id: "security.scan", label: "Security scan finished", on: true },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      { id: "report.ready", label: "Report ready", on: true },
      { id: "report.shared", label: "Report shared", on: false },
    ],
  },
  {
    id: "risk",
    label: "Risk",
    items: [
      { id: "risk.delivery", label: "Delivery risk warning", on: true },
      { id: "risk.sla", label: "SLA breach warning", on: true },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "system.digest", label: "Weekly digest", on: true },
      { id: "system.updates", label: "Product updates", on: false },
    ],
  },
] as const;

export interface ApiKeyRow {
  id: string;
  name: string;
  mask: string;
  scopes: string[];
  created: string;
  lastUsed: string;
  status: "Active" | "Revoked";
}

export const apiKeys: ApiKeyRow[] = [
  { id: "k1", name: "CI analysis runner", mask: "brh_live_••••••••4c19", scopes: ["read", "analyze"], created: "2026-05-12", lastUsed: "14 minutes ago", status: "Active" },
  { id: "k2", name: "Reporting service", mask: "brh_live_••••••••90fa", scopes: ["read"], created: "2026-04-02", lastUsed: "2 days ago", status: "Active" },
  { id: "k3", name: "Legacy publish hook", mask: "brh_live_••••••••2b77", scopes: ["read", "publish"], created: "2026-01-27", lastUsed: "38 days ago", status: "Revoked" },
];

export const apiKeyScopes = ["read", "analyze", "publish", "admin"] as const;

// ---------- Admin ----------

export const adminKpis = [
  { label: "Total users", value: "248", hint: "23 active this week", delta: 6 },
  { label: "Total projects", value: "61", hint: "9 created this month", delta: 12 },
  { label: "Total analyses", value: "1,432", hint: "Across all workspaces" },
  { label: "Total reports", value: "318", hint: "142 exported as PDF" },
  { label: "Publishes this month", value: "27", hint: "4 blocked by gates", delta: -8 },
  { label: "Avg health score", value: "82", hint: "Target 85" },
  { label: "Avg security risk", value: "Medium", hint: "11 critical findings open" },
  { label: "System health", value: "Operational", hint: "1 provider degraded" },
];

export const analysesPerDay = Array.from({ length: 30 }, (_, i) => {
  const base = [38, 44, 51, 47, 58, 33, 27];
  return {
    day: `Jul ${((i + 11) % 31) + 1}`,
    analyses: (base[i % 7] ?? 40) + ((i * 7) % 13),
  };
});

export const projectsByDomain = [
  { domain: "Education", projects: 17 },
  { domain: "Healthcare", projects: 11 },
  { domain: "Finance", projects: 9 },
  { domain: "E-commerce", projects: 8 },
  { domain: "Logistics", projects: 7 },
  { domain: "Governance", projects: 5 },
  { domain: "Developer Tools", projects: 4 },
];

export const adminRiskDistribution = [
  { name: "Low", value: 24, color: "var(--success)" },
  { name: "Medium", value: 19, color: "var(--warning)" },
  { name: "High", value: 12, color: "oklch(0.7 0.19 45)" },
  { name: "Critical", value: 6, color: "var(--critical)" },
];

export const adminSystemHealth = [
  { name: "API status", detail: "142 ms p95", status: "Operational" as const },
  { name: "AI provider status", detail: "Gemini degraded, fallback active", status: "Degraded" as const },
  { name: "Queue latency", detail: "3.2 s average job pickup", status: "Operational" as const },
  { name: "Storage used", detail: "412 GB of 1 TB", status: "Operational" as const },
];

export const adminActivity = [
  { id: "a1", time: "2026-08-09 04:58", user: "Priya Nair", action: "Blueprint generated for Smart Campus Portal", resource: "project:campusflow", severity: "Low" as const },
  { id: "a2", time: "2026-08-09 04:22", user: "System", action: "Security scan flagged 2 high issues", resource: "project:vaultledger", severity: "High" as const },
  { id: "a3", time: "2026-08-09 03:47", user: "Vishal Madhavan", action: "Report exported (PDF)", resource: "report:RPT-118", severity: "Low" as const },
  { id: "a4", time: "2026-08-08 22:16", user: "Priya Nair", action: "Role changed to Reviewer", resource: "user:aditi.sharma", severity: "Medium" as const },
  { id: "a5", time: "2026-08-08 20:03", user: "Puli Phanindhra", action: "API key created", resource: "key:CI analysis runner", severity: "Medium" as const },
  { id: "a6", time: "2026-08-08 18:41", user: "System", action: "Publish blocked by security gate", resource: "project:medisync", severity: "Critical" as const },
];

export type AdminUserStatus = "Active" | "Suspended" | "Pending";

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: MemberRole | "Student" | "Faculty" | "Startup";
  plan: string;
  projects: number;
  creditsUsed: number;
  status: AdminUserStatus;
  lastActive: string;
}

const firstNames = ["Priya Nair", "Puli Phanindhra", "Vishal Madhavan", "Vishal S", "Aditi Sharma", "Arjun Mehta", "Dr. S. Krishnan", "Rahul Verma", "Neha Rao", "Kavya Iyer", "Imran Sheikh", "Tanvi Desai", "Rohit Bhatia", "Meera Pillai", "Sanjay Gupta", "Ananya Bose", "Farhan Qureshi", "Divya Menon", "Karthik Reddy", "Sneha Kulkarni", "Manish Tiwari", "Lakshmi Rao", "Ved Prakash"];
const plans = ["Student Free", "Team Pro", "Startup", "Enterprise"];
const roles: AdminUser["role"][] = ["Admin", "Editor", "Reviewer", "Viewer", "Student", "Faculty", "Startup"];
const statuses: AdminUserStatus[] = ["Active", "Active", "Active", "Suspended", "Pending"];

export const adminUserDirectory: AdminUser[] = firstNames.map((name, i) => {
  const parts = name.replace("Dr. ", "").split(" ");
  const initials = `${parts[0]?.[0] ?? "B"}${parts[1]?.[0] ?? ""}`.toUpperCase();
  return {
    id: `au${i + 1}`,
    name,
    initials,
    email: `${name.toLowerCase().replace(/[^a-z ]/g, "").trim().replace(/ +/g, ".")}@brahma.dev`,
    role: roles[i % roles.length]!,
    plan: plans[i % plans.length]!,
    projects: (i * 3) % 11,
    creditsUsed: (i * 17) % 190,
    status: statuses[i % statuses.length]!,
    lastActive: i % 4 === 0 ? "Today" : i % 4 === 1 ? "Yesterday" : `${(i % 21) + 2} days ago`,
  };
});

export interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  usage: number;
  featured: boolean;
  status: "Published" | "Draft";
  description: string;
  tags: string[];
  modules: string[];
}

export const adminTemplates: AdminTemplate[] = [
  { id: "t1", name: "AI SaaS Dashboard", category: "Developer Tools", difficulty: "Advanced", usage: 412, featured: true, status: "Published", description: "Multi-tenant analytics dashboard with usage metering and AI insight panels.", tags: ["React", "FastAPI", "Postgres"], modules: ["Authentication", "Database", "Analytics", "AI Features"] },
  { id: "t2", name: "College Final-Year Project", category: "Education", difficulty: "Beginner", usage: 968, featured: true, status: "Published", description: "Guided capstone scaffold with SRS extraction and academic report output.", tags: ["React", "Python"], modules: ["Authentication", "Database", "Reports"] },
  { id: "t3", name: "E-commerce Admin", category: "E-commerce", difficulty: "Intermediate", usage: 317, featured: false, status: "Published", description: "Catalog, order and inventory administration with revenue analytics.", tags: ["Next.js", "Node"], modules: ["Database", "Admin Panel", "Analytics", "Payments"] },
  { id: "t4", name: "Healthcare Booking System", category: "Healthcare", difficulty: "Intermediate", usage: 204, featured: false, status: "Published", description: "Appointment scheduling with consent tracking and audit trail.", tags: ["React", "FastAPI"], modules: ["Authentication", "Database", "Notifications"] },
  { id: "t5", name: "Logistics Tracker", category: "Logistics", difficulty: "Advanced", usage: 143, featured: false, status: "Published", description: "Shipment tracking with route exceptions and SLA breach alerts.", tags: ["React", "Node", "Redis"], modules: ["Database", "Analytics", "Notifications"] },
  { id: "t6", name: "Smart Campus Portal", category: "Education", difficulty: "Intermediate", usage: 386, featured: true, status: "Published", description: "Attendance, timetable and facility booking for campus operations.", tags: ["React", "Python"], modules: ["Authentication", "Database", "Admin Panel", "Reports"] },
  { id: "t7", name: "IoT Monitoring Dashboard", category: "IoT", difficulty: "Advanced", usage: 97, featured: false, status: "Draft", description: "Device telemetry streams with threshold alerting and health scoring.", tags: ["React", "MQTT", "Timescale"], modules: ["Database", "Analytics", "Notifications"] },
  { id: "t8", name: "Internal Business Tool", category: "Developer Tools", difficulty: "Beginner", usage: 231, featured: false, status: "Published", description: "Internal CRUD console with role-based approvals and export.", tags: ["React", "Node"], modules: ["Authentication", "Database", "Admin Panel"] },
];

export const templateCategories = ["Education", "Healthcare", "Finance", "E-commerce", "Logistics", "Governance", "Developer Tools", "IoT"];
export const templateModules = ["Authentication", "Database", "Admin Panel", "Analytics", "Payments", "Notifications", "AI Features", "Reports"];

export const aiProviders = [
  { id: "openai", name: "OpenAI", status: "Operational" as const, keyMask: "sk-••••••••••••77bd", spend: "₹41,280", requests: "18,442" },
  { id: "anthropic", name: "Anthropic", status: "Operational" as const, keyMask: "sk-ant-••••••••1d43", spend: "₹27,910", requests: "11,207" },
  { id: "gemini", name: "Gemini", status: "Degraded" as const, keyMask: "AIza••••••••••2ff1", spend: "₹8,640", requests: "4,133" },
  { id: "openrouter", name: "OpenRouter", status: "Operational" as const, keyMask: "sk-or-••••••••55c8", spend: "₹3,120", requests: "1,982" },
];

export interface ModelRoute {
  id: string;
  task: string;
  model: string;
  fallback: string;
  temperature: number;
  maxTokens: number;
  costPer1k: string;
}

export const modelRoutes: ModelRoute[] = [
  { id: "r1", task: "Requirement parsing", model: "gpt-5.1-mini", fallback: "claude-haiku-4.5", temperature: 0.2, maxTokens: 8000, costPer1k: "₹0.42" },
  { id: "r2", task: "Architecture generation", model: "claude-sonnet-4.6", fallback: "gpt-5.1", temperature: 0.3, maxTokens: 16000, costPer1k: "₹1.85" },
  { id: "r3", task: "Code review", model: "gpt-5.1", fallback: "claude-sonnet-4.6", temperature: 0.1, maxTokens: 12000, costPer1k: "₹1.60" },
  { id: "r4", task: "Security analysis", model: "claude-sonnet-4.6", fallback: "gpt-5.1", temperature: 0.0, maxTokens: 12000, costPer1k: "₹1.85" },
  { id: "r5", task: "Report summarization", model: "gemini-3-flash", fallback: "gpt-5.1-mini", temperature: 0.4, maxTokens: 6000, costPer1k: "₹0.21" },
];

export type AuditEventType = "AUTH" | "ANALYSIS" | "SECURITY" | "PUBLISH" | "ADMIN" | "BILLING";

export interface AuditEntry {
  id: string;
  time: string;
  user: string;
  type: AuditEventType;
  action: string;
  resource: string;
  ip: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  payload: Record<string, unknown>;
}

export const auditEntries: AuditEntry[] = [
  { id: "e1", time: "2026-08-09 04:58:12", user: "priya.nair@brahma.dev", type: "ANALYSIS", action: "Blueprint generated for Smart Campus Portal", resource: "project:campusflow", ip: "103.21.244.18", severity: "Low", payload: { projectId: "campusflow", requirements: 24, clarity: 0.93, creditsSpent: 3 } },
  { id: "e2", time: "2026-08-09 04:22:41", user: "system", type: "SECURITY", action: "Security scan flagged 2 high issues", resource: "project:vaultledger", ip: "10.0.4.22", severity: "High", payload: { findings: [{ cwe: "CWE-89", severity: "High" }, { cwe: "CWE-311", severity: "High" }] } },
  { id: "e3", time: "2026-08-09 03:47:09", user: "vishal.madhavan@brahma.dev", type: "ANALYSIS", action: "Report exported (PDF)", resource: "report:RPT-118", ip: "49.207.11.94", severity: "Low", payload: { reportId: "RPT-118", pages: 14, format: "pdf" } },
  { id: "e4", time: "2026-08-08 22:16:33", user: "priya.nair@brahma.dev", type: "ADMIN", action: "Role changed to Reviewer", resource: "user:aditi.sharma", ip: "103.21.244.18", severity: "Medium", payload: { from: "Viewer", to: "Reviewer", approvedBy: "priya.nair@brahma.dev" } },
  { id: "e5", time: "2026-08-08 20:03:57", user: "phanindhra@brahma.dev", type: "AUTH", action: "API key created", resource: "key:CI analysis runner", ip: "157.32.8.140", severity: "Medium", payload: { scopes: ["read", "analyze"], expires: "2027-08-08" } },
  { id: "e6", time: "2026-08-08 18:41:12", user: "system", type: "PUBLISH", action: "Publish blocked by security gate", resource: "project:medisync", ip: "10.0.4.22", severity: "Critical", payload: { gate: "Security Review", score: 41, blocking: ["CWE-798 hardcoded credential"] } },
  { id: "e7", time: "2026-08-08 15:29:04", user: "vishal.s@brahma.dev", type: "ANALYSIS", action: "Code health analysis completed", resource: "project:aurora-ops", ip: "49.207.11.94", severity: "Low", payload: { maintainability: 78, duplication: 4.6, coverage: 67 } },
  { id: "e8", time: "2026-08-08 11:07:48", user: "priya.nair@brahma.dev", type: "BILLING", action: "Credit allowance adjusted", resource: "user:rahul.verma", ip: "103.21.244.18", severity: "Medium", payload: { delta: 25, reason: "Capstone deadline extension" } },
  { id: "e9", time: "2026-08-07 19:52:20", user: "krishnan@brahma.dev", type: "AUTH", action: "Signed in with SSO", resource: "session:9f21", ip: "14.139.82.7", severity: "Low", payload: { provider: "SAML", mfa: true } },
  { id: "e10", time: "2026-08-07 09:58:03", user: "priya.nair@brahma.dev", type: "ADMIN", action: "Rotated workspace LLM API key", resource: "workspace:brahma-core", ip: "103.21.244.18", severity: "High", payload: { providers: ["openai", "anthropic"], rotatedKeys: 2 } },
];

export const creditsPerDay = Array.from({ length: 14 }, (_, i) => ({
  day: `Aug ${i + 1}`,
  credits: [6, 9, 12, 8, 14, 5, 4, 11, 13, 10, 15, 9, 12, 14][i] ?? 8,
}));

export const featureUsage = [
  { feature: "Blueprint generation", credits: 48 },
  { feature: "Code analysis", credits: 37 },
  { feature: "Security scan", credits: 26 },
  { feature: "Reports", credits: 19 },
  { feature: "AI copilot", credits: 12 },
];

export const planSummary = [
  { name: "Student Free", price: "₹0", credits: "40 runs / month", users: 132, features: ["1 workspace", "Blueprint + code health", "Academic report export"] },
  { name: "Team Pro", price: "₹4,999", credits: "200 runs / month", users: 74, features: ["5 workspaces", "Security studio", "Slack + webhooks"] },
  { name: "Startup", price: "₹12,999", credits: "600 runs / month", users: 31, features: ["Unlimited projects", "Risk & business mapping", "Priority analysis queue"] },
  { name: "Enterprise", price: "Custom", credits: "Pooled credits", users: 11, features: ["SSO + SAML", "Audit export & retention", "Dedicated model routing"] },
];
