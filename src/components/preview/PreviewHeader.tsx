import {
  Sparkles,
  LayoutGrid,
  List,
  Maximize2,
  Search,
  SlidersHorizontal,
  Scale,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type LayoutMode = "grid" | "list" | "focus";

interface PreviewHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  totalTools: number;
  filteredCount: number;
  comparisonCount: number;
  isComparisonActive: boolean;
  onToggleComparison: () => void;
  onOpenCommandPalette: () => void;
  isRefreshing: boolean;
  onRefreshAll: () => void;
}

export function PreviewHeader({
  searchQuery,
  onSearchChange,
  layoutMode,
  onLayoutChange,
  totalTools,
  filteredCount,
  comparisonCount,
  isComparisonActive,
  onToggleComparison,
  onOpenCommandPalette,
  isRefreshing,
  onRefreshAll,
}: PreviewHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Sparkles className="size-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-foreground tracking-tight">
              AI Tool Ecosystem Engine
            </h1>
            <Badge
              variant="outline"
              className="h-5 px-1.5 text-[9px] font-mono border-cyan-500/30 text-cyan-400 bg-cyan-950/30"
            >
              LIVE 2026
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Preview, inspect, benchmark &amp; extract UI patterns from {totalTools} top generative
            tools
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative min-w-[200px] sm:min-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tools, tags, features..."
            className="pl-8 h-8 text-xs bg-zinc-950/60 border-border focus-visible:ring-cyan-500/50 rounded-lg"
          />
        </div>

        {/* ⌘K Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCommandPalette}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border bg-zinc-950/40 hidden sm:inline-flex items-center gap-1.5"
          title="Open Command Palette"
        >
          <span className="text-[10px] font-mono font-bold bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700">
            ⌘K
          </span>
        </Button>

        {/* Comparison Mode Toggle */}
        <Button
          variant={isComparisonActive ? "default" : "outline"}
          size="sm"
          onClick={onToggleComparison}
          className={`h-8 px-2.5 text-xs font-semibold gap-1.5 ${
            isComparisonActive
              ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              : "border-border bg-zinc-950/40 text-foreground"
          }`}
        >
          <Scale className="size-3.5" />
          <span>Compare</span>
          {comparisonCount > 0 && (
            <Badge className="h-4 px-1 text-[9px] bg-cyan-950 text-cyan-300 border-none font-mono">
              {comparisonCount}
            </Badge>
          )}
        </Button>

        {/* Layout Switcher */}
        <div className="flex items-center rounded-lg border border-border bg-zinc-950/60 p-0.5">
          <button
            onClick={() => onLayoutChange("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              layoutMode === "grid"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Grid Layout"
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange("list")}
            className={`p-1.5 rounded-md transition-colors ${
              layoutMode === "list"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Compact List Layout"
          >
            <List className="size-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange("focus")}
            className={`p-1.5 rounded-md transition-colors ${
              layoutMode === "focus"
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Focus Mode (Single Tool Fullscreen)"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>

        {/* Global Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefreshAll}
          disabled={isRefreshing}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Refresh All Feeds"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
        </Button>
      </div>
    </header>
  );
}
