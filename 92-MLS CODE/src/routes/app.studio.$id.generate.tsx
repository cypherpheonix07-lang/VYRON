import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Play, Terminal, XCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/app/studio/$id/generate")({
  head: () => ({
    meta: [
      { title: "AI Generation Pipeline — BRAHMA AI Studio" },
      {
        name: "description",
        content: "AI compiler pipeline compiling requirements into React/FastAPI code.",
      },
    ],
  }),
  component: GenerationPipelinePage,
});

const steps = [
  "Parsing requirements specifications",
  "Validating architectural graph and security rules",
  "Generating database schema scripts and constraints",
  "Generating REST API routes and schemas",
  "Generating React components and styling sheets",
  "Compiling unit/E2E test scenarios",
  "Running static analysis code health checks",
  "Calculating delivery and business risk coefficients",
  "Preparing the studio workspace editor layout",
];

const mockLogs = [
  "INFO: Initializing Brahma Intelligence Engine compilation...",
  "INFO: Loaded approved software blueprint configuration.",
  "DEBUG: Parsing functional requirement IDs FR-1, FR-2, FR-3...",
  "DEBUG: No critical ambiguity found in specifications.",
  "INFO: Validating architecture nodes mapping...",
  "SUCCESS: Service mapping is consistent with PostgreSQL + FastAPI tech stacks.",
  "INFO: Compiling Prisma database schema...",
  "SUCCESS: Generated 6 database tables, indexes, and FK references.",
  "INFO: Mapping API contracts...",
  "SUCCESS: Compiled 10 REST endpoints with OAuth guards.",
  "DEBUG: Scaffolding React layout components...",
  "DEBUG: Building dashboard wireframe widgets and charts...",
  "SUCCESS: Scaffolding completed. 12 components generated.",
  "INFO: Creating automated test scripts...",
  "SUCCESS: Generated 8 test scripts in tests/ directory.",
  "INFO: Running static lint checks...",
  "SUCCESS: Code health validated with 0 compilation errors.",
  "INFO: Finalizing workspace data models...",
  "SUCCESS: Workspace prepared successfully. Redirecting...",
];

function GenerationPipelinePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"running" | "success" | "failed">("running");

  const logEndRef = useRef<HTMLDivElement>(null);

  // Animate steps and stream logs
  useEffect(() => {
    if (status !== "running") return;

    let logIndex = 0;

    // Stream logs
    const logTimer = setInterval(() => {
      if (logIndex < mockLogs.length) {
        setLogs((prev) => [...prev, mockLogs[logIndex]!]);
        logIndex++;
      }
    }, 450);

    // Progress steps
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepTimer);
          clearInterval(logTimer);
          setStatus("success");
          toast.success("Generation completed!", {
            description: "Scaffolded React + Node project successfully.",
          });
          // Redirect to editor
          setTimeout(() => {
            navigate({ to: "/app/studio/$id/editor", params: { id } });
          }, 1500);
          return prev;
        }
      });
    }, 1200);

    return () => {
      clearInterval(stepTimer);
      clearInterval(logTimer);
    };
  }, [status, id, navigate]);

  // Scroll to bottom of log stream
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {status === "running" && "Compiling Software Workspace..."}
          {status === "success" && "Generation Succeeded"}
          {status === "failed" && "Generation Pipeline Failed"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {status === "running" &&
            "Brahma AI is generating your workspace repository code, database structure, and APIs."}
          {status === "success" && "Workspace structure finalized. Redirecting you to the editor."}
          {status === "failed" &&
            "An error occurred while compiling your architecture nodes. Check logs."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Progress Pipeline */}
        <Card className="surface">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-sm font-semibold border-b border-border/60 pb-2">
              Compilation Pipeline
            </h2>
            <div className="space-y-3">
              {steps.map((stepName, i) => {
                const isCompleted = i < activeStep;
                const isActive = i === activeStep && status === "running";
                const isPending = i > activeStep;

                return (
                  <div
                    key={stepName}
                    className={`flex items-start gap-3 text-xs transition-colors ${
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {isCompleted && (
                      <CheckCircle2 className="size-4 shrink-0 text-[var(--success)]" />
                    )}
                    {isActive && <Loader2 className="size-4 shrink-0 animate-spin text-primary" />}
                    {isPending && (
                      <div className="size-4 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span>{stepName}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card className="surface flex flex-col h-[380px] bg-zinc-950 border-zinc-800">
          <CardContent className="pt-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <Terminal className="size-4" /> Live Compiler Output
              </span>
              <span className="text-[10px] uppercase font-mono">Brahma CLI v2.1.4</span>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-zinc-300 space-y-1.5 mt-3 pr-2 scrollbar-thin">
              {logs.map((log, i) => {
                let colorClass = "text-zinc-400";
                if (log.startsWith("SUCCESS:")) colorClass = "text-emerald-400";
                if (log.startsWith("DEBUG:")) colorClass = "text-indigo-400";
                return (
                  <div key={i} className={colorClass}>
                    {log}
                  </div>
                );
              })}
              {status === "running" && (
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="animate-pulse">Loading engine...</span>
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Actions */}
      <div className="flex justify-center gap-3">
        {status === "running" && (
          <Button variant="outline" onClick={() => setStatus("failed")}>
            Cancel Generation
          </Button>
        )}
        {status === "failed" && (
          <Button
            onClick={() => {
              setLogs([]);
              setActiveStep(0);
              setStatus("running");
            }}
            className="bg-primary hover:bg-primary/95 text-primary-foreground"
          >
            <Play className="mr-2 size-4" /> Retry Compilation
          </Button>
        )}
      </div>
    </div>
  );
}
