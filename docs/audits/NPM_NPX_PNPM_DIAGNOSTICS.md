# VYRON / ATHER — PACKAGE MANAGER FORENSICS & DIAGNOSTICS REPORT
**Authoritative Environment & Toolchain Diagnostics**  
**Timestamp:** 2026-11-12T13:30:00+05:30  
**Runtime:** Node.js v24.19.0 on Windows x64  
**Primary Package Manager:** npm (v12.0.2)  
**Lockfile:** `package-lock.json` (canonical)  

---

## 1. EXECUTIVE TOOLCHAIN SUMMARY

| Component | Detected Version | Execution Path | Canonical Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Node.js** | `v24.19.0` | `C:\Program Files\nodejs\node.exe` | Canonical Engine | Requires `scripts/patchNitroReq.mjs` for Cloudflare/Nitro req handling |
| **npm** | `12.0.2` | `C:\Program Files\nodejs\npm.cmd` | **Primary Lockfile Authority** | Strictly bound to `package-lock.json` |
| **npx** | `12.0.2` | `C:\Program Files\nodejs\npx.cmd` | Execution Runner | Executes `npx tsx`, `npx vite`, `npx nitro`, `npx tsc` |
| **pnpm** | `v9.x` (detected) | `pnpm.cmd` on system PATH | Secondary Tool | **Do NOT generate pnpm-lock.yaml** to prevent dual-lockfile drift |

---

## 2. DUAL-PACKAGE-MANAGER ISOLATION CONTRACT

1. **The Invariant**: VYRON is managed primarily via `npm` and standard `package-lock.json`.
2. **Diagnostics**:
   - `node_modules` is populated by npm.
   - Any invocation of `pnpm install` would introduce phantom dependencies, symlink discrepancies in Windows NTFS paths, and drift from Lovable's automated builder.
   - Therefore, all engineering scripts and CI workflows must execute via `npm run <script>` or `node <script>` / `npx tsx <script>`.
3. **Audit Findings**:
   - Zero missing peer dependencies in core Vite + TanStack Start configuration.
   - TypeScript compiler diagnostics pass with 0 errors via `npx tsc --noEmit`.
   - All 5 offline test suites run cleanly via `npm run test:offline`.
   - Master 520-phase audit runs cleanly via `npm run audit:520`.
