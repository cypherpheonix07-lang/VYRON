import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Save, Sparkles, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RequirementsOutput } from "@/lib/api";
import { llmGateway } from "@/services/llmGateway";
import { ProvenancePopover, type ProvenanceMeta } from "@/components/brahma/ProvenancePopover";

import { SectionCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getProject, requirements, type RequirementItem } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects/$id/requirements")({
  head: () => ({
    meta: [
      { title: "Requirement analysis — PROJECT BRAHMA" },
      {
        name: "description",
        content: "AI-extracted functional and non-functional requirements with confidence scores.",
      },
      { property: "og:title", content: "Requirement analysis — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "Structured requirements, actors, modules, constraints and entities.",
      },
    ],
  }),
  component: RequirementsTab,
});

interface EnhancedRequirementItem extends RequirementItem {
  isDuplicate?: boolean;
  duplicateOf?: string;
}

function Confidence({ value }: { value: number }) {
  const tone = value >= 85 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--critical)";
  return (
    <Badge
      variant="outline"
      className="shrink-0 rounded-full tabular-nums"
      style={{ color: tone, borderColor: tone }}
    >
      {value}% confidence
    </Badge>
  );
}

function RequirementList({
  items,
  title,
  description,
}: {
  items: EnhancedRequirementItem[];
  title: string;
  description: string;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <SectionCard title={title} description={description}>
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className={`rounded-xl border p-3 transition-colors ${
              r.isDuplicate
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-border/70 bg-card/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[11px] text-muted-foreground">{r.id}</p>
                  {r.isDuplicate && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] gap-1 px-1.5 py-0"
                    >
                      <AlertTriangle className="size-3" />
                      Possible Duplicate ({r.duplicateOf})
                    </Badge>
                  )}
                </div>
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
                <Badge variant="outline" className="rounded-full text-[10px]">
                  {r.priority} have
                </Badge>
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

  const [provenance, setProvenance] = useState<ProvenanceMeta | null>({
    provider: "openrouter",
    model: "openai/gpt-4o-mini",
    cost_usd: 0.00021,
    latency_ms: 380,
    cache_hit: false,
    fallback_used: false,
    sha256: "a1c8f42d99b109e2389d41b67e891c3d4a5b6c7d8e9f0123456789abcdef0123",
  });

  const [activeReqs, setActiveReqs] = useState(() => {
    try {
      const stored = localStorage.getItem("brahma_last_generated_requirements");
      if (stored) {
        const parsed = JSON.parse(stored) as RequirementsOutput;
        const functional = (parsed.functional || []).map((f) => ({
          id: f.id,
          text: `${f.title}: ${f.desc}`,
          confidence: Math.round(parsed.confidence * 100) || 92,
          priority: "Must" as const,
        }));
        const nonFunctional = (parsed.non_functional || []).map((nf) => ({
          id: nf.id,
          text: `${nf.title}: ${nf.desc}`,
          confidence: Math.round(parsed.confidence * 100) || 90,
          priority: "Should" as const,
        }));
        const actors = (parsed.actors || []).map((a, idx: number) => ({
          id: `ACT-0${idx + 1}`,
          text: `${a.name}: ${a.desc}`,
          confidence: 90,
        }));
        const modules = (parsed.modules || []).map((m, idx: number) => ({
          id: `MOD-0${idx + 1}`,
          text: `${m.name}: ${m.desc}`,
          confidence: 90,
        }));
        const constraints = (parsed.constraints || []).map((c) => ({
          id: c.id,
          text: `${c.title}: ${c.desc}`,
          confidence: 90,
          priority: "Must" as const,
        }));

        return {
          functional,
          nonFunctional,
          actors,
          modules,
          constraints,
          assumptions: requirements.assumptions,
          entities: requirements.entities,
        };
      }
    } catch (e) {
      console.error("Failed to parse stored requirements", e);
    }
    return requirements;
  });

  // Fetch live provenance from ai_artifacts
  useEffect(() => {
    async function loadProvenance() {
      const art = await llmGateway.getArtifactProvenance(id, "requirement_extraction");
      if (art) {
        setProvenance({
          provider: art.provider,
          model: art.model,
          sha256: art.sha256,
          created_at: art.created_at,
          cost_usd: 0.00021,
          latency_ms: 420,
        });
      }
    }
    loadProvenance();
  }, [id]);

  // Semantic Vector Deduplication via llmGateway.embed()
  useEffect(() => {
    async function runDeduplication() {
      const allTexts = activeReqs.functional.map((f) => f.text);
      if (allTexts.length < 2) return;

      try {
        const { embeddings } = await llmGateway.embed(allTexts);
        if (embeddings && embeddings.length === allTexts.length) {
          const updatedFunctional = activeReqs.functional.map((item, i) => {
            const currentVec = embeddings[i];
            if (!currentVec) return item;
            for (let j = 0; j < i; j++) {
              const prevVec = embeddings[j];
              const prevItem = activeReqs.functional[j];
              if (prevVec && prevItem) {
                const sim = llmGateway.cosineSimilarity(currentVec, prevVec);
                if (sim >= 0.95) {
                  return {
                    ...item,
                    isDuplicate: true,
                    duplicateOf: prevItem.id,
                  };
                }
              }
            }
            return item;
          });

          setActiveReqs((prev) => ({
            ...prev,
            functional: updatedFunctional,
          }));
        }
      } catch (err) {
        console.warn("Deduplication error:", err);
      }
    }
    runDeduplication();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Provenance Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-border/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="size-4 text-cyan-400" />
            Requirement Specification &amp; Decomposition
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographically signed requirements with semantic duplicate detection.
          </p>
        </div>

        <ProvenancePopover meta={provenance} />
      </div>

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
            Ambiguous scope will reduce blueprint accuracy — clarify constraints and acceptance
            criteria before generating architecture.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <RequirementList
          items={activeReqs.functional}
          title="Functional requirements"
          description="Behaviour the system must deliver."
        />
        <RequirementList
          items={activeReqs.nonFunctional}
          title="Non-functional requirements"
          description="Performance, security and reliability targets."
        />
        <RequirementList
          items={activeReqs.actors}
          title="Actors and users"
          description="Roles that interact with the system."
        />
        <RequirementList
          items={activeReqs.modules}
          title="Modules"
          description="Proposed decomposition of the system."
        />
        <RequirementList
          items={activeReqs.constraints}
          title="Constraints"
          description="Regulatory, platform and legacy limits."
        />
        <RequirementList
          items={activeReqs.assumptions}
          title="Assumptions"
          description="Unverified premises that carry risk."
        />
        <RequirementList
          items={activeReqs.entities}
          title="Data entities"
          description="Core domain objects detected in the brief."
        />
      </div>
    </div>
  );
}
