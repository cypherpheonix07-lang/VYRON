# Copilot Stage 24I: 24I  Permission validation

**Pipeline Code:** 24I  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Verifies authorization and RLS tenant isolation before performing actions  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24I
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24i.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24I  Permission validation/test-rpc-sql.mjs"
```
