# Copilot Stage 24D: 24D  Intent classification

**Pipeline Code:** 24D  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Categorizes user intention into domain actions, queries, or code generation tasks  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24D
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24d.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24D  Intent classification/test-copilot-godmode-omega.mjs"
```
