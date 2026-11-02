# AUTHENTICATION & WORKSPACE EXPERIENCE — DESIGN RESEARCH SPECIFICATION

**Project**: VYRON / ATHER — Engineering Intelligence Platform  
**Target URL**: `http://localhost:8080/login`, `http://localhost:8080/register`, `http://localhost:8080/workspace`  
**Standard**: WCAG 2.2 Level AA · Zero-Fiction Architecture Law  

---

## 1. Professional Design Systems & Reference Protocol

### 1.1 Figma UI Kits & Enterprise Login Interfaces
- **Source**: [Figma Community & Color Palettes](https://www.figma.com/color-palettes/)
- **Core Principles**:
  - Balanced split-screen compositions separating authentication forms from product-led capability showcases.
  - Coordinated surface hierarchy: Base background (`#070C0B`), Card surface (`#101A18`), and Elevated panel (`#15201E`).
  - Distinct theme identities: Midnight Coral (`#FF9A8B`) for secure entry, Indigo Aurora (`#A8A4FF`) for account registration.
  - Non-distracting focus treatments with 2px offset rings (`#79D9F7`).

### 1.2 Radix Colors & Accessible Surface Scales
- **Source**: [Radix Colors System](https://www.radix-ui.com/colors)
- **Key Takeaways**:
  - Contrast compliance: Dark surface text contrasts exceed 4.5:1 against card backgrounds.
  - Semantic separation: Distinct token roles for focus, warning (`#FACC75`), success (`#78E0B8`), and errors (`#FC9E9E`).
  - Dark mode precision: Zero pure blacks (`#000000`) on cards to maintain visual depth and prevent OLED glare.

### 1.3 Material Design 3 (M3) Semantic Hierarchy
- **Source**: [Material Design 3](https://m3.material.io/)
- **Key Takeaways**:
  - Clear progression indicators: 3-stage onboarding (Identity → Role/Workspace → Personalization/Launch).
  - Explicit button states: Normal, hover, active, disabled, and loading spinner with screen-reader text.

### 1.4 Mobbin SaaS Sign-In & Onboarding References
- **Source**: [Mobbin SaaS Flows](https://mobbin.com/)
- **Key Takeaways**:
  - Reduced cognitive load: Avoid asking for unneeded profile information upfront.
  - Persistent state: Do not erase validated email or password when navigating back or recovering from errors.
  - Unified switcher: Provide one-click transitions between Sign In, Create Account, and Workspace Selection.

### 1.5 Motion for React & WCAG 2.2 Reduced-Motion Considerations
- **Source**: [Motion Accessibility](https://motion.dev/docs/react-accessibility)
- **Key Takeaways**:
  - Hardware-accelerated transitions: 180–240ms duration for cards, 120ms for button feedback.
  - Full support for `prefers-reduced-motion: reduce`: Removes physical sway and large translations, preserving immediate opacity and state transitions.

---

## 2. Reusability Analysis for VYRON

| Capability | What VYRON Reuses | What Is Banned in VYRON |
|---|---|---|
| Split-Screen Architecture | Left auth panel, right product showcase | Generic unbranded stock photography |
| Palette Architecture | Midnight Coral & Indigo Aurora | Random multi-color gradients and glowing clutter |
| Multi-Step Onboarding | 3-stage progression with state preservation | Public self-assignment of Administrator privilege |
| Motion Interaction | Suspended identity hanging threads | Perpetual bouncing or distracting particle loops |
