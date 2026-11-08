# VYRON / ATHER — MULTI-PALETTE SYSTEM SPECIFICATION
## Figma-Informed Color Architecture · Six Coordinated Palette Families · Semantic Token System

---

## 1. System Vision & Architecture
The VYRON / ATHER platform implements a unified, enterprise-grade multi-palette architecture where six user-supplied color families coexist harmoniously across distinct functional domains. Rather than fracturing into disparate applications or clashing on a single screen, the design system operates on three structured layers:

1. **Layer 1 — Global Foundation**: Technical Midnight Navy (`#0A1A2F`) and elevated Charcoal (`#1F1F1F`) provide continuous grounding, typography hierarchy, and navigation density.
2. **Layer 2 — Section Identity**: Designated functional modules receive calibrated primary accents and local semantic variables tailored to their cognitive domain.
3. **Layer 3 — Contextual Interaction**: Specialized components (charts, graph nodes, telemetry badges, AI inference indicators) employ contextual accents with strict WCAG 2.2 AA contrast enforcement.

---

## 2. Six User-Supplied Color Palette Families

### Palette Family 01 — MIDNIGHT
- **Identity**: Sleek, professional, technical, sophisticated.
- **Foundational Values**:
  - Charcoal Surface: `#1F1F1F`
  - Midnight Navy Base: `#0A1A2F`
  - Luminous Accent: `#22D3EE` / `#38BDF8`
- **Primary Domain Ownership**:
  - Global application shell & sidebar foundation
  - Primary Sign-In experience (`/login`, `/auth`)
  - Project Command Center & Executive Overview (`/app`)
  - Global Discovery Search (`/discover`, `/app/github`)
  - Platform Administration (`/app/platform-admin`)
  - Code Quality Lab (`/app/code-quality`)

### Palette Family 02 — PASTEL BREEZE / EMERALD DARK
- **Identity**: Calm, trustworthy, refreshing, human-centered.
- **Foundational Values**:
  - Deep Base (Almost Black): `#040404`
  - Charcoal Surface: `#1F1F1F`
  - Emerald Vivid Accent: `#00C896`
- **Accessibility Invariant**:
  - Emerald `#00C896` requires `#040404` near-black foreground (Contrast **9.47:1**). White on emerald is strictly forbidden (**2.16:1** FAIL).
- **Primary Domain Ownership**:
  - Sign-Up & Registration (`/register`, `/signup`)
  - Workspace Pulse / WorkPulse (`/app/workpulse`)
  - Team Collaboration (`/app/collab`, `/app/collaboration`)
  - Testing & Quality Platforms (`/app/testing`, `/app/quality`)
  - Healthy Verification States & Gate Passes

### Palette Family 03 — WARM BREEZE
- **Identity**: Approachable, editorial, premium, warm.
- **Foundational Values**:
  - Cream Base: `#EACEAA`
  - Caramel Surface: `#D39858`
  - Rich Brown Accent: `#85431E`
  - Espresso Deep Text: `#34150F`
- **Accessibility Invariant**:
  - Espresso `#34150F` text over Cream (Contrast **11.04:1**) and Caramel (Contrast **6.67:1**). Cream `#EACEAA` text over Rich Brown `#85431E` (Contrast **5.84:1**).
- **Primary Domain Ownership**:
  - Onboarding Guidance & Educational Walkthroughs
  - Knowledge & Documentation Hubs (`/app/knowledge`)
  - Requirements & Traceability Ledger (`/app/requirements`)
  - Product Storytelling & Light Mode Chapters

### Palette Family 04 — VELVET / ROYAL SMOKE
- **Identity**: Intelligent, luxurious, creative, advanced.
- **Foundational Values**:
  - Royal Purple Accent: `#6A0DAD`
  - Dark Charcoal Base: `#1C1C1C`
  - High-Contrast Foreground: `#FFFFFF` / `#F8FAFC`
- **Accessibility Invariant**:
  - Pure White `#FFFFFF` on Royal Purple `#6A0DAD` achieves **9.24:1** contrast. Purple text on dark charcoal is avoided for small text.
- **Primary Domain Ownership**:
  - ATHER AI Cognitive Studio (`/app/aether`, `/app/chat`)
  - Agent Command Hub (`/app/agents`)
  - Model Operations & Registry (`/app/model-ops`)
  - Specialist Tool Invocations & Deep Reasoning Cockpit

### Palette Family 05 — VELVET / OBSIDIAN GLOW
- **Identity**: Cinematic, experimental, advanced computation.
- **Foundational Values**:
  - Obsidian Violet: `#3A0CA3`
  - Near Black Base: `#050505`
  - High-Contrast Foreground: `#FFFFFF`
- **Accessibility Invariant**:
  - Pure White on Obsidian Violet `#3A0CA3` achieves **11.92:1** contrast.
- **Primary Domain Ownership**:
  - Architecture Studio & ATLAS (`/app/architecture-studio`, `/app/systems`)
  - Living Architecture Canvas & Reality Map (`/app/reality-map`)
  - Digital Twin Simulation Lab (`/app/simulation`)
  - Causal Change Impact & Drift Engines (`/app/drift`, `/app/impact`)

### Palette Family 06 — OCEAN BLUE / NEON DUSK
- **Identity**: Technical, futuristic, high-precision, operational.
- **Foundational Values**:
  - Vivid Cyan: `#00D4FF`
  - Deep Navy Base: `#020024`
- **Accessibility Invariant**:
  - Deep Navy `#020024` on Cyan `#00D4FF` achieves **11.54:1** contrast. White text on `#00D4FF` is strictly forbidden (**1.77:1** FAIL).
- **Primary Domain Ownership**:
  - Integration Workflows & MCP Connectors (`/app/connectors`, `/app/integrations`)
  - Release Pipelines & CI/CD (`/app/release`, `/app/cicd`, `/app/pipelines`)
  - Celery Flow & Sentinel (`/app/system-flow`)
  - Observability & Metrics (`/app/observability`, `/app/obs`, `/app/monitoring`)
  - Cloud Platform & Edge Telemetry (`/app/deployments`, `/app/infra`)
