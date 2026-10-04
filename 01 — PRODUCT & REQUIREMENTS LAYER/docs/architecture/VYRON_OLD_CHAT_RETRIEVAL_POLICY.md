# VYRON OLD-CHAT RETRIEVAL & MEMORY COURT POLICY
## GOD MODE Ω× — INDUSTRIAL AI COPILOT CONTROL PLANE

### 1. Fundamental Doctrine
> **"Do not dump history into context."**
> Chat transcripts are immutable event logs, NOT working memory. Naive concatenation dilutes attention, exposes stale premises, causes cross-project data leakage, and wastes token budgets.

The **History Retrieval Layer** governs admission of previous turns through an 8-factor evaluation function, followed by **Memory Court** verification and the **Contradiction Tribunal**.

---

### 2. The 8-Dimensional Candidate Scoring Formula
Every candidate chat turn $C$ is scored against the active turn $Q$ on project $P$ and lifecycle stage $S$:

$$\text{Score}(C) = w_{\text{sem}} S_{\text{sem}} + w_{\text{proj}} S_{\text{proj}} + w_{\text{temp}} S_{\text{temp}} + w_{\text{life}} S_{\text{life}} + w_{\text{auth}} S_{\text{auth}} + w_{\text{fresh}} S_{\text{fresh}} + B_{\text{pref}} - P_{\text{contra}}$$

#### Weights & Criteria Table
| Factor | Weight | Evaluation Method | Threshold / Penalty |
|--------|--------|-------------------|---------------------|
| $S_{\text{sem}}$ Semantic Task Fit | 0.35 | Keyword & intent token overlap | Must be $\ge 0.30$ |
| $S_{\text{proj}}$ Project Identity Match | 0.25 | $1.0$ if $C.\text{proj} == P$; else $0.0$ | **HARD VETO**: If 0, total score is 0 |
| $S_{\text{temp}}$ Temporal Relevance | 0.10 | Exponential decay $e^{-t / (24 \times 14)}$ | Half-life 14 days |
| $S_{\text{life}}$ Lifecycle Concordance | 0.10 | $1.0$ if same stage; $0.4$ if adjacent | Prevents out-of-phase bias |
| $S_{\text{auth}}$ Authority Class | 0.10 | AUTHORITATIVE: $1.0$; DERIVED: $0.75$; INFERRED: $0.4$ | High-authority turns favored |
| $S_{\text{fresh}}$ Freshness | 0.10 | $<24$h: $1.0$; $<7$d: $0.7$; older: $0.3$ | Stale turns penalized |
| $B_{\text{pref}}$ User Preference | Bonus | PINNED: $+0.25$; UPVOTED: $+0.15$ | User curation boost |
| $P_{\text{contra}}$ Contradiction Penalty | Penalty | $-0.50$ if claim contradicts active AST | Handled by Tribunal |

**Admission Gate**: A candidate turn is admitted to the Context Mesh **IF AND ONLY IF**:
1. $\text{TotalScore} \ge 0.60$
2. $S_{\text{proj}} == 1.0$ (Strict Project Isolation)
3. Turn is NOT in user `FORBIDDEN` set.

---

### 3. Memory Court Lifecycle
Every candidate datum passes through a 7-stage pipeline:

```
[DISCOVER] ──► [SCORE] ──► [SCOPE] ──► [FRESHNESS] ──► [CONTRADICTION] ──► [USER-PREFERENCE] ──► [ADMIT / QUARANTINE]
```

1. **DISCOVER**: Query indexed candidate pool scoped to the active tenant.
2. **SCORE**: Compute the 8-dimensional weighted score.
3. **SCOPE**: Verify tenant and project perimeter. Cross-project matches are immediately quarantined.
4. **FRESHNESS**: Inspect whether the referenced code/architecture has changed since the turn.
5. **CONTRADICTION**: Check if any claim in the candidate conflicts with current live telemetry.
6. **USER PREFERENCE**: Check pinned or forbidden lists.
7. **ADMIT / QUARANTINE**: Admitted turns receive an `AutoReferenceExplanation`. Quarantined items carry an explicit `quarantineReason`.

---

### 4. Contradiction Tribunal
When a retrieved historical claim conflicts with current repository state or live telemetry, the Tribunal applies four deterministic laws:

1. **OBSERVATION > ASSUMPTION**: A live scanner result (e.g. AST Drift Engine, Bandit Scanner) ALWAYS supersedes an older conversational assertion.
2. **AUTHORITY DOMINANCE**: A higher authority tier (AUTHORITATIVE > DERIVED > INFERRED) overrides a lower tier.
3. **NEW EVIDENCE > STALE MEMORY**: When authority tiers are equal, newer timestamp with verified test execution supersedes older turns.
4. **HUMAN ESCALATION**: When two conflicting claims have equal authority and conflicting test proofs, the system emits a `BLOCKING` context debt item and prompts the operator to arbitrate.

---

### 5. Auto-Reference Card UX Contract
Whenever a previous chat turn is reused in context, the Copilot UI renders an interactive **Auto-Reference Card**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🧠 REFERENCED FROM PREVIOUS CHAT                                       │
│ Why Selected: 8D Score 0.88/1.0 | Project: ATLAS | Stage: ARCHITECTURE │
│ Reused Turn:  "Architecture drift is capped at 5.0% threshold..."       │
│ Ignored Turns: 2 preliminary chat iterations omitted for conciseness   │
│ Superseded:   No newer AST scans have contradicted this limit          │
│                                                                        │
│ User Controls: [✓ Use This]  [⊘ Never Use]  [💾 Remember]  [🗑 Forget] │
└────────────────────────────────────────────────────────────────────────┘
```

#### User Action Semantics:
- **USE**: Pins the turn for future queries in this session (+0.25 score bonus).
- **NEVER USE**: Immediately excludes the turn and permanently adds it to the forbidden set.
- **REMEMBER**: Promotes the turn's key claims into `DURABLE_MEMORY` (Invariant Vault).
- **FORGET**: Erases the claim from durable memory and quarantines the turn.
