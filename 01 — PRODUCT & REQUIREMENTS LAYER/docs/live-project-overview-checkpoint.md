# Live project overview — implementation checkpoint

Baseline: `f0bb237`. Scope: the pictured project Overview, its parent header/access boundary, integration title, and project catalog fallback behavior.

## Confirmed causes

- The overview and project header read `getProject` from `src/lib/mock-data.ts`. Unknown IDs can synthesize plausible scores and deadlines.
- Overview labels hardcode two critical findings and nine extracted sets.
- `useProjects` substituted demo seeds after an empty response or query failure and hid the error. `useProject` could substitute the first unrelated project.
- The project catalog merged sample projects into live results.
- The existing RunService runs timed simulated steps and generates successful artifacts. It is not a verified repository analysis worker.

## Implemented

- Authenticated, RLS-dependent Supabase reads of the exact project, persisted requirement count, and safe repository-binding fields.
- A shared live provider for the header and overview, with per-project subscriptions, 30-second reconciliation, focus refresh, auth-change clearing, and stale-request guards.
- Missing/inaccessible/error states do not substitute demo data. Demo mode remains explicitly separate and labeled.
- The overview shows stored health as an unverified record, not a validated score. Missing metric producers are shown as unavailable/not assessed, rather than invented values.
- Repository query excludes webhook secrets/account credentials. A binding does not claim successful code analysis.
- Live export actually downloads the loaded snapshot as JSON with limitations. It does not claim to produce a PDF.
- Live analysis does not dispatch the existing simulator. A verified worker must be connected before enabling it.
- Repository management opens the existing Integrations route. Its live title uses the same project record.
- Live catalog no longer merges demo projects. Database failures are surfaced. Unauthenticated project creation no longer pretends to persist a local record.

## Verification performed

- `node --test tests/live-overview.test.mjs`: 6/6 pass using a controlled adapter, covering zero values, authentication, missing IDs, errors, partial failures and scoped reads.
- `npm run typecheck`: pass.
- `npm run build`: pass.
- `git diff --check`: pass at validation time.
- `npm ci --ignore-scripts --no-audit --no-fund`: blocked by pre-existing package-lock/package dependency incompatibilities (Babel versions). For local verification, dependencies were installed using `npm install --ignore-scripts --package-lock=false --no-audit --no-fund`. Lockfiles and package versions were not changed. This build therefore does not establish reproducibility from the existing lockfile.

## Live activation prerequisites — not yet verified

No Supabase connection configuration or authenticated database test session was available in this workspace. No cloud credentials, schema, policies, publications, or production records were changed. No live browser/database or Realtime delivery test is claimed.

1. Configure the intended environment with `VITE_SUPABASE_URL` and a public/publishable client key (`VITE_SUPABASE_PUBLISHABLE_KEY` or the existing anon-key setting). Never put a privileged secret/service-role key in a VITE variable or frontend bundle. Configure through environment settings, not a committed file or chat message.
2. Sign in with an authorized test user. Confirm the deployed `projects` schema matches the repository's Supabase schema. This repository also contains a separate TEXT-ID/tenant schema; do not apply either schema blindly to an existing database.
3. Confirm deployed SELECT policies for `projects`, `requirements`, and `project_repos` permit intended users and deny other project owners. Do not disable RLS to make the UI load. Team-sharing rules must be verified independently.
4. Confirm the relevant tables are enabled for Postgres Changes in the intended project's Realtime publication. A subscribed channel alone does not prove table events are published. Polling reconciles every 30 seconds while visible.
5. Create/update an authorized test project and requirement using existing supported write paths. Confirm persistence after refresh and updates from a second session. Verify unauthorized access with a different user.
6. Exercise connection interruption, missing project, logout/account switching, and project switching while a request is pending. Verify no prior project/account content remains.
7. Connect a real repository through the existing integration and verify binding synchronization separately from analysis. The connector itself has not been independently qualified by this change.

## Remaining work

- Connect real analysis workers and persist provenance-backed health/security/risk/impact/clarity metrics; no trustworthy producer for these overview values was established in this scope.
- Add an authoritative membership source before displaying team size and deadline behavior.
- Other workspace tabs still contain mock-data dependencies and require separate migrations; the overview explicitly discloses this boundary.
- The broader project registry, chatbot context, and all creation paths need follow-up reconciliation with authoritative database records. This patch does not migrate the entire application or claim production readiness.
- Qualify runtime behavior against the actual deployed database before release. Existing scores stored with defaults are not automatically valid analysis.
- Resolve the existing lockfile inconsistency in a separately reviewed dependency change.

Next action: configure the target test environment and execute the seven live checks above. Continue implementing verified metric producers after those checks succeed. Do not manufacture passing evidence from stored seeds or simulated runs.
