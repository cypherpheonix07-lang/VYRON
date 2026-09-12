import React from "react";
import {
  ShieldCheck,
  CreditCard,
  FileText,
  Languages,
  BarChart3,
  Mail,
  UploadCloud,
  Search,
  Moon,
  Smartphone,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export interface FeatureToggleItem {
  id: string;
  name: string;
  description: string;
  category: "Core" | "Commerce" | "Content" | "DevOps";
  icon: React.ComponentType<{ className?: string }>;
  dependsOn?: string[];
}

export const AVAILABLE_FEATURES: FeatureToggleItem[] = [
  // Core
  {
    id: "auth",
    name: "Authentication & RBAC",
    description: "Multi-tenant auth, passwordless magic links, and role-based permissions.",
    category: "Core",
    icon: ShieldCheck,
  },
  {
    id: "search",
    name: "Full-Text & Vector Search",
    description: "Instant sub-millisecond search across products, docs, and assets.",
    category: "Core",
    icon: Search,
  },
  {
    id: "darkMode",
    name: "Dark & Light Token Switcher",
    description: "Zero-flicker theme toggle with system preference synchronization.",
    category: "Core",
    icon: Moon,
  },

  // Commerce
  {
    id: "payments",
    name: "Stripe / UPI Payments",
    description: "Checkout flows, recurring subscriptions, and webhook reconciliation.",
    category: "Commerce",
    icon: CreditCard,
    dependsOn: ["auth"],
  },

  // Content
  {
    id: "cms",
    name: "Headless CMS & Markdown",
    description: "Rich content modeling, blog publishing, and live markdown preview.",
    category: "Content",
    icon: FileText,
  },
  {
    id: "i18n",
    name: "Internationalization (i18n)",
    description: "Multi-locale routing, automatic locale detection, and string catalog.",
    category: "Content",
    icon: Languages,
  },
  {
    id: "fileUploads",
    name: "Secure S3 / R2 File Uploads",
    description: "Presigned direct browser uploads with cryptographic checksum validation.",
    category: "Content",
    icon: UploadCloud,
    dependsOn: ["auth"],
  },

  // DevOps
  {
    id: "analytics",
    name: "Telemetry & Performance Events",
    description: "Core Web Vitals tracking, custom funnels, and error monitoring.",
    category: "DevOps",
    icon: BarChart3,
  },
  {
    id: "emailNotifications",
    name: "Transactional Emails",
    description: "Resend / Postmark email templates with delivery status webhooks.",
    category: "DevOps",
    icon: Mail,
  },
  {
    id: "pwa",
    name: "Progressive Web App (PWA)",
    description: "Service worker caching, offline capability, and installable web manifest.",
    category: "DevOps",
    icon: Smartphone,
  },
];

export interface FeatureToggleGridProps {
  value: Record<string, boolean>;
  onChange: (features: Record<string, boolean>) => void;
}

export function FeatureToggleGrid({ value, onChange }: FeatureToggleGridProps) {
  const handleToggle = (id: string) => {
    const nextVal = !value[id];
    const updated = { ...value, [id]: nextVal };

    // If disabling auth, warn or disable dependent features
    if (id === "auth" && !nextVal) {
      // keep payments disabled
    }

    onChange(updated);
  };

  const categories: Array<"Core" | "Commerce" | "Content" | "DevOps"> = [
    "Core",
    "Commerce",
    "Content",
    "DevOps",
  ];

  const selectedCount = Object.values(value).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header with Selected Count */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-slate-200">
            Select Application Features & Integrations
          </Label>
          <p className="text-xs text-slate-400 mt-1">
            Toggle foundational capabilities to dynamically scaffold routes, database schemas, and API contracts.
          </p>
        </div>
        <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-xs">
          {selectedCount} / {AVAILABLE_FEATURES.length} Enabled
        </Badge>
      </div>

      {/* Categorized Grid */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const items = AVAILABLE_FEATURES.filter((f) => f.category === cat);
          return (
            <div key={cat} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                {cat} Layer
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((feature) => {
                  const isChecked = Boolean(value[feature.id]);
                  const Icon = feature.icon;
                  const unmetDependency = feature.dependsOn?.find((depId) => !value[depId]);

                  return (
                    <div
                      key={feature.id}
                      onClick={() => handleToggle(feature.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked
                              ? "bg-cyan-500 text-slate-950 font-bold"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-white block">
                            {feature.name}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {feature.description}
                          </p>

                          {/* Dependency Warning */}
                          {isChecked && unmetDependency && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                              <AlertTriangle className="size-3" /> Requires {unmetDependency.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Switch
                        checked={isChecked}
                        onCheckedChange={() => handleToggle(feature.id)}
                        className="data-[state=checked]:bg-cyan-500 shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
