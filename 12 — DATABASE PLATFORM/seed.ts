import { createId } from "./cuid2.ts";
import crypto from "node:crypto";

export interface SeedDataResult {
  tenant: { id: string; name: string; slug: string; plan: "enterprise" };
  adminUser: { id: string; name: string; email: string; role: "admin" };
  project: { id: string; name: string; healthScore: number };
  session: { id: string; title: string };
  initialAuditLog: { id: string; action: string; chainHash: string };
}

export function generateSeedData(): SeedDataResult {
  const tenantId = createId();
  const userId = createId();
  const projectId = createId();
  const sessionId = createId();
  const auditId = createId();

  const genesisPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";
  const action = "tenant.bootstrap";
  const chainHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ tenantId, userId, action, prevHash: genesisPrevHash }))
    .digest("hex");

  return {
    tenant: {
      id: tenantId,
      name: "Brahma Dev Platform",
      slug: "brahma-dev",
      plan: "enterprise",
    },
    adminUser: {
      id: userId,
      name: "Priya Nair",
      email: "priya.nair@brahma.dev",
      role: "admin",
    },
    project: {
      id: projectId,
      name: "VYRON Autonomous Engineering Engine",
      healthScore: 98,
    },
    session: {
      id: sessionId,
      title: "Master Architecture Verification",
    },
    initialAuditLog: {
      id: auditId,
      action,
      chainHash,
    },
  };
}

export const seedData = generateSeedData();
export default seedData;
