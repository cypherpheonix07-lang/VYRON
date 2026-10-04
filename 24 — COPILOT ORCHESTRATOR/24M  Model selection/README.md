# Copilot Stage 24M: 24M  Model selection

**Pipeline Code:** 24M  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Selects the optimal LLM (Gemini Flash vs Pro vs OpenAI) based on task complexity  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24M
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24m.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24M  Model selection/test-macro-batch-4.mjs"
```
