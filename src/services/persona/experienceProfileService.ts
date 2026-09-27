/**
 * VYRON — PERSONA-AWARE EXPERIENCE BACKEND
 * Canonical Experience Profile Service & Navigation Prioritization
 * 
 * LAW: Persona changes the experience configuration, recommended navigation,
 * default dashboards, terminology, onboarding guidance, and Copilot context.
 * Persona MUST NOT silently grant or revoke authorization.
 * Authorization remains strictly controlled by RBAC/ABAC and RLS policies.
 */

export type PersonaType = "STUDENT" | "TEACHER" | "WORKING_PROFESSIONAL" | "OTHER";

export type ComplexityLevel = "LEARNER" | "PRACTITIONER" | "ENTERPRISE";

export interface StudentContext {
  institution?: string;
  degreeProgram?: string;
  graduationYear?: string;
  capstoneDomain?: string;
  academicTrack?: "UNDERGRADUATE" | "POSTGRADUATE" | "BOOTCAMP" | "SELF_TAUGHT";
}

export interface TeacherContext {
  institution?: string;
  institutionType?: "UNIVERSITY" | "COLLEGE" | "HIGH_SCHOOL" | "ACADEMY" | "CORPORATE_TRAINING";
  department?: string;
  teachingAreas?: string[];
  courseCode?: string;
  cohortSize?: string;
}

export interface WorkingProfessionalContext {
  company?: string;
  industry?: "FINTECH" | "HEALTHTECH" | "ECOMMERCE" | "SAAS" | "AI_INFRASTRUCTURE" | "CYBERSECURITY" | "OTHER";
  roleTitle?: string;
  seniority?: "JUNIOR" | "MID_LEVEL" | "SENIOR" | "STAFF_PLUS" | "LEAD_ARCHITECT" | "VP_ENGINEERING";
  techStackFocus?: string[];
  complianceRequirements?: string[];
}

export interface OtherContext {
  primaryObjective?: string;
  customDescription?: string;
  focusAreas?: string[];
}

export interface ExperienceProfile {
  version: "1.0.0";
  updatedAt: string;
  personaType: PersonaType;
  complexityLevel: ComplexityLevel;
  primaryRole: string;
  domainFocus: string;
  
  // Specific contextual sub-models
  studentContext?: StudentContext;
  teacherContext?: TeacherContext;
  workingProfessionalContext?: WorkingProfessionalContext;
  otherContext?: OtherContext;

  // Tailored Experience Configurations (Non-Authorization)
  recommendedNavigation: string[];
  defaultDashboard: "LEARNER_OVERVIEW" | "EDUCATOR_COHORT" | "ENTERPRISE_CONTROL_PLANE" | "GENERAL_OVERVIEW";
  copilotAssistanceDensity: "DETAILED_EXPLANATORY" | "PEDAGOGICAL_STRUCTURED" | "CONCISE_PRODUCTION" | "BALANCED";
  defaultTemplates: string[];
  suggestedChecklists: string[];
}

const STORAGE_KEY = "vyron.experience_profile";

class ExperienceProfileService {
  /**
   * Derive canonical default Experience Profile for a given Persona
   */
  public createDefaultProfile(
    personaType: PersonaType,
    roleTitle: string,
    specificContext: Record<string, unknown> = {}
  ): ExperienceProfile {
    const timestamp = new Date().toISOString();

    switch (personaType) {
      case "STUDENT":
        return {
          version: "1.0.0",
          updatedAt: timestamp,
          personaType: "STUDENT",
          complexityLevel: "LEARNER",
          primaryRole: roleTitle || "Software Engineering Student",
          domainFocus: (specificContext["capstoneDomain"] as string) || "Full-Stack System Architecture",
          studentContext: {
            institution: (specificContext["institution"] as string) || "Computer Science Academy",
            degreeProgram: (specificContext["degreeProgram"] as string) || "B.S. / B.Tech Computer Science",
            graduationYear: (specificContext["graduationYear"] as string) || "2026",
            capstoneDomain: (specificContext["capstoneDomain"] as string) || "Distributed Cloud Architecture",
            academicTrack: "UNDERGRADUATE",
          },
          recommendedNavigation: ["discover", "engineering", "intelligence", "ai", "analysis"],
          defaultDashboard: "LEARNER_OVERVIEW",
          copilotAssistanceDensity: "DETAILED_EXPLANATORY",
          defaultTemplates: ["academic-srs-ieee830", "erd-relational-schema", "rest-api-contracts"],
          suggestedChecklists: [
            "Complete Software Requirements Specification (SRS)",
            "Generate Class & Sequence UML Diagrams",
            "Synthesize IEEE 830 Capstone Deliverable",
          ],
        };

      case "TEACHER":
        return {
          version: "1.0.0",
          updatedAt: timestamp,
          personaType: "TEACHER",
          complexityLevel: "PRACTITIONER",
          primaryRole: roleTitle || "Faculty / Educator",
          domainFocus: "Curriculum & Architecture Review",
          teacherContext: {
            institution: (specificContext["institution"] as string) || "University Department of Computing",
            institutionType: "UNIVERSITY",
            department: (specificContext["department"] as string) || "Computer Science & Engineering",
            teachingAreas: ["Software Engineering", "Systems Architecture", "Distributed Systems"],
            cohortSize: "40-60 Students",
          },
          recommendedNavigation: ["engineering", "analysis", "intelligence", "governance", "release"],
          defaultDashboard: "EDUCATOR_COHORT",
          copilotAssistanceDensity: "PEDAGOGICAL_STRUCTURED",
          defaultTemplates: ["grading-rubric-architecture", "peer-review-contract", "code-quality-benchmarks"],
          suggestedChecklists: [
            "Review Student Architecture Alternatives",
            "Evaluate STRIDE Security Posture",
            "Export Consolidated Grade Evaluation Matrix",
          ],
        };

      case "WORKING_PROFESSIONAL":
        return {
          version: "1.0.0",
          updatedAt: timestamp,
          personaType: "WORKING_PROFESSIONAL",
          complexityLevel: "ENTERPRISE",
          primaryRole: roleTitle || "Senior / Staff Software Architect",
          domainFocus: (specificContext["industry"] as string) || "Cloud Infrastructure & Microservices",
          workingProfessionalContext: {
            company: (specificContext["company"] as string) || "Enterprise Tech Corp",
            industry: "SAAS",
            roleTitle: roleTitle || "Staff Software Engineer",
            seniority: "STAFF_PLUS",
            techStackFocus: ["TypeScript", "Go", "PostgreSQL", "Kafka", "Kubernetes"],
            complianceRequirements: ["SOC2 Type II", "PCI-DSS 4.0", "ISO 27001"],
          },
          recommendedNavigation: ["engineering", "analysis", "release", "governance", "integrations", "system-flow"],
          defaultDashboard: "ENTERPRISE_CONTROL_PLANE",
          copilotAssistanceDensity: "CONCISE_PRODUCTION",
          defaultTemplates: ["enterprise-adr-sealed", "stride-threat-matrix", "zero-downtime-migration-plan"],
          suggestedChecklists: [
            "Validate Transitive Blast Radius across Microservices",
            "Verify Cryptographic Outbox & Idempotency Seals",
            "Audit Zero Raw SQL & RLS Isolation Gates",
          ],
        };

      case "OTHER":
      default:
        return {
          version: "1.0.0",
          updatedAt: timestamp,
          personaType: "OTHER",
          complexityLevel: "PRACTITIONER",
          primaryRole: roleTitle || "Engineering Specialist",
          domainFocus: "Systems Engineering",
          otherContext: {
            primaryObjective: "Explore Autonomous Engineering Intelligence",
            focusAreas: ["Architecture", "Code Analysis", "AI Agents"],
          },
          recommendedNavigation: ["discover", "engineering", "intelligence", "analysis", "ai"],
          defaultDashboard: "GENERAL_OVERVIEW",
          copilotAssistanceDensity: "BALANCED",
          defaultTemplates: ["system-architecture-spec", "api-contract-definition"],
          suggestedChecklists: [
            "Initialize Project Reality Baseline",
            "Trace Change Lineage & Dependencies",
          ],
        };
    }
  }

  /**
   * Persist Experience Profile to local runtime storage (client-side)
   */
  public saveLocalProfile(profile: ExperienceProfile): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        window.dispatchEvent(new CustomEvent("vyron:experience_profile_updated", { detail: profile }));
      }
    } catch (e) {
      console.warn("[ExperienceProfileService] Failed to persist local profile:", e);
    }
  }

  /**
   * Read Experience Profile from local runtime storage
   */
  public getLocalProfile(): ExperienceProfile {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw) as ExperienceProfile;
        }
      }
    } catch (e) {
      console.warn("[ExperienceProfileService] Failed to read local profile:", e);
    }
    // Fallback to student default
    return this.createDefaultProfile("STUDENT", "Student Engineer");
  }
}

export const experienceProfileService = new ExperienceProfileService();
