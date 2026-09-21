import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles,
  Terminal,
  FileCode,
  Layers,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrahmaLogo } from "@/components/brahma/logo";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [{ title: "Demo Autopilot — PROJECT BRAHMA" }],
  }),
  component: DemoAutopilotPage,
});

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Authentication & Role Handshake",
    desc: "User logs in with WebAuthn passkey or enterprise SSO credentials. Session tokens encrypted.",
    badge: "Auth",
  },
  {
    step: 2,
    title: "2. Intelligent Student Onboarding",
    desc: "Role, specialization goals, proficiency density, and milestone deadlines captured into state.",
    badge: "Onboarding",
  },
  {
    step: 3,
    title: "3. Studio SRS Architecture Plan",
    desc: "User defines domain constraints; AI engine synthesizes 8-tab structured blueprint specification.",
    badge: "Studio",
  },
  {
    step: 4,
    title: "4. Visual Node Graph Generation",
    desc: "React Flow architecture canvas automatically compiles interactive microservice topologies.",
    badge: "Architecture",
  },
  {
    step: 5,
    title: "5. Realtime GitHub Repository Sync",
    desc: "Connected git repos stream incoming commit pushes, webhooks, and pull-request audits in <5s.",
    badge: "Realtime",
  },
  {
    step: 6,
    title: "6. Static Code & Security Scanning",
    desc: "Multi-layered heuristic engine computes cyclomatic complexity, maintainability, and CWE issues.",
    badge: "Security",
  },
  {
    step: 7,
    title: "7. AI Copilot Diff Reviewer",
    desc: "Interactive file diff inspector presents code transformations with granular approve/reject controls.",
    badge: "Copilot",
  },
  {
    step: 8,
    title: "8. Traceability Matrix Linking",
    desc: "Requirements mapped 1:1 through components, code modules, test cases, and downstream KPIs.",
    badge: "Traceability",
  },
  {
    step: 9,
    title: "9. Hardened Release Gatekeeper",
    desc: "Seven automated quality checks enforce zero-critical-issue policy before deployment is permitted.",
    badge: "Gatekeeper",
  },
  {
    step: 10,
    title: "10. Production Deployment Pipeline",
    desc: "Secure container image packaged and dispatched to edge servers with verifiable chain of custody.",
    badge: "Ops",
  },
  {
    step: 11,
    title: "11. Comprehensive Audit & Export",
    desc: "Full compliance bundle compiled into cryptographic PDF, CSV, JSON, and LaTeX tables.",
    badge: "Compliance",
  },
  {
    step: 12,
    title: "12. Admin Observability Telemetry",
    desc: "Centralized console aggregates multi-tenant model usage, access logs, and system health.",
    badge: "Admin",
  },
];

function DemoAutopilotPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const active = DEMO_STEPS[currentStep] ?? DEMO_STEPS[0];
  if (!active) return null;

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] p-6 md:p-12 font-sans flex flex-col justify-between">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <BrahmaLogo />
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            AUTOPILOT TOUR
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-xs border-border/80"
          >
            {isPlaying ? (
              <Pause className="size-3.5 mr-1.5" />
            ) : (
              <Play className="size-3.5 mr-1.5" />
            )}
            {isPlaying ? "Pause Tour" : "Resume Tour"}
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
            <Link to="/app">Enter Workspace</Link>
          </Button>
        </div>
      </header>

      {/* Main Tour Card */}
      <main className="max-w-4xl w-full mx-auto my-12 space-y-8">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-widest text-primary font-bold">
            12-Step Automated Platform Tour
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {active.title}
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">{active.desc}</p>
        </div>

        {/* Visual Progress Stepper */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentStep
                  ? "bg-primary ring-2 ring-primary/40 scale-105"
                  : idx < currentStep
                    ? "bg-[var(--success)]"
                    : "bg-slate-800"
              }`}
              aria-label={`Jump to step ${s.step}`}
            />
          ))}
        </div>

        {/* Active Stage Simulation Panel */}
        <Card className="surface border-primary/30 shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="size-32 text-primary" />
          </div>
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
            <span className="font-mono text-xs text-primary font-bold">
              STAGE {active.step} OF 12
            </span>
            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-mono">
              {active.badge}
            </Badge>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-border/40 font-mono text-xs space-y-2">
            <p className="text-[var(--success)]">
              &gt; Initializing simulated transaction runner for {active.title}...
            </p>
            <p className="text-muted-foreground">
              &gt; Telemetry: All deterministic constraints satisfied (D1 Single Source, D4 Security
              Defaults).
            </p>
            <p className="text-cyan-400">&gt; Status: LIVE SIMULATION ACTIVE</p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-6">
        <span>PROJECT BRAHMA — Deep Verification Suite</span>
        <span>Step {currentStep + 1} of 12</span>
      </footer>
    </div>
  );
}
