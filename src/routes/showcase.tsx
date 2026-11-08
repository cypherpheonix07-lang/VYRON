import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShowcaseNav } from "@/components/showcase/ShowcaseNav";
import { ShowcaseHero } from "@/components/showcase/ShowcaseHero";
import { WhyBrahmaSection } from "@/components/showcase/WhyBrahmaSection";
import { FeatureUniverseSection } from "@/components/showcase/FeatureUniverseSection";
import { GitHubMirrorSection } from "@/components/showcase/GitHubMirrorSection";
import { HowItWorksSection } from "@/components/showcase/HowItWorksSection";
import { ArchitectureDiagramSection } from "@/components/showcase/ArchitectureDiagramSection";
import { CopilotShowcaseSection } from "@/components/showcase/CopilotShowcaseSection";
import { MultiAgentSection } from "@/components/showcase/MultiAgentSection";
import { PluginsConnectorsSection } from "@/components/showcase/PluginsConnectorsSection";
import { SecurityGovernanceSection } from "@/components/showcase/SecurityGovernanceSection";
import { RealtimeSection } from "@/components/showcase/RealtimeSection";
import { DemoSimulationSection } from "@/components/showcase/DemoSimulationSection";
import { UseCaseSection } from "@/components/showcase/UseCaseSection";
import { TechnologyMatrixSection } from "@/components/showcase/TechnologyMatrixSection";
import { DifferentiationSection } from "@/components/showcase/DifferentiationSection";
import { ShowcaseFooter } from "@/components/showcase/ShowcaseFooter";
import { VyronFiveThemeShowcaseGrid } from "@/components/showcase/VyronPaletteGradientCard";
import type { VyronTheme } from "@/styles/vyron-auth-tokens";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "VYRON — Product Intelligence & Technology Showcase" },
      {
        name: "description",
        content:
          "Dedicated product showcase and technology explanation for VYRON: engineering intelligence, architecture governance, AST analysis, and AI-assisted software quality.",
      },
      {
        property: "og:title",
        content: "VYRON — Product Intelligence & Technology Showcase",
      },
      {
        property: "og:description",
        content:
          "Engineering intelligence, living blueprints, AST maintainability, Bandit security, and autonomous Copilot missions.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
  component: ShowcasePage,
});

function ShowcasePage() {
  const [activeSection, setActiveSection] = useState<string>("showcase");
  const [activePalette, setActivePalette] = useState<VyronTheme>("navy");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vyron_palette_theme") as VyronTheme | null;
      if (stored && ["navy", "royal-smoke", "obsidian-glow", "neon-dusk", "emerald-dark"].includes(stored)) {
        setActivePalette(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  // Scrollspy tracking for the 5 canonical sections (Requirement 051, 555-562)
  useEffect(() => {
    const sectionIds = ["showcase", "github", "features", "how-it-works", "technology"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            const top = element.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial hash if deep-linking
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (sectionIds.includes(hash)) {
        setActiveSection(hash);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (hash: string) => {
    const targetId = hash.replace("#", "");
    setActiveSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.pushState(null, "", hash);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* 5-ITEM TOP CENTER STICKY NAVIGATION (Requirement 045-055, 548-564) */}
      <ShowcaseNav activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* 1. HERO / AI TOOL SHOWCASE (#showcase) — Chapter 1: Introduction (Dark Navy) */}
        <div data-vyron-theme="navy">
          <ShowcaseHero />
        </div>

        {/* 2. WHY BRAHMA EXISTS (The Governance Gap) — Chapter 1 Continuation */}
        <div data-vyron-theme="navy">
          <WhyBrahmaSection />
        </div>

        {/* 2B. FIVE-PALETTE DESIGN SYSTEM PRESETS (PROJECT BRAHMA PART L) */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-border/40">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Five-Palette Design System
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Harmonized Multi-Identity Architecture
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Royal Smoke · Dark Navy · Obsidian Glow · Neon Dusk · Emerald Dark — Five cohesive palettes engineered for cognitive clarity, zero eye-strain, and mathematical WCAG 2.2 AA contrast compliance.
            </p>
          </div>
          <VyronFiveThemeShowcaseGrid
            currentTheme={activePalette}
            onSelectTheme={(t) => {
              setActivePalette(t);
              document.documentElement.setAttribute("data-vyron-theme", t);
              localStorage.setItem("vyron_palette_theme", t);
            }}
          />
        </section>

        {/* 3. FEATURE UNIVERSE (#features - 17 Capability Families) — Chapter 2: Engineering Capabilities */}
        <div data-vyron-theme="neon-dusk">
          <FeatureUniverseSection />
        </div>

        {/* 4. GITHUB MIRROR STORY (#github - Pipeline & Scenarios) — Chapter 2 Continuation */}
        <div data-vyron-theme="neon-dusk">
          <GitHubMirrorSection />
        </div>

        {/* 5. HOW IT WORKS (#how-it-works - 10-Phase Lifecycle) — Chapter 3: System Architecture & AI Intelligence */}
        <div data-vyron-theme="obsidian-glow">
          <HowItWorksSection />
        </div>

        {/* 6. INTERACTIVE ARCHITECTURE GRAPH (18-Node Canvas) — Chapter 3 Continuation */}
        <div data-vyron-theme="obsidian-glow">
          <ArchitectureDiagramSection />
        </div>

        {/* 7. COPILOT FLAGSHIP SHOWCASE (Release Scenario Runner) — Chapter 3: Velvet Intelligence */}
        <div data-vyron-theme="royal-smoke">
          <CopilotShowcaseSection />
        </div>

        {/* 8. MULTI-AGENT INTELLIGENCE (7 Specialist Roles) — Chapter 3 Continuation */}
        <div data-vyron-theme="royal-smoke">
          <MultiAgentSection />
        </div>

        {/* 9. PLUGINS & CONNECTORS (MCP Extensibility) — Chapter 6: Integrations */}
        <div data-vyron-theme="neon-dusk">
          <PluginsConnectorsSection />
        </div>

        {/* 10. SECURITY, GOVERNANCE & PROVENANCE (Zero Trust & Cryptography) — Chapter 1 Governance */}
        <div data-vyron-theme="navy">
          <SecurityGovernanceSection />
        </div>

        {/* 11. REALTIME PIPELINE (WebSocket Telemetry Stream) — Chapter 6: Telemetry */}
        <div data-vyron-theme="neon-dusk">
          <RealtimeSection />
        </div>

        {/* 12. DEMO SIMULATION LAB (Isolated Sandbox) — Chapter 4: Collaboration & Productivity */}
        <div data-vyron-theme="emerald-dark">
          <DemoSimulationSection />
        </div>

        {/* 13. USE CASES & AUDIENCE (Practical Engineering Value) — Chapter 5: Guidance & Operations */}
        <div data-vyron-theme="emerald-dark">
          <UseCaseSection />
        </div>

        {/* 14. LAYERED TECHNOLOGY MATRIX (#technology - 8 Tiers) — Chapter 6: Infrastructure */}
        <div data-vyron-theme="neon-dusk">
          <TechnologyMatrixSection />
        </div>

        {/* 15. PRODUCT DIFFERENTIATION (Comparative Engineering Matrix) — Chapter 7: Call to Action Transition */}
        <div data-vyron-theme="navy">
          <DifferentiationSection />
        </div>
      </main>

      {/* 16. FOOTER & CALL TO ACTION */}
      <ShowcaseFooter />
    </div>
  );
}
