import { useState, useMemo, useEffect } from "react";
import { AI_TOOL_CATALOG, AIToolItem, ToolCategory } from "./previewData";
import { PreviewHeader, LayoutMode } from "./PreviewHeader";
import { PreviewSidebar } from "./PreviewSidebar";
import { PreviewCard } from "./PreviewCard";
import { PreviewComparison } from "./PreviewComparison";
import { Sparkles, Command, Search, Scale, X, Layers, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function PreviewEngine() {
  // Navigation and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [selectedToolId, setSelectedToolId] = useState<string>(
    AI_TOOL_CATALOG[0]?.id || "v0-vercel",
  );
  const [selectedCategories, setSelectedCategories] = useState<ToolCategory[]>([]);
  const [filterOpenSource, setFilterOpenSource] = useState(false);
  const [filterHasApi, setFilterHasApi] = useState(false);
  const [filterGithubSync, setFilterGithubSync] = useState(false);
  const [filterRealtimePreview, setFilterRealtimePreview] = useState(false);

  // Comparison & Command Palette states
  const [comparisonToolIds, setComparisonToolIds] = useState<string[]>(["v0-vercel", "bolt-new"]);
  const [showComparisonView, setShowComparisonView] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keyboard shortcut listener for ⌘K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setShowComparisonView(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Catalog
  const filteredTools = useMemo(() => {
    return AI_TOOL_CATALOG.filter((tool) => {
      // Search text query
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.features.some(
          (f) => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q),
        );

      // Category filters
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(tool.category);

      // Capability filters
      const matchesOpenSource = !filterOpenSource || tool.isOpenSource;
      const matchesHasApi = !filterHasApi || tool.hasApi;
      const matchesGithub = !filterGithubSync || tool.hasGithubSync;
      const matchesPreview = !filterRealtimePreview || tool.hasRealtimePreview;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesOpenSource &&
        matchesHasApi &&
        matchesGithub &&
        matchesPreview
      );
    });
  }, [
    searchQuery,
    selectedCategories,
    filterOpenSource,
    filterHasApi,
    filterGithubSync,
    filterRealtimePreview,
  ]);

  // Toggle Category Filter
  const handleToggleCategory = (category: ToolCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  // Toggle Comparison Pin
  const handleToggleComparisonTool = (toolId: string) => {
    setComparisonToolIds((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      }
      if (prev.length >= 3) {
        toast.error("Maximum 3 tools can be compared simultaneously.");
        return prev;
      }
      toast.success("Added to comparison matrix");
      return [...prev, toolId];
    });
  };

  const comparisonTools = useMemo(() => {
    return AI_TOOL_CATALOG.filter((t) => comparisonToolIds.includes(t.id));
  }, [comparisonToolIds]);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Refreshed all AI platform feeds and template repositories.");
    }, 700);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setFilterOpenSource(false);
    setFilterHasApi(false);
    setFilterGithubSync(false);
    setFilterRealtimePreview(false);
  };

  // Selected tool for focus mode
  const focusedTool = useMemo(() => {
    return AI_TOOL_CATALOG.find((t) => t.id === selectedToolId) || AI_TOOL_CATALOG[0];
  }, [selectedToolId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* HEADER */}
      <PreviewHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        totalTools={AI_TOOL_CATALOG.length}
        filteredCount={filteredTools.length}
        comparisonCount={comparisonToolIds.length}
        isComparisonActive={showComparisonView}
        onToggleComparison={() => setShowComparisonView((prev) => !prev)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        isRefreshing={isRefreshing}
        onRefreshAll={handleRefreshAll}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* SIDEBAR */}
        <PreviewSidebar
          tools={filteredTools}
          selectedToolId={selectedToolId}
          onSelectTool={(id) => {
            setSelectedToolId(id);
            if (layoutMode === "focus") {
              // Stay in focus
            }
          }}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          filterOpenSource={filterOpenSource}
          onToggleOpenSource={() => setFilterOpenSource((p) => !p)}
          filterHasApi={filterHasApi}
          onToggleHasApi={() => setFilterHasApi((p) => !p)}
          filterGithubSync={filterGithubSync}
          onToggleGithubSync={() => setFilterGithubSync((p) => !p)}
          filterRealtimePreview={filterRealtimePreview}
          onToggleRealtimePreview={() => setFilterRealtimePreview((p) => !p)}
          comparisonToolIds={comparisonToolIds}
          onToggleComparisonTool={handleToggleComparisonTool}
        />

        {/* FEED / WORKSPACE */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-[calc(100vh-60px)] space-y-6">
          {/* Comparison View Overlay if Active */}
          {showComparisonView && (
            <div className="space-y-4">
              <PreviewComparison
                tools={comparisonTools}
                onRemoveTool={handleToggleComparisonTool}
                onClearAll={() => setComparisonToolIds([])}
              />
            </div>
          )}

          {/* Active Filter Indicators */}
          {(selectedCategories.length > 0 ||
            filterOpenSource ||
            filterHasApi ||
            filterGithubSync ||
            filterRealtimePreview ||
            searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs bg-zinc-950/40 p-3 rounded-xl border border-border/60">
              <span className="text-[11px] text-muted-foreground">
                Active Filters ({filteredTools.length} results):
              </span>
              {selectedCategories.map((c) => (
                <Badge key={c} variant="secondary" className="gap-1 text-[10px]">
                  {c}
                  <X className="size-3 cursor-pointer" onClick={() => handleToggleCategory(c)} />
                </Badge>
              ))}
              {filterRealtimePreview && (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  Live Preview
                  <X
                    className="size-3 cursor-pointer"
                    onClick={() => setFilterRealtimePreview(false)}
                  />
                </Badge>
              )}
              {filterGithubSync && (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  GitHub Sync
                  <X className="size-3 cursor-pointer" onClick={() => setFilterGithubSync(false)} />
                </Badge>
              )}
              {filterHasApi && (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  Has API
                  <X className="size-3 cursor-pointer" onClick={() => setFilterHasApi(false)} />
                </Badge>
              )}
              {filterOpenSource && (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  Open Source
                  <X className="size-3 cursor-pointer" onClick={() => setFilterOpenSource(false)} />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-6 text-[10px] text-cyan-400 hover:underline px-1.5 ml-auto"
              >
                <RotateCcw className="size-3 mr-1" /> Reset all
              </Button>
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredTools.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-border bg-zinc-950/60 space-y-4 max-w-md mx-auto my-12">
              <Search className="size-10 text-muted-foreground/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">
                  No matching AI platforms found
                </h4>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search query or removing some category and capability filters.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleResetFilters}
                className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
              >
                Clear Filters
              </Button>
            </div>
          ) : layoutMode === "focus" ? (
            // FOCUS MODE: Single full-screen tool inspector
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLayoutMode("grid")}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  &larr; Back to all tools grid
                </Button>
                <span className="text-xs text-muted-foreground font-mono">
                  Inspecting {focusedTool?.name}
                </span>
              </div>
              {focusedTool && (
                <PreviewCard
                  tool={focusedTool}
                  layoutMode="focus"
                  isCompared={comparisonToolIds.includes(focusedTool.id)}
                  onToggleCompare={() => handleToggleComparisonTool(focusedTool.id)}
                  onSelectFocus={() => {}}
                />
              )}
            </div>
          ) : (
            // GRID OR LIST MODE
            <div
              className={
                layoutMode === "grid"
                  ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
                  : "flex flex-col gap-3"
              }
            >
              {filteredTools.map((tool) => (
                <PreviewCard
                  key={tool.id}
                  tool={tool}
                  layoutMode={layoutMode}
                  isCompared={comparisonToolIds.includes(tool.id)}
                  onToggleCompare={() => handleToggleComparisonTool(tool.id)}
                  onSelectFocus={() => {
                    setSelectedToolId(tool.id);
                    setLayoutMode("focus");
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ⌘K COMMAND PALETTE MODAL */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-border bg-zinc-950 shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border/80 pb-3 px-2">
              <Search className="size-4 text-cyan-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, capabilities, or jump directly..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
              />
              <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
                ESC to close
              </Badge>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-1 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Tools &amp; Platforms ({filteredTools.length})
              </div>
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    setSelectedToolId(tool.id);
                    setLayoutMode("focus");
                    setCommandPaletteOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg hover:bg-zinc-900 flex items-center justify-between cursor-pointer text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="font-semibold text-white">{tool.name}</span>
                    <span className="text-zinc-500 text-[11px] truncate max-w-xs">
                      {tool.tagline}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-zinc-800">
                    {tool.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
