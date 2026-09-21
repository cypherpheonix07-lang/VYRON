/**
 * VYRON — SPECIALIZED AGENT REGISTRY (RELEASE 03)
 * Centralized agent registry for all 15 specialized bounded agents.
 * Defines agent metadata, role constraints, tools, output schemas, and mutation policies.
 * Strictly ZERO Raw SQL.
 */

import { AgentRole, ProjectLifecycleStage } from "@/types/aiProjectControlPlane";
import { PROMPT_REGISTRY, VersionedPrompt } from "../gateway/promptRegistry";

export interface AgentPolicy {
  allowedStages: ProjectLifecycleStage[];
  mutationLevelAllowed: 0 | 1 | 2 | 3 | 4;
  requiresHumanApproval: boolean;
  canMutateStateDirectly: boolean;
}

export interface AgentDefinition {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  version: string;
  policy: AgentPolicy;
  prompt: VersionedPrompt;
  allowedTools: string[];
}

export class AgentRegistry {
  private static instance: AgentRegistry | null = null;
  private agents: Map<AgentRole, AgentDefinition> = new Map();

  private constructor() {
    this.registerAll();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private registerAll(): void {
    const roles: AgentRole[] = [
      "DiscoveryAgent",
      "ProblemAnalystAgent",
      "RequirementsEngineerAgent",
      "ScopeEngineerAgent",
      "CapabilityArchitectAgent",
      "SolutionArchitectAgent",
      "TechnologyArchitectAgent",
      "DataArchitectAgent",
      "AiArchitectAgent",
      "SecurityArchitectAgent",
      "ReliabilityEngineerAgent",
      "ImplementationPlannerAgent",
      "TestEngineerAgent",
      "RedTeamAgent",
      "BlueprintCompilerAgent",
    ];

    for (const role of roles) {
      const prompt = PROMPT_REGISTRY[role];
      const isCritical = role === "SecurityArchitectAgent" || role === "BlueprintCompilerAgent";
      const mutationLevel: 0 | 1 | 2 | 3 | 4 = isCritical ? 3 : 1;

      this.agents.set(role, {
        id: `agent-${role.toLowerCase()}`,
        role,
        name: role.replace(/Agent$/, ""),
        description: prompt.systemDirective.split(".")[0] || role,
        version: prompt.version,
        policy: {
          allowedStages: [prompt.stage],
          mutationLevelAllowed: mutationLevel,
          requiresHumanApproval: isCritical,
          canMutateStateDirectly: false, // Agents propose; Control Plane mutates
        },
        prompt,
        allowedTools: this.getDefaultToolsForRole(role),
      });
    }
  }

  private getDefaultToolsForRole(role: AgentRole): string[] {
    const baseTools = ["getProjectContext", "searchProject", "getDependencies"];
    switch (role) {
      case "DiscoveryAgent":
      case "ProblemAnalystAgent":
        return [...baseTools, "getRequirements"];
      case "RequirementsEngineerAgent":
      case "ScopeEngineerAgent":
        return [...baseTools, "getRequirements", "createRequirementProposal"];
      case "SolutionArchitectAgent":
      case "TechnologyArchitectAgent":
        return [...baseTools, "getArchitecture", "getDecisions", "createArchitectureProposal"];
      case "SecurityArchitectAgent":
        return [...baseTools, "getArchitecture", "getRisks", "createSecurityProposal"];
      case "ImplementationPlannerAgent":
        return [...baseTools, "getArchitecture", "getTasks", "createTaskProposal"];
      case "RedTeamAgent":
        return [...baseTools, "getRequirements", "getArchitecture", "getRisks"];
      default:
        return baseTools;
    }
  }

  public getAgent(role: AgentRole): AgentDefinition | undefined {
    return this.agents.get(role);
  }

  public listAgents(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }
}

export const agentRegistry = AgentRegistry.getInstance();
