import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  Users,
  Layers,
  FileCheck,
  Send,
  Plus,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  School,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { FormStatusTracker } from "@/components/dashboard/FormStatusTracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getFacultyData,
  saveFacultyData,
} from "@/lib/db/faculty";
import {
  getUserForms,
  submitForm,
} from "@/lib/db/forms";
import { getProfile } from "@/lib/db/profiles";
import type { FacultyDataRow, FormSubmissionRow, UserProfileRow } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty Command Workspace — VYRON" },
      {
        name: "description",
        content: "Faculty academic portal, departmental verification, and student project evaluation.",
      },
    ],
  }),
  component: FacultyDashboardPage,
});

function FacultyDashboardPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<UserProfileRow> | null>(null);
  const [facultyData, setFacultyData] = useState<Partial<FacultyDataRow> | null>(null);
  const [activeForm, setActiveForm] = useState<FormSubmissionRow | null>(null);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [department, setDepartment] = useState("");
  const [institution, setInstitution] = useState("");
  const [designationTitle, setDesignationTitle] = useState("Associate Professor");
  const [researchAreas, setResearchAreas] = useState<string[]>([
    "Distributed Consensus",
    "Formal Software Verification",
    "Autonomous Systems",
  ]);
  const [researchInput, setResearchInput] = useState("");
  const [publicationsCount, setPublicationsCount] = useState("14");
  const [declared, setDeclared] = useState(false);

  // Check auth
  useEffect(() => {
    if (ready && !user) {
      navigate({ to: "/login" as any, replace: true });
    }
  }, [ready, user, navigate]);

  // Load faculty data from Supabase
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profRes, facRes, formsRes] = await Promise.all([
        getProfile(user.id),
        getFacultyData(user.id),
        getUserForms(user.id),
      ]);

      setProfile(profRes);
      if (facRes) {
        setFacultyData(facRes);
        setDepartment(facRes.department || "");
        setInstitution(facRes.institution || "");
        setDesignationTitle(facRes.designation_title || "Associate Professor");
        setPublicationsCount(facRes.publications_count ? String(facRes.publications_count) : "14");
        if (facRes.research_areas && facRes.research_areas.length > 0) {
          setResearchAreas(facRes.research_areas);
        }
      }

      // Find the latest faculty_profile form
      const facultyForm = formsRes.find((f) => f.form_type === "faculty_profile");
      if (facultyForm) {
        setActiveForm(facultyForm);
      }
    } catch (err) {
      console.error("[FacultyDashboard] Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  // Listen for live form update events
  useEffect(() => {
    const handleFormUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ formId: string; status: string; remarks?: string }>;
      if (activeForm && customEvent.detail.formId === activeForm.id) {
        setActiveForm((prev) =>
          prev
            ? {
                ...prev,
                status: customEvent.detail.status as any,
                admin_remarks: customEvent.detail.remarks || prev.admin_remarks || null,
              }
            : null
        );
      } else {
        loadData();
      }
    };

    window.addEventListener("vyron:form-updated", handleFormUpdated);
    return () => window.removeEventListener("vyron:form-updated", handleFormUpdated);
  }, [activeForm]);

  const handleAddResearchArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchInput.trim()) return;
    if (!researchAreas.includes(researchInput.trim())) {
      setResearchAreas([...researchAreas, researchInput.trim()]);
    }
    setResearchInput("");
  };

  const handleRemoveResearchArea = (area: string) => {
    setResearchAreas(researchAreas.filter((item) => item !== area));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!department.trim() || !institution.trim()) {
      toast.error("Please provide your department and institution.");
      return;
    }
    if (!declared) {
      toast.error("Please accept the institutional affiliation declaration.");
      return;
    }

    setSubmittingForm(true);
    try {
      const pubCountNum = parseInt(publicationsCount, 10) || 0;
      // 1. Save faculty metadata row
      await saveFacultyData(user.id, {
        department: department.trim(),
        institution: institution.trim(),
        designation_title: designationTitle,
        research_areas: researchAreas,
        publications_count: pubCountNum,
      });

      // 2. Submit official faculty verification form
      const submission = await submitForm({
        user_id: user.id,
        user_email: user.email,
        user_role: "faculty",
        form_type: "faculty_profile",
        payload: {
          department: department.trim(),
          institution: institution.trim(),
          designation_title: designationTitle,
          research_areas: researchAreas,
          publications_count: pubCountNum,
          declaration_timestamp: new Date().toISOString(),
        },
      });

      setActiveForm(submission);
      setFacultyData((prev) => ({
        ...prev,
        user_id: user.id,
        department: department.trim(),
        institution: institution.trim(),
        designation_title: designationTitle,
        research_areas: researchAreas,
        publications_count: pubCountNum,
      }));

      setIsFormOpen(false);
      toast.success("Faculty Accreditation Form Submitted!", {
        description: "Administrative Control Plane has received your departmental verification.",
      });
    } catch (err) {
      toast.error((err as Error).message || "Submission failed");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <DashboardLayout
      role="faculty"
      title="Faculty Command Workspace"
      subtitle="Supervise student capstone cohorts, verify departmental rubrics, and inspect architectural health."
      actions={
        <div className="flex items-center gap-2">
          <Link to="/app">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5 shadow-md shadow-purple-500/20 text-xs">
              <Layers className="h-3.5 w-3.5" />
              Launch Inspection Studio
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Card */}
        {user && (
          <ProfileCard
            user={user}
            profile={profile}
            designation="faculty"
            customDetails={[
              { label: "Department", value: facultyData?.department || department || "Computer Science & Engineering" },
              { label: "Institution", value: facultyData?.institution || institution || "Institute of Technology" },
              { label: "Title", value: facultyData?.designation_title || designationTitle },
              { label: "Publications", value: facultyData?.publications_count ?? publicationsCount },
            ]}
            onProfileUpdated={loadData}
          />
        )}

        {/* Official Form Verification Tracker */}
        <FormStatusTracker
          form={activeForm}
          formTypeTitle="Faculty Accreditation & Departmental Form"
          onOpenForm={() => setIsFormOpen(true)}
          onRefresh={loadData}
        />

        {/* Verification Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in-50">
            <div className="w-full max-w-xl rounded-xl border border-border/80 bg-zinc-900 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Faculty Accreditation & Departmental Verification Form
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Grants reviewer privileges, cohort rubric controls, and institutional authorization
                  </p>
                </div>
              </div>

              {activeForm?.admin_remarks && activeForm.status === "rejected" && (
                <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-xs text-red-300">
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Admin Rejection Remarks:
                  </div>
                  <div>{activeForm.admin_remarks}</div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Department Name *</label>
                    <Input
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Department of Computer Science"
                      className="h-8 text-xs bg-zinc-950"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Institution / University *</label>
                    <Input
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="h-8 text-xs bg-zinc-950"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Academic Designation</label>
                    <select
                      value={designationTitle}
                      onChange={(e) => setDesignationTitle(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-zinc-950 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Professor">Professor / Dept Chair</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Principal Investigator">Principal Investigator</option>
                      <option value="Adjunct Lecturer">Adjunct Lecturer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Publications / Papers Count</label>
                    <Input
                      value={publicationsCount}
                      onChange={(e) => setPublicationsCount(e.target.value)}
                      placeholder="e.g. 14"
                      className="h-8 text-xs bg-zinc-950"
                    />
                  </div>
                </div>

                {/* Research Areas */}
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">Research Domains & Specialties</label>
                  <div className="flex gap-2">
                    <Input
                      value={researchInput}
                      onChange={(e) => setResearchInput(e.target.value)}
                      placeholder="Add research domain (e.g. Cloud Security, LLM Heuristics)"
                      className="h-8 text-xs bg-zinc-950 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddResearchArea}
                      className="h-8 text-xs border-border/80"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {researchAreas.map((area) => (
                      <Badge
                        key={area}
                        variant="secondary"
                        className="text-[11px] py-0.5 px-2 bg-zinc-800 text-zinc-300 gap-1"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveResearchArea(area)}
                          className="hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Declaration */}
                <div className="pt-2 border-t border-border/50">
                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground select-none">
                    <input
                      type="checkbox"
                      checked={declared}
                      onChange={(e) => setDeclared(e.target.checked)}
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-purple-600 focus:ring-0"
                    />
                    <span>
                      I certify my faculty appointment, department affiliation, and authorization to
                      conduct academic reviews within the platform.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFormOpen(false)}
                    className="text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingForm || !declared}
                    className="text-xs h-8 gap-1.5 bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    {submittingForm ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Submit Accreditation Form
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Faculty Control Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Cohort Supervision */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Capstone Cohort Supervision</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review submitted architectures, inspect student test coverage, and sign off on defense milestones with cryptographic attestations.
              </p>
            </div>
            <Link to="/app">
              <Button size="sm" variant="outline" className="w-full text-xs h-8 border-border/60 gap-1.5">
                Inspect Active Projects <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Academic Rubrics & Gates */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Curriculum Rubric Engine</h4>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Architecture SRS Rubric v3.2</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Enforced
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Zero-Vulnerability Gate (CVE = 0)</span>
                  <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Minimum Coverage &gt; 80%</span>
                  <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                    Required
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Academic rubrics synchronized with studio release gates.")}
              className="w-full text-xs h-8 border-border/60"
            >
              Configure Rubrics
            </Button>
          </div>

          {/* Digital Faculty Credentials */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Academic Endorsement Seal</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cryptographically sign student SRS blueprints and capstone defense certificates with your faculty public key.
              </p>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-border/50 text-center font-mono text-[11px] text-zinc-400">
                FACULTY-SEAL-{user?.id.slice(0, 8).toUpperCase() || "DEMO"}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Faculty Endorsement Seal copied to clipboard!")}
              className="w-full text-xs h-8 border-border/60 gap-1.5"
            >
              <Download className="h-3 w-3" /> Export Digital Seal
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
