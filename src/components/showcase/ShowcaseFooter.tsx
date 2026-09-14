import { Link } from "@tanstack/react-router";
import { BrahmaLogo } from "@/components/brahma/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FolderGit2,
  Github,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export function ShowcaseFooter() {
  return (
    <footer className="border-t border-border/80 bg-background/95 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* FINAL HERO CTA (Requirement 827-830) */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-secondary/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] -z-10 rounded-full" />

          <div className="max-w-2xl mx-auto space-y-4">
            <Badge
              variant="outline"
              className="text-xs font-mono border-primary/40 text-primary uppercase tracking-wider"
            >
              Enterprise Engineering Readiness
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to Bridge Intent and Implementation?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Launch VYRON to inspect your repositories with deterministic AST health, Bandit security analysis,
              traceability matrices, and autonomous Copilot missions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/25"
              >
                <Link to="/app">
                  Launch Live Workspace <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="gap-2 border-border/80">
                <Link to="/preview">
                  Explore AI Tool Engine <Sparkles className="size-4 text-cyan-400" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="ghost" className="gap-2 text-cyan-400">
                <Link to="/github">
                  Mirror Your GitHub <FolderGit2 className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* BOTTOM LINKS & METADATA (Requirement 831-836) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-border/50 text-xs">
          {/* BRAND COLUMN */}
          <div className="space-y-3 md:col-span-2">
            <BrahmaLogo to="/showcase" />
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              PROJECT BRAHMA is an engineering intelligence, architecture governance, static analysis, and AI-assisted
              software quality platform built to govern software engineering from raw idea to verified release.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                Platform Operational • v2.4 Release
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono border-border/60 text-muted-foreground">
                95 Routes Active
              </Badge>
            </div>
          </div>

          {/* SHOWCASE NAVIGATION */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-foreground font-bold">
              Showcase Sections
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <a href="#showcase" className="hover:text-primary transition-colors">
                  AI Tool Showcase
                </a>
              </li>
              <li>
                <a href="#github" className="hover:text-primary transition-colors">
                  GitHub Mirror Pipeline
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  17 Feature Families
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  10-Phase Lifecycle
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-primary transition-colors">
                  8-Tier Technology Stack
                </a>
              </li>
            </ul>
          </div>

          {/* APPLICATION EXPERIENCES */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-foreground font-bold">
              Live Experiences
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link to="/app" className="hover:text-primary transition-colors">
                  Authenticated Workspace
                </Link>
              </li>
              <li>
                <Link to="/github" className="hover:text-primary transition-colors">
                  GitHub Account Mirror
                </Link>
              </li>
              <li>
                <Link to="/preview" className="hover:text-primary transition-colors">
                  AI Ecosystem Preview
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Sign In / Demo Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
          <div>© 2026 PROJECT BRAHMA. All engineering rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Deterministic Gates Active</span>
            <span>•</span>
            <span>Zero Client Secrets</span>
            <span>•</span>
            <span>SHA-256 Provenance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
