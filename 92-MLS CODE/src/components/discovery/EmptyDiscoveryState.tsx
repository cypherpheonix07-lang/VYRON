import React from "react";
import { SearchX, Sparkles, Layers, ArrowRight, Lightbulb, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AITask, AITool } from "@/types/discovery";

interface EmptyDiscoveryStateProps {
  query: string;
  suggestedRefinements?: string[] | undefined;
  nearbyCategories?: string[] | undefined;
  fallbackTasks?: AITask[] | undefined;
  onSelectTask?: ((taskSlug: string) => void) | undefined;
  onSelectRefinement?: ((query: string) => void) | undefined;
  onResetFilters?: (() => void) | undefined;
}

export function EmptyDiscoveryState({
  query,
  suggestedRefinements = [],
  nearbyCategories = [],
  fallbackTasks = [],
  onSelectTask,
  onSelectRefinement,
  onResetFilters,
}: EmptyDiscoveryStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center max-w-3xl mx-auto my-8 space-y-6">
      <div className="size-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-inner">
        <SearchX className="size-8 animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          No exact AI match found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We couldn&apos;t find an exact tool matching &ldquo;
          <span className="text-foreground font-medium">{query}</span>&rdquo; with current filter
          constraints. Our telemetry logged this search to expand taxonomy coverage.
        </p>
      </div>

      {/* Suggested Query Refinements */}
      {suggestedRefinements.length > 0 && (
        <div className="text-left bg-secondary/30 rounded-xl p-4 border border-border/50 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Lightbulb className="size-4 text-amber-400" />
            <span>Suggested Query Refinements</span>
          </div>
          <div className="space-y-1.5">
            {suggestedRefinements.map((refinement, i) => (
              <button
                key={i}
                onClick={() => onSelectRefinement?.(refinement)}
                className="w-full text-left flex items-center justify-between text-xs text-muted-foreground hover:text-primary hover:bg-card/60 p-2 rounded-lg transition-colors group"
              >
                <span>&ldquo;{refinement}&rdquo;</span>
                <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Related Tasks & Categories */}
      {fallbackTasks.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
            <Compass className="size-3.5 text-primary" /> Explore Nearby Core Tasks:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {fallbackTasks.slice(0, 5).map((task) => (
              <Button
                key={task.id}
                variant="outline"
                size="sm"
                className="h-8 text-xs rounded-full gap-1.5 hover:border-primary hover:text-primary"
                onClick={() => onSelectTask?.(task.name)}
              >
                <Layers className="size-3 text-primary" />
                <span>{task.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Reset CTA */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onResetFilters}
          className="text-xs rounded-xl"
        >
          Clear Filters & Show All Tools
        </Button>
      </div>
    </div>
  );
}
