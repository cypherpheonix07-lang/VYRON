import { useState } from "react";
import { AIToolItem } from "./previewData";
import { PreviewFeatureGrid } from "./PreviewFeatureGrid";
import { PreviewCodePanel } from "./PreviewCodePanel";
import { PreviewInteractionLayer } from "./PreviewInteractionLayer";
import { PreviewResourceFetcher } from "./PreviewResourceFetcher";
import { PreviewEmbed } from "./PreviewEmbed";
import {
  ExternalLink,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  GitBranch,
  Cpu,
  Eye,
  Code2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PreviewCardProps {
  tool: AIToolItem;
  layoutMode: "grid" | "list" | "focus";
  isCompared: boolean;
  onToggleCompare: () => void;
  onSelectFocus: () => void;
}

export function PreviewCard({
  tool,
  layoutMode,
  isCompared,
  onToggleCompare,
  onSelectFocus,
}: PreviewCardProps) {
  const [activeTab, setActiveTab] = useState<
    "features" | "interactive" | "code" | "resources" | "embed"
  >("features");
  const [isExpanded, setIsExpanded] = useState(layoutMode === "focus");

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/preview#${tool.id}`);
    toast.success(`Share link copied for ${tool.name}!`);
  };

  // COMPACT LIST VIEW
  if (layoutMode === "list") {
    return (
      <div className="rounded-xl border border-border/80 bg-zinc-950/60 p-4 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="size-10 rounded-xl flex items-center justify-center border border-zinc-800 bg-zinc-900 shrink-0 font-bold font-mono text-sm"
            style={{ color: tool.accentColor }}
          >
            {tool.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground truncate">{tool.name}</h3>
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-zinc-700">
                {tool.category}
              </Badge>
              <span className="size-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-xl">{tool.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={isCompared ? "default" : "outline"}
            size="sm"
            onClick={onToggleCompare}
            className={`h-7 px-2.5 text-xs gap-1 ${
              isCompared ? "bg-cyan-500 text-zinc-950 font-bold" : "border-border bg-zinc-900/60"
            }`}
          >
            <Scale className="size-3" />
            <span>{isCompared ? "Compared" : "Compare"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSelectFocus}
            className="h-7 px-2.5 text-xs border-border bg-zinc-900/60 text-zinc-300 hover:text-white"
          >
            Inspect Focus
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Official site"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // STANDARD GRID & FOCUS VIEW
  return (
    <article
      id={tool.id}
      className={`rounded-2xl border border-border/80 bg-zinc-950/70 p-5 md:p-6 shadow-xl transition-all duration-300 space-y-5 ${
        layoutMode === "focus"
          ? "ring-1 ring-cyan-500/50 max-w-5xl mx-auto"
          : "hover:border-cyan-500/40 hover:shadow-2xl"
      }`}
    >
      {/* CARD IDENTITY HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className="size-12 rounded-xl flex items-center justify-center border border-zinc-800 bg-zinc-900 font-extrabold font-mono text-base shadow-inner shrink-0"
            style={{ color: tool.accentColor }}
          >
            {tool.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-foreground tracking-tight">{tool.name}</h2>
              <Badge variant="outline" className="text-[10px] font-mono border-zinc-700 px-1.5">
                {tool.category}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>ONLINE</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              {tool.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Copy Share Link"
          >
            <Share2 className="size-3.5" />
          </Button>

          <Button
            variant={isCompared ? "default" : "outline"}
            size="sm"
            onClick={onToggleCompare}
            className={`h-8 px-2.5 text-xs font-semibold gap-1.5 ${
              isCompared
                ? "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-bold"
                : "border-border bg-zinc-900/60 text-zinc-300 hover:text-white"
            }`}
            title="Add to comparison matrix"
          >
            <Scale className="size-3.5" />
            <span className="hidden sm:inline">{isCompared ? "Compared" : "Compare"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-2.5 text-xs border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white gap-1"
          >
            <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer">
              <span>Site</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* TOOL NAVIGATION TABS */}
      <div className="border-b border-border/60 flex items-center gap-2 overflow-x-auto text-xs font-medium pb-1">
        <button
          onClick={() => setActiveTab("features")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "features"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="size-3.5" /> Features ({tool.features.length})
        </button>

        <button
          onClick={() => setActiveTab("interactive")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "interactive"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Cpu className="size-3.5" /> Interactive Sandbox
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "code"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="size-3.5" /> Code &amp; Config ({tool.codeSnippets.length})
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "resources"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GitBranch className="size-3.5" /> Templates &amp; Feed
        </button>

        <button
          onClick={() => setActiveTab("embed")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "embed"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eye className="size-3.5" /> Live Frame
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div className="pt-1">
        {activeTab === "features" && (
          <PreviewFeatureGrid features={tool.features} accentColor={tool.accentColor} />
        )}

        {activeTab === "interactive" && (
          <PreviewInteractionLayer
            toolId={tool.id}
            toolName={tool.name}
            accentColor={tool.accentColor}
          />
        )}

        {activeTab === "code" && <PreviewCodePanel snippets={tool.codeSnippets} />}

        {activeTab === "resources" && (
          <PreviewResourceFetcher
            toolName={tool.name}
            resources={tool.resources}
            changelog={tool.changelog}
          />
        )}

        {activeTab === "embed" && (
          <PreviewEmbed toolName={tool.name} url={tool.officialUrl} category={tool.category} />
        )}
      </div>

      {/* COMPARISON CALLOUT FOOTER */}
      <div className="border-t border-border/40 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Vs. {tool.comparison.closestCompetitor}:
          </span>
          <span className="text-zinc-300 text-[11px]">{tool.comparison.keyDifference}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-emerald-400">Best For:</span>
          <span className="text-zinc-300 text-[11px] font-medium">{tool.comparison.bestFor}</span>
        </div>
      </div>
    </article>
  );
}
