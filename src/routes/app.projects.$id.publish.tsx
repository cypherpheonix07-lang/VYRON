import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  Play,
  RotateCcw,
  Users,
  FileBarChart2,
  Settings,
  ChevronDown,
  HelpCircle,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/projects/$id/publish")({
  head: () => ({
    meta: [
      { title: "Publish Gate — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Validate system architecture and security parameters to publish.",
      },
    ],
  }),
  component: ProjectPublishPage,
});

interface PublishStep {
  id: string;
  name: string;
  desc: string;
  status: "idle" | "verifying" | "passed" | "failed";
}

const initialSteps: PublishStep[] = [
  {
    id: "step-1",
    name: "Structured Requirement Extraction",
    desc: "Verify that all user inputs mapped cleanly to semantic specifications.",
    status: "idle",
  },
  {
    id: "step-2",
    name: "Architecture Blueprint Generation",
    desc: "Confirm node structural links and component layout interfaces.",
    status: "idle",
  },
  {
    id: "step-3",
    name: "Code Health Analysis",
    desc: "Scan codebase logic flow parameters and complexity metrics.",
    status: "idle",
  },
  {
    id: "step-4",
    name: "Security Vulnerability Scan",
    desc: "Verify security keys are rotated and signature auth is secure.",
    status: "idle",
  },
  {
    id: "step-5",
    name: "Delivery Risk Prediction",
    desc: "Verify pipeline delivery buffers and timelines.",
    status: "idle",
  },
  {
    id: "step-6",
    name: "Controlled Audit Trail Compilation",
    desc: "Seal release parameters in workspace compliance archives.",
    status: "idle",
  },
];

function ProjectPublishPage() {
  const { id } = Route.useParams();

  const [steps, setSteps] = useState<PublishStep[]>(initialSteps);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    setPublished(false);
    toast.info("Starting production publishing validation pipeline...");

    for (let i = 0; i < initialSteps.length; i++) {
      // Set current step to verifying
      setSteps((prev) =>
        prev.map((step, idx) => (idx === i ? { ...step, status: "verifying" } : step)),
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Set to passed
      setSteps((prev) =>
        prev.map((step, idx) => (idx === i ? { ...step, status: "passed" } : step)),
      );
    }

    setPublishing(false);
    setPublished(true);
    toast.success("Validation pipeline passed! System blueprint published successfully.", {
      description: "Audit trail log sealed and synced to CDN endpoints.",
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Controlled Publish Gate</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Validate compliance protocols and release functional blueprints.
          </p>
        </div>

        <Button
          onClick={handlePublish}
          disabled={publishing}
          className="bg-primary text-primary-foreground text-xs font-semibold h-9 shrink-0"
        >
          {publishing ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Sealing Audits...
            </>
          ) : published ? (
            "Republish System"
          ) : (
            "Validate & Publish Blueprint"
          )}
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Verification Checklist */}
        <div className="md:col-span-2 space-y-4">
          <SectionCard
            title="Controlled Publish Compliance Checklist"
            description="Brahma validation gates must execute successfully before deployment release."
          >
            <div className="space-y-3.5">
              {steps.map((step) => {
                const isIdle = step.status === "idle";
                const isVerifying = step.status === "verifying";
                const isPassed = step.status === "passed";

                return (
                  <div
                    key={step.id}
                    className={`border p-4 rounded-xl transition-all duration-200 ${
                      isPassed
                        ? "border-emerald-500/30 bg-emerald-500/4"
                        : isVerifying
                          ? "border-cyan-500/30 bg-cyan-500/4 animate-pulse"
                          : "border-border/60 surface"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          {step.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {isIdle && (
                          <span className="text-[9px] font-mono text-muted-foreground/60 uppercase">
                            Queued
                          </span>
                        )}
                        {isVerifying && (
                          <div className="flex items-center gap-1 text-cyan-400 text-[10px] font-semibold">
                            <Loader2 className="size-3.5 animate-spin" /> Verifying
                          </div>
                        )}
                        {isPassed && (
                          <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                            <CheckCircle2 className="size-3.5" /> Passed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Release Summary Details */}
        <div className="space-y-4">
          <SectionCard title="Target Environment" description="Deployment endpoint specs.">
            <div className="space-y-3.5 text-xs">
              <div className="border border-border/60 p-3 rounded-lg surface space-y-1">
                <span className="text-[9px] uppercase text-muted-foreground font-mono">
                  Environment
                </span>
                <p className="font-semibold">Production (Global Edge CDN)</p>
              </div>

              <div className="border border-border/60 p-3 rounded-lg surface space-y-1">
                <span className="text-[9px] uppercase text-muted-foreground font-mono">
                  Rollout Strategy
                </span>
                <p className="font-semibold">Blue/Green Immutable Swap</p>
              </div>

              <div className="border border-border/60 p-3 rounded-lg surface space-y-1">
                <span className="text-[9px] uppercase text-muted-foreground font-mono">
                  Compliance Seal
                </span>
                {published ? (
                  <p className="font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle className="size-3.5" /> SECURE-AUDIT-SEALED
                  </p>
                ) : (
                  <p className="font-mono text-[10px] text-muted-foreground/60 italic mt-0.5">
                    Awaiting verification runs...
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
