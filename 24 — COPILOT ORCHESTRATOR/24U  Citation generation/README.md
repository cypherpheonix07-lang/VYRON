# Copilot Stage 24U: 24U  Citation generation

**Pipeline Code:** 24U  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Attaches precise file, line, and timestamp citations to every claim in response  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24U
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24u.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24U  Citation generation/inspect-columns.mjs"
```
