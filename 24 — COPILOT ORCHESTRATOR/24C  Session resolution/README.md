# Copilot Stage 24C: 24C  Session resolution

**Pipeline Code:** 24C  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Hydrates conversational context, thread history, and active session boundaries  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24C
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24c.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24C  Session resolution/test-copilot-godmode.mjs"
```
