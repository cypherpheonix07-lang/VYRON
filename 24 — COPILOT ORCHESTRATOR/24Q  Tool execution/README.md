# Copilot Stage 24Q: 24Q  Tool execution

**Pipeline Code:** 24Q  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Safely invokes external tools and APIs within sandboxed environments  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24Q
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24q.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24Q  Tool execution/scratch-test-sql-api.mjs"
```
