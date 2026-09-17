/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Reactive Central State Store (Phase 06)
 * Strictly ZERO Raw SQL.
 */

import { useState, useEffect } from "react";
import {
  ProjectEngineeringState,
  ProjectLifecycleStage,
  CopilotMode,
  AiProposal,
  ProjectUnderstanding,
  RequirementItem,
  CapabilityNode,
  TechStackDecision,
  DataEntity,
  AiModelCandidate,
  ComponentFailureScenario,
  TestCaseItem,
} from "@/types/aiProjectControlPlane";
import { projectOrchestrator } from "@/services/aiProject/orchestrator/projectOrchestrator";
import { mutationEngine } from "@/services/aiProject/controlPlane/mutationEngine";
import { toast } from "sonner";

const DRAFT_STORAGE_KEY = "vyron_ai_project_control_plane_draft_v2";

export function createInitialProjectState(): ProjectEngineeringState {
  const initialUnderstanding: ProjectUnderstanding = {
    problemClarity: 30,
    userDefinition: 40,
    requirementsClarity: 15,
    scopeStability: 20,
    architectureIntegrity: 10,
    securityPosture: 10,
    completeness: 20,
    confidence: 35,
    readiness: 15,
    knownCount: 3,
    assumptionsCount: 4,
    unknownsCount: 6,
    conflictsCount: 0,
    explanations: {
      problemClarity: "Initial raw intent submitted; requires 5-Whys root cause decomposition.",
      requirementsClarity: "Pending extraction of atomic functional and non-functional specifications.",
      architectureIntegrity: "Baseline topology not yet selected.",
    },
  };

  return {
    id: `proj-${Date.now()}`,
    ownerId: "4666a9f0-f28d-4845-9a21-9b9210b18af9", // Demo admin fallback
    name: "Vyron Architecture Mesh",
    slug: "vyron-architecture-mesh",
    version: 1,
    activeStage: "01_INTENT",
    maturity: "IDEA",
    stageStatuses: {
      "01_INTENT": "in_progress",
      "02_PROBLEM": "not_started",
      "03_REQUIREMENTS": "not_started",
      "04_SCOPE": "not_started",
      "05_CAPABILITY": "not_started",
      "06_ARCHITECTURE": "not_started",
      "07_TECHNOLOGY": "not_started",
      "08_DATA": "not_started",
      "09_AI_DESIGN": "not_started",
      "10_SECURITY": "not_started",
      "11_RELIABILITY": "not_started",
      "12_IMPLEMENTATION": "not_started",
      "13_TESTING": "not_started",
      "14_BLUEPRINT": "not_started",
    },
    intent: {
      projectName: "Vyron Architecture Mesh",
      slug: "vyron-architecture-mesh",
      naturalLanguageIntent:
        "An enterprise engineering platform that continuously validates software architecture, detects drift between code AST and blueprints, and enforces security compliance gates.",
      projectType: "web",
      domain: "Software Engineering",
      secondaryDomains: ["cloud_native", "security"],
      experienceLevel: "enterprise",
      detectedEntities: ["ASTNode", "ReleaseGate", "PolicyRule", "AuditProof"],
      goals: [
        "Eliminate undetected architectural drift before production deployment",
        "Enforce zero raw SQL compliance and strict multi-tenant RLS",
        "Generate cryptographic HMAC SHA-256 evidence trails for all releases",
      ],
      targetUsers: [
        { id: "u-1", label: "Lead Architect", category: "Engineering", priority: 1, custom: false },
        { id: "u-2", label: "SecOps / CISO", category: "Security", priority: 2, custom: false },
        { id: "u-3", label: "Platform SRE", category: "Engineering", priority: 3, custom: false },
      ],
      constraints: ["Zero Raw SQL", "Sub-second verification latency", "Deterministic offline fallback"],
      technicalSignals: ["React 19", "TanStack Router", "Nitro", "Supabase RLS", "Claude 3.5 Sonnet"],
      unknowns: ["Target cloud deployment region", "Estimated daily analysis volume"],
      createdAt: new Date().toISOString(),
    },
    understanding: initialUnderstanding,
    discoveryQuestions: [
      {
        id: "dq-1",
        text: "What is your team's target compliance standard?",
        context: "Determines audit retention policies and release gate strictness.",
        impactScore: 9,
        uncertaintyScore: 8,
        dependencyImportance: 9,
        priority: 648,
        status: "open",
        suggestedOptions: ["SOC2 Type II", "HIPAA Health Telemetry", "ISO 27001", "Standard Advisory"],
      },
    ],
    problem: {
      problemStatement: "",
      currentState: "",
      painPoints: [],
      actors: [],
      affectedUsers: [],
      rootCauseTree: [],
      rootProblem: "",
      existingAlternatives: [],
      limitations: [],
      desiredFutureState: "",
      outcome: "",
      successCriteria: [],
    },
    requirements: [],
    scope: {
      coreProblem: "",
      mvpRequirements: [],
      v1Requirements: [],
      v2Requirements: [],
      outOfScope: [],
      driftWarnings: [],
      scopeStabilityScore: 0,
    },
    capabilities: { capabilities: [] },
    architecture: { alternatives: [], selectedAlternativeId: "", consistencyScore: 0 },
    technology: { decisions: [], stackFitScore: 0 },
    data: { entities: [], governanceRules: [] },
    ai: {
      isActive: true,
      objective: "",
      modelCandidates: [],
      inferencePipeline: {
        inputValidation: [],
        featureExtraction: "",
        modelRouting: "",
        outputValidation: [],
        fallbackStrategy: "",
      },
      governanceContract: { promptInjectionSafeguards: true, dataRetentionDays: 30, auditLevel: "FULL" },
    },
    security: {
      trustBoundaries: [],
      entryPoints: [],
      threats: [],
      promptInjectionDefense: true,
      authStrategy: "supabase_auth",
      securityPostureScore: 0,
    },
    reliability: { scenarios: [], overallResilienceScore: 0 },
    implementation: { modules: [], apiContracts: [], tasks: [], milestones: [] },
    testing: { testCases: [], traceabilityMatrix: [] },
    redTeamFindings: [],
    blueprint: null,
    pendingProposals: [],
    mutationAuditTrail: [],
    staleNodes: [],
    updatedAt: new Date().toISOString(),
  };
}

class AiProjectStoreManager {
  private state: ProjectEngineeringState;
  private copilotMode: CopilotMode = "GUIDE";
  private isExecuting = false;
  private executionStatusText = "";
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadDraft() || createInitialProjectState();
  }

  public getState(): ProjectEngineeringState {
    return this.state;
  }

  public getCopilotMode(): CopilotMode {
    return this.copilotMode;
  }

  public getIsExecuting(): boolean {
    return this.isExecuting;
  }

  public getExecutionStatus(): string {
    return this.executionStatusText;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveDraft();
    for (const listener of this.listeners) {
      listener();
    }
  }

  public setActiveStage(stage: ProjectLifecycleStage) {
    this.state = { ...this.state, activeStage: stage };
    this.notify();
  }

  public setCopilotMode(mode: CopilotMode) {
    this.copilotMode = mode;
    this.notify();
  }

  public updateIntent(partial: Partial<ProjectEngineeringState["intent"]>) {
    this.state = {
      ...this.state,
      name: partial.projectName || this.state.name,
      slug: partial.slug || this.state.slug,
      intent: { ...this.state.intent, ...partial },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
  }

  public async executeStage(stage: ProjectLifecycleStage, userInput?: string) {
    this.isExecuting = true;
    this.executionStatusText = `Executing ${stage} specialized agent...`;
    this.notify();

    try {
      const { result, newState } = await projectOrchestrator.executeStageAgent(stage, this.state, userInput);
      this.state = newState;
      this.recalculateUnderstanding();

      if (result.autoCommitted) {
        toast.success(`Stage ${stage} synthesized & applied!`, { description: result.summary });
      } else if (result.proposal) {
        toast.info(`Proposal generated for ${stage}`, { description: "Requires architect review & approval." });
      }
    } catch (err) {
      toast.error("Agent execution interrupted", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      this.isExecuting = false;
      this.executionStatusText = "";
      this.notify();
    }
  }

  public async executeFullPipeline() {
    this.isExecuting = true;
    this.executionStatusText = "Initiating multi-agent cognitive control plane...";
    this.notify();

    try {
      const finalState = await projectOrchestrator.executeFullPipeline(this.state, (stage) => {
        this.executionStatusText = `Synthesizing ${stage}...`;
        this.notify();
      });

      this.state = finalState;
      this.recalculateUnderstanding();
      toast.success("Full AI engineering pipeline complete!", {
        description: "All 14 stages converged with verified canonical blueprint.",
      });
    } catch (err) {
      toast.error("Full pipeline interrupted", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      this.isExecuting = false;
      this.executionStatusText = "";
      this.notify();
    }
  }

  public enqueueProposal(proposalInput: Omit<AiProposal, "id" | "createdAt" | "status">): AiProposal {
    const proposal: AiProposal = {
      ...proposalInput,
      id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    this.state = {
      ...this.state,
      pendingProposals: [...this.state.pendingProposals, proposal],
    };
    this.notify();
    return proposal;
  }

  public approveProposal(proposalId: string) {
    const proposal = this.state.pendingProposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    const commitRes = mutationEngine.commitProposal(this.state, proposal);
    if (commitRes.success) {
      this.state = commitRes.newState;
      this.recalculateUnderstanding();
      toast.success("Proposal approved & committed!", {
        description: `Version updated to v${this.state.version}.`,
      });
      this.notify();
    }
  }

  public rejectProposal(proposalId: string) {
    this.state = {
      ...this.state,
      pendingProposals: this.state.pendingProposals.filter((p) => p.id !== proposalId),
    };
    toast.info("Proposal rejected and discarded.");
    this.notify();
  }

  private providerPreference: "auto" | "openrouter" | "openai" | "deterministic" = "auto";

  public getProviderPreference(): "auto" | "openrouter" | "openai" | "deterministic" {
    return this.providerPreference;
  }

  public setProviderPreference(pref: "auto" | "openrouter" | "openai" | "deterministic") {
    this.providerPreference = pref;
    this.notify();
  }

  public addManualRequirement(item: Omit<RequirementItem, "id" | "code">): RequirementItem {
    const count = this.state.requirements.length + 1;
    const itemType = item["type"];
    const prefix = itemType === "non_functional" ? "NFR" : itemType === "security" ? "SEC" : "FR";
    const code = `${prefix}-${String(count).padStart(3, "0")}`;
    const newReq: RequirementItem = {
      ...item,
      id: `req-manual-${Date.now()}`,
      code,
    };
    this.state = {
      ...this.state,
      requirements: [...this.state.requirements, newReq],
      updatedAt: new Date().toISOString(),
    };
    this.recalculateUnderstanding();
    this.notify();
    toast.success(`Requirement ${code} added manually!`);
    return newReq;
  }

  public updateRequirement(id: string, updates: Partial<RequirementItem>) {
    this.state = {
      ...this.state,
      requirements: this.state.requirements.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      updatedAt: new Date().toISOString(),
    };
    this.recalculateUnderstanding();
    this.notify();
  }

  public removeRequirement(id: string) {
    this.state = {
      ...this.state,
      requirements: this.state.requirements.filter((r) => r.id !== id),
      updatedAt: new Date().toISOString(),
    };
    this.recalculateUnderstanding();
    this.notify();
    toast.info("Requirement removed.");
  }

  public addManualCapability(cap: Omit<CapabilityNode, "id">): CapabilityNode {
    const newCap: CapabilityNode = {
      ...cap,
      id: `cap-manual-${Date.now()}`,
    };
    this.state = {
      ...this.state,
      capabilities: {
        capabilities: [...this.state.capabilities.capabilities, newCap],
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    toast.success(`Capability "${cap['name']}" added!`);
    return newCap;
  }

  public addManualDecision(decision: TechStackDecision) {
    const existing = this.state.technology.decisions.filter((d) => d.category !== decision.category);
    this.state = {
      ...this.state,
      technology: {
        ...this.state.technology,
        decisions: [...existing, decision],
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    toast.success(`Technology decision for ${decision.category} recorded!`);
  }

  public updateDecision(category: TechStackDecision["category"], selectedOption: string) {
    this.state = {
      ...this.state,
      technology: {
        ...this.state.technology,
        decisions: this.state.technology.decisions.map((d) =>
          d.category === category ? { ...d, selectedOption } : d,
        ),
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
  }

  public addManualDataEntity(entity: Omit<DataEntity, "id">): DataEntity {
    const newEntity: DataEntity = {
      ...entity,
      id: `ent-manual-${Date.now()}`,
    };
    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        entities: [...this.state.data.entities, newEntity],
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    toast.success(`Data entity "${entity['name']}" defined!`);
    return newEntity;
  }

  public setAiEngineeringActive(active: boolean) {
    this.state = {
      ...this.state,
      ai: {
        ...this.state.ai,
        isActive: active,
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
  }

  public addManualAiModelCandidate(candidate: Omit<AiModelCandidate, "id">): AiModelCandidate {
    const newCandidate: AiModelCandidate = {
      ...candidate,
      id: `model-manual-${Date.now()}`,
    };
    this.state = {
      ...this.state,
      ai: {
        ...this.state.ai,
        modelCandidates: [...this.state.ai.modelCandidates, newCandidate],
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    toast.success(`Candidate model "${candidate['name']}" registered!`);
    return newCandidate;
  }

  public addManualReliabilityScenario(scenario: ComponentFailureScenario) {
    this.state = {
      ...this.state,
      reliability: {
        ...this.state.reliability,
        scenarios: [...this.state.reliability.scenarios, scenario],
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    toast.success(`Failure scenario for "${scenario.componentName}" registered!`);
  }

  public addManualTestCase(tc: Omit<TestCaseItem, "id" | "code">): TestCaseItem {
    const count = this.state.testing.testCases.length + 1;
    const code = `TC-${String(count).padStart(3, "0")}`;
    const newTc: TestCaseItem = {
      ...tc,
      id: `tc-manual-${Date.now()}`,
      code,
    };
    this.state = {
      ...this.state,
      testing: {
        ...this.state.testing,
        testCases: [...this.state.testing.testCases, newTc],
      },
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    toast.success(`Test case ${code} created!`);
    return newTc;
  }

  public answerQuestion(questionId: string, answer: string) {
    const questions = this.state.discoveryQuestions.map((q) =>
      q.id === questionId ? { ...q, answer, status: "answered" as const } : q,
    );
    this.state = { ...this.state, discoveryQuestions: questions };
    this.recalculateUnderstanding();
    this.notify();
  }

  public recalculateUnderstanding() {
    const hasIntent = !!this.state.intent.naturalLanguageIntent.trim();
    const hasProblem = !!this.state.problem.problemStatement.trim();
    const reqCount = this.state.requirements.length;
    const hasScope = this.state.scope.mvpRequirements.length > 0;
    const hasArch = !!this.state.architecture.selectedAlternativeId;
    const secCount = this.state.security.threats.length;

    const problemClarity = hasProblem ? 95 : hasIntent ? 50 : 20;
    const userDefinition = this.state.intent.targetUsers.length >= 3 ? 95 : 60;
    const requirementsClarity = reqCount >= 4 ? 94 : reqCount > 0 ? 60 : 15;
    const scopeStability = hasScope ? 92 : 25;
    const architectureIntegrity = hasArch ? 96 : 10;
    const securityPosture = secCount >= 3 ? 94 : 20;

    const completeness = Math.round(
      (problemClarity + userDefinition + requirementsClarity + scopeStability + architectureIntegrity + securityPosture) / 6,
    );
    const confidence = Math.min(98, Math.round(completeness * 0.95 + 5));
    const readiness = this.state.blueprint?.initializationReady ? 98 : Math.round(completeness * 0.75);

    this.state = {
      ...this.state,
      understanding: {
        problemClarity,
        userDefinition,
        requirementsClarity,
        scopeStability,
        architectureIntegrity,
        securityPosture,
        completeness,
        confidence,
        readiness,
        knownCount: 4 + reqCount + (hasArch ? 6 : 0),
        assumptionsCount: Math.max(1, 5 - Math.floor(reqCount / 2)),
        unknownsCount: this.state.discoveryQuestions.filter((q) => q.status === "open").length,
        conflictsCount: this.state.requirements.reduce((acc, r) => acc + r.conflictsWith.length, 0),
        explanations: {
          readiness: readiness >= 80 ? "Project blueprint fully verified for production deployment." : "Pending architecture and security sign-off.",
        },
      },
    };
  }

  public getNextBestAction(): { title: string; stage: ProjectLifecycleStage; reason: string } {
    if (!this.state.problem.problemStatement) {
      return { title: "Synthesize Problem Statement", stage: "02_PROBLEM", reason: "Deconstruct human intent into 5-Whys root cause." };
    }
    if (this.state.requirements.length === 0) {
      return { title: "Extract Atomic Requirements", stage: "03_REQUIREMENTS", reason: "Generate independently testable functional & security requirements." };
    }
    if (this.state.scope.mvpRequirements.length === 0) {
      return { title: "Partition MVP Scope", stage: "04_SCOPE", reason: "Isolate core MVP requirements from deferred roadmap features." };
    }
    if (!this.state.architecture.selectedAlternativeId) {
      return { title: "Evaluate Architecture Alternatives", stage: "06_ARCHITECTURE", reason: "Compare modular monolith vs microservices trade-offs." };
    }
    if (this.state.security.threats.length === 0) {
      return { title: "Run STRIDE Threat Modeling", stage: "10_SECURITY", reason: "Audit trust boundaries and prompt injection defenses." };
    }
    if (!this.state.blueprint || !this.state.blueprint.initializationReady) {
      return { title: "Compile Canonical Blueprint", stage: "14_BLUEPRINT", reason: "Assemble 26 canonical sections and verify readiness." };
    }
    return { title: "Initialize Live Project Workspace", stage: "14_BLUEPRINT", reason: "All gates satisfied. Ready to provision database entities." };
  }

  private saveDraft() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Ignore quota
      }
    }
  }

  private loadDraft(): ProjectEngineeringState | null {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const aiProjectStore = new AiProjectStoreManager();

export function useAiProject() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return aiProjectStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    state: aiProjectStore.getState(),
    copilotMode: aiProjectStore.getCopilotMode(),
    isExecuting: aiProjectStore.getIsExecuting(),
    executionStatus: aiProjectStore.getExecutionStatus(),
    providerPreference: aiProjectStore.getProviderPreference(),
    setProviderPreference: (pref: "auto" | "openrouter" | "openai" | "deterministic") =>
      aiProjectStore.setProviderPreference(pref),
    setActiveStage: (stage: ProjectLifecycleStage) => aiProjectStore.setActiveStage(stage),
    setCopilotMode: (mode: CopilotMode) => aiProjectStore.setCopilotMode(mode),
    updateIntent: (partial: Partial<ProjectEngineeringState["intent"]>) => aiProjectStore.updateIntent(partial),
    executeStage: (stage: ProjectLifecycleStage, input?: string) => aiProjectStore.executeStage(stage, input),
    executeFullPipeline: () => aiProjectStore.executeFullPipeline(),
    approveProposal: (id: string) => aiProjectStore.approveProposal(id),
    rejectProposal: (id: string) => aiProjectStore.rejectProposal(id),
    answerQuestion: (id: string, answer: string) => aiProjectStore.answerQuestion(id, answer),
    nextBestAction: aiProjectStore.getNextBestAction(),
    addManualRequirement: (item: Omit<RequirementItem, "id" | "code">) =>
      aiProjectStore.addManualRequirement(item),
    updateRequirement: (id: string, updates: Partial<RequirementItem>) =>
      aiProjectStore.updateRequirement(id, updates),
    removeRequirement: (id: string) => aiProjectStore.removeRequirement(id),
    addManualCapability: (cap: Omit<CapabilityNode, "id">) => aiProjectStore.addManualCapability(cap),
    addManualDecision: (decision: TechStackDecision) => aiProjectStore.addManualDecision(decision),
    updateDecision: (category: TechStackDecision["category"], selectedOption: string) =>
      aiProjectStore.updateDecision(category, selectedOption),
    addManualDataEntity: (entity: Omit<DataEntity, "id">) => aiProjectStore.addManualDataEntity(entity),
    setAiEngineeringActive: (active: boolean) => aiProjectStore.setAiEngineeringActive(active),
    addManualAiModelCandidate: (candidate: Omit<AiModelCandidate, "id">) =>
      aiProjectStore.addManualAiModelCandidate(candidate),
    addManualReliabilityScenario: (scenario: ComponentFailureScenario) =>
      aiProjectStore.addManualReliabilityScenario(scenario),
    addManualTestCase: (tc: Omit<TestCaseItem, "id" | "code">) => aiProjectStore.addManualTestCase(tc),
  };
}
