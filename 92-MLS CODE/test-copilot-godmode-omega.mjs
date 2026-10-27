import { execSync } from "node:child_process";

try {
  execSync('npx -- tsx "51 — TESTING PLATFORM/scripts/testing/test-copilot-godmode-omega.mjs"', {
    stdio: "inherit",
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
