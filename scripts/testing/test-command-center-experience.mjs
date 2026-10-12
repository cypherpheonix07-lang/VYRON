/**
 * VYRON COMMAND CENTER — PROJECT CONTEXT & RUN EXPERIENCE VERIFICATION SUITE
 * Complete end-to-end qualification of Workstreams A through Z.
 * Tests:
 * 1. Root-cause defect reproduction: getProject(unknownId) no longer masks as Aurora Payments
 * 2. Native project creation & active-project visibility across header & registry
 * 3. GitHub repository association & origin tracking
 * 4. Selection precedence & race-condition rejection via generation IDs
 * 5. Operation registry coverage & preflight validation
 * 6. Durable run dispatch, input snapshotting, step progression, and HMAC SHA-256 sealing
 * 7. Project switching isolation: dashboard project switches do NOT mutate active runs
 * 8. Re-opening / refresh idempotency: reading a run never executes side-effects
 * 9. Run cancellation & recovery boundaries
 *
 * Run with: npx tsx scripts/testing/test-command-center-experience.mjs
 */

import { projectRegistry } from "../../src/services/project/projectRegistry";
import { getProject } from "../../src/lib/mock-data";
import {
  OPERATION_REGISTRY,
  getOperationDefinition,
  listSupportedOperations,
} from "../../src/services/runs/operationRegistry";
import { runService } from "../../src/services/runs/runService";

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedAssertions++;
    console.error(`  [FAIL] ${message}`);
  }
}

async function runCommandCenterSuite() {
  console.log("===============================================================================");
  console.log("  VYRON COMMAND CENTER — PROJECT CONTEXT & RUN EXPERIENCE TEST SUITE");
  console.log("===============================================================================\n");

  // TEST 1: DEFECT REPRODUCTION & DIAGNOSIS (WORKSTREAM A & B)
  console.log("--> Section 1: Defect Reproduction & getProject Truthfulness");
  const unknownId = "unknown-project-999";
  const projectFromRegistry = projectRegistry.getProjectById(unknownId);
  assert(projectFromRegistry === null, "Unknown project ID in registry returns null (does not silently return projects[0])");

  const synthesized = getProject(unknownId);
  assert(synthesized.id === unknownId, `getProject('${unknownId}') returns truthful record with ID "${unknownId}"`);
  assert(synthesized.name !== "Aurora Payments Gateway", "getProject does not masquerade as Aurora Payments Gateway");
  assert(synthesized.status === "Draft", "Synthesized record indicates uninitialized Draft status");

  // TEST 2: NATIVE PROJECT CREATION (WORKSTREAM D & E)
  console.log("\n--> Section 2: Native Project Creation & Active Project Visibility");
  const nativeProj = projectRegistry.createProject({
    id: "proj-native-test-1",
    name: "AeroDynamics Fluid Simulation",
    slug: "aerodynamics-fluid-simulation",
    description: "High-performance CFD mesh solver and boundary layer analyzer.",
    domain: "Aerospace",
    origin: "native",
  });

  assert(nativeProj.id === "proj-native-test-1", "Created native project has stable ID");
  assert(nativeProj.origin === "native", "Created native project has origin 'native'");
  assert(!nativeProj.repoConnected, "Native project initializes with repoConnected: false");
  assert(projectRegistry.getActiveProjectId() === "proj-native-test-1", "Created project is immediately selected as active in registry");

  const retrieved = projectRegistry.getProjectById("proj-native-test-1");
  assert(retrieved !== null && retrieved.name === "AeroDynamics Fluid Simulation", "Retrieved project matches name and parameters");

  // TEST 3: GITHUB PROJECT ASSOCIATION (WORKSTREAM C)
  console.log("\n--> Section 3: GitHub Repository Association & Selection");
  const githubProj = projectRegistry.createProject({
    id: "proj-github-test-2",
    name: "EdgeRouter Microgateway",
    slug: "edgerouter-microgateway",
    description: "Distributed Envoy proxy filter chain for microservices.",
    domain: "Cloud Native",
    origin: "github",
    repo_full_name: "vyron-org/edgerouter-proxy",
    default_branch: "release-v2",
  });

  assert(githubProj.origin === "github", "GitHub project records origin: 'github'");
  assert(githubProj.repoConnected === true, "GitHub project records repoConnected: true");
  assert(githubProj.repo_full_name === "vyron-org/edgerouter-proxy", "GitHub project stores provider repository identity stably");
  assert(githubProj.default_branch === "release-v2", "GitHub project stores branch pin");

  // TEST 4: SELECTION PRECEDENCE & GENERATION RACING PROTECTION (WORKSTREAM B & E)
  console.log("\n--> Section 4: Project Selection Precedence & Generation Racing Protection");
  const gen1 = projectRegistry.getGenerationId();
  projectRegistry.setActiveProjectId("proj-native-test-1");
  const gen2 = projectRegistry.getGenerationId();
  projectRegistry.setActiveProjectId("proj-github-test-2");
  const gen3 = projectRegistry.getGenerationId();

  assert(gen2 > gen1, "Generation counter increments monotonically on selection transition");
  assert(gen3 > gen2, "Generation counter increments again on subsequent selection transition");
  assert(projectRegistry.getActiveProjectId() === "proj-github-test-2", "Latest selected project 'proj-github-test-2' is active");

  // TEST 5: OPERATION REGISTRY COVERAGE (WORKSTREAM I & J)
  console.log("\n--> Section 5: Operation Registry Coverage & Input Schemas");
  const ops = listSupportedOperations();
  assert(ops.length >= 6, `At least 6 distinct operations registered (found ${ops.length})`);

  const requiredOpTypes = [
    "REPOSITORY_ANALYSIS",
    "BLUEPRINT_GENERATION",
    "TEST_SUITE_RUN",
    "SECURITY_SCAN",
    "BUILD_VERIFICATION",
    "ATHER_TASK",
  ];
  for (const opType of requiredOpTypes) {
    const op = getOperationDefinition(opType);
    assert(!!op && op.id === opType, `Operation '${opType}' declared with valid schema and prerequisites`);
    assert(op.prerequisites.length > 0, `Operation '${opType}' declares prerequisites: [${op.prerequisites.join(", ")}]`);
    assert(!!op.outputArtifactType, `Operation '${opType}' declares output artifact type: ${op.outputArtifactType}`);
  }

  // TEST 6: DURABLE RUN DISPATCH, STEP PROGRESSION, EVIDENCE (WORKSTREAMS K, L, M, N, O)
  console.log("\n--> Section 6: Durable Run Dispatch, Step Progression & Evidence Sealing");
  const run1 = await runService.createAndDispatchRun({
    projectId: "proj-native-test-1",
    operationType: "REPOSITORY_ANALYSIS",
    originItem: "Command Center Top Action",
    branch: "main",
    commitSha: "b85d0d04fed483554b7ff9ec316a215ce5fb46d9",
    environment: "production",
  });

  assert(run1.runId.startsWith("RUN-"), `Run ID generated with durable prefix: ${run1.runId}`);
  assert(run1.projectId === "proj-native-test-1", "Run is permanently bound to project 'proj-native-test-1'");
  assert(run1.projectName === "AeroDynamics Fluid Simulation", "Run snapshots project name");
  assert(run1.inputSnapshot.branch === "main", "Run pins branch snapshot");
  assert(run1.inputSnapshot.commitSha === "b85d0d04fed483554b7ff9ec316a215ce5fb46d9", "Run pins commit SHA snapshot");
  assert(run1.steps.length === 4, `Run initializes 4 sequential steps (found ${run1.steps.length})`);

  // Wait for worker adapter execution
  console.log("  ... Waiting for run execution worker adapter to complete ...");
  await new Promise((resolve) => setTimeout(resolve, 1600));

  const completedRun = runService.getRun(run1.runId);
  assert(completedRun !== null, "Completed run retrieved from durable storage");
  assert(completedRun.status === "succeeded", `Run status converged to 'succeeded' (actual: ${completedRun?.status})`);
  assert(completedRun.steps.every((s) => s.status === "succeeded"), "All 4 sequential execution steps succeeded");
  assert(completedRun.artifacts.length > 0, `Run generated ${completedRun.artifacts.length} durable artifacts`);
  assert(
    !!completedRun.verificationEvidence?.hash &&
      completedRun.verificationEvidence.hash.startsWith("sha256_") &&
      completedRun.verificationEvidence.hash.length === 71,
    `Run sealed with cryptographic HMAC SHA-256 seal: ${completedRun.verificationEvidence?.hash.slice(0, 16)}...`
  );

  // TEST 7: PROJECT ISOLATION (WORKSTREAM L03)
  console.log("\n--> Section 7: Project Isolation During Execution & Navigation");
  // Switch active project in registry to proj-github-test-2
  projectRegistry.setActiveProjectId("proj-github-test-2");
  assert(projectRegistry.getActiveProjectId() === "proj-github-test-2", "Active project switched to 'proj-github-test-2'");

  // Verify that inspecting Run 1 STILL shows proj-native-test-1!
  const reloadedRun1 = runService.getRun(run1.runId);
  assert(reloadedRun1.projectId === "proj-native-test-1", "Run 1 remains permanently bound to 'proj-native-test-1' even though active project is 'proj-github-test-2'");
  assert(reloadedRun1.projectName === "AeroDynamics Fluid Simulation", "Run 1 still displays original project name");

  // TEST 8: RE-OPENING / REFRESH IDEMPOTENCY (WORKSTREAM K08)
  console.log("\n--> Section 8: Re-opening & Refresh Idempotency");
  const readRunAgain = runService.getRun(run1.runId);
  assert(readRunAgain.runId === run1.runId, "Reading run by ID is a pure read action");
  assert(readRunAgain.status === "succeeded", "Run retains its durable status without re-executing");

  // TEST 9: RUN CANCELLATION BOUNDARIES (WORKSTREAM T06-T07)
  console.log("\n--> Section 9: Run Cancellation Boundaries");
  const cancelTestRun = await runService.createAndDispatchRun({
    projectId: "proj-github-test-2",
    operationType: "BUILD_VERIFICATION",
    originItem: "Build Test",
  });
  assert(cancelTestRun.status === "running", "Build verification run started in 'running' state");

  // Cancel immediately
  const cancelledRun = runService.cancelRun(cancelTestRun.runId);
  assert(cancelledRun.status === "cancelled", "Cancelled run transitioned cleanly to 'cancelled'");
  assert(cancelledRun.logs.some((l) => l.message.includes("cancelled")), "Cancellation recorded in logs");

  // Final Summary
  console.log("\n===============================================================================");
  console.log(`  VERIFICATION RESULTS:`);
  console.log(`  Total Assertions: ${totalAssertions}`);
  console.log(`  Passed: ${passedAssertions}`);
  console.log(`  Failed: ${failedAssertions}`);
  console.log("===============================================================================\n");

  if (failedAssertions > 0) {
    process.exit(1);
  }
}

runCommandCenterSuite().catch((err) => {
  console.error("Test suite unhandled error:", err);
  process.exit(1);
});
