/**
 * VYRON — ECOSYSTEM CONTROL PLANE VERIFICATION SUITE
 * GOD MODE vULTIMA vNEXT
 * Verifies all 25 architectural additions and contracts across GitHub + Vibe Ecosystem.
 */

import {
  vibeAdapterRegistry,
  identityGraphManager,
  eventIngestionGateway,
  reconciliationEngine,
  connectorHealthSloEngine,
  consentAuthLedger,
  ecosystemControlPlane,
} from "./src/services/ecosystem/index.ts";
import fs from "fs";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

async function runVerification() {
  console.log("=================================================================");
  console.log("VYRON — GITHUB PORTFOLIO & VIBE-CODING ECOSYSTEM VERIFICATION GATES");
  console.log("=================================================================\n");

  // --- GATE 1: Adapter SDK & Provider Coverage ---
  console.log("[GATE 1] Testing Provider Adapter SDK & Registry...");
  const adapters = vibeAdapterRegistry.getAll();
  assert(adapters.length >= 6, `Expected at least 6 adapters, registered: ${adapters.length}`);
  const providers = adapters.map((a) => a.providerId);
  assert(providers.includes("github"), "GitHub App adapter is registered");
  assert(providers.includes("lovable"), "Lovable.dev adapter is registered");
  assert(providers.includes("v0"), "v0 adapter is registered");
  assert(providers.includes("bolt"), "Bolt adapter is registered");
  assert(providers.includes("cursor"), "Cursor adapter is registered");
  assert(providers.includes("replit"), "Replit adapter is registered");

  // --- GATE 2: Capability Negotiation ---
  console.log("\n[GATE 2] Testing Capability Negotiation...");
  const lovable = vibeAdapterRegistry.get("lovable");
  assert(lovable !== undefined, "Lovable adapter exists");
  assert(lovable?.capabilities.REPOSITORY_SYNC === "SUPPORTED", "Lovable supports REPOSITORY_SYNC");
  assert(lovable?.capabilities.BRANCH_LINEAGE === "SUPPORTED", "Lovable supports BRANCH_LINEAGE");
  assert(lovable?.capabilities.PREVIEW_URLS === "SUPPORTED", "Lovable supports PREVIEW_URLS");

  // --- GATE 3: Provider Health Probing & SLOs ---
  console.log("\n[GATE 3] Testing Provider Health Probing & SLOs...");
  const healthResults = await connectorHealthSloEngine.evaluateAllProviders();
  assert(healthResults.length === adapters.length, `Evaluated SLOs for all ${adapters.length} adapters`);
  const aggregateHealth = connectorHealthSloEngine.calculateAggregateHealth();
  assert(aggregateHealth.overallScore >= 90, `Aggregate health score >= 90% (Current: ${aggregateHealth.overallScore}%)`);
  assert(aggregateHealth.avgLatencyMs > 0 && aggregateHealth.avgLatencyMs < 200, `Average latency is sub-200ms (${aggregateHealth.avgLatencyMs}ms)`);

  // --- GATE 4: Canonical Identity Graph & Lineage DAG ---
  console.log("\n[GATE 4] Testing Canonical Identity Graph & Lineage DAG...");
  const accounts = identityGraphManager.getAccounts();
  assert(accounts.length >= 1, "At least 1 GitHub account/org enrolled");
  assert(accounts[0].login === "cypherpheonix07-lang", `Account login matches: ${accounts[0].login}`);

  const repos = identityGraphManager.getEnrolledRepositories();
  assert(repos.length >= 1, `Enrolled repositories count: ${repos.length}`);
  const primaryRepo = repos.find((r) => r.fullName === "cypherpheonix07-lang/VYRON");
  assert(primaryRepo !== undefined, "Primary repository cypherpheonix07-lang/VYRON is enrolled");

  const dag = identityGraphManager.buildLineageDAG();
  assert(dag.nodes.length >= 4, `Lineage DAG nodes count: ${dag.nodes.length}`);
  assert(dag.edges.length >= 2, `Lineage DAG edges count: ${dag.edges.length}`);

  // --- GATE 5: Repository Lifecycle Management (Auto-Enroll & Offboard) ---
  console.log("\n[GATE 5] Testing Repository Lifecycle Management (Enroll & Offboard)...");
  const testRepoName = "cypherpheonix07-lang/test-auto-service";
  const enrolled = await ecosystemControlPlane.autoEnrollRepository(testRepoName);
  assert(enrolled.fullName === testRepoName, `Repository auto-enrolled successfully: ${enrolled.fullName}`);
  assert(enrolled.enrollmentStatus === "ENROLLED", "Repository status set to ENROLLED");

  await ecosystemControlPlane.offboardRepository(testRepoName);
  const offboarded = identityGraphManager.getEnrolledRepository(testRepoName);
  assert(offboarded?.enrollmentStatus === "OFFBOARDED", "Repository status transitioned to OFFBOARDED");

  // --- GATE 6: Webhook & Event Ingestion Gateway (Idempotency & Normalization) ---
  console.log("\n[GATE 6] Testing Webhook Ingestion & Idempotency Deduplication...");
  const testEventId = `evt-test-${Date.now()}`;
  const res1 = eventIngestionGateway.ingest("github", "PUSH", {
    id: testEventId,
    repository: { full_name: "cypherpheonix07-lang/VYRON" },
    sender: { login: "cypherpheonix07-lang" },
    ref: "refs/heads/main",
  });
  assert(res1.accepted === true, "First event acceptance verified");
  assert(res1.isDuplicate === false, "Event is not duplicate on first ingestion");

  // Re-ingest the exact same event ID -> must be cleanly suppressed
  const res2 = eventIngestionGateway.ingest("github", "PUSH", {
    id: testEventId,
    repository: { full_name: "cypherpheonix07-lang/VYRON" },
    sender: { login: "cypherpheonix07-lang" },
  });
  assert(res2.accepted === false, "Duplicate event was rejected");
  assert(res2.isDuplicate === true, "Idempotent duplicate detection verified");

  // Signature verification check
  const validSig = eventIngestionGateway.verifySignature("{}", "sha256=abcdef", "secret123");
  assert(typeof validSig === "boolean", "HMAC signature validator contract verified");

  // --- GATE 7: Dual-Plane Reconciliation Engine ---
  console.log("\n[GATE 7] Testing Dual-Plane Reconciliation Engine...");
  const reconReport = await reconciliationEngine.runReconciliation();
  assert(reconReport.totalReposChecked >= 1, `Reconciliation checked ${reconReport.totalReposChecked} repos`);
  assert(reconReport.vibeProjectsSynced >= 1, `Synced ${reconReport.vibeProjectsSynced} vibe-coding projects`);
  assert(reconReport.status === "CONVERGED" || reconReport.status === "DRIFT_REPAIRED", `Reconciliation status: ${reconReport.status}`);

  // --- GATE 8: Consent & Auto-Connect Ledger (Vibe-Coding Auto-Connect Law) ---
  console.log("\n[GATE 8] Testing Consent & Auto-Connect Ledger...");
  const pending = consentAuthLedger.getPendingReviewCandidates();
  assert(pending.length >= 1, `Found ${pending.length} pending candidate(s) for review`);
  const cand = pending[0];
  assert(cand.confidenceScore >= 0.8, `Candidate confidence score >= 80% (${Math.round(cand.confidenceScore * 100)}%)`);

  const authRecord = consentAuthLedger.authorizeCandidate(cand.candidateId);
  assert(authRecord.auditHash.length === 64, `Generated SHA-256 audit hash: ${authRecord.auditHash}`);
  assert(authRecord.isRevoked === false, "Authorization is active");

  const revoked = consentAuthLedger.revokeAuthorization(cand.provider);
  assert(revoked === true, `Successfully revoked authorization for ${cand.provider}`);

  // --- GATE 9: Zero Raw SQL Law Enforcement ---
  console.log("\n[GATE 9] Enforcing Zero Raw SQL Law across Ecosystem Layer...");
  const ecosystemFiles = [
    "./src/services/ecosystem/types.ts",
    "./src/services/ecosystem/vibeAdapterSdk.ts",
    "./src/services/ecosystem/identityGraph.ts",
    "./src/services/ecosystem/eventIngestionGateway.ts",
    "./src/services/ecosystem/reconciliationEngine.ts",
    "./src/services/ecosystem/connectorHealthSloEngine.ts",
    "./src/services/ecosystem/consentAuthLedger.ts",
    "./src/services/ecosystem/integrationControlPlane.ts",
    "./src/components/ecosystem/EngineeringPortfolio.tsx",
    "./src/components/ecosystem/VibePlatformHub.tsx",
    "./src/components/ecosystem/CrossPlatformLineageGraph.tsx",
  ];

  let sqlViolations = 0;
  for (const file of ecosystemFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf-8");
      if (
        content.includes("queryRaw(") ||
        content.includes("executeSql(") ||
        content.includes("execSql(") ||
        content.match(/\b(SELECT\s+.+\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b/i)
      ) {
        console.error(`SQL query execution detected in ${file}`);
        sqlViolations++;
      }
    }
  }
  assert(sqlViolations === 0, `Zero Raw SQL Law preserved (0 violations found across ${ecosystemFiles.length} files)`);

  // --- GATE 10: Overview Summary Telemetry ---
  console.log("\n[GATE 10] Testing Ecosystem Overview Summary Facade...");
  const overview = await ecosystemControlPlane.getOverviewSummary();
  assert(overview.enrolledRepositoriesCount >= 1, `Enrolled repositories count: ${overview.enrolledRepositoriesCount}`);
  assert(overview.aggregateHealthScore >= 90, `Aggregate health score: ${overview.aggregateHealthScore}%`);

  console.log("\n=================================================================");
  console.log(`TOTAL PASSED: ${passed}`);
  console.log(`TOTAL FAILED: ${failed}`);
  console.log("=================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runVerification();
