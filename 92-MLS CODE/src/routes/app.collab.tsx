import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDomainView } from "@/components/common/EnterpriseDomainView";
import { Users } from "lucide-react";

export const Route = createFileRoute("/app/collab")({
  head: () => ({
    meta: [{ title: "Team Collaboration & Peer Review Space — VYRON" }],
  }),
  component: CollaborationRoute,
});

function CollaborationRoute() {
  return (
    <EnterpriseDomainView
      domainId="collab"
      domainTitle="Team Collaboration & Peer Review Space"
      domainSubtitle="Cross-functional architecture peer reviews, shared team workspaces, project wiki documentation, and RBAC matrix."
      badgeLabel="WORKSPACE COLLABORATION"
      icon={Users}
      actionButtonLabel="Start Architecture Review"
      metrics={[
        { label: "Active Reviewers", value: "14 Engineers", change: "+2", status: "good" },
        { label: "Pending Sign-offs", value: "3 In-Flight", change: "On Track", status: "good" },
        { label: "Avg Review Time", value: "4.2 Hours", change: "-1.1h", status: "good" },
        { label: "Knowledge Docs", value: "128 Pages", change: "+8", status: "good" },
      ]}
      entities={[
        {
          id: "collab-rfcs",
          name: "Architecture Decision Records (ADRs)",
          status: "Under Review",
          description: "Formal Request for Comments (RFCs) evaluating state management and multi-tenant database partitioning.",
          tags: ["ADR", "RFC", "Architecture", "Review"],
          metrics: { Accepted: "42", Proposed: "3", Superseded: "4" },
        },
        {
          id: "collab-wiki-kb",
          name: "Engineering Knowledge Hub",
          status: "Updated",
          description: "Living markdown documentation synchronizing coding standards, API conventions, and onboarding guides.",
          tags: ["Wiki", "Docs", "Onboarding", "Markdown"],
          metrics: { Contributors: "12", SearchIndexed: "100%", Freshness: "Today" },
        },
        {
          id: "collab-rbac-matrix",
          name: "Role-Based Access Control (RBAC) Matrix",
          status: "Enforced",
          description: "Maps granular permissions across Principal Architect, Senior Developer, QA Lead, and Guest roles.",
          tags: ["RBAC", "IAM", "Security", "Roles"],
          metrics: { ActiveRoles: "4", Policies: "28", Violations: "0" },
        },
      ]}
    />
  );
}
