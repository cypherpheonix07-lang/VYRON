import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { BrahmaLogo } from "@/components/brahma/logo";
import { SHOWCASE_NAV_ITEMS } from "./showcaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Menu, X, Terminal, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

interface ShowcaseNavProps {
  activeSection: string;
  onNavigate?: (hash: string) => void;
}

export function ShowcaseNav({ activeSection, onNavigate }: ShowcaseNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onNavigate) {
      onNavigate(hash);
    } else {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", hash);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-border/80 bg-background/90 backdrop-blur-md shadow-sm"
          : "border-b border-border/40 bg-background/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* BRAND LOGO (Left side) */}
        <div className="flex items-center gap-3 shrink-0">
          <BrahmaLogo to="/showcase" />
          <Badge
            variant="outline"
            className="hidden sm:inline-flex text-[10px] font-mono tracking-wider uppercase border-primary/30 text-primary bg-primary/5 py-0.5"
          >
            Product Intelligence
          </Badge>
        </div>

        {/* 5 CANONICAL NAV ITEMS (Strictly Centered horizontally - Requirement 045-055, 548-554) */}
        <nav
          className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-secondary/30 backdrop-blur-sm"
          aria-label="Primary Showcase Sections"
        >
          {SHOWCASE_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.hash}
                onClick={(e) => handleLinkClick(e, item.hash)}
                className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-border/60 text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* AUTH & ACTIONS (Right side) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Link to="/app">
              Open App <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" variant="default" className="text-xs h-8 px-3">
            <Link to="/app">App</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {/* MOBILE EXPANDED DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border/80 bg-background/95 backdrop-blur-md px-4 py-4 space-y-3">
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider px-2">
            Showcase Sections
          </div>
          <div className="grid grid-cols-1 gap-1">
            {SHOWCASE_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.hash}
                  onClick={(e) => handleLinkClick(e, item.hash)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{item.badge}</span>
                </a>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild size="sm" className="flex-1 text-xs">
              <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                Launch Workspace
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
