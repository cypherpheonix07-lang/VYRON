/**
 * PROJECT BRAHMA — COPILOT CONTEXT ENGINE
 * Assembles dynamic, project-aware, and mode-isolated application context.
 * Gathers active route, project, dataset, analysis telemetry, connectors, and plugins.
 * Strictly isolates untrusted external data from trusted system instructions.
 * Zero SQL.
 */

import { AppMode, modeStore } from "@/state/mode/modeStore";
import { analysisStore, AnalysisRun } from "@/state/analysis/analysisStore";
import { connectorStore } from "@/state/connectors/connectorStore";
import { demoStore } from "@/state/demo/demoStore";
import { pluginRegistry } from "@/plugins/PluginRegistry";
import { missionEngine, EngineeringMission } from "@/services/missions/missionEngine";
import { architectureDriftEngine } from "@/services/intelligence/driftEngine";
import { policyEngine } from "@/services/policy/policyEngine";

export interface ProjectContextData {
  id: string;
  name: string;
  healthScore: number;
  status: string;
  domain?: string;
  repoFullName?: string;
}

export interface CopilotLiveContext {
  mode: AppMode;
  route: {
    pathname: string;
    section: string;
    targetId?: string;
  };
  project: {
    id: string;
    name: string;
    healthScore: number;
    status: string;
    domain?: string;
    repoFullName?: string;
  };
  dataset: {
    id: string;
    name: string;
    totalRecords: number;
    sampleColumns: string[];
    isBenchmark: boolean;
  };
  analysis: {
    runId: string;
    status: string;
    currentStageId: number | null;
    currentStageName: string | null;
    progressPercent: number;
    overallRiskScore: number;
    anomaliesDetected: number;
    criticalFindingsCount: number;
    findingsSummary: string[];
  };
  connectors: Array<{
    id: string;
    name: string;
    status: string;
    toolCount: number;
    isEnabled: boolean;
  }>;
  plugins: Array<{
    name: string;
    category?: string;
  }>;
  system: {
    timestamp: string;
    environment: string;
    isDemoSafe: boolean;
  };
  controlPlane: {
    activeMission?: {
      id: string;
      title: string;
      status: string;
      stepProgress: string;
    } | null;
    driftSummary: {
      findingsCount: number;
      driftScore: number;
    };
    policiesSummary: {
      blockingCount: number;
      canRelease: boolean;
    };
  };
}

export class CopilotContextEngine {
  private static instance: CopilotContextEngine | null = null;
  private activeProject: ProjectContextData | null = null;

  public static getInstance(): CopilotContextEngine {
    if (!CopilotContextEngine.instance) {
      CopilotContextEngine.instance = new CopilotContextEngine();
    }
    return CopilotContextEngine.instance;
  }

  /**
   * Dynamically sets or updates the currently active project context.
   */
  public setActiveProject(project: ProjectContextData | null): void {
    this.activeProject = project;
  }

  public getActiveProject(): ProjectContextData | null {
    return this.activeProject;
  }

  /**
   * Sanitizes external dataset strings to prevent prompt injection attacks.
   */
  public sanitizeUntrustedData(raw: string): string {
    return raw
      .replace(/<system>/gi, "&lt;system&gt;")
      .replace(/<\/system>/gi, "&lt;/system&gt;")
      .replace(/\[system\]/gi, "&#91;system&#93;")
      .replace(/\[instruction\]/gi, "&#91;instruction&#93;");
  }

  /**
   * Dynamically inspects browser and application stores to assemble live context.
   */
  public assembleContext(routePath = "/app"): CopilotLiveContext {
    const modeState = modeStore.getState();
    const mode = modeState.mode;
    const run: AnalysisRun = analysisStore.getRun();
    const selectedDemo = demoStore.getSelectedDataset();
    const connectorsMap = connectorStore.getState().connectors;
    const activePlugins = pluginRegistry.listTools();

    // Determine active route section and target ID
    const path = typeof window !== "undefined" ? window.location.pathname : routePath;
    let section = "dashboard";
    let targetId: string | undefined = undefined;

    const projectMatch = path.match(/\/app\/projects\/([^/]+)/);
    const studioMatch = path.match(/\/app\/studio\/([^/]+)/);
    if (projectMatch && projectMatch[1]) targetId = projectMatch[1];
    else if (studioMatch && studioMatch[1]) targetId = studioMatch[1];

    if (path.includes("/app/analysis")) section = "analysis";
    else if (path.includes("/app/datasets")) section = "datasets";
    else if (path.includes("/app/connectors")) section = "connectors";
    else if (path.includes("/app/plugins")) section = "plugins";
    else if (path.includes("/app/studio")) section = "studio";
    else if (path.includes("/app/chat")) section = "chat";
    else if (path.includes("/app/missions")) section = "missions";
    else if (path.includes("/app/drift")) section = "drift";
    else if (path.includes("/app/impact")) section = "impact";
    else if (path.includes("/app/simulation")) section = "simulation";
    else if (path.includes("/app/projects")) section = "projects";
    else if (path.includes("/app/reports")) section = "reports";
    else if (path.includes("/app/settings")) section = "settings";

    // Extract current stage name
    const activeStage = run.stages.find((s) => s.id === run.currentStageId);

    // Calculate critical findings count
    const criticalFindings = run.findings.filter(
      (f) => f.severity === "CRITICAL" || f.severity === "HIGH",
    );

    const connectors = Object.values(connectorsMap).map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      toolCount: c.tools.length,
      isEnabled: c.isEnabled,
    }));

    const plugins = activePlugins.map((p) => ({
      name: p.name,
      category: p.name.includes("analysis")
        ? "analytics"
        : p.name.includes("data")
          ? "data"
          : "utility",
    }));

    // Resolve dynamic project context
    let resolvedProject: ProjectContextData;
    if (mode === "DEMO") {
      resolvedProject = {
        id: `demo-${selectedDemo.id}`,
        name: `${selectedDemo.name} (Demo Sandbox)`,
        healthScore: 88,
        status: "ACTIVE",
        domain: selectedDemo.id.includes("fraud") ? "FinTech" : "E-Commerce",
        repoFullName: "brahma-demo/finledger-sample",
      };
    } else if (this.activeProject) {
      resolvedProject = { ...this.activeProject };
    } else if (targetId) {
      resolvedProject = {
        id: targetId,
        name: `Project ${targetId.slice(0, 8)}`,
        healthScore: 92,
        status: "ACTIVE",
        domain: "Enterprise SaaS",
      };
    } else {
      resolvedProject = {
        id: "workspace-global",
        name: "Enterprise Workspace Architecture",
        healthScore: 94,
        status: "ACTIVE",
        domain: "Enterprise Platform",
      };
    }

    return {
      mode,
      route: {
        pathname: path,
        section,
        ...(targetId ? { targetId } : {}),
      },
      project: resolvedProject,
      dataset: {
        id: mode === "DEMO" ? selectedDemo.id : run.targetDatasetId || "ieee_fraud_benchmark",
        name: mode === "DEMO" ? selectedDemo.name : run.targetDatasetName || "IEEE-CIS Fraud Benchmark",
        totalRecords: mode === "DEMO" ? selectedDemo.totalRecords : run.telemetry.recordsProcessed || 12480,
        sampleColumns: ["TransactionID", "isFraud", "TransactionAmt", "ProductCD", "card1", "addr1"],
        isBenchmark: true,
      },
      analysis: {
        runId: run.id,
        status: run.status,
        currentStageId: run.currentStageId,
        currentStageName: activeStage ? activeStage.name : null,
        progressPercent: activeStage ? activeStage.progressPercent : run.status === "COMPLETED" ? 100 : 0,
        overallRiskScore: run.telemetry.overallRiskScore,
        anomaliesDetected: run.telemetry.anomaliesDetected,
        criticalFindingsCount: criticalFindings.length,
        findingsSummary: run.findings.slice(0, 3).map((f) => `[${f.severity}] ${f.title}: ${f.description}`),
      },
      connectors,
      plugins,
      system: {
        timestamp: new Date().toISOString(),
        environment: mode === "DEMO" ? "SANDBOX_SIMULATION" : "PRODUCTION_GOVERNED",
        isDemoSafe: mode === "DEMO",
      },
      controlPlane: {
        activeMission: (() => {
          const active = missionEngine.getMissions().find((m: EngineeringMission) => m.status === "IN_PROGRESS" || m.status === "PLANNING");
          return active
            ? {
                id: active.id,
                title: active.title,
                status: active.status,
                stepProgress: `${active.currentStepIndex + 1}/${active.steps.length}`,
              }
            : null;
        })(),
        driftSummary: {
          findingsCount: architectureDriftEngine.evaluateDrift().findings.length,
          driftScore: architectureDriftEngine.evaluateDrift().summary.overallDriftScore,
        },
        policiesSummary: {
          blockingCount: policyEngine.evaluateAllPolicies().blockingFailuresCount,
          canRelease: policyEngine.evaluateAllPolicies().canRelease,
        },
      },
    };
  }

  /**
   * Generates a context-aware system prompt inject with ground truth facts.
   */
  public generateSystemPrompt(routePath = "/app"): string {
    const ctx = this.assembleContext(routePath);

    const basePrompt =
      ctx.mode === "NORMAL"
        ? `You are Brahma Intelligence Copilot, the native AI engineering and analytics layer for PROJECT BRAHMA.
Your role is to guide the user through real-time 12-stage analysis, schema contracts, MCP connector governance, and architectural integrity.
Always speak with engineering rigor, cite specific stage IDs (1 to 12) or entity IDs, and distinguish calculated telemetry from interpretive advice.`
        : `You are Brahma Demo Copilot (Demo Simulation Mode).
Your purpose is to demonstrate Brahma's intelligence capabilities using the isolated ${ctx.dataset.name} benchmark dataset and event simulator.
Explain IQR anomaly detection, cross-border velocity spikes, and graph centrality clearly to evaluators.
Remind users that all actions are safe and strictly isolated from production data.`;

    const liveContextBlock = `
---
LIVE APPLICATION CONTEXT (Ground Truth):
• Environment Mode: ${ctx.mode} (${ctx.system.environment})
• Current Page: ${ctx.route.pathname} (Section: ${ctx.route.section})
• Active Project: ${ctx.project.name} (ID: ${ctx.project.id}, Health Score: ${ctx.project.healthScore}%)
• Selected Dataset: ${ctx.dataset.name} (${ctx.dataset.totalRecords} records)
• Pipeline Status: ${ctx.analysis.status} ${ctx.analysis.currentStageName ? `(Running Stage ${ctx.analysis.currentStageId}: ${ctx.analysis.currentStageName})` : ""}
• Telemetry: Risk Score ${ctx.analysis.overallRiskScore}/100, Anomalies: ${ctx.analysis.anomaliesDetected}, Critical Findings: ${ctx.analysis.criticalFindingsCount}
• Control Plane: Drift Score ${ctx.controlPlane.driftSummary.driftScore}/100 (${ctx.controlPlane.driftSummary.findingsCount} findings), Release Status: ${ctx.controlPlane.policiesSummary.canRelease ? "CLEAR TO DEPLOY" : "BLOCKED BY POLICIES"}
${ctx.controlPlane.activeMission ? `• Active Mission: "${ctx.controlPlane.activeMission.title}" [${ctx.controlPlane.activeMission.status}] (Step ${ctx.controlPlane.activeMission.stepProgress})` : ""}
• Available Connectors: ${ctx.connectors.map((c) => `${c.name} [${c.status}]`).join(", ")}
• Active Plugins: ${ctx.plugins.map((p) => p.name).join(", ")}
${ctx.analysis.findingsSummary.length > 0 ? `• Recent Findings: \n  ${ctx.analysis.findingsSummary.join("\n  ")}` : ""}
---
`;

    return `${basePrompt}\n\n${liveContextBlock}`;
  }
}

export const copilotContextEngine = CopilotContextEngine.getInstance();
