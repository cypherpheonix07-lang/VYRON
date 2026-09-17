/**
 * VYRON — AI TOOL REGISTRY (RELEASE 03)
 * Segregates Read-Only Inspection Tools from Controlled Proposal Tools.
 * Agents NEVER execute database writes directly; they produce validated proposals.
 * Strictly ZERO Raw SQL.
 */

import { aiProjectStore } from "@/state/aiProject/aiProjectStore";
import { RequirementItem } from "@/types/aiProjectControlPlane";

export type ToolType = "READ" | "PROPOSAL";

export interface ToolDefinition {
  name: string;
  type: ToolType;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export class ToolRegistry {
  private static instance: ToolRegistry | null = null;
  private tools: Map<string, ToolDefinition> = new Map();

  private constructor() {
    this.registerReadTools();
    this.registerProposalTools();
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  private registerReadTools(): void {
    this.register({
      name: "getProjectContext",
      type: "READ",
      description: "Returns the current state, metrics, and active stage of the project.",
      parameters: {},
      handler: async () => {
        const state = aiProjectStore.getState();
        return {
          activeStage: state.activeStage,
          maturity: state.maturity,
          metrics: state.understanding,
          intent: state.intent,
        };
      },
    });

    this.register({
      name: "getRequirements",
      type: "READ",
      description: "Returns list of normalized atomic requirements.",
      parameters: {
        type: { type: "string", description: "Filter by functional or non_functional", required: false },
      },
      handler: async (args) => {
        const state = aiProjectStore.getState();
        const reqs = state.requirements || [];
        if (args["type"]) {
          return reqs.filter((r: RequirementItem) => r.type === args["type"]);
        }
        return reqs;
      },
    });

    this.register({
      name: "getArchitecture",
      type: "READ",
      description: "Returns generated architecture alternatives and proposed baseline.",
      parameters: {},
      handler: async () => {
        const state = aiProjectStore.getState();
        return {
          alternatives: state.architecture.alternatives || [],
          selectedId: state.architecture.selectedAlternativeId,
        };
      },
    });

    this.register({
      name: "getDecisions",
      type: "READ",
      description: "Returns technology & architecture decision records.",
      parameters: {},
      handler: async () => {
        const state = aiProjectStore.getState();
        return state.technology.decisions || [];
      },
    });

    this.register({
      name: "getRisks",
      type: "READ",
      description: "Returns STRIDE security threats and red-team findings.",
      parameters: {},
      handler: async () => {
        const state = aiProjectStore.getState();
        return {
          strideThreats: state.security.threats || [],
          redTeamFindings: state.redTeamFindings || [],
        };
      },
    });

    this.register({
      name: "getTasks",
      type: "READ",
      description: "Returns implementation task graph DAG and API contracts.",
      parameters: {},
      handler: async () => {
        const state = aiProjectStore.getState();
        return {
          tasks: state.implementation.tasks || [],
          apiContracts: state.implementation.apiContracts || [],
        };
      },
    });

    this.register({
      name: "searchProject",
      type: "READ",
      description: "Searches project state for matching terms or keywords.",
      parameters: {
        query: { type: "string", description: "Search query text", required: true },
      },
      handler: async (args) => {
        const query = String(args["query"] || "").toLowerCase();
        const state = aiProjectStore.getState();
        const matches: string[] = [];

        for (const req of state.requirements || []) {
          if (req.title.toLowerCase().includes(query) || req.description.toLowerCase().includes(query)) {
            matches.push(`[Requirement] ${req.id}: ${req.title}`);
          }
        }
        return { query, matches, count: matches.length };
      },
    });

    this.register({
      name: "getDependencies",
      type: "READ",
      description: "Traverses project graph for dependencies of a given element.",
      parameters: {
        elementId: { type: "string", description: "Node identifier", required: true },
      },
      handler: async (args) => {
        const elementId = String(args["elementId"] || "");
        return {
          nodeId: elementId,
          dependencies: [],
          downstreamBlastRadius: [],
        };
      },
    });
  }

  private registerProposalTools(): void {
    this.register({
      name: "createRequirementProposal",
      type: "PROPOSAL",
      description: "Creates an AI proposal to add or update an atomic requirement.",
      parameters: {
        title: { type: "string", description: "Requirement title", required: true },
        description: { type: "string", description: "Requirement description", required: true },
        type: { type: "string", description: "functional or non_functional", required: true },
        priority: { type: "string", description: "P0, P1, or P2", required: true },
      },
      handler: async (args) => {
        const title = String(args["title"] || "New Requirement");
        const proposal = aiProjectStore.enqueueProposal({
          agentRole: "RequirementsEngineerAgent",
          stage: "03_REQUIREMENTS",
          title: `Propose requirement: ${title}`,
          description: "Synthesized atomic requirement to eliminate specification ambiguity.",
          sensitivityLevel: "L1_DRAFT",
          proposedChanges: {},
          diffSummary: {
            added: [title],
            modified: [],
            removed: [],
            stale: [],
          },
          directlyAffectedCount: 1,
          indirectlyAffectedCount: 0,
        });
        return { success: true, proposalId: proposal.id };
      },
    });

    this.register({
      name: "createArchitectureProposal",
      type: "PROPOSAL",
      description: "Creates an AI proposal to add or update an architecture alternative.",
      parameters: {
        name: { type: "string", description: "Topology name", required: true },
        summary: { type: "string", description: "Architecture rationale", required: true },
      },
      handler: async (args) => {
        const name = String(args["name"] || "New Architecture Topology");
        const proposal = aiProjectStore.enqueueProposal({
          agentRole: "SolutionArchitectAgent",
          stage: "06_ARCHITECTURE",
          title: `Propose architecture topology: ${name}`,
          description: "Architectural topology recommendation derived from scale and time-to-MVP constraints.",
          sensitivityLevel: "L3_STRUCTURAL_APPROVAL",
          proposedChanges: {},
          diffSummary: {
            added: [name],
            modified: [],
            removed: [],
            stale: [],
          },
          directlyAffectedCount: 1,
          indirectlyAffectedCount: 3,
        });
        return { success: true, proposalId: proposal.id };
      },
    });

    this.register({
      name: "createTaskProposal",
      type: "PROPOSAL",
      description: "Creates an AI proposal to add an implementation task to the DAG.",
      parameters: {
        title: { type: "string", description: "Task title", required: true },
        component: { type: "string", description: "Target module or component", required: true },
      },
      handler: async (args) => {
        const title = String(args["title"] || "New Implementation Task");
        const proposal = aiProjectStore.enqueueProposal({
          agentRole: "ImplementationPlannerAgent",
          stage: "12_IMPLEMENTATION",
          title: `Propose task: ${title}`,
          description: "Implementation breakdown mapped directly to architecture contracts.",
          sensitivityLevel: "L1_DRAFT",
          proposedChanges: {},
          diffSummary: {
            added: [title],
            modified: [],
            removed: [],
            stale: [],
          },
          directlyAffectedCount: 1,
          indirectlyAffectedCount: 0,
        });
        return { success: true, proposalId: proposal.id };
      },
    });

    this.register({
      name: "createSecurityProposal",
      type: "PROPOSAL",
      description: "Creates an AI proposal to add a STRIDE mitigation control.",
      parameters: {
        threatCategory: { type: "string", description: "STRIDE threat category", required: true },
        mitigation: { type: "string", description: "Mitigation specification", required: true },
      },
      handler: async (args) => {
        const category = String(args["threatCategory"] || "Security Threat");
        const proposal = aiProjectStore.enqueueProposal({
          agentRole: "SecurityArchitectAgent",
          stage: "10_SECURITY",
          title: `Propose security control for ${category}`,
          description: "Proactive threat vector mitigation enforcing trust boundary defenses.",
          sensitivityLevel: "L2_PROJECT_MODIFICATION",
          proposedChanges: {},
          diffSummary: {
            added: [category],
            modified: [],
            removed: [],
            stale: [],
          },
          directlyAffectedCount: 1,
          indirectlyAffectedCount: 2,
        });
        return { success: true, proposalId: proposal.id };
      },
    });
  }

  public register(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  public listTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.getTool(name);
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    return await tool.handler(args);
  }
}

export const toolRegistry = ToolRegistry.getInstance();
