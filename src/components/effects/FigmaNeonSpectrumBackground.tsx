import { useEffect, useState } from "react";

/**
 * VYRON / ATHER — 18-SHADE 3D VOLUMETRIC GLASS AMBIENT SYSTEM
 *
 * Implements the hybrid background architecture:
 * A. Base Background: Obsidian black (#0B0B0B), Slate Dusk (#0F172A), and Cyber Teal (#05161A).
 * B. Ambient Neon Lighting: Soft radial glows using Cyber Teal (#0F969C / #0C7075) and Slate Dusk (#334155).
 * C. Precision Lattice: Subtle neon grid backdrop with teal/slate edge highlights.
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
      {/* 1. Base Foundation: Obsidian Black (#0B0B0B), Slate Dusk (#0F172A) & Cyber Teal (#05161A) */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(130% 110% at 50% 0%, #0F172A 0%, #0B0B0B 65%, #05161A 100%)",
        }}
      />

      {/* 2. Ambient Volumetric Lighting (Soft Cyber Teal & Slate Dusk Radial Glows) */}
      {!prefersReducedMotion && (
        <>
          {/* Node Alpha: Cyber Teal Glow (Top Left) — #0F969C / #072E33 */}
          <div
            className="absolute -top-[12%] -left-[10%] h-[58vw] w-[58vw] rounded-full blur-[160px] opacity-[0.24] animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(15, 150, 156, 0.45) 0%, rgba(7, 46, 51, 0.25) 45%, transparent 75%)",
              animationDuration: "14s",
            }}
          />

          {/* Node Beta: Deep Cyber Teal (Bottom Right) — #0C7075 / #05161A */}
          <div
            className="absolute -bottom-[16%] -right-[8%] h-[62vw] w-[62vw] rounded-full blur-[175px] opacity-[0.22] animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(12, 112, 117, 0.40) 0%, rgba(5, 22, 26, 0.22) 50%, transparent 75%)",
              animationDuration: "18s",
              animationDelay: "2s",
            }}
          />

          {/* Node Gamma: Midfield Atmospheric Slate Convergence — #334155 */}
          <div
            className="absolute top-[28%] left-1/2 -translate-x-1/2 h-[45vw] w-[45vw] rounded-full blur-[190px] opacity-[0.15]"
            style={{
              background:
                "radial-gradient(circle, rgba(51, 65, 85, 0.32) 0%, rgba(15, 150, 156, 0.18) 55%, transparent 80%)",
            }}
          />
        </>
      )}

      {/* 3. High-Precision Engineering Grid Backdrop with Subtle Teal Highlights */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 150, 156, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(109, 165, 192, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 4. Atmospheric Vignette & Contrast Readability Filter */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-transparent to-[#0B0B0B]/75 backdrop-blur-[1px]" />
    </div>
  );
}
