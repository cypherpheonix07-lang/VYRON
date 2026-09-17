/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Master Project Engineering Orchestrator (Phase 06)
 * Coordinates specialized agents, applies 7-step output validation pipeline,
 * and interfaces with the deterministic control plane.
 * Strictly ZERO Raw SQL.
 */

import {
  ProjectEngineeringState,
  ProjectLifecycleStage,
  AiProposal,
  MutationSensitivityLevel,
} from "@/types/aiProjectControlPlane";
import {
  DiscoveryAgent,
  ProblemAnalystAgent,
  RequirementsEngineerAgent,
  ScopeEngineerAgent,
  CapabilityArchitectAgent,
  SolutionArchitectAgent,
  TechnologyArchitectAgent,
  DataArchitectAgent,
  AiArchitectAgent,
  SecurityArchitectAgent,
  ReliabilityEngineerAgent,
  ImplementationPlannerAgent,
  TestEngineerAgent,
  RedTeamAgent,
  BlueprintCompilerAgent,
} from "../agents";
import { policyEngine } from "../controlPlane/policyEngine";
import { changeImpactEngine } from "../controlPlane/changeImpactEngine";
import { projectDiffEngine } from "../controlPlane/projectDiffEngine";
import { mutationEngine } from "../controlPlane/mutationEngine";
import { workflowStateMachine } from "../controlPlane/workflowStateMachine";

export interface PipelineExecutionResult {
  success: boolean;
  stage: ProjectLifecycleStage;
  proposal?: AiProposal;
  autoCommitted: boolean;
  summary: string;
  error?: string;
}

export class ProjectOrchestrator {
  private static instance: ProjectOrchestrator | null = null;
  private isBusy = false;

  private constructor() {}

  public static getInstance(): ProjectOrchestrator {
    if (!ProjectOrchestrator.instance) {
      ProjectOrchestrator.instance = new ProjectOrchestrator();
    }
    return ProjectOrchestrator.instance;
  }

  public isExecuting(): boolean {
    return this.isBusy;
  }

  /**
   * Executes the specialized agent for a given stage through the 7-step Validation Pipeline.
   */
  public async executeStageAgent(
    stage: ProjectLifecycleStage,
    currentState: ProjectEngineeringState,
    userInput?: string,
  ): Promise<{ result: PipelineExecutionResult; newState: ProjectEngineeringState }> {
    this.isBusy = true;

    try {
      let proposedChanges: Partial<ProjectEngineeringState> = {};
      let summary = "";
      let sensitivity: MutationSensitivityLevel = "L2_PROJECT_MODIFICATION";

      // 1. Dispatch to Specialized Agent
      switch (stage) {
        case "01_INTENT": {
          const out = await DiscoveryAgent.execute(currentState, userInput);
          proposedChanges = {
            intent: out.data.intent,
            discoveryQuestions: out.data.questions,
            name: out.data.intent.projectName,
            slug: out.data.intent.slug,
          };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "02_PROBLEM": {
          const out = await ProblemAnalystAgent.execute(currentState);
          proposedChanges = { problem: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "03_REQUIREMENTS": {
          const out = await RequirementsEngineerAgent.execute(currentState);
          proposedChanges = { requirements: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "04_SCOPE": {
          const out = await ScopeEngineerAgent.execute(currentState);
          proposedChanges = { scope: out.data };
          summary = out.summary;
          sensitivity = "L3_STRUCTURAL_APPROVAL";
          break;
        }

        case "05_CAPABILITY": {
          const out = await CapabilityArchitectAgent.execute(currentState);
          proposedChanges = { capabilities: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "06_ARCHITECTURE": {
          const out = await SolutionArchitectAgent.execute(currentState);
          proposedChanges = { architecture: out.data };
          summary = out.summary;
          sensitivity = "L3_STRUCTURAL_APPROVAL";
          break;
        }

        case "07_TECHNOLOGY": {
          const out = await TechnologyArchitectAgent.execute(currentState);
          proposedChanges = { technology: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "08_DATA": {
          const out = await DataArchitectAgent.execute(currentState);
          proposedChanges = { data: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "09_AI_DESIGN": {
          const out = await AiArchitectAgent.execute(currentState);
          proposedChanges = { ai: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "10_SECURITY": {
          const out = await SecurityArchitectAgent.execute(currentState);
          proposedChanges = { security: out.data };
          summary = out.summary;
          sensitivity = "L3_STRUCTURAL_APPROVAL";
          break;
        }

        case "11_RELIABILITY": {
          const out = await ReliabilityEngineerAgent.execute(currentState);
          proposedChanges = { reliability: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "12_IMPLEMENTATION": {
          const out = await ImplementationPlannerAgent.execute(currentState);
          proposedChanges = { implementation: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "13_TESTING": {
          const out = await TestEngineerAgent.execute(currentState);
          proposedChanges = { testing: out.data };
          summary = out.summary;
          sensitivity = "L2_PROJECT_MODIFICATION";
          break;
        }

        case "14_BLUEPRINT": {
          const redTeamOut = await RedTeamAgent.execute(currentState);
          const stateWithRedTeam = { ...currentState, redTeamFindings: redTeamOut.data };
          const bpOut = await BlueprintCompilerAgent.execute(stateWithRedTeam);
          proposedChanges = {
            redTeamFindings: redTeamOut.data,
            blueprint: bpOut.data,
            maturity: "READY",
          };
          summary = bpOut.summary;
          sensitivity = "L4_CRITICAL";
          break;
        }
      }

      // 2. Compute Visual Diff
      const diffSummary = projectDiffEngine.computeDiff(currentState, proposedChanges);

      // 3. Compute Downstream Change Impact
      const impactReport = changeImpactEngine.analyzeImpact(stage, currentState);

      // 4. Create Proposal Object
      const proposal: AiProposal = {
        id: `prop-${Date.now()}`,
        agentRole: `${stage}_Agent` as any,
        stage,
        title: `AI Synthesis for ${stage}`,
        description: summary,
        sensitivityLevel: sensitivity,
        proposedChanges,
        diffSummary,
        directlyAffectedCount: impactReport.directlyAffectedCount,
        indirectlyAffectedCount: impactReport.indirectlyAffectedCount,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // 5. Evaluate Policy Engine Gate
      const policyCheck = policyEngine.evaluateAction(proposal.agentRole, `Synthesize_${stage}`, sensitivity);

      let newState = currentState;
      let autoCommitted = false;

      // 6. Auto-commit Level 1 & Level 2 modifications; queue Level 3 & Level 4 for approval
      if (!policyCheck.requiresHumanSignature) {
        const commitRes = mutationEngine.commitProposal(currentState, proposal);
        if (commitRes.success) {
          newState = commitRes.newState;
          autoCommitted = true;
        }
      } else {
        // Enqueue proposal for explicit user review
        newState = {
          ...currentState,
          pendingProposals: [...currentState.pendingProposals, proposal],
        };
      }

      // 7. Update stage status
      const updatedStatuses = { ...newState.stageStatuses };
      updatedStatuses[stage] = workflowStateMachine.computeStageStatus(stage, newState);
      newState = { ...newState, stageStatuses: updatedStatuses };

      return {
        result: {
          success: true,
          stage,
          proposal,
          autoCommitted,
          summary,
        },
        newState,
      };
    } catch (err) {
      return {
        result: {
          success: false,
          stage,
          autoCommitted: false,
          summary: "Agent execution failed",
          error: err instanceof Error ? err.message : String(err),
        },
        newState: currentState,
      };
    } finally {
      this.isBusy = false;
    }
  }

  /**
   * Executes the full end-to-end multi-agent pipeline sequentially across all 14 stages.
   */
  public async executeFullPipeline(
    initialState: ProjectEngineeringState,
    onStageProgress?: (stage: ProjectLifecycleStage, summary: string) => void,
  ): Promise<ProjectEngineeringState> {
    const stages: ProjectLifecycleStage[] = [
      "01_INTENT",
      "02_PROBLEM",
      "03_REQUIREMENTS",
      "04_SCOPE",
      "05_CAPABILITY",
      "06_ARCHITECTURE",
      "07_TECHNOLOGY",
      "08_DATA",
      "09_AI_DESIGN",
      "10_SECURITY",
      "11_RELIABILITY",
      "12_IMPLEMENTATION",
      "13_TESTING",
      "14_BLUEPRINT",
    ];

    let state = initialState;

    for (const stage of stages) {
      if (onStageProgress) {
        onStageProgress(stage, `Executing ${stage}...`);
      }

      const { result, newState } = await this.executeStageAgent(stage, state);
      state = newState;

      // In automated full-pipeline run, auto-commit pending proposals
      if (result.proposal && !result.autoCommitted) {
        const commitRes = mutationEngine.commitProposal(state, result.proposal);
        if (commitRes.success) {
          state = commitRes.newState;
        }
      }
    }

    return state;
  }
}

export const projectOrchestrator = ProjectOrchestrator.getInstance();
