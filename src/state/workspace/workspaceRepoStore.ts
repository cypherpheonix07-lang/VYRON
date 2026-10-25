/**
 * VYRON / BRAHMA — WORKSPACE REPO FOLDER STORE
 * Manages internal virtual folders and imported GitHub repositories.
 *
 * GOVERNANCE LAWS:
 *  - Zero Remote Mutation: Folders exist strictly inside the internal application workspace.
 *    No commits, branch changes, or folder creation on the user's remote GitHub repository.
 *  - Multi-Repository Organization: Allows users to categorize, filter, move, and reclassify repositories.
 */

import { CLASSIFICATION_CATEGORIES, type RepoClassificationResult } from "@/services/ai/aiRepoClassifier";

export interface ImportedRepoRecord {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  stars: number;
  defaultBranch: string;
  categorySlug: string;
  categoryName: string;
  confidence: number;
  summary: string;
  tags: string[];
  readmeSize: number;
  readmePath?: string | undefined;
  importedAt: string;
}

export interface WorkspaceFolder {
  slug: string;
  name: string;
  description: string;
  icon: string;
  repositories: ImportedRepoRecord[];
}

type StoreListener = () => void;

class WorkspaceRepoStore {
  private static readonly STORAGE_KEY = "vyron_workspace_repo_folders";
  private folders: Map<string, WorkspaceFolder> = new Map();
  private listeners: Set<StoreListener> = new Set();

  constructor() {
    this.initializeDefaultFolders();
    this.hydrate();
  }

  private initializeDefaultFolders(): void {
    for (const cat of CLASSIFICATION_CATEGORIES) {
      this.folders.set(cat.slug, {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        repositories: [],
      });
    }
  }

  private persist(): void {
    if (typeof localStorage === "undefined") return;
    try {
      const data = Array.from(this.folders.values());
      localStorage.setItem(WorkspaceRepoStore.STORAGE_KEY, JSON.stringify(data));
      this.notify();
    } catch {
      // ignore
    }
  }

  private hydrate(): void {
    if (typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem(WorkspaceRepoStore.STORAGE_KEY);
      if (raw) {
        const stored: WorkspaceFolder[] = JSON.parse(raw);
        for (const f of stored) {
          if (this.folders.has(f.slug)) {
            const existing = this.folders.get(f.slug)!;
            existing.repositories = f.repositories || [];
            if (f.name) existing.name = f.name;
          } else {
            this.folders.set(f.slug, f);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  private notify(): void {
    for (const l of this.listeners) {
      try {
        l();
      } catch {
        // ignore
      }
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getFolders(): WorkspaceFolder[] {
    return Array.from(this.folders.values());
  }

  public getTotalRepoCount(): number {
    let count = 0;
    for (const f of this.folders.values()) {
      count += f.repositories.length;
    }
    return count;
  }

  public importRepository(
    repo: {
      id: number;
      name: string;
      fullName: string;
      owner: string;
      description?: string | null;
      language?: string | null;
      htmlUrl: string;
      stars: number;
      defaultBranch: string;
    },
    classification: RepoClassificationResult,
    readmeMeta?: { size: number; path: string },
  ): ImportedRepoRecord {
    const targetSlug = classification.categorySlug || "uncategorized";
    const folder = this.folders.get(targetSlug) || this.folders.get("uncategorized")!;

    // Remove existing if already present
    this.removeRepository(repo.id);

    const record: ImportedRepoRecord = {
      id: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      owner: repo.owner,
      description: repo.description || null,
      language: repo.language || null,
      htmlUrl: repo.htmlUrl,
      stars: repo.stars,
      defaultBranch: repo.defaultBranch,
      categorySlug: folder.slug,
      categoryName: folder.name,
      confidence: classification.confidence,
      summary: classification.summary,
      tags: classification.tags,
      readmeSize: readmeMeta?.size || 0,
      readmePath: readmeMeta?.path,
      importedAt: new Date().toISOString(),
    };

    folder.repositories.push(record);
    this.persist();
    return record;
  }

  public removeRepository(repoId: number): void {
    for (const f of this.folders.values()) {
      f.repositories = f.repositories.filter((r) => r.id !== repoId);
    }
    this.persist();
  }

  public moveRepository(repoId: number, targetFolderSlug: string): boolean {
    const targetFolder = this.folders.get(targetFolderSlug);
    if (!targetFolder) return false;

    let targetRepo: ImportedRepoRecord | null = null;
    for (const f of this.folders.values()) {
      const idx = f.repositories.findIndex((r) => r.id === repoId);
      if (idx !== -1) {
        targetRepo = f.repositories.splice(idx, 1)[0] ?? null;
        break;
      }
    }

    if (!targetRepo) return false;

    targetRepo.categorySlug = targetFolder.slug;
    targetRepo.categoryName = targetFolder.name;
    targetFolder.repositories.push(targetRepo);
    this.persist();
    return true;
  }

  public renameFolder(folderSlug: string, newName: string): boolean {
    const folder = this.folders.get(folderSlug);
    if (!folder) return false;
    folder.name = newName.trim();
    for (const r of folder.repositories) {
      r.categoryName = folder.name;
    }
    this.persist();
    return true;
  }

  public clearAll(): void {
    for (const f of this.folders.values()) {
      f.repositories = [];
    }
    this.persist();
  }
}

export const workspaceRepoStore = new WorkspaceRepoStore();
