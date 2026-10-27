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
  id?: string; // e.g. "requirements", "security", "blueprint", "editor"
  label?: string; // User-facing label e.g. "Requirements Specification"
  sectionId?: string; // Alias for id
  sectionName?: string; // Alias for label
  projectId?: string | null | undefined;
  isDirty: () => boolean;
  getDirtySummary?: () => string;
  save: () => Promise<boolean | void> | boolean | void;
  discard: () => Promise<void> | void;
  hasPendingWrites?: () => boolean;
  cancelPendingWrites?: () => void;
  waitForPendingWrites?: () => Promise<void>;
  isSaving?: () => boolean;
}

export interface DirtySectionDetail {
  id: string;
  label: string;
  projectId?: string | null | undefined;
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
    const key = section.id || section.sectionId || `section-${Math.random().toString(36).substring(2, 9)}`;
    const label = section.label || section.sectionName || key;
    const normalized: RegisteredWorkspaceSection = {
      ...section,
      id: key,
      label,
    };
    this.sections.set(key, normalized);
    this.notifyListeners();

    return () => {
      this.sections.delete(key);
      this.notifyListeners();
    };
  }

  /**
   * Check if any registered section within the target project has unsaved changes.
   */
  public hasUnsavedChanges(projectId?: string | null): boolean {
    return this.getDirtySections(projectId).length > 0;
  }

  /**
   * Enumerate all currently dirty sections (optionally scoped to a specific project).
   */
  public getDirtySections(projectId?: string | null): DirtySectionDetail[] {
    const dirty: DirtySectionDetail[] = [];

    for (const section of this.sections.values()) {
      if (projectId && section.projectId && section.projectId !== projectId) {
        continue;
      }

      try {
        if (section.isDirty()) {
          const id = section.id || section.sectionId || "unknown";
          const label = section.label || section.sectionName || id;
          dirty.push({
            id,
            label,
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
  public async saveAll(projectId?: string | null): Promise<SaveAllResult> {
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

      const id = section.id || section.sectionId || "unknown";
      const label = section.label || section.sectionName || id;

      try {
        const result = await section.save();
        const ok = result !== false;
        if (ok) {
          saved.push(label);
        } else {
          failed.push(label);
          errors[id] = "Section save handler returned unsuccessful status.";
        }
      } catch (err) {
        failed.push(label);
        errors[id] = err instanceof Error ? err.message : String(err);
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
  public async discardAll(projectId?: string | null): Promise<DiscardAllResult> {
    const discarded: string[] = [];

    for (const section of this.sections.values()) {
      if (projectId && section.projectId && section.projectId !== projectId) {
        continue;
      }

      if (!section.isDirty()) {
        continue;
      }

      const id = section.id || section.sectionId || "unknown";
      const label = section.label || section.sectionName || id;

      try {
        // Workstream N & Journey 7: Reconcile in-flight writes and cancel debounce timers
        if (typeof section.cancelPendingWrites === "function") {
          section.cancelPendingWrites();
        }
        if (typeof section.waitForPendingWrites === "function") {
          await section.waitForPendingWrites();
        }
        await section.discard();
        discarded.push(label);
      } catch (err) {
        console.error(`[WorkspaceChangeRegistry] Error discarding edits in section "${id}":`, err);
      }
    }

    this.notifyListeners();

    return { discarded };
  }

  /**
   * Check if any registered section within the target project has in-flight writes or active saves.
   */
  public hasPendingWrites(projectId?: string | null): boolean {
    for (const section of this.sections.values()) {
      if (projectId && section.projectId && section.projectId !== projectId) {
        continue;
      }
      if (section.hasPendingWrites && section.hasPendingWrites()) {
        return true;
      }
      if (section.isSaving && section.isSaving()) {
        return true;
      }
    }
    return false;
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
