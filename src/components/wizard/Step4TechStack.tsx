/**
 * PROJECT BRAHMA — STEP 4: TARGET PLATFORMS & ARCHITECTURE STACK
 * Contract: { platforms: enum('web','mobile','api','desktop').array().min(1),
 *   stack: enum('ai-decides','react-fastapi','next-serverless','custom'),
 *   repo_full_name: string.nullable(), complexity_budget: number.int(1,10) }
 */

import React from "react";
import {
  Globe,
  Smartphone,
  Server,
  Monitor,
  Check,
  Github,
  GitBranch,
  Sliders,
  Sparkles,
  Layers,
} from "lucide-react";
import type { WizardPayload, PlatformType, StackType } from "@/types/wizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Step4Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

const PLATFORMS_CONFIG: Array<{
  id: PlatformType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "web",
    label: "Web Application",
    desc: "Responsive modern SPA / SSR web client.",
    icon: Globe,
  },
  {
    id: "mobile",
    label: "Mobile (iOS/Android)",
    desc: "Cross-platform React Native / Capacitor shell.",
    icon: Smartphone,
  },
  {
    id: "api",
    label: "REST / GraphQL API",
    desc: "Headless microservice or API gateway engine.",
    icon: Server,
  },
  {
    id: "desktop",
    label: "Desktop (Tauri/Electron)",
    desc: "Native desktop operating system packaging.",
    icon: Monitor,
  },
];

const STACKS_CONFIG: Array<{ id: StackType; label: string; desc: string; badge: string }> = [
  {
    id: "ai-decides",
    label: "Autonomous AI Choice",
    desc: "Brahma Synthesis Engine selects optimal topology based on requirements, scale, and compliance constraints.",
    badge: "Recommended",
  },
  {
    id: "react-fastapi",
    label: "React 19 + Python FastAPI",
    desc: "Vite React SPA client with Python 3.11+ Uvicorn async AST analysis engine and PostgreSQL pooler.",
    badge: "Enterprise Standard",
  },
  {
    id: "next-serverless",
    label: "Next.js 15 + Edge Functions",
    desc: "Modern App Router serverless deployment on Edge Workers with Supabase BaaS integration.",
    badge: "Cloud Native",
  },
  {
    id: "custom",
    label: "Custom Polyglot Mesh",
    desc: "Bring your own language stack (Go, Rust, Node, Java) with standardized Docker containerization.",
    badge: "Custom Microservice",
  },
];

export const Step4TechStack: React.FC<Step4Props> = ({ payload, onChange, errors }) => {
  const togglePlatform = (p: PlatformType) => {
    const current = payload.platforms;
    const exists = current.includes(p);
    let updated: PlatformType[];
    if (exists) {
      updated = current.filter((x) => x !== p);
    } else {
      updated = [...current, p];
    }
    onChange({ platforms: updated });
  };

  const getComplexityGuidance = (score: number) => {
    if (score <= 3) {
      return {
        tier: "Lightweight Architecture",
        desc: "Low AST depth. Single service or CLI utility. Fast test execution under 500ms.",
        color: "text-emerald-400",
      };
    }
    if (score <= 7) {
      return {
        tier: "Standard Enterprise",
        desc: "Multi-tier API, DB transaction pooler, scheduled worker queues, and automated AST scans.",
        color: "text-cyan-400",
      };
    }
    return {
      tier: "High-Density Industrial Leviathan",
      desc: "Distributed microservice mesh, strict cyclomatic ceiling (CCN <= 10), and cryptographic audit ledger.",
      color: "text-purple-400",
    };
  };

  const guidance = getComplexityGuidance(payload.complexity_budget || 5);

  return (
    <div className="space-y-8">
      {/* 1. Target Platforms Multi-Select */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Target Deployment Platforms <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Select all that apply (at least 1 required)
          </span>
        </div>

        {errors["platforms"] && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {errors["platforms"]}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLATFORMS_CONFIG.map(({ id, label, desc, icon: IconComp }) => {
            const isSelected = payload.platforms.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => togglePlatform(id)}
                aria-pressed={isSelected}
                className={`flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                    : "border-border/70 bg-card/40 hover:border-border hover:bg-card/70"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                      isSelected
                        ? "border-primary/40 bg-primary/20 text-primary"
                        : "border-border/60 bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <IconComp className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <span className="font-semibold text-xs text-foreground block">{label}</span>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Stack Radio Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Core Technology Stack <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Determines code templates, AST parsers, and build pipelines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STACKS_CONFIG.map(({ id, label, desc, badge }) => {
            const isSelected = payload.stack === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ stack: id })}
                aria-pressed={isSelected}
                className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                    : "border-border/70 bg-card/40 hover:border-border hover:bg-card/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{label}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                        isSelected
                          ? "bg-primary/20 text-primary font-bold"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-border/40">
                  <span
                    className={`font-mono text-[11px] ${isSelected ? "text-primary font-semibold" : "text-muted-foreground"}`}
                  >
                    {isSelected ? "✓ Stack Active" : "Select Stack"}
                  </span>
                  {id === "ai-decides" && (
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. GitHubConnectorCard Compact */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Github className="h-5 w-5 text-foreground" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">GitHub Codebase Connection</h3>
              <p className="text-xs text-muted-foreground">
                Link an existing repository for automated AST cyclomatic scan upon project creation.
              </p>
            </div>
          </div>
          {payload.repo_full_name ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Connected
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic font-mono">Optional</span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="repo-full-name"
              placeholder="owner/repo-name (e.g. acme/quantum-core)"
              value={payload.repo_full_name || ""}
              onChange={(e) => onChange({ repo_full_name: e.target.value.trim() || null })}
              className="h-9 pl-9 font-mono text-xs"
            />
          </div>
          {payload.repo_full_name && (
            <button
              type="button"
              onClick={() => onChange({ repo_full_name: null })}
              className="text-xs text-muted-foreground hover:text-foreground underline px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4. Complexity Budget Slider */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <Label htmlFor="complexity-slider" className="text-sm font-semibold">
              Architecture Complexity Budget
            </Label>
          </div>
          <span className="rounded bg-primary/20 border border-primary/40 px-2.5 py-0.5 text-xs font-mono font-bold text-primary">
            Score: {payload.complexity_budget || 5} / 10
          </span>
        </div>

        <input
          id="complexity-slider"
          type="range"
          min={1}
          max={10}
          step={1}
          value={payload.complexity_budget || 5}
          onChange={(e) => onChange({ complexity_budget: parseInt(e.target.value, 10) })}
          className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg appearance-none"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>1: Microservice / PoC</span>
          <span>5: Standard Modular Enterprise</span>
          <span>10: Industrial Multi-Mesh</span>
        </div>

        <div className="rounded-lg border border-border/50 bg-background/50 p-2.5 text-xs">
          <span className={`font-semibold ${guidance.color}`}>{guidance.tier}: </span>
          <span className="text-muted-foreground">{guidance.desc}</span>
        </div>
      </div>
    </div>
  );
};
