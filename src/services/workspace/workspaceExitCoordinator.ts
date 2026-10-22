/**
 * PROJECT VYRON / BRAHMA — WORKSPACE EXIT COORDINATOR
 * Orchestrates the full lifecycle of workspace exit decisions:
 * - Direct exit when no unsaved changes exist
 * - Accessible multi-choice dialog when unsaved changes are present:
 *   1. Save and exit
 *   2. Discard changes and exit
 *   3. Continue working
 * - Confirmed persistence before navigation
 * - Data-safe discard that preserves previously saved project history
 * - Automatic detachment of active workspace context
 * - Navigation to new Empty Dashboard (/app) with authoritative exit outcome
 * - Preserves authenticated user session (exit != logout)
 */

import {
  workspaceChangeRegistry,
  type DirtySectionDetail,
  type SaveAllResult,
} from "./workspaceChangeRegistry";
import { projectRegistry } from "../project/projectRegistry";

export type ExitState =
  | "IDLE"
  | "CHECKING"
  | "CONFIRMING"
  | "VALIDATING"
  | "SAVING"
  | "DISCARDING"
  | "CONFLICT"
  | "ERROR"
  | "LEAVING"
  | "COMPLETED";

export type ExitOutcome = "saved" | "discarded" | "clean";

export interface ExitAttemptOptions {
  projectId?: string | null | undefined;
  projectName?: string | null | undefined;
  destination?: string | undefined;
  navigate: (to: string, options?: Record<string, unknown>) => void;
  onConfirmRequired?: (dirtySections: DirtySectionDetail[]) => void;
}

export interface ExitCoordinatorState {
  status: ExitState;
  attemptId?: string | undefined;
  destination?: string | undefined;
  projectId?: string | null | undefined;
  projectName?: string | null | undefined;
  dirtySections: DirtySectionDetail[];
  error?: string | undefined;
  failedSections: string[];
}

type StateListener = (state: ExitCoordinatorState) => void;

class WorkspaceExitCoordinator {
  private state: ExitCoordinatorState = {
    status: "IDLE",
    dirtySections: [],
    failedSections: [],
  };

  private listeners: Set<StateListener> = new Set();
  private pendingNavigate?: ((to: string) => void) | undefined;

  public getState(): ExitCoordinatorState {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setState(patch: Partial<ExitCoordinatorState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("[WorkspaceExitCoordinator] Listener error:", err);
      }
    }
  }

  /**
   * Check if any registered section within the target project has unsaved changes.
   */
  public hasUnsavedChanges(projectId?: string | null): boolean {
    return workspaceChangeRegistry.hasUnsavedChanges(projectId);
  }

  /**
   * Enumerate all currently dirty sections (optionally scoped to a specific project).
   */
  public getDirtySections(projectId?: string | null): DirtySectionDetail[] {
    return workspaceChangeRegistry.getDirtySections(projectId);
  }

  /**
   * Primary entrypoint when user clicks an "Exit" control or triggers guarded departure.
   * If clean -> detaches active project and exits immediately to empty dashboard without prompt.
   * If dirty -> opens confirmation dialog (Save, Discard, Continue).
   */
  public async requestExit(options: ExitAttemptOptions): Promise<{ prompted: boolean; outcome?: ExitOutcome }> {
    // Prevent overlapping concurrent attempts (D13)
    if (this.state.status === "SAVING" || this.state.status === "DISCARDING" || this.state.status === "LEAVING") {
      return { prompted: false };
    }

    const attemptId = `exit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const destination = options.destination || "/app";

    this.pendingNavigate = options.navigate;
    this.setState({
      status: "CHECKING",
      attemptId,
      destination,
      projectId: options.projectId,
      projectName: options.projectName,
      error: undefined,
      failedSections: [],
    });

    const dirtySections = workspaceChangeRegistry.getDirtySections(options.projectId);

    if (dirtySections.length === 0) {
      // Direct clean exit (D09, D10)
      this.setState({ status: "LEAVING", dirtySections: [] });
      this.navigateToEmptyDashboard({
        projectId: options.projectId,
        projectName: options.projectName,
        outcome: "clean",
        destination,
      });
      this.setState({ status: "COMPLETED" });
      setTimeout(() => this.setState({ status: "IDLE" }), 50);
      return { prompted: false, outcome: "clean" };
    }

    // Require decision confirmation (D03)
    this.setState({
      status: "CONFIRMING",
      dirtySections,
    });

    if (options.onConfirmRequired) {
      options.onConfirmRequired(dirtySections);
    }

    return { prompted: true };
  }

  /**
   * Action 1: "Save and exit"
   * Persists all dirty sections and waits for confirmed persistence before detaching context and navigating.
   */
  public async executeSaveAndExit(): Promise<boolean> {
    if (this.state.status === "SAVING" || this.state.status === "DISCARDING") {
      return false; // Prevent simultaneous action race (D14)
    }

    const { projectId, projectName, destination, dirtySections } = this.state;
    this.setState({ status: "VALIDATING", error: undefined, failedSections: [] });

    try {
      this.setState({ status: "SAVING" });
      const result: SaveAllResult = await workspaceChangeRegistry.saveAll(projectId);

      if (!result.success) {
        // Saving failed: preserve user edits in workspace (L12, L13, D18)
        const errorMsg = `Failed to save ${result.failed.join(", ")}. Please review your changes and try again.`;
        this.setState({
          status: "ERROR",
          error: errorMsg,
          failedSections: result.failed,
          dirtySections: workspaceChangeRegistry.getDirtySections(projectId),
        });
        return false;
      }

      // Confirmed persistence achieved -> detach context and navigate to empty dashboard (J17, J18)
      this.setState({ status: "LEAVING" });
      const sectionLabels = dirtySections.map((s) => s.label);

      this.navigateToEmptyDashboard({
        projectId,
        projectName,
        outcome: "saved",
        sections: sectionLabels,
        destination,
      });

      this.setState({ status: "COMPLETED", dirtySections: [], failedSections: [] });
      setTimeout(() => this.setState({ status: "IDLE" }), 50);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({
        status: "ERROR",
        error: `Persistence error: ${msg}`,
      });
      return false;
    }
  }

  /**
   * Action 2: "Discard changes and exit"
   * Reverts uncommitted edits in declared scope. Previously saved data remains completely intact.
   */
  public async executeDiscardAndExit(): Promise<boolean> {
    if (this.state.status === "SAVING" || this.state.status === "DISCARDING") {
      return false; // Prevent simultaneous action race (D14)
    }

    const { projectId, projectName, destination, dirtySections } = this.state;
    this.setState({ status: "DISCARDING", error: undefined });

    try {
      const { discarded } = await workspaceChangeRegistry.discardAll(projectId);

      this.setState({ status: "LEAVING" });
      this.navigateToEmptyDashboard({
        projectId,
        projectName,
        outcome: "discarded",
        sections: discarded.length > 0 ? discarded : dirtySections.map((s) => s.label),
        destination,
      });

      this.setState({ status: "COMPLETED", dirtySections: [], failedSections: [] });
      setTimeout(() => this.setState({ status: "IDLE" }), 50);
      return true;
    } catch (err) {
      console.error("[WorkspaceExitCoordinator] Discard error:", err);
      // Fallback safe navigation after discard attempt
      this.navigateToEmptyDashboard({
        projectId,
        projectName,
        outcome: "discarded",
        destination,
      });
      this.setState({ status: "COMPLETED" });
      setTimeout(() => this.setState({ status: "IDLE" }), 50);
      return true;
    }
  }

  /**
   * Action 3: "Continue working"
   * Cancels the exit request, closes confirmation dialog, and preserves active editing session.
   */
  public cancelExit(): void {
    // Only safe cancellation boundary (D15)
    if (this.state.status === "SAVING" || this.state.status === "DISCARDING" || this.state.status === "LEAVING") {
      return;
    }

    this.setState({
      status: "IDLE",
      error: undefined,
      failedSections: [],
    });
  }

  /**
   * Detaches active workspace context and routes to the new Empty Dashboard (/app).
   * Constructs authoritative exit outcome parameters.
   */
  public navigateToEmptyDashboard(params: {
    projectId?: string | null | undefined;
    projectName?: string | null | undefined;
    outcome: ExitOutcome;
    sections?: string[] | undefined;
    destination?: string | undefined;
  }): void {
    // 1. Detach active workspace context (U01, U02, E17)
    projectRegistry.clearActiveProject();

    // 2. Prepare concise outcome parameters for the empty dashboard (T16)
    const searchParams: Record<string, string> = {
      exitOutcome: params.outcome,
      ts: new Date().toISOString(),
    };
    if (params.projectId) searchParams["projectId"] = params.projectId;
    if (params.projectName) searchParams["projectName"] = params.projectName;
    if (params.sections && params.sections.length > 0) {
      searchParams["sections"] = params.sections.join(",");
    }

    const queryStr = new URLSearchParams(searchParams).toString();
    const destinationPath = params.destination?.split("?")[0] || "/app";
    const fullTarget = `${destinationPath}?${queryStr}`;

    if (!this.pendingNavigate) {
      if (typeof window !== "undefined") {
        window.location.href = fullTarget;
      }
      return;
    }

    this.pendingNavigate(fullTarget);
  }

  /**
   * Backwards-compatible alias for navigateToEmptyDashboard.
   */
  public navigateToExitPage(params: {
    projectId?: string | null | undefined;
    projectName?: string | null | undefined;
    outcome: ExitOutcome;
    sections?: string[] | undefined;
    destination?: string | undefined;
  }): void {
    this.navigateToEmptyDashboard(params);
  }
}

export const workspaceExitCoordinator = new WorkspaceExitCoordinator();
