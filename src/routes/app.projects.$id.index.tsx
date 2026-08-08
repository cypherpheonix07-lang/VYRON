import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, GitBranch, Network, Play } from "lucide-react";
import { toast } from "sonner";

import { ScoreGauge, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { getProject } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/")({
  head: () => ({
    meta: [
      { title: "Project overview — PROJECT BRAHMA" },
      { name: "description", content: "Health, security, delivery risk and business impact scores for this project." },
      { property: "og:title", content: "Project overview — PROJECT BRAHMA" },
      { property: "og:description", content: "One view of blueprint quality and engineering risk." },
    ],
  }),
  component: OverviewTab,
});

function OverviewTab() {
  const { id } = Route.useParams();
  const p = getProject(id);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard title="Overall health" description={`Last analysis: ${p.lastAnalysis}`}>
          <div className="flex justify-center py-2">
            <ScoreGauge value={p.healthScore} sublabel="of 100" label="Composite health score" />
          </div>
        </SectionCard>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Security score" value={p.securityScore} tone="critical" hint="2 critical findings" />
          <StatCard label="Delivery risk" value={p.deliveryRisk} tone="warning" hint={`Risk score ${p.riskScore}`} />
          <StatCard label="Business impact" value={p.businessImpactScore} tone="info" hint="Weighted module impact" />
          <StatCard label="Requirement clarity" value={`${p.requirementClarity}%`} tone="success" hint="Across 9 extracted sets" />
          <StatCard label="Team size" value={p.teamSize} hint={`Deadline ${p.deadline}`} />
          <StatCard
            label="Repository"
            value={p.repoConnected ? "Connected" : "Not connected"}
            hint={p.repoUrl ?? "Connect to enable code analysis"}
          />
        </div>
      </div>

      <SectionCard title="Quick actions" description="Re-run analysis or share results with reviewers.">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success("Analysis queued", { description: "You'll be notified when it completes." })}>
            <Play className="size-4" aria-hidden /> Run analysis
          </Button>
          <Button variant="outline" onClick={() => toast.success("Export started", { description: "Executive summary PDF is being prepared." })}>
            <Download className="size-4" aria-hidden /> Export report
          </Button>
          <Button variant="outline" onClick={() => toast.info("GitHub connection is mocked in this build")}>
            <GitBranch className="size-4" aria-hidden /> Connect repository
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/projects/$id/blueprint" params={{ id }}>
              <Network className="size-4" aria-hidden /> View blueprint
            </Link>
          </Button>
        </div>
      </SectionCard>
    </>
  );
}
