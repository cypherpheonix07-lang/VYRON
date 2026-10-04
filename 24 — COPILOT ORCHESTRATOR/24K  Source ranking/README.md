# Copilot Stage 24K: 24K  Source ranking

**Pipeline Code:** 24K  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Ranks retrieved documents and context snippets using reciprocal rank fusion  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24K
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24k.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24K  Source ranking/scratch-find-tables.mjs"
```
