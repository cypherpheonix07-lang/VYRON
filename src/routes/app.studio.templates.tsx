import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  HeartPulse,
  Laptop,
  Layers,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/app/studio/templates")({
  head: () => ({
    meta: [
      { title: "Template Gallery — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Choose a preconfigured template to build your software blueprint.",
      },
    ],
  }),
  component: TemplateGalleryPage,
});

const templates = [
  {
    id: "ai-saas",
    title: "AI SaaS Dashboard",
    desc: "A metrics-heavy workspace with LLM api integration, usage limits, and Stripe checkout billing.",
    difficulty: "Advanced" as const,
    buildTime: "12 mins",
    modules: ["Authentication", "FastAPI Backend", "Stripe Billing", "Gemini API Proxy"],
    tech: ["React", "FastAPI", "PostgreSQL", "Tailwind"],
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "college-final",
    title: "College Final-Year Project",
    desc: "Evaluation dashboard with student submission portals, grader panels, and PDF rubric summary generation.",
    difficulty: "Beginner" as const,
    buildTime: "6 mins",
    modules: ["Submission Queue", "Academic Audit Log", "Grading Rules", "PDF Summaries"],
    tech: ["Next.js", "Node.js", "SQLite", "Shadcn UI"],
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    id: "ecommerce-admin",
    title: "E-commerce Admin Console",
    desc: "Real-time inventory trackers, order status monitors, and daily settlement batch reconciliation outputs.",
    difficulty: "Intermediate" as const,
    buildTime: "8 mins",
    modules: ["Inventory Catalog", "Refund Pipeline", "CSV settlement", "Auth Toggles"],
    tech: ["React", "Express", "MongoDB", "Tailwind CSS"],
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "healthcare-booking",
    title: "Healthcare Booking System",
    desc: "Appointment schedulers, doctor schedule allocations, and encrypted email notification logs.",
    difficulty: "Advanced" as const,
    buildTime: "14 mins",
    modules: ["Booking Engine", "Notifications Channel", "Encrypted storage", "Audit Ledger"],
    tech: ["React + Python", "FastAPI", "PostgreSQL", "Redis"],
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    id: "logistics-tracker",
    title: "Logistics Tracker & Dispatcher",
    desc: "Live transport shipment logs, truck dispatch schedules, and historical delivery delay predictions.",
    difficulty: "Intermediate" as const,
    buildTime: "9 mins",
    modules: ["Shipment logs", "Delay AI Model", "Worker Queue", "Google Maps SDK"],
    tech: ["Next.js", "Python", "PostgreSQL", "FastAPI"],
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "smart-campus",
    title: "Smart Campus Portal",
    desc: "Timetable sync, classroom availability boards, and face recognition check-in diagnostic logs.",
    difficulty: "Intermediate" as const,
    buildTime: "10 mins",
    modules: ["Attendance Capture", "Timetable Sync", "Admin Analytics", "Reports PDF"],
    tech: ["React PWA", "Node.js", "MongoDB", "Express"],
    color: "from-sky-500/20 to-indigo-500/20",
  },
  {
    id: "iot-monitor",
    title: "IoT Monitoring Dashboard",
    desc: "Connected sensor telemetry widgets, threshold anomaly alert rules, and device list logs.",
    difficulty: "Advanced" as const,
    buildTime: "15 mins",
    modules: ["Telemetry Logs", "Anomaly Detector", "Webhooks channel", "Postgres Timescale"],
    tech: ["React + Node", "InfluxDB", "Fastify", "Tailwind"],
    color: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    id: "api-microservice",
    title: "API Microservice Gate",
    desc: "Secure rate-limited token gateway, client key generation, and compliance audit trail exports.",
    difficulty: "Advanced" as const,
    buildTime: "11 mins",
    modules: ["OAuth Gate", "Client Credentials", "Audit Log Table", "Redis rate-limiter"],
    tech: ["Fastify + Typescript", "Redis", "Postgres", "Docker"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "internal-tool",
    title: "Internal Business Tool",
    desc: "Clean customer feedback lists, support request escalations, and SLA performance charts.",
    difficulty: "Beginner" as const,
    buildTime: "5 mins",
    modules: ["Feedback Form", "SLA Escalator", "Analytics Dashboard", "Slack Integration"],
    tech: ["React", "Express", "SQLite", "Tailwind CSS"],
    color: "from-slate-500/20 to-zinc-500/20",
  },
  {
    id: "ai-agent-platform",
    title: "AI Agent Platform",
    desc: "Custom agent prompt selectors, tool action nodes, and live token cost monitoring charts.",
    difficulty: "Advanced" as const,
    buildTime: "13 mins",
    modules: [
      "Agent Engine",
      "Tool Execution Map",
      "Execution Metrics Counter",
      "Gemini/Claude Proxies",
    ],
    tech: ["Next.js + Python", "FastAPI", "PostgreSQL", "Redis"],
    color: "from-emerald-500/20 to-indigo-500/20",
  },
];

function TemplateGalleryPage() {
  const navigate = useNavigate();

  const handleUseTemplate = (title: string) => {
    toast.success("Template selected", {
      description: `Loading pre-configured blueprint for ${title}...`,
    });
    // Redirect to the generation page using the mock project ID "brahma-core"
    navigate({ to: "/app/studio/$id/generate", params: { id: "brahma-core" } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Gallery"
        description="Launch your workspace with specialized pre-configured blueprints designed for popular software solutions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className="surface flex flex-col justify-between overflow-hidden transition-all hover:border-primary/40"
          >
            <div className="space-y-3">
              {/* Card visual header */}
              <div
                className={`h-28 bg-gradient-to-br ${tpl.color} border-b border-border/60 relative flex items-center justify-center p-4`}
              >
                <Layers className="size-8 text-primary/60 shrink-0" aria-hidden="true" />
                <Badge
                  variant="secondary"
                  className="absolute top-3 right-3 rounded-full text-[10px]"
                >
                  Build: {tpl.buildTime}
                </Badge>
              </div>

              <div className="px-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold truncate text-foreground">{tpl.title}</h3>
                  <Badge
                    variant="outline"
                    className={`rounded-full text-[9px] ${
                      tpl.difficulty === "Beginner" &&
                      "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]"
                    } ${
                      tpl.difficulty === "Intermediate" &&
                      "border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--warning)]"
                    } ${
                      tpl.difficulty === "Advanced" &&
                      "border-[oklch(0.7_0.19_45)] bg-[oklch(0.7_0.19_45)]/10 text-[oklch(0.78_0.17_55)]"
                    }`}
                  >
                    {tpl.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {tpl.desc}
                </p>

                {/* Modules list preview */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-muted-foreground font-semibold block">
                    Included Modules:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tpl.modules.map((m) => (
                      <Badge
                        key={m}
                        variant="outline"
                        className="rounded-full text-[8px] px-1.5 py-0"
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-border/50 mt-4 flex items-center justify-between">
              {/* Tech Stack icons */}
              <div className="flex items-center gap-1">
                {tpl.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[8px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => handleUseTemplate(tpl.title)}
                className="h-7 text-xs bg-primary hover:bg-primary/95 text-primary-foreground"
              >
                Use <ArrowRight className="ml-1 size-3 shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
