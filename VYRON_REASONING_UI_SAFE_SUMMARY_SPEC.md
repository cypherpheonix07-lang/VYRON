# VYRON SAFE REASONING UI & PROOF CARD SPECIFICATION
## GOD MODE Ω× — INDUSTRIAL AI COPILOT CONTROL PLANE

### 1. Zero Private Scratchpad Doctrine
> **"Never reveal hidden chain-of-thought; expose safe reasoning summaries, tool activity, sources, uncertainty, decisions and verification."**

Raw model completions containing `<think>...</think>`, `[scratchpad]...[/scratchpad]`, or internal prompt deliberations are **strictly purged** at the dispatcher layer before reaching the UI or persistent history store. Instead, the copilot exposes structured, audited **Safe Reasoning Transparency**.

---

### 2. The 8 Canonical Safe Reasoning UI Blocks
Every assistant answer is structured with the following eight transparency blocks:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. UNDERSTOOD: Plain language recap of user goal, entities, constraints│
│ 2. CONTEXT USED: Admitted domains (Turn, Project, AST, Old Chats, etc.)│
│ 3. SOURCES: Authoritative citations with URL/Path & freshness badge    │
│ 4. ACTIONS / TOOLS: Governed tool execution cards (target, status, ms) │
│ 5. DECISIONS: Routing, specialist handoff, and policy choices made     │
│ 6. UNCERTAINTY: Identified unknowns, missing inputs, risk assumptions  │
│ 7. VERIFICATION: SHA-256 evidence hash and postcondition assertion     │
│ 8. NEXT STEP: Recommended concrete engineering action                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Governed Tool Card Specification
When a specialist invokes a tool or connector, the UI renders an audited **Tool Card**:

| Field | Description | Security Rule |
|-------|-------------|---------------|
| `toolName` | Name of tool (e.g. `ast_drift_scanner`, `test_connector`) | Normalized identifier |
| `targetService` | Target module, repository file, or database RPC | Scoped to project perimeter |
| `purpose` | Human-readable explanation of why tool was called | Free of internal prompt instructions |
| `status` | `SUCCESS` \| `RUNNING` \| `FAILED` \| `BLOCKED` | Realtime state updates |
| `durationMs` | Execution latency in milliseconds | Accurate performance telemetry |
| `resultSummary` | Summary of tool outcome (e.g. "0 CVEs, 4.2% drift") | Zero raw token dump |
| `hasRedactedSecrets` | Boolean flag indicating whether credentials were sanitized | **MANDATORY TRUE** if tokens/keys involved |

---

### 4. Dynamic Answer Engine: First Block Contract
The system dynamically selects the presentation format based on the classified question type. In all cases, **the first block must answer the user's actual question directly** before presenting background context or proofs:

1. **FACT**: Direct factual statement with source citation badge.
2. **EXPLANATION**: Architectural overview and conceptual mechanics.
3. **DEBUG**: Root cause assessment and immediate reproduction/fix advice.
4. **DESIGN**: Architecture pattern evaluation with trade-off analysis.
5. **IMPLEMENT**: Typesafe code change with file target and line boundaries.
6. **TRANSFORM**: Before/after migration diff with validation proof.
7. **ANALYSIS**: Metric scorecard, AST drift analysis, or graph findings.
8. **COMPARE**: Multi-column trade-off comparison matrix.
9. **PLAN**: Sequenced milestone roadmap with gating preconditions.
10. **CALCULATE**: Deterministic formula, input variables, result value, and unit dimensions.
11. **VISUAL**: Asset observations, OCR annotations, and component links.
12. **RESEARCH**: Curated documentation digest with freshness timestamps.
13. **ACTION**: Precondition verification, tool execution status, postcondition proof.
14. **REVIEW**: Code review comments, test coverage analysis, security check.
15. **CONTINUE / STAGE**: Stage readiness assessment and stage transition gate.

---

### 5. End-of-Chat Proof Card & Response Closure
Every meaningful conversational turn concludes with the **Proof Card**:
- **SUMMARY**: Concise conclusion of the turn.
- **KEY POINTS**: 3-4 bulleted empirical findings.
- **DECISIONS**: Recorded architectural decisions.
- **CHANGES**: State mutations or cache updates performed.
- **SOURCES**: Interactive links with authority tiers (Tier 1 to Tier 4).
- **WHAT WAS USED**: Exact context items that influenced the outcome.
- **WHAT CHANGED**: Repository or state changes produced.
- **UNCERTAINTY**: Residual unknowns.
- **OPEN QUESTIONS**: Questions requiring human input.
- **REMAINING RISK**: Residual risk profile.
- **NEXT STAGE GATE**: Current stage, readiness score (0-100), and action buttons:
  `[▶ PROCEED]` `[⏸ PAUSE]` `[↺ REVISE]` `[⑂ BRANCH]`
