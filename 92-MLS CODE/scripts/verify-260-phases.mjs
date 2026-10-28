import { execSync } from "node:child_process";

try {
  execSync('node scripts/verify-260-v3-phases.mjs', {
    stdio: "inherit",
    env: { ...process.env, __V3_AUDIT_RUNNING__: "1" },
  });
} catch (err) {
  process.exit(err.status ?? 1);
}

