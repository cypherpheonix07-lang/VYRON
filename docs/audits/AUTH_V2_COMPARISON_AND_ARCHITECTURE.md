# VYRON / ATHER — AUTHENTICATION EXPERIENCE V2
## Architectural Inspection, Comparison Table, and Implementation Specification
**Document ID:** VYRON-AUTH-V2-AUDIT-2026-11-12  
**Target:** Google Argon / Antigravity Coding Agent  
**Repository:** `cypherpheonix07-lang/VYRON`  
**Reference Environment:** `http://localhost:8080/app`  
**Design System:** 18-Shade 3D Volumetric Glassmorphism (Slate Dusk, Obsidian Monochrome, Cyber Teal)

---

### 1. Source Inspection & Current vs. Desired Behavior Matrix

| Domain | Current Implementation | Desired Auth V2 Implementation | Affected Files | Risk & Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Sign-In Motion** | Static card render with standard form inputs and basic submit button. | **Three Coordinated Treatments:**<br>1. *Volumetric Glass Reveal* (~18px upward slide, ~320ms, staggered field entrance).<br>2. *Directional Portal Slide* (~380ms horizontal ease between Sign In and Sign Up).<br>3. *Identity Focus Highlight* (cyber-teal luminous border, non-blocking auth spinner, post-auth success highlight). | `src/components/auth/MidnightCoralSignIn.tsx`<br>`src/styles/vyron-auth-tokens.ts`<br>`src/styles.css` | **Risk:** Layout shifts during animation.<br>**Mitigation:** Hardware-accelerated CSS `transform` and `opacity` with fixed container aspect. |
| **Sign-Up Journey** | 3-stage form (Identity -> Role -> Launch) with basic linear progress bar. | **Five-Stage Suspended Glass Journey:**<br>01. Identity (Name, Email, Password, OAuth)<br>02. Verification (6-digit OTP / magic link confirmation, resend timer)<br>03. Workspace (Student, Faculty, Professional; Admin gated)<br>04. Security (MFA enrollment, passkey readiness, recovery info)<br>05. Personalize & Launch (Goals, proficiency, engineering focus, preview & launch) | `src/components/auth/IndigoAuroraSignUp.tsx`<br>`src/components/auth/SuspendedIdentityThreads.tsx`<br>`src/components/auth/FiveStageProgressThreads.tsx` | **Risk:** State loss during stage navigation.<br>**Mitigation:** Persistent form state preserved across forward/backward transitions. |
| **Top Threads** | 3 top cards representing navigation modes ("Sign In", "Create Account", "Choose Workspace"). | **Suspended Identity Threads + Stage Nodes:**<br>Mode switcher remains accessible, while Sign-Up journey displays five suspended progress nodes connected by illuminated SVG threads and orbital completion arcs. | `src/components/auth/SuspendedIdentityThreads.tsx`<br>`src/components/auth/FiveStageProgressThreads.tsx` | **Risk:** Confusion between mode switching and stage progression.<br>**Mitigation:** Clear separation between global Auth Mode and Sign-Up Onboarding Stages. |
| **Stage Transitions** | Instant DOM element replacement with simple fade-in. | **Layered Glass Stack Transitions:**<br>Outgoing card recedes subtly (`scale(0.97)`, `opacity: 0`, 160ms); incoming card slides forward (`translateY(0)`, `scale(1)`, `opacity: 1`, 320ms). Smooth directional back/forward navigation. | `src/components/auth/IndigoAuroraSignUp.tsx`<br>`src/styles.css` | **Risk:** Double-click or duplicate submission during transition.<br>**Mitigation:** Navigation lock during transition windows (~300ms). |
| **Orbital Arc** | None. | **Orbital Progress Reveal:**<br>On successful stage completion, an orbital SVG completion arc (~360ms) illuminates the node before advancing to the next card. Non-looping, suppressed on error. | `src/components/auth/FiveStageProgressThreads.tsx`<br>`src/styles.css` | **Risk:** Visual lag on low-power devices.<br>**Mitigation:** SVG stroke-dasharray animation with `prefers-reduced-motion` override. |
| **Product Showcase** | Static card with "REALTIME LIVE" badge despite static telemetry mock data. | **Zero-Fiction Architecture Law Compliant:**<br>Explicit "SAMPLE DATA (ZERO-FICTION BENCHMARK)" tagging. Interactive tabs with animated SVG bus lines connecting AST, Twin, and Gate nodes. | `src/components/auth/GraphiteOceanShowcase.tsx` | **Risk:** Misleading telemetry claims.<br>**Mitigation:** Grounded labeling; zero fabricated live signals. |
| **Returning User Flow** | Often redirects through workspace modal regardless of existing onboarded state. | **Direct Highway:** Returning authenticated users bypass onboarding and are routed directly to `/app` or their role-specific dashboard. | `src/components/auth/PremiumAuthShell.tsx`<br>`src/routes/onboarding.tsx`<br>`src/routes/verify-email.tsx` | **Risk:** Returning users trapped in onboarding loop.<br>**Mitigation:** Checked against `user.onboarded` and profile database state. |
| **Role Authorization** | Client-side role selection allowed selecting "Admin". | **Server-Side Privilege Gate:** Admin role selection is strictly disabled unless the user possesses verified server-side claims or an approved organization invitation. | `src/components/auth/WorkspaceSelectionModal.tsx`<br>`src/components/auth/IndigoAuroraSignUp.tsx` | **Risk:** Unauthorized privilege escalation.<br>**Mitigation:** Client validation + Supabase RLS server-side role validation. |

---

### 2. Motion Timing and Sequence Specification
- **Volumetric Glass Reveal (Sign-In):** `320ms cubic-bezier(0.16, 1, 0.3, 1)` (translateY: 18px -> 0px, opacity: 0 -> 1)
- **Directional Portal Slide:** `380ms cubic-bezier(0.16, 1, 0.3, 1)` (translateX: ±32px -> 0px)
- **Layered Glass Card Outgoing:** `160ms ease-out` (scale: 1 -> 0.97, opacity: 1 -> 0)
- **Layered Glass Card Incoming:** `320ms cubic-bezier(0.16, 1, 0.3, 1)` (translateY: 12px -> 0px, scale: 0.98 -> 1, opacity: 0 -> 1)
- **Orbital Completion Arc:** `360ms cubic-bezier(0.4, 0, 0.2, 1)` (stroke-dashoffset: 100 -> 0)
- **Illuminated Connecting Thread:** `260ms ease-in-out` (width/height fill)
- **Node Activation:** `200ms ease-out` (glow scale & color shift)
- **Ambient Glow Breathing:** `450ms ease-in-out`
- **Prefers-Reduced-Motion:** Instantly transitions transforms to 0 and relies on simple opacity fade (150ms).
