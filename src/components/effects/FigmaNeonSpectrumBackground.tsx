import { useEffect, useState } from "react";

interface ThemeGlowColors {
  primaryGlow: string;
  secondaryGlow: string;
  foundationBg: string;
}

const THEME_GLOWS: Record<string, ThemeGlowColors> = {
  navy: {
    primaryGlow: "rgba(0, 212, 255, 0.16)",
    secondaryGlow: "rgba(10, 26, 47, 0.40)",
    foundationBg: "#0A1A2F",
  },
  midnight: {
    primaryGlow: "rgba(0, 212, 255, 0.16)",
    secondaryGlow: "rgba(10, 26, 47, 0.40)",
    foundationBg: "#0A1A2F",
  },
  "royal-smoke": {
    primaryGlow: "rgba(106, 13, 173, 0.22)",
    secondaryGlow: "rgba(28, 28, 28, 0.45)",
    foundationBg: "#1C1C1C",
  },
  "obsidian-glow": {
    primaryGlow: "rgba(58, 12, 163, 0.25)",
    secondaryGlow: "rgba(5, 5, 5, 0.50)",
    foundationBg: "#050505",
  },
  "neon-dusk": {
    primaryGlow: "rgba(0, 212, 255, 0.20)",
    secondaryGlow: "rgba(2, 0, 36, 0.55)",
    foundationBg: "#020024",
  },
  "emerald-dark": {
    primaryGlow: "rgba(0, 200, 150, 0.18)",
    secondaryGlow: "rgba(4, 4, 4, 0.45)",
    foundationBg: "#040404",
  },
};

export function FigmaNeonSpectrumBackground() {
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>("navy");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkReducedMotion = () => {
      if (typeof window !== "undefined" && window.matchMedia) {
        setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
    };
    checkReducedMotion();

    const readTheme = () => {
      const current = document.documentElement.getAttribute("data-vyron-theme") || "navy";
      setActiveTheme(current);
    };
    readTheme();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-vyron-theme") {
          readTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return null;
  }

  const glowConfig = THEME_GLOWS[activeTheme] || THEME_GLOWS.navy;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
      data-theme="vyron-palette-ambient"
    >
      {/* 1. Cohesive Palette Foundation */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: glowConfig.foundationBg }}
      />

      {/* 2. Harmonized Ambient Aurora Mesh (Follows Active Theme Palette) */}
      {!prefersReducedMotion && (
        <>
          {/* Primary Top-Left Ambient Orb */}
          <div
            className="absolute -top-[15%] -left-[10%] h-[55vw] w-[55vw] rounded-full blur-[140px] opacity-40 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${glowConfig.primaryGlow} 0%, transparent 70%)`,
            }}
          />

          {/* Secondary Bottom-Right Ambient Orb */}
          <div
            className="absolute -bottom-[20%] -right-[10%] h-[60vw] w-[60vw] rounded-full blur-[160px] opacity-35 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${glowConfig.secondaryGlow} 0%, transparent 75%)`,
            }}
          />

          {/* Central Subtle Accent Pool */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45vw] w-[45vw] rounded-full blur-[180px] opacity-20 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${glowConfig.primaryGlow} 0%, transparent 80%)`,
            }}
          />
        </>
      )}

      {/* 3. High-Precision Engineering Lattice Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* 4. Elegant Vignette & High-Contrast Readability Filter */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/60 backdrop-blur-[1px]" />
    </div>
  );
}
