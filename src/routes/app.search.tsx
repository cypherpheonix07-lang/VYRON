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
} from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { BrahmaLogo } from "@/components/brahma/logo";

export const Route = createFileRoute("/app/search")({
  head: () => ({
    meta: [
      { title: "Search Results — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Platform search utility finding items across requirements and codebase logs.",
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

function SearchResultsPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useState(q);
  const [activeCategory, setActiveCategory] = useState("All");

  const searchIndex = useMemo(() => {
    return [
      {
        category: "Projects",
        title: "Aurora Payments Gateway",
        subtitle: "PCI-aware fintech payment orchestration system.",
        href: "/app/projects/brahma-core",
        badge: "brahma-core",
        icon: FolderKanban,
      },
      {
        category: "Projects",
        title: "MediSync Patient Portal",
        subtitle: "Clinical appointment and laboratory report sync tool.",
        href: "/app/projects/medisync",
        badge: "medisync",
        icon: FolderKanban,
      },
      {
        category: "Projects",
        title: "Smart Campus Portal",
        subtitle: "University attendance and grades dashboard.",
        href: "/app/projects/campusflow",
        badge: "campusflow",
        icon: FolderKanban,
      },
      {
        category: "Requirements",
        title: "FR-02 Retry settlements idempotently",
        subtitle: "Must retry failed settlements with idempotency keys.",
        href: "/app/projects/brahma-core/requirements",
        badge: "brahma-core",
        icon: Sparkles,
      },
      {
        category: "Vulnerabilities",
        title: "Hardcoded signing secret in auth module",
        subtitle: "Critical JWT signature verification risk.",
        href: "/app/projects/brahma-core/security",
        badge: "brahma-core",
        icon: ShieldAlert,
      },
      {
        category: "Reports",
        title: "Executive Summary — August PDF",
        subtitle: "Executive blueprint summary ready.",
        href: "/app/reports",
        badge: "Global",
        icon: FileBarChart2,
      },
      {
        category: "Members",
        title: "Puli Phanindhra",
        subtitle: "Full Stack Developer & Cybersecurity Researcher.",
        href: "/app/team",
        badge: "Editor",
        icon: Users,
      },
      {
        category: "Templates",
        title: "E-Commerce Gateway Blueprint",
        subtitle: "Acquirer settlement & merchant panel stack.",
        href: "/app/studio/templates",
        badge: "Template",
        icon: BrahmaLogo,
      },
      {
        category: "Missions",
        title: "MSN-SETTLE-01: Zero-Loss Settlement Verification",
        subtitle: "Multi-step agentic mission verifying idempotent settlements.",
        href: "/app/missions",
        badge: "Mission",
        icon: FolderKanban,
      },
      {
        category: "Drift",
        title: "DFT-01: Settlement Engine Missing from Repository AST",
        subtitle: "Structural divergence between blueprint and observed source code.",
        href: "/app/drift",
        badge: "Drift",
        icon: Layers,
      },
      {
        category: "Impact",
        title: "IMP-01: Direct & Transitive Blast Radius Analysis",
        subtitle: "Blast radius computation for payment gateway changes.",
        href: "/app/impact",
        badge: "Impact",
        icon: ShieldAlert,
      },
      {
        category: "Decisions",
        title: "ADR-001: SHA-256 HMAC for Webhook Signatures",
        subtitle: "Cryptographically sealed architectural decision record.",
        href: "/app/missions",
        badge: "ADR",
        icon: ShieldAlert,
      },
      {
        category: "Simulation",
        title: "SIM-01: 11 Concrete Anomaly Scenarios",
        subtitle: "Interactive failure injection and deterministic reset lab.",
        href: "/app/simulation",
        badge: "Simulation",
        icon: Sparkles,
      },
      {
        category: "Datasets",
        title: "IEEE-CIS Fraud & Transaction Drift Benchmark",
        subtitle: "Kaggle benchmark partition with 12,480 live transactions.",
        href: "/app/datasets",
        badge: "Dataset",
        icon: Layers,
      },
      {
        category: "Plugins",
        title: "Claude-Inspired Extensibility Plugins",
        subtitle: "Manifest-governed plugins for analysis, GitHub, and reports.",
        href: "/app/plugins",
        badge: "Plugin",
        icon: Layers,
      },
    ];
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lowerQuery = q.toLowerCase();
    const matches = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery),
    );
    if (activeCategory === "All") return matches;
    return matches.filter((item) => item.category === activeCategory);
  }, [q, activeCategory, searchIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/app/search", search: { q: query } });
  };

  const categories = [
    "All",
    "Projects",
    "Missions",
    "Drift",
    "Impact",
    "Decisions",
    "Simulation",
    "Datasets",
    "Requirements",
    "Vulnerabilities",
    "Reports",
    "Plugins",
    "Members",
    "Templates",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Search"
        description="Browse assets across all active workspaces and compliance records."
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
            placeholder="Type search parameters..."
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs h-9">
          Search
        </Button>
      </form>

      {q.trim() !== "" && (
        <div className="flex flex-wrap gap-2">
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
      )}

      <SectionCard
        title={q.trim() === "" ? "Search results" : `Matches for "${q}"`}
        description={
          q.trim() === ""
            ? "Enter a query above to lookup elements."
            : `Found ${results.length} matching entries.`
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
              No matches for &lsquo;{q}&rsquo;
            </h4>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Verify terms spelling, check category filters, or explore suggested platform sections
              below.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button size="sm" variant="outline" className="text-[10px]" asChild>
                <Link to="/app">Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" className="text-[10px]" asChild>
                <Link to="/app/studio">AI Studio</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {results.map((item) => (
              <Link
                key={item.title}
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
