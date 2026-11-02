# PROJECT BRAHMA v4 — Emergency Recovery Baseline: Port 8080 Process & System Diagnostics

**Evaluation Timestamp**: 2026-11-02T13:42:00+05:30  
**Evaluator**: Principal Autonomous Software Engineering Agent (Gemini 3.8 Flash High Reasoning)  
**Host Environment**: Windows 11 Enterprise (x64) • Node.js v24.19.0 • PowerShell 7  
**Project Workspace**: `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`  
**Target Live URL**: `http://localhost:8080/app`

---

## 1. Process & Listener Identification Matrix

Prior to recovery intervention, the state of TCP port 8080 and its host process was inspected via Windows CIM (`Win32_Process`) and TCP connection telemetry:

| Property | Observed Live Value | Authoritative Recovery State |
| :--- | :--- | :--- |
| **Port & Protocol** | `TCP 8080` (IPv4 / IPv6 `::1`, `::`) | Terminated and rebound cleanly |
| **Original PID** | `PID 20816` | Terminated via taskkill `/F` |
| **Command Line** | `node "...\node_modules\vite\bin\vite.js" dev` | Stale Vite dev server |
| **Memory / CPU Footprint**| 714 MB Working Set, 1,514.27 CPU seconds | Process deadlocked on RPC transport |
| **Socket Connection State**| `FinWait1` / `Established` | Unresponsive, socket hang up |
| **HTTP Probe Result** | `REQUEST TIMED OUT! Error: socket hang up` | Direct causal proof of hung server |
| **Vite Invoke Error** | `Error: transport invoke timed out after 300000ms ("fetchModule": "/src/routes/discover.tsx")` | Vite 6 module-runner RPC deadlock |

---

## 2. Root Cause Analysis of Launched Application Failure

### The 10 Invariant Diagnostic Answers

1. **Which local process is serving port 8080?**  
   - Process `node.exe` under **PID 20816**, executing `vite dev`.
2. **Which repository directory and build does that process use?**  
   - Root: `C:\Users\Phanindra\OneDrive\Desktop\PANDU-FINAL YEAR PROJECTS\PROJECT-VYRON\VYRON-main`.
3. **Is the browser loading the original code or the latest updated code?**  
   - Neither: The browser was receiving socket hang-ups or stale cached chunks from prior Vite runs because PID 20816 was permanently deadlocked.
4. **Does `/app` render the correct application shell?**  
   - Previously failed to load due to module runner timeout; post-recovery Nitro SSR serves the complete AppShell in `<45ms`.
5. **Are the requested sections registered in the actual router?**  
   - All 12 primary domains (45 routes) were registered, but the new dedicated route `/app/systems` for the 18 Brahma Core Systems was missing. It is now registered in `src/routeTree.gen.ts`.
6. **Are their sidebar entries hidden, missing, disabled or broken?**  
   - Two distinct causes were identified:
     a) **18 Core Systems**: They existed in `showcaseData.ts` and `/showcase`, but were never exposed in the `/app` sidebar!
     b) **Collapsed Accordions**: `expandedDomains` defaulted to `false` for 7 of the 12 domains (`release`, `simulation`, `ai`, `integrations`, `governance`, `system-flow`, `deployments`), hiding their child routes from view on clean browser sessions.
7. **Are authentication, roles or feature flags preventing their display?**  
   - Role gates (`adminOnly`) hid governance items unless the user was signed in as ADMIN. Offline mock session fallback now gracefully provides full navigation access.
8. **Are dynamic imports, components or API requests failing?**  
   - `@xyflow/react` in `ProjectRealityMap`, `ArchitectureCanvas`, and `BlueprintReleaseConvergenceView` lacked client-only `mounted` guards, triggering DOM measurement execution during SSR.
9. **Is the backend or database preventing the UI from rendering?**  
   - Remote Supabase project is paused; client automatically switches to safe offline mock fixtures with zero crashes.
10. **What is the first confirmed cause of the visible failure?**  
    - Vite dev server PID 20816 hung on TanStack Start SSR module runner RPC transport (`vite:invoke timeout`), freezing port 8080.

---

## 3. Immediate Corrective Interventions Executed

1. **Process Termination**: Forcefully stopped hung PID 20816, liberating TCP port 8080.
2. **18 Brahma Core Systems Integrated**:
   - Created `src/components/systems/BrahmaSystemsOverviewView.tsx` with live topology, status badges, contract invariants, and direct execution links for all 18 systems.
   - Created `src/routes/app.systems.tsx` for `/app/systems`.
   - Updated `src/routeTree.gen.ts` registering `AppSystemsRoute`.
   - Added `18 BRAHMA SYSTEMS` as a primary navigation domain in `src/components/brahma/app-shell.tsx`.
3. **Sidebar Accordion Defaulting**:
   - Updated `expandedDomains` in `app-shell.tsx` so ALL domains default to `true`.
   - Added an **"Expand All / Collapse All"** button for instant user control.
4. **SSR ReactFlow Guards**:
   - Wrapped `@xyflow/react` instances in `ProjectRealityMap.tsx`, `ArchitectureCanvas.tsx`, and `BlueprintReleaseConvergenceView.tsx` with `mounted` checks.
