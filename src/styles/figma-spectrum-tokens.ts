/**
 * PROJECT BRAHMA / VYRON — FIGMA DESIGN TOKEN SYSTEM
 * Imported design token contract for the Neon Multi-Chromatic Spectrum.
 * Colors: Neon Blue variations, Red, Dark Green, and Gold.
 * Zero particles. Zero raw SQL.
 */

export const FIGMA_SPECTRUM_TOKENS = {
  meta: {
    source: "Figma Design System Core (brahma_core_ds)",
    version: "3.5.0",
    name: "Neon Multi-Spectrum Chromatic Palette",
    importedAt: "2026-11-02T12:25:00.000Z",
  },
  palette: {
    // 1. Neon Blue Variations
    neonBlue: {
      electricCyan: "oklch(0.88 0.16 215)", // #00f3ff
      cyberAzure: "oklch(0.72 0.15 220)",   // #00b4d8
      royalCobalt: "oklch(0.55 0.24 260)",  // #0066ff
      deepNavy: "oklch(0.12 0.05 255)",     // #030b1e
    },
    // 2. Red Variations
    red: {
      neonCrimson: "oklch(0.62 0.25 15)",   // #ff0055
      deepRuby: "oklch(0.35 0.18 15)",      // #8b0029
      laserRose: "oklch(0.70 0.22 355)",    // #ff2a6d
    },
    // 3. Dark Green Variations
    darkGreen: {
      forestMoss: "oklch(0.35 0.08 155)",   // #00C896 Emerald anchor
      emeraldDepth: "oklch(0.22 0.06 150)", // #022c22
      quantumMint: "oklch(0.82 0.18 155)",  // #00ff88
    },
    // 4. Gold Variations
    gold: {
      solarGold: "oklch(0.85 0.18 85)",     // #ffd700
      amberRadiance: "oklch(0.75 0.16 70)", // #f59e0b
      champagne: "oklch(0.92 0.08 90)",     // #fef08a
    },
  },
  surfaces: {
    darkObsidianBase: "oklch(0.10 0.02 260)", // #02040a
    vignetteOverlay: "oklch(0.08 0.015 260 / 0.85)",
  },
} as const;

export type FigmaSpectrumTokens = typeof FIGMA_SPECTRUM_TOKENS;
