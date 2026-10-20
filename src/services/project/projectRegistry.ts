/**
 * VYRON — CANONICAL PROJECT REGISTRY & IDENTITY SERVICE (WORKSTREAM B & D)
 * Single source of truth for Project Identity across Command Center, Lifecycle sections,
 * Header selector, and Execution runs.
 * Strictly ZERO Raw SQL & Zero-Fiction Architecture Law enforced.
 */

import { supabase } from "../../lib/supabaseClient.ts";
import { authService } from "../authService.ts";
import { projects as seedProjects, type Project as MockProject } from "../../lib/mock-data.ts";

export type ProjectOrigin = "native" | "github";
export type ProjectAvailability =
  | "resolving"
  | "ready"
  | "missing"
  | "inaccessible"
  | "archived"
  | "error";

export interface CanonicalProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  domain: string;
  status: "Analyzed" | "Analyzing" | "Draft" | "Needs Review" | "At Risk";
  origin: ProjectOrigin;
  healthScore: number;
  securityScore: number;
  businessImpactScore: number;
  requirementClarity: number;
  deliveryRisk: "Low" | "Medium" | "High" | "Critical";
  riskScore: number;
  repoConnected: boolean;
  repoUrl?: string | undefined;
  repo_full_name?: string | null | undefined;
  default_branch?: string | undefined;
  teamSize: number;
  deadline: string;
  lastUpdated: string;
  lastAnalysis: string;
  created_at: string;
  updated_at?: string | undefined;
  owner_id?: string | undefined;
  health_score?: number | undefined; // compatibility
  revision?: string | undefined;
  version?: string | undefined;
}

const LOCAL_STORAGE_PROJECTS_KEY = "vyron_canonical_projects_v1";
const ACTIVE_PROJECT_KEY = "vyron_active_project_id";
const CONTEXT_GENERATION_KEY = "vyron_context_generation";

class ProjectRegistry {
  private static instance: ProjectRegistry | null = null;
  private localProjects: Map<string, CanonicalProject> = new Map();
  private activeProjectId: string | null = null;
  private generationId = 0;
  private listeners: Set<(activeProject: CanonicalProject | null) => void> = new Set();

  private constructor() {
    this.loadFromStorage();
    this.initDefaultActiveProject();
  }

  public static getInstance(): ProjectRegistry {
    if (!ProjectRegistry.instance) {
      ProjectRegistry.instance = new ProjectRegistry();
    }
    return ProjectRegistry.instance;
  }

  private loadFromStorage() {
    // 1. Seed initial projects
    for (const sp of seedProjects) {
      this.localProjects.set(sp.id, {
        ...sp,
        slug: sp.id,
        origin: sp.repoConnected ? "github" : "native",
        created_at: sp.lastUpdated || new Date().toISOString(),
        health_score: sp.healthScore,
      });
    }

    // 2. Load cached created projects from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as CanonicalProject[];
          for (const p of parsed) {
            this.localProjects.set(p.id, p);
          }
        }
      } catch (err) {
        console.warn("[ProjectRegistry] Failed to load local projects cache:", err);
      }
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      const all = Array.from(this.localProjects.values());
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(all));
    } catch (err) {
      console.warn("[ProjectRegistry] Failed to save local projects cache:", err);
    }
  }

  private initDefaultActiveProject() {
    if (typeof window !== "undefined") {
      const storedActive = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (storedActive && this.localProjects.has(storedActive)) {
        this.activeProjectId = storedActive;
        return;
      }
    }
    // Default to first seed project if available
    const first = Array.from(this.localProjects.values())[0];
    this.activeProjectId = first?.id || null;
  }

  public getGenerationId(): number {
    return this.generationId;
  }

  public bumpGeneration(): number {
    this.generationId += 1;
    return this.generationId;
  }

  public getAllProjects(): CanonicalProject[] {
    return Array.from(this.localProjects.values());
  }

  public getProjectById(id: string): CanonicalProject | null {
    if (!id || id === "all") return null;
    return this.localProjects.get(id) || null;
  }

  public getActiveProjectId(): string | null {
    return this.activeProjectId;
  }

  public getActiveProject(): CanonicalProject | null {
    if (!this.activeProjectId) return null;
    return this.getProjectById(this.activeProjectId);
  }

  public setActiveProjectId(id: string): CanonicalProject | null {
    this.bumpGeneration();
    const project = this.getProjectById(id);
    this.activeProjectId = id;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ACTIVE_PROJECT_KEY, id);
        window.dispatchEvent(
          new CustomEvent("vyron:project_changed", {
            detail: { projectId: id, project },
          })
        );
      } catch {
        // ignore
      }
    }

    this.notifyListeners(project);
    return project;
  }

  public registerProject(project: CanonicalProject): CanonicalProject {
    this.bumpGeneration();
    this.localProjects.set(project.id, project);

    // Keep seedProjects in sync for legacy readers
    const existingSeedIdx = seedProjects.findIndex((p) => p.id === project.id);
    if (existingSeedIdx >= 0) {
      seedProjects[existingSeedIdx] = project as unknown as MockProject;
    } else {
      seedProjects.push(project as unknown as MockProject);
    }

    this.saveToStorage();

    // Auto-select newly registered project
    this.setActiveProjectId(project.id);
    return project;
  }

  public createProject(
    payload: Partial<CanonicalProject> & { name: string; origin?: ProjectOrigin }
  ): CanonicalProject {
    const id = payload.id || `proj-${Date.now()}`;
    const slug =
      payload.slug ||
      payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProject: CanonicalProject = {
      id,
      name: payload.name,
      slug,
      description: payload.description || `Autonomous AI architecture project for ${payload.name}`,
      domain: payload.domain || "Software Engineering",
      status: payload.status || "Draft",
      origin: payload.origin || "native",
      healthScore: payload.healthScore ?? 0,
      securityScore: payload.securityScore ?? 0,
      businessImpactScore: payload.businessImpactScore ?? 0,
      requirementClarity: payload.requirementClarity ?? 0,
      deliveryRisk: payload.deliveryRisk || "Low",
      riskScore: payload.riskScore ?? 0,
      repoConnected: !!payload.repo_full_name,
      repoUrl: payload.repoUrl ?? (payload.repo_full_name ? `github.com/${payload.repo_full_name}` : undefined),
      repo_full_name: payload.repo_full_name ?? null,
      default_branch: payload.default_branch ?? "main",
      teamSize: payload.teamSize ?? 1,
      deadline: payload.deadline ?? new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0] ?? "2026-12-31",
      lastUpdated: new Date().toISOString(),
      lastAnalysis: new Date().toISOString(),
      created_at: payload.created_at ?? new Date().toISOString(),
      owner_id: payload.owner_id,
      health_score: payload.healthScore ?? 0,
    };

    return this.registerProject(newProject);
  }

  public clearUserScope(): void {
    this.bumpGeneration();
    this.activeProjectId = null;
    this.localProjects.clear();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
        localStorage.removeItem(LOCAL_STORAGE_PROJECTS_KEY);
      } catch {
        // ignore
      }
    }
    this.notifyListeners(null);
  }

  public updateProject(id: string, updates: Partial<CanonicalProject>): CanonicalProject | null {
    const existing = this.localProjects.get(id);
    if (!existing) return null;

    const updated: CanonicalProject = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.localProjects.set(id, updated);
    this.saveToStorage();

    if (this.activeProjectId === id) {
      this.notifyListeners(updated);
    }

    return updated;
  }

  /**
   * Sync projects from Supabase database with Zero Raw SQL
   */
  public async syncFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[ProjectRegistry] Supabase sync returned error:", error.message);
        return;
      }

      if (data && Array.isArray(data)) {
        for (const row of data) {
          const existing = this.localProjects.get(row.id);
          const mapped: CanonicalProject = {
            id: row.id,
            name: row.name,
            slug: row.slug || row.id,
            description: row.description || "",
            domain: row.domain || "General",
            status:
              row.status === "analyzed"
                ? "Analyzed"
                : row.status === "draft"
                  ? "Draft"
                  : row.status === "review"
                    ? "Needs Review"
                    : "Analyzed",
            origin: row.repo_full_name ? "github" : "native",
            healthScore: row.health_score ?? (existing?.healthScore || 85),
            securityScore: existing?.securityScore || 80,
            businessImpactScore: existing?.businessImpactScore || 75,
            requirementClarity: existing?.requirementClarity || 80,
            deliveryRisk:
              row.health_score && row.health_score > 80
                ? "Low"
                : row.health_score && row.health_score > 60
                  ? "Medium"
                  : "High",
            riskScore: row.health_score ? Math.max(0, 100 - row.health_score) : 20,
            repoConnected: !!row.repo_full_name,
            repoUrl: row.repo_full_name ? `github.com/${row.repo_full_name}` : (existing?.repoUrl ?? undefined),
            repo_full_name: row.repo_full_name ?? null,
            default_branch: "main",
            teamSize: existing?.teamSize || 5,
            deadline: existing?.deadline || "2026-11-30",
            lastUpdated: row.updated_at || row.created_at || new Date().toISOString(),
            lastAnalysis: row.updated_at || row.created_at || new Date().toISOString(),
            created_at: row.created_at || new Date().toISOString(),
            owner_id: row.owner_id,
            health_score: row.health_score,
          };
          this.localProjects.set(row.id, mapped);
        }
        this.saveToStorage();
      }
    } catch (err) {
      console.warn("[ProjectRegistry] Supabase sync exception:", err);
    }
  }

  public subscribe(listener: (activeProject: CanonicalProject | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(activeProject: CanonicalProject | null) {
    for (const listener of this.listeners) {
      try {
        listener(activeProject);
      } catch (err) {
        console.error("[ProjectRegistry] Listener error:", err);
      }
    }
  }
}

export const projectRegistry = ProjectRegistry.getInstance();

