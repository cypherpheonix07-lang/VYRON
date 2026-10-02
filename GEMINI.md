# Project: VYRON
Stack: React, TypeScript, Vite, Supabase, TailwindCSS
Default Model: gemini-3.5-flash / gemini-2.5-pro

## Core Operational Invariants
- **Always**:
  - Run verification tests and production builds (`npm run build`) after code edits.
  - Use atomic, forward git commits (`git commit` and `git push origin main`); never force-push, rebase, squash, or amend commits, preserving Lovable synchronization.
  - Output explicit structural diffs and architectural proofs before applying destructive mutations.
  - Strictly enforce the **Zero-Fiction Architecture Law** (zero fabricated API endpoints, zero synthetic test passes, zero ungrounded telemetry claims).
  - Strictly enforce the **Zero Raw SQL Mandate** (all queries must utilize Supabase client SDK query builders or parameterized ORM calls; zero raw string SQL interpolation).
  - Ensure all new database migrations and RLS policies follow `@supabase/supabase-postgres-best-practices`.

- **Never**:
  - Alter authentication, session, or RLS security policies without explicit confirmation.
  - Rewrite published git history or break Lovable sync.
  - Hardcode raw API keys, bearer tokens, or database passwords in source code, logs, or exports.
  - Silently swallow pipeline errors or display fabricated aggregate green badges when underlying assertions fail.
