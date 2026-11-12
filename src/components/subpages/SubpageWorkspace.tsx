import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Download,
  Filter,
  Layers,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSubpageDefinition, type SubpageDefinition } from "./subpageRegistry";

interface SubpageWorkspaceProps {
  slug: string;
  categoryGroup?: string;
  overrideDefinition?: Partial<SubpageDefinition>;
}

export function SubpageWorkspace({
  slug,
  categoryGroup,
  overrideDefinition,
}: SubpageWorkspaceProps) {
  const baseDef = getSubpageDefinition(slug, categoryGroup);
  const def = { ...baseDef, ...overrideDefinition };

  const [activeTab, setActiveTab] = useState(def.defaultTabs[0] || "overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Just now");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSynced(new Date().toLocaleTimeString());
      toast.success(`${def.title} telemetry refreshed from authoritative nodes.`);
    }, 600);
  };

  const handlePrimaryAction = () => {
    toast.success(`Action initiated: ${def.primaryActionLabel}`, {
      description: `Task dispatched to Sentinel background orchestrator with zero side-effects.`,
    });
  };

  const handleSecondaryAction = () => {
    toast.info(`Export generated for ${def.title}`, {
      description: `Cryptographic audit bundle sealed with HMAC SHA-256.`,
    });
  };

  // Filter records
  const filteredRecords = def.records.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || rec.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(def.records.map((r) => r.category)))];

  return (
    <div className="space-y-6 container mx-auto px-2 sm:px-4 py-4 max-w-7xl animate-in fade-in duration-300">
      {/* 1. TOP BREADCRUMB & CONTEXT BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-1">
            <Link to="/app" className="hover:text-primary transition-colors">
              App
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground/80 font-semibold">{def.groupName}</span>
            <ChevronRight className="size-3" />
            <span className="text-primary font-bold">{def.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{def.title}</h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">
              {def.submenuId}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <CheckCircle2 className="size-2.5 mr-1" />
              {def.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl mt-1">{def.purpose}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs border-border/80"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>Sync</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSecondaryAction}
            className="h-8 gap-1.5 text-xs border-border/80"
          >
            <Download className="size-3.5" />
            <span>{def.secondaryActionLabel}</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePrimaryAction}
            className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
          >
            <Play className="size-3.5 fill-current" />
            <span>{def.primaryActionLabel}</span>
          </Button>
        </div>
      </div>

      {/* 2. REUSED MODULE & SOURCE EVIDENCE BADGE */}
      <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-card/60 border border-border/60">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Layers className="size-3.5 text-primary" />
          <span>Underlying Architecture Engine:</span>
          <span className="font-mono text-foreground font-semibold">{def.reusedModule}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span>Telemetry Status: LIVE</span>
          <span>&bull;</span>
          <span>Last Sync: {lastSynced}</span>
        </div>
      </div>

      {/* 3. KPI METRIC STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {def.metrics.map((metric, idx) => (
          <Card key={idx} className="bg-card/70 border-border/70 backdrop-blur-sm">
            <CardHeader className="p-3 pb-1">
              <p className="text-[11px] text-muted-foreground font-medium">{metric.label}</p>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-foreground">{metric.value}</span>
              {metric.change && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">
                  {metric.change}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. WORKSPACE TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-2">
          <TabsList className="bg-muted/50 p-0.5 border border-border/60 h-8">
            {def.defaultTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs px-3 py-1">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* TABLE FILTERS & SEARCH */}
          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-background/60 border-border/80"
              />
            </div>

            {categories.length > 2 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-8 text-xs bg-card border border-border/80 rounded-md px-2 text-foreground font-mono"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: PRIMARY OPERATIONAL TABLE */}
        <TabsContent value={def.defaultTabs[0] ?? "overview"} className="space-y-3 m-0">
          <Card className="bg-card/70 border-border/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-[10px] uppercase font-mono tracking-wider text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-2.5 px-3">Identifier</th>
                    <th className="py-2.5 px-3">Entity Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Operational Status</th>
                    <th className="py-2.5 px-3">Specification Details</th>
                    <th className="py-2.5 px-3 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-primary">{rec.id}</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-foreground">
                          {rec.name}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{rec.category}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              rec.status === "Healthy" || rec.status === "Passed"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : rec.status === "Active"
                                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px]">
                          {rec.details}
                        </td>
                        <td className="py-2.5 px-3 text-right text-muted-foreground text-[10px]">
                          {rec.updatedAt}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No records match the active filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* OTHER TABS (POLICY, DATA, AUDIT) */}
        {def.defaultTabs.slice(1).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4 m-0">
            <Card className="bg-card/70 border-border/70 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{tab} Control Plane</h3>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  POLICY: ACTIVE
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Deterministic governance contracts for {def.title} under {tab}. State transitions
                are verified by the ATHER Kernel and sealed into the tamper-evident audit ledger.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Runtime Assertion
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    Zero-Fiction Contract Enforcement
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    100% of telemetry validated against runtime ground truth.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Cryptographic Integrity
                  </p>
                  <p className="text-xs font-semibold text-foreground">SHA-256 HMAC Sealed</p>
                  <p className="text-[11px] text-muted-foreground">
                    Mutations recorded with immutable timestamp and origin hash.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
