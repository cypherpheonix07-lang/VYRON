import React, { useState } from "react";
import { Palette, Layout, Type, Check, Sparkles, Sliders, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export interface DesignSystemTokens {
  presetName: string;
  colors: {
    primary: string;
    secondary: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    accent: string;
    textPrimary: string;
    textMuted: string;
  };
  typography: {
    fontFamily: string;
    baseSize: string;
    scaleRatio: string;
  };
  layout: {
    template: "sidebar-topbar" | "topnav-only" | "minimal";
    radius: string;
    spacing: string;
  };
}

export const PRESET_DESIGN_SYSTEMS: Record<string, DesignSystemTokens> = {
  "obsidian-cyan": {
    presetName: "Obsidian Cyan (BRAHMA)",
    colors: {
      primary: "oklch(0.78 0.16 200)", // Vibrant Cyan
      secondary: "oklch(0.65 0.18 250)", // Deep Indigo
      surface: "oklch(0.16 0.02 240)", // Dark Obsidian
      surfaceElevated: "oklch(0.22 0.03 240)",
      border: "oklch(0.30 0.04 240)",
      accent: "oklch(0.85 0.15 180)",
      textPrimary: "oklch(0.98 0.01 240)",
      textMuted: "oklch(0.65 0.03 240)",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      baseSize: "16px",
      scaleRatio: "1.25 (Major Third)",
    },
    layout: {
      template: "sidebar-topbar",
      radius: "0.5rem",
      spacing: "Normal",
    },
  },
  "midnight-violet": {
    presetName: "Midnight Violet",
    colors: {
      primary: "oklch(0.70 0.22 300)", // Neon Violet
      secondary: "oklch(0.60 0.20 330)", // Magenta
      surface: "oklch(0.14 0.03 290)", // Deep Violet Black
      surfaceElevated: "oklch(0.20 0.04 290)",
      border: "oklch(0.28 0.06 290)",
      accent: "oklch(0.82 0.18 310)",
      textPrimary: "oklch(0.98 0.01 290)",
      textMuted: "oklch(0.65 0.04 290)",
    },
    typography: {
      fontFamily: "Outfit, sans-serif",
      baseSize: "16px",
      scaleRatio: "1.33 (Perfect Fourth)",
    },
    layout: {
      template: "sidebar-topbar",
      radius: "0.75rem",
      spacing: "Compact",
    },
  },
  "forest-emerald": {
    presetName: "Forest Emerald",
    colors: {
      primary: "oklch(0.75 0.18 150)", // Emerald Green
      secondary: "oklch(0.62 0.16 170)", // Teal
      surface: "oklch(0.15 0.02 160)", // Deep Forest
      surfaceElevated: "oklch(0.21 0.03 160)",
      border: "oklch(0.28 0.04 160)",
      accent: "oklch(0.82 0.15 140)",
      textPrimary: "oklch(0.98 0.01 160)",
      textMuted: "oklch(0.65 0.03 160)",
    },
    typography: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
      baseSize: "16px",
      scaleRatio: "1.25 (Major Third)",
    },
    layout: {
      template: "topnav-only",
      radius: "0.375rem",
      spacing: "Relaxed",
    },
  },
  "sunset-amber": {
    presetName: "Sunset Amber",
    colors: {
      primary: "oklch(0.80 0.19 75)", // Warm Amber
      secondary: "oklch(0.65 0.22 40)", // Crimson Orange
      surface: "oklch(0.15 0.02 50)", // Warm Charcoal
      surfaceElevated: "oklch(0.22 0.03 50)",
      border: "oklch(0.30 0.05 50)",
      accent: "oklch(0.88 0.16 85)",
      textPrimary: "oklch(0.98 0.01 50)",
      textMuted: "oklch(0.68 0.04 50)",
    },
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      baseSize: "16px",
      scaleRatio: "1.20 (Minor Third)",
    },
    layout: {
      template: "minimal",
      radius: "0.5rem",
      spacing: "Normal",
    },
  },
};

export interface DesignSystemPickerProps {
  value: DesignSystemTokens;
  onChange: (ds: DesignSystemTokens) => void;
}

export function DesignSystemPicker({ value, onChange }: DesignSystemPickerProps) {
  const [activePreset, setActivePreset] = useState<string>("obsidian-cyan");
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const handleSelectPreset = (key: string) => {
    setActivePreset(key);
    setIsCustom(false);
    onChange(PRESET_DESIGN_SYSTEMS[key]!);
  };

  const handleCustomColorChange = (key: keyof DesignSystemTokens["colors"], colorVal: string) => {
    setIsCustom(true);
    onChange({
      ...value,
      presetName: "Custom Design Tokens",
      colors: {
        ...value.colors,
        [key]: colorVal,
      },
    });
  };

  const handleLayoutTemplateChange = (tmpl: DesignSystemTokens["layout"]["template"]) => {
    onChange({
      ...value,
      layout: {
        ...value.layout,
        template: tmpl,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Preset Selector Header */}
      <div>
        <Label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Palette className="size-4 text-cyan-400" /> Choose Design System Token Preset
        </Label>
        <p className="text-xs text-slate-400 mt-1">
          Select an OKLCH color token architecture with harmonious contrast and typographic hierarchy.
        </p>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(PRESET_DESIGN_SYSTEMS).map(([key, preset]) => {
          const isSelected = !isCustom && activePreset === key;
          return (
            <div
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all relative ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              {isSelected && (
                <Badge className="absolute top-2 right-2 bg-cyan-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5">
                  <Check className="size-2.5 mr-0.5" /> Active
                </Badge>
              )}
              <h4 className="text-xs font-bold text-white mb-2">{preset.presetName}</h4>
              {/* Swatches */}
              <div className="flex items-center gap-1.5 mb-3">
                <div
                  className="size-5 rounded-full border border-slate-700"
                  style={{ backgroundColor: preset.colors.primary }}
                  title="Primary"
                />
                <div
                  className="size-5 rounded-full border border-slate-700"
                  style={{ backgroundColor: preset.colors.secondary }}
                  title="Secondary"
                />
                <div
                  className="size-5 rounded-full border border-slate-700"
                  style={{ backgroundColor: preset.colors.surface }}
                  title="Surface"
                />
                <div
                  className="size-5 rounded-full border border-slate-700"
                  style={{ backgroundColor: preset.colors.border }}
                  title="Border"
                />
                <div
                  className="size-5 rounded-full border border-slate-700"
                  style={{ backgroundColor: preset.colors.accent }}
                  title="Accent"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {preset.typography.fontFamily.split(",")[0]} • {preset.layout.template}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Token Toggle */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCustom(!isCustom)}
          className={`text-xs ${isCustom ? "border-cyan-500 text-cyan-400" : "border-slate-800 text-slate-300"}`}
        >
          <Sliders className="size-3.5 mr-1.5" />
          {isCustom ? "Custom Mode Enabled" : "Customize Specific Tokens"}
        </Button>
        <span className="text-xs font-mono text-slate-500">
          Template: <strong className="text-slate-300">{value.layout.template}</strong>
        </span>
      </div>

      {/* Custom Token Editors */}
      {isCustom && (
        <Card className="border-slate-800 bg-slate-950/70 p-4 rounded-xl">
          <CardContent className="p-0 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-cyan-400" /> Fine-Tune OKLCH Tokens
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-[11px] text-slate-400">Primary Token</Label>
                <Input
                  value={value.colors.primary}
                  onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-900 border-slate-800 mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px] text-slate-400">Secondary Token</Label>
                <Input
                  value={value.colors.secondary}
                  onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-900 border-slate-800 mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px] text-slate-400">Surface Base</Label>
                <Input
                  value={value.colors.surface}
                  onChange={(e) => handleCustomColorChange("surface", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-900 border-slate-800 mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px] text-slate-400">Accent Token</Label>
                <Input
                  value={value.colors.accent}
                  onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-900 border-slate-800 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Template Selector & Live Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Layout Template Radio */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layout className="size-3.5 text-cyan-400" /> Layout Template
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(["sidebar-topbar", "topnav-only", "minimal"] as const).map((tmpl) => (
              <button
                type="button"
                key={tmpl}
                onClick={() => handleLayoutTemplateChange(tmpl)}
                className={`text-xs p-2.5 rounded-lg border text-center font-medium transition-all ${
                  value.layout.template === tmpl
                    ? "border-cyan-500 bg-cyan-500/10 text-white"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {tmpl === "sidebar-topbar" ? "Sidebar + Topbar" : tmpl === "topnav-only" ? "Topnav Only" : "Minimal"}
              </button>
            ))}
          </div>
        </div>

        {/* Live Token Preview Card */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Eye className="size-3.5 text-cyan-400" /> Live Token Preview
          </Label>
          <div
            className="rounded-lg p-3.5 border transition-all"
            style={{
              backgroundColor: value.colors.surface,
              borderColor: value.colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: value.colors.textPrimary }} className="text-xs font-bold">
                Sample Card Component
              </span>
              <span
                style={{
                  backgroundColor: value.colors.primary,
                  color: value.colors.surface,
                }}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              >
                Primary Button
              </span>
            </div>
            <p style={{ color: value.colors.textMuted }} className="text-[11px] leading-relaxed">
              Design tokens reactively harmonize typography ({value.typography.fontFamily.split(",")[0]}), border radiuses ({value.layout.radius}), and background depths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
