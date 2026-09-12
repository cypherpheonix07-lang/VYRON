/**
 * PROJECT BRAHMA — STEP CONTRACTS (ZOD VERBATIM) & VALIDATION ENGINE
 * Verbatim Zod schemas for Steps 1 through 7 with inline error extraction.
 */

import { z } from "zod";
import type { WizardPayload } from "@/types/wizard";

/**
 * Step 1 Contract:
 * { name: string.min(3).max(60), slug: string.regex(/^[a-z0-9-]{3,60}$/),
 *   description: string.max(500), tags: string[].max(8), icon: string, cover: string }
 */
export const step1Schema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(60, "Project name cannot exceed 60 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]{3,60}$/, "Slug must be 3-60 lowercase characters, numbers, or hyphens"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  tags: z.array(z.string()).max(8, "Maximum 8 tags allowed"),
  icon: z.string().min(1, "Icon selection is required"),
  cover: z.string().min(1, "Cover gradient selection is required"),
});

/**
 * Step 2 Contract:
 * { domain: string (must exist in catalog), domain_secondary: string[].max(3),
 *   scale: enum('prototype','production','enterprise') }
 */
export const step2Schema = z.object({
  domain: z.string().min(1, "Primary domain selection is required"),
  domain_secondary: z.array(z.string()).max(3, "Maximum 3 secondary domains allowed"),
  scale: z.enum(["prototype", "production", "enterprise"], {
    errorMap: () => ({ message: "Scale must be prototype, production, or enterprise" }),
  }),
});

/**
 * Step 3 Contract:
 * { target_users: array({label, slug?, custom, priority}).min(1).max(12),
 *   accessibility: boolean }
 */
export const targetUserSchema = z.object({
  label: z.string().min(1, "Persona label cannot be empty").max(40, "Persona label max 40 chars"),
  slug: z.string().optional(),
  custom: z.boolean(),
  priority: z.number().int().min(1),
});

export const step3Schema = z.object({
  target_users: z
    .array(targetUserSchema)
    .min(1, "At least 1 target user persona is required")
    .max(12, "Maximum 12 target user personas allowed"),
  accessibility: z.boolean(),
});

/**
 * Step 4 Contract:
 * { platforms: enum('web','mobile','api','desktop').array().min(1),
 *   stack: enum('ai-decides','react-fastapi','next-serverless','custom'),
 *   repo_full_name: string.nullable(), complexity_budget: number.int(1,10) }
 */
export const step4Schema = z.object({
  platforms: z
    .array(z.enum(["web", "mobile", "api", "desktop"]))
    .min(1, "Select at least 1 target platform"),
  stack: z.enum(["ai-decides", "react-fastapi", "next-serverless", "custom"]),
  repo_full_name: z.string().nullable(),
  complexity_budget: z
    .number()
    .int()
    .min(1, "Complexity budget min is 1")
    .max(10, "Complexity budget max is 10"),
});

/**
 * Step 5 Contract:
 * { feature_toggles: record(boolean), ai_tasks: record(boolean) }
 */
export const step5Schema = z.object({
  feature_toggles: z.record(z.boolean()),
  ai_tasks: z.record(z.boolean()),
});

/**
 * Step 6 Contract:
 * { gate_strictness: enum('advisory','standard','strict'),
 *   compliance_pack: enum('none','soc2','hipaa','fda','do178c'),
 *   allow_override: boolean, retention: enum('90d','1y','7y') }
 */
export const step6Schema = z.object({
  gate_strictness: z.enum(["advisory", "standard", "strict"]),
  compliance_pack: z.enum(["none", "soc2", "hipaa", "fda", "do178c"]),
  allow_override: z.boolean(),
  retention: z.enum(["90d", "1y", "7y"]),
});

/**
 * Step 7 Contract:
 * { kpi_targets: {health_min:int(0,100), coverage_min:int(0,100), max_critical:int(0,50)},
 *   budget_cap_usd: number(0.5,50), milestone: date.nullable(),
 *   cadence: enum('weekly','biweekly','monthly') }
 */
export const step7Schema = z.object({
  kpi_targets: z.object({
    health_min: z.number().int().min(0, "Min health is 0").max(100, "Max health is 100"),
    coverage_min: z.number().int().min(0, "Min coverage is 0").max(100, "Max coverage is 100"),
    max_critical: z.number().int().min(0, "Min critical is 0").max(50, "Max critical is 50"),
  }),
  budget_cap_usd: z
    .number()
    .min(0.5, "Budget cap must be at least $0.50")
    .max(50, "Budget cap cannot exceed $50.00"),
  milestone: z
    .string()
    .nullable()
    .or(
      z
        .date()
        .nullable()
        .transform((d) => (d ? d.toISOString().split("T")[0] : null)),
    ),
  cadence: z.enum(["weekly", "biweekly", "monthly"]),
});

/**
 * Complete Full Wizard Schema
 */
export const fullWizardSchema = z.object({
  name: step1Schema.shape.name,
  slug: step1Schema.shape.slug,
  description: step1Schema.shape.description,
  tags: step1Schema.shape.tags,
  icon: step1Schema.shape.icon,
  cover: step1Schema.shape.cover,
  domain: step2Schema.shape.domain,
  domain_secondary: step2Schema.shape.domain_secondary,
  scale: step2Schema.shape.scale,
  target_users: step3Schema.shape.target_users,
  accessibility: step3Schema.shape.accessibility,
  platforms: step4Schema.shape.platforms,
  stack: step4Schema.shape.stack,
  repo_full_name: step4Schema.shape.repo_full_name,
  complexity_budget: step4Schema.shape.complexity_budget,
  feature_toggles: step5Schema.shape.feature_toggles,
  ai_tasks: step5Schema.shape.ai_tasks,
  gate_strictness: step6Schema.shape.gate_strictness,
  compliance_pack: step6Schema.shape.compliance_pack,
  allow_override: step6Schema.shape.allow_override,
  retention: step6Schema.shape.retention,
  kpi_targets: step7Schema.shape.kpi_targets,
  budget_cap_usd: step7Schema.shape.budget_cap_usd,
  milestone: step7Schema.shape.milestone,
  cadence: step7Schema.shape.cadence,
});

/**
 * Validates a single wizard step and extracts inline error messages
 */
export function validateStep(
  step: number,
  payload: Partial<WizardPayload>,
): { isValid: boolean; errors: Record<string, string> } {
  let result: z.SafeParseReturnType<unknown, unknown>;

  switch (step) {
    case 1:
      result = step1Schema.safeParse({
        name: payload.name ?? "",
        slug: payload.slug ?? "",
        description: payload.description ?? "",
        tags: payload.tags ?? [],
        icon: payload.icon ?? "",
        cover: payload.cover ?? "",
      });
      break;
    case 2:
      result = step2Schema.safeParse({
        domain: payload.domain ?? "",
        domain_secondary: payload.domain_secondary ?? [],
        scale: payload.scale ?? "production",
      });
      break;
    case 3:
      result = step3Schema.safeParse({
        target_users: payload.target_users ?? [],
        accessibility: payload.accessibility ?? false,
      });
      break;
    case 4:
      result = step4Schema.safeParse({
        platforms: payload.platforms ?? [],
        stack: payload.stack ?? "ai-decides",
        repo_full_name: payload.repo_full_name ?? null,
        complexity_budget: payload.complexity_budget ?? 5,
      });
      break;
    case 5:
      result = step5Schema.safeParse({
        feature_toggles: payload.feature_toggles ?? {},
        ai_tasks: payload.ai_tasks ?? {},
      });
      break;
    case 6:
      result = step6Schema.safeParse({
        gate_strictness: payload.gate_strictness ?? "standard",
        compliance_pack: payload.compliance_pack ?? "none",
        allow_override: payload.allow_override ?? true,
        retention: payload.retention ?? "90d",
      });
      break;
    case 7:
      result = step7Schema.safeParse({
        kpi_targets: payload.kpi_targets ?? { health_min: 80, coverage_min: 75, max_critical: 0 },
        budget_cap_usd: payload.budget_cap_usd ?? 15,
        milestone: payload.milestone ?? null,
        cadence: payload.cadence ?? "weekly",
      });
      break;
    default:
      result = fullWizardSchema.safeParse(payload);
      break;
  }

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] ? String(issue.path[0]) : "global";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { isValid: false, errors };
}

/**
 * 2.4 Sanitization helper for Combobox Target Users:
 * Strips < > & " ' / \ and control characters, max 40 chars, trimmed.
 */
export function sanitizePersonaLabel(raw: string): string {
  return (
    raw
      .replace(/[<>&"'/\\]/g, "")
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F]/g, "")
      .trim()
      .slice(0, 40)
  );
}

/**
 * Auto-slug generator: transforms project name into URL-safe slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
