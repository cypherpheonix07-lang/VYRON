import { useEffect, useState } from "react";
import { FIGMA_SPECTRUM_TOKENS } from "@/styles/figma-spectrum-tokens";

export function FigmaNeonSpectrumBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const { palette } = FIGMA_SPECTRUM_TOKENS;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
      data-theme="figma-neon-spectrum"
    >
      {/* 1. Deep Obsidian Vacuum Foundation */}
      <div className="absolute inset-0 bg-[#02040a] transition-colors duration-1000" />

      {/* 2. Multi-Chromatic Figma Design Token Aurora Glow Mesh (NO PARTICLES) */}

      {/* Node A: Neon Blue Variation (Electric Cyan / Royal Cobalt) - Top Left & Center Horizon */}
      <div
        className="absolute -top-[12%] -left-[10%] h-[55vw] w-[55vw] rounded-full blur-[140px] opacity-35 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${palette.neonBlue.electricCyan} 0%, ${palette.neonBlue.royalCobalt} 45%, transparent 75%)`,
          animationDuration: "12s",
        }}
      />
      <div
        className="absolute top-[28%] -left-[5%] h-[35vw] w-[35vw] rounded-full blur-[120px] opacity-25"
        style={{
          background: `radial-gradient(circle, ${palette.neonBlue.cyberAzure} 0%, transparent 70%)`,
        }}
      />

      {/* Node B: Neon Red / Ruby Crimson - Top Right & Upper Flank */}
      <div
        className="absolute -top-[10%] -right-[8%] h-[50vw] w-[50vw] rounded-full blur-[150px] opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${palette.red.neonCrimson} 0%, ${palette.red.deepRuby} 50%, transparent 75%)`,
          animationDuration: "14s",
          animationDelay: "2s",
        }}
      />

      {/* Node C: Dark Green (Figma Moss / Deep Emerald #436B4D) - Bottom Left & Ground Anchor */}
      <div
        className="absolute -bottom-[15%] -left-[8%] h-[58vw] w-[58vw] rounded-full blur-[160px] opacity-40 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${palette.darkGreen.quantumMint} 0%, ${palette.darkGreen.forestMoss} 50%, ${palette.darkGreen.emeraldDepth} 75%, transparent 85%)`,
          animationDuration: "16s",
          animationDelay: "4s",
        }}
      />

      {/* Node D: Solar Gold / Radiant Amber - Bottom Right & Core Center Glow */}
      <div
        className="absolute -bottom-[18%] -right-[10%] h-[56vw] w-[56vw] rounded-full blur-[150px] opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${palette.gold.solarGold} 0%, ${palette.gold.amberRadiance} 45%, transparent 75%)`,
          animationDuration: "13s",
          animationDelay: "1s",
        }}
      />

      {/* Node E: Subtle Golden-Cyan Chromatic Convergence in Center Midfield */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vw] w-[40vw] rounded-full blur-[180px] opacity-15"
        style={{
          background: `radial-gradient(circle, ${palette.gold.champagne} 0%, ${palette.neonBlue.electricCyan} 50%, transparent 80%)`,
        }}
      />

      {/* 3. Figma Design Precision Structural Lattice Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* 4. Elegant Vignette & High-Contrast Readability Filter */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/70 backdrop-blur-[1px]" />
    </div>
  );
}
