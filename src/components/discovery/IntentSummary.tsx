import React from "react";
import { Sparkles, BrainCircuit, CheckCircle, Tag, Layers, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IntentDeconstruction } from "@/types/discovery";

interface IntentSummaryProps {
  intent: IntentDeconstruction;
  onRefineQuery?: (keyword: string) => void;
}

export function IntentSummary({ intent, onRefineQuery }: IntentSummaryProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.03] backdrop-blur-md p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/10 pb-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BrainCircuit className="size-4 animate-pulse text-primary" />
          <span>Understood Intent & Semantic Decomposition</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Confidence:</span>
          <Badge
            variant="outline"
            className="text-[11px] font-mono border-primary/30 text-primary bg-primary/5"
          >
            {Math.round(intent.confidence * 100)}% Match
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Primary Task & Category */}
        <div className="space-y-1">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" /> Primary Task
          </span>
          <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
            {intent.primaryTask}
          </div>
          <p className="text-[11px] text-muted-foreground/80">Category: {intent.category}</p>
        </div>

        {/* Detected Requirements */}
        <div className="space-y-1.5 md:col-span-2">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <CheckCircle className="size-3.5 text-emerald-400" /> Detected Requirements &
            Constraints
          </span>
          <div className="flex flex-wrap gap-1.5">
            {intent.detectedRequirements.map((req, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/60 text-secondary-foreground text-[11px] border border-border/50"
              >
                <span className="size-1 rounded-full bg-primary" />
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>

      {intent.suggestedKeywords && intent.suggestedKeywords.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center gap-2 text-[11px]">
          <span className="text-muted-foreground flex items-center gap-1">
            <Tag className="size-3" /> Semantic Anchors:
          </span>
          <div className="flex flex-wrap gap-1">
            {intent.suggestedKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => onRefineQuery?.(kw)}
                className="text-primary hover:underline hover:text-primary/80 transition-colors font-mono"
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
