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

const STORAGE_KEY_CONNECTORS = "vyron_connectors_registry_v1";
const STORAGE_KEY_AUDIT = "vyron_connector_audit_logs_v1";

const INITIAL_CONNECTORS: Record<string, ConnectorDefinition> = {
  kaggle: {
    id: "kaggle",
    name: "Kaggle Open Data Connector",
    type: "DATASET",
    category: "DATASET",
    protocol: "mcp",
    description:
      "Governed dataset discovery, schema inspection, and partition streaming for Kaggle benchmarks (Active in Curated Benchmark Mode).",
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
      "Repository structural discovery, git blame metadata, and commit frequency forensics.",
    icon: "github",
    status: "DISCONNECTED",
    isEnabled: false,
    authStatus: "UNAUTHORIZED",
    errorMessage: "No linked GitHub account. Connect via GitHub OAuth.",
    capabilities: ["data_access", "file_retrieval", "search"],
    sensitivity: "HIGH",
    lastInvokedAt: null,
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
    status: "DISCONNECTED",
    isEnabled: false,
    authStatus: "UNAUTHORIZED",
    errorMessage: "Figma access token not configured in environment (VITE_FIGMA_ACCESS_TOKEN).",
    capabilities: ["data_access", "prompts"],
    sensitivity: "LOW",
    lastInvokedAt: null,
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
    status: "DISCONNECTED",
    isEnabled: false,
    authStatus: "UNAUTHORIZED",
    errorMessage: "Notion API key not configured in environment (VITE_NOTION_API_KEY).",
    capabilities: ["data_access", "search"],
    sensitivity: "LOW",
    lastInvokedAt: null,
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
    status: "DISCONNECTED",
    isEnabled: false,
    authStatus: "UNAUTHORIZED",
    errorMessage: "Custom MCP service unprobed at http://127.0.0.1:8000/mcp.",
    capabilities: ["data_access", "actions", "search", "prompts"],
    sensitivity: "HIGH",
    endpointUrl: "http://127.0.0.1:8000/mcp",
    lastInvokedAt: null,
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
    let initialConnectors = { ...INITIAL_CONNECTORS };
    let initialAudit: ConnectorAuditLog[] = [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        connectorId: "kaggle",
        toolName: "kaggle_inspect_schema",
        userId: "priya.nair@brahma.dev",
        status: "SUCCESS",
        impact: "SAFE",
        safeMetadata: { dataset: "clementbingham/ieee-fraud-detection", records: 12480 },
        durationMs: 45,
        verificationHash: "sha256_mock_audit_hash_001",
      },
    ];

    if (typeof window !== "undefined") {
      try {
        const storedConnectors = localStorage.getItem(STORAGE_KEY_CONNECTORS);
        if (storedConnectors) {
          const parsed = JSON.parse(storedConnectors) as Record<string, ConnectorDefinition>;
          // Merge stored definitions with initial definitions to ensure schema freshness
          initialConnectors = {
            ...INITIAL_CONNECTORS,
            ...parsed,
          };
        }
        const storedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (storedAudit) {
          initialAudit = JSON.parse(storedAudit) as ConnectorAuditLog[];
        }
      } catch {
        // Fallback to initial
      }
    }

    this.state = {
      connectors: initialConnectors,
      auditLogs: initialAudit,
    };

    // Asynchronous check for existing connected GitHub accounts
    if (typeof window !== "undefined") {
      this.probeInitialGitHubState();
    }
  }

  private async probeInitialGitHubState() {
    try {
      const { fetchConnectedAccounts } = await import("@/lib/github/api");
      const accounts = await fetchConnectedAccounts();
      if (accounts && accounts.length > 0) {
        const gh = this.state.connectors["github"];
        if (gh && gh.status !== "CONNECTED") {
          this.state = {
            ...this.state,
            connectors: {
              ...this.state.connectors,
              github: {
                ...gh,
                status: "CONNECTED",
                isEnabled: true,
                authStatus: "AUTHORIZED",
                errorMessage: null,
              },
            },
          };
          this.saveToStorage();
          this.notify();
        }
      }
    } catch {
      // Ignore background probe failure
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_CONNECTORS, JSON.stringify(this.state.connectors));
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.state.auditLogs));
    } catch {
      // Storage unavailable or quota exceeded
    }
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
          status: enabled ? (conn.authStatus === "AUTHORIZED" ? "CONNECTED" : "DISCONNECTED") : "DISCONNECTED",
        },
      },
    };
    this.saveToStorage();
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
    this.saveToStorage();
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
    this.saveToStorage();
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

  public updateStatus(
    connectorId: string,
    status: ConnectorDefinition["status"],
    errorMessage?: string | null,
  ) {
    const conn = this.state.connectors[connectorId];
    if (!conn) return;
    this.state = {
      ...this.state,
      connectors: {
        ...this.state.connectors,
        [connectorId]: {
          ...conn,
          status,
          errorMessage: errorMessage !== undefined ? errorMessage : conn.errorMessage,
          lastInvokedAt: new Date().toISOString(),
        },
      },
    };
    this.saveToStorage();
    this.notify();
  }

  public setConnectorAuth(
    connectorId: string,
    authStatus: ConnectorDefinition["authStatus"],
    isEnabled: boolean,
  ) {
    const conn = this.state.connectors[connectorId];
    if (!conn) return;
    this.state = {
      ...this.state,
      connectors: {
        ...this.state.connectors,
        [connectorId]: {
          ...conn,
          authStatus,
          isEnabled,
          status: isEnabled && authStatus === "AUTHORIZED" ? "CONNECTED" : "DISCONNECTED",
        },
      },
    };
    this.saveToStorage();
    this.notify();
  }

  public async testConnection(
    connectorId: string,
  ): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const conn = this.state.connectors[connectorId];
    if (!conn) {
      return { success: false, latencyMs: 0, message: `Connector '${connectorId}' not found.` };
    }
    const startTime = Date.now();

    if (connectorId === "github") {
      try {
        const { fetchConnectedAccounts } = await import("@/lib/github/api");
        const accounts = await fetchConnectedAccounts();
        const latencyMs = Date.now() - startTime;
        if (accounts && accounts.length > 0) {
          this.updateStatus(connectorId, "CONNECTED", null);
          this.setConnectorAuth(connectorId, "AUTHORIZED", true);
          this.recordAudit({
            connectorId,
            toolName: "github_probe",
            status: "SUCCESS",
            impact: "SAFE",
            durationMs: latencyMs,
          });
          return {
            success: true,
            latencyMs,
            message: `GitHub connected (${accounts.length} linked account(s): ${accounts.map((a) => a.login).join(", ")}).`,
          };
        } else {
          this.updateStatus(connectorId, "DISCONNECTED", "No connected GitHub accounts found.");
          this.setConnectorAuth(connectorId, "UNAUTHORIZED", false);
          this.recordAudit({
            connectorId,
            toolName: "github_probe",
            status: "BLOCKED",
            impact: "SAFE",
            durationMs: latencyMs,
          });
          return {
            success: false,
            latencyMs,
            message: "No connected GitHub accounts found. Please link an account via GitHub OAuth.",
          };
        }
      } catch (err) {
        const latencyMs = Date.now() - startTime;
        const msg = `GitHub connection probe failed: ${(err as Error).message}`;
        this.updateStatus(connectorId, "ERROR", msg);
        return { success: false, latencyMs, message: msg };
      }
    }

    if (connectorId === "kaggle") {
      try {
        const { kaggleClient } = await import("@/services/kaggleClient");
        const results = await kaggleClient.search("fraud");
        const latencyMs = Date.now() - startTime;
        this.updateStatus(connectorId, "CONNECTED", null);
        this.setConnectorAuth(connectorId, "AUTHORIZED", true);
        this.recordAudit({
          connectorId,
          toolName: "kaggle_probe",
          status: "SUCCESS",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return {
          success: true,
          latencyMs,
          message: `Kaggle open data benchmark service verified (${results.length} curated benchmarks available in governed mode).`,
        };
      } catch (err) {
        const latencyMs = Date.now() - startTime;
        const msg = `Kaggle probe failed: ${(err as Error).message}`;
        this.updateStatus(connectorId, "ERROR", msg);
        return { success: false, latencyMs, message: msg };
      }
    }

    if (connectorId === "figma") {
      const latencyMs = Date.now() - startTime;
      const hasToken =
        typeof import.meta !== "undefined" &&
        Boolean(import.meta.env?.["VITE_FIGMA_ACCESS_TOKEN"]);

      if (hasToken) {
        this.updateStatus(connectorId, "CONNECTED", null);
        this.setConnectorAuth(connectorId, "AUTHORIZED", true);
        this.recordAudit({
          connectorId,
          toolName: "figma_probe",
          status: "SUCCESS",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return { success: true, latencyMs, message: "Figma design token connector authorized via environment token." };
      } else {
        const msg = "Figma access token not configured in environment (set VITE_FIGMA_ACCESS_TOKEN).";
        this.updateStatus(connectorId, "DISCONNECTED", msg);
        this.setConnectorAuth(connectorId, "UNAUTHORIZED", false);
        this.recordAudit({
          connectorId,
          toolName: "figma_probe",
          status: "BLOCKED",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return { success: false, latencyMs, message: msg };
      }
    }

    if (connectorId === "notion") {
      const latencyMs = Date.now() - startTime;
      const hasKey =
        typeof import.meta !== "undefined" &&
        Boolean(import.meta.env?.["VITE_NOTION_API_KEY"]);

      if (hasKey) {
        this.updateStatus(connectorId, "CONNECTED", null);
        this.setConnectorAuth(connectorId, "AUTHORIZED", true);
        this.recordAudit({
          connectorId,
          toolName: "notion_probe",
          status: "SUCCESS",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return { success: true, latencyMs, message: "Notion knowledge workspace authorized via environment API key." };
      } else {
        const msg = "Notion API key not configured in environment (set VITE_NOTION_API_KEY).";
        this.updateStatus(connectorId, "DISCONNECTED", msg);
        this.setConnectorAuth(connectorId, "UNAUTHORIZED", false);
        this.recordAudit({
          connectorId,
          toolName: "notion_probe",
          status: "BLOCKED",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return { success: false, latencyMs, message: msg };
      }
    }

    if (connectorId === "custom_mcp") {
      const targetUrl = conn.endpointUrl || "http://127.0.0.1:8000/mcp";
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        await fetch(targetUrl, { method: "HEAD", signal: controller.signal, mode: "no-cors" });
        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;
        this.updateStatus(connectorId, "CONNECTED", null);
        this.setConnectorAuth(connectorId, "AUTHORIZED", true);
        this.recordAudit({
          connectorId,
          toolName: "mcp_probe",
          status: "SUCCESS",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return { success: true, latencyMs, message: `Custom MCP endpoint reachable at ${targetUrl}.` };
      } catch (err) {
        const latencyMs = Date.now() - startTime;
        const msg = `Custom MCP endpoint probe failed at ${targetUrl}: Service unreachable or offline.`;
        this.updateStatus(connectorId, "ERROR", msg);
        this.setConnectorAuth(connectorId, "UNAUTHORIZED", false);
        this.recordAudit({
          connectorId,
          toolName: "mcp_probe",
          status: "FAILED",
          impact: "SAFE",
          durationMs: latencyMs,
        });
        return { success: false, latencyMs, message: msg };
      }
    }

    // Default fallback
    const latencyMs = Date.now() - startTime;
    return { success: false, latencyMs, message: `Unknown connector probe target '${connectorId}'.` };
  }

  public async reconnect(connectorId: string): Promise<void> {
    const conn = this.state.connectors[connectorId];
    if (!conn) return;
    await this.testConnection(connectorId);
    this.recordAudit({
      connectorId,
      toolName: "reconnect",
      status: "SUCCESS",
      impact: "SAFE",
    });
  }

  public revoke(connectorId: string): void {
    const conn = this.state.connectors[connectorId];
    if (!conn) return;
    this.state = {
      ...this.state,
      connectors: {
        ...this.state.connectors,
        [connectorId]: {
          ...conn,
          isEnabled: false,
          status: "DISCONNECTED",
          authStatus: "EXPIRED",
          errorMessage: "Credentials revoked by operator.",
        },
      },
    };
    this.recordAudit({
      connectorId,
      toolName: "revoke_credentials",
      status: "BLOCKED",
      impact: "HIGH_IMPACT",
    });
    this.saveToStorage();
    this.notify();
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
