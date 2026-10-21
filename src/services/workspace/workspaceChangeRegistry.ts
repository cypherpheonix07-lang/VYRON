/**
 * PROJECT VYRON / BRAHMA — WORKSPACE CHANGE REGISTRY
 * Centralized, zero-leak registry for tracking unsaved workspace edits,
 * baseline snapshots, and atomic save/discard operations.
 *
 * Enforces Zero-Fiction:
 * - "Discard" resets only registered uncommitted edits; previously persisted records remain intact.
 * - "Save" executes real persistence callbacks and updates confirmed baseline upon success.
 * - Presentation state (scroll, active tabs, filters) is strictly excluded from dirty detection.
 */

export interface RegisteredWorkspaceSection {
  id: string; // e.g. "requirements", "security", "blueprint", "editor"
  label: string; // User-facing label e.g. "Requirements Specification"
  projectId?: string | undefined;
  isDirty: () => boolean;
  getDirtySummary?: () => string;
  save: () => Promise<boolean>;
  discard: () => Promise<void> | void;
}

export interface DirtySectionDetail {
  id: string;
  label: string;
  projectId?: string | undefined;
  summary?: string | undefined;
}

export interface SaveAllResult {
  success: boolean;
  saved: string[];
  failed: string[];
  errors: Record<string, string>;
}

export interface DiscardAllResult {
  discarded: string[];
}

type ChangeListener = () => void;

class WorkspaceChangeRegistry {
  private sections: Map<string, RegisteredWorkspaceSection> = new Map();
  private listeners: Set<ChangeListener> = new Set();

  /**
   * Register an editable section within the active workspace.
   * Returns an unregister function for component unmount cleanup.
   */
  public register(section: RegisteredWorkspaceSection): () => void {
    this.sections.set(section.id, section);
    this.notifyListeners();

    return () => {
      this.sections.delete(section.id);
      this.notifyListeners();
    };
  }

  /**
   * Check if any registered section within the target project has unsaved changes.
   */
  public hasUnsavedChanges(projectId?: string): boolean {
    return this.getDirtySections(projectId).length > 0;
  }

  /**
   * Enumerate all currently dirty sections (optionally scoped to a specific project).
   */
  public getDirtySections(projectId?: string): DirtySectionDetail[] {
    const dirty: DirtySectionDetail[] = [];

    for (const section of this.sections.values()) {
      if (projectId && section.projectId && section.projectId !== projectId) {
        continue;
      }

      try {
        if (section.isDirty()) {
          dirty.push({
            id: section.id,
            label: section.label,
            projectId: section.projectId,
            summary: section.getDirtySummary ? section.getDirtySummary() : undefined,
          });
        }
      } catch (err) {
        console.error(`[WorkspaceChangeRegistry] Error evaluating isDirty for section "${section.id}":`, err);
      }
    }

    return dirty;
  }

  /**
   * Execute save handlers for all dirty sections.
   * Saves are invoked sequentially or independently; tracks partial successes and failures.
   */
  public async saveAll(projectId?: string): Promise<SaveAllResult> {
    const saved: string[] = [];
    const failed: string[] = [];
    const errors: Record<string, string> = {};

    for (const section of this.sections.values()) {
      if (projectId && section.projectId && section.projectId !== projectId) {
        continue;
      }

      if (!section.isDirty()) {
        continue;
      }

      try {
        const ok = await section.save();
        if (ok) {
          saved.push(section.label);
        } else {
          failed.push(section.label);
          errors[section.id] = "Section save handler returned unsuccessful status.";
        }
      } catch (err) {
        failed.push(section.label);
        errors[section.id] = err instanceof Error ? err.message : String(err);
      }
    }

    this.notifyListeners();

    return {
      success: failed.length === 0,
      saved,
      failed,
      errors,
    };
  }

  /**
   * Discard all unsaved edits across registered dirty sections.
   * Restores each section to its confirmed saved baseline without deleting existing project data.
   */
  public async discardAll(projectId?: string): Promise<DiscardAllResult> {
    const discarded: string[] = [];

    for (const section of this.sections.values()) {
      if (projectId && section.projectId && section.projectId !== projectId) {
        continue;
      }

      if (!section.isDirty()) {
        continue;
      }

      try {
        await section.discard();
        discarded.push(section.label);
      } catch (err) {
        console.error(`[WorkspaceChangeRegistry] Error discarding edits in section "${section.id}":`, err);
      }
    }

    this.notifyListeners();

    return { discarded };
  }

  /**
   * Subscribe to registry changes (registrations, unregistrations, save/discard completions).
   */
  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Trigger change notification manually when component state mutates.
   */
  public notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error("[WorkspaceChangeRegistry] Listener error:", err);
      }
    }
  }

  /**
   * Total registered sections count.
   */
  public getCount(): number {
    return this.sections.size;
  }
}

export const workspaceChangeRegistry = new WorkspaceChangeRegistry();
