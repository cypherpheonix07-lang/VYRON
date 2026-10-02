# VYRON CONTEXT MESH & CONTEXT PASSPORT SPECIFICATION
## GOD MODE Ω× — INDUSTRIAL AI COPILOT CONTROL PLANE

### 1. Executive Mission & Foundational Laws
The VYRON Context Mesh replaces naive chat history dumping with a governed, multi-plane contextual fabric. Rather than passing an unbounded transcript into model context windows, every piece of contextual state must pass through the **Memory Court**, be classified under one of **16 Context Domains**, and receive an immutable **Context Passport**.

#### Inviolable Context Laws
1. **VALIDATION > GENERATION**: No context item enters model context without explicit provenance.
2. **OBSERVATION > ASSUMPTION**: Runtime telemetry overrides stale historical summaries.
3. **EVIDENCE > ASSERTION**: Factual assertions must map to an empirical Evidence ID (`EVID-xxx`).
4. **AUTHORITY > PLAUSIBILITY**: Authoritative sources supersede plausible inferences.
5. **RELEVANCE > RAW RECENCY**: High-scoring semantic/project affinity supersedes recent off-topic turns.
6. **NEW EVIDENCE > STALE MEMORY**: Contradictory old memory is demoted to historical evidence, never active truth.
7. **USER CONTROL > SILENT ACTION**: Users can override, pin, or ban any context item.

---

### 2. The 16 Canonical Context Domains

| # | Domain | Source | Scope | Default Authority | Description |
|---|--------|--------|-------|-------------------|-------------|
| 1 | `CURRENT_TURN` | User Prompt & Input | TURN | AUTHORITATIVE | Raw prompt, normalized query, goal, and extracted intent capsule. |
| 2 | `SESSION` | CopilotSessionStore | SESSION | AUTHORITATIVE | Mode (NORMAL/DEMO), active specialist, thinking depth (0-5), active skills. |
| 3 | `USER` | Supabase Auth Session | TENANT | AUTHORITATIVE | Operator ID, RBAC roles, security clearances, dual-custody keys. |
| 4 | `TENANT` | Platform Governance | TENANT | AUTHORITATIVE | Tenant isolation boundary, encryption requirements, audit policies. |
| 5 | `PERSONA` | System Config | GLOBAL | AUTHORITATIVE | Tone, non-hallucination laws, safety boundaries, specialist persona. |
| 6 | `PROJECT` | GitHub & AST Catalog | PROJECT | AUTHORITATIVE | Active repo ID, branch, head commit SHA, language distribution, quality score. |
| 7 | `LIFECYCLE_STAGE` | StageGateEngine | PROJECT | AUTHORITATIVE | Active stage in 12-stage pipeline (e.g. Stage 4 Implementation, Stage 6 Security). |
| 8 | `SELECTED_OLD_CHATS`| HistoryRetrievalLayer | PROJECT | DERIVED | Curated prior turns admitted by Memory Court with explicit rationale. |
| 9 | `DURABLE_MEMORY` | InvariantVault / Memory | PROJECT | AUTHORITATIVE | Long-term engineering invariants (e.g. Zero Raw SQL, PKCE auth). |
| 10| `FILES_IMAGES` | Workspace Scanner / OCR | PROJECT | DERIVED | AST call graphs, schema DDLs, screenshot observations with claim links. |
| 11| `NUMERICAL_ARTIFACTS`| Deterministic Metrics | PROJECT | AUTHORITATIVE | Drift %, DORA metrics, p99 latency, cost projections with formulas & units. |
| 12| `EXTERNAL_SOURCES` | Verified Docs & APIs | GLOBAL | AUTHORITATIVE | Official documentation (e.g. OpenAI Agents SDK docs, RFCs) with freshness. |
| 13| `TOOL_RESULTS` | Tool Broker | PROJECT | AUTHORITATIVE | Verified execution output from linters, scanners, test suites, with exit codes. |
| 14| `SYSTEM_TELEMETRY` | SystemFlow Telemetry | TENANT | AUTHORITATIVE | Control plane health, memory usage, WebSocket connection status. |
| 15| `UNCERTAINTY` | Intent Engine | TURN | DERIVED | Identified ambiguities, missing inputs, and alternative interpretations. |
| 16| `CONTRADICTION` | Contradiction Tribunal | PROJECT | DERIVED | Identified conflicts between old claims and active code reality. |

---

### 3. Context Item Data Anatomy
Every context item entering the mesh must satisfy the exact canonical TypeScript contract:

```typescript
export interface ContextMeshItem {
  id: string;
  domain: ContextMeshDomain;
  key: string;
  label: string;
  content: unknown;
  scope: "TURN" | "SESSION" | "PROJECT" | "TENANT" | "GLOBAL";
  source: string;
  freshness: "FRESH" | "RECENT" | "STALE" | "EXPIRED";
  freshnessTimestamp: string;
  authority: "AUTHORITATIVE" | "DERIVED" | "INFERRED" | "UNVERIFIED";
  provenanceUri: string;
  relevanceScore: number; // 0.0 to 1.0
  sensitivity: "PUBLIC" | "INTERNAL" | "RESTRICTED" | "SECRET";
  retrievalReason: string;
  contradictionFlag: boolean;
  admitted: boolean;
  quarantineReason?: string;
}
```

---

### 4. Context Passport Specification
For every conversational turn, the `ContextMeshEngine` seals an immutable **Context Passport**:
- **Passport ID**: Cryptographically unique identifier (`passport_turn_1790494000_abc`).
- **Signature**: SHA-256 hash sealing the exact set of admitted items, preventing prompt tampering.
- **Replayability**: Passports are archived in `contextMesh.passportArchive` and can be reloaded in the **Conversation Time Machine** to analyze how the copilot made decisions at any historical timestamp.
- **Quarantine Zone**: Items with `freshness === "EXPIRED"` or `relevanceScore < 0.40` are quarantined and excluded from model context, accompanied by a structured `quarantineReason`.

---

### 5. Context Debt Monitor
Unresolved ambiguity, contradictory history, or stale assumptions accumulate as **Context Debt**:

| Debt Category | Trigger Condition | Severity | Blocking Action | Remediation Protocol |
|---------------|-------------------|----------|-----------------|----------------------|
| `AMBIGUITY` | Ambiguity score > 0.50 on consequential action | BLOCKING | Halt Tool Execution | Present Intent Clarification Card |
| `STALE_ASSUMPTION` | Context item age > 24 hours without recomputation | MEDIUM | Non-blocking | Trigger background scanner revalidation |
| `CONFLICTING_HISTORY` | Prior chat claim contradicts active AST scan | HIGH | Halt Stage Gate | Convene Contradiction Tribunal |
| `MISSING_EVIDENCE` | Factual assertion lacks an Evidence ID | HIGH | Block Certification | Downgrade claim to INFERRED status |
| `UNAVAILABLE_SOURCE` | External documentation link returns 404/500 | LOW | Non-blocking | Mark source UNVERIFIED; fallback to local cache |
| `ABANDONED_TASK` | Execution plan paused > 72 hours | MEDIUM | Non-blocking | Surface Mission Resume banner |

---

### 6. Verification & Governance
- Zero Raw SQL: All database lookups are mediated through Supabase client libraries and typed RPCs.
- Zero Token Waste: The Context Mesh admits only relevant items, achieving a 75% token reduction compared to full transcript replay while guaranteeing 100% provenance.
