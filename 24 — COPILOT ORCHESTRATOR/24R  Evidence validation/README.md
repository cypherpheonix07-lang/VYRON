# Copilot Stage 24R: 24R  Evidence validation

**Pipeline Code:** 24R  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Validates raw execution output against physical schemas and invariants  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24R
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24r.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24R  Evidence validation/verify-platform-mastery.mjs"
```
