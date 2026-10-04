# VYRON CONVERSATION HISTORY TIMELINE & TIME MACHINE SCHEMA
## GOD MODE Ω× — INDUSTRIAL AI COPILOT CONTROL PLANE

### 1. Architectural Philosophy
> **"Persist immutable turn records plus derived summaries, entities, project links, lifecycle tags, tool traces, citations, image/file metadata, numerical artifacts, prompt lineage and verification status."**

The VYRON Conversation History Engine is not a simple chat log. It is a forensic, multi-dimensional time machine that captures the full cognitive envelope of every interaction and allows operators to step back in time, inspect historical context passports, and replay past turns against current code.

---

### 2. Immutable Turn Record Schema
Every turn record persisted to the history store adheres to the canonical TypeScript schema:

```typescript
export interface ImmutableTurnRecord {
  turnId: string;
  sessionId: string;
  timestamp: string;
  projectId: string;
  userQuery: string;
  assistantAnswer: string;
  intentCapsule: IntentCapsule;
  contextPassport: ContextPassport;
  resourceTrail: ResourceTrailItem[];
  toolsExecuted: GovernedToolCard[];
  pictures: PictureContextArtifact[];
  numericalArtifacts: NumericalCalculationArtifact[];
  lifecycleStage: EngineeringLifecycleStage;
  decisions: string[];
  changes: string[];
  proofCard: EndOfChatProofCard;
  verificationHash: string;
}
```

---

### 3. The 9 Specialized Timeline Views

| # | Lens Name | Primary Focus | Output Content |
|---|-----------|---------------|----------------|
| 1 | `CHRONOLOGICAL` | Full linear timeline | Turns in descending timestamp order with excerpts and stage badges. |
| 2 | `PROMPT_BASED` | Prompt lineage & intent | Normalized query, 16-class question type, goal, extracted entities, and urgency. |
| 3 | `PICTURE_BASED` | Visual & diagram intelligence | Image asset IDs, OCR extractions, bounding box observations, and linked claims. |
| 4 | `NUMERICAL` | Deterministic metrics | Metric name, formula, input variables, computed value, unit, and calculation provenance. |
| 5 | `ENGINEERING_LIFECYCLE`| 12-stage milestone progression | Stage transitions, readiness score (0-100), gate statuses (`READY`, `BLOCKED`, `PAUSED`). |
| 6 | `RESOURCES` | Authoritative citations | Resource URLs/paths, providers (GitHub, Supabase, OpenAI), authority tiers, and Evidence IDs. |
| 7 | `TOOLS_ACTIVITY` | Governed tool executions | Invoked tools, target modules, latency in ms, exit codes, and result summaries. |
| 8 | `DECISIONS` | Recorded approvals & rulings | Architectural choices, specialist agent delegations, and dual-custody approvals. |
| 9 | `CHANGES` | Repository & state deltas | Code diffs, schema migrations, connector state mutations, and drift remediations. |

---

### 4. Conversation Time Machine & Replay Lab
The Conversation Time Machine enables operators to open any historical turn and replay its Context Passport against live repository state:

1. **Context Snapshot Inspection**: Inspect the exact admitted items, excluded items, and debt items active at that moment.
2. **Divergence Engine**: Compares the historical Passport against current runtime context across:
   - Git Head Commit SHA (`divergenceScore` calculation)
   - Active AST Drift & Complexity metrics
   - Database schema and RLS policy versions
3. **Forensic Divergence Report**: Emits a structured delta explaining whether past assumptions still hold or if code mutations have invalidated downstream conclusions.

---

### 5. History Lenses Contract
- **PROMPT LENS**: Preserves intent, question taxonomy classification, and prompt refinement trees.
- **PICTURE LENS**: Preserves visual asset identity, timestamped observations, and claim mappings.
- **NUMERICAL LENS**: Preserves metric values, units, variable inputs, and deterministic formula provenance.
- **ENGINEERING LENS**: Preserves requirements, architecture, code, tests, security audits, releases, and incident timelines.
