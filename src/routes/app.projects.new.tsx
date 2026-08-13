import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Github, Loader2, Mic, Sparkles, Upload, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { analyzeRequirements, analyzeRepo } from "@/lib/api";

import { PageHeader } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { analysisSteps, sampleIdea } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/projects/new")({
  head: () => ({
    meta: [
      { title: "New project wizard — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Capture project details, requirements and repository, then generate a validated blueprint.",
      },
      { property: "og:title", content: "New project wizard — PROJECT BRAHMA" },
      { property: "og:description", content: "Four steps from raw idea to a generated blueprint." },
    ],
  }),
  component: NewProject,
});

const stepTitles = [
  "Project information",
  "Requirement input",
  "Repository connection",
  "Analysis options",
];

function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [repoScanDone, setRepoScanDone] = useState(true);
  const [reqExtractDone, setReqExtractDone] = useState(true);

  const [info, setInfo] = useState({
    name: "",
    description: "",
    domain: "Fintech",
    users: "",
    team: "5",
    deadline: "2026-11-30",
  });
  const [idea, setIdea] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [repo, setRepo] = useState({ url: "", connected: false });
  const [options, setOptions] = useState({
    architecture: true,
    codeHealth: true,
    security: true,
    risk: true,
    kpi: true,
  });

  useEffect(() => {
    if (!running) return;
    if (progressIndex >= analysisSteps.length) {
      if (repoScanDone && reqExtractDone) {
        const t = setTimeout(() => {
          toast.success("Blueprint generated", {
            description: "Requirements, architecture and risk profile are ready.",
          });
          navigate({ to: "/app/projects/$id", params: { id: "brahma-core" } });
        }, 600);
        return () => clearTimeout(t);
      }
      return;
    }
    const t = setTimeout(() => setProgressIndex((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [running, progressIndex, navigate, repoScanDone, reqExtractDone]);

  function validate() {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (info.name.trim().length < 3) next["name"] = "Project name must be at least 3 characters";
      if (info.description.trim().length < 20)
        next["description"] = "Add at least 20 characters of context";
      if (!info.users.trim()) next["users"] = "Describe the target users";
    }
    if (step === 1 && idea.trim().length < 40 && !fileName) {
      next["idea"] = "Paste at least 40 characters of requirement text or attach a document";
    }
    if (step === 3 && !Object.values(options).some(Boolean)) {
      next["options"] = "Select at least one analysis to run";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  if (running) {
    return (
      <>
        <PageHeader title="Generating blueprint" description="This usually takes under a minute." />
        <Card className="surface mx-auto max-w-xl">
          <CardContent className="pt-2">
            <ol className="space-y-3">
              {analysisSteps.map((s, i) => {
                const done = i < progressIndex;
                const active = i === progressIndex;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border text-xs",
                        done &&
                          "border-[var(--success)] bg-[var(--success)]/15 text-[var(--success)]",
                        active && "border-primary bg-primary/15 text-primary",
                        !done && !active && "border-border text-muted-foreground",
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : active ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className={cn("text-sm", !done && !active && "text-muted-foreground")}>
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="New project"
        description="Four steps to a validated blueprint with architecture, code health, security and risk analysis."
      />

      <ol className="grid gap-2 sm:grid-cols-4">
        {stepTitles.map((t, i) => (
          <li
            key={t}
            className={cn(
              "surface flex items-center gap-3 rounded-xl px-4 py-3",
              i === step && "border-primary/50",
            )}
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                i < step
                  ? "bg-[var(--success)]/15 text-[var(--success)]"
                  : i === step
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" aria-hidden /> : i + 1}
            </span>
            <span
              className={cn(
                "min-w-0 truncate text-sm",
                i === step ? "font-medium" : "text-muted-foreground",
              )}
            >
              {t}
            </span>
          </li>
        ))}
      </ol>

      <Card className="surface">
        <CardContent className="space-y-5 pt-2">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="pname">Project name</Label>
                <Input
                  id="pname"
                  className="mt-1.5"
                  value={info.name}
                  placeholder="Aurora Payments Gateway"
                  onChange={(e) => setInfo((v) => ({ ...v, name: e.target.value }))}
                />
                {errors["name"] ? (
                  <p className="mt-1.5 text-xs text-[var(--critical)]">{errors["name"]}</p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="pdesc">Description</Label>
                <Textarea
                  id="pdesc"
                  className="mt-1.5"
                  rows={3}
                  value={info.description}
                  placeholder="Payment orchestration service for mid-market merchants…"
                  onChange={(e) => setInfo((v) => ({ ...v, description: e.target.value }))}
                />
                {errors["description"] ? (
                  <p className="mt-1.5 text-xs text-[var(--critical)]">{errors["description"]}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="pdomain">Domain</Label>
                <Select
                  value={info.domain}
                  onValueChange={(v) => setInfo((p) => ({ ...p, domain: v }))}
                >
                  <SelectTrigger id="pdomain" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Fintech",
                      "Healthcare",
                      "Education",
                      "Logistics",
                      "Enterprise Ops",
                      "E-commerce",
                    ].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pusers">Target users</Label>
                <Input
                  id="pusers"
                  className="mt-1.5"
                  value={info.users}
                  placeholder="Merchant developers, finance operators"
                  onChange={(e) => setInfo((v) => ({ ...v, users: e.target.value }))}
                />
                {errors["users"] ? (
                  <p className="mt-1.5 text-xs text-[var(--critical)]">{errors["users"]}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="pteam">Team size</Label>
                <Input
                  id="pteam"
                  type="number"
                  min={1}
                  className="mt-1.5"
                  value={info.team}
                  onChange={(e) => setInfo((v) => ({ ...v, team: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="pdl">Expected deadline</Label>
                <Input
                  id="pdl"
                  type="date"
                  className="mt-1.5"
                  value={info.deadline}
                  onChange={(e) => setInfo((v) => ({ ...v, deadline: e.target.value }))}
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label htmlFor="idea">Raw project idea or requirement text</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIdea(sampleIdea)}
                  >
                    <Sparkles className="size-4" aria-hidden /> Load sample project idea
                  </Button>
                </div>
                <Textarea
                  id="idea"
                  rows={9}
                  className="mt-1.5 font-mono text-xs"
                  value={idea}
                  placeholder="Describe what the system must do, who uses it, and any constraints…"
                  onChange={(e) => setIdea(e.target.value)}
                />
                {errors["idea"] ? (
                  <p className="mt-1.5 text-xs text-[var(--critical)]">{errors["idea"]}</p>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="surface flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm">
                  <Upload className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-medium">Upload SRS document</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {fileName ?? "PDF, DOCX or Markdown"}
                    </span>
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "SRS_v2.pdf")}
                  />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto justify-start gap-3 px-4 py-3"
                  onClick={() => toast.info("Voice capture is mocked in this build")}
                >
                  <Mic className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="text-left">
                    <span className="block text-sm font-medium">Dictate requirement</span>
                    <span className="block text-xs text-muted-foreground">Voice input (mock)</span>
                  </span>
                </Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Repository connection</p>
                  <p className="text-xs text-muted-foreground">
                    Code health and security analysis require a connected repository.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full",
                    repo.connected
                      ? "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]"
                      : "text-muted-foreground",
                  )}
                >
                  {repo.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto justify-start gap-3 px-4 py-3"
                  onClick={() =>
                    setRepo({ url: "github.com/aurora-labs/payments-gateway", connected: true })
                  }
                >
                  <Github className="size-4 shrink-0" aria-hidden />
                  <span className="text-left">
                    <span className="block text-sm font-medium">Connect GitHub</span>
                    <span className="block text-xs text-muted-foreground">OAuth app (mock)</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto justify-start gap-3 px-4 py-3"
                  onClick={() =>
                    setRepo({ url: "github.com/project-brahma/sample-service", connected: true })
                  }
                >
                  <Wand2 className="size-4 shrink-0" aria-hidden />
                  <span className="text-left">
                    <span className="block text-sm font-medium">Use sample repository</span>
                    <span className="block text-xs text-muted-foreground">
                      Preloaded analysis data
                    </span>
                  </span>
                </Button>
              </div>
              <div>
                <Label htmlFor="repourl">Or paste a repository URL</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="repourl"
                    value={repo.url}
                    placeholder="https://github.com/org/repo"
                    onChange={(e) => setRepo((r) => ({ ...r, url: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setRepo((r) => ({ ...r, connected: !!r.url.trim() }))}
                  >
                    Connect
                  </Button>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  You can skip this step and connect a repository later from the project overview.
                </p>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-1">
              {[
                [
                  "architecture",
                  "Architecture generation",
                  "Service topology, schema and API contract",
                ],
                [
                  "codeHealth",
                  "Code health analysis",
                  "Maintainability, complexity, duplication, coverage",
                ],
                ["security", "Security review", "Vulnerability findings with CWE references"],
                ["risk", "Risk prediction", "Delivery risk and technical debt scoring"],
                ["kpi", "Business KPI mapping", "Cost, time, quality and risk exposure impact"],
              ].map(([key, title, body]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{body}</p>
                  </div>
                  <Switch
                    checked={options[key as keyof typeof options]}
                    onCheckedChange={(v) => setOptions((o) => ({ ...o, [key as string]: v }))}
                    aria-label={title as string}
                  />
                </div>
              ))}
              {errors["options"] ? (
                <p className="text-xs text-[var(--critical)]">{errors["options"]}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => (validate() ? setStep((s) => s + 1) : undefined)}>Next</Button>
            ) : (
              <Button
                onClick={() => {
                  if (!validate()) return;

                  // Trigger API scans if repo connected
                  if (repo.url && repo.connected) {
                    setRepoScanDone(false);
                    toast.info("Connecting and scanning repository in background...");
                    analyzeRepo(repo.url)
                      .then((res) => {
                        localStorage.setItem("brahma_last_repo_analysis", JSON.stringify(res));
                      })
                      .catch((err) => {
                        console.error("Background repo scan failed", err);
                      })
                      .finally(() => {
                        setRepoScanDone(true);
                      });
                  } else {
                    setRepoScanDone(true);
                  }

                  // Also call requirements extractor if idea/requirements text is present
                  if (idea) {
                    setReqExtractDone(false);
                    analyzeRequirements(idea)
                      .then((res) => {
                        localStorage.setItem(
                          "brahma_last_generated_requirements",
                          JSON.stringify(res),
                        );
                      })
                      .catch((err) => {
                        console.error("Background requirement extraction failed", err);
                      })
                      .finally(() => {
                        setReqExtractDone(true);
                      });
                  } else {
                    setReqExtractDone(true);
                  }

                  setProgressIndex(0);
                  setRunning(true);
                }}
              >
                <Wand2 className="size-4" aria-hidden /> Generate Blueprint
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
