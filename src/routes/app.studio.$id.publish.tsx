import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Settings,
  QrCode,
  Copy,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/studio/$id/publish")({
  head: () => ({
    meta: [
      { title: "Publish Wizard Gatekeeper — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Verify deployment quality gates and release to staging or production.",
      },
    ],
  }),
  component: PublishWizardPage,
});

const defaultGates = [
  {
    id: 1,
    name: "Requirement Clarity",
    score: "88%",
    status: "Pass",
    details: "All functional specs mapped to code constructs.",
  },
  {
    id: 2,
    name: "Architecture Validation",
    score: "Valid",
    status: "Pass",
    details: "Graph dependencies and server configurations resolve.",
  },
  {
    id: 3,
    name: "Code Health Checks",
    score: "Clean",
    status: "Pass",
    details: "TypeScript compiler finished with 0 error outputs.",
  },
  {
    id: 4,
    name: "Security Review",
    score: "1 Warning",
    status: "Warning",
    details: "CORS wildcard configured. Resolving is recommended.",
    fix: "Define CORS domain whitelists",
  },
  {
    id: 5,
    name: "Test Suite Coverage",
    score: "89.4%",
    status: "Pass",
    details: "Passed 5 of 6 tests. 1 API schema mismatch failed.",
    fix: "Auto-Fix API tests payload schemas",
  },
  {
    id: 6,
    name: "Performance & SEO Audit",
    score: "95/100",
    status: "Pass",
    details: "Lighthouse audit benchmarks satisfied.",
  },
  {
    id: 7,
    name: "Business Alignment Mapping",
    score: "Mapped",
    status: "Pass",
    details: "All database models wired to process KPI scorecards.",
  },
];

function PublishWizardPage() {
  const { id } = Route.useParams();

  const [gates, setGates] = useState(defaultGates);
  const [environment, setEnvironment] = useState("staging");
  const [customDomain, setCustomDomain] = useState("smartcampus.brahma.dev");
  const [autoRollback, setAutoRollback] = useState(true);

  // Deploy states: idle, checking, deploying, success, failed
  const [deployState, setDeployState] = useState<
    "idle" | "checking" | "deploying" | "success" | "failed"
  >("idle");
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const startDeployment = async () => {
    setDeployState("checking");
    setDeployLogs(["INFO: Initiating BRAHMA release gate checks..."]);
    setActiveStep(0);

    // Simulated checks sequence
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDeployLogs((prev) => [...prev, "SUCCESS: Quality gates verified. Passing checks."]);

    setDeployState("deploying");
    setDeployLogs((prev) => [
      ...prev,
      "INFO: Packaging docker images and deployment assets...",
      "INFO: Deploying container clusters to regional nodes...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setDeployLogs((prev) => [
      ...prev,
      "INFO: Establishing database migration routines...",
      "INFO: Testing integration routing pathways...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeployLogs((prev) => [...prev, "SUCCESS: Host target routing verified."]);

    setDeployState("success");
    toast.success("Project successfully published!", {
      description: "Live URL endpoints are online.",
    });
  };

  const handleFixGate = (gateId: number, name: string) => {
    toast.info("Running AI refactor fix...", { description: `Remediating ${name}.` });
    setTimeout(() => {
      setGates((prev) =>
        prev.map((g) => {
          if (g.id !== gateId) return g;
          return {
            ...g,
            status: "Pass",
            score: "Clean",
            details: "AI refactored and verified compliance guidelines.",
          };
        }),
      );
      toast.success(`${name} check is now clean!`);
    }, 1200);
  };

  const hasWarnings = gates.some((g) => g.status === "Warning");

  return (
    <div className="space-y-6">
      {deployState === "idle" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Quality Gates */}
          <div className="lg:col-span-2 space-y-4">
            <SectionCard
              title="BRAHMA Quality Gates"
              description="Release check requirements prior to deployment compilation."
            >
              <div className="space-y-3">
                {gates.map((g) => {
                  const isPass = g.status === "Pass";
                  const isWarning = g.status === "Warning";

                  return (
                    <div
                      key={g.id}
                      className="border border-border/60 p-4 rounded-xl surface flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-foreground">{g.name}</h4>
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            {g.score}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {g.details}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`rounded-full text-[9px] ${
                            isPass &&
                            "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]"
                          } ${
                            isWarning &&
                            "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]"
                          }`}
                        >
                          {g.status}
                        </Badge>
                        {g.fix && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[9px] text-primary"
                            onClick={() => handleFixGate(g.id, g.name)}
                          >
                            Fix with AI
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          {/* Right Column: Deployment Configs */}
          <div className="space-y-6">
            <SectionCard title="Target Environment" description="Select deployment target routing.">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 bg-secondary/50 p-1 rounded-xl border border-border/40">
                  {["development", "staging", "production"].map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setEnvironment(env)}
                      className={`py-1.5 text-[10px] font-semibold rounded-lg uppercase transition-all ${
                        environment === env
                          ? "bg-background text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="custom-domain">Custom Domain Host</Label>
                  <Input
                    id="custom-domain"
                    className="h-8 text-xs font-mono"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <div>
                    <p className="text-xs font-semibold">Automatic rollback on errors</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Reverts release if E2E scripts fail.
                    </p>
                  </div>
                  <Switch
                    checked={autoRollback}
                    onCheckedChange={setAutoRollback}
                    aria-label="Auto rollback toggle"
                  />
                </div>
              </div>
            </SectionCard>

            <Button
              onClick={startDeployment}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-5 font-semibold text-xs"
            >
              <Globe className="mr-1.5 size-4" /> Deploy to {environment.toUpperCase()}
            </Button>

            {hasWarnings && (
              <p className="text-[9px] text-muted-foreground text-center leading-normal">
                ⚠️ You have pending warnings in your quality gates. You are deploying with warnings.
              </p>
            )}
          </div>
        </div>
      )}

      {/* DEPLOYING ANIMATION PANEL */}
      {(deployState === "checking" || deployState === "deploying") && (
        <Card className="surface max-w-xl mx-auto p-6 space-y-6 text-center">
          <Loader2 className="size-10 animate-spin text-primary mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">
              {deployState === "checking" ? "Running Release Gates..." : "Deploying Clusters..."}
            </h3>
            <p className="text-xs text-muted-foreground">
              Configuring domains, assets packaging, and system tests. Keep page active.
            </p>
          </div>

          <div className="border border-border/60 bg-zinc-950 p-4 rounded-xl text-left font-mono text-[10px] text-zinc-400 space-y-1.5 max-h-40 overflow-y-auto">
            {deployLogs.map((log, i) => {
              const isSuccess = log.startsWith("SUCCESS:");
              return (
                <div key={i} className={isSuccess ? "text-[var(--success)]" : ""}>
                  {log}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* SUCCESS SCREEN */}
      {deployState === "success" && (
        <Card className="surface max-w-xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--success)]/12 text-[var(--success)]">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-base font-semibold">Application Deployment Succeeded!</h3>
            <p className="text-xs text-muted-foreground">
              Your software has been compiled and is running live under the staging target.
            </p>
          </div>

          {/* Target details */}
          <div className="border border-border/60 p-4 rounded-xl bg-secondary/10 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider">
                Live URL
              </span>
              <a
                href={`https://${customDomain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-primary truncate block hover:underline flex items-center gap-1 mt-0.5"
              >
                https://{customDomain} <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => toast.success("URL copied to clipboard.")}
              aria-label="Copy live URL"
            >
              <Copy className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* QR Mock */}
            <div className="border border-border/60 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 surface">
              <QrCode className="size-16 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-semibold">
                Scan QR for Mobile Preview
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-2">
              <Button
                variant="outline"
                className="w-full text-xs h-9"
                onClick={() => setDeployState("idle")}
              >
                Return to Config
              </Button>
              <Button className="w-full text-xs h-9 bg-primary text-primary-foreground" asChild>
                <Link to="/app/studio/$id/analytics" params={{ id }}>
                  View Live Analytics <ChevronRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
