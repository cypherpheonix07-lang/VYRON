/**
 * VYRON / BRAHMA — DATABASE INTERFACES & SCHEMAS
 * Typed data layer for Student, Faculty, Professional, Forms, and Admin Control Plane.
 * Strictly ZERO Raw SQL: Enforces Supabase client query builder conventions.
 */

export type Designation = "student" | "faculty" | "professional" | "admin";

export type FormStatus = "draft" | "submitted" | "approved" | "rejected" | "pending";

export type FormType = "student_profile" | "faculty_profile" | "professional_profile";

export interface UserProfileRow {
  id: string;
  email: string;
  full_name?: string | undefined;
  role?: string | undefined;
  designation?: Designation | string | null | undefined;
  avatar_url?: string | null | undefined;
  institution?: string | null | undefined;
  company?: string | null | undefined;
  department?: string | null | undefined;
  created_at: string;
  updated_at?: string | null | undefined;
  onboarded?: boolean | undefined;
}

export interface StudentDataRow {
  student_id?: string | undefined;
  user_id: string;
  institution?: string | undefined;
  university?: string | undefined;
  course?: string | undefined;
  degree_program?: string | undefined;
  year_of_study?: number | string | undefined;
  subjects?: string[] | undefined;
  courses?: string[] | undefined;
  gpa?: number | null | undefined;
  portfolio_url?: string | null | undefined;
  created_at?: string | undefined;
  updated_at?: string | null | undefined;
}

export interface FacultyDataRow {
  faculty_id?: string | undefined;
  user_id: string;
  institution?: string | undefined;
  department?: string | undefined;
  designation_title?: string | undefined;
  subjects_taught?: string[] | undefined;
  research_areas?: string[] | undefined;
  publications_count?: number | undefined;
  created_at?: string | undefined;
  updated_at?: string | null | undefined;
}

export interface ProfessionalDataRow {
  professional_id?: string | undefined;
  user_id: string;
  company?: string | undefined;
  job_title?: string | undefined;
  industry?: string | undefined;
  years_experience?: number | undefined;
  skills?: string[] | undefined;
  linkedin_url?: string | null | undefined;
  certifications?: Array<{
    name: string;
    issuer?: string | undefined;
    year?: string | number | undefined;
  }> | string[] | undefined;
  created_at?: string | undefined;
  updated_at?: string | null | undefined;
}

export interface FormSubmissionRow {
  form_id: string;
  id: string;
  created_by: string;
  form_type: FormType;
  form_data: Record<string, unknown>;
  payload?: Record<string, unknown> | undefined;
  status: FormStatus;
  rejection_reason?: string | null | undefined;
  admin_remarks?: string | null | undefined;
  reviewer_id?: string | null | undefined;
  reviewed_at?: string | null | undefined;
  created_at: string;
  submitted_at?: string | undefined;
  updated_at?: string | null | undefined;
  // Joined virtual attributes
  user_email: string;
  user_name?: string | undefined;
  user_designation?: Designation | undefined;
  user_role?: string | undefined;
}

export interface AdminLogEntry {
  log_id?: string | undefined;
  id?: string | undefined;
  admin_id?: string | undefined;
  admin_email?: string | undefined;
  action_type?: string | undefined;
  action?: string | undefined;
  target_user_id?: string | null | undefined;
  target_id?: string | null | undefined;
  details?: Record<string, unknown> | null | undefined;
  timestamp?: string | undefined;
  created_at?: string | undefined;
  ip_address?: string | null | undefined;
}

export interface PlatformMetrics {
  totalUsers?: number | undefined;
  total_users?: number | undefined;
  studentsCount?: number | undefined;
  students_count?: number | undefined;
  facultyCount?: number | undefined;
  faculty_count?: number | undefined;
  professionalsCount?: number | undefined;
  professionals_count?: number | undefined;
  formsPending?: number | undefined;
  forms_pending?: number | undefined;
  formsApproved?: number | undefined;
  forms_approved?: number | undefined;
  formsRejected?: number | undefined;
  forms_rejected?: number | undefined;
  forms_total?: number | undefined;
  platformStatus?: "operational" | "degraded" | undefined;
}
