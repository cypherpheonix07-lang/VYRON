import { createFileRoute } from "@tanstack/react-router";
import {
  Settings,
  ShieldAlert,
  Bot,
  Globe,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Sliders,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProject } from "@/lib/mock-data";

export const Route = createFileRoute("/app/studio/$id/settings")({
  head: () => ({
    meta: [
      { title: "Studio Settings — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Configure environment variables, project names, and LLM providers.",
      },
    ],
  }),
  component: StudioSettingsPage,
});

const defaultVariables = [
  {
    key: "DATABASE_URL",
    val: "postgresql://postgres:••••••••@supabase.co:5432/db",
    env: "production",
  },
  { key: "JWT_SECRET", val: "brh_sec_••••••••••••••••", env: "all" },
  { key: "GEMINI_API_KEY", val: "AIzaSy••••••••••••", env: "all" },
];

function StudioSettingsPage() {
  const { id } = Route.useParams();
  const project = getProject(id);

  const [activeSubTab, setActiveSubTab] = useState("general");
  const [vars, setVars] = useState(defaultVariables);
  const [revealKey, setRevealKey] = useState<string | null>(null);

  // New Env var inputs
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  // AI config states
  const [provider, setProvider] = useState("Gemini Pro");
  const [temp, setTemp] = useState(0.2);

  const handleAddVar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newVal.trim()) {
      toast.error("Please enter both key and value.");
      return;
    }
    setVars((prev) => [...prev, { key: newKey, val: newVal, env: "all" }]);
    setNewKey("");
    setNewVal("");
    toast.success(`Environment variable ${newKey} defined.`);
  };

  const handleRemoveVar = (key: string) => {
    setVars((prev) => prev.filter((v) => v.key !== key));
    toast.info(`Environment variable ${key} removed.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Side: Settings Nav tabs */}
        <div className="space-y-4">
          <SectionCard title="Settings Index" description="Configure parameters.">
            <div className="space-y-1">
              {(
                [
                  ["general", "General Settings", Globe],
                  ["env", "Environment Variables", Lock],
                  ["ai", "AI Copilot Models", Bot],
                  ["danger", "Danger Zone", ShieldAlert],
                ] as const
              ).map(([key, label, Icon]) => {
                const isActive = activeSubTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveSubTab(key as string)}
                    className={`w-full flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                      isActive
                        ? "border-primary bg-primary/8 text-primary font-semibold"
                        : "border-border/60 hover:bg-secondary/40 hover:text-foreground text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Right Side: Active Settings Panel */}
        <div className="lg:col-span-3">
          {/* GENERAL TAB */}
          {activeSubTab === "general" && (
            <SectionCard title="General Workspace Settings" description="Modify metadata details.">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Workspace parameters saved.");
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="proj-name">Project Workspace Name</Label>
                  <Input
                    id="proj-name"
                    defaultValue={project.name}
                    className="max-w-md h-9 text-xs"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="proj-desc">Project Description</Label>
                  <Textarea
                    id="proj-desc"
                    defaultValue={project.description}
                    rows={4}
                    className="max-w-md text-xs leading-relaxed"
                  />
                </div>

                <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                  Save General Changes
                </Button>
              </form>
            </SectionCard>
          )}

          {/* ENVIRONMENT VARIABLES TAB */}
          {activeSubTab === "env" && (
            <SectionCard
              title="Secrets & Environment Configuration"
              description="Manage database keys, API endpoints, and tokens securely."
            >
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Identifier</TableHead>
                      <TableHead>Configured Value</TableHead>
                      <TableHead>Target Env</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vars.map((v) => {
                      const isRevealed = revealKey === v.key;
                      return (
                        <TableRow key={v.key}>
                          <TableCell className="font-mono text-xs font-semibold">{v.key}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground select-all">
                            {isRevealed ? v.val : "••••••••••••••••••••••••"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px] uppercase font-mono">
                              {v.env}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                onClick={() => setRevealKey(isRevealed ? null : v.key)}
                                aria-label="Reveal variable value"
                              >
                                {isRevealed ? (
                                  <EyeOff className="size-3.5" />
                                ) : (
                                  <Eye className="size-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-400"
                                onClick={() => handleRemoveVar(v.key)}
                                aria-label="Delete variable"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Add variable form */}
                <form
                  onSubmit={handleAddVar}
                  className="flex gap-2 items-end pt-4 border-t border-border/60"
                >
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="var-key" className="text-[10px]">
                      Key Name
                    </Label>
                    <Input
                      id="var-key"
                      placeholder="e.g. STRIPE_API_SECRET"
                      className="h-8 text-xs font-mono"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="var-val" className="text-[10px]">
                      Secret Value
                    </Label>
                    <Input
                      id="var-val"
                      type="password"
                      placeholder="••••••••••••"
                      className="h-8 text-xs font-mono"
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 bg-primary text-primary-foreground"
                  >
                    <Plus className="mr-1 size-3.5" /> Define
                  </Button>
                </form>
              </div>
            </SectionCard>
          )}

          {/* AI MODELS CONFIG TAB */}
          {activeSubTab === "ai" && (
            <SectionCard
              title="AI Intelligence Models Routing"
              description="Configure generative provider endpoints, temperatures, and usage budgets."
            >
              <div className="space-y-4 max-w-md">
                <div className="grid gap-2">
                  <Label htmlFor="ai-provider">Default Copilot Provider</Label>
                  <select
                    id="ai-provider"
                    className="h-9 text-xs border border-border bg-background rounded-lg px-2 text-foreground font-semibold outline-none"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    {["Gemini Pro", "Claude 3.5 Sonnet", "GPT-4o Enterprise", "DeepSeek Coder"].map(
                      (p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="grid gap-2 pt-2">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="ai-temp">Model Temperature (Randomness)</Label>
                    <span className="text-xs font-mono text-primary font-semibold">{temp}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Sliders className="size-4 text-muted-foreground shrink-0" />
                    <input
                      id="ai-temp"
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={temp}
                      onChange={(e) => setTemp(parseFloat(e.target.value))}
                      className="flex-1 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-4">
                  <div>
                    <p className="text-xs font-semibold">
                      Enable regional local LLM execution fallback
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Route requests to secure local models on provider timeouts.
                    </p>
                  </div>
                  <Switch checked aria-label="LLM fallback toggle" />
                </div>
              </div>
            </SectionCard>
          )}

          {/* DANGER ZONE TAB */}
          {activeSubTab === "danger" && (
            <SectionCard
              title="Danger Zone"
              description="Irreversible workspace settings and database wipes."
            >
              <div className="border border-[var(--critical)]/40 bg-[var(--critical)]/5 p-4 rounded-xl space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-[var(--critical)] flex items-center gap-1.5">
                    <ShieldAlert className="size-4 shrink-0" /> Destructive parameters
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Deleting this workspace resolves all routing tables and purges connected
                    database seeds.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-xs border-[var(--critical)]/30 text-[var(--critical)] hover:bg-[var(--critical)]/10"
                    onClick={() => {
                      const confirm = window.confirm(
                        "Are you sure you want to purge this workspace?",
                      );
                      if (confirm) {
                        toast.success("Workspace queued for purge.");
                      }
                    }}
                  >
                    Delete Workspace Project
                  </Button>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
