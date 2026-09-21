/**
 * PROJECT BRAHMA — STEP 2: DOMAIN & SCALE SPECIFICATION
 * Contract: { domain: string (must exist in catalog), domain_secondary: string[].max(3),
 *   scale: enum('prototype','production','enterprise') }
 */

import React, { useState } from "react";
import {
  Globe,
  Smartphone,
  Monitor,
  Server,
  Brain,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Landmark,
  Truck,
  Cpu,
  Gamepad2,
  Terminal,
  Link as LinkIcon,
  Shield,
  Database,
  Glasses,
  Bot,
  HandHeart,
  FlaskConical,
  Users,
  Play,
  Building2,
  Sprout,
  Zap,
  Plane,
  Scale,
  UserCheck,
  Megaphone,
  Check,
  AlertCircle,
  Sparkles,
  X,
  Search,
} from "lucide-react";
import type { WizardPayload, ScaleType, ProjectDomain } from "@/types/wizard";
import { useDomains } from "@/services/catalogService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Step2Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

// Dynamic Icon Resolver for Domains
const DOMAIN_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  smartphone: Smartphone,
  monitor: Monitor,
  server: Server,
  brain: Brain,
  "shopping-cart": ShoppingCart,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  truck: Truck,
  cpu: Cpu,
  "gamepad-2": Gamepad2,
  terminal: Terminal,
  link: LinkIcon,
  shield: Shield,
  database: Database,
  glasses: Glasses,
  bot: Bot,
  "hand-heart": HandHeart,
  "flask-conical": FlaskConical,
  users: Users,
  play: Play,
  "building-2": Building2,
  sprout: Sprout,
  zap: Zap,
  plane: Plane,
  scale: Scale,
  "user-check": UserCheck,
  megaphone: Megaphone,
};

const SCALE_DESCRIPTIONS: Record<
  ScaleType,
  { label: string; desc: string; suggestedStrictness: "advisory" | "standard" | "strict" }
> = {
  prototype: {
    label: "Prototype / PoC",
    desc: "Rapid exploration, relaxed gate strictness, minimal compliance overhead.",
    suggestedStrictness: "advisory",
  },
  production: {
    label: "Production",
    desc: "Standard deployment with automated AST linting, test gates, and CVE scans.",
    suggestedStrictness: "standard",
  },
  enterprise: {
    label: "Enterprise Industrial",
    desc: "Strict deterministic release gates, zero-override security, multi-year audit logs.",
    suggestedStrictness: "strict",
  },
};

export const Step2DomainScale: React.FC<Step2Props> = ({ payload, onChange, errors }) => {
  const { data: domains = [], isLoading, error: catalogError } = useDomains();
  const [domainSearch, setDomainSearch] = useState("");
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  // Filter domains based on search
  const filteredDomains = domains.filter((d: ProjectDomain) => {
    const q = domainSearch.toLowerCase().trim();
    return !q || d.name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q);
  });

  const handlePrimarySelect = (slug: string) => {
    // If it was in secondary, remove it from secondary
    const newSecondary = payload.domain_secondary.filter((s) => s !== slug);
    onChange({ domain: slug, domain_secondary: newSecondary });
  };

  const handleToggleSecondary = (slug: string) => {
    if (slug === payload.domain) return; // cannot be both primary and secondary
    if (payload.domain_secondary.includes(slug)) {
      onChange({ domain_secondary: payload.domain_secondary.filter((s) => s !== slug) });
    } else {
      if (payload.domain_secondary.length >= 3) return; // max 3
      onChange({ domain_secondary: [...payload.domain_secondary, slug] });
    }
  };

  const handleScaleSelect = (scale: ScaleType) => {
    onChange({ scale });
    setDismissedSuggestion(false);
  };

  const currentScaleConfig = SCALE_DESCRIPTIONS[payload.scale || "production"];

  return (
    <div className="space-y-8">
      {/* 1. Scale Segmented Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            System Operational Scale <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            Governs architecture strictness & telemetry frequency
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["prototype", "production", "enterprise"] as ScaleType[]).map((scale) => {
            const isSelected = payload.scale === scale;
            const info = SCALE_DESCRIPTIONS[scale];
            return (
              <button
                key={scale}
                type="button"
                onClick={() => handleScaleSelect(scale)}
                aria-pressed={isSelected}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                    : "border-border/70 bg-card/40 hover:border-border hover:bg-card/70"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{info.label}</span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
              </button>
            );
          })}
        </div>

        {/* 2.3 Dismissible Suggestion Chip (NEVER auto-applied) */}
        {!dismissedSuggestion && (
          <div
            className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs text-primary shadow-sm"
            role="status"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse" />
              <span>
                <strong>Scale Recommendation:</strong> Choosing <em>{currentScaleConfig.label}</em>{" "}
                suggests <strong>{currentScaleConfig.suggestedStrictness.toUpperCase()}</strong>{" "}
                release gate strictness in Step 6.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDismissedSuggestion(true)}
              aria-label="Dismiss recommendation"
              className="ml-2 text-primary/70 hover:text-primary focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Primary Domain Selection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <Label className="text-sm font-medium">
              Primary Architecture Domain <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Select 1 primary domain. Right-click or use &quot;+ Secondary&quot; to attach up to 3
              cross-cutting domains.
            </p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search domains..."
              value={domainSearch}
              onChange={(e) => setDomainSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {errors["domain"] && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {errors["domain"]}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-24 animate-pulse rounded-xl border border-border/50 bg-card/20"
              />
            ))}
          </div>
        ) : catalogError ? (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">BRA-503: Catalog Service Error</p>
              <p>
                Failed to load active domains from database. Please check your Supabase connection.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredDomains.map((d: ProjectDomain) => {
              const isPrimary = payload.domain === d.slug;
              const isSecondary = payload.domain_secondary.includes(d.slug);
              const IconComp = DOMAIN_ICON_MAP[d.icon] || Globe;

              return (
                <div
                  key={d.id}
                  className={`group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all text-left ${
                    isPrimary
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                      : isSecondary
                        ? "border-secondary-foreground/40 bg-secondary/20"
                        : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        isPrimary
                          ? "border-primary/40 bg-primary/20 text-primary"
                          : "border-border/60 bg-background/60 text-muted-foreground"
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {d.name}
                        </span>
                        {d.compliance_pack && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">
                            {d.compliance_pack}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                        {d.description ||
                          `Specialized ${d.name} architectural topology & security patterns.`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handlePrimarySelect(d.slug)}
                      className={`font-medium ${isPrimary ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {isPrimary ? "✓ Primary Domain" : "Set Primary"}
                    </button>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleToggleSecondary(d.slug)}
                        disabled={!isSecondary && payload.domain_secondary.length >= 3}
                        className={`text-[10px] rounded px-1.5 py-0.5 border ${
                          isSecondary
                            ? "border-secondary-foreground/40 bg-secondary text-secondary-foreground font-semibold"
                            : "border-border/60 text-muted-foreground hover:border-border disabled:opacity-40"
                        }`}
                      >
                        {isSecondary ? "Remove Secondary" : "+ Secondary"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Domains Summary Pills */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs">
        <span className="font-medium text-muted-foreground">Active Architecture Topology:</span>
        {payload.domain ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/20 border border-primary/40 px-2.5 py-0.5 font-semibold text-primary">
            Primary:{" "}
            {domains.find((d: ProjectDomain) => d.slug === payload.domain)?.name || payload.domain}
          </span>
        ) : (
          <span className="text-muted-foreground italic">No primary domain selected</span>
        )}

        {payload.domain_secondary.map((secSlug) => {
          const secDomain = domains.find((d: ProjectDomain) => d.slug === secSlug);
          return (
            <span
              key={secSlug}
              className="inline-flex items-center gap-1 rounded-md bg-secondary/80 border border-border px-2 py-0.5 text-secondary-foreground"
            >
              + {secDomain?.name || secSlug}
              <button
                type="button"
                onClick={() => handleToggleSecondary(secSlug)}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label={`Remove secondary domain ${secSlug}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};
