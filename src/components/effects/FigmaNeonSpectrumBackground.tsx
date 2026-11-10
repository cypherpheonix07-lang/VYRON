import { useEffect, useState } from "react";

/**
 * VYRON / ATHER — HYBRID NEON GLASSMORPHISM AMBIENT SYSTEM
 *
 * Implements the hybrid background architecture:
 * A. Base Background: Obsidian black (#050505) and dark charcoal (#1C1C1C) cinematic foundation.
 * B. Ambient Neon Lighting: Soft radial glows using Royal Purple (#6A0DAD / #4A1478) and Deep Indigo (#3A0CA3 / #1F0A57).
 * C. Precision Lattice: Subtle neon grid backdrop with violet edge highlights.
 * D. Dark Vignette: Atmospheric gradient for crisp foreground contrast and zero eye fatigue.
 *
 * Fully respects prefers-reduced-motion. Zero ungrounded overhead.
 */

export function FigmaNeonSpectrumBackground() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkReducedMotion = () => {
      if (typeof window !== "undefined" && window.matchMedia) {
        setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
    };
    checkReducedMotion();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
      data-theme="vyron-neon-glassmorphism-backdrop"
    >
      {/* 1. Base Foundation: Obsidian Black (#050505) & Subtle Charcoal (#1C1C1C) Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(130% 110% at 50% 0%, #14141E 0%, #050505 65%, #020205 100%)",
        }}
      />

      {/* 2. Ambient Neon Lighting (Soft Royal Purple & Deep Indigo Radial Glows) */}
      {!prefersReducedMotion && (
        <>
          {/* Node Alpha: Royal Smoke Purple Glow (Top Left) — #6A0DAD / #4A1478 */}
          <div
            className="absolute -top-[12%] -left-[10%] h-[58vw] w-[58vw] rounded-full blur-[160px] opacity-[0.24] animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(106, 13, 173, 0.45) 0%, rgba(74, 20, 120, 0.25) 45%, transparent 75%)",
              animationDuration: "14s",
            }}
          />

          {/* Node Beta: Obsidian Glow Deep Indigo (Bottom Right) — #3A0CA3 / #1F0A57 */}
          <div
            className="absolute -bottom-[16%] -right-[8%] h-[62vw] w-[62vw] rounded-full blur-[175px] opacity-[0.22] animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(58, 12, 163, 0.40) 0%, rgba(31, 10, 87, 0.22) 50%, transparent 75%)",
              animationDuration: "18s",
              animationDelay: "2s",
            }}
          />

          {/* Node Gamma: Midfield Atmospheric Violet Convergence — #4A1478 */}
          <div
            className="absolute top-[28%] left-1/2 -translate-x-1/2 h-[45vw] w-[45vw] rounded-full blur-[190px] opacity-[0.15]"
            style={{
              background:
                "radial-gradient(circle, rgba(106, 13, 173, 0.30) 0%, rgba(58, 12, 163, 0.18) 55%, transparent 80%)",
            }}
          />
        </>
      )}

      {/* 3. High-Precision Engineering Grid Backdrop with Subtle Violet Highlights */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(106, 13, 173, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(58, 12, 163, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 4. Atmospheric Vignette & Contrast Readability Filter */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-transparent to-[#050505]/75 backdrop-blur-[1px]" />
    </div>
  );
}
