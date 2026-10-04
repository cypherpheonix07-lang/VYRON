# Copilot Stage 24G: 24G  Context discovery

**Pipeline Code:** 24G  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Scans workspace for relevant file ASTs, schema definitions, and project state  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24G
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24g.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24G  Context discovery/scratch-check-active-tables.mjs"
```
