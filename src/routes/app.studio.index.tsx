import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Code2,
  FileBarChart2,
  FileCode,
  FolderKanban,
  Github,
  Image,
  Layers,
  Mic,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard, StatCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { projects } from "@/lib/mock-data";

export const Route = createFileRoute("/app/studio/")({
  head: () => ({
    meta: [
      { title: "BRAHMA AI Studio — Command Center" },
      {
        name: "description",
        content: "AI-driven software blueprint, code editing, and publishing hub.",
      },
    ],
  }),
  component: StudioDashboard,
});

function StudioDashboard() {
  const [prompt, setPrompt] = useState("");

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 15) {
      toast.error("Please enter a more descriptive prompt (minimum 15 characters).");
      return;
    }
    toast.success("Initializing blueprint session...", {
      description: "Redirecting you to the studio creation deck.",
    });
    // Redirect to create page with prefilled prompt via search query parameter
    window.location.href = `/app/studio/create?prompt=${encodeURIComponent(prompt)}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brahma AI Studio"
        description="Design, test, verify, and publish production-ready software using AI blueprints."
      />

      {/* Prompts Section */}
      <Card className="surface overflow-hidden border-primary/20 bg-primary/4 relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden="true"
        />
        <CardContent className="pt-6 relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Prompt to Software Blueprint</h2>
              <p className="text-xs text-muted-foreground">
                Describe your software idea and BRAHMA will blueprint it.
              </p>
            </div>
          </div>

          <form onSubmit={handlePromptSubmit} className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="e.g. Build an AI-driven smart classroom attendance system using face recognition..."
                className="pl-9 bg-background/50 border-primary/10 focus-visible:ring-primary/40"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground"
            >
              Generate Blueprint <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/create">
            <PlusCircle className="size-5 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold">Prompt Builder</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/templates">
            <Layers className="size-5 text-indigo-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Use Template</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/import" search={{ tab: "github" }}>
            <Github className="size-5 text-zinc-300" aria-hidden="true" />
            <span className="text-xs font-semibold">GitHub Import</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/import" search={{ tab: "figma" }}>
            <FileCode className="size-5 text-rose-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Figma Import</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/import" search={{ tab: "srs" }}>
            <UploadCloud className="size-5 text-sky-400" aria-hidden="true" />
            <span className="text-xs font-semibold">SRS/PDF</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/import" search={{ tab: "screenshot" }}>
            <Image className="size-5 text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Screenshot</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-auto flex-col gap-2 py-4 border-primary/10 hover:border-primary/40"
        >
          <Link to="/app/studio/import" search={{ tab: "voice" }}>
            <Mic className="size-5 text-amber-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Voice Input</span>
          </Link>
        </Button>
      </div>

      {/* Goal-Driven Recommended Templates */}
      <div className="rounded-xl border border-primary/25 bg-zinc-950/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Recommended for Your Goals
            </span>
          </div>
          <Link
            to="/app/studio/templates"
            className="text-xs text-primary hover:underline font-semibold"
          >
            Browse all 12 templates &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "PCI-DSS Payment Orchestrator",
              domain: "FinTech & Payments",
              stack: "TypeScript + PostgreSQL + Redis",
              gates: "5/5 Gates Passed",
            },
            {
              title: "HIPAA Telemetry FHIR Engine",
              domain: "Healthcare",
              stack: "Go + TimescaleDB + Kafka",
              gates: "0 Critical CVEs",
            },
            {
              title: "Smart Classroom Vision & Attendance",
              domain: "EdTech & IoT",
              stack: "Python + OpenCV + FastAPI",
              gates: "100% Traceability",
            },
          ].map((rec) => (
            <div
              key={rec.title}
              onClick={() => {
                window.location.href = `/app/studio/create?prompt=${encodeURIComponent(rec.title)}`;
              }}
              className="rounded-lg border border-border/70 bg-secondary/20 p-3 hover:border-primary/50 hover:bg-secondary/40 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-primary font-semibold">{rec.domain}</span>
                <span className="text-[var(--success)] font-mono">{rec.gates}</span>
              </div>
              <p className="text-xs font-bold text-foreground">{rec.title}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{rec.stack}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Studio projects" value={projects.length} icon={FolderKanban} />
        <StatCard
          label="Avg. health score"
          value="84"
          tone="success"
          icon={Activity}
          hint="Composite score"
        />
        <StatCard
          label="Security risk"
          value="Low"
          tone="success"
          icon={ShieldCheck}
          hint="0 critical issues"
        />
        <StatCard
          label="Publish readiness"
          value="92%"
          tone="success"
          icon={TrendingUp}
          hint="7 gates validation"
        />
        <StatCard label="Reports generated" value="18" icon={FileBarChart2} hint="This month" />
      </div>

      {/* Recent Workspaces Grid */}
      <SectionCard
        title="Recent Studio Workspaces"
        description="Quick access to active engineering sessions."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card
              key={p.id}
              className="surface transition-all hover:border-primary/40 hover:bg-secondary/10"
            >
              <CardContent className="pt-4 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-mono">
                      {p.domain}
                    </span>
                    <span className="flex size-2 rounded-full bg-[var(--success)]" />
                  </div>
                  <h3 className="text-sm font-semibold truncate text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
                  <span className="text-muted-foreground">Clarity: {p.requirementClarity}%</span>
                  <Button asChild size="sm" variant="ghost" className="h-6 px-2 text-primary">
                    <Link to="/app/studio/$id/editor" params={{ id: p.id }}>
                      Open Studio <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
