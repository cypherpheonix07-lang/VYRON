import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, Wand2, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { analyzeRequirements } from "@/lib/api";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/app/studio/create")({
  head: () => ({
    meta: [
      { title: "Generate Blueprint — BRAHMA AI Studio" },
      { name: "description", content: "Create a software blueprint from structured prompts." },
    ],
  }),
  component: CreateProjectFromPrompt,
});

const exampleChips = [
  "AI attendance system with facial recognition",
  "Hospital patient appointment and booking dashboard",
  "Supply chain logistics tracking platform",
  "College final-year project evaluation system",
  "E-commerce inventory analytics and refund pipeline",
];

function CreateProjectFromPrompt() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("Web");
  const [domain, setDomain] = useState("Fintech");
  const [techStack, setTechStack] = useState("Auto recommended");
  const [deadline, setDeadline] = useState("2026-12-31");
  const [businessGoal, setBusinessGoal] = useState("");

  const [features, setFeatures] = useState({
    auth: true,
    database: true,
    adminPanel: true,
    analytics: false,
    payments: false,
    notifications: true,
    aiFeatures: false,
    fileUpload: false,
    reports: true,
  });

  // Pull prefilled prompt from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryPrompt = params.get("prompt");
      if (queryPrompt) {
        setPrompt(queryPrompt);
      }
    }
  }, []);

  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 20) {
      toast.error(
        "Please enter a more descriptive prompt (minimum 20 characters) to accurately generate requirements.",
      );
      return;
    }

    setGenerating(true);
    toast.success("Analysis started", {
      description: "Extracting requirements and designing service topology...",
    });

    try {
      const result = await analyzeRequirements(prompt);
      localStorage.setItem("brahma_last_generated_requirements", JSON.stringify(result));
      toast.success("Requirements extracted successfully!");
      navigate({ to: "/app/studio/$id/generate", params: { id: "brahma-core" } });
    } catch (err) {
      console.error("Requirements extraction failed", err);
      toast.error("Failed to process requirements. Using fallback mock routing.");
      navigate({ to: "/app/studio/$id/generate", params: { id: "brahma-core" } });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt to Blueprint Generator"
        description="Configure your target domain, architectural preferences, and engineering features to generate a validated blueprint."
      />

      <form onSubmit={handleGenerate} className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Prompt & Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Describe your software idea"
            description="Detail user actions, inputs, outputs, and business flow."
          >
            <div className="space-y-4">
              <Textarea
                placeholder="What are we building today? Provide clear, explicit instructions..."
                rows={10}
                className="font-mono text-sm leading-relaxed"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Quick starter templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exampleChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setPrompt(chip)}
                      className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Target Platform & Parameters"
            description="Define structural targets and business boundaries."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="platform">Target Platform</Label>
                <Select value={targetPlatform} onValueChange={setTargetPlatform}>
                  <SelectTrigger id="platform" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Web",
                      "Mobile App",
                      "Progressive Web App (PWA)",
                      "API Service",
                      "Admin Dashboard",
                    ].map((plat) => (
                      <SelectItem key={plat} value={plat}>
                        {plat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="create-domain">Project Domain</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger id="create-domain" className="mt-1.5 w-full">
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
                      "IoT",
                      "Developer Tools",
                    ].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stack">Technical Stack Preference</Label>
                <Select value={techStack} onValueChange={setTechStack}>
                  <SelectTrigger id="stack" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Auto recommended",
                      "React + FastAPI",
                      "Next.js + Node",
                      "React + Python",
                      "Mobile-first PWA",
                    ].map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="create-deadline">Target Deadline</Label>
                <Input
                  id="create-deadline"
                  type="date"
                  className="mt-1.5"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="business-goal">Primary Business Goal</Label>
                <Input
                  id="business-goal"
                  placeholder="e.g. Reduce student queue times by 50% or process payments within 4 seconds..."
                  className="mt-1.5"
                  value={businessGoal}
                  onChange={(e) => setBusinessGoal(e.target.value)}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Side: Features List & Action */}
        <div className="space-y-6">
          <SectionCard title="Module Toggles" description="Tick system elements to compile.">
            <div className="space-y-1">
              {[
                ["auth", "User Authentication", "Session management, OAuth, roles"],
                ["database", "Relational Database", "Table schemas, keys, constraints"],
                ["adminPanel", "Admin Dashboard", "System diagnostics logs and controls"],
                ["analytics", "Post-launch Analytics", "Track Latency and API cost charts"],
                ["payments", "Payment Gateway", "Stripe merchant billing integrations"],
                ["notifications", "Alert Notifications", "Trigger custom email or Slack messages"],
                ["aiFeatures", "AI Intelligence Layer", "LLM-driven text summaries and tags"],
                ["fileUpload", "Object File Storage", "Upload PDF drafts, CSV, and pictures"],
                ["reports", "Executive PDF Reports", "Compiled metrics downloads"],
              ].map(([key, title, body]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{title}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{body}</p>
                  </div>
                  <Switch
                    checked={features[key as keyof typeof features]}
                    onCheckedChange={(v) =>
                      setFeatures((prev) => ({ ...prev, [key as string]: v }))
                    }
                    aria-label={title as string}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <Button
            type="submit"
            size="lg"
            disabled={generating}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground"
          >
            <Wand2 className="mr-2 size-4" aria-hidden="true" />
            {generating ? "Extracting Requirements..." : "Generate BRAHMA Blueprint"}
          </Button>
        </div>
      </form>
    </div>
  );
}
