# Copilot Stage 24H: 24H  Memory retrieval

**Pipeline Code:** 24H  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Fetches relevant semantic memories, user preferences, and historical decisions  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24H
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24h.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24H  Memory retrieval/update-dossier-script.mjs"
```
