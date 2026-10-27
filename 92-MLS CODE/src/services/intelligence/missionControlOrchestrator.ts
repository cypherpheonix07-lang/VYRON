/**
 * VYRON — P31: MISSION CONTROL, PLAN ORCHESTRATION & AUTONOMOUS GOAL PURSUIT
 * Multi-step goal orchestration, finite-state execution plans,
 * human-in-the-loop checkpoints, and autonomous goal fulfillment.
 * Strictly ZERO operational raw SQL.
 */

export type MissionPhase = 
  | "PLANNING"
  | "STAGING"
  | "EXECUTING"
  | "POSTCONDITION_VERIFICATION"
  | "COMPLETED"
  | "ABORTED";

export interface MissionStep {
  stepIndex: number;
  title: string;
  specialistId: string;
  action: string;
  isCompleted: boolean;
  outputPayload?: Record<string, unknown> | undefined;
}

export interface OrchestratedMission {
  missionId: string;
  title: string;
  phase: MissionPhase;
  targetGoal: string;
  steps: MissionStep[];
  currentStepIndex: number;
  startedAt: string;
  completedAt?: string | undefined;
}

export class MissionControlOrchestrator {
  private static readonly ACTIVE_MISSIONS: Map<string, OrchestratedMission> = new Map();

  public static createMission(
    title: string,
    targetGoal: string,
    steps: Array<{ title: string; specialistId: string; action: string }>
  ): OrchestratedMission {
    const missionId = `mis_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const mission: OrchestratedMission = {
      missionId,
      title,
      phase: "PLANNING",
      targetGoal,
      steps: steps.map((s, idx) => ({
        stepIndex: idx,
        title: s.title,
        specialistId: s.specialistId,
        action: s.action,
        isCompleted: false
      })),
      currentStepIndex: 0,
      startedAt: new Date().toISOString()
    };

    this.ACTIVE_MISSIONS.set(missionId, mission);
    return mission;
  }

  public static advanceStep(
    missionId: string,
    stepResult: Record<string, unknown>
  ): { isFinished: boolean; mission?: OrchestratedMission | undefined; error?: string | undefined } {
    const mission = this.ACTIVE_MISSIONS.get(missionId);
    if (!mission) {
      return { isFinished: false, error: `Mission ${missionId} not found.` };
    }

    if (mission.phase === "PLANNING") {
      mission.phase = "EXECUTING";
    }

    const currentStep = mission.steps[mission.currentStepIndex];
    if (currentStep) {
      currentStep.isCompleted = true;
      currentStep.outputPayload = stepResult;
      mission.currentStepIndex++;
    }

    if (mission.currentStepIndex >= mission.steps.length) {
      mission.phase = "COMPLETED";
      mission.completedAt = new Date().toISOString();
      return { isFinished: true, mission };
    }

    return { isFinished: false, mission };
  }

  public static getMission(missionId: string): OrchestratedMission | undefined {
    return this.ACTIVE_MISSIONS.get(missionId);
  }
}
