/**
 * PROJECT BRAHMA — DEMO PROJECT CONSTANT (FL-02-B STEP 1)
 * High-fidelity synthetic FinLedger microservices architecture project.
 */

export interface DemoProject {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  stars: number;
  lastScan: Date;
  healthScore: number;
  status: "review" | "active" | "archived";
  _isDemo: boolean;
}

export const DEMO_PROJECT: DemoProject = {
  id: "demo-project-brahma-showcase",
  name: "FinLedger Microservices Platform",
  description:
    "Enterprise financial transaction processing system with 12 microservices, immutable double-entry ledger, and PCI-DSS Level 1 compliance.",
  repoUrl: "https://github.com/demo/finledger",
  language: "Python",
  stars: 847,
  lastScan: new Date("2026-09-10T14:23:00Z"),
  healthScore: 67,
  status: "review",
  _isDemo: true,
};
