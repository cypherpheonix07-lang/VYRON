# SUSPENDED THREAD MOTION & INTERACTION SPECIFICATION

**Concept**: VYRON Suspended Identity Flow  
**Target View**: Sign In · Create Account · Choose Workspace  

---

## 1. Motion Principles & Budgets

- **Hardware Acceleration**: All transitions use GPU-accelerated properties (`transform`, `opacity`, `filter`).
- **Timing Standards**:
  - Button Feedback: `120ms–150ms ease-out`
  - Form & Stage Switching: `200ms–240ms cubic-bezier(0.16, 1, 0.3, 1)`
  - Card Hover Lift: `180ms ease-out` (`transform: translateY(-2px)`)
  - Thread Cord Extension: `240ms ease-out`
  - Active Glow Illumination: `280ms ease-in-out`

---

## 2. Interaction States

### 2.1 Resting / Inactive Card
- Surface: `rgba(16, 26, 24, 0.5)`
- Border: `rgba(255, 255, 255, 0.1)`
- Vertical cord: `h-3`, opacity `0.15`
- Scale: `1.0`

### 2.2 Hovered Card
- Surface: `rgba(16, 26, 24, 0.8)`
- Border: `rgba(255, 255, 255, 0.2)`
- Vertical cord: `h-4`, opacity `0.3`
- Translation: `translateY(-1px)`

### 2.3 Active Card
- Surface: `#101A18`
- Border: Accent color (Thread 1: `#79D9F7`, Thread 2: `#BCA8FF`, Thread 3: `#78E0B8`)
- Vertical cord: `h-5`, gradient from anchor to accent
- Translation: `translateY(-2px)`
- Box Shadow: `0 4px 20px -2px var(--glow-color)`

---

## 3. WCAG 2.2 Reduced-Motion Policy

When the user has configured `prefers-reduced-motion: reduce`:
- Vertical translations are completely disabled (`transform: none`).
- Card cord extensions are fixed to constant height.
- Transitions switch to immediate cross-fades (`duration: 0.01ms`).
- All keyboard and assistive technology functionality is 100% preserved.
