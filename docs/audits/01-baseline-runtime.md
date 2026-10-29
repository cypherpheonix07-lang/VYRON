# 01 — Baseline Runtime & Observability Baseline

## 1. Runtime Process Configuration
- **Vite Development Server**:
  - Bound URL: `http://localhost:8080/`
  - Host Interface: `127.0.0.1` / `localhost`
  - Startup Command: `npm run dev`
  - Tooling: Vite `v8.3.5` + TanStack Start SSR + Nitro worker
- **Python FastAPI Service Mesh**:
  - Bound URL: `http://127.0.0.1:8000/`
  - Host Interface: `127.0.0.1`
  - Startup Command: `.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000`
  - Tooling: Uvicorn `0.34.0`, FastAPI `0.115.0`, Python `3.14.6`

---

## 2. Server Startup & Health Telemetry

### Vite Frontend Startup Log
```text
  VITE v8.3.5  ready in 13800 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
(ssr) connected
(client) [optimizer] bundling dependencies...
(client) [optimizer] completed in 1420ms
```

### Python FastAPI Engine Health Response
```json
{
  "status": "healthy",
  "engine": "PROJECT BRAHMA – LEVIATHAN HARDENED",
  "version": "2.0.0",
  "compute_layer": "Decoupled Celery + Isolated Worker Queues",
  "queues": [
    "scans_queue",
    "pdf_queue (concurrency=1)",
    "webhooks_queue"
  ],
  "database_pooler": {
    "target": "Supavisor Transaction Pooler",
    "enforced_port": 6543,
    "min_size": 5,
    "max_size": 20,
    "pool_active": false
  },
  "system_metrics": {
    "rss_memory_mb": 102.55,
    "cpu_bound_in_web_loop": false,
    "optimistic_locking_enabled": true,
    "worm_audit_immutable": true
  }
}
```

---

## 3. High-Fidelity Live Route Probing Results
Executed via `node scripts/test-live-routes.mjs` probing parallel SSR and API endpoints:

| Endpoint Tested | Method | Status | Latency | Payload Size | Verified Document Title / State |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `http://localhost:8080/` | GET | **200 OK** | 1279ms | 66,160 bytes | "VYRON - From raw idea to validated software blueprint" |
| `http://localhost:8080/dashboard/student` | GET | **200 OK** | 1270ms | 28,042 bytes | "Student Academic Workspace — VYRON" |
| `http://localhost:8080/dashboard/faculty` | GET | **200 OK** | 230ms | 28,072 bytes | "Faculty Command Workspace — VYRON" |
| `http://localhost:8080/dashboard/professional` | GET | **200 OK** | 224ms | 28,514 bytes | "Working Professional Workspace — VYRON" |
| `http://localhost:8080/admin/command-centre` | GET | **200 OK** | 97ms | 4,715 bytes | "Admin Command Centre — Control Plane \| VYRON" |
| `http://localhost:8080/app` | GET | **200 OK** | 892ms | 5,476 bytes | "Dashboard — VYRON" |
| `http://127.0.0.1:8000/health` | GET | **200 OK** | 17ms | 477 bytes | "healthy" (Python Leviathan Hardened) |
| `http://127.0.0.1:8000/api/v1/tools/health/summary` | GET | **200 OK** | 15ms | 288 bytes | "SUCCESS" (SSRF Protected Tool Catalog) |

---

## 4. Observed Baseline Anomalies & Defects Prior to Repair

1. **PostgREST UUID Syntax Error (22P02)**:
   - When loading student, faculty, and professional dashboards with non-UUID demo session IDs (`demo-student-01`), Supabase PostgREST returned 400 Bad Request with `invalid input syntax for type uuid: "demo-student-01"`.
2. **Python Backend Unittest Incompatibility**:
   - `python -m unittest discover -s tests -v` returned exit code 1 with `Ran 0 tests in 0.000s, NO TESTS RAN` because tests were written as standalone functions without `unittest.TestCase`.
3. **Acceptance Gates Script Failure on Missing `.env`**:
   - `npm run verify:gates` crashed with `ENOENT: no such file or directory, open '.env'` when executed in clean staging clones.
4. **Master SDLC 520 Script Recursive Import**:
   - `npm run audit:520` crashed with `ERR_MODULE_NOT_FOUND` due to nested directory self-referential import.
5. **Zod v4 Schema Signature Drift**:
   - Compilation failed on `errorMap` and single-argument `z.record(z.boolean())` in `src/lib/wizardSchemas.ts`.
