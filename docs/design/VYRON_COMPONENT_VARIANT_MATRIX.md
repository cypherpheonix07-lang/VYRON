# VYRON / ATHER — COMPONENT VARIANT & STATE MATRIX
## Enterprise Semantic Design Tokens Across Interactive States

---

## 1. Core Component Inventory & States

All components utilize semantic CSS tokens (`var(--vyron-*)`) rather than hardcoded hex values, ensuring seamless fidelity across all six multi-palette identities.

| Component | Default State | Hover State | Focus State | Pressed / Active | Disabled State | Loading State |
|---|---|---|---|---|---|---|
| **Primary Button (Midnight)** | `bg: #22D3EE`, `text: #0A1A2F` | `bg: #38BDF8`, shadow-cyan | `ring-2 ring-cyan-400` | `bg: #0284C7`, scale: 0.98 | `opacity-40 pointer-events-none` | `cursor-wait, spinner` |
| **Primary Button (Emerald)** | `bg: #00C896`, `text: #040404` | `bg: #05E2AA`, shadow-emerald| `ring-2 ring-emerald-400` | `bg: #00A87D`, scale: 0.98 | `opacity-40 pointer-events-none` | `cursor-wait, spinner` |
| **Primary Button (Ocean Cyan)**| `bg: #00D4FF`, `text: #020024` | `bg: #38E1FF`, shadow-cyan | `ring-2 ring-cyan-300` | `bg: #00B4D8`, scale: 0.98 | `opacity-40 pointer-events-none` | `cursor-wait, spinner` |
| **Primary Button (Velvet)** | `bg: #6A0DAD`, `text: #FFFFFF` | `bg: #7C13C9`, shadow-purple| `ring-2 ring-purple-400` | `bg: #55078F`, scale: 0.98 | `opacity-40 pointer-events-none` | `cursor-wait, spinner` |
| **Primary Button (Warm Breeze)**| `bg: #85431E`, `text: #EACEAA` | `bg: #9C5126`, shadow-amber | `ring-2 ring-amber-600` | `bg: #6E3516`, scale: 0.98 | `opacity-40 pointer-events-none` | `cursor-wait, spinner` |
| **Secondary Button** | `bg: var(--vyron-surface)`, `border: var(--vyron-border)` | `bg: white/10` | `ring-1 ring-primary` | `scale: 0.98` | `opacity-40` | `spinner` |
| **Form Input** | `bg: var(--vyron-surface)`, `border: var(--vyron-border)` | `border: var(--vyron-muted)` | `border: var(--vyron-focus), ring-1` | Active typing | `bg: muted/20, text-muted` | Read-only loading shimmer |
| **Surface Card** | `bg: var(--vyron-surface)`, `border: var(--vyron-border)` | `border: var(--vyron-primary)/40, y: -1px` | Card outline | Clickable selection | `grayscale` | Skeleton pulse |
| **Status Badge** | `bg: status/15, text: status` | `brightness-110` | N/A | N/A | Muted gray | Pulsing dot |

---

## 2. Dynamic Theme Orchestration
Components determine their appearance via the scoped `[data-vyron-theme]` attribute on their container or route wrapper:
```tsx
<div data-vyron-theme="emerald-dark" className="...">
  {/* Inherits Emerald Dark background, surface, and high-contrast #040404 on #00C896 button */}
  <button className="btn-vyron-primary">Get Started</button>
</div>
```
