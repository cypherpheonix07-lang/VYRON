/**
 * Integration Contract Genome — Complete Connector Specification & Schema Engine
 */

export interface ConnectorGenome {
  provider_id: string;
  connection_id: string;
  resource_types: string[];
  identity_scope: string[];
  auth_method: "OAUTH2" | "API_KEY" | "MUTUAL_TLS" | "BEARER_JWT" | "MCP_STDIO";
  oauth_scopes: string[];
  capabilities: string[];
  read_actions: string[];
  write_actions: string[];
  destructive_actions: string[];
  tools: string[];
  resources: string[];
  prompts: string[];
  rate_limits: {
    maxRequestsPerMinute: number;
    burstQuota: number;
  };
  cost_model: "FREE" | "USAGE_BASED" | "TIERED";
  freshness_sla: number;
  health_slo: {
    targetUptimePercent: number;
    maxP95LatencyMs: number;
  };
  webhook_support: boolean;
  polling_support: boolean;
  reconciliation_strategy: "CONTINUOUS_STREAM" | "CRON_DIFF" | "ON_DEMAND";
  replay_strategy: "IDEMPOTENT_EVENT_ID" | "TRANSACTION_ROLLBACK" | "COMPENSATING_ACTION";
  credential_lifecycle: "AUTO_REFRESH" | "MANUAL_ROTATION" | "EPHEMERAL_VAULT";
  revocation_path: string;
  policy_requirements: string[];
  human_approval_requirements: string[];
  postcondition_verifiers: string[];
  evidence_adapter: string;
  audit_events: string[];
  version: string;
  owner: string;
  certification_state: "CERTIFIED_PRODUCTION" | "SANDBOX_TESTED" | "COMMUNITY_CONTRIBUTED";
}

class IntegrationContractGenomeEngine {
  private genomeRegistry: Map<string, ConnectorGenome> = new Map();

  constructor() {
    this.registerDefaultGenomes();
  }

  private registerDefaultGenomes(): void {
    const githubGenome: ConnectorGenome = {
      provider_id: "github",
      connection_id: "conn-github-core",
      resource_types: ["repositories", "branches", "pull_requests", "issues", "releases", "workflows"],
      identity_scope: ["read:user", "user:email"],
      auth_method: "OAUTH2",
      oauth_scopes: ["repo", "read:org", "workflow"],
      capabilities: ["DISCOVER", "READ", "BRANCH", "COMMIT", "PR", "OBSERVE", "RECONCILE"],
      read_actions: ["list_repos", "get_commit", "get_diff", "list_branches"],
      write_actions: ["create_branch", "push_commit", "create_pr"],
      destructive_actions: ["delete_branch", "close_pr"],
      tools: ["github_search_code", "github_create_pr", "github_get_tree"],
      resources: ["github://repos", "github://commits"],
      prompts: ["summarize_pr_diff", "generate_release_notes"],
      rate_limits: { maxRequestsPerMinute: 5000, burstQuota: 100 },
      cost_model: "FREE",
      freshness_sla: 30,
      health_slo: { targetUptimePercent: 99.9, maxP95LatencyMs: 300 },
      webhook_support: true,
      polling_support: true,
      reconciliation_strategy: "CONTINUOUS_STREAM",
      replay_strategy: "IDEMPOTENT_EVENT_ID",
      credential_lifecycle: "AUTO_REFRESH",
      revocation_path: "https://github.com/settings/connections/applications",
      policy_requirements: ["require_signed_commits", "require_branch_protection"],
      human_approval_requirements: ["destructive_actions", "direct_main_push"],
      postcondition_verifiers: ["verify_commit_sha_on_remote", "verify_pr_open"],
      evidence_adapter: "GitHubEvidenceAdapter",
      audit_events: ["repo_bound", "pr_created", "branch_created"],
      version: "2.4.0",
      owner: "VYRON Ecosystem Core",
      certification_state: "CERTIFIED_PRODUCTION",
    };

    this.genomeRegistry.set("github", githubGenome);
  }

  public getGenome(providerId: string): ConnectorGenome | undefined {
    return this.genomeRegistry.get(providerId);
  }

  public listGenomes(): ConnectorGenome[] {
    return Array.from(this.genomeRegistry.values());
  }
}

export const integrationContractGenome = new IntegrationContractGenomeEngine();
