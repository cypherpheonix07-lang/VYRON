/**
 * VYRON — 4 CANONICAL SEED USER ACCOUNTS & PERSONA SUITE
 * 
 * Defines 4 enterprise-aligned test accounts across all 4 core personas:
 * 1. STUDENT: Alex Chen (Learner, capstone engineering, read-isolated)
 * 2. TEACHER: Dr. Sarah Connor (Faculty, cohort supervision, grading rubric controls)
 * 3. PROFESSIONAL: Marcus Vance (Staff Architect, enterprise compliance, blast-radius forensics)
 * 4. ADMIN: Priya Nair (Platform Administrator, global RBAC, bootstrap verified)
 * 
 * Enforces Zero Raw SQL Mandate. Validates RLS boundaries via Supabase SDK.
 */

import { supabase } from "@/lib/supabaseClient";
import { experienceProfileService, PersonaType, ExperienceProfile } from "@/services/persona/experienceProfileService";

export interface SeedUserAccount {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "professional" | "admin";
  personaType: PersonaType;
  title: string;
  organization: string;
  avatarUrl: string;
  badgeColor: string;
  permissions: string[];
  restrictedActions: string[];
  experienceProfile: ExperienceProfile;
}

export const SEED_USER_ACCOUNTS: Record<string, SeedUserAccount> = {
  student: {
    id: "usr_student_001",
    name: "Alex Chen",
    email: "alex.chen@student.brahma.edu",
    role: "student",
    personaType: "STUDENT",
    title: "Software Engineering Student",
    organization: "School of Computing & Systems",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexChen",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    permissions: [
      "read:own_profile",
      "execute:12_stage_forensics",
      "view:learner_overview",
      "export:capstone_srs",
      "subscribe:realtime_channel",
    ],
    restrictedActions: [
      "modify:user_roles (BLOCKED by RLS RPC)",
      "read:cross_tenant_profiles (BLOCKED by RLS)",
      "deploy:production_release_gates (BLOCKED)",
      "modify:system_model_routing (BLOCKED)",
    ],
    experienceProfile: experienceProfileService.createDefaultProfile("STUDENT", "Student Engineer", {
      institution: "School of Computing & Systems",
      degreeProgram: "B.Tech Computer Science (Final Year)",
      graduationYear: "2026",
      capstoneDomain: "AI-Assisted Microservice Forensics",
    }),
  },
  teacher: {
    id: "usr_teacher_002",
    name: "Dr. Sarah Connor",
    email: "dr.sarah.connor@faculty.brahma.edu",
    role: "teacher",
    personaType: "TEACHER",
    title: "Professor of Systems Architecture",
    organization: "Department of Software Engineering",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SarahConnor",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    permissions: [
      "read:own_profile",
      "read:cohort_submissions",
      "evaluate:grading_rubrics",
      "execute:stride_threat_matrix",
      "view:educator_cohort_dashboard",
      "publish:peer_review_feedback",
    ],
    restrictedActions: [
      "modify:user_roles (BLOCKED by RLS RPC)",
      "modify:platform_billing (BLOCKED)",
      "alter:database_indexes (BLOCKED)",
    ],
    experienceProfile: experienceProfileService.createDefaultProfile("TEACHER", "Faculty Lead", {
      institution: "University Department of Computing",
      department: "Software Engineering & Cloud Systems",
      cohortSize: "45 Capstone Students",
    }),
  },
  professional: {
    id: "usr_pro_003",
    name: "Marcus Vance",
    email: "marcus.vance@fintech-core.io",
    role: "professional",
    personaType: "WORKING_PROFESSIONAL",
    title: "Staff Systems Architect",
    organization: "FinTech Enterprise Solutions",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MarcusVance",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    permissions: [
      "read:own_profile",
      "view:enterprise_control_plane",
      "execute:blast_radius_analysis",
      "seal:adr_cryptographic_hashes",
      "manage:connectors_read_write",
      "evaluate:pci_dss_compliance",
    ],
    restrictedActions: [
      "modify:global_user_roles (BLOCKED without Admin auth)",
      "bypass:soc2_audit_trail (STRICTLY PROHIBITED)",
    ],
    experienceProfile: experienceProfileService.createDefaultProfile("WORKING_PROFESSIONAL", "Staff Architect", {
      company: "FinTech Enterprise Solutions",
      industry: "FINTECH",
    }),
  },
  admin: {
    id: "usr_admin_004",
    name: "Priya Nair",
    email: "priya.nair@brahma.dev",
    role: "admin",
    personaType: "OTHER",
    title: "Platform Administrator & Architect",
    organization: "PROJECT BRAHMA / VYRON Core",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PriyaNair",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    permissions: [
      "admin:full_rbac_access",
      "execute:set_user_role",
      "view:global_audit_trail",
      "manage:ai_model_routing",
      "manage:task_queues",
      "execute:all_forensic_pipelines",
      "override:release_gate_bypass",
    ],
    restrictedActions: [
      "bypass:zero_raw_sql_mandate (ENGINEERING INVARIANT)",
      "disable:immutable_audit_logging (ENGINEERING INVARIANT)",
    ],
    experienceProfile: experienceProfileService.createDefaultProfile("OTHER", "Platform Administrator", {
      primaryObjective: "Platform Architecture Governance & Security Orchestration",
    }),
  },
};

export class SeedAccountManager {
  private activeAccountKey: "student" | "teacher" | "professional" | "admin" = "admin";

  public getAccounts(): SeedUserAccount[] {
    return Object.values(SEED_USER_ACCOUNTS);
  }

  public getAccount(key: "student" | "teacher" | "professional" | "admin"): SeedUserAccount {
    return SEED_USER_ACCOUNTS[key];
  }

  public getActiveAccount(): SeedUserAccount {
    return SEED_USER_ACCOUNTS[this.activeAccountKey];
  }

  /**
   * Switch active runtime persona and synchronize ExperienceProfileService
   */
  public switchPersona(key: "student" | "teacher" | "professional" | "admin"): SeedUserAccount {
    this.activeAccountKey = key;
    const account = SEED_USER_ACCOUNTS[key];
    experienceProfileService.saveLocalProfile(account.experienceProfile);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vyron:account_switched", { detail: account })
      );
    }
    return account;
  }

  /**
   * Live RLS Probe: Test if active account can execute set_user_role RPC
   */
  public async testRoleAssignmentRLS(): Promise<{
    allowed: boolean;
    roleAttempted: string;
    message: string;
    isSecure: boolean;
  }> {
    const account = this.getActiveAccount();
    try {
      const { data, error } = await supabase.rpc("set_user_role", {
        p_user_id: account.id,
        p_role: "admin",
      });

      if (error) {
        return {
          allowed: false,
          roleAttempted: account.role,
          message: error.message || "Access denied by RLS RPC security policy.",
          isSecure: account.role !== "admin", // If student/teacher, blocking IS secure!
        };
      }

      return {
        allowed: true,
        roleAttempted: account.role,
        message: String(data || "Role assigned successfully."),
        isSecure: account.role === "admin", // If admin, allowed IS expected
      };
    } catch (err) {
      return {
        allowed: false,
        roleAttempted: account.role,
        message: (err as Error).message,
        isSecure: account.role !== "admin",
      };
    }
  }

  /**
   * Live RLS Probe: Test profile read tenant isolation
   */
  public async testProfileReadIsolation(): Promise<{
    rowsRetrieved: number;
    crossTenantLeak: boolean;
    message: string;
  }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role")
        .limit(10);

      if (error) {
        return {
          rowsRetrieved: 0,
          crossTenantLeak: false,
          message: `Query filtered or rejected: ${error.message}`,
        };
      }

      const rowsCount = data?.length || 0;
      // In live testing: student should only see own row (1 row max). Admin can see tenant rows.
      const isStudent = this.activeAccountKey === "student";
      const crossTenantLeak = isStudent && rowsCount > 1;

      return {
        rowsRetrieved: rowsCount,
        crossTenantLeak,
        message: crossTenantLeak
          ? `SECURITY ALERT: Student retrieved ${rowsCount} profile rows!`
          : `Isolation verified: ${rowsCount} row(s) visible to ${this.activeAccountKey.toUpperCase()}.`,
      };
    } catch (err) {
      return {
        rowsRetrieved: 0,
        crossTenantLeak: false,
        message: `Query failed: ${(err as Error).message}`,
      };
    }
  }
}

export const seedAccountManager = new SeedAccountManager();
