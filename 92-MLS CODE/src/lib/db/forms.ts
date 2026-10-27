/**
 * VYRON / BRAHMA — FORMS & APPROVAL WORKFLOW SERVICE
 * Strictly ZERO Raw SQL: Enforces Supabase client query builders exclusively.
 */

import { supabase } from "@/lib/supabaseClient";
import type { FormSubmissionRow, FormStatus, FormType, Designation } from "./types";

const LOCAL_FORMS_KEY = "vyron_forms_submissions_v1";

function getLocalForms(): FormSubmissionRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_FORMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalForms(forms: FormSubmissionRow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_FORMS_KEY, JSON.stringify(forms));
  } catch (err) {
    console.warn("[saveLocalForms] LocalStorage write failed:", err);
  }
}

// Seed initial forms if none exist
if (typeof window !== "undefined") {
  const existing = getLocalForms();
  if (existing.length === 0) {
    const seedForms: FormSubmissionRow[] = [
      {
        form_id: "form-seed-01",
        id: "form-seed-01",
        created_by: "demo-student-01",
        user_name: "Aarav Sharma",
        user_email: "aarav.sharma@nit.edu",
        user_designation: "student",
        form_type: "student_profile",
        status: "pending" as unknown as FormStatus,
        form_data: {
          institution: "National Institute of Technology Trichy",
          course: "B.Tech Computer Science",
          year_of_study: 3,
          subjects: ["Compiler Design", "Distributed Computing"],
          gpa: 8.9,
        },
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        form_id: "form-seed-02",
        id: "form-seed-02",
        created_by: "demo-faculty-01",
        user_name: "Dr. Meera Nambiar",
        user_email: "meera.nambiar@iiit.ac.in",
        user_designation: "faculty",
        form_type: "faculty_profile",
        status: "approved",
        form_data: {
          institution: "IIIT Hyderabad",
          department: "Center for Security, Theory and Algorithmic Research",
          designation_title: "Associate Professor",
          publications_count: 19,
        },
        reviewed_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        reviewer_id: "admin-root-01",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        form_id: "form-seed-03",
        id: "form-seed-03",
        created_by: "demo-pro-01",
        user_name: "Vikramaditya Rao",
        user_email: "vikram@fintech-vault.io",
        user_designation: "professional",
        form_type: "professional_profile",
        status: "pending" as unknown as FormStatus,
        form_data: {
          company: "VaultLedger Infrastructure Ltd",
          job_title: "Staff SRE",
          years_experience: 9,
          skills: ["Terraform", "PostgreSQL", "Kubernetes", "RLS"],
        },
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
    saveLocalForms(seedForms);
  }
}

export type SubmitFormOptions = {
  user_id: string;
  user_email?: string;
  user_role?: string;
  form_type: FormType;
  payload?: Record<string, unknown>;
  form_data?: Record<string, unknown>;
};

export async function submitForm(
  userIdOrOptions: string | SubmitFormOptions,
  formTypeParam?: FormType,
  formDataParam?: Record<string, unknown>,
  userInfoParam?: { name?: string; email?: string; designation?: string }
): Promise<FormSubmissionRow> {
  let userId: string;
  let formType: FormType;
  let formData: Record<string, unknown>;
  let userEmail = "member@brahma.dev";
  let userName = "Workspace Member";
  let userRole: Designation = "student";

  if (typeof userIdOrOptions === "object" && "user_id" in userIdOrOptions) {
    userId = userIdOrOptions.user_id;
    formType = userIdOrOptions.form_type;
    formData = userIdOrOptions.payload || userIdOrOptions.form_data || {};
    if (userIdOrOptions.user_email) userEmail = userIdOrOptions.user_email;
    if (userIdOrOptions.user_role) userRole = userIdOrOptions.user_role as Designation;
  } else {
    userId = userIdOrOptions;
    formType = formTypeParam!;
    formData = formDataParam || {};
    if (userInfoParam?.email) userEmail = userInfoParam.email;
    if (userInfoParam?.name) userName = userInfoParam.name;
    if (userInfoParam?.designation) userRole = userInfoParam.designation as Designation;
  }

  const formId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const newRow: FormSubmissionRow = {
    form_id: formId,
    id: formId,
    created_by: userId,
    user_name: userName,
    user_email: userEmail,
    user_designation: userRole,
    user_role: userRole,
    form_type: formType,
    form_data: formData,
    payload: formData,
    status: "submitted",
    created_at: now,
    submitted_at: now,
  };

  try {
    const { data, error } = await supabase
      .from("forms")
      .insert({
        form_id: formId,
        created_by: userId,
        form_type: formType,
        form_data: formData,
        status: "submitted",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("[submitForm] Remote write warning (caching locally):", error.message);
    }
    if (data) {
      newRow.form_id = data.form_id || formId;
      newRow.id = data.form_id || formId;
    }
  } catch {
    // fallback
  }

  const local = getLocalForms();
  local.unshift(newRow);
  saveLocalForms(local);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vyron:form-updated", { detail: { formId, status: "submitted" } }));
    window.dispatchEvent(new CustomEvent("vyron:form_submitted", { detail: newRow }));
  }

  return newRow;
}

export async function getUserForms(userId: string): Promise<FormSubmissionRow[]> {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((row: any) => ({
        form_id: row.form_id || row.id,
        id: row.form_id || row.id,
        created_by: row.created_by,
        form_type: row.form_type,
        form_data: row.form_data || {},
        payload: row.form_data || {},
        status: row.status,
        rejection_reason: row.rejection_reason,
        admin_remarks: row.rejection_reason,
        reviewer_id: row.reviewer_id,
        reviewed_at: row.reviewed_at,
        created_at: row.created_at,
        submitted_at: row.created_at,
        user_email: row.user_email || "",
      }));
    }

    // Fallback to local store
    const local = getLocalForms();
    return local
      .filter((f) => f.created_by === userId)
      .map((row) => ({
        ...row,
        id: row.form_id || row.id,
        payload: row.form_data || row.payload || {},
        admin_remarks: row.rejection_reason || row.admin_remarks,
        submitted_at: row.created_at || row.submitted_at,
      }));
  } catch {
    const local = getLocalForms();
    return local
      .filter((f) => f.created_by === userId)
      .map((row) => ({
        ...row,
        id: row.form_id || row.id,
        payload: row.form_data || row.payload || {},
        admin_remarks: row.rejection_reason || row.admin_remarks,
        submitted_at: row.created_at || row.submitted_at,
      }));
  }
}

export async function getAllForms(filters?: {
  status?: FormStatus | "all";
  formType?: FormType | "all";
}): Promise<FormSubmissionRow[]> {
  try {
    let query = supabase
      .from("forms")
      .select("*, profiles:created_by (full_name, email, designation)")
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters?.formType && filters.formType !== "all") {
      query = query.eq("form_type", filters.formType);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((row: any) => ({
        form_id: row.form_id || row.id,
        id: row.form_id || row.id,
        created_by: row.created_by,
        form_type: row.form_type,
        form_data: row.form_data || {},
        payload: row.form_data || {},
        status: row.status,
        rejection_reason: row.rejection_reason,
        admin_remarks: row.rejection_reason,
        reviewer_id: row.reviewer_id,
        reviewed_at: row.reviewed_at,
        created_at: row.created_at,
        submitted_at: row.created_at,
        user_name: row.profiles?.full_name || "Workspace Member",
        user_email: row.profiles?.email || row.user_email || "user@brahma.dev",
        user_designation: row.profiles?.designation || row.user_designation || "student",
        user_role: row.profiles?.designation || row.user_designation || "student",
      }));
    }

    // Local fallback
    let local = getLocalForms().map((row) => ({
      ...row,
      id: row.form_id || row.id,
      payload: row.form_data || row.payload || {},
      admin_remarks: row.rejection_reason || row.admin_remarks,
      submitted_at: row.created_at || row.submitted_at,
      user_role: row.user_designation || row.user_role || "student",
    }));

    if (filters?.status && filters.status !== "all") {
      local = local.filter((f) => f.status === filters.status);
    }
    if (filters?.formType && filters.formType !== "all") {
      local = local.filter((f) => f.form_type === filters.formType);
    }
    return local;
  } catch {
    let local = getLocalForms().map((row) => ({
      ...row,
      id: row.form_id || row.id,
      payload: row.form_data || row.payload || {},
      admin_remarks: row.rejection_reason || row.admin_remarks,
      submitted_at: row.created_at || row.submitted_at,
      user_role: row.user_designation || row.user_role || "student",
    }));

    if (filters?.status && filters.status !== "all") {
      local = local.filter((f) => f.status === filters.status);
    }
    if (filters?.formType && filters.formType !== "all") {
      local = local.filter((f) => f.form_type === filters.formType);
    }
    return local;
  }
}

export async function updateFormStatus(
  formId: string,
  status: FormStatus,
  reviewerIdOrRemarks?: string,
  reviewerEmail?: string,
  remarksParam?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();
    let reviewerId = "admin-root-01";
    let remarks = remarksParam;

    if (remarksParam !== undefined) {
      reviewerId = reviewerIdOrRemarks || "admin-root-01";
      remarks = remarksParam;
    } else {
      if (status === "rejected") {
        remarks = reviewerIdOrRemarks;
      } else {
        reviewerId = reviewerIdOrRemarks || "admin-root-01";
      }
    }

    const payload = {
      status,
      rejection_reason: remarks || null,
      admin_remarks: remarks || null,
      reviewer_id: reviewerId,
      reviewed_at: now,
      updated_at: now,
    };

    const { error } = await supabase
      .from("forms")
      .update({
        status,
        rejection_reason: remarks || null,
        reviewer_id: reviewerId,
        reviewed_at: now,
        updated_at: now,
      })
      .eq("form_id", formId);

    if (error) {
      console.warn("[updateFormStatus] Remote update warning (applying locally):", error.message);
    }

    // Update in local store
    const local = getLocalForms();
    const idx = local.findIndex((f) => f.form_id === formId || f.id === formId);
    if (idx >= 0) {
      local[idx] = {
        ...local[idx]!,
        ...payload,
      };
      saveLocalForms(local);
    }

    // Dispatch realtime events for both listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vyron:form-updated", {
          detail: { formId, status, remarks },
        })
      );
      window.dispatchEvent(
        new CustomEvent("vyron:form_status_changed", {
          detail: { formId, status, rejectionReason: remarks, reviewedAt: now },
        })
      );
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update form status",
    };
  }
}
