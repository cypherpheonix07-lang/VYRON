/**
 * PROJECT VYRON / BRAHMA — WORKSPACE EXIT COORDINATOR
 * Orchestrates the full lifecycle of workspace exit decisions:
 * - Direct exit when no unsaved changes exist
 * - Accessible multi-choice dialog when unsaved changes are present
 * - Confirmed persistence before navigation
 * - Data-safe discard that preserves previously saved project history
 * - Navigation to dedicated /app/exit page while preserving authentication
 */

import {
  workspaceChangeRegistry,
  type DirtySectionDetail,
  type SaveAllResult,
} from "./workspaceChangeRegistry";

export type ExitState =
  | "IDLE"
  | "CHECKING"
  | "CONFIRMING"
  | "SAVING"
  | "DISCARDING"
  | "LEAVING"
  | "ERROR";

export type ExitOutcome = "saved" | "discarded" | "clean";

export interface ExitAttemptOptions {
  projectId?: string | null | undefined;
  projectName?: string | null | undefined;
  navigate: (to: string, options?: Record<string, unknown>) => void;
  onConfirmRequired?: (dirtySections: DirtySectionDetail[]) => void;
}

export interface ExitCoordinatorState {
  status: ExitState;
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
   * Primary entrypoint when user clicks an "Exit" control or navigates away.
   * If clean -> exits immediately to /app/exit without prompt.
   * If dirty -> opens confirmation dialog.
   */
  public async requestExit(options: ExitAttemptOptions): Promise<{ prompted: boolean; outcome?: ExitOutcome }> {
    this.pendingNavigate = options.navigate;
    this.setState({
      status: "CHECKING",
      projectId: options.projectId,
      projectName: options.projectName,
      error: undefined,
      failedSections: [],
    });

    const dirtySections = workspaceChangeRegistry.getDirtySections(options.projectId);

    if (dirtySections.length === 0) {
      // Direct clean exit
      this.setState({ status: "LEAVING", dirtySections: [] });
      this.navigateToExitPage({
        projectId: options.projectId,
        projectName: options.projectName,
        outcome: "clean",
      });
      this.setState({ status: "IDLE" });
      return { prompted: false, outcome: "clean" };
    }

    // Require decision confirmation
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
   * Persists all dirty sections and waits for verified persistence before navigating.
   */
  public async executeSaveAndExit(): Promise<boolean> {
    const { projectId, projectName, dirtySections } = this.state;
    this.setState({ status: "SAVING", error: undefined, failedSections: [] });

    try {
      const result: SaveAllResult = await workspaceChangeRegistry.saveAll(projectId);

      if (!result.success) {
        // Saving failed: keep user in workspace with edits intact
        const errorMsg = `Failed to save ${result.failed.join(", ")}. Please review your changes and try again.`;
        this.setState({
          status: "ERROR",
          error: errorMsg,
          failedSections: result.failed,
          dirtySections: workspaceChangeRegistry.getDirtySections(projectId),
        });
        return false;
      }

      // Confirmed persistence achieved
      this.setState({ status: "LEAVING" });
      const sectionLabels = dirtySections.map((s) => s.label);

      this.navigateToExitPage({
        projectId,
        projectName,
        outcome: "saved",
        sections: sectionLabels,
      });

      this.setState({ status: "IDLE", dirtySections: [], failedSections: [] });
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
   * Reverts only uncommitted edits in declared scope. Previously saved data remains intact.
   */
  public async executeDiscardAndExit(): Promise<boolean> {
    const { projectId, projectName, dirtySections } = this.state;
    this.setState({ status: "DISCARDING", error: undefined });

    try {
      const { discarded } = await workspaceChangeRegistry.discardAll(projectId);

      this.setState({ status: "LEAVING" });
      this.navigateToExitPage({
        projectId,
        projectName,
        outcome: "discarded",
        sections: discarded.length > 0 ? discarded : dirtySections.map((s) => s.label),
      });

      this.setState({ status: "IDLE", dirtySections: [], failedSections: [] });
      return true;
    } catch (err) {
      console.error("[WorkspaceExitCoordinator] Discard error:", err);
      // Fallback navigation after discard attempt
      this.navigateToExitPage({
        projectId,
        projectName,
        outcome: "discarded",
      });
      this.setState({ status: "IDLE" });
      return true;
    }
  }

  /**
   * Action 3: "Continue working"
   * Cancels the exit request, closes confirmation dialog, and restores workspace editing.
   */
  public cancelExit(): void {
    this.setState({
      status: "IDLE",
      error: undefined,
      failedSections: [],
    });
  }

  /**
   * Helper to construct safe URL parameters and route to dedicated /app/exit page.
   */
  private navigateToExitPage(params: {
    projectId?: string | null | undefined;
    projectName?: string | null | undefined;
    outcome: ExitOutcome;
    sections?: string[] | undefined;
  }): void {
    if (!this.pendingNavigate) {
      if (typeof window !== "undefined") {
        const search = new URLSearchParams();
        if (params.projectId) search.set("projectId", params.projectId);
        if (params.projectName) search.set("projectName", params.projectName);
        search.set("outcome", params.outcome);
        if (params.sections?.length) search.set("sections", params.sections.join(","));
        search.set("ts", new Date().toISOString());
        window.location.href = `/app/exit?${search.toString()}`;
      }
      return;
    }

    const searchParams: Record<string, string> = {
      outcome: params.outcome,
      ts: new Date().toISOString(),
    };
    if (params.projectId) searchParams["projectId"] = params.projectId;
    if (params.projectName) searchParams["projectName"] = params.projectName;
    if (params.sections && params.sections.length > 0) {
      searchParams["sections"] = params.sections.join(",");
    }

    const queryStr = new URLSearchParams(searchParams).toString();
    this.pendingNavigate(`/app/exit?${queryStr}`);
  }
}

export const workspaceExitCoordinator = new WorkspaceExitCoordinator();
