import { toast } from "sonner";

// Centralized Configuration Flags
export const USE_REAL_ENGINE = import.meta.env["VITE_USE_REAL_ENGINE"] === "true";
export const BACKEND_API_URL = import.meta.env["VITE_BACKEND_API_URL"] || "http://localhost:8000";

// --- Types matching Backend Schemas ---
export interface RequirementItem {
  id: string;
  title: string;
  desc: string;
}

export interface ModuleItem {
  name: string;
  desc: string;
}

export interface ActorItem {
  name: string;
  desc: string;
}

export interface RequirementsOutput {
  modules: ModuleItem[];
  actors: ActorItem[];
  functional: RequirementItem[];
  non_functional: RequirementItem[];
  constraints: RequirementItem[];
  confidence: number;
}

export interface FindingItem {
  file: string;
  line: number;
  severity: "Critical" | "High" | "Medium" | "Low";
  rule_id: string;
  msg: string;
}

export interface ComplexityFileItem {
  file: string;
  nloc: number;
  functions_count: number;
  avg_complexity: number;
}

export interface RepoAnalysisOutput {
  repo_name: string;
  complexity: ComplexityFileItem[];
  security_findings: FindingItem[];
  eslint_findings: FindingItem[];
  semgrep_findings: FindingItem[];
  overall_health_score: number;
}

export interface EvaluateOutput {
  precision: number;
  recall: number;
  f1: number;
  matches: string[];
}

// --- High-fidelity Local Mock Fallbacks ---
const getMockRequirements = (prompt: string): RequirementsOutput => {
  const lower = prompt.toLowerCase();
  const modules: ModuleItem[] = [];
  const actors: ActorItem[] = [];
  const functional: RequirementItem[] = [];
  const non_functional: RequirementItem[] = [];
  const constraints: RequirementItem[] = [];

  if (lower.includes("login") || lower.includes("auth") || lower.includes("user")) {
    modules.push({
      name: "Authentication Module",
      desc: "Handles secure user credentials login and sessions.",
    });
    actors.push({ name: "Visitor / Member", desc: "Accesses authenticated user areas." });
    functional.push({
      id: "FR-01",
      title: "Credential validation",
      desc: "System must authenticate user entries.",
    });
    non_functional.push({
      id: "NFR-01",
      title: "Hashed Passwords",
      desc: "Store password hashes using salt.",
    });
  }

  if (lower.includes("payment") || lower.includes("stripe") || lower.includes("billing")) {
    modules.push({
      name: "Checkout Orchestration",
      desc: "Integrates with Stripe transaction handshakes.",
    });
    actors.push({ name: "Billing Manager", desc: "Reviews transaction ledgers." });
    functional.push({
      id: "FR-02",
      title: "Stripe Webhook Listeners",
      desc: "Trigger post-payment events.",
    });
    constraints.push({
      id: "CON-01",
      title: "PCI DSS Gateways",
      desc: "No local cards storage allowed.",
    });
  }

  if (modules.length === 0) {
    modules.push({ name: "Default Logic Core", desc: "Handles system prompt integrations." });
    actors.push({ name: "System User", desc: "Standard operator." });
    functional.push({
      id: "FR-01",
      title: "Evaluate prompts",
      desc: "System must parse prompt inputs.",
    });
    non_functional.push({
      id: "NFR-01",
      title: "Latency response",
      desc: "Resolve actions under 2s.",
    });
    constraints.push({ id: "CON-01", title: "API restrictions", desc: "Standard usage limits." });
  }

  return {
    modules,
    actors,
    functional,
    non_functional,
    constraints,
    confidence: 0.88,
  };
};

const mockRepoAnalysis: RepoAnalysisOutput = {
  repo_name: "brahma-insights-mock",
  complexity: [
    { file: "src/start.ts", nloc: 24, functions_count: 2, avg_complexity: 2.1 },
    { file: "src/routes/app.tsx", nloc: 48, functions_count: 4, avg_complexity: 3.4 },
  ],
  security_findings: [
    {
      file: "src/start.ts",
      line: 12,
      severity: "High",
      rule_id: "hardcoded-secret",
      msg: "Mock alert: Hardcoded signing secret detected.",
    },
  ],
  eslint_findings: [
    {
      file: "src/routes/app.tsx",
      line: 31,
      severity: "Medium",
      rule_id: "no-eval",
      msg: "Mock alert: Avoid using eval script blocks.",
    },
  ],
  semgrep_findings: [],
  overall_health_score: 88,
};

// --- Centralized API Services ---

export async function analyzeRequirements(prompt: string): Promise<RequirementsOutput> {
  if (USE_REAL_ENGINE) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/analyze/requirements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(
        "FastAPI backend requirements endpoint failed. Triggering local mock fallback.",
        error,
      );
      toast.info("FastAPI requirements connection unavailable. Using high-fidelity mock fallback.");
    }
  }
  return getMockRequirements(prompt);
}

export async function analyzeRepo(repoUrl: string): Promise<RepoAnalysisOutput> {
  if (USE_REAL_ENGINE) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/analyze/repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(
        "FastAPI backend repository analyzer failed. Triggering local mock fallback.",
        error,
      );
      toast.info("FastAPI repo scanner connection unavailable. Using high-fidelity mock fallback.");
    }
  }

  // Simulated network latency for high-fidelity experience
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return mockRepoAnalysis;
}

export async function evaluateMetrics(
  generated: string[],
  groundTruth: string[],
): Promise<EvaluateOutput> {
  if (USE_REAL_ENGINE) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generated, ground_truth: groundTruth }),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("FastAPI backend evaluate endpoint failed. Triggering local fallback.", error);
    }
  }

  // Local fallback calculation
  const genSet = new Set(generated.map((g) => g.toLowerCase().trim()).filter(Boolean));
  const gtSet = new Set(groundTruth.map((g) => g.toLowerCase().trim()).filter(Boolean));
  const matches = [...genSet].filter((item) => gtSet.has(item));

  const precision = genSet.size ? matches.length / genSet.size : 0.0;
  const recall = gtSet.size ? matches.length / gtSet.size : 0.0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0.0;

  return {
    precision,
    recall,
    f1,
    matches,
  };
}

export async function generateReportPdf(
  id: string,
  reportData: {
    title: string;
    description: string;
    health_score: number;
    requirements?: RequirementsOutput | null;
    security_issues?: FindingItem[] | null;
    complexity_summary?: Record<string, unknown> | null;
  },
): Promise<Blob> {
  if (USE_REAL_ENGINE) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/report/${id}/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.warn(
        "FastAPI backend PDF report endpoint failed. Triggering client-side fallback.",
        error,
      );
      toast.info(
        "FastAPI PDF generator connection unavailable. Generating local fallback PDF payload.",
      );
    }
  }

  // Return a dummy empty PDF blob on client-side fallback
  const blob = new Blob(["%PDF-1.4 mock file content for project specifications"], {
    type: "application/pdf",
  });
  return blob;
}
