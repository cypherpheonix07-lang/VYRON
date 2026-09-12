import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Layout,
  FileCode,
  Box,
  Lock,
  Globe,
  Search,
  Layers,
  Code2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FrontendBlueprint, BlueprintPage, BlueprintComponent } from "@/types/websiteStudio";

interface FrontendBlueprintTreeProps {
  blueprint: FrontendBlueprint;
}

export const FrontendBlueprintTree: React.FC<FrontendBlueprintTreeProps> = ({ blueprint }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({
    "page-home": true,
    "page-catalog": true,
  });
  const [selectedComponent, setSelectedComponent] = useState<BlueprintComponent | null>(
    blueprint.components[0] || null
  );

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const getComponentTypeBadge = (type: string) => {
    switch (type) {
      case "atom":
        return <Badge variant="outline" className="text-[10px] py-0 border-blue-500/30 text-blue-400 bg-blue-500/10">Atom</Badge>;
      case "molecule":
        return <Badge variant="outline" className="text-[10px] py-0 border-purple-500/30 text-purple-400 bg-purple-500/10">Molecule</Badge>;
      case "organism":
        return <Badge variant="outline" className="text-[10px] py-0 border-cyan-500/30 text-cyan-400 bg-cyan-500/10">Organism</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] py-0">Component</Badge>;
    }
  };

  const filteredPages = blueprint.pages.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComponents = blueprint.components.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Overview Stats Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">{blueprint.appName}</h3>
            <p className="text-xs text-muted-foreground">{blueprint.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search pages or components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-background/50"
            />
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {blueprint.pages.length} Pages
          </Badge>
          <Badge variant="secondary" className="text-xs shrink-0">
            {blueprint.components.length} Components
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Hierarchy Tree */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Page & Route Hierarchy</span>
            <span>Auth & Layout</span>
          </div>

          <div className="space-y-2">
            {filteredPages.map((page) => {
              const isExpanded = expandedPages[page.id];
              const pageComponents = blueprint.components.filter((c) =>
                page.components.includes(c.id)
              );

              return (
                <div
                  key={page.id}
                  className="rounded-xl border border-border/60 bg-card/30 overflow-hidden transition-all hover:border-border"
                >
                  {/* Page Item Row */}
                  <div
                    onClick={() => togglePage(page.id)}
                    className="p-3 flex items-center justify-between cursor-pointer select-none bg-card/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">{page.name}</span>
                          <span className="font-mono text-[11px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                            {page.route}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {page.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {page.authRequired ? (
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Protected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" /> Public
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px]">
                        {pageComponents.length} Comps
                      </Badge>
                    </div>
                  </div>

                  {/* Expanded Page Components Child List */}
                  {isExpanded && (
                    <div className="p-2.5 pl-8 space-y-1.5 bg-background/30 border-t border-border/40">
                      {pageComponents.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-1">No components linked.</p>
                      ) : (
                        pageComponents.map((comp) => {
                          const isSelected = selectedComponent?.id === comp.id;
                          return (
                            <div
                              key={comp.id}
                              onClick={() => setSelectedComponent(comp)}
                              className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? "border-cyan-500/70 bg-cyan-950/30 text-foreground"
                                  : "border-border/30 bg-card/20 text-muted-foreground hover:text-foreground hover:bg-card/50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Box className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="font-medium font-mono text-[11px]">{comp.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getComponentTypeBadge(comp.type)}
                                <span className="text-[10px] text-muted-foreground">
                                  {comp.props.length} props
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Component Details & Props Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Component Specification Inspector
          </div>

          {selectedComponent ? (
            <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    {selectedComponent.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedComponent.purpose}
                  </p>
                </div>
                {getComponentTypeBadge(selectedComponent.type)}
              </div>

              {/* Props Table */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Declared TypeScript Props (
                  {selectedComponent.props.length})
                </span>
                <div className="rounded-lg border border-border/50 overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-muted/40 p-2 font-semibold text-[11px] text-muted-foreground">
                    <span className="col-span-5">Prop Name</span>
                    <span className="col-span-5">Type</span>
                    <span className="col-span-2 text-right">Req</span>
                  </div>
                  <div className="divide-y divide-border/40 bg-background/40">
                    {selectedComponent.props.map((prop, idx) => (
                      <div key={idx} className="grid grid-cols-12 p-2 items-center text-[11px]">
                        <span className="col-span-5 font-mono font-medium text-foreground">
                          {prop.name}
                        </span>
                        <span className="col-span-5 font-mono text-cyan-400 truncate">
                          {prop.type}
                        </span>
                        <span className="col-span-2 text-right">
                          {prop.required ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Usage Reference */}
              <div className="pt-2 border-t border-border/40 text-xs">
                <span className="text-muted-foreground">Utilized across pages: </span>
                <span className="font-semibold text-foreground">
                  {selectedComponent.usedInPages.join(", ")}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
              Select a component to inspect its TypeScript prop specifications.
            </div>
          )}

          {/* State Management Plan Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-2">
            <h4 className="font-semibold text-xs text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> State Management Architecture
            </h4>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Primary Store:</span>{" "}
              {blueprint.stateManagement.primary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {blueprint.stateManagement.stores.map((store, idx) => (
                <Badge key={idx} variant="secondary" className="font-mono text-[10px]">
                  {store}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
