/**
 * VYRON — P44: ENTERPRISE MULTI-ORG, WORKSPACE & RBAC PRODUCTIZATION
 * Enterprise hierarchy management (Org -> Workspace -> Team -> Project),
 * tenancy validation, and workspace boundary fences.
 * Strictly ZERO operational raw SQL.
 */

export interface EnterpriseOrg {
  id: string;
  name: string;
  domain: string;
  tier: "ENTERPRISE_PREMIUM" | "ENTERPRISE_CORE";
}

export interface EnterpriseWorkspace {
  id: string;
  orgId: string;
  name: string;
  isDemoWorkspace: boolean;
  assignedProjectIds: string[];
}

export class EnterpriseOrgEngine {
  private static readonly ORGS: EnterpriseOrg[] = [
    {
      id: "org-vyron-global",
      name: "Global Engineering Enterprises",
      domain: "engineering.global",
      tier: "ENTERPRISE_PREMIUM"
    }
  ];

  private static readonly WORKSPACES: EnterpriseWorkspace[] = [
    {
      id: "ws-demo-sandbox",
      orgId: "org-vyron-global",
      name: "Demo Sandbox Workspace",
      isDemoWorkspace: true,
      assignedProjectIds: ["proj-demo-ecommerce", "proj-demo-billing"]
    },
    {
      id: "ws-production-main",
      orgId: "org-vyron-global",
      name: "Production Engineering Control Plane",
      isDemoWorkspace: false,
      assignedProjectIds: ["proj-prod-core", "proj-prod-api"]
    }
  ];

  public static getWorkspaces(orgId: string): EnterpriseWorkspace[] {
    return this.WORKSPACES.filter((w) => w.orgId === orgId);
  }

  public static validateWorkspaceBoundary(
    workspaceId: string,
    projectId: string
  ): { isAllowed: boolean; reason: string } {
    const ws = this.WORKSPACES.find((w) => w.id === workspaceId);
    if (!ws) {
      return { isAllowed: false, reason: `Workspace ${workspaceId} not found.` };
    }

    const hasProject = ws.assignedProjectIds.includes(projectId);
    return {
      isAllowed: hasProject,
      reason: hasProject
        ? "Project belongs to authorized workspace namespace."
        : `Project ${projectId} not assigned to workspace ${ws.name}. Access blocked.`
    };
  }
}
