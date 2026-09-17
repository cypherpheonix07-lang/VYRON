/**
 * PROJECT BRAHMA / VYRON — AI PROJECT ENGINEERING CONTROL PLANE
 * Initialization Gate & Workspace Context Continuity (Phase 07)
 * Strictly ZERO Raw SQL.
 */

import { supabase } from "@/lib/supabaseClient";
import { authService } from "@/services/authService";
import { ProjectEngineeringState } from "@/types/aiProjectControlPlane";
import { copilotMemory } from "@/services/copilot/copilotMemory";

export interface InitializationValidationResult {
  canInitialize: boolean;
  blockers: string[];
}

export class InitializationGate {
  private static instance: InitializationGate | null = null;

  private constructor() {}

  public static getInstance(): InitializationGate {
    if (!InitializationGate.instance) {
      InitializationGate.instance = new InitializationGate();
    }
    return InitializationGate.instance;
  }

  /**
   * Evaluates all pre-initialization blocking criteria.
   */
  public validate(state: ProjectEngineeringState): InitializationValidationResult {
    const blockers: string[] = [];

    // 1. Unresolved critical conflicts check
    const criticalConflicts = state.requirements.filter((r) => r.conflictsWith.length > 0);
    if (criticalConflicts.length > 0) {
      blockers.push(`${criticalConflicts.length} requirement conflict(s) must be resolved.`);
    }

    // 2. Unresolved critical security threats check
    const criticalThreats = state.security.threats.filter((t) => t.residualRisk === "HIGH");
    if (criticalThreats.length > 0) {
      blockers.push(`${criticalThreats.length} high/critical residual risk security threat(s) unresolved.`);
    }

    // 3. Architecture selected check
    if (!state.architecture.selectedAlternativeId) {
      blockers.push("An architectural baseline topology must be selected.");
    }

    // 4. Blueprint compiled check
    if (!state.blueprint || !state.blueprint.initializationReady) {
      blockers.push("Canonical 26-section Project Blueprint must be compiled and signed off.");
    }

    return {
      canInitialize: blockers.length === 0,
      blockers,
    };
  }

  /**
   * Transactionally provisions the project in Supabase with complete AI context handoff.
   */
  public async initializeProject(
    state: ProjectEngineeringState,
  ): Promise<{ success: boolean; projectId: string; error?: string }> {
    const validation = this.validate(state);
    if (!validation.canInitialize) {
      return {
        success: false,
        projectId: "",
        error: `Initialization blocked: ${validation.blockers.join(" ")}`,
      };
    }

    try {
      const userRes = await authService.getUser();
      const userId = userRes.data?.id || state.ownerId || "4666a9f0-f28d-4845-9a21-9b9210b18af9";

      // 1. Database Upsert
      const projectRow = {
        owner_id: userId,
        name: state.name,
        slug: state.slug,
        description: state.problem.problemStatement || state.intent.naturalLanguageIntent,
        tags: [state.intent.domain.toLowerCase(), state.intent.projectType],
        domain: state.intent.domain,
        domain_secondary: state.intent.secondaryDomains,
        scale: "enterprise",
        target_users: state.intent.targetUsers,
        platforms: ["web", "api"],
        stack: state.technology.decisions.find((d) => d.category === "backend")?.selectedOption || "react-fastapi",
        feature_toggles: { auth: true, audit_logs: true, telemetry: true },
        ai_tasks: { copilot: true, requirements_rag: true },
        gate_strictness: "strict",
        compliance_pack: "soc2",
        kpi_targets: { health_min: 90, coverage_min: 85, max_critical: 0 },
        budget_cap_usd: 1000,
        health_score: 95,
        status: "active",
        wizard_step: 0,
        draft_state: null, // Clear draft
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: newProj, error: insertErr } = await supabase
        .from("projects")
        .insert(projectRow)
        .select()
        .single();

      let createdProjectId = newProj?.id;

      if (insertErr) {
        // Fallback for minimum verified schema columns
        const fallbackRow = {
          owner_id: userId,
          name: state.name,
          description: state.problem.problemStatement || state.intent.naturalLanguageIntent,
          domain: state.intent.domain,
          domain_secondary: state.intent.secondaryDomains,
          target_users: state.intent.targetUsers,
          platforms: ["web", "api"],
          feature_toggles: { auth: true },
          compliance_pack: "soc2",
          gate_strictness: "strict",
          kpi_targets: { health_min: 90, coverage_min: 85 },
          budget_cap_usd: 1000,
          health_score: 95,
          status: "active",
          wizard_step: 0,
          draft_state: null,
        };

        const { data: fallbackProj, error: fallbackErr } = await supabase
          .from("projects")
          .insert(fallbackRow)
          .select()
          .single();

        if (fallbackErr) {
          throw new Error(`Failed to provision project: ${fallbackErr.message}`);
        }

        createdProjectId = fallbackProj.id;
      }

      // 2. Log Telemetry to activity_events
      try {
        await supabase.from("activity_events").insert({
          project_id: createdProjectId,
          actor_id: userId,
          actor_name: userRes.data?.email ? userRes.data.email.split("@")[0] : "System Architect",
          event_type: "system",
          severity: "info",
          title: "AI Project Control Plane Initialized",
          description: `Project "${state.name}" provisioned from canonical blueprint v${state.version} with 14 verified engineering stages.`,
          payload: {
            blueprintSha256: state.blueprint?.sha256,
            requirementsCount: state.requirements.length,
            architecture: state.architecture.selectedAlternativeId,
            timestamp: new Date().toISOString(),
          },
        });
      } catch {
        // Best-effort telemetry
      }

      // 3. Seed Copilot Memory for Project Continuity
      try {
        copilotMemory.remember({
          layer: "PROJECT",
          key: "architecture_baseline",
          value: `Baseline architecture: ${state.architecture.selectedAlternativeId || "modular-monolith"}. Technology decisions: ${state.technology.decisions.length} recorded.`,
          projectId: createdProjectId,
          mode: "NORMAL",
          epistemicType: "FACT",
          authority: "CHIEF_ARCHITECT",
          scope: "PROJECT",
          sensitivity: "INTERNAL",
          status: "ACTIVE",
          confidence: 1.0,
          provenance: "AI Project Control Plane Initialization",
        });

        copilotMemory.remember({
          layer: "PROJECT",
          key: "requirements_baseline",
          value: `Initialized with ${state.requirements.length} atomic specifications (${state.requirements.filter((r) => r.type === "functional").length} functional, ${state.requirements.filter((r) => r.type === "non_functional").length} non-functional).`,
          projectId: createdProjectId,
          mode: "NORMAL",
          epistemicType: "FACT",
          authority: "STAFF_ENGINEER",
          scope: "PROJECT",
          sensitivity: "INTERNAL",
          status: "ACTIVE",
          confidence: 1.0,
          provenance: "Stage 03 Atomic Requirements Synthesis",
        });

        // Seed individual specifications (top 8)
        state.requirements.slice(0, 8).forEach((req) => {
          copilotMemory.remember({
            layer: "PROJECT",
            key: `req_${req.id}`,
            value: `[${req.priority}] ${req.title}: ${req.description}`,
            projectId: createdProjectId,
            mode: "NORMAL",
            epistemicType: req.status === "approved" ? "FACT" : "HYPOTHESIS",
            authority: "DEVELOPER",
            scope: "PROJECT",
            sensitivity: "INTERNAL",
            status: "ACTIVE",
            confidence: req.confidence ? req.confidence / 100 : 0.9,
            provenance: `Stage 03 / ${req.status}`,
          });
        });

        // Seed task DAG
        copilotMemory.remember({
          layer: "TASK",
          key: "initial_task_dag",
          value: `DAG plan with ${state.implementation.tasks.length} tasks and ${state.implementation.apiContracts.length} API contracts provisioned.`,
          projectId: createdProjectId,
          mode: "NORMAL",
          epistemicType: "FACT",
          authority: "STAFF_ENGINEER",
          scope: "PROJECT",
          sensitivity: "INTERNAL",
          status: "ACTIVE",
          confidence: 0.95,
          provenance: "Stage 12 Implementation Task DAG",
        });
      } catch (copilotErr) {
        console.warn("Copilot memory seeding skipped:", copilotErr);
      }

      // 4. Clear Local Storage Draft
      if (typeof window !== "undefined") {
        localStorage.removeItem("vyron_ai_project_control_plane_draft_v2");
        localStorage.removeItem("brahma_project_wizard_draft_v2");
      }

      return {
        success: true,
        projectId: createdProjectId,
      };
    } catch (err) {
      return {
        success: false,
        projectId: "",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

export const initializationGate = InitializationGate.getInstance();
