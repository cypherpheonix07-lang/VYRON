feat: enterprise architecture, AI Studio suite, real Supabase auth, platform hardening

SUPABASE & AUTH
- Canonical client (src/lib/supabaseClient.ts): session persistence, token auto-refresh.
- authService abstraction: password, magic link/OTP, Google/GitHub OAuth,
  enterprise SSO, WebAuthn passkeys.
- Demo simulation gated behind VITE_DEMO_MODE; zero inline demo leaks.
- profiles_schema.sql: profiles table, handle_new_user trigger,
  prevent_role_self_change trigger, set_user_role SECURITY DEFINER fn, RLS policies.
- Auth routes: /login, /register (5-step wizard), /forgot-password,
  /reset-password, /verify-email, /auth/callback, /onboarding, /invite.

STUDIO & ENGINEERING INTELLIGENCE
- AI Studio suite at /app/studio: create, templates, import, plan, streaming
  generator, visual/code editor, data designer, integrations, tests, security,
  versions, collaborate, publish, analytics.
- Project detail tabs: Requirements, Blueprint canvas, Code Health, Security,
  Risk & Business, Tests, Reports, Versions, Collaborate, Publish Gate,
  Analytics, Traceability matrix.
- Seat-based billing suite (/app/billing: plans, usage, invoices).
- Workspace Pulse, Activity feed, Notification center, Export center,
  Team space, Integrations hub.
- Admin console (Users, Models, Usage, Audit, Templates, Studio) + 403 guard.

DESIGN SYSTEM & DX
- Inter typography + Lucide/Hugeicons standardized project-wide.
- High-contrast light theme, designed 404, global Cmd+K palette + shortcuts.
- Fixed SSR env var index signatures (src/lib/client.ts, src/lib/server.ts).
- PowerShell bootstrap: bootstrap-brahma.ps1, start-brahma.ps1.
