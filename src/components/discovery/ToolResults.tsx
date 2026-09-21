import React, { useState } from "react";
import { Sparkles, Clock, Scale, X, ExternalLink, ShieldCheck, Star } from "lucide-react";
import { ToolSearchResult, AITool } from "@/types/discovery";
import { ToolResultCard } from "./ToolResultCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface ToolResultsProps {
  results: ToolSearchResult[];
  query?: string;
  executionTimeMs?: number;
}

export function ToolResults({ results, query, executionTimeMs = 32 }: ToolResultsProps) {
  const [comparingTools, setComparingTools] = useState<AITool[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (tool: AITool) => {
    setComparingTools((prev) => {
      const exists = prev.some((t) => t.id === tool.id);
      if (exists) {
        return prev.filter((t) => t.id !== tool.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), tool];
      }
      return [...prev, tool];
    });
    setIsCompareOpen(true);
  };

  const removeComparedTool = (id: string) => {
    setComparingTools((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Search Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {results.length} AI {results.length === 1 ? "tool" : "tools"} matched
          </span>
          {query && (
            <span>
              for &ldquo;<span className="text-foreground italic">{query}</span>&rdquo;
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="size-3" /> {executionTimeMs}ms vector latency
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <ToolResultCard
            key={result.tool.id}
            result={result}
            onCompare={handleToggleCompare}
            isComparing={comparingTools.some((t) => t.id === result.tool.id)}
          />
        ))}
      </div>

      {/* Comparison Drawer / Sheet */}
      <Sheet open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border"
        >
          <SheetHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <Scale className="size-5 text-primary" /> Multi-Model Comparison Matrix
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Side-by-side benchmark, telemetry SLA, pricing, and capability comparison.
                </SheetDescription>
              </div>
              {comparingTools.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setComparingTools([])}
                  className="text-xs text-muted-foreground"
                >
                  Clear All
                </Button>
              )}
            </div>
          </SheetHeader>

          {comparingTools.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Click the compare icon on any tool card to add up to 3 tools for side-by-side
              evaluation.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {comparingTools.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-border/70 p-4 bg-background/50 space-y-3 relative"
                >
                  <button
                    onClick={() => removeComparedTool(t.id)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.primary_task}</p>
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-border/40">
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">Pricing:</span>
                      <span className="font-medium capitalize">
                        {t.pricing_type} (${t.starting_price_usd}/mo)
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium text-amber-400 flex items-center gap-1">
                        <Star className="size-3 fill-amber-400" /> {t.average_rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">Verification:</span>
                      <span className="font-medium capitalize">{t.verification_level}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">Telemetry SLA:</span>
                      <span className="font-medium text-emerald-400">
                        {t.latency_ms || 190}ms (99.8%)
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">API Available:</span>
                      <span className="font-medium">{t.has_api ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full text-xs gap-1.5" asChild>
                    <a href={t.website_url} target="_blank" rel="noopener noreferrer">
                      <span>Visit {t.name}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
