/**
 * PROJECT BRAHMA — STEP 1: IDENTITY & TAXONOMY
 * Contract: { name: min(3).max(60), slug: regex(/^[a-z0-9-]{3,60}$/),
 *   description: max(500), tags: max(8), icon: string, cover: string }
 */

import React, { useState } from "react";
import {
  Folder,
  Globe,
  Smartphone,
  Server,
  Brain,
  Shield,
  Terminal,
  Database,
  Cpu,
  Bot,
  Rocket,
  Layers,
  Code,
  Zap,
  BarChart,
  Activity,
  Lock,
  Box,
  Workflow,
  Cloud,
  Sparkles,
  Wand2,
  Compass,
  Radio,
  X,
  Plus,
} from "lucide-react";
import type { WizardPayload } from "@/types/wizard";
import { generateSlug } from "@/lib/wizardSchemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Step1Props {
  payload: WizardPayload;
  onChange: (patch: Partial<WizardPayload>) => void;
  errors: Record<string, string>;
}

import {
  WORKSPACE_ICON_TAXONOMY,
  WORKSPACE_CATEGORIES,
  getWorkspaceIconByName,
  type WorkspaceCategory,
} from "@/data/workspaceTaxonomy";

// 24 Curated Lucide Icons derived from Canonical Taxonomy
const WIZARD_ICONS = WORKSPACE_ICON_TAXONOMY.map((item) => ({
  name: item.name,
  component: item.icon,
  shortLabel: item.shortLabel,
  longLabel: item.longLabel,
  description: item.description,
  category: item.category,
  suggestedTechnologies: item.suggestedTechnologies,
  suggestedWorkflows: item.suggestedWorkflows,
}));

// Curated Cover Gradient Presets
const COVER_GRADIENTS = [
  {
    label: "Obsidian Cyan",
    value: "from-cyan-900/60 via-slate-900 to-slate-950",
    border: "border-cyan-500/40",
  },
  {
    label: "Hyper Violet",
    value: "from-purple-900/60 via-slate-900 to-slate-950",
    border: "border-purple-500/40",
  },
  {
    label: "Emerald Matrix",
    value: "from-emerald-900/60 via-slate-900 to-slate-950",
    border: "border-emerald-500/40",
  },
  {
    label: "Solar Amber",
    value: "from-amber-900/60 via-slate-900 to-slate-950",
    border: "border-amber-500/40",
  },
  {
    label: "Crimson Forge",
    value: "from-rose-900/60 via-slate-900 to-slate-950",
    border: "border-rose-500/40",
  },
  {
    label: "Deep Indigo",
    value: "from-blue-900/60 via-indigo-950 to-slate-950",
    border: "border-indigo-500/40",
  },
];

export const Step1Identity: React.FC<Step1Props> = ({ payload, onChange, errors }) => {
  const [tagInput, setTagInput] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(payload.slug && payload.slug !== generateSlug(payload.name)),
  );
  const [iconCategoryFilter, setIconCategoryFilter] = useState<string>("ALL");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const patch: Partial<WizardPayload> = { name: newName };
    if (!isSlugManuallyEdited) {
      patch.slug = generateSlug(newName);
    }
    onChange(patch);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") });
  };

  const handleAddTag = () => {
    const cleanTag = tagInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    if (!cleanTag || payload.tags.includes(cleanTag) || payload.tags.length >= 8) return;
    onChange({ tags: [...payload.tags, cleanTag] });
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ tags: payload.tags.filter((t) => t !== tagToRemove) });
  };

  const SelectedIconComp = WIZARD_ICONS.find((i) => i.name === payload.icon)?.component || Folder;

  return (
    <div className="space-y-6">
      {/* Header Banner Preview */}
      <div
        className={`relative overflow-hidden rounded-xl border p-6 bg-gradient-to-r ${payload.cover || (COVER_GRADIENTS[0]?.value ?? "")} transition-all duration-300 shadow-md`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/40 backdrop-blur-md shadow-inner">
            <SelectedIconComp className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-foreground">
              {payload.name || "Untitled Architecture Project"}
            </h2>
            <p className="truncate text-xs font-mono text-muted-foreground">
              {payload.slug ? `brahma://${payload.slug}` : "slug will auto-generate"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Name Field */}
        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-sm font-medium">
            Project Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="project-name"
            placeholder="e.g. Stark Quantum Gateway"
            value={payload.name}
            onChange={handleNameChange}
            aria-invalid={Boolean(errors["name"])}
            aria-describedby={errors["name"] ? "name-error" : undefined}
            className="h-11 font-medium"
          />
          {errors["name"] ? (
            <p id="name-error" className="text-xs text-destructive font-medium" role="alert">
              {errors["name"]}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              3 to 60 characters. Used across reports and blueprints.
            </p>
          )}
        </div>

        {/* Project Slug Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="project-slug" className="text-sm font-medium">
              Project Slug <span className="text-destructive">*</span>
            </Label>
            {isSlugManuallyEdited && (
              <button
                type="button"
                onClick={() => {
                  setIsSlugManuallyEdited(false);
                  onChange({ slug: generateSlug(payload.name) });
                }}
                className="text-xs text-primary hover:underline"
              >
                Reset to auto-slug
              </button>
            )}
          </div>
          <Input
            id="project-slug"
            placeholder="e.g. quantum-pulse-router"
            value={payload.slug}
            onChange={handleSlugChange}
            aria-invalid={Boolean(errors["slug"])}
            aria-describedby={errors["slug"] ? "slug-error" : undefined}
            className="h-11 font-mono text-xs"
          />
          {errors["slug"] ? (
            <p id="slug-error" className="text-xs text-destructive font-medium" role="alert">
              {errors["slug"]}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Lowercase alphanumerics and hyphens only (regex validated).
            </p>
          )}
        </div>
      </div>

      {/* Description Field with Character Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="project-description" className="text-sm font-medium">
            Description & High-Level Scope
          </Label>
          <span
            className={`text-xs font-mono ${
              payload.description.length > 450
                ? "text-amber-500 font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {payload.description.length} / 500
          </span>
        </div>
        <Textarea
          id="project-description"
          placeholder="Describe the architectural objectives, service boundaries, and target workload..."
          value={payload.description}
          onChange={(e) => onChange({ description: e.target.value.slice(0, 500) })}
          rows={3}
          aria-invalid={Boolean(errors["description"])}
          aria-describedby={errors["description"] ? "description-error" : undefined}
          className="resize-none"
        />
        {errors["description"] && (
          <p id="description-error" className="text-xs text-destructive font-medium" role="alert">
            {errors["description"]}
          </p>
        )}
      </div>

      {/* Tags Chip Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="project-tags" className="text-sm font-medium">
            Tags & Taxonomy (Max 8)
          </Label>
          <span className="text-xs text-muted-foreground font-mono">
            {payload.tags.length} / 8 tags
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-card/40 p-2.5 focus-within:ring-2 focus-within:ring-primary/40">
          {payload.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground border border-border/60"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {payload.tags.length < 8 && (
            <div className="flex items-center gap-1">
              <input
                id="project-tags"
                type="text"
                placeholder={
                  payload.tags.length === 0 ? "Type tag and press Enter..." : "Add tag..."
                }
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="h-7 w-36 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                aria-label="Add tag"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        {errors["tags"] && (
          <p className="text-xs text-destructive font-medium" role="alert">
            {errors["tags"]}
          </p>
        )}
      </div>

      {/* Lucide Icon Picker (24 Semantic Categories) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Label className="text-sm font-medium">Select Workspace Icon (24 Semantic Categories)</Label>
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setIconCategoryFilter("ALL")}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-colors ${
                iconCategoryFilter === "ALL"
                  ? "border-primary/50 bg-primary/20 text-primary"
                  : "border-border/50 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              All (24)
            </button>
            {WORKSPACE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setIconCategoryFilter(cat)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-colors ${
                  iconCategoryFilter === cat
                    ? "border-primary/50 bg-primary/20 text-primary"
                    : "border-border/50 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 rounded-lg border border-border/70 bg-card/30 p-3">
          {WIZARD_ICONS.filter(
            (i) => iconCategoryFilter === "ALL" || i.category === iconCategoryFilter,
          ).map(({ name, component: IconComponent, shortLabel, category }) => {
            const isSelected = payload.icon === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange({ icon: name })}
                aria-pressed={isSelected}
                aria-label={`Select ${shortLabel} icon`}
                title={`${shortLabel} (${category})`}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/20 text-primary ring-2 ring-primary/40 shadow-sm"
                    : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card"
                }`}
              >
                <IconComponent className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {/* Rich Taxonomy Metadata Card for Selected Icon */}
        {(() => {
          const selectedMeta = getWorkspaceIconByName(payload.icon) || WORKSPACE_ICON_TAXONOMY[0];
          if (!selectedMeta) return null;
          const IconComp = selectedMeta.icon;
          return (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-primary/15 text-primary">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>{selectedMeta.longLabel}</span>
                      <span className="text-[10px] font-mono font-normal text-muted-foreground">
                        [#{selectedMeta.index}]
                      </span>
                    </h4>
                    <p className="text-[10px] font-medium text-primary/80">{selectedMeta.category}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{selectedMeta.description}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/40 text-[10px]">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-muted-foreground font-medium">Suggested Tech:</span>
                  {selectedMeta.suggestedTechnologies.map((tech) => (
                    <span key={tech} className="px-1.5 py-0.2 bg-muted/70 text-foreground font-mono rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-muted-foreground font-medium">Workflows:</span>
                  {selectedMeta.suggestedWorkflows.map((wf) => (
                    <span key={wf} className="px-1.5 py-0.2 bg-primary/10 text-primary rounded">
                      {wf}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Cover Gradient Picker */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Header Cover Gradient</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {COVER_GRADIENTS.map((grad) => {
            const isSelected = payload.cover === grad.value;
            return (
              <button
                key={grad.label}
                type="button"
                onClick={() => onChange({ cover: grad.value })}
                aria-pressed={isSelected}
                aria-label={`Select ${grad.label} gradient`}
                className={`group relative flex flex-col items-center gap-1.5 rounded-lg border p-2 text-left transition-all ${
                  isSelected
                    ? `${grad.border} ring-2 ring-primary/60 bg-secondary/30`
                    : "border-border/60 hover:border-border hover:bg-secondary/10"
                }`}
              >
                <div className={`h-8 w-full rounded bg-gradient-to-r ${grad.value} shadow-inner`} />
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground truncate w-full text-center">
                  {grad.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
