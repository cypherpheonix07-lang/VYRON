import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, GitBranch, Network, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ScoreGauge, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { getProject } from "@/lib/mock-data";
import { runService } from "@/services/runs/runService";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useLiveProject } from "@/contexts/LiveProjectContext";

export const Route = createFileRoute("/app/projects/$id/")({
  head: () => ({
    meta: [
      { title: "Project overview — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Health, security, delivery risk and business impact scores for this project.",
      },
      { property: "og:title", content: "Project overview — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "One view of blueprint quality and engineering risk.",
      },
    ],
  }),
  component: OverviewTab,
});

function OverviewTab() {
  const { isDemoMode } = useDemoMode();
  return isDemoMode ? <DemoOverviewTab /> : <LiveOverviewTab />;
}

function LiveOverviewTab() {
  const { id } = Route.useParams();
  const { data, refresh, refreshing, realtime } = useLiveProject();
  if (!data) return null;
  const { project, repositories, requirementCount, warnings, fetchedAt } = data;
  const exportSnapshot = () => {
    const report = {
      kind: "database-overview-snapshot",
      ...data,
      limitations: [
        "Stored health is not a verified analysis result; existing schema defaults may be present.",
        "Security, delivery risk, business impact, requirement clarity and team metrics are not connected to verified producers.",
        "Repository binding is not proof of current provider access or completed code analysis.",
      ],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `project-${id}-database-snapshot.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <SectionCard title="Database overview" description={`Project ${id}`}>
        <p className="text-sm">Read from Supabase at {new Date(fetchedAt).toLocaleString()}.</p>
        <p className="mt-1 text-sm text-muted-foreground" role="status">{realtime}</p>
        <p className="mt-2 text-sm text-muted-foreground">This overview uses persisted records. Other workspace tabs have not yet been migrated or verified as live.</p>
        {warnings.length > 0 && <ul role="alert" className="mt-3 list-disc pl-5 text-sm text-amber-400">{warnings.map(w => <li key={w}>{w}</li>)}</ul>}
      </SectionCard>
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard title="Overall health" description="Verified analysis is not available">
          <p className="py-4 text-2xl font-semibold">Not assessed</p>
          <p className="text-sm text-muted-foreground">Stored database value: {project.health_score ?? "Not recorded"}. This field can contain a default and is not shown as a verified score.</p>
          <p className="mt-2 text-xs text-muted-foreground">Project record updated: {new Date(project.updated_at).toLocaleString()}</p>
        </SectionCard>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Security score" value="Not assessed" hint="No verified security result connected" />
          <StatCard label="Delivery risk" value="Not assessed" hint="No verified risk result connected" />
          <StatCard label="Business impact" value="Not assessed" hint="No evidence-backed impact metric connected" />
          <StatCard label="Requirements" value={requirementCount ?? "Unavailable"} hint="Persisted requirements; clarity is not assessed" />
          <StatCard label="Team size" value="Unavailable" hint="Membership source not configured for this overview" />
          <StatCard label="Repository bindings" value={repositories === null ? "Unavailable" : repositories.length === 0 ? "Not connected" : repositories.length}
            hint={repositories?.map(r => `${r.repo_full_name} (${r.sync_status})`).join(", ") || "Manage bindings in Integrations"} />
        </div>
      </div>
      <SectionCard title="Quick actions" description="Refresh and export real database records. Analysis requires a verified backend worker.">
        <div className="flex flex-wrap gap-2">
          <Button onClick={refresh} disabled={refreshing}><RefreshCw className="size-4" aria-hidden />{refreshing ? "Refreshing…" : "Refresh database"}</Button>
          <Button disabled title="The existing run adapter simulates execution; it is not used for live analysis."><Play className="size-4" aria-hidden />Analysis unavailable</Button>
          <Button variant="outline" onClick={exportSnapshot}><Download className="size-4" aria-hidden />Export database snapshot</Button>
          <Button asChild variant="outline"><Link to="/app/projects/$id/integrations" params={{ id }}><GitBranch className="size-4" aria-hidden />Manage repositories</Link></Button>
          <Button asChild variant="outline"><Link to="/app/projects/$id/blueprint" params={{ id }}><Network className="size-4" aria-hidden />View blueprint</Link></Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">No simulated run is dispatched in live mode. Export downloads JSON; it does not claim to generate an analysis PDF.</p>
      </SectionCard>
    </>
  );
}

function DemoOverviewTab() {
  const navigate = useNavigate();
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
          <StatCard
            label="Security score"
            value={p.securityScore}
            tone="critical"
            hint="2 critical findings"
          />
          <StatCard
            label="Delivery risk"
            value={p.deliveryRisk}
            tone="warning"
            hint={`Risk score ${p.riskScore}`}
          />
          <StatCard
            label="Business impact"
            value={p.businessImpactScore}
            tone="info"
            hint="Weighted module impact"
          />
          <StatCard
            label="Requirement clarity"
            value={`${p.requirementClarity}%`}
            tone="success"
            hint="Across 9 extracted sets"
          />
          <StatCard label="Team size" value={p.teamSize} hint={`Deadline ${p.deadline}`} />
          <StatCard
            label="Repository"
            value={p.repoConnected ? "Connected" : "Not connected"}
            hint={p.repoUrl ?? "Connect to enable code analysis"}
          />
        </div>
      </div>

      <SectionCard
        title="Quick actions"
        description="Re-run analysis or share results with reviewers."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={async () => {
              const run = await runService.createAndDispatchRun({
                projectId: id,
                operationType: "REPOSITORY_ANALYSIS",
                originItem: "Project Overview Action",
              });
              toast.success("Analysis dispatched", {
                description: `Durable run ${run.runId} initiated for this project.`,
              });
              navigate({
                to: "/app/projects/$id/results",
                params: { id },
                search: { runId: run.runId },
              });
            }}
          >
            <Play className="size-4" aria-hidden /> Run analysis
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Export started", {
                description: "Executive summary PDF is being prepared.",
              })
            }
          >
            <Download className="size-4" aria-hidden /> Export report
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("GitHub connection is mocked in this build")}
          >
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
