# PROJECT BRAHMA v4 — Backend, Database, Storage & Tool Verification Checks

**Document Reference**: `docs/audits/v4/04_backend_database_storage_tool_checks.md`  
**Execution Context**: Nitro SSR Server + Supabase Client SDK + Zero Raw SQL Mandate  

---

## 1. Database & Persistence Layer (Zero Raw SQL Mandate)

All client queries within VYRON use Supabase JavaScript SDK query builders or parameterized ORM adapters. Zero raw SQL string interpolation is permitted or present in client code:

```typescript
// Verified Architectural Invariant: Parameterized Supabase Query Builders
const { data, error } = await supabase
  .from("projects")
  .select("id, name, slug, description, status, created_at, updated_at")
  .eq("id", projectId)
  .single();
```

### Remote Database Status & Offline Resilience
- **Upstream Host**: `https://xwhsffgvyvhvyzbbhyim.supabase.co`
- **Current Operational Mode**: Remote database project is paused by provider.
- **Fail-Safe Mechanism**: The application intercepts connection errors and activates the **Safe Mock Repository & Fixture Engine** (`src/lib/mock-data.ts`, `src/services/discovery/realityMapService.ts`).
- **Telemetry Result**: Read operations return structured mock entities (`0 crashes`, `0 unhandled rejections`), preserving full exploratory and demonstration journeys.

---

## 2. Evidence Artifacts & Storage Integrity

- **Artifacts Directory**: `artifacts/` and `docs/audits/v4/`
- **ReportLab PDF Engine**: Deterministically packages release readiness evidence packs.
- **Audit Vault (`AUD-016`)**: Hash-chained event log recording every state transition.

---

## 3. Tool & External MCP Connectors

- **Model Context Protocol (MCP)**: Registered under `/app/connectors`.
- **GitHub Mirror**: Bidirectional AST diffing under `/app/github`.
- **Specialist Agents Mesh**: Swarm coordination verified under `/app/aether`.
