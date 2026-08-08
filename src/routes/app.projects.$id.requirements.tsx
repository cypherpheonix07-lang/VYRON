import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getProject, requirements, type RequirementItem } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/requirements")({
  head: () => ({
    meta: [
      { title: "Requirement analysis — PROJECT BRAHMA" },
      { name: "description", content: "AI-extracted functional and non-functional requirements with confidence scores." },
      { property: "og:title", content: "Requirement analysis — PROJECT BRAHMA" },
      { property: "og:description", content: "Structured requirements, actors, modules, constraints and entities." },
    ],
  }),
  component: RequirementsTab,
});

function Confidence({ value }: { value: number }) {
  const tone = value >= 85 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--critical)";
  return (
    <Badge variant="outline" className="shrink-0 rounded-full tabular-nums" style={{ color: tone, borderColor: tone }}>
      {value}% confidence
    </Badge>
  );
}

function RequirementList({ items, title, description }: { items: RequirementItem[]; title: string; description: string }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <SectionCard title={title} description={description}>
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="rounded-xl border border-border/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-muted-foreground">{r.id}</p>
                {editing === r.id ? (
                  <Textarea
                    className="mt-1.5 text-sm"
                    rows={3}
                    value={drafts[r.id] ?? r.text}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  />
                ) : (
                  <p className="mt-1 text-sm leading-relaxed">{drafts[r.id] ?? r.text}</p>
                )}
              </div>
              <Confidence value={r.confidence} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              {r.priority ? (
                <Badge variant="outline" className="rounded-full text-[10px]">{r.priority} have</Badge>
              ) : null}
              {editing === r.id ? (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditing(null);
                    toast.success("Requirement saved", { description: r.id });
                  }}
                >
                  <Save className="size-3.5" aria-hidden /> Save
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setEditing(r.id)}>
                  Edit
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function RequirementsTab() {
  const { id } = Route.useParams();
  const p = getProject(id);

  return (
    <>
      {p.requirementClarity < 70 ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-4 py-3 text-sm"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" aria-hidden />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">
              Requirement clarity is {p.requirementClarity}%.
            </span>{" "}
            Ambiguous scope will reduce blueprint accuracy — clarify constraints and acceptance criteria
            before generating architecture.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <RequirementList items={requirements.functional} title="Functional requirements" description="Behaviour the system must deliver." />
        <RequirementList items={requirements.nonFunctional} title="Non-functional requirements" description="Performance, security and reliability targets." />
        <RequirementList items={requirements.actors} title="Actors and users" description="Roles that interact with the system." />
        <RequirementList items={requirements.modules} title="Modules" description="Proposed decomposition of the system." />
        <RequirementList items={requirements.constraints} title="Constraints" description="Regulatory, platform and legacy limits." />
        <RequirementList items={requirements.assumptions} title="Assumptions" description="Unverified premises that carry risk." />
        <RequirementList items={requirements.entities} title="Data entities" description="Core domain objects detected in the brief." />
      </div>
    </>
  );
}
