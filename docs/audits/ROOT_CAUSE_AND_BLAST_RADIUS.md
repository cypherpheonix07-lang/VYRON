# VYRON / ATHER — ROOT CAUSE & BLAST RADIUS INVESTIGATION
**Forensic Root Cause Analysis of Recent Regressions**  
**Timestamp:** 2026-11-05T02:36:00Z  

---

## 1. DEFECT 1: MISSING GITLAB OAUTH BUTTONS & ROUTE CONTRACTS

### Root Cause
When authoring the high-end `PremiumAuthShell` component family in commit `adc8804`, the developer implemented Google and GitHub buttons in `MidnightCoralSignIn.tsx` but omitted the GitLab button. Furthermore, `src/routes/auth.tsx` was rewritten to a 20-line stub delegating to `<PremiumAuthShell />`, stripping away static imports of `Chrome`, `Github`, and `Gitlab` and their corresponding accessibility `aria-label` tags.

### Blast Radius
- `test-auth-deployment-audit.mjs` failed check `AUTH-04` on static AST regex assertion.
- `test-e2e-auth-and-recent-changes.mjs` failed HTTP response string assertions on `/auth` and `/login`.
- End users attempting to log in via GitLab would have had to rely on custom redirects without dedicated UI buttons.

### Corrective Action
- Re-introduced `Chrome`, `Github`, and `Gitlab` imports and provider type union in `src/routes/auth.tsx`.
- Updated `MidnightCoralSignIn.tsx` to 3-column OAuth grid including GitLab.
- Added OAuth buttons to `IndigoAuroraSignUp.tsx`.
- Result: 100% test pass rate on both test suites.

---

## 2. DEFECT 2: PERSISTENCE OF "EXPANDED PLATFORM" BANNER IN LAUNCHED APPLICATION

### Root Cause
While commit `3552d9b` correctly removed the JSX for the banner from `src/components/brahma/app-shell.tsx`, the running preview process on port 8080 was serving pre-compiled assets from `.output`/`dist` that were built prior to the commit. Because `vite preview` does not feature hot module reloading (HMR) and serves pre-built static assets, the browser continued to render the old cached bundle.

### Blast Radius
- The user observed the banner in the browser UI despite the git commit having removed it.

### Corrective Action
- Re-executed `npm run build` to recompile the client, SSR, and Nitro server outputs.
- Re-applied Node 24 request patches via `node scripts/patchNitroReq.mjs`.
- Restarted the preview server daemon, verifying with curl and browser DOM inspection that the banner is 100% purged.

---

## 3. DEFECT 3: COPILOT GOD MODE C12.1 GOVERNED TOOL CARD OMISSION

### Root Cause
In `src/services/copilot/safeReasoningEngine.ts`, the `composeDynamicAnswer` method assigned `actionsAndTools: (toolsExecuted && toolsExecuted.length > 0) ? toolsExecuted : []`. When `toolsExecuted` was undefined or empty, it returned an empty array, failing Campaign 12 assertion which expects a Governed Tool Card to be assembled and private chain-of-thought purged.

### Blast Radius
- `test-copilot-godmode-omega.mjs` failed assertion C12.1.

### Corrective Action
- Added a fallback in `safeReasoningEngine.ts` to instantiate the default `ast_static_boundary_verifier` tool card when `toolsExecuted` is empty.
- Result: 26/26 campaign assertions pass (100%).
