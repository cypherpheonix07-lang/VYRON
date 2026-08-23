import { useMemo } from "react";
import {
  AIToolItem,
  ToolCategory,
} from "./previewData";
import { Badge } from "@/components/ui/badge";
import { Check, Filter, Layers, Zap, Code2, Globe, Cpu, Scale } from "lucide-react";

interface PreviewSidebarProps {
  tools: AIToolItem[];
  selectedToolId: string;
  onSelectTool: (id: string) => void;
  selectedCategories: ToolCategory[];
  onToggleCategory: (cat: ToolCategory) => void;
  filterOpenSource: boolean;
  onToggleOpenSource: () => void;
  filterHasApi: boolean;
  onToggleHasApi: () => void;
  filterGithubSync: boolean;
  onToggleGithubSync: () => void;
  filterRealtimePreview: boolean;
  onToggleRealtimePreview: () => void;
  comparisonToolIds: string[];
  onToggleComparisonTool: (id: string) => void;
}

const CATEGORIES: { label: ToolCategory; icon: typeof Layers }[] = [
  { label: "UI Builder", icon: Layers },
  { label: "Code Agent", icon: Code2 },
  { label: "Full Stack", icon: Cpu },
  { label: "Design AI", icon: Globe },
  { label: "Productivity & Ops", icon: Zap },
];

export function PreviewSidebar({
  tools,
  selectedToolId,
  onSelectTool,
  selectedCategories,
  onToggleCategory,
  filterOpenSource,
  onToggleOpenSource,
  filterHasApi,
  onToggleHasApi,
  filterGithubSync,
  onToggleGithubSync,
  filterRealtimePreview,
  onToggleRealtimePreview,
  comparisonToolIds,
  onToggleComparisonTool,
}: PreviewSidebarProps) {
  // Count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-border/80 bg-zinc-950/40 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
      {/* Category Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
            <Filter className="size-3 text-cyan-400" /> Categories
          </span>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => selectedCategories.forEach((c) => onToggleCategory(c))}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1">
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const isSelected = selectedCategories.includes(label);
            return (
              <button
                key={label}
                onClick={() => onToggleCategory(label)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </div>
                <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono border-border/60">
                  {categoryCounts[label] || 0}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Capabilities Toggles */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          Capabilities &amp; Specs
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={onToggleRealtimePreview}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              filterRealtimePreview
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "border-border/60 text-muted-foreground hover:text-foreground bg-zinc-900/40"
            }`}
          >
            {filterRealtimePreview && <Check className="size-3 text-cyan-400" />}
            Live Preview
          </button>
          <button
            onClick={onToggleGithubSync}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              filterGithubSync
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "border-border/60 text-muted-foreground hover:text-foreground bg-zinc-900/40"
            }`}
          >
            {filterGithubSync && <Check className="size-3 text-cyan-400" />}
            GitHub Sync
          </button>
          <button
            onClick={onToggleHasApi}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              filterHasApi
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "border-border/60 text-muted-foreground hover:text-foreground bg-zinc-900/40"
            }`}
          >
            {filterHasApi && <Check className="size-3 text-cyan-400" />}
            Public API
          </button>
          <button
            onClick={onToggleOpenSource}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              filterOpenSource
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "border-border/60 text-muted-foreground hover:text-foreground bg-zinc-900/40"
            }`}
          >
            {filterOpenSource && <Check className="size-3 text-cyan-400" />}
            Open Source
          </button>
        </div>
      </div>

      {/* Tool Navigation List */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          Tools Index ({tools.length})
        </span>
        <div className="space-y-1">
          {tools.map((t) => {
            const isSelected = selectedToolId === t.id;
            const inCompare = comparisonToolIds.includes(t.id);
            return (
              <div
                key={t.id}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold"
                    : "text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
                }`}
                onClick={() => onSelectTool(t.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{t.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComparisonTool(t.id);
                  }}
                  title={inCompare ? "Remove from comparison" : "Add to comparison"}
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    inCompare ? "!opacity-100 text-cyan-400" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <Scale className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
