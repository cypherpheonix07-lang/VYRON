import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
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
import { authService } from "@/services/authService";
import { notifications as mockNotifications, projects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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
};

// Grouped Sidebar configuration
const navGroups = [
  {
    label: "MAIN",
    items: [
      { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/app/preview", label: "AI Showcase", icon: Eye, exact: true },
      { to: "/app/studio", label: "AI Studio", icon: Sparkles, exact: false },
      { to: "/app/projects", label: "Projects", icon: FolderKanban, exact: false },
      { to: "/app/projects/new", label: "New Project", icon: PlusCircle, exact: true },
      { to: "/app/reports", label: "Reports", icon: FileBarChart2, exact: true },
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
  const { isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const systemGroupItems = [
    { to: "/app/settings", label: "Settings", icon: Settings, exact: true },
    ...(isAdmin
      ? ([{ to: "/app/admin", label: "Admin console", icon: ShieldCheck, exact: false }] as const)
      : []),
  ];

  return (
    <nav className="flex flex-col gap-5 px-2" aria-label="Main navigation">
      {/* Render Main Group */}
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-muted-foreground/60 tracking-wider">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to) && !pathname.startsWith("/app/projects/new");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                    active
                      ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_20%,transparent)]"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Render System Group */}
      <div className="space-y-1">
        {!collapsed && (
          <p className="px-3 text-[10px] font-bold text-muted-foreground/60 tracking-wider">
            SYSTEM
          </p>
        )}
        <div className="space-y-0.5">
          {systemGroupItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  active
                    ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_20%,transparent)]"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </div>
      </div>
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
  const avgHealth = Math.round(
    projects.reduce((acc, p) => acc + p.healthScore, 0) / projects.length,
  );

  return (
    <div className="flex h-full flex-col gap-5 py-4">
      <div className={cn("px-4", collapsed && "px-3")}>
        <BrahmaLogo compact={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        <NavList collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      {/* Workspace Pulse Sidebar Widget (NO credit limit, replaces Analysis credits card) */}
      {!collapsed ? (
        <div className="mx-3 rounded-xl border border-border/50 bg-zinc-950/40 p-3.5 space-y-3">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">
              Workspace Pulse
            </p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-[11px] text-muted-foreground">Active projects</span>
              <span className="text-xs font-bold text-foreground">{projects.length}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[11px] text-muted-foreground">Analyses this week</span>
              <span className="text-xs font-bold text-foreground">38</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-muted-foreground">Avg health score</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--success)]">{avgHealth}%</span>
                <svg className="h-3 w-8 text-[var(--success)]" viewBox="0 0 50 15" fill="none">
                  <path
                    d="M0,12 L10,9 L20,11 L30,4 L40,6 L50,1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-2">
            <div className="grid grid-cols-3 gap-1 text-[9px] text-muted-foreground font-mono">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                <span>API</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                <span>AI</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
                <span>Q</span>
              </div>
            </div>
          </div>
          <Link
            to="/app/activity"
            onClick={onNavigate}
            className="block text-[10px] text-primary hover:underline font-semibold"
          >
            View activity feed &rarr;
          </Link>
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
  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    let href = "";
    return parts.map((part) => {
      href += `/${part}`;
      const project = projects.find((p) => p.id === part);
      return { label: project?.name ?? labelMap[part] ?? part, href };
    });
  }, [pathname]);

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
    projects.find((p) => pathname.includes(`/app/projects/${p.id}`))?.id ?? "all";

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
                {projects.map((p) => (
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
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              {/* DEMO MODE INDICATOR */}
              {(user?.isDemo || authService.isDemoMode()) && (
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex items-center gap-1 border-amber-500/40 bg-amber-500/10 text-amber-400 text-[10px] uppercase font-mono px-2 py-0.5"
                >
                  <AlertTriangle className="size-3 shrink-0" />
                  Demo Data Active — Read Only
                </Badge>
              )}

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
    </div>
  );
}
