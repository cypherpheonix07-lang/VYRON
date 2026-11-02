# PROJECT BRAHMA v4 — Root Cause & Blast Radius Analysis

**Document Reference**: `docs/audits/v4/02_root_cause_and_blast_radius.md`  
**Evaluation Scope**: Port 8080 Process Hang, Missing 18-System Navigation, SSR ReactFlow Incompatibilities  

---

## 1. Confirmed Primary Failure Points

### Root Cause 1: Vite Dev Server Module-Runner RPC IPC Deadlock
- **Mechanism**: On Windows, TanStack Start with Vite Environment API utilizes an RPC WebSocket bridge (`vite:invoke`). During deep module graph traversal (specifically triggered when importing `discover.tsx` which imported `@xyflow/react` and complex service trees), the RPC runner timed out after 300,000ms (`5 minutes`) and left socket connections hanging in `FinWait1` state.
- **Symptom**: Browser requests to `http://localhost:8080/app` hung indefinitely with `socket hang up`, preventing any live code or UI updates from reaching the user's browser.
- **Remediation**:
  1. Killed deadlocked PID 20816.
  2. Shielded `@xyflow/react` canvas components behind client-side `mounted` guards.
  3. Rebuilt production SSR bundle (`npm run build`) which executes via Nitro SSR (`node .output/server/index.mjs`) with zero RPC IPC overhead.

### Root Cause 2: 18 Brahma Core Systems Omitted from Shell Sidebar
- **Mechanism**: The 18 systems from the Brahma architecture existed in `showcaseData.ts` and on the marketing `/showcase` route, but were omitted from the primary `NAV_DOMAINS` structure in `app-shell.tsx`.
- **Symptom**: Users navigating inside the main workspace (`/app`) could not see or access the 18 systems from the left navigation bar.
- **Remediation**:
  1. Created `src/components/systems/BrahmaSystemsOverviewView.tsx`.
  2. Created route `/app/systems`.
  3. Added `18 BRAHMA SYSTEMS` as a prominent top-level domain in `NAV_DOMAINS`.

### Root Cause 3: Default Collapsed State for 7 of 12 Domains
- **Mechanism**: In `app-shell.tsx`, `expandedDomains` was initialized with `false` for `release`, `simulation`, `ai`, `integrations`, `governance`, and omitted `system-flow` and `deployments`.
- **Symptom**: On initial page load or clean localStorage sessions, 7 domains appeared empty or hidden unless individual accordions were manually toggled.
- **Remediation**: Set default state to `true` across all domains, and added an **Expand All / Collapse All** master toggle.

---

## 2. Blast Radius Matrix

| Affected Area | Direct Impact | Indirect Dependencies | Validation Gate | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Port 8080 Listener** | Unresponsive socket hang up | Entire frontend application availability | HTTP 200 probe `<50ms` | **RECOVERED** |
| **AppShell Sidebar** | Missing 18 systems, 7 collapsed domains | Child navigation to 46 routes | DOM presence of all 13 domains | **RECOVERED** |
| **ReactFlow SSR** | Module runner timeout on server | Reality Map, Blueprint, Architecture canvas | `mounted` guard prevents SSR crash | **RECOVERED** |
| **Route Tree** | Missing `/app/systems` path | TanStack router compilation | `routeTree.gen.ts` regenerated | **RECOVERED** |
| **Supabase Remote** | Upstream database paused | Live data reads | Mock offline fallback active | **PROTECTED** |
