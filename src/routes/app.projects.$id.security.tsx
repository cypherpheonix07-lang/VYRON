import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

import { EmptyState, ErrorState, RiskBadge, ScoreGauge, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProject, remediationChecklist, vulnerabilities } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/security")({
  head: () => ({
    meta: [
      { title: "Security analysis — PROJECT BRAHMA" },
      { name: "description", content: "Vulnerability findings with CWE references, severity and remediation guidance." },
      { property: "og:title", content: "Security analysis — PROJECT BRAHMA" },
      { property: "og:description", content: "Critical, high, medium and low findings with a remediation checklist." },
    ],
  }),
  component: SecurityTab,
});

function SecurityTab() {
  const { id } = Route.useParams();
  const p = getProject(id);
  const [state, setState] = useState<"loaded" | "clean" | "error">("loaded");
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(remediationChecklist.map((r) => [r.id, r.done])),
  );

  const counts = {
    Critical: vulnerabilities.filter((v) => v.severity === "Critical").length,
    High: vulnerabilities.filter((v) => v.severity === "High").length,
    Medium: vulnerabilities.filter((v) => v.severity === "Medium").length,
    Low: vulnerabilities.filter((v) => v.severity === "Low").length,
  };

  return (
    <>
      <div className="flex justify-end">
        <Tabs value={state} onValueChange={(v) => setState(v as typeof state)}>
          <TabsList aria-label="Preview security states">
            <TabsTrigger value="loaded">Findings</TabsTrigger>
            <TabsTrigger value="clean">No findings</TabsTrigger>
            <TabsTrigger value="error">Scan failed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {state === "error" ? (
        <ErrorState
          title="Security analysis failed"
          description="The scanner timed out after three attempts while cloning the repository."
          onRetry={() => setState("loaded")}
        />
      ) : state === "clean" ? (
        <EmptyState
          icon={ShieldCheck}
          title="No vulnerabilities found"
          description="The latest scan found no findings above the informational threshold. Re-run after your next merge."
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <SectionCard title="Security score" description="Weighted by severity and exploitability.">
              <div className="flex justify-center py-2">
                <ScoreGauge value={p.securityScore} sublabel="of 100" />
              </div>
            </SectionCard>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Critical" value={counts.Critical} tone="critical" hint="Block release" />
              <StatCard label="High" value={counts.High} tone="critical" hint="Fix this sprint" />
              <StatCard label="Medium" value={counts.Medium} tone="warning" hint="Schedule" />
              <StatCard label="Low" value={counts.Low} tone="success" hint="Backlog" />
            </div>
          </div>

          <SectionCard title="Vulnerability findings" description="Static analysis and dependency scan results.">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Finding</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="hidden sm:table-cell">CWE</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vulnerabilities.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="max-w-[260px]">
                        <p className="font-medium">{v.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{v.description}</p>
                      </TableCell>
                      <TableCell><RiskBadge level={v.severity} /></TableCell>
                      <TableCell className="hidden font-mono text-xs sm:table-cell">{v.cwe}</TableCell>
                      <TableCell className="hidden max-w-[220px] truncate font-mono text-xs text-muted-foreground md:table-cell">{v.location}</TableCell>
                      <TableCell className="hidden max-w-[320px] text-xs text-muted-foreground lg:table-cell">{v.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>

          <SectionCard title="Remediation checklist" description="Track fixes before the release candidate.">
            <ul className="space-y-3">
              {remediationChecklist.map((r) => (
                <li key={r.id} className="flex items-start gap-3">
                  <Checkbox
                    id={r.id}
                    checked={!!checked[r.id]}
                    onCheckedChange={(v) => setChecked((c) => ({ ...c, [r.id]: !!v }))}
                  />
                  <label htmlFor={r.id} className="min-w-0 text-sm">
                    <span className={checked[r.id] ? "text-muted-foreground line-through" : ""}>{r.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{r.owner}</span>
                  </label>
                </li>
              ))}
            </ul>
          </SectionCard>
        </>
      )}
    </>
  );
}
