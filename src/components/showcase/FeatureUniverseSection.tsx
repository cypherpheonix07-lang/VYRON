import { useState } from "react";
import { FEATURE_FAMILIES, FeatureFamily } from "./showcaseData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Database,
  Layers,
  Search,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

export function FeatureUniverseSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFamilyId, setExpandedFamilyId] = useState<string | null>("architecture-intelligence");

  const categories = ["All", "Intelligence", "Extensibility", "Governance", "Operations"];

  const filteredFamilies = FEATURE_FAMILIES.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedFamilyId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="features" className="py-20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              <Boxes className="size-3.5" />
              <span>The Feature Universe • 17 Capability Families</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Comprehensive Engineering Capabilities
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every capability connects directly to real code, static analysis engines, and governance gates in the
              Brahma platform. Click any feature family to inspect its inputs, outputs, and Copilot integration.
            </p>
          </div>

          {/* SEARCH & CATEGORY FILTERS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                id="feature-search-input"
                name="feature-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter capabilities..."
                className="h-9 w-full sm:w-56 pl-9 pr-3 text-xs rounded-lg border border-border/70 bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg border border-border/70 bg-secondary/30 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 17 CAPABILITY FAMILIES ACCORDION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFamilies.map((family) => {
            const Icon = family.icon;
            const isExpanded = expandedFamilyId === family.id;

            return (
              <Card
                key={family.id}
                className={`transition-all duration-200 border ${
                  isExpanded
                    ? "md:col-span-2 lg:col-span-3 border-primary/50 bg-secondary/20 shadow-md ring-1 ring-primary/20"
                    : "border-border/70 bg-card/60 hover:border-primary/40 hover:bg-card/90"
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  {/* CARD HEADER */}
                  <div
                    onClick={() => toggleExpand(family.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                        <Icon className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                            {family.name}
                          </h3>
                          <Badge variant="outline" className="text-[9px] font-mono py-0 border-border/60">
                            {family.category}
                          </Badge>
                          <Badge className="bg-emerald-500/10 text-emerald-400 text-[9px] py-0">
                            {family.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{family.tagline}</p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>

                  {/* EXPANDED DEEP-DIVE DETAILS (Requirement 156-161) */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-border/60 space-y-4 text-xs">
                      {/* 2-COLUMN EXPLANATION */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border border-border/60 bg-background/60 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                            What It Does
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{family.whatItDoes}</p>
                        </div>

                        <div className="p-3 rounded-lg border border-border/60 bg-background/60 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                            Why It Exists
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{family.whyItExists}</p>
                        </div>
                      </div>

                      {/* DATA IN/OUT & COPILOT INTEGRATION */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border border-border/60 bg-secondary/30 space-y-2">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                            Data Inputs Used
                          </div>
                          <ul className="space-y-1 text-[11px] text-foreground/80">
                            {family.dataInputs.map((input) => (
                              <li key={input} className="flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-cyan-400" />
                                <span>{input}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg border border-border/60 bg-secondary/30 space-y-2">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                            Outputs Produced
                          </div>
                          <ul className="space-y-1 text-[11px] text-foreground/80">
                            {family.outputsProduced.map((out) => (
                              <li key={out} className="flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-emerald-400" />
                                <span>{out}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                            <BrainCircuit className="size-3" /> Copilot Integration
                          </div>
                          <p className="text-[11px] text-foreground/90 leading-relaxed font-medium">
                            {family.copilotIntegration}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
