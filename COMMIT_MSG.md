feat(core): enterprise architecture, AI Studio suite, real Supabase auth & platform hardening

SUPABASE & AUTHENTICATION ENGINE

- Canonical client (src/lib/supabaseClient.ts): Singleton pattern, PKCE flow, fail-loud env guards.
- Canonical auth service (src/services/authService.ts): Full 10-method abstraction for password, magic link/OTP, Google/GitHub OAuth, enterprise SSO, and WebAuthn passkeys with zero mock logic.
- Profiles & Security Schema (src/lib/profiles_schema.sql, migrations): Auto-profile creation on auth.users trigger, non-recursive RLS policies (auth.uid() = id), and SECURITY DEFINER role assignment.
- Auth Route Tree: /login, /register (multi-step wizard), /forgot-password, /reset-password, /verify-email, /auth/callback, /onboarding, /invite.
- Verified 4-Stage Core Verification Gate (verify-step1-8.mjs): getSession 200 OK, auto-profile trigger, non-admin role escalation block, and admin bootstrap.

AI STUDIO & ENGINEERING INTELLIGENCE SUITE

- AI Studio Suite (/app/studio): Interactive create wizard, templates library, project importer, execution planner, streaming generator, visual & code editor, data schema designer, tests, security, versions, collaborate, and analytics.
- Project Detail Deep Dives (/app/projects/$id): Requirements, Blueprint canvas, Code Health, Security Scanner, Risk & Business Impact, Automated Tests, Version History, Collaboration, and Publish Gate.
- LLM Gateway & Edge Functions: Gateway routing, provenance popover, and embedding pipelines.
- Preview Engine (/app/preview): Live interaction layer, resource fetcher, split code panel, and preview feature grid.

GOVERNANCE, DESIGN SYSTEM & DX

- Design System: Inter typography + Lucide icon standard with optimized dark/light token system.
- Code Splitting: Fixed TanStack Router route exports in settings, preview, and admin pages.
- Centralized Feature Flags (src/config/featureFlags.ts): Gated DEMO_MODE toggles without inline pollution.
- TypeScript & Automation: 100% typechecked clean with tsc --noEmit and PowerShell launcher scripts.
