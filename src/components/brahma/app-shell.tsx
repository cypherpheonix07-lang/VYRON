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
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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
import { notifications as mockNotifications, projects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/projects", label: "Projects", icon: FolderKanban, exact: false },
  { to: "/app/projects/new", label: "New Project", icon: PlusCircle, exact: true },
  { to: "/app/reports", label: "Reports", icon: FileBarChart2, exact: true },
  { to: "/app/settings", label: "Settings", icon: Settings, exact: true },
] as const;

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
};

function NavList({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean }) {
  const { isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    ...navItems,
    ...(isAdmin ? ([{ to: "/app/admin", label: "Admin", icon: ShieldCheck, exact: true }] as const) : []),
  ];

  return (
    <nav className="flex flex-col gap-1 px-2" aria-label="Main navigation">
      {items.map((item) => {
        const active =
          item.exact || item.to === "/app/projects/new"
            ? pathname === item.to
            : pathname.startsWith(item.to) && pathname !== "/app/projects/new";
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 py-4">
      <div className={cn("px-4", collapsed && "px-3")}>
        <BrahmaLogo compact={collapsed} />
      </div>
      <NavList collapsed={collapsed} onNavigate={onNavigate} />
      {!collapsed ? (
        <div className="mt-auto mx-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
          <p className="text-xs font-medium">Analysis credits</p>
          <p className="mt-1 text-xs text-muted-foreground">142 of 200 runs used this month</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[71%] rounded-full bg-primary" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationBell() {
  const [empty, setEmpty] = useState(false);
  const list = empty ? [] : mockNotifications;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" aria-hidden />
          {list.length > 0 ? (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--critical)]" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          <Button variant="ghost" size="sm" onClick={() => setEmpty((v) => !v)}>
            {empty ? "Restore" : "Mark all read"}
          </Button>
        </div>
        {list.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            You&apos;re all caught up. New analysis and security alerts will appear here.
          </p>
        ) : (
          <ul className="divide-y">
            {list.map((n) => (
              <li key={n.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
              </li>
            ))}
          </ul>
        )}
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
            <span className="truncate text-foreground">{c.label}</span>
          ) : (
            <Link to={c.href} className="truncate hover:text-foreground">
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
  const { toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  const activeProject =
    projects.find((p) => pathname.includes(`/app/projects/${p.id}`))?.id ?? "all";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarBody collapsed={collapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-4" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarBody onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

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

            <Select
              value={activeProject}
              onValueChange={(v) =>
                v === "all"
                  ? navigate({ to: "/app/projects" })
                  : navigate({ to: "/app/projects/$id", params: { id: v } })
              }
            >
              <SelectTrigger className="hidden w-[210px] sm:flex" aria-label="Project selector">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative hidden min-w-0 flex-1 md:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                placeholder="Search projects, requirements, vulnerabilities…"
                className="pl-9"
                aria-label="Search"
              />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <NotificationBell />
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                <Sun className="size-4 hidden light:block" aria-hidden />
                <Moon className="size-4" aria-hidden />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/15 text-xs text-primary">
                        {(user?.name ?? "BR")
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate text-sm sm:block">
                      {user?.name ?? "Guest"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.name ?? "Guest"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    <Badge variant="outline" className="mt-2 rounded-full text-[10px]">
                      {user?.role ?? "Student"}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">
                      <Settings className="size-4" aria-hidden /> Settings
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "Admin" ? (
                    <DropdownMenuItem asChild>
                      <Link to="/app/admin">
                        <UserCog className="size-4" aria-hidden /> Admin console
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
                    <LogOut className="size-4" aria-hidden /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="border-t border-border/60 px-4 py-2 sm:px-5">
            <Breadcrumbs />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 lg:pb-8">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur lg:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.slice(0, 4).map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px]",
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
    </div>
  );
}
