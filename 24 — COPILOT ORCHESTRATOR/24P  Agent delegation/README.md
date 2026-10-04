# Copilot Stage 24P: 24P  Agent delegation

**Pipeline Code:** 24P  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Delegates specialized tasks to domain agents with isolated sandboxes  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24P
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24p.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24P  Agent delegation/test-macro-batch-5.mjs"
```
