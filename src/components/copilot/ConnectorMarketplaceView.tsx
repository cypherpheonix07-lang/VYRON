/**
 * VYRON — CONNECTOR MARKETPLACE VIEW COMPONENT (GOD MODE vNEXT)
 * Directives: 794-815, 1935-1944, 1945-1955
 *
 * Full-screen / embedded marketplace for all 70+ external connectors:
 * - Real-time full-text & semantic keyword search.
 * - Multi-category filtering and status tags (Trending, Beta, New, Community, Certified).
 * - Safe OAuth simulation & Disconnect with cryptographic audit preservation.
 *
 * Strictly ZERO SQL.
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Plug,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  Power,
  Sliders,
  Filter,
  RefreshCw,
  HardDrive,
  Mail,
  Calendar,
  Briefcase,
  FileText,
  MessageSquare,
  Figma,
  Palette,
  Layout,
  Image,
  Monitor,
  PenTool,
  Github,
  Database,
  CheckSquare,
  CheckCircle,
  Zap,
  Activity,
  Cloud,
  Globe,
  Send,
  Server,
  Terminal,
  Cpu,
  BookOpen,
  Check,
  Users,
  Phone,
  Table,
  BarChart,
  MessageCircle,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  DollarSign,
  FileCheck2,
  GitMerge,
  Video,
  Box,
  Folder,
  Clock,
  Mic,
  Volume2,
  Music,
  MapPin,
  Trello,
  GitFork,
} from "lucide-react";
import {
  connectorFabric,
  connectorMarketplace,
  NormalizedConnectorDef,
  ConnectorCategory,
  ConnectorBadgeStatus,
} from "@/services/connectors";
import { useCopilot } from "@/state/copilot/useCopilot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ConnectorMarketplaceViewProps {
  className?: string;
}

export function ConnectorMarketplaceView({ className }: ConnectorMarketplaceViewProps) {
  const { mode } = useCopilot();
  const [connectors, setConnectors] = useState<NormalizedConnectorDef[]>(() =>
    connectorFabric.listConnectors(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<ConnectorBadgeStatus | "ALL">("ALL");
  const [connectionFilter, setConnectionFilter] = useState<"ALL" | "CONNECTED" | "NOT_CONNECTED">("ALL");
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    return connectorFabric.subscribe((updated) => {
      setConnectors(updated);
    });
  }, []);

  const filteredConnectors = useMemo(() => {
    return connectorMarketplace.search({
      query: searchQuery,
      category: selectedCategory,
      statusBadge: selectedStatus,
      connectionStatus: connectionFilter,
    });
  }, [searchQuery, selectedCategory, selectedStatus, connectionFilter, connectors]);

  const categories = useMemo(() => {
    return connectorMarketplace.getCategoriesWithCounts();
  }, [connectors]);

  const handleToggleConnection = async (conn: NormalizedConnectorDef) => {
    setConnectingId(conn.id);
    try {
      if (conn.isConnected) {
        connectorFabric.disconnectService(conn.id);
        toast.info(`Disconnected ${conn.name}. Derived tools disabled.`);
      } else {
        await connectorFabric.connectService(conn.id);
        toast.success(`Connected ${conn.name} securely! Tools mapped to Copilot.`);
      }
    } catch (err: unknown) {
      toast.error(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setConnectingId(null);
    }
  };

  const renderConnectorIcon = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      HardDrive,
      Mail,
      Calendar,
      Briefcase,
      FileText,
      MessageSquare,
      Figma,
      Palette,
      Layout,
      Image,
      Monitor,
      PenTool,
      Github,
      Database,
      CheckSquare,
      CheckCircle,
      Zap,
      Activity,
      Cloud,
      Globe,
      Send,
      Server,
      Terminal,
      Cpu,
      BookOpen,
      Check,
      Users,
      Phone,
      Table,
      BarChart,
      MessageCircle,
      TrendingUp,
      CreditCard,
      ShoppingBag,
      DollarSign,
      FileCheck2,
      GitMerge,
      Video,
      Box,
      Folder,
      Clock,
      Mic,
      Volume2,
      Music,
      MapPin,
      Trello,
      GitFork,
      Search,
    };
    const Component = iconMap[iconName] || Plug;
    return <Component className="size-5" />;
  };

  const connectedCount = connectors.filter((c) => c.isConnected).length;

  return (
    <div className={cn("space-y-4 p-4 sm:p-6 font-sans max-w-7xl mx-auto", className)}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary">
              <Plug className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Connector Fabric & External Ecosystem
            </h2>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              70+ CONNECTORS
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Governed data access to Google Drive, Notion, Slack, Figma, Linear, Supabase, Datadog & beyond. Zero secrets in frontend.
          </p>
        </div>

        {/* Status Counts */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-foreground">{connectedCount} Connected</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50 flex items-center gap-2">
            <Layers className="size-3 text-primary" />
            <span className="text-muted-foreground">{connectors.length} in Catalog</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search 70+ connectors by name, provider, or capability (e.g. email, CRM, storage, APM, metrics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Connection filter toggle */}
            <select
              value={connectionFilter}
              onChange={(e) => setConnectionFilter(e.target.value as never)}
              className="px-2.5 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All States</option>
              <option value="CONNECTED">Connected Only</option>
              <option value="NOT_CONNECTED">Available Only</option>
            </select>

            {/* Status badge filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as never)}
              className="px-2.5 py-2 text-xs rounded-xl bg-secondary/50 border border-border/60 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All Badges</option>
              <option value="Trending">Trending</option>
              <option value="Certified">Certified</option>
              <option value="Beta">Beta</option>
              <option value="New">New</option>
              <option value="Community">Community</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={cn(
                "px-2.5 py-1 rounded-lg transition-all whitespace-nowrap text-[11px] cursor-pointer",
                selectedCategory === cat.category
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40",
              )}
            >
              <span>{cat.category === "ALL" ? "All Categories" : cat.category}</span>
              <span className="opacity-70 ml-1 text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredConnectors.map((conn) => (
          <div
            key={conn.id}
            className={cn(
              "p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-secondary/30",
              conn.isConnected
                ? "border-emerald-500/30 shadow-sm shadow-emerald-500/5 bg-secondary/40"
                : "border-border/50 hover:border-border/80",
            )}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "p-2 rounded-xl border flex items-center justify-center",
                      conn.isConnected
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-secondary/60 border-border/60 text-muted-foreground",
                    )}
                  >
                    {renderConnectorIcon(conn.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground leading-tight">
                      {conn.name}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                      {conn.provider}
                    </span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-mono uppercase shrink-0",
                    conn.statusBadge === "Trending" && "border-amber-500/40 text-amber-300 bg-amber-500/10",
                    conn.statusBadge === "Certified" && "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                    conn.statusBadge === "Beta" && "border-blue-500/40 text-blue-400 bg-blue-500/10",
                    conn.statusBadge === "New" && "border-primary/40 text-primary bg-primary/10",
                    conn.statusBadge === "Community" && "border-purple-500/40 text-purple-400 bg-purple-500/10",
                  )}
                >
                  {conn.statusBadge}
                </Badge>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {conn.description}
              </p>

              <div className="space-y-1 text-[10px] font-mono pt-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Category:</span>
                  <span className="text-foreground/80">{conn.category}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Auth:</span>
                  <span className="text-foreground/80">{conn.authType}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Tools:</span>
                  <span className="text-foreground/80">{conn.toolsProvided.length} provided</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    conn.isConnected ? "bg-emerald-400 animate-pulse" : "bg-zinc-500",
                  )}
                />
                <span className={conn.isConnected ? "text-emerald-400 font-bold" : "text-muted-foreground"}>
                  {conn.isConnected ? "CONNECTED" : "AVAILABLE"}
                </span>
              </div>

              <Button
                size="sm"
                variant={conn.isConnected ? "outline" : "default"}
                disabled={connectingId === conn.id}
                onClick={() => handleToggleConnection(conn)}
                className={cn(
                  "h-7 text-xs font-mono font-bold px-3 gap-1",
                  conn.isConnected
                    ? "border-destructive/40 text-destructive hover:bg-destructive/10"
                    : "bg-primary text-primary-foreground shadow-sm shadow-primary/20",
                )}
              >
                <Power className="size-3" />
                <span>
                  {connectingId === conn.id
                    ? "Updating..."
                    : conn.isConnected
                      ? "Disconnect"
                      : "Connect"}
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
