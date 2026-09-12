/**
 * PROJECT BRAHMA — CATALOG DATA SERVICE & QUERY LAYER
 * Data-driven Supabase catalogs with TanStack Query caching.
 * LAW: Zero domain/persona arrays declared inside any .tsx file.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { ProjectDomain, ProjectPersona, ProjectTemplate } from "@/types/wizard";

/**
 * Authoritative fallback personas catalog (contained strictly in catalogService.ts, zero .tsx leakage)
 * Active if DB table is initializing or offline.
 */
const SEED_PERSONAS_CATALOG: ProjectPersona[] = [
  {
    id: "persona-1",
    slug: "software-engineer",
    label: "Software Engineer",
    description: "Core developer writing application logic, APIs, and microservices.",
    category: "Engineering",
    default_priority: 1,
    icon: "Code",
    active: true,
  },
  {
    id: "persona-2",
    slug: "devops-sre",
    label: "DevOps / SRE",
    description: "Platform and infrastructure engineer managing CI/CD, Kubernetes, and uptime.",
    category: "Engineering",
    default_priority: 2,
    icon: "Terminal",
    active: true,
  },
  {
    id: "persona-3",
    slug: "qa-test-lead",
    label: "QA & Test Engineer",
    description: "Test automation architect overseeing end-to-end and regression coverage.",
    category: "Engineering",
    default_priority: 3,
    icon: "CheckCircle",
    active: true,
  },
  {
    id: "persona-4",
    slug: "secops-analyst",
    label: "Security / SecOps",
    description: "Cybersecurity officer monitoring CVEs, compliance gates, and pen-tests.",
    category: "Security",
    default_priority: 4,
    icon: "Shield",
    active: true,
  },
  {
    id: "persona-5",
    slug: "product-manager",
    label: "Product Manager",
    description: "Feature roadmap owner defining functional requirements and acceptance criteria.",
    category: "Product",
    default_priority: 5,
    icon: "Briefcase",
    active: true,
  },
  {
    id: "persona-6",
    slug: "ui-ux-designer",
    label: "UI / UX Designer",
    description: "Design systems lead creating Figma flows, accessibility, and visual tokens.",
    category: "Product",
    default_priority: 6,
    icon: "Palette",
    active: true,
  },
  {
    id: "persona-7",
    slug: "data-engineer",
    label: "Data Engineer",
    description: "Pipelines architect managing ETL streams, warehousing, and analytics schema.",
    category: "Engineering",
    default_priority: 7,
    icon: "Database",
    active: true,
  },
  {
    id: "persona-8",
    slug: "engineering-lead",
    label: "Engineering Director / VP",
    description: "Executive stakeholder tracking delivery risk, health scores, and velocity.",
    category: "Executive",
    default_priority: 8,
    icon: "Award",
    active: true,
  },
  {
    id: "persona-9",
    slug: "compliance-officer",
    label: "Compliance Officer",
    description: "Governance lead auditing SOC2, HIPAA, and regulatory artifact retention.",
    category: "Security",
    default_priority: 9,
    icon: "FileText",
    active: true,
  },
  {
    id: "persona-10",
    slug: "support-engineer",
    label: "Support / Customer Success",
    description:
      "Operational stakeholder monitoring system health, error logs, and client telemetry.",
    category: "Operations",
    default_priority: 10,
    icon: "LifeBuoy",
    active: true,
  },
  {
    id: "persona-11",
    slug: "ai-ml-researcher",
    label: "AI / ML Scientist",
    description: "Model evaluation specialist auditing tokens, embeddings, and prompt accuracy.",
    category: "Engineering",
    default_priority: 11,
    icon: "Brain",
    active: true,
  },
  {
    id: "persona-12",
    slug: "external-client",
    label: "External End User",
    description: "End consumer or tenant interacting with web and mobile client interfaces.",
    category: "External",
    default_priority: 12,
    icon: "Globe",
    active: true,
  },
];

const SEED_TEMPLATES_CATALOG: ProjectTemplate[] = [
  {
    id: "tpl-1",
    slug: "enterprise-saas",
    name: "Enterprise Multi-Tenant SaaS",
    description: "Production-grade cloud architecture with RBAC, Stripe billing, and audit logs.",
    domains: ["web", "fintech", "api"],
    modules: ["auth", "payments", "audit_logs", "analytics", "file_uploads", "notifications"],
    recommended_stack: "next-serverless",
    feature_toggles: {
      auth: true,
      payments: true,
      invoicing: true,
      audit_logs: true,
      analytics: true,
      file_uploads: true,
      notifications: true,
    },
    active: true,
  },
  {
    id: "tpl-2",
    slug: "healthcare-telemetry",
    name: "HIPAA Compliant Health Telemetry",
    description:
      "High-security microservice mesh with cryptographic audit trails and encrypted patient storage.",
    domains: ["healthcare", "iot", "api"],
    modules: ["auth", "audit_logs", "file_uploads", "realtime", "notifications"],
    recommended_stack: "react-fastapi",
    feature_toggles: {
      auth: true,
      audit_logs: true,
      file_uploads: true,
      realtime: true,
      notifications: true,
    },
    active: true,
  },
  {
    id: "tpl-3",
    slug: "ai-discovery-hub",
    name: "Autonomous AI Agent & Discovery Hub",
    description: "Generative AI tool taxonomy and vector search catalog with semantic LLM routing.",
    domains: ["aiml", "web", "devops"],
    modules: ["auth", "search", "copilot", "analytics", "realtime"],
    recommended_stack: "react-fastapi",
    feature_toggles: {
      auth: true,
      search: true,
      copilot: true,
      analytics: true,
      realtime: true,
    },
    active: true,
  },
  {
    id: "tpl-4",
    slug: "fintech-ledger",
    name: "PCI-DSS Banking & Payments Gateway",
    description: "Zero-trust financial transaction settlement engine with immutable WORM ledger.",
    domains: ["fintech", "api", "security"],
    modules: ["auth", "payments", "invoicing", "audit_logs", "realtime"],
    recommended_stack: "react-fastapi",
    feature_toggles: {
      auth: true,
      payments: true,
      invoicing: true,
      audit_logs: true,
      realtime: true,
    },
    active: true,
  },
];

/**
 * 0.3: Raw fetcher for Domains catalog
 */
export async function getDomains(): Promise<ProjectDomain[]> {
  try {
    const { data, error } = await supabase
      .from("project_domains")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(
        `BRA-503: Service Unavailable - Failed to load domains catalog: ${error.message}`,
      );
    }

    if (!data || data.length === 0) {
      throw new Error("BRA-503: Service Unavailable - Domain catalog empty in database");
    }

    return data as ProjectDomain[];
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.startsWith("BRA-503")) {
      throw new Error(
        `BRA-503: Service Unavailable - Failed to connect to domains catalog: ${msg}`,
      );
    }
    throw err;
  }
}

/**
 * 0.3: Raw fetcher for Personas catalog
 */
export async function getPersonas(): Promise<ProjectPersona[]> {
  try {
    const { data, error } = await supabase
      .from("project_personas")
      .select("*")
      .eq("active", true)
      .order("default_priority", { ascending: true });

    if (error || !data || data.length === 0) {
      // Graceful fallback to authoritative catalog if table DDL is pending
      return SEED_PERSONAS_CATALOG;
    }

    return data as ProjectPersona[];
  } catch {
    return SEED_PERSONAS_CATALOG;
  }
}

/**
 * Raw fetcher for Project Templates catalog (Step 5 Matcher)
 */
export async function getTemplates(): Promise<ProjectTemplate[]> {
  try {
    const { data, error } = await supabase.from("project_templates").select("*").eq("active", true);

    if (error || !data || data.length === 0) {
      return SEED_TEMPLATES_CATALOG;
    }

    return data as ProjectTemplate[];
  } catch {
    return SEED_TEMPLATES_CATALOG;
  }
}

/**
 * 0.3: TanStack Query Hook: useDomains
 * Cache Key: ['domains'], staleTime: 10min, retry: 2 with backoff
 */
export function useDomains() {
  return useQuery({
    queryKey: ["domains"],
    queryFn: getDomains,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

/**
 * 0.3: TanStack Query Hook: usePersonas
 * Cache Key: ['personas'], staleTime: 10min, retry: 2 with backoff
 */
export function usePersonas() {
  return useQuery({
    queryKey: ["personas"],
    queryFn: getPersonas,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

/**
 * TanStack Query Hook: useProjectTemplates
 * Cache Key: ['templates'], staleTime: 10min, retry: 2 with backoff
 */
export function useProjectTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}
