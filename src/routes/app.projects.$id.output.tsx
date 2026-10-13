/**
 * PROJECT BRAHMA / VYRON — PROJECT OUTPUT & APPROVAL ROUTE
 * Destination: /app/projects/:id/output
 *
 * Dedicated delivery destination after Section 20 (Blueprint):
 * - Candidate package manifests across all 20 lifecycle sections
 * - Side-by-side difference reviews against accepted baselines
 * - Exact-version approval commits with HMAC-SHA256 evidence seals
 *
 * Strictly ZERO Raw SQL.
 */

import { createFileRoute } from "@tanstack/react-router";
import { ProjectOutputApprovalView } from "@/components/outputApproval/ProjectOutputApprovalView";

export const Route = createFileRoute("/app/projects/$id/output")({
  head: () => ({
    meta: [
      { title: "Project Output & Approval — VYRON" },
      {
        name: "description",
        content:
          "Final candidate delivery packages, difference review, and exact-version documentation approval.",
      },
      { property: "og:title", content: "Project Output & Approval — VYRON" },
      {
        property: "og:description",
        content:
          "Candidate package manifest across 20 lifecycle sections with cryptographic audit seals.",
      },
    ],
  }),
  component: OutputProjectRoute,
});

function OutputProjectRoute() {
  const { id } = Route.useParams();
  return <ProjectOutputApprovalView projectId={id} />;
}
