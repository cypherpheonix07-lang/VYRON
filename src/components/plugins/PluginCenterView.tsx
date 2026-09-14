import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Activity,
  Database,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  Power,
  Zap,
  Info,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pluginRegistry } from "@/plugins/PluginRegistry";
import { PluginManifest, PluginCategory, PluginAuditEvent } from "@/plugins/types";
import { useCopilot } from "@/state/copilot/useCopilot";
import { useAppMode } from "@/state/mode/useAppMode";
import { cn } from "@/lib/utils";

export function PluginCenterView() {
  const { mode } = useAppMode();
  const { setDrawerOpen, sendMessage } = useCopilot();
  const [plugins, setPlugins] = useState<PluginManifest[]>(() => pluginRegistry.listManifests());
  const [auditLogs, setAuditLogs] = useState<PluginAuditEvent[]>(() => pluginRegistry.getAuditLog());
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPluginForAudit, setSelectedPluginForAudit] = useState<PluginManifest | null>(null);

  useEffect(() => {
    return pluginRegistry.subscribe((updated) => {
      setPlugins(updated);
      setAuditLogs(pluginRegistry.getAuditLog());
    });
  }, []);

  const handleToggle = (plugin: PluginManifest) => {
    if (plugin.lifecycleState === "ACTIVE") {
      pluginRegistry.deactivatePlugin(plugin.id);
    } else {
      pluginRegistry.activatePlugin(plugin.id);
    }
  };

  const handleCopilotExplore = (plugin: PluginManifest) => {
    setDrawerOpen(true);
    sendMessage(`Tell me about the ${plugin.name} plugin capabilities and how to use it in current ${mode} mode.`);
  };

  const categories: Array<{ id: string; label: string }> = [
    { id: "ALL", label: "All Plugins" },
    { id: "ANALYTICS", label: "Analytics" },
    { id: "INGESTION", label: "Ingestion" },
    { id: "GOVERNANCE", label: "Governance" },
    { id: "COMPLIANCE", label: "Compliance" },
    { id: "ARCHITECTURE", label: "Architecture" },
  ];

  const filteredPlugins = plugins.filter((p) => {
    const matchesCat = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeCount = plugins.filter((p) => p.lifecycleState === "ACTIVE").length;
  const totalCapabilities = plugins.reduce((acc, p) => acc + p.capabilities.length, 0);

  const getPluginIcon = (cat: PluginCategory) => {
    switch (cat) {
      case "ANALYTICS":
        return <Activity className="size-5 text-blue-400" />;
      case "INGESTION":
        return <Database className="size-5 text-emerald-400" />;
      case "GOVERNANCE":
        return <Layers className="size-5 text-indigo-400" />;
      case "COMPLIANCE":
        return <Shield className="size-5 text-amber-400" />;
      case "ARCHITECTURE":
      default:
        return <Sparkles className="size-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Plugin Center & Capability Fabric
            </h1>
            <Badge variant="outline" className="text-[11px] font-mono bg-primary/10 text-primary border-primary/30">
              CLAUDE-INSPIRED
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Governed modular capability bundles exposing typed tools, skills, bounded agents, and workflows to the Copilot.
          </p>
        </div>

        {/* Telemetry Stats Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50 text-xs flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-foreground">{activeCount} / {plugins.length}</span>
            <span className="text-muted-foreground text-[11px]">Active</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50 text-xs flex items-center gap-2">
            <Zap className="size-3.5 text-amber-400 fill-current" />
            <span className="font-bold text-foreground">{totalCapabilities}</span>
            <span className="text-muted-foreground text-[11px]">Capabilities</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-secondary/40 border border-border/40 rounded-xl text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap",
                selectedCategory === c.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search capabilities, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className={cn(
              "rounded-2xl border bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
              plugin.lifecycleState === "ACTIVE" ? "border-border/60" : "border-border/30 opacity-75",
            )}
          >
            {/* Card Header */}
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary/80 border border-border/50 shadow-inner">
                    {getPluginIcon(plugin.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">{plugin.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">v{plugin.version}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-[10px] text-muted-foreground">{plugin.author}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(plugin)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all flex items-center gap-1 cursor-pointer border",
                    plugin.lifecycleState === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                      : "bg-secondary text-muted-foreground border-border/50 hover:bg-secondary/80",
                  )}
                  title={plugin.lifecycleState === "ACTIVE" ? "Click to deactivate" : "Click to activate"}
                >
                  <Power className="size-3" />
                  <span>{plugin.lifecycleState}</span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {plugin.description}
              </p>
            </div>

            {/* Capabilities and Tags */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Exposed Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {plugin.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-secondary/70 text-foreground text-[10px] font-medium border border-border/40"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permissions & Health */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      plugin.healthStatus === "HEALTHY" ? "bg-emerald-400" : "bg-amber-400",
                    )}
                  />
                  <span className="font-mono text-[10px]">{plugin.healthStatus}</span>
                </div>
                <div className="text-[10px] font-mono">
                  {plugin.permissions.length} Permissions
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPluginForAudit(plugin)}
                className="h-7 text-[11px] gap-1 px-2.5 border-border/60"
              >
                <Clock className="size-3" />
                <span>Audit</span>
              </Button>

              <Button
                size="sm"
                onClick={() => handleCopilotExplore(plugin)}
                className="h-7 text-[11px] gap-1 px-3 bg-primary text-primary-foreground font-semibold"
              >
                <Sparkles className="size-3" />
                <span>Ask Copilot</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Drawer / History Modal */}
      {selectedPluginForAudit && (
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>Audit Trail: {selectedPluginForAudit.name}</span>
            </h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPluginForAudit(null)}
              className="h-6 text-xs px-2 text-muted-foreground"
            >
              Close
            </Button>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {auditLogs
              .filter((a) => a.pluginId === selectedPluginForAudit.id || a.pluginId === selectedPluginForAudit.name)
              .slice(0, 5)
              .map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-background/60 border border-border/40 flex items-center justify-between"
                >
                  <div>
                    <span className="text-primary font-bold">[{log.action}]</span> {log.details}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            {auditLogs.filter((a) => a.pluginId === selectedPluginForAudit.id).length === 0 && (
              <div className="text-xs text-muted-foreground p-2">
                No recent mutation events recorded for this plugin.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
