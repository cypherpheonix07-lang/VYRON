import React from "react";
import { Check, Star, AlertCircle, RefreshCw, Cpu, Layers, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type {
  TechStackComparison,
  SelectedTechStack,
  TechStackOption,
} from "@/types/websiteStudio";

interface TechStackComparatorProps {
  comparison: TechStackComparison;
  selectedStack: SelectedTechStack;
  onSelectOption: (category: "frontend" | "backend" | "database", name: string) => void;
  onResetRecommended: () => void;
  isLoading?: boolean;
}

export const TechStackComparator: React.FC<TechStackComparatorProps> = ({
  comparison,
  selectedStack,
  onSelectOption,
  onResetRecommended,
  isLoading = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 90) return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    if (score >= 80) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  const renderOptionCard = (option: TechStackOption, category: "frontend" | "backend" | "database") => {
    const isSelected = selectedStack[category] === option.name;
    const isRecommended = option.recommended;

    return (
      <div
        key={option.id}
        onClick={() => onSelectOption(category, option.name)}
        className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? "border-cyan-500/80 bg-cyan-950/20 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
            : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              {option.name}
              {isRecommended && (
                <Badge variant="outline" className="text-[10px] py-0 border-amber-500/40 text-amber-400 bg-amber-500/10">
                  <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-400" /> Best Fit
                </Badge>
              )}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">{option.synergyReasoning}</p>
          </div>
          <div className={`px-2 py-0.5 rounded-full border text-xs font-bold ${getScoreColor(option.score)}`}>
            {option.score}/100
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="mt-3 space-y-2 text-xs">
          <div>
            <span className="font-medium text-emerald-400/90 text-[11px] uppercase tracking-wider block mb-1">Advantages</span>
            <ul className="space-y-0.5">
              {option.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                  <Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-medium text-amber-400/90 text-[11px] uppercase tracking-wider block mb-1">Trade-offs</span>
            <ul className="space-y-0.5">
              {option.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                  <span className="text-amber-400 font-mono text-[10px] leading-3 mt-0.5 shrink-0">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Selection State Bar */}
        <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs">
          <span className={`text-[11px] font-medium ${isSelected ? "text-cyan-400" : "text-muted-foreground"}`}>
            {isSelected ? "Selected Layer Component" : "Click to select"}
          </span>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              isSelected ? "border-cyan-400 bg-cyan-500 text-black" : "border-border"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Recommended Combo Rationale Banner */}
      {comparison.recommendedCombo && (
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-background to-blue-950/20 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  AI Architecture Recommendation:
                  <span className="text-cyan-400">
                    {comparison.recommendedCombo.frontend} + {comparison.recommendedCombo.backend} +{" "}
                    {comparison.recommendedCombo.database}
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
                  {comparison.recommendedCombo.rationale}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onResetRecommended}
              className="shrink-0 text-xs border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset to Recommended
            </Button>
          </div>
        </div>
      )}

      {/* 3-Column Comparative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Layer 1: Frontend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-foreground">Frontend Framework</h3>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {comparison.frontendOptions.length} Options
            </Badge>
          </div>
          <div className="space-y-3">
            {comparison.frontendOptions.map((opt) => renderOptionCard(opt, "frontend"))}
          </div>
        </div>

        {/* Layer 2: Backend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm text-foreground">Backend & Compute</h3>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {comparison.backendOptions.length} Options
            </Badge>
          </div>
          <div className="space-y-3">
            {comparison.backendOptions.map((opt) => renderOptionCard(opt, "backend"))}
          </div>
        </div>

        {/* Layer 3: Database */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-sm text-foreground">Database & Storage</h3>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {comparison.databaseOptions.length} Options
            </Badge>
          </div>
          <div className="space-y-3">
            {comparison.databaseOptions.map((opt) => renderOptionCard(opt, "database"))}
          </div>
        </div>
      </div>
    </div>
  );
};
