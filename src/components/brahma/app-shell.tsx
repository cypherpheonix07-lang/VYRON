import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  ChevronDown,
  FileBarChart2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserCog,
  Cable,
  Users,
  Activity,
  Download,
  Sparkles,
  Command,
  Keyboard,
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock,
  Loader2,
  Github,
  Database,
  Play,
  Puzzle,
  Bot,
  Target,
  Compass,
  GitPullRequest,
  FlaskConical,
  Layers,
  Brain,
  Server,
  Terminal,
  BarChart3,
  CheckSquare,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode, useRef } from "react";
import { toast } from "sonner";

import { BrahmaLogo } from "@/components/brahma/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, useTheme } from "@/lib/auth";
import { useAppMode } from "@/state/mode/useAppMode";
import { DemoModeToggle } from "@/components/ui/DemoModeToggle";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";
import { CopilotFloatingButton } from "@/components/copilot/CopilotFloatingButton";
import { authService } from "@/services/authService";
import { notifications as mockNotifications, projects as mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { WorkspacePulse } from "./WorkspacePulse";
import { copilotRealtimeListener } from "@/services/copilot/copilotRealtimeListener";

const labelMap: Record<string, string> = {
  app: "Dashboard",
  projects: "Projects",
  new: "New Project",
  settings: "Settings",
  admin: "Admin",
  reports: "Reports",
  requirements: "Requirements",
  blueprint: "Blueprint",
  "code-health": "Code Health",
  security: "Security",
  "risk-business": "Risk & Business",
  integrations: "Integrations",
  team: "Team Space",
  activity: "Activity Feed",
  exports: "Export Center",
  studio: "AI Studio",
  preview: "AI Showcase",
  github: "GitHub Mirror",
  notifications: "Notifications",
  discover: "AI Discovery",
  analysis: "Live Analysis",
  datasets: "Kaggle Ingestion",
  connectors: "MCP Connectors",
  chat: "Copilot Studio",
  missions: "Mission Center",
  drift: "Architecture Drift",
  impact: "Change Impact",
  simulation: "Simulation Lab",
};

export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export interface NavDomain {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
  adminOnly?: boolean;
}

// 11 Core Engineering Domains
export const NAV_DOMAINS: NavDomain[] = [
  {
    id: "discover",
    label: "DISCOVER",
    icon: Compass,
    items: [
      { to: "/app", label: "Command Center", icon: LayoutDashboard, exact: true },
      { to: "/app/search", label: "Global Search", icon: Search, exact: false },
      { to: "/app/activity", label: "Activity Feed", icon: Activity, exact: true },
      { to: "/app/notifications", label: "Notifications", icon: Bell, exact: true },
    ],
  },
  {
    id: "engineering",
    label: "ENGINEERING",
    icon: FolderKanban,
    items: [
      { to: "/app/projects", label: "All Projects", icon: FolderKanban, exact: true },
      { to: "/app/projects/new", label: "New Project", icon: PlusCircle, exact: true },
      { to: "/app/studio/templates", label: "Project Templates", icon: Layers, exact: false },
    ],
  },
  {
    id: "intelligence",
    label: "INTELLIGENCE",
    icon: Brain,
    items: [
      { to: "/discover", label: "ATLAS Knowledge Graph", icon: Sparkles, exact: false },
      { to: "/app/drift", label: "Architecture Drift", icon: Compass, exact: false },
      { to: "/app/impact", label: "Change Impact", icon: GitPullRequest, exact: false },
      { to: "/app/missions", label: "Decisions & Missions", icon: Target, exact: false },
    ],
  },
  {
    id: "analysis",
    label: "ANALYSIS",
    icon: Activity,
    items: [
      { to: "/app/analysis", label: "Live 12-Stage Analysis", icon: Activity, exact: false },
      { to: "/app/reports", label: "Reports & Findings", icon: FileBarChart2, exact: true },
      { to: "/app/preview", label: "AI Showcase", icon: Eye, exact: true },
    ],
  },
  {
    id: "release",
    label: "RELEASE",
    icon: ShieldCheck,
    items: [
      { to: "/app/missions", label: "Release Gates", icon: ShieldCheck, exact: false },
      { to: "/app/exports", label: "Export Center", icon: Download, exact: true },
    ],
  },
  {
    id: "simulation",
    label: "SIMULATION",
    icon: FlaskConical,
    items: [
      { to: "/app/simulation", label: "Simulation Lab", icon: FlaskConical, exact: false },
    ],
  },
  {
    id: "ai",
    label: "AI",
    icon: Bot,
    items: [
      { to: "/app/chat", label: "Copilot Studio", icon: Bot, exact: false },
      { to: "/app/studio", label: "AI Studio", icon: Sparkles, exact: false },
      { to: "/app/admin/models", label: "Model Governance", icon: Brain, exact: false },
    ],
  },
  {
    id: "integrations",
    label: "INTEGRATIONS",
    icon: Cable,
    items: [
      { to: "/app/datasets", label: "Kaggle Datasets", icon: Database, exact: false },
      { to: "/app/connectors", label: "MCP Connectors", icon: Cable, exact: false },
      { to: "/app/plugins", label: "Plugin Center", icon: Puzzle, exact: false },
      { to: "/app/github", label: "GitHub Mirror", icon: Github, exact: false },
      { to: "/app/integrations", label: "Integrations Hub", icon: Cable, exact: true },
    ],
  },
  {
    id: "governance",
    label: "GOVERNANCE",
    icon: ShieldAlert,
    items: [
      { to: "/app/admin/audit", label: "Audit Trail", icon: ShieldAlert, exact: false },
      { to: "/app/team", label: "Team & Access Control", icon: Users, exact: true },
    ],
  },
  {
    id: "platform",
    label: "PLATFORM",
    icon: Settings,
    items: [
      { to: "/app/settings", label: "Settings & Health", icon: Settings, exact: true },
      { to: "/app/admin/usage", label: "Usage & Telemetry", icon: BarChart3, exact: false },
    ],
  },
  {
    id: "admin",
    label: "ADMIN",
    icon: ShieldCheck,
    adminOnly: true,
    items: [
      { to: "/app/admin", label: "Admin Console", icon: ShieldCheck, exact: true },
      { to: "/app/admin/users", label: "User Directory", icon: Users, exact: false },
      { to: "/app/admin/queue", label: "Task Queue", icon: Server, exact: false },
      { to: "/app/admin/schema", label: "Schema Inspector", icon: Database, exact: false },
    ],
  },
];

// Preserved grouped navigation alias for mobile bar & backward compatibility
const navGroups = [
  {
    label: "MAIN",
    items: [
      { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/app/analysis", label: "Live Analysis", icon: Activity, exact: false },
      { to: "/app/datasets", label: "Kaggle Datasets", icon: Database, exact: false },
      { to: "/app/connectors", label: "MCP Connectors", icon: Cable, exact: false },
      { to: "/app/plugins", label: "Plugin Center", icon: Puzzle, exact: false },
      { to: "/discover", label: "AI Discovery", icon: Sparkles, exact: false },
      { to: "/app/preview", label: "AI Showcase", icon: Eye, exact: true },
      { to: "/app/studio", label: "AI Studio", icon: Sparkles, exact: false },
      { to: "/app/projects", label: "Projects", icon: FolderKanban, exact: false },
      { to: "/app/projects/new", label: "New Project", icon: PlusCircle, exact: true },
      { to: "/app/reports", label: "Reports", icon: FileBarChart2, exact: true },
    ],
  },
  {
    label: "INTELLIGENCE CONTROL PLANE",
    items: [
      { to: "/app/chat", label: "Copilot Studio", icon: Bot, exact: false },
      { to: "/app/missions", label: "Mission Center", icon: Target, exact: false },
      { to: "/app/drift", label: "Architecture Drift", icon: Compass, exact: false },
      { to: "/app/impact", label: "Change Impact", icon: GitPullRequest, exact: false },
      { to: "/app/simulation", label: "Simulation Lab", icon: FlaskConical, exact: false },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      { to: "/app/github", label: "GitHub Mirror", icon: Github, exact: false },
      { to: "/app/integrations", label: "Integrations", icon: Cable, exact: true },
      { to: "/app/team", label: "Team Space", icon: Users, exact: true },
      { to: "/app/activity", label: "Activity Feed", icon: Activity, exact: true },
      { to: "/app/exports", label: "Export Center", icon: Download, exact: true },
    ],
  },
] as const;

function NavList({
  onNavigate,
  collapsed,
}: {
  onNavigate?: (() => void) | undefined;
  collapsed?: boolean | undefined;
}) {
  const { user } = useAuth();
  const { mode } = useAppMode();
  const isAdmin = user?.role === "Admin";
  const { draftCount, projects: liveProjects } = useProjects();
  const availableProjects = liveProjects.length > 0 ? liveProjects : mockProjects;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Contextual Mode Detection
  const isSimulationRoute = pathname === "/app/simulation";
  const projectRouteMatch = pathname.match(/^\/app\/projects\/([a-zA-Z0-9_-]+)/);
  const activeProjectId = projectRouteMatch && projectRouteMatch[1] !== "new" ? projectRouteMatch[1] : null;
  const focusedProject = activeProjectId ? availableProjects.find((p) => p.id === activeProjectId) : null;

  // 4 Contextual Navigation Modes: GLOBAL, PROJECT, SIMULATION, DEMO
  const contextualNavMode: "GLOBAL" | "PROJECT" | "SIMULATION" | "DEMO" =
    mode === "DEMO"
      ? "DEMO"
      : isSimulationRoute
        ? "SIMULATION"
        : focusedProject
          ? "PROJECT"
          : "GLOBAL";

  // Collapsible Accordion Domains State with localStorage persistence
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("vyron_nav_expanded");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      discover: true,
      engineering: true,
      intelligence: true,
      analysis: true,
      release: false,
      simulation: false,
      ai: false,
      integrations: false,
      governance: false,
      platform: false,
      admin: false,
    };
  });

  // Auto-expand domain containing current route
  useEffect(() => {
    const activeDomain = NAV_DOMAINS.find((d) =>
      d.items.some((item) => (item.exact ? pathname === item.to : pathname.startsWith(item.to))),
    );
    if (activeDomain && !expandedDomains[activeDomain.id]) {
      setExpandedDomains((prev) => {
        const next = { ...prev, [activeDomain.id]: true };
        try {
          localStorage.setItem("vyron_nav_expanded", JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, [pathname]);

  const toggleDomain = (domainId: string) => {
    setExpandedDomains((prev) => {
      const next = { ...prev, [domainId]: !prev[domainId] };
      try {
        localStorage.setItem("vyron_nav_expanded", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <nav className="flex flex-col gap-3 px-2" aria-label="Main navigation">
      {/* 1. Contextual Simulation Mode Indicator */}
      {isSimulationRoute && !collapsed && (
        <div className="mx-1 mb-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 p-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-cyan-400 animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Simulation Twin Active</p>
              <p className="text-[9px] text-cyan-200/70 truncate">Hypothetical what-if state isolated</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Contextual Project Workspace Navigation */}
      {focusedProject && !collapsed && (
        <div className="mx-1 mb-2 rounded-xl border border-primary/30 bg-primary/[0.04] p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary">
                <FolderKanban className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-primary/80 uppercase tracking-wider">PROJECT WORKSPACE</p>
                <p className="text-xs font-bold text-foreground truncate">{focusedProject.name}</p>
              </div>
            </div>
            <Link
              to="/app/projects"
              onClick={onNavigate}
              className="text-[9px] text-muted-foreground hover:text-foreground font-mono hover:underline"
            >
              Exit
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-border/40 text-[10px]">
            <Link
              to={`/app/projects/${activeProjectId}` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Overview
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/requirements` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Requirements
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/blueprint` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Blueprint
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/code-health` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Code Health
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/security` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Security
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/tests` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Tests
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/analytics` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Analytics
            </Link>
            <Link
              to={`/app/projects/${activeProjectId}/reports` as never}
              onClick={onNavigate}
              className="px-2 py-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground truncate"
            >
              • Reports
            </Link>
          </div>
        </div>
      )}

      {/* 3. 11 Core Engineering Domains (Collapsible Accordions) */}
      {NAV_DOMAINS.map((domain) => {
        if (domain.adminOnly && !isAdmin) return null;
        const isExpanded = expandedDomains[domain.id] ?? false;
        const DomainIcon = domain.icon;
        const hasActiveChild = domain.items.some((item) =>
          item.exact ? pathname === item.to : pathname.startsWith(item.to) && !pathname.startsWith("/app/projects/new"),
        );

        return (
          <div key={domain.id} className="space-y-1">
            {!collapsed ? (
              <button
                type="button"
                onClick={() => toggleDomain(domain.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-muted-foreground/75 hover:text-foreground tracking-wider uppercase transition-colors rounded hover:bg-white/[0.02]"
              >
                <span className="flex items-center gap-1.5">
                  <DomainIcon className="h-3 w-3 text-primary/70" />
                  <span className={hasActiveChild ? "text-primary font-bold" : ""}>{domain.label}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200 opacity-60",
                    isExpanded ? "transform rotate-0" : "transform -rotate-90",
                  )}
                />
              </button>
            ) : (
              <div className="h-px bg-border/40 my-1 mx-2" />
            )}

            {(isExpanded || collapsed) && (
              <div className="space-y-0.5 pl-1 sm:pl-1.5">
                {domain.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.to
                    : pathname.startsWith(item.to) && !pathname.startsWith("/app/projects/new");
                  const isNewProject = item.to === "/app/projects/new";
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-primary/12 text-primary font-semibold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_20%,transparent)]"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden />
                      {!collapsed ? (
                        <span className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {isNewProject && draftCount > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono leading-none">
                              {draftCount}
                            </span>
                          )}
                        </span>
                      ) : isNewProject && draftCount > 0 ? (
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-400 ring-2 ring-sidebar" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="flex h-full flex-col gap-5 py-4">
      <div className={cn("px-4", collapsed && "px-3")}>
        <BrahmaLogo compact={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        <NavList collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      {/* Workspace Pulse Sidebar Widget (Refined, data-driven, interactive) */}
      {!collapsed ? (
        <div className="mx-3">
          <WorkspacePulse variant="sidebar" onNavigate={onNavigate} />
        </div>
      ) : null}
    </div>
  );
}

function NotificationBell() {
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: "n1",
      title: "Critical vulnerability detected",
      detail: "Hardcoded JWT secret in VaultLedger auth module",
      time: "12m",
      category: "Security",
      unread: true,
    },
    {
      id: "n2",
      title: "Analysis completed",
      detail: "Aurora Payments Gateway health score 91",
      time: "1h",
      category: "Analysis",
      unread: true,
    },
    {
      id: "n3",
      title: "Report ready",
      detail: "MediSync executive summary is available",
      time: "3h",
      category: "Reports",
      unread: true,
    },
    {
      id: "n4",
      title: "Clarity warning threshold breached",
      detail: "Refund flow clarity index dropped to 48%",
      time: "5h",
      category: "Risk",
      unread: false,
    },
    {
      id: "n5",
      title: "System settings synchronized",
      detail: "Copilot model parameters re-routed",
      time: "1d",
      category: "System",
      unread: false,
    },
  ]);

  const unreadCount = unreadNotifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setUnreadNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleMarkRead = (id: string) => {
    setUnreadNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
          <Bell className="size-4" aria-hidden />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-cyan-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border border-border bg-zinc-950">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="h-4 text-[9px] bg-primary/20 text-primary border-none">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="h-6 text-[10px] text-primary px-1.5"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto divide-y divide-border/60">
          {unreadNotifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="size-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground font-medium">You&apos;re all caught up</p>
            </div>
          ) : (
            unreadNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={cn(
                  "p-3.5 block transition-colors cursor-pointer hover:bg-secondary/20",
                  n.unread ? "bg-primary/[0.02]" : "opacity-75",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />}
                    <p
                      className={cn(
                        "text-xs truncate text-foreground",
                        n.unread ? "font-bold" : "font-normal",
                      )}
                    >
                      {n.title}
                    </p>
                  </div>
                  <span className="shrink-0 text-[9px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {n.detail}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <Badge variant="outline" className="text-[8px] px-1 h-4 border-border/80">
                    {n.category}
                  </Badge>
                  {n.unread && (
                    <span className="text-[9px] text-primary hover:underline">Mark read</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border p-2 text-center bg-zinc-950/60">
          <Link
            to="/app/notifications"
            className="block text-[10px] font-semibold text-primary hover:underline"
          >
            View all notifications history
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { projects: liveProjects } = useProjects();
  const availableProjects = liveProjects.length > 0 ? liveProjects : mockProjects;
  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    let href = "";
    return parts.map((part) => {
      href += `/${part}`;
      const project = availableProjects.find((p) => p.id === part);
      return { label: project?.name ?? labelMap[part] ?? part, href };
    });
  }, [pathname, availableProjects]);

  return (
    <ol className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
      {crumbs.map((c, i) => (
        <li key={c.href} className="flex min-w-0 items-center gap-1">
          {i > 0 ? <ChevronRight className="size-3 shrink-0" aria-hidden /> : null}
          {i === crumbs.length - 1 ? (
            <span className="truncate text-foreground font-semibold">{c.label}</span>
          ) : (
            <Link to={c.href as never} className="truncate hover:text-foreground">
              {c.label}
            </Link>
          )}
        </li>
      ))}
    </ol>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, ready, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { projects: liveProjects, draftCount } = useProjects();
  const availableProjects = useMemo(() => {
    return liveProjects && liveProjects.length > 0 ? liveProjects : mockProjects;
  }, [liveProjects]);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // UI state for search dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // UI state for Command Palette and Keyboard Shortcuts Modal
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);

  useEffect(() => {
    if (ready) {
      if (!user) {
        try {
          sessionStorage.setItem("brahma_auth_redirect", pathname);
        } catch {
          // ignore sessionStorage restrictions
        }
        navigate({ to: "/login", replace: true });
      } else if (!user.onboarded && pathname !== "/onboarding") {
        navigate({ to: "/onboarding", replace: true });
      }
    }
  }, [ready, user, pathname, navigate]);

  // Global Copilot Realtime Event Listener Initialization
  useEffect(() => {
    copilotRealtimeListener.initialize();
  }, []);

  // Global keyboard listeners for Cmd+K and ? and sequences
  useEffect(() => {
    let lastKey = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        setPaletteFilter("");
        setPaletteIndex(0);
      }

      // Toggle shortcuts modal when user presses "?" (and isn't typing in an input)
      if (
        e.key === "?" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }

      // Theme toggle shortcut "t"
      if (
        e.key === "t" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        toggle();
        toast.info(`Theme toggled to ${theme === "light" ? "dark" : "light"} Mode`);
      }

      // New project shortcut "n"
      if (
        e.key === "n" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        navigate({ to: "/app/projects/new" });
      }

      // Sequential go shortcut "g" then "d" (dashboard) or "g" then "p" (projects)
      if (
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        if (lastKey === "g" && e.key === "d") {
          e.preventDefault();
          navigate({ to: "/app" });
        }
        if (lastKey === "g" && e.key === "p") {
          e.preventDefault();
          navigate({ to: "/app/projects" });
        }
      }

      lastKey = e.key;
      // Reset sequence after 1s
      setTimeout(() => {
        if (lastKey === e.key) lastKey = "";
      }, 1000);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, theme, navigate]);

  // Click outside search container to close results popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeProject =
    availableProjects.find((p) => pathname.includes(`/app/projects/${p.id}`))?.id ?? "all";

  // Mock global search index data matching Part 7 Requirements
  const searchIndex = useMemo(() => {
    return [
      {
        category: "Projects",
        title: "Aurora Payments Gateway",
        subtitle: "Fintech domain portal — healthy status",
        href: "/app/projects/brahma-core",
        badge: "brahma-core",
        icon: FolderKanban,
      },
      {
        category: "Projects",
        title: "MediSync Patient Portal",
        subtitle: "Healthcare clinical appointment scheduling",
        href: "/app/projects/medisync",
        badge: "medisync",
        icon: FolderKanban,
      },
      {
        category: "Projects",
        title: "Smart Campus Portal",
        subtitle: "University attendance and grades dashboard",
        href: "/app/projects/campusflow",
        badge: "campusflow",
        icon: FolderKanban,
      },
      {
        category: "Requirements",
        title: "FR-02 Retry settlements idempotently",
        subtitle: "Must retry failed settlements with idempotency keys",
        href: "/app/projects/brahma-core/requirements",
        badge: "brahma-core",
        icon: Sparkles,
      },
      {
        category: "Vulnerabilities",
        title: "Hardcoded signing secret in auth module",
        subtitle: "Critical risk — committed token string literal",
        href: "/app/projects/brahma-core/security",
        badge: "brahma-core",
        icon: ShieldAlert,
      },
      {
        category: "Reports",
        title: "Executive Summary — August PDF",
        subtitle: "Ready archive document by Priya Nair",
        href: "/app/reports",
        badge: "Global",
        icon: FileBarChart2,
      },
      {
        category: "Members",
        title: "Puli Phanindhra",
        subtitle: "Full Stack Developer & Cybersecurity Researcher",
        href: "/app/team",
        badge: "Editor",
        icon: Users,
      },
      {
        category: "Templates",
        title: "E-Commerce Gateway Blueprint",
        subtitle: "Acquirer settlement & merchant panel stack",
        href: "/app/studio/templates",
        badge: "Template",
        icon: BrahmaLogo,
      },
      {
        category: "Missions",
        title: "MSN-SETTLE-01: Zero-Loss Settlement Verification",
        subtitle: "Multi-step agentic mission verifying idempotent settlements",
        href: "/app/missions",
        badge: "Mission",
        icon: Compass,
      },
      {
        category: "Drift",
        title: "DFT-01: Settlement Engine Missing from Repository AST",
        subtitle: "Structural divergence between blueprint and observed source code",
        href: "/app/drift",
        badge: "Drift",
        icon: Layers,
      },
      {
        category: "Impact",
        title: "IMP-01: Direct & Transitive Blast Radius Analysis",
        subtitle: "Blast radius computation for payment gateway changes",
        href: "/app/impact",
        badge: "Impact",
        icon: Activity,
      },
      {
        category: "Decisions",
        title: "ADR-001: SHA-256 HMAC for Webhook Signatures",
        subtitle: "Cryptographically sealed architectural decision record",
        href: "/app/missions",
        badge: "ADR",
        icon: ShieldCheck,
      },
      {
        category: "Simulation",
        title: "SIM-01: 11 Concrete Anomaly Scenarios",
        subtitle: "Interactive failure injection and deterministic reset lab",
        href: "/app/simulation",
        badge: "Simulation",
        icon: Sparkles,
      },
      {
        category: "Datasets",
        title: "IEEE-CIS Fraud & Transaction Drift Benchmark",
        subtitle: "Kaggle benchmark partition with 12,480 live transactions",
        href: "/app/datasets",
        badge: "Dataset",
        icon: Database,
      },
      {
        category: "Plugins",
        title: "Claude-Inspired Extensibility Plugins",
        subtitle: "Manifest-governed plugins for analysis, GitHub, and reports",
        href: "/app/plugins",
        badge: "Plugin",
        icon: Puzzle,
      },
      {
        category: "Policies",
        title: "POL-SEC-01: Release Gate Blocking Rules",
        subtitle: "Deterministic release gating with formal exception governance",
        href: "/app/simulation",
        badge: "Policy",
        icon: ShieldAlert,
      },
    ];
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, searchIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate({ to: "/app/search", search: { q: searchQuery } });
  };

  // Command palette navigation options
  const paletteItems = useMemo(() => {
    const navs = [
      {
        label: "Go to Dashboard",
        href: "/app",
        shortcut: "g d",
        category: "Navigation",
        icon: LayoutDashboard,
      },
      {
        label: "Go to AI Tool Showcase",
        href: "/app/preview",
        shortcut: "",
        category: "Navigation",
        icon: Eye,
      },
      {
        label: "Go to GitHub Live Mirror",
        href: "/app/github",
        shortcut: "g g",
        category: "Navigation",
        icon: Github,
      },
      {
        label: "Go to AI Studio",
        href: "/app/studio",
        shortcut: "",
        category: "Navigation",
        icon: Sparkles,
      },
      {
        label: "Go to Projects",
        href: "/app/projects",
        shortcut: "g p",
        category: "Navigation",
        icon: FolderKanban,
      },
      {
        label: "Go to New Project",
        href: "/app/projects/new",
        shortcut: "n",
        category: "Navigation",
        icon: PlusCircle,
      },
      {
        label: "Go to Reports Library",
        href: "/app/reports",
        shortcut: "",
        category: "Navigation",
        icon: FileBarChart2,
      },
      {
        label: "Go to Workspace Integrations",
        href: "/app/integrations",
        shortcut: "",
        category: "Navigation",
        icon: Cable,
      },
      {
        label: "Go to Team Roster",
        href: "/app/team",
        shortcut: "",
        category: "Navigation",
        icon: Users,
      },
      {
        label: "Go to Activity Audit Log",
        href: "/app/activity",
        shortcut: "",
        category: "Navigation",
        icon: Activity,
      },
      {
        label: "Go to Export Center",
        href: "/app/exports",
        shortcut: "",
        category: "Navigation",
        icon: Download,
      },
      {
        label: "Go to Workspace Settings",
        href: "/app/settings",
        shortcut: "",
        category: "Navigation",
        icon: Settings,
      },
      {
        label: "Toggle Dark / Light Theme",
        action: () => toggle(),
        shortcut: "t",
        category: "Action",
        icon: Moon,
      },
      {
        label: "Invite Member to Workspace",
        href: "/app/team",
        shortcut: "",
        category: "Action",
        icon: Users,
      },
      {
        label: "Start New AI Blueprint",
        href: "/app/studio",
        shortcut: "",
        category: "Action",
        icon: Sparkles,
      },
      {
        label: "Open Copilot Full-Screen Studio",
        href: "/app/chat",
        shortcut: "c",
        category: "Intelligence Control Plane",
        icon: Bot,
      },
      {
        label: "Go to Engineering Missions",
        href: "/app/missions",
        shortcut: "g m",
        category: "Intelligence Control Plane",
        icon: Compass,
      },
      {
        label: "Run Architecture Drift Analysis",
        href: "/app/drift",
        shortcut: "g d",
        category: "Intelligence Control Plane",
        icon: Layers,
      },
      {
        label: "Run Change Impact Blast Radius",
        href: "/app/impact",
        shortcut: "g i",
        category: "Intelligence Control Plane",
        icon: Activity,
      },
      {
        label: "Open Engineering Simulation Lab",
        href: "/app/simulation",
        shortcut: "g s",
        category: "Intelligence Control Plane",
        icon: Sparkles,
      },
      {
        label: "Go to Plugin Platform",
        href: "/app/plugins",
        shortcut: "",
        category: "Extensibility",
        icon: Puzzle,
      },
      {
        label: "Go to Enterprise Connectors",
        href: "/app/connectors",
        shortcut: "",
        category: "Integrations",
        icon: Cable,
      },
      {
        label: "Go to Dataset Intelligence",
        href: "/app/datasets",
        shortcut: "",
        category: "Data Intelligence",
        icon: Database,
      },
      {
        label: "Open System Self-Diagnostics",
        href: "/app/settings",
        shortcut: "",
        category: "System Health",
        icon: ShieldCheck,
      },
    ];
    if (paletteFilter.trim() === "") return navs;
    return navs.filter(
      (item) =>
        item.label.toLowerCase().includes(paletteFilter.toLowerCase()) ||
        item.category.toLowerCase().includes(paletteFilter.toLowerCase()),
    );
  }, [paletteFilter, toggle]);

  // Navigate Command Palette items using keyboard
  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setPaletteIndex((prev) => (prev + 1) % paletteItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setPaletteIndex((prev) => (prev - 1 + paletteItems.length) % paletteItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = paletteItems[paletteIndex];
      if (selected) {
        if (selected.action) {
          selected.action();
        } else if (selected.href) {
          navigate({ to: selected.href as never });
        }
        setPaletteOpen(false);
      }
    } else if (e.key === "Escape") {
      setPaletteOpen(false);
    }
  };

  if (!ready) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 grid-backdrop opacity-15"
          aria-hidden
        />
        <div className="surface rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-border/80">
          <Loader2 className="size-8 animate-spin mx-auto text-primary animate-spin" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Loading workspace</h3>
            <p className="text-xs text-muted-foreground">
              Synchronizing credentials and loading active node...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-cyan-500/20">
      {/* SIDEBAR FOR DESKTOP */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarBody collapsed={collapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP DEMO BANNER */}
        <DemoBanner />

        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
            {/* MOBILE SHEET TRIGGER */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="size-4" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 bg-sidebar p-0 border-r border-sidebar-border"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarBody onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* SIDEBAR COLLAPSE TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" aria-hidden />
              ) : (
                <PanelLeftClose className="size-4" aria-hidden />
              )}
            </Button>

            {/* PROJECTS SELECTOR */}
            <Select
              value={activeProject}
              onValueChange={(v) =>
                v === "all"
                  ? navigate({ to: "/app/projects" })
                  : navigate({ to: "/app/projects/$id", params: { id: v } })
              }
            >
              <SelectTrigger
                className="hidden w-[210px] sm:flex h-8 text-xs"
                aria-label="Project selector"
              >
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border border-border">
                <SelectItem value="all">All projects</SelectItem>
                {availableProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* GLOBAL SEARCH IN HEADER WITH AUTOCOMPLETE RESULTS */}
            <div
              ref={searchContainerRef}
              className="relative hidden min-w-0 flex-1 md:block max-w-md"
            >
              <form onSubmit={handleSearchSubmit}>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search projects, requirements, vulnerabilities (Press Enter)..."
                  className="pl-9 h-8 text-xs focus-visible:ring-primary/45"
                  aria-label="Search Input"
                />
              </form>

              {/* Autocomplete Results Panel */}
              {searchOpen && searchQuery.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border bg-zinc-950 shadow-2xl p-1 max-h-[360px] overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        No matches for &lsquo;{searchQuery}&rsquo;
                      </p>
                      <button
                        onClick={() => {
                          setSearchOpen(false);
                          navigate({ to: "/app/search", search: { q: searchQuery } });
                        }}
                        className="text-[10px] text-primary mt-1 font-semibold hover:underline"
                      >
                        Search all sections instead &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 p-1">
                      {/* Group results by Category */}
                      {Array.from(new Set(searchResults.map((r) => r.category))).map((cat) => (
                        <div key={cat} className="space-y-0.5">
                          <p className="px-2 py-1 text-[9px] font-bold text-muted-foreground/60 tracking-wider">
                            {cat.toUpperCase()}
                          </p>
                          {searchResults
                            .filter((r) => r.category === cat)
                            .map((res) => (
                              <button
                                key={res.title}
                                onClick={() => {
                                  setSearchOpen(false);
                                  navigate({ to: res.href as never });
                                }}
                                className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-secondary/40 text-xs transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <res.icon className="size-3.5 shrink-0 text-muted-foreground" />
                                  <div className="min-w-0">
                                    <p className="font-semibold text-foreground truncate">
                                      {res.title}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate leading-none mt-0.5">
                                      {res.subtitle}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-[8px] px-1 h-4 shrink-0 max-w-[80px] truncate"
                                >
                                  {res.badge}
                                </Badge>
                              </button>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* HEADER RIGHT ACTIONS */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {/* Prominent RUN ANALYSIS Action */}
              <Button
                asChild
                size="sm"
                className="h-8 gap-1.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 hover:from-primary/90 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-primary/25 border border-white/20"
              >
                <Link to="/app/analysis">
                  <Play className="size-3.5 fill-current text-white" />
                  <span>Run Analysis</span>
                </Link>
              </Button>

              {/* Quick Action: New Project */}
              <Button
                asChild
                size="sm"
                className="h-8 gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-semibold"
              >
                <Link to="/app/projects/new">
                  <PlusCircle className="size-3.5" />
                  <span className="hidden md:inline">New Project</span>
                  {draftCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/50 text-[10px] font-mono">
                      {draftCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* DEMO MODE SWITCH & TOGGLE */}
              <DemoModeToggle />

              {/* Keyboard info indicator */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                onClick={() => setShortcutsOpen(true)}
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="size-4" />
              </Button>

              {/* Command Palette palette launch icon */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                onClick={() => {
                  setPaletteOpen(true);
                  setPaletteFilter("");
                  setPaletteIndex(0);
                }}
                title="Command Palette (Cmd+K)"
              >
                <Command className="size-4" />
              </Button>

              <NotificationBell />

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggle}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="size-4" aria-hidden />
                ) : (
                  <Sun className="size-4" aria-hidden />
                )}
              </Button>

              {/* USER PROFILE DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-1.5 h-8">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                        {(user?.name ?? "PN")
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate text-xs font-semibold sm:block">
                      {user?.name ?? "Priya Nair"}
                    </span>
                    {user?.isDemo && (
                      <span className="text-[9px] font-bold text-amber-500 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded sm:inline hidden shrink-0 select-none uppercase tracking-wider">
                        Demo
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border border-border">
                  <DropdownMenuLabel>
                    <p className="text-xs font-semibold text-foreground">
                      {user?.name ?? "Priya Nair"}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {user?.email ?? "priya.nair@brahma.dev"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="outline" className="rounded-full text-[9px] px-1.5 py-0">
                        {user?.role ?? "Admin"}
                      </Badge>
                      {user?.isDemo && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-[9px] px-1.5 py-0 border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider"
                        >
                          Demo
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">
                      <Settings className="size-4 mr-2" aria-hidden /> Settings
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "Admin" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/app/admin">
                        <UserCog className="size-4 mr-2" aria-hidden /> Admin console
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate({ to: "/login", replace: true });
                    }}
                  >
                    <LogOut className="size-4 mr-2" aria-hidden /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="border-t border-border/50 px-4 py-1.5 sm:px-5">
            <Breadcrumbs />
          </div>
        </header>

        {/* CONTENT PANEL */}
        <main className="mx-auto w-full max-w-[1500px] flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 lg:pb-8">
          {children}
        </main>

        {/* MOBILE NAVIGATION BAR */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur lg:hidden"
          aria-label="Mobile navigation"
        >
          {navGroups[0].items.slice(0, 4).map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* COMMAND PALETTE DIALOG OVERLAY (PART 3 FEATURE 1) */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-[12vh]"
          onKeyDown={handlePaletteKeyDown}
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-zinc-950 shadow-2xl overflow-hidden focus-trap flex flex-col">
            <div className="p-3 border-b border-border flex items-center gap-2">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type command or search sections (Use arrows ↕ + Enter)..."
                className="w-full bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground"
                value={paletteFilter}
                onChange={(e) => {
                  setPaletteFilter(e.target.value);
                  setPaletteIndex(0);
                }}
              />
              <button
                onClick={() => setPaletteOpen(false)}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1.5 space-y-1">
              {paletteItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-muted-foreground">No matching commands found.</p>
                </div>
              ) : (
                paletteItems.map((item, idx) => {
                  const highlighted = idx === paletteIndex;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else if (item.href) {
                          navigate({ to: item.href as never });
                        }
                        setPaletteOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs transition-colors",
                        highlighted
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-secondary/40 text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="size-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[8px] h-4 uppercase">
                          {item.category}
                        </Badge>
                        {item.shortcut && (
                          <span className="text-[9px] font-mono text-muted-foreground bg-background/20 px-1 py-0.5 rounded border border-border/40">
                            {item.shortcut}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="bg-zinc-950/60 p-2 text-center text-[10px] text-muted-foreground border-t border-border flex justify-between px-4">
              <span>
                Use{" "}
                <kbd className="font-mono bg-secondary/80 px-1 py-0.5 rounded text-[8px]">↕</kbd> to
                select
              </span>
              <span>
                <kbd className="font-mono bg-secondary/80 px-1 py-0.5 rounded text-[8px]">
                  Enter
                </kbd>{" "}
                to select
              </span>
              <span>
                <kbd className="font-mono bg-secondary/80 px-1 py-0.5 rounded text-[8px]">ESC</kbd>{" "}
                to close
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS HELP MODAL (PART 3 FEATURE 5) */}
      {shortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-zinc-950 p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setShortcutsOpen(false)}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                <span className="text-muted-foreground">Open Command Palette</span>
                <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                  Ctrl+K / ⌘+K
                </kbd>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                <span className="text-muted-foreground">Toggle Theme (Dark / Light)</span>
                <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                  t
                </kbd>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                <span className="text-muted-foreground">Create New Project</span>
                <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                  n
                </kbd>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                <span className="text-muted-foreground">Go to Dashboard</span>
                <span className="flex gap-1">
                  <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                    g
                  </kbd>
                  <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                    d
                  </kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                <span className="text-muted-foreground">Go to Projects</span>
                <span className="flex gap-1">
                  <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                    g
                  </kbd>
                  <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                    p
                  </kbd>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-muted-foreground">Show Keyboard Shortcuts Help</span>
                <kbd className="font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                  ?
                </kbd>
              </div>
            </div>
            <div className="pt-2">
              <Button
                size="sm"
                className="w-full text-[10px]"
                variant="outline"
                onClick={() => setShortcutsOpen(false)}
              >
                Dismiss Help
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dual-Mode AI Copilot Floating Pill and Drawer */}
      <CopilotFloatingButton />
      <CopilotDrawer />
    </div>
  );
}
