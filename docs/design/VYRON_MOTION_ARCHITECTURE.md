# VYRON / ATHER — MOTION ARCHITECTURE & SUSPENDED THREAD DYNAMICS
## Micro-Interactions · Spring Physics · Accessible Reduced-Motion Invariants

---

## 1. Motion Timing Architecture

| Interaction Type | Duration Range | Easing Curve | Purpose |
|---|---|---|---|
| **Micro-Interactions (Buttons, Badges)** | 120ms – 180ms | `cubic-bezier(0.2, 0, 0, 1)` | Tactile immediate feedback |
| **Tooltips & Popovers** | 120ms – 200ms | `ease-out` | Non-blocking context hints |
| **Tab & Segment Switches** | 150ms – 250ms | `cubic-bezier(0.16, 1, 0.3, 1)`| Spatial continuity |
| **Drawer & Modal Transitions** | 200ms – 320ms | `cubic-bezier(0.32, 0.72, 0, 1)` | Clear entrance / exit depth |
| **Accordion Navigation** | 180ms – 260ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth content revealing |
| **Hanging Thread Card Settling** | 350ms – 550ms | `spring(stiffness: 180, damping: 22)` | Elastic physics settling |
| **Route & Page Transition** | 250ms – 400ms | `cubic-bezier(0.16, 1, 0.3, 1)`| Frictionless visual handoff |

---

## 2. Three Hanging Threads Dynamic Transitions

The signature auth transition utilizes the metaphor of three cards suspended from luminous overhead threads:

1. **Thread 01 — Identify (`#0A1A2F` / Sky Cyan `#38BDF8`)**:
   - Represents identity credential capture (Email/Password or OAuth).
2. **Thread 02 — Authenticate (`#040404` / Emerald `#00C896`)**:
   - Represents verification, OTP, and session creation.
3. **Thread 03 — Enter Workspace (`#1C1C1C` / Velvet `#6A0DAD`)**:
   - Represents role onboarding and tenant workspace activation.

### Spring Dynamics & Settling
- SVG anchor points at `(x: 50%, y: 0)` with vertical connector lines (`stroke-dasharray`, opacity `0.25`).
- Active card elevates with `transform: translateY(0px)` and soft glow drop-shadow.
- Inactive / pending cards hang slightly lower `transform: translateY(12px)` with reduced opacity (`0.55`).
- Completed cards show a luminous emerald checkmark at the thread knot.

---

## 3. Accessibility & `prefers-reduced-motion`

When `prefers-reduced-motion: reduce` is active:
- Transform animations are suppressed (`transform: none !important;`).
- Transition durations are collapsed to `<= 0.01ms` or gentle opacity fades.
- Spring physics are disabled in favor of static structural state rendering.
