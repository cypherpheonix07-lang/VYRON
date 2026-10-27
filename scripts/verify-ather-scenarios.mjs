import { atherScenariosRunner } from "../src/services/ather/atherScenarios.ts";

console.log("=================================================");
console.log("  ATHER COGNITIVE ARCHITECTURE — 10 SCENARIOS VERIFICATION");
console.log("=================================================\n");

try {
  const { passedCount, failedCount, total, results } = await atherScenariosRunner.runAllScenarios();

  for (const r of results) {
    const icon = r.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${icon} [Scenario ${r.scenarioNumber}]: ${r.title}`);
    console.log(`   Expected: ${r.expectedResult}`);
    console.log(`   Actual:   ${r.actualResult}`);
    if (r.error) {
      console.log(`   Error:    ${r.error}`);
    }
    console.log("");
  }

  console.log("-------------------------------------------------");
  console.log(`Summary: ${passedCount}/${total} PASSED (${failedCount} failed)`);
  console.log("-------------------------------------------------");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (err) {
  console.error("FATAL ERROR running scenarios:", err);
  process.exit(1);
}
