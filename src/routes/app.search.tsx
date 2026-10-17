import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Search,
  FolderKanban,
  Sparkles,
  ShieldAlert,
  FileBarChart2,
  Users,
  Layers,
  ChevronRight,
  ArrowRight,
  Clock,
  ShieldCheck,
  Activity,
  Bot,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { BrahmaLogo } from "@/components/brahma/logo";
import { projectRegistry } from "@/services/project/projectRegistry";
import { useActiveProject } from "@/hooks/useActiveProject";
import { architectureDriftEngine } from "@/services/intelligence/driftEngine";
import { realityMapService } from "@/services/discovery/realityMapService";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/app/search")({
  head: () => ({
    meta: [
      { title: "Global Search — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Platform search utility finding items across live requirements, projects, and architecture findings.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search["q"] as string) || "",
    };
  },
  component: SearchResultsPage,
});

interface SearchItem {
  category: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SearchResultsPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const { project } = useActiveProject();

  const [query, setQuery] = useState(q);
  const [activeCategory, setActiveCategory] = useState("All");
  const [startTime] = useState(performance.now());
  const [executionTimeMs, setExecutionTimeMs] = useState(0);

  // Dynamic Grounded Search Index (E01-E05)
  const searchIndex = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    const isDemo = authService.getCurrentSession()?.mode === "DEMO";

    // 1. Live Projects from canonical registry
    const liveProjects = projectRegistry.getAllProjects();
    for (const proj of liveProjects) {
      items.push({
        category: "Projects",
        title: proj.name,
        subtitle: proj.description || `Canonical Project ${proj.slug} (Health: ${proj.healthScore}%)`,
        href: `/app/projects`,
        badge: proj.slug || proj.id,
        icon: FolderKanban,
      });
    }

    // 2. Live Architecture Drift Findings
    const driftReport = architectureDriftEngine.evaluateDrift();
    for (const finding of driftReport.findings) {
      items.push({
        category: "Drift",
        title: `${finding.id}: ${finding.componentId} (${finding.deviationType})`,
        subtitle: finding.description,
        href: `/app/drift`,
        badge: finding.severity,
        icon: Layers,
      });
    }

    // 3. Reality Map Entities for the active project
    const snapshot = realityMapService.getProjectSnapshot(project?.id || "brahma-core");
    for (const ent of snapshot.entities) {
      items.push({
        category: ent.type === "requirement" ? "Requirements" : ent.type === "test" ? "Tests" : "Components",
        title: ent.name,
        subtitle: `${ent.description} [${ent.sourcePath || "declared"}]`,
        href: `/discover?tab=reality-map`,
        badge: ent.status,
        icon: ent.type === "requirement" ? Sparkles : ent.type === "test" ? ShieldCheck : Layers,
      });
    }

    // 4. Canonical Platform Workspaces & Tools
    items.push(
      {
        category: "Platform",
        title: "12-Stage Forensic Pipeline",
        subtitle: "Deep AST and security pipeline evaluation.",
        href: "/app/analysis",
        badge: "Analysis",
        icon: Activity,
      },
      {
        category: "Platform",
        title: "Release Gates & Twin",
        subtitle: "21-Family gate verification, rehearsal, and reversible rollback.",
        href: "/app/release",
        badge: "Release",
        icon: ShieldCheck,
      },
      {
        category: "Platform",
        title: "Artifact & Export Center",
        subtitle: "Download system blueprints, OpenAPI documentation, and audit records.",
        href: "/app/exports",
        badge: "Exports",
        icon: FileBarChart2,
      },
      {
        category: "Platform",
        title: "ATHER Copilot & Cognitive Center",
        subtitle: "Natural language dual-stream AI assistant.",
        href: "/app/chat",
        badge: "AI Core",
        icon: Bot,
      },
    );

    // 5. Demo fixtures only if mode is explicitly DEMO
    if (isDemo) {
      items.push(
        {
          category: "Templates",
          title: "E-Commerce Gateway Blueprint",
          subtitle: "Acquirer settlement & merchant panel stack.",
          href: "/app/studio/templates",
          badge: "Demo Template",
          icon: BrahmaLogo,
        },
        {
          category: "Datasets",
          title: "IEEE-CIS Fraud & Transaction Drift Benchmark",
          subtitle: "Kaggle benchmark partition with 12,480 live transactions.",
          href: "/app/datasets",
          badge: "Demo Dataset",
          icon: Layers,
        },
      );
    }

    return items;
  }, [project?.id]);

  // Filtered Results with latency measurement (E05, E08, E10)
  const results = useMemo(() => {
    const t0 = performance.now();
    if (!q.trim()) {
      setExecutionTimeMs(0);
      return [];
    }
    const lowerQuery = q.toLowerCase();
    const matches = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.badge.toLowerCase().includes(lowerQuery),
    );
    const finalMatches =
      activeCategory === "All" ? matches : matches.filter((item) => item.category === activeCategory);

    const t1 = performance.now();
    setExecutionTimeMs(Math.round((t1 - t0) * 10) / 10);
    return finalMatches;
  }, [q, activeCategory, searchIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (navigate as unknown as (opts: { to: string; search: { q: string } }) => void)({
      to: "/app/search",
      search: { q: query },
    });
  };

  const categories = useMemo(() => {
    const set = new Set(searchIndex.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [searchIndex]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Discovery Search"
        description="Search across authenticated projects, live architecture invariants, AST drift findings, and platform services."
      />

      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type keywords, entity IDs, or project names..."
            className="pl-9 h-9 text-xs bg-background/50 border-border"
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs h-9">
          Search
        </Button>
      </form>

      {q.trim() !== "" && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="h-7 text-[10px] font-semibold"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
            <Clock className="size-3 text-primary" />
            <span>Indexed in {executionTimeMs}ms</span>
          </div>
        </div>
      )}

      <SectionCard
        title={q.trim() === "" ? "Search Results" : `Matches for "${q}"`}
        description={
          q.trim() === ""
            ? "Enter a query above to lookup live workspace elements."
            : `Found ${results.length} authenticated entries across ${searchIndex.length} total indexed resources.`
        }
      >
        {q.trim() === "" ? (
          <div className="p-16 text-center space-y-2">
            <Search className="size-10 text-muted-foreground/30 mx-auto" />
            <p className="text-xs text-muted-foreground">Type a query above to search records.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Search className="size-10 text-muted-foreground/30 mx-auto" />
            <h4 className="text-xs font-semibold text-foreground">
              No live matches for &lsquo;{q}&rsquo;
            </h4>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Zero-Fiction Law: No synthetic results are fabricated. Check your spelling or active category filters.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button size="sm" variant="outline" className="text-[10px]" asChild>
                <Link to="/app">Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" className="text-[10px]" asChild>
                <Link to="/discover">Reality Map</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {results.map((item, idx) => (
              <Link
                key={`${item.title}-${idx}`}
                to={item.href as never}
                className="py-4 flex items-center justify-between gap-4 group hover:bg-secondary/[0.04] transition-colors rounded-lg px-2 -mx-2"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="grid size-8 place-items-center rounded-lg bg-secondary/80 text-primary shrink-0 mt-0.5">
                    <item.icon className="size-4" />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <Badge variant="outline" className="text-[8px] h-4">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[8px] h-4 font-mono">
                    {item.badge}
                  </Badge>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
