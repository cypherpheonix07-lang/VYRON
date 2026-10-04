# Copilot Stage 24B: 24B  Identity resolution

**Pipeline Code:** 24B  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Resolves caller identity, tenant association, and role credentials  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24B
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24b.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24B  Identity resolution/verify-nextgen-copilot.mjs"
```
