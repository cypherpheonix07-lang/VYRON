/**
 * PROJECT BRAHMA — STEP 5: FEATURE CATALOG & AI TASK GOVERNANCE
 * Enforces exact Dependency Table:
 *   R1: payments -> auth (BLOCKING RED, Next disabled until auth on)
 *   R2: realtime -> cost (AMBER notice referencing BudgetCap in step 7)
 *   R3: cms -> file_uploads/storage (AUTO-ENABLE storage with undo toast)
 *   R4: copilot -> any ai_task (AMBER: copilot needs at least one AI task active)
 * Features ProjectTemplateMatcher with top-2 preset recommendations.
 */

import React from "react";
import {
  Shield,
  Search,
  FileText,
  CreditCard,
  Receipt,
  Repeat,
  FileCode,
  UploadCloud,
  Languages,
  Bot,
  BarChart3,
  Binary,
  Radio,
  Bell,
  Smartphone,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { WizardPayload, ProjectTemplate, FeatureToggles } from "@/types/wizard";
import { useProjectTemplates } from "@/services/catalogService";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface Step5Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

// Grouped Feature Catalog
const FEATURE_GROUPS = [
  {
    name: "Core Infrastructure",
    features: [
      {
        key: "auth",
        label: "Authentication & RBAC",
        desc: "User sessions, WebAuthn passkeys, role guards.",
        icon: Shield,
      },
      {
        key: "search",
        label: "Vector & Full-Text Search",
        desc: "Fast indexed search across projects and assets.",
        icon: Search,
      },
      {
        key: "audit_logs",
        label: "Immutable WORM Audit Logs",
        desc: "Tamper-evident operational audit trail.",
        icon: FileText,
      },
    ],
  },
  {
    name: "Commerce & Billing",
    features: [
      {
        key: "payments",
        label: "Stripe Payment Gateway",
        desc: "Credit card checkouts, payment intents, webhooks.",
        icon: CreditCard,
      },
      {
        key: "invoicing",
        label: "Automated Invoicing",
        desc: "PDF tax invoices and accounting exports.",
        icon: Receipt,
      },
      {
        key: "subscriptions",
        label: "Recurring Subscriptions",
        desc: "Tiered subscription billing and seat management.",
        icon: Repeat,
      },
    ],
  },
  {
    name: "Content & Assets",
    features: [
      {
        key: "cms",
        label: "Headless CMS Engine",
        desc: "Markdown content models and live editing.",
        icon: FileCode,
      },
      {
        key: "file_uploads",
        label: "S3 / Supabase File Storage",
        desc: "Multi-part direct uploads with virus scanning.",
        icon: UploadCloud,
      },
      {
        key: "i18n",
        label: "Internationalization (i18n)",
        desc: "Multi-locale translations and currency formatting.",
        icon: Languages,
      },
    ],
  },
  {
    name: "Intelligence & Telemetry",
    features: [
      {
        key: "copilot",
        label: "Architecture AI Copilot",
        desc: "Autonomous synthesis suggestions and refactoring.",
        icon: Bot,
      },
      {
        key: "analytics",
        label: "Telemetry & Metric Dashboards",
        desc: "Recharts event graphs, CCN tracking, API latency.",
        icon: BarChart3,
      },
      {
        key: "embeddings",
        label: "Semantic Vector Embeddings",
        desc: "pgvector similarity cache for codebase comprehension.",
        icon: Binary,
      },
    ],
  },
  {
    name: "Realtime & Operations",
    features: [
      {
        key: "realtime",
        label: "Realtime WebSocket Engine",
        desc: "Live event broadcasting, state sync, presence channels.",
        icon: Radio,
      },
      {
        key: "notifications",
        label: "Multi-Channel Notifications",
        desc: "Transactional email, webhook, and in-app alerts.",
        icon: Bell,
      },
      {
        key: "pwa",
        label: "Progressive Web App (PWA)",
        desc: "Offline service workers, local cache, installable shell.",
        icon: Smartphone,
      },
    ],
  },
];

const AI_TASK_ITEMS = [
  {
    key: "requirement_extraction",
    label: "Requirement Extraction",
    desc: "Parses natural language PRDs into structured SRS specs.",
    tokens: "2.5k tokens",
  },
  {
    key: "architecture_generation",
    label: "Architecture DAG Synthesis",
    desc: "Synthesizes React Flow topological microservice graph.",
    tokens: "6.0k tokens",
  },
  {
    key: "code_review",
    label: "AST Static Analysis",
    desc: "Calculates Lizard cyclomatic complexity & Bandit security flaws.",
    tokens: "4.0k tokens",
  },
  {
    key: "test_generation",
    label: "Automated Test Synthesis",
    desc: "Generates Vitest & Playwright unit/integration tests.",
    tokens: "3.5k tokens",
  },
  {
    key: "report_prose",
    label: "Cryptographic Audit Reports",
    desc: "Compiles tamper-evident release audit PDFs with SHA-256.",
    tokens: "5.0k tokens",
  },
  {
    key: "copilot",
    label: "Autonomous Copilot Dispatcher",
    desc: "Real-time AI architecture orchestrator across all nodes.",
    tokens: "4.5k tokens",
  },
];

export const Step5FeaturesAI: React.FC<Step5Props> = ({ payload, onChange }) => {
  const { data: templates = [] } = useProjectTemplates();

  // R1: payments -> auth check
  const isR1Violated = Boolean(
    payload.feature_toggles["payments"] && !payload.feature_toggles["auth"],
  );

  // R2: realtime -> cost check
  const isR2Active = Boolean(payload.feature_toggles["realtime"]);

  // R4: copilot -> any ai_task active check
  const isCopilotActive = Boolean(payload.ai_tasks["copilot"]);
  const otherAiTasksActive = Object.entries(payload.ai_tasks).some(
    ([k, v]) => k !== "copilot" && Boolean(v),
  );
  const isR4Notice = isCopilotActive && !otherAiTasksActive;

  // Toggle Feature with R3 Rule (cms -> file_uploads auto-enable with undo)
  const handleFeatureToggle = (key: string, enabled: boolean) => {
    const updatedFeatures: FeatureToggles = { ...payload.feature_toggles, [key]: enabled };

    // R3 Rule: cms -> file_uploads
    if (key === "cms" && enabled && !payload.feature_toggles["file_uploads"]) {
      updatedFeatures["file_uploads"] = true;
      toast.info("Auto-enabled File Storage (required by CMS Engine)", {
        action: {
          label: "Undo",
          onClick: () => {
            onChange({
              feature_toggles: {
                ...payload.feature_toggles,
                cms: true,
                file_uploads: false,
              },
            });
          },
        },
      });
    }

    onChange({ feature_toggles: updatedFeatures });
  };

  const handleAiTaskToggle = (key: string, enabled: boolean) => {
    onChange({ ai_tasks: { ...payload.ai_tasks, [key]: enabled } });
  };

  // 3.6 ProjectTemplateMatcher
  // score = |domain ∩ template.domains| + |features ∩ template.modules|
  const matchedTemplates = React.useMemo(() => {
    const userDomain = payload.domain;
    const userFeatures = Object.keys(payload.feature_toggles).filter(
      (k) => payload.feature_toggles[k],
    );

    const scored = templates.map((tpl: ProjectTemplate) => {
      const domainOverlap = tpl.domains.includes(userDomain) ? 1 : 0;
      const featureOverlap = tpl.modules.filter((m) => userFeatures.includes(m)).length;
      const score = domainOverlap * 2 + featureOverlap;
      return { tpl, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 2);
  }, [templates, payload.domain, payload.feature_toggles]);

  const applyTemplatePreset = (tpl: ProjectTemplate) => {
    // Merges feature_toggles only, NEVER overwrites user-typed fields
    const merged = { ...payload.feature_toggles, ...tpl.feature_toggles };
    onChange({ feature_toggles: merged });
    toast.success(`Applied feature preset: "${tpl.name}"`);
  };

  return (
    <div className="space-y-8">
      {/* DEPENDENCY NOTICES & BLOCKING ALERTS */}
      <div className="space-y-3">
        {/* R1: Payments -> Auth (BLOCKING RED) */}
        {isR1Violated && (
          <div
            className="flex items-start gap-3 rounded-xl border border-destructive/80 bg-destructive/10 p-4 text-xs text-destructive shadow-md"
            role="alert"
          >
            <AlertOctagon className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
            <div className="space-y-1">
              <p className="font-bold text-sm">
                Blocking Dependency Violation (R1): Authentication Required
              </p>
              <p>
                Stripe Payments cannot operate without an active Authentication & RBAC layer to
                securely bind payment intents and maintain PCI-DSS compliance. Enable Authentication
                below to proceed.
              </p>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => handleFeatureToggle("auth", true)}
                className="mt-2 h-7 text-xs"
              >
                Enable Authentication Now
              </Button>
            </div>
          </div>
        )}

        {/* R2: Realtime -> Cost (AMBER NOTICE) */}
        {isR2Active && (
          <div
            className="flex items-start gap-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-3.5 text-xs text-amber-300"
            role="status"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                Notice (R2): Realtime Channel Operational Overhead
              </p>
              <p className="text-amber-300/80">
                Active WebSocket connections incur persistent connection pool locks. Review your{" "}
                <strong>Budget Cap</strong> in Step 7 to accommodate high-concurrency event
                broadcast telemetry.
              </p>
            </div>
          </div>
        )}

        {/* R4: Copilot -> AI Tasks (AMBER NOTICE) */}
        {isR4Notice && (
          <div
            className="flex items-start gap-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-3.5 text-xs text-amber-300"
            role="status"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                Notice (R4): Autonomous Copilot Orchestration
              </p>
              <p className="text-amber-300/80">
                The Architecture AI Copilot operates as a synthesis coordinator and needs at least
                one downstream AI task (e.g., AST Analysis or Architecture Synthesis) active to
                dispatch workloads.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3.6 ProjectTemplateMatcher (Top-2 Presets) */}
      {matchedTemplates.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Recommended Architecture Presets
              </h3>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">Domain Match Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedTemplates.map(({ tpl, score }) => (
              <div
                key={tpl.id}
                className="flex flex-col justify-between rounded-lg border border-border/70 bg-card/60 p-3.5 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{tpl.name}</span>
                    <span className="rounded bg-primary/20 text-primary px-1.5 py-0.5 font-mono text-[10px]">
                      Match Score: {score}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                    {tpl.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {tpl.modules.length} modules
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplatePreset(tpl)}
                    className="h-6 text-[11px] text-primary border-primary/40 hover:bg-primary/10"
                  >
                    Apply Preset
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Feature Catalog Grid (Grouped) */}
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Application Feature Modules</Label>
          <p className="text-xs text-muted-foreground">
            Toggle individual architectural building blocks for this workspace.
          </p>
        </div>

        <div className="space-y-6">
          {FEATURE_GROUPS.map((group) => (
            <div key={group.name} className="space-y-2.5">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                {group.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {group.features.map(({ key, label, desc, icon: IconComp }) => {
                  const isChecked = Boolean(payload.feature_toggles[key]);
                  return (
                    <div
                      key={key}
                      className={`flex items-start justify-between rounded-xl border p-3.5 transition-all ${
                        isChecked
                          ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                          : "border-border/60 bg-card/40 hover:border-border"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 pr-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                            isChecked
                              ? "border-primary/40 bg-primary/20 text-primary"
                              : "border-border/50 text-muted-foreground"
                          }`}
                        >
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground block truncate">
                            {label}
                          </span>
                          <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {desc}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(val) => handleFeatureToggle(key, val)}
                        aria-label={`Toggle ${label}`}
                        className="shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. AI Task Toggles */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Autonomous AI Worker Tasks</h3>
          <p className="text-xs text-muted-foreground">
            Assign LLM compute tasks. Cost estimates are calculated dynamically based on average
            token depth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {AI_TASK_ITEMS.map(({ key, label, desc, tokens }) => {
            const isChecked = Boolean(payload.ai_tasks[key]);
            return (
              <div
                key={key}
                className={`flex items-start justify-between rounded-lg border p-3 transition-all ${
                  isChecked
                    ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                    : "border-border/60 bg-background/50"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{label}</span>
                    <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                      {tokens}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{desc}</p>
                </div>
                <Switch
                  checked={isChecked}
                  onCheckedChange={(val) => handleAiTaskToggle(key, val)}
                  aria-label={`Toggle AI task ${label}`}
                  className="shrink-0"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
