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
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      window.history.pushState(null, "", hash);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* 5-ITEM TOP CENTER STICKY NAVIGATION (Requirement 045-055, 548-564) */}
      <ShowcaseNav activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* 1. HERO / AI TOOL SHOWCASE (#showcase) */}
        <ShowcaseHero />

        {/* 2. WHY BRAHMA EXISTS (The Governance Gap) */}
        <WhyBrahmaSection />

        {/* 3. FEATURE UNIVERSE (#features - 17 Capability Families) */}
        <FeatureUniverseSection />

        {/* 4. GITHUB MIRROR STORY (#github - Pipeline & Scenarios) */}
        <GitHubMirrorSection />

        {/* 5. HOW IT WORKS (#how-it-works - 10-Phase Lifecycle) */}
        <HowItWorksSection />

        {/* 6. INTERACTIVE ARCHITECTURE GRAPH (18-Node Canvas) */}
        <ArchitectureDiagramSection />

        {/* 7. COPILOT FLAGSHIP SHOWCASE (Release Scenario Runner) */}
        <CopilotShowcaseSection />

        {/* 8. MULTI-AGENT INTELLIGENCE (7 Specialist Roles) */}
        <MultiAgentSection />

        {/* 9. PLUGINS & CONNECTORS (MCP Extensibility) */}
        <PluginsConnectorsSection />

        {/* 10. SECURITY, GOVERNANCE & PROVENANCE (Zero Trust & Cryptography) */}
        <SecurityGovernanceSection />

        {/* 11. REALTIME PIPELINE (WebSocket Telemetry Stream) */}
        <RealtimeSection />

        {/* 12. DEMO SIMULATION LAB (Isolated Sandbox) */}
        <DemoSimulationSection />

        {/* 13. USE CASES & AUDIENCE (Practical Engineering Value) */}
        <UseCaseSection />

        {/* 14. LAYERED TECHNOLOGY MATRIX (#technology - 8 Tiers) */}
        <TechnologyMatrixSection />

        {/* 15. PRODUCT DIFFERENTIATION (Comparative Engineering Matrix) */}
        <DifferentiationSection />
      </main>

      {/* 16. FOOTER & CALL TO ACTION */}
      <ShowcaseFooter />
    </div>
  );
}
