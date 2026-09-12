/**
 * PROJECT BRAHMA — CONNECTOR REGISTRY & PERMISSIONS STORE
 * Provider-neutral connector state management with granular tool authorization.
 * Supports MCP-compatible endpoints and built-in governed data sources (Kaggle, GitHub, Figma, Notion).
 * Strictly ZERO SQL.
 */

export type ConnectorProtocol = "mcp" | "rest" | "oauth";
export type ToolType = "READ" | "WRITE";
export type ToolImpact = "SAFE" | "HIGH_IMPACT";
export type SensitivityLevel = "LOW" | "HIGH" | "PII";

export interface ConnectorTool {
  id: string;
  name: string;
  description: string;
  type: ToolType;
  access: ToolType;
  impact: ToolImpact;
  enabled: boolean;
  isAuthorized: boolean;
  requiresConfirmation: boolean;
}

export interface ConnectorDefinition {
  id: string;
  name: string;
  type: string;
  category: "DATASET" | "VCS" | "DESIGN" | "DOCUMENTATION" | "CUSTOM_MCP";
  protocol: ConnectorProtocol;
  description: string;
  icon: string;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "RATE_LIMITED";
  isEnabled: boolean;
  authStatus: "AUTHORIZED" | "UNAUTHORIZED" | "EXPIRED";
  capabilities: Array<"data_access" | "actions" | "search" | "file_retrieval" | "prompts">;
  sensitivity: SensitivityLevel;
  tools: ConnectorTool[];
  lastInvokedAt: string | null;
  errorMessage?: string | null | undefined;
  endpointUrl?: string | undefined;
}

export type ConnectorState = ConnectorDefinition;

export interface ConnectorAuditLog {
  id: string;
  timestamp: string;
  connectorId: string;
  toolName: string;
  userId?: string | undefined;
  status: "SUCCESS" | "BLOCKED" | "FAILED";
  impact: ToolImpact;
  durationMs?: number | undefined;
  verificationHash?: string | undefined;
  parameters?: Record<string, unknown> | undefined;
  safeMetadata?: Record<string, unknown> | undefined;
}

export type AuditLogEntry = ConnectorAuditLog;

export interface ConnectorStoreState {
  connectors: Record<string, ConnectorDefinition>;
  auditLogs: ConnectorAuditLog[];
}

type ConnectorListener = (state: ConnectorStoreState) => void;

const INITIAL_CONNECTORS: Record<string, ConnectorDefinition> = {
  kaggle: {
    id: "kaggle",
    name: "Kaggle Open Data Connector",
    type: "DATASET",
    category: "DATASET",
    protocol: "mcp",
    description:
      "Governed dataset discovery, schema inspection, and partition streaming for Kaggle benchmarks.",
    icon: "database",
    status: "CONNECTED",
    isEnabled: true,
    authStatus: "AUTHORIZED",
    capabilities: ["data_access", "search", "prompts"],
    sensitivity: "LOW",
    lastInvokedAt: new Date().toISOString(),
    tools: [
      {
        id: "kaggle_search_datasets",
        name: "kaggle_search_datasets",
        description: "Search external Kaggle public benchmarks and extract candidate schemas.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
      {
        id: "kaggle_inspect_schema",
        name: "kaggle_inspect_schema",
        description: "Inspect schema contracts, sample rows, and usability statistics.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
      {
        id: "kaggle_ingest_partition",
        name: "kaggle_ingest_partition",
        description: "Buffer dataset partition into analysis memory without mutating database.",
        type: "WRITE",
        access: "WRITE",
        impact: "HIGH_IMPACT",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: true,
      },
    ],
  },
  github: {
    id: "github",
    name: "GitHub Enterprise VCS Connector",
    type: "VCS",
    category: "VCS",
    protocol: "rest",
    description:
      "Repository structural discovery, git blame metadata, and commit frequency analysis.",
    icon: "github",
    status: "CONNECTED",
    isEnabled: true,
    authStatus: "AUTHORIZED",
    capabilities: ["data_access", "file_retrieval", "search"],
    sensitivity: "HIGH",
    lastInvokedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    tools: [
      {
        id: "github_scan_security",
        name: "github_scan_security",
        description: "Scan target repository branches for security drift and dependency CVEs.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
      {
        id: "github_trigger_branch_scan",
        name: "github_trigger_branch_scan",
        description: "Trigger deep AST evaluation on commit push.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
    ],
  },
  figma: {
    id: "figma",
    name: "Figma UI Token Connector",
    type: "DESIGN",
    category: "DESIGN",
    protocol: "rest",
    description: "Design system tokens, wireframe node exports, and UI component schema alignment.",
    icon: "palette",
    status: "CONNECTED",
    isEnabled: true,
    authStatus: "AUTHORIZED",
    capabilities: ["data_access", "prompts"],
    sensitivity: "LOW",
    lastInvokedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    tools: [
      {
        id: "figma_export_tokens",
        name: "figma_export_tokens",
        description: "Export design system CSS tokens and typography variables.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
    ],
  },
  notion: {
    id: "notion",
    name: "Notion Knowledge Workspace",
    type: "DOCUMENTATION",
    category: "DOCUMENTATION",
    protocol: "oauth",
    description:
      "PRD documentation retrieval, architecture decision records (ADRs), and sprint logs.",
    icon: "file-text",
    status: "CONNECTED",
    isEnabled: true,
    authStatus: "AUTHORIZED",
    capabilities: ["data_access", "search"],
    sensitivity: "LOW",
    lastInvokedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    tools: [
      {
        id: "notion_fetch_spec",
        name: "notion_fetch_spec",
        description: "Fetch product specifications and user requirements docs.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
    ],
  },
  custom_mcp: {
    id: "custom_mcp",
    name: "Enterprise Custom MCP Endpoint",
    type: "CUSTOM_MCP",
    category: "CUSTOM_MCP",
    protocol: "mcp",
    description: "Custom internal Model Context Protocol microservice server.",
    icon: "plug",
    status: "CONNECTED",
    isEnabled: true,
    authStatus: "AUTHORIZED",
    capabilities: ["data_access", "actions", "search", "prompts"],
    sensitivity: "HIGH",
    endpointUrl: "http://127.0.0.1:8000/mcp",
    lastInvokedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    tools: [
      {
        id: "mcp_execute_query",
        name: "mcp_execute_query",
        description: "Run parameter-validated analytical queries against customer event warehouse.",
        type: "READ",
        access: "READ",
        impact: "SAFE",
        enabled: true,
        isAuthorized: true,
        requiresConfirmation: false,
      },
      {
        id: "mcp_deploy_patch",
        name: "mcp_deploy_patch",
        description: "Execute automated release rollback or gate bypass.",
        type: "WRITE",
        access: "WRITE",
        impact: "HIGH_IMPACT",
        enabled: false,
        isAuthorized: false,
        requiresConfirmation: true,
      },
    ],
  },
};

class ConnectorStore {
  private state: ConnectorStoreState;
  private listeners: Set<ConnectorListener> = new Set();

  constructor() {
    this.state = {
      connectors: INITIAL_CONNECTORS,
      auditLogs: [
        {
          id: "log-1",
          timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
          connectorId: "github",
          toolName: "github_scan_security",
          userId: "priya.nair@brahma.dev",
          status: "SUCCESS",
          impact: "SAFE",
          safeMetadata: { repo: "brahma-core", filesScanned: 142 },
          durationMs: 240,
          verificationHash: "sha256_mock_audit_hash_001",
        },
        {
          id: "log-2",
          timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
          connectorId: "kaggle",
          toolName: "kaggle_inspect_schema",
          userId: "priya.nair@brahma.dev",
          status: "SUCCESS",
          impact: "SAFE",
          safeMetadata: { dataset: "clementbingham/ieee-fraud-detection", records: 12480 },
          durationMs: 180,
          verificationHash: "sha256_mock_audit_hash_002",
        },
      ],
    };
  }

  public getState(): ConnectorStoreState {
    return this.state;
  }

  public getConnectors(): ConnectorDefinition[] {
    return Object.values(this.state.connectors);
  }

  public getConnector(connectorId: string): ConnectorDefinition | undefined {
    return this.state.connectors[connectorId];
  }

  public getAuditLogs(): ConnectorAuditLog[] {
    return this.state.auditLogs;
  }

  public toggleConnector(connectorId: string, enabled: boolean) {
    const conn = this.state.connectors[connectorId];
    if (!conn) return;

    this.state = {
      ...this.state,
      connectors: {
        ...this.state.connectors,
        [connectorId]: {
          ...conn,
          isEnabled: enabled,
          status: enabled ? "CONNECTED" : "DISCONNECTED",
        },
      },
    };
    this.notify();
  }

  public setToolAuthorization(connectorId: string, toolIdOrName: string, isAuthorized: boolean) {
    const conn = this.state.connectors[connectorId];
    if (!conn) return;

    const updatedTools = conn.tools.map((t) =>
      t.id === toolIdOrName || t.name === toolIdOrName
        ? { ...t, enabled: isAuthorized, isAuthorized }
        : t,
    );

    this.state = {
      ...this.state,
      connectors: {
        ...this.state.connectors,
        [connectorId]: {
          ...conn,
          tools: updatedTools,
        },
      },
    };
    this.notify();
  }

  public toggleTool(connectorId: string, toolId: string, enabled: boolean) {
    this.setToolAuthorization(connectorId, toolId, enabled);
  }

  public recordAudit(
    entry: Partial<ConnectorAuditLog> & { connectorId: string; toolName: string },
  ) {
    const fullLog: ConnectorAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      connectorId: entry.connectorId,
      toolName: entry.toolName,
      userId: entry.userId ?? "operator@brahma.dev",
      status: entry.status ?? "SUCCESS",
      impact: entry.impact ?? "SAFE",
      durationMs: entry.durationMs ?? 150,
      verificationHash: entry.verificationHash ?? undefined,
      parameters: entry.parameters ?? undefined,
      safeMetadata: entry.safeMetadata ?? undefined,
    };

    this.state = {
      ...this.state,
      auditLogs: [fullLog, ...this.state.auditLogs].slice(0, 100),
    };
    this.notify();
  }

  public logInvocation(
    connectorId: string,
    toolName: string,
    userId: string,
    impact: ToolImpact,
    status: ConnectorAuditLog["status"],
    safeMetadata: Record<string, unknown>,
  ) {
    this.recordAudit({
      connectorId,
      toolName,
      userId,
      impact,
      status,
      safeMetadata,
    });
  }

  public subscribe(listener: ConnectorListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const connectorStore = new ConnectorStore();
