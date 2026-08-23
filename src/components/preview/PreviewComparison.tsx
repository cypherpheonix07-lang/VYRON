import { AIToolItem } from "./previewData";
import { Scale, Check, X, Trophy, Zap, Shield, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreviewComparisonProps {
  tools: AIToolItem[];
  onRemoveTool: (id: string) => void;
  onClearAll: () => void;
}

export function PreviewComparison({ tools, onRemoveTool, onClearAll }: PreviewComparisonProps) {
  if (tools.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-3">
        <Scale className="size-10 text-muted-foreground/40 mx-auto" />
        <h4 className="text-sm font-semibold text-foreground">No Tools Selected for Comparison</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Pin up to 3 AI platforms using the scale icon on any tool card or sidebar item to see a side-by-side benchmark matrix.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-zinc-950/90 overflow-hidden shadow-2xl space-y-6 p-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            AI Platform Benchmark Matrix ({tools.length}/3)
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs text-muted-foreground hover:text-foreground">
          Clear Comparison
        </Button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-${Math.max(tools.length, 1)} gap-4`}>
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-xl border border-border/80 bg-zinc-900/60 p-5 space-y-4 relative flex flex-col justify-between"
          >
            {/* Remove Pill */}
            <button
              onClick={() => onRemoveTool(tool.id)}
              className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-white hover:bg-zinc-800"
              title="Remove from comparison"
            >
              <X className="size-3.5" />
            </button>

            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                  <Badge variant="outline" className="text-[9px] border-zinc-700 px-1 py-0 h-4 mt-0.5">
                    {tool.category}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{tool.tagline}</p>

              {/* Differentiator Banner */}
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Best For</span>
                <p className="text-cyan-200 text-[11px] font-medium leading-snug">{tool.comparison.bestFor}</p>
              </div>

              {/* Ratings Scores */}
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Synthesis Speed</span>
                  <span className="font-bold text-cyan-400">{tool.comparison.ratings.speed}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${tool.comparison.ratings.speed}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Code Quality</span>
                  <span className="font-bold text-emerald-400">{tool.comparison.ratings.codeQuality}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${tool.comparison.ratings.codeQuality}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Design Fidelity</span>
                  <span className="font-bold text-purple-400">{tool.comparison.ratings.designFidelity}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${tool.comparison.ratings.designFidelity}%` }} />
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Strengths</span>
                  {tool.comparison.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <Check className="size-3 text-emerald-400 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Limitations</span>
                  {tool.comparison.weaknesses.map((w, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <X className="size-3 text-rose-400 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button asChild size="sm" className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs gap-1">
              <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer">
                <span>Visit {tool.name}</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
