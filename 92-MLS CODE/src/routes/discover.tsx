import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowLeft,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { BrahmaLogo } from "@/components/brahma/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkspacePulse } from "@/components/brahma/WorkspacePulse";
import { DiscoverySearch } from "@/components/discovery/DiscoverySearch";
import { DiscoveryFilters } from "@/components/discovery/DiscoveryFilters";
import { IntentSummary } from "@/components/discovery/IntentSummary";
import { ToolResults } from "@/components/discovery/ToolResults";
import { EmptyDiscoveryState } from "@/components/discovery/EmptyDiscoveryState";
import { discoveryService } from "@/services/discoveryService";
import {
  AITask,
  AITool,
  DiscoveryFilters as IDiscoveryFilters,
  DiscoverySearchResponse,
} from "@/types/discovery";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "AI Discovery & Intent Intelligence — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Intent-first AI discovery engine powered by semantic vector search, hierarchical task taxonomy, and live link health telemetry.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search["q"] as string) || "",
      category: (search["category"] as string) || "",
    };
  },
  component: DiscoverPage,
});

function DiscoverPage() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useState(q || "");
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [filters, setFilters] = useState<IDiscoveryFilters>(() => {
    const initial: IDiscoveryFilters = {
      pricing: "all",
      verification: "all",
      healthStatus: "all",
      hasApi: false,
      sortBy: "relevance",
    };
    if (category) initial.category = category;
    return initial;
  });

  const [searchResponse, setSearchResponse] = useState<DiscoverySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial tasks taxonomy
  useEffect(() => {
    let mounted = true;
    discoveryService.getTasks().then((res) => {
      if (mounted) setTasks(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Execute search when query or filters change
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    discoveryService
      .search(query, filters)
      .then((res) => {
        if (active) {
          setSearchResponse(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Discovery search error:", err);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, filters]);

  // Extract unique categories from tasks
  const categories = useMemo(() => {
    const list = tasks.map((t) => t.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [tasks]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    (
      navigate as unknown as (opts: {
        search: (prev: Record<string, unknown>) => Record<string, unknown>;
      }) => void
    )({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        q: newQuery,
        category: filters.category,
      }),
    });
  };

  const handleRefineIntent = (keyword: string) => {
    const nextQuery = `${query} ${keyword}`.trim();
    handleSearch(nextQuery);
  };

  const handleSelectTask = (taskName: string) => {
    handleSearch(taskName);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <BrahmaLogo />
            </Link>
            <Badge className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/25 text-[11px] font-semibold tracking-wider">
              AI DISCOVERY MATRIX
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <WorkspacePulse variant="compact" />

            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5 border-border"
            >
              <Link to="/help">
                <HelpCircle className="size-3.5" />
                <span className="hidden sm:inline">Help</span>
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground"
            >
              <Link to="/app">
                <LayoutDashboard className="size-3.5" />
                <span>Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Discovery Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Natural Language Intent Search */}
        <DiscoverySearch initialQuery={query} onSearch={handleSearch} isLoading={isLoading} />

        {/* Intent Understood Banner */}
        {searchResponse?.intent && query.trim().length > 0 && (
          <IntentSummary intent={searchResponse.intent} onRefineQuery={handleRefineIntent} />
        )}

        {/* Filter Controls */}
        <DiscoveryFilters
          filters={filters}
          onChange={setFilters}
          tasks={tasks}
          categories={categories}
        />

        {/* Results / Empty States */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono">
              Running vector similarity search & health telemetry...
            </p>
          </div>
        ) : searchResponse && searchResponse.results.length > 0 ? (
          <ToolResults
            results={searchResponse.results}
            query={query}
            executionTimeMs={searchResponse.executionTimeMs}
          />
        ) : (
          <EmptyDiscoveryState
            query={query}
            suggestedRefinements={searchResponse?.suggestedRefinements ?? []}
            nearbyCategories={searchResponse?.nearbyCategories ?? []}
            fallbackTasks={tasks}
            onSelectTask={handleSelectTask}
            onSelectRefinement={handleSearch}
            onResetFilters={() => {
              setFilters({
                pricing: "all",
                verification: "all",
                healthStatus: "all",
                hasApi: false,
                sortBy: "relevance",
              });
              setQuery("");
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 px-4 sm:px-8 text-center text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PROJECT BRAHMA — Intent-Based Autonomous Intelligence Architecture.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live Link Health Crawler Active
            </span>
            <span>pgvector HNSW (384-dim)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
