# VYRON COPILOT ROOT CAUSE & RECOVERY PROTOCOL MAP
## GOD MODE Ω× — DEFECT MAPPING, INVALIDATION CASCADES & INCIDENT PLAYBOOKS

---

### 1. Invalidation Cascades & System Blast Radius
In an engineering control plane, a single corrupted context item or stale assumption must not silently propagate through downstream decisions or tool executions. VYRON implements deterministic **Invalidation Cascades**:

```
+----------------------------------------------------------------------------------------------------+
|                                    INVALIDATION CASCADE DYNAMICS                                   |
|                                                                                                    |
|    [ Schema / AST Change ]                                                                         |
|               |                                                                                    |
|               v                                                                                    |
|    [ Freshness Clock: STALE (>24h) ]                                                               |
|               |                                                                                    |
|               v                                                                                    |
|    [ Memory Court: QUARANTINE ]                                                                    |
|               |                                                                                    |
|               v                                                                                    |
|    [ Contradiction Tribunal: DOWNGRADE TO HISTORICAL EVIDENCE ONLY ]                               |
|               |                                                                                    |
|               v                                                                                    |
|    [ Context Debt Monitor: EMIT BLOCKING_DEBT ]                                                    |
|               |                                                                                    |
|               v                                                                                    |
|    [ Stage Gate Engine: ENGAGE PAUSE / PREVENT MUTATION ]                                          |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Root Cause Diagnostic Matrix

#### Category A: Cross-Project or Multi-Tenant Boundary Failure
- **Symptom**: User in Project Alpha sees historical turns or snippets from Project Beta.
- **Root Cause**: Unqualified vector search or missing tenant/project filter in retrieval query predicate.
- **Remediation & Hard Invariant**:
  - Memory Court enforces a zero-tolerance hard veto:
    ```ts
    if (candidate.projectId !== queryEnvelope.projectId) {
      return { score: 0, admitted: false, rejectionReason: "Cross-project historical disclosure strictly prohibited" };
    }
    ```
  - Stop-the-line protocol immediately disengages candidate admission.

#### Category B: Stale Evidence Superposition (Assumption vs Observation)
- **Symptom**: Model claims an architecture boundary violation exists based on an old PR description, even though active code in main has resolved it.
- **Root Cause**: Relying on transcript recency without refreshing AST graph state.
- **Remediation & Hard Invariant**:
  - `OBSERVATION > ASSUMPTION` law enforced by the `ContradictionTribunal`.
  - Live AST telemetry (confidence 0.98, Tier 1) unconditionally overrides textual documentation (Tier 3) or historical transcript (Tier 4).

#### Category C: Private Scratchpad & Chain-of-Thought Leakage
- **Symptom**: Raw model scratchpad (`<think>...</think>`) leaks into user-facing chat bubble.
- **Root Cause**: Direct unparsed streaming of raw model completion into markdown renderer.
- **Remediation & Hard Invariant**:
  - All model responses pass through `SafeReasoningEngine.sanitizeAndDecomposeResponse()`.
  - Raw thinking tokens are stripped via regex, and only structured `SafeReasoningTransparency` cards are displayed to the user.

#### Category D: Destructive Action Execution without Approval
- **Symptom**: Tool executes a schema drop, table deletion, or git force-push silently.
- **Root Cause**: Unclassified intent and bypassing of the Stage Gate Protocol.
- **Remediation & Hard Invariant**:
  - `USER CONTROL > SILENT ACTION` law enforced.
  - Consequential flag is raised for destructive commands (`drop`, `truncate`, `delete`, `force`).
  - Stage Gate halts execution in `BLOCKED` state until interactive user authorization is received.

#### Category E: Underspecified Deictic References ("Fix this", "Run it")
- **Symptom**: Model guesses file target or executes random commands on unspecified entities.
- **Root Cause**: Naive generation without entity resolution.
- **Remediation & Hard Invariant**:
  - Question Understanding Engine computes `ambiguityScore`.
  - If `ambiguityScore > 0.6` and action is consequential, triggers `clarificationNeed: true`.
  - Copilot responds with explicit clarification options before acting.

---

### 3. Incident Response & Recovery Playbooks

| Incident ID | Incident Name | Trigger Event | Automated Playbook | Post-Incident Audit |
|---|---|---|---|---|
| **PB-001** | Cross-Project Breach Attempt | Retrieval attempts candidate with foreign `projectId` | Hard veto triggered; score zeroed; audit alert logged to telemetry. | Inspect vector index partition metadata and tenant isolation policies. |
| **PB-002** | Stale Cache Corruption | Cached AST analysis is older than file modification timestamp | Invalidate cache entry; trigger live re-scan; emit `STALE_ASSUMPTION` debt. | Recompute cache key with content SHA-256 hash. |
| **PB-003** | Tool Timeout / Outage | External connector or AST scanner exceeds timeout (5000ms) | Circuit breaker opens; state set to `BLOCKED`; fallback to read-only summary. | Log latency metric; verify external service health before retry. |
| **PB-004** | Prompt Injection Intercept | User prompt contains instruction bypass keywords | Flag query as `SEVERE` risk; suppress tool dispatch; require verification. | Log prompt lineage to security audit ledger. |
| **PB-005** | Stage Desynchronization | User closes browser tab during multi-stage migration | Checkpoint saved to `ResumableMissionCheckpoint`; restored on session resume. | Verify state hash matches upon resumption. |
