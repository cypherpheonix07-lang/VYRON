# Copilot Stage 24L: 24L  Tool selection

**Pipeline Code:** 24L  
**Parent Layer:** 24 — COPILOT ORCHESTRATOR  
**Role:** Matches decomposed requirements to appropriate tool definitions and capabilities  

---

## 1. Stage Contract & Mechanism
This stage forms an autonomous step in the 26-phase Copilot Cognitive Orchestrator.
- **Input:** Upstream pipeline context from stages preceding 24L
- **Output:** Validated payload passed to subsequent stages
- **Telemetry Event:** `copilot.stage.24l.completed`

## 2. Invariants
- Zero-Fiction Architecture Law: No fabricated outputs or synthetic test passes.
- Grounded citations and verification hashes.
- Latency target: `< 100ms`.

## 3. Verification Runner
Execute verification test:
```bash
node "24 — COPILOT ORCHESTRATOR/24L  Tool selection/verify-ai-project-control-plane.mjs"
```
