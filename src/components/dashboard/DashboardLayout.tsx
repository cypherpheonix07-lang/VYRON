import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Shield,
  Layers,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  User as UserIcon,
  Bell,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface DashboardLayoutProps {
  role: "student" | "faculty" | "professional" | "admin";
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const roleConfigs = {
  student: {
    name: "Student",
    themeLabel: "Academic Workspace",
    icon: GraduationCap,
    gradient: "from-blue-600/15 via-blue-500/5 to-transparent",
    accentColor: "blue",
    borderGlow: "border-blue-500/30 hover:border-blue-500/50",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    navPath: "/dashboard/student",
  },
  faculty: {
    name: "Faculty",
    themeLabel: "Educator & Research Command",
    icon: BookOpen,
    gradient: "from-purple-600/15 via-purple-500/5 to-transparent",
    accentColor: "purple",
    borderGlow: "border-purple-500/30 hover:border-purple-500/50",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    navPath: "/dashboard/faculty",
  },
  professional: {
    name: "Working Professional",
    themeLabel: "Industry & Enterprise Hub",
    icon: Briefcase,
    gradient: "from-emerald-600/15 via-emerald-500/5 to-transparent",
    accentColor: "emerald",
    borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    navPath: "/dashboard/professional",
  },
  admin: {
    name: "Platform Administrator",
    themeLabel: "Admin Control Plane",
    icon: Shield,
    gradient: "from-amber-600/15 via-amber-500/5 to-transparent",
    accentColor: "amber",
    borderGlow: "border-amber-500/30 hover:border-amber-500/50",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    navPath: "/admin/command-centre",
  },
};

export function DashboardLayout({
  role,
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const config = roleConfigs[role] || roleConfigs.student;
  const RoleIcon = config.icon;

  const isAdmin = user?.role === "Admin" || (user?.email && user.email.includes("admin"));

  const handleSignOut = async () => {
    await logout();
    navigate({ to: "/login" as any });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground flex flex-col selection:bg-cyan-500/30">
      {/* Top Universal App Bar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Left Brand & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Link to="/app" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                V
              </div>
              <span className="font-bold tracking-tight text-foreground text-sm hidden sm:inline">
                VYRON
              </span>
            </Link>

            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs py-0.5 px-2 flex items-center gap-1.5 ${config.badgeBg}`}>
                <RoleIcon className="h-3 w-3" />
                <span>{config.name}</span>
              </Badge>
              <span className="text-xs text-muted-foreground hidden md:inline">
                {config.themeLabel}
              </span>
            </div>
          </div>

          {/* Right Navigation & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Link to Project Studio */}
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-zinc-900 border border-transparent hover:border-border/60 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Project Studio</span>
            </Link>

            {/* Admin Command Centre link if admin */}
            {isAdmin && (
              <Link
                to="/admin/command-centre"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin Control Plane</span>
              </Link>
            )}

            {/* User Info & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-border/50">
              <div className="h-7 w-7 rounded-full bg-zinc-800 border border-border flex items-center justify-center text-xs text-foreground font-medium">
                {user?.email?.charAt(0).toUpperCase() || <UserIcon className="h-3.5 w-3.5" />}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-medium text-foreground truncate max-w-[140px]">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </div>
                <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                  {user?.email}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 px-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Ambient Glow Header */}
      <section className={`border-b border-border/30 bg-gradient-to-b ${config.gradient} py-8 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RoleIcon className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                {config.name} Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-wrap">
              {actions}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PROJECT BRAHMA / VYRON • Enterprise Multi-Role SaaS Control Plane</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Backend Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
