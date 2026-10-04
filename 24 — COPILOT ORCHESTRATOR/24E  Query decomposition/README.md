# Copilot Stage 24E: 24E  Query decomposition

**Pipeline Code:** 24E  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Breaks complex multi-part user goals into discrete atomic sub-tasks  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24E
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24e.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24E  Query decomposition/verify-copilot-intelligence-fabric.mjs"
```
