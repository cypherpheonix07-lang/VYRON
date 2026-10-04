# Copilot Stage 24Z: 24Z  Memory - update decision

**Pipeline Code:** 24Z  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Decides whether to persist insights, learnings, or state updates to memory  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24Z
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24z.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24Z  Memory - update decision/scratch-test-columns.mjs"
```
