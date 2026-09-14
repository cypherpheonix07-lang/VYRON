/**
 * PROJECT BRAHMA — PLUGIN REGISTRY BARREL EXPORT
 * Registers the 5 core platform plugins with rich capability manifests,
 * versions, dependencies, and permissions.
 */

import { pluginRegistry, PluginRegistry } from "./PluginRegistry";
import { analysisPluginTool } from "./analysis-plugin";
import { chatPluginTool } from "./chat-plugin";
import { dataPluginTool } from "./data-plugin";
import { reportPluginTool } from "./report-plugin";
import { githubPluginTool } from "./github-plugin";

// Register all 5 core tools into the in-process registry
pluginRegistry.registerTool(analysisPluginTool);
pluginRegistry.registerTool(chatPluginTool);
pluginRegistry.registerTool(dataPluginTool);
pluginRegistry.registerTool(reportPluginTool);
pluginRegistry.registerTool(githubPluginTool);

// Register manifests for the 5 core plugins
pluginRegistry.registerManifest({
  id: "plugin_analysis_orchestrator",
  name: "12-Stage Pipeline Orchestrator",
  version: "2.4.0",
  author: "Brahma Architecture Core",
  description:
    "Autonomous 12-stage analytical pipeline: ingestion, schema contracts, IQR anomaly detection, graph centrality, and SHAP explainability.",
  icon: "activity",
  category: "ANALYTICS",
  lifecycleState: "ACTIVE",
  healthStatus: "HEALTHY",
  permissions: ["read:data", "execute:pipeline", "audit:write"],
  dependencies: ["numpy-wasm", "mathjs"],
  capabilities: ["Data Ingestion", "IQR Anomaly Scoring", "Entity Graph Centrality", "SHAP Attribution"],
  supportedModes: ["NORMAL", "DEMO"],
  tools: ["run_analysis_pipeline", "inspect_stage_metrics"],
  lastActiveAt: new Date().toISOString(),
});

pluginRegistry.registerManifest({
  id: "plugin_kaggle_discovery",
  name: "Kaggle Open Data & Ingestion Hub",
  version: "1.9.2",
  author: "Brahma Ingestion Team",
  description:
    "Governed Kaggle dataset discovery, schema contract validation, and partition streaming without browser credential leakage.",
  icon: "database",
  category: "INGESTION",
  lifecycleState: "ACTIVE",
  healthStatus: "HEALTHY",
  permissions: ["read:external_data", "buffer:partition"],
  dependencies: ["kaggle-mcp-connector"],
  capabilities: ["Benchmark Search", "Schema Contract Validation", "Partition Buffering"],
  supportedModes: ["NORMAL", "DEMO"],
  tools: ["kaggle_search_datasets", "kaggle_inspect_schema"],
  lastActiveAt: new Date().toISOString(),
});

pluginRegistry.registerManifest({
  id: "plugin_github_governance",
  name: "GitHub Enterprise VCS & AST Scanner",
  version: "3.1.0",
  author: "Brahma Security Core",
  description:
    "Repository structural discovery, git blame forensics, AST cyclomatic complexity analysis (Lizard), and Bandit static security checks.",
  icon: "github",
  category: "GOVERNANCE",
  lifecycleState: "ACTIVE",
  healthStatus: "HEALTHY",
  permissions: ["read:vcs", "analyze:ast", "read:commits"],
  dependencies: ["github-rest-connector", "brahma-engine-ast"],
  capabilities: ["AST Parsing", "Cyclomatic Complexity Scoring", "Security Vulnerability Auditing"],
  supportedModes: ["NORMAL", "DEMO"],
  tools: ["github_scan_security", "github_fetch_commits"],
  lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
});

pluginRegistry.registerManifest({
  id: "plugin_compliance_audit",
  name: "Cryptographic Audit & Gate Compliance",
  version: "2.0.1",
  author: "Brahma Security Governance",
  description:
    "Deterministic 7-check release gate verification, SHA-256 report finalization, and tamper-evident audit logging.",
  icon: "shield",
  category: "COMPLIANCE",
  lifecycleState: "ACTIVE",
  healthStatus: "HEALTHY",
  permissions: ["sign:artifacts", "read:audit_events"],
  dependencies: ["webcrypto"],
  capabilities: ["Release Gate Verification", "SHA-256 Artifact Sealing", "Tamper-Evident Provenance"],
  supportedModes: ["NORMAL", "DEMO"],
  tools: ["generate_audit_digest", "verify_cryptographic_seal"],
  lastActiveAt: new Date().toISOString(),
});

pluginRegistry.registerManifest({
  id: "plugin_architecture_synthesis",
  name: "AI Studio Architecture & DAG Synthesis",
  version: "2.2.0",
  author: "Brahma Design Lab",
  description:
    "Transforms natural language software requirements into verified microservice DAG blueprints, schema DDL, and API contracts.",
  icon: "sparkles",
  category: "ARCHITECTURE",
  lifecycleState: "ACTIVE",
  healthStatus: "HEALTHY",
  permissions: ["write:blueprints", "export:contracts"],
  dependencies: ["xyflow-react", "ai-router"],
  capabilities: ["DAG Blueprint Synthesis", "Schema DDL Generation", "OpenAPI Spec Export"],
  supportedModes: ["NORMAL", "DEMO"],
  tools: ["synthesize_blueprint_dag", "export_openapi_contract"],
  lastActiveAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
});

export const brahmaPlugins = pluginRegistry;
export { PluginRegistry };
export * from "./types";
export { analysisPluginTool } from "./analysis-plugin";
export { chatPluginTool } from "./chat-plugin";
export { dataPluginTool } from "./data-plugin";
export { reportPluginTool } from "./report-plugin";
export { githubPluginTool } from "./github-plugin";
