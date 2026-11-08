import { useEffect, useState } from "react";

/**
 * VYRON / ATHER — FIGMA NEON SPECTRUM BACKGROUND
 * High-performance, GPU-accelerated ambient backdrop incorporating the 5 canonical dark palettes:
 * - Royal Smoke: #6A0DAD & #1C1C1C
 * - Dark & Elegant Navy: #1F1F1F & #0A1A2F
 * - Obsidian Glow: #3A0CA3 & #050505
 * - Neon Dusk: #00D4FF & #020024
 * - Emerald Dark: #00C896, #040404 & #1F1F1F
 *
 * Zero legacy stops (#436B4D, #D1C8F4, #DFCDD2, #D9BFC0).
 * Zero particles. Zero ungrounded performance overhead. Full reduced-motion defense.
 */

interface ThemeGlowColors {
  primaryGlow: string;
  secondaryGlow: string;
  accentGlow: string;
  foundationBg: string;
}

const THEME_SPECTRUM_CONFIG: Record<string, ThemeGlowColors> = {
  navy: {
    primaryGlow: "rgba(0, 212, 255, 0.18)", // #00D4FF Electric Cyan
    secondaryGlow: "rgba(10, 26, 47, 0.45)", // #0A1A2F Deep Navy
    accentGlow: "rgba(0, 200, 150, 0.12)",   // #00C896 Emerald accent
    foundationBg: "#0A1A2F",
  },
  midnight: {
    primaryGlow: "rgba(0, 212, 255, 0.18)",
    secondaryGlow: "rgba(10, 26, 47, 0.45)",
    accentGlow: "rgba(0, 200, 150, 0.12)",
    foundationBg: "#0A1A2F",
  },
  "dark-navy": {
    primaryGlow: "rgba(0, 212, 255, 0.18)",
    secondaryGlow: "rgba(10, 26, 47, 0.45)",
    accentGlow: "rgba(0, 200, 150, 0.12)",
    foundationBg: "#0A1A2F",
  },
  "royal-smoke": {
    primaryGlow: "rgba(106, 13, 173, 0.25)", // #6A0DAD Royal Purple
    secondaryGlow: "rgba(28, 28, 28, 0.50)",  // #1C1C1C Dark Charcoal
    accentGlow: "rgba(58, 12, 163, 0.20)",   // #3A0CA3 Deep Indigo
    foundationBg: "#1C1C1C",
  },
  "obsidian-glow": {
    primaryGlow: "rgba(58, 12, 163, 0.28)",  // #3A0CA3 Deep Indigo
    secondaryGlow: "rgba(106, 13, 173, 0.20)", // #6A0DAD Royal Purple
    accentGlow: "rgba(0, 212, 255, 0.12)",   // #00D4FF Cyan highlight
    foundationBg: "#050505",                 // #050505 Obsidian Black
  },
  "neon-dusk": {
    primaryGlow: "rgba(0, 212, 255, 0.22)",  // #00D4FF Electric Cyan
    secondaryGlow: "rgba(2, 0, 36, 0.60)",   // #020024 Midnight Blue-Black
    accentGlow: "rgba(0, 200, 150, 0.14)",   // #00C896 Emerald accent
    foundationBg: "#020024",
  },
  "emerald-dark": {
    primaryGlow: "rgba(0, 200, 150, 0.22)",  // #00C896 Emerald Green
    secondaryGlow: "rgba(4, 4, 4, 0.50)",    // #040404 Rich Black
    accentGlow: "rgba(0, 212, 255, 0.12)",   // #00D4FF Cyan secondary
    foundationBg: "#040404",
  },
  "warm-breeze": {
    primaryGlow: "rgba(133, 67, 30, 0.25)",
    secondaryGlow: "rgba(211, 152, 88, 0.35)",
    accentGlow: "rgba(234, 206, 170, 0.20)",
    foundationBg: "#EACEAA",
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

  const glowConfig = THEME_SPECTRUM_CONFIG[activeTheme] || THEME_SPECTRUM_CONFIG.navy;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
      data-theme="vyron-palette-ambient"
    >
      {/* 1. Deep Unified 5-Palette Foundation (#050505 / #0A1A2F / #020024 / #1C1C1C / #040404) */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: glowConfig.foundationBg }}
      />

      {/* 2. Harmonized 5-Spectrum Aurora Glow Mesh (No Particles) */}
      {!prefersReducedMotion && (
        <>
          {/* Node 1: Primary Aurora Orb (Top Left) — #00D4FF / #6A0DAD / #3A0CA3 */}
          <div
            className="absolute -top-[14%] -left-[10%] h-[55vw] w-[55vw] rounded-full blur-[140px] opacity-40 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${glowConfig.primaryGlow} 0%, transparent 70%)`,
            }}
          />

          {/* Node 2: Secondary Aurora Orb (Bottom Right) — #0A1A2F / #020024 / #040404 */}
          <div
            className="absolute -bottom-[18%] -right-[10%] h-[60vw] w-[60vw] rounded-full blur-[160px] opacity-35 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${glowConfig.secondaryGlow} 0%, transparent 75%)`,
            }}
          />

          {/* Node 3: Chromatic Accent Convergence (Center Midfield) — #00C896 / #3A0CA3 */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45vw] w-[45vw] rounded-full blur-[180px] opacity-20 transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${glowConfig.accentGlow} 0%, transparent 80%)`,
            }}
          />
        </>
      )}

      {/* 3. High-Precision Engineering Grid Backdrop */}
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
