/**
 * VYRON — COMMAND CENTER STATE STORE (PHASE 02 & PHASE 03)
 * Shared interactive state model connecting all 12 command center intelligence surfaces.
 * Governs project, environment, branch, timeRange, userAuthority, selectedEntity,
 * focusedSurface, time-travel snapshots, and filters.
 * Strictly ZERO SQL.
 */

import { useState, useEffect } from "react";

export type Environment = "production" | "staging" | "dev" | "sandbox";
export type TimeRange = "1h" | "24h" | "7d" | "30d" | "90d" | "1y";
export type UserAuthority = "CHIEF_ARCHITECT" | "SECURITY_LEAD" | "RELEASE_ENGINEER" | "DEVELOPER";

export type EntityType =
  | "project"
  | "service"
  | "risk"
  | "anomaly"
  | "drift"
  | "gate"
  | "evidence"
  | "metric"
  | "node"
  | "adr"
  | "finding"
  | "health_point"
  | "readiness_stage"
  | "requirement"
  | "component"
  | "dependency"
  | "api"
  | "release"
  | "simulation"
  | "decision";

export interface SelectedEntity {
  type: EntityType;
  id: string;
  name: string;
  title?: string | undefined;
  severity?: ("CRITICAL" | "HIGH" | "MEDIUM" | "LOW") | undefined;
  status?: string | undefined;
  confidence?: number | undefined;
  timestamp?: string | undefined;
  category?: string | undefined;
  source?: string | undefined;
  details?: string | undefined;
  evidenceHash?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface InvestigationBreadcrumb {
  entity: SelectedEntity;
  originSurface: string;
  timestamp: string;
  query?: string | undefined;
}

export interface CommandCenterState {
  organization: string;
  selectedProjectId: string;
  environment: Environment;
  branch: string;
  architectureVersion: string;
  release: string;
  timeRange: TimeRange;
  userAuthority: UserAuthority;
  selectedEntity: SelectedEntity | null;
  focusedSurface: string | null;
  activeTimeTravelSnapshot: string | null;
  isDrawerOpen: boolean;
  investigationChain: InvestigationBreadcrumb[];
  activeOverlays: {
    deployments: boolean;
    commits: boolean;
    drift: boolean;
    incidents: boolean;
    security: boolean;
  };
  riskFilter: {
    severity?: string;
    category?: string;
  };
  signalFilter: {
    category?: string;
    severity?: string;
  };
  graphMode: string;
}

type CommandListener = (state: CommandCenterState) => void;

class CommandCenterStore {
  private state: CommandCenterState;
  private listeners: Set<CommandListener> = new Set();

  constructor() {
    this.state = {
      organization: "Aurora Labs / FinLedger Group",
      selectedProjectId: "brahma-core",
      environment: "production",
      branch: "main",
      architectureVersion: "v2.4.0",
      release: "REL-2026-09-PROD",
      timeRange: "30d",
      userAuthority: "CHIEF_ARCHITECT",
      selectedEntity: null,
      focusedSurface: null,
      activeTimeTravelSnapshot: null,
      isDrawerOpen: false,
      investigationChain: [],
      activeOverlays: {
        deployments: true,
        commits: true,
        drift: true,
        incidents: true,
        security: true,
      },
      riskFilter: {
        severity: "ALL",
        category: "ALL",
      },
      signalFilter: {
        category: "ALL",
        severity: "ALL",
      },
      graphMode: "ARCHITECTURE",
    };
  }

  public getState(): CommandCenterState {
    return this.state;
  }

  public setSelectedProject(projectId: string) {
    this.state = {
      ...this.state,
      selectedProjectId: projectId,
    };
    this.notify();
  }

  public setEnvironment(environment: Environment) {
    this.state = {
      ...this.state,
      environment,
    };
    this.notify();
  }

  public setBranch(branch: string) {
    this.state = {
      ...this.state,
      branch,
    };
    this.notify();
  }

  public setArchitectureVersion(version: string) {
    this.state = {
      ...this.state,
      architectureVersion: version,
    };
    this.notify();
  }

  public setTimeRange(timeRange: TimeRange) {
    this.state = {
      ...this.state,
      timeRange,
    };
    this.notify();
  }

  public setUserAuthority(authority: UserAuthority) {
    this.state = {
      ...this.state,
      userAuthority: authority,
    };
    this.notify();
  }

  public selectEntity(entity: SelectedEntity | null, openDrawer = true, originSurface = "dashboard") {
    let nextChain = this.state.investigationChain;
    if (entity) {
      const last = nextChain[nextChain.length - 1];
      if (!last || last.entity.id !== entity.id) {
        nextChain = [
          ...nextChain,
          {
            entity,
            originSurface,
            timestamp: new Date().toISOString(),
          },
        ];
      }
    }

    this.state = {
      ...this.state,
      selectedEntity: entity,
      isDrawerOpen: openDrawer ? entity !== null : this.state.isDrawerOpen,
      investigationChain: nextChain,
    };
    this.notify();
  }

  public pushInvestigation(entity: SelectedEntity, originSurface: string, query?: string) {
    const breadcrumb: InvestigationBreadcrumb = {
      entity,
      originSurface,
      timestamp: new Date().toISOString(),
      query,
    };
    this.state = {
      ...this.state,
      selectedEntity: entity,
      isDrawerOpen: true,
      focusedSurface: originSurface,
      investigationChain: [...this.state.investigationChain, breadcrumb],
    };
    this.notify();
  }

  public popInvestigation() {
    if (this.state.investigationChain.length <= 1) {
      this.state = {
        ...this.state,
        investigationChain: [],
        selectedEntity: null,
        isDrawerOpen: false,
      };
      this.notify();
      return;
    }
    const nextChain = this.state.investigationChain.slice(0, -1);
    const prevItem = nextChain[nextChain.length - 1];
    this.state = {
      ...this.state,
      investigationChain: nextChain,
      selectedEntity: prevItem ? prevItem.entity : null,
      isDrawerOpen: prevItem ? true : false,
      focusedSurface: prevItem ? prevItem.originSurface : null,
    };
    this.notify();
  }

  public clearInvestigationChain() {
    this.state = {
      ...this.state,
      investigationChain: [],
    };
    this.notify();
  }

  public closeDrawer() {
    this.state = {
      ...this.state,
      isDrawerOpen: false,
    };
    this.notify();
  }

  public openDrawer() {
    if (this.state.selectedEntity) {
      this.state = {
        ...this.state,
        isDrawerOpen: true,
      };
      this.notify();
    }
  }

  public setFocusedSurface(surface: string | null) {
    this.state = {
      ...this.state,
      focusedSurface: surface,
    };
    this.notify();
  }

  public setTimeTravelSnapshot(snapshotId: string | null) {
    this.state = {
      ...this.state,
      activeTimeTravelSnapshot: snapshotId,
    };
    this.notify();
  }

  public toggleOverlay(overlayKey: keyof CommandCenterState["activeOverlays"]) {
    this.state = {
      ...this.state,
      activeOverlays: {
        ...this.state.activeOverlays,
        [overlayKey]: !this.state.activeOverlays[overlayKey],
      },
    };
    this.notify();
  }

  public setRiskFilter(filter: Partial<CommandCenterState["riskFilter"]>) {
    this.state = {
      ...this.state,
      riskFilter: {
        ...this.state.riskFilter,
        ...filter,
      },
    };
    this.notify();
  }

  public setSignalFilter(filter: Partial<CommandCenterState["signalFilter"]>) {
    this.state = {
      ...this.state,
      signalFilter: {
        ...this.state.signalFilter,
        ...filter,
      },
    };
    this.notify();
  }

  public setGraphMode(graphMode: string) {
    this.state = {
      ...this.state,
      graphMode,
    };
    this.notify();
  }

  public resetState() {
    this.state = {
      organization: "Aurora Labs / FinLedger Group",
      selectedProjectId: "brahma-core",
      environment: "production",
      branch: "main",
      architectureVersion: "v2.4.0",
      release: "REL-2026-09-PROD",
      timeRange: "30d",
      userAuthority: "CHIEF_ARCHITECT",
      selectedEntity: null,
      focusedSurface: null,
      activeTimeTravelSnapshot: null,
      isDrawerOpen: false,
      investigationChain: [],
      activeOverlays: {
        deployments: true,
        commits: true,
        drift: true,
        incidents: true,
        security: true,
      },
      riskFilter: {
        severity: "ALL",
        category: "ALL",
      },
      signalFilter: {
        category: "ALL",
        severity: "ALL",
      },
      graphMode: "ARCHITECTURE",
    };
    this.notify();
  }

  public subscribe(listener: CommandListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const commandCenterStore = new CommandCenterStore();

export function useCommandCenter() {
  const [state, setState] = useState<CommandCenterState>(() => commandCenterStore.getState());

  useEffect(() => {
    return commandCenterStore.subscribe((next) => {
      setState(next);
    });
  }, []);

  return {
    ...state,
    setSelectedProject: (id: string) => commandCenterStore.setSelectedProject(id),
    setEnvironment: (env: Environment) => commandCenterStore.setEnvironment(env),
    setBranch: (branch: string) => commandCenterStore.setBranch(branch),
    setArchitectureVersion: (version: string) => commandCenterStore.setArchitectureVersion(version),
    setTimeRange: (range: TimeRange) => commandCenterStore.setTimeRange(range),
    setUserAuthority: (auth: UserAuthority) => commandCenterStore.setUserAuthority(auth),
    selectEntity: (entity: SelectedEntity | null, openDrawer?: boolean, originSurface?: string) =>
      commandCenterStore.selectEntity(entity, openDrawer, originSurface),
    pushInvestigation: (entity: SelectedEntity, originSurface: string, query?: string) =>
      commandCenterStore.pushInvestigation(entity, originSurface, query),
    popInvestigation: () => commandCenterStore.popInvestigation(),
    clearInvestigationChain: () => commandCenterStore.clearInvestigationChain(),
    closeDrawer: () => commandCenterStore.closeDrawer(),
    openDrawer: () => commandCenterStore.openDrawer(),
    setFocusedSurface: (surface: string | null) => commandCenterStore.setFocusedSurface(surface),
    setTimeTravelSnapshot: (snapId: string | null) => commandCenterStore.setTimeTravelSnapshot(snapId),
    toggleOverlay: (key: keyof CommandCenterState["activeOverlays"]) => commandCenterStore.toggleOverlay(key),
    setRiskFilter: (filter: Partial<CommandCenterState["riskFilter"]>) => commandCenterStore.setRiskFilter(filter),
    setSignalFilter: (filter: Partial<CommandCenterState["signalFilter"]>) => commandCenterStore.setSignalFilter(filter),
    setGraphMode: (mode: string) => commandCenterStore.setGraphMode(mode),
    resetState: () => commandCenterStore.resetState(),
  };
}
