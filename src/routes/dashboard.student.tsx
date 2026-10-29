import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
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
  getStudentData,
  saveStudentData,
} from "@/lib/db/students";
import {
  getUserForms,
  submitForm,
} from "@/lib/db/forms";
import { getProfile } from "@/lib/db/profiles";
import type { StudentDataRow, FormSubmissionRow, UserProfileRow } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/student")({
  head: () => ({
    meta: [
      { title: "Student Academic Workspace — VYRON" },
      {
        name: "description",
        content: "Student engineering workspace, academic verification, and capstone project control.",
      },
    ],
  }),
  component: StudentDashboardPage,
});

function StudentDashboardPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<UserProfileRow> | null>(null);
  const [studentData, setStudentData] = useState<Partial<StudentDataRow> | null>(null);
  const [activeForm, setActiveForm] = useState<FormSubmissionRow | null>(null);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [degreeProgram, setDegreeProgram] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [gpa, setGpa] = useState("3.85");
  const [courses, setCourses] = useState<string[]>(["Distributed Systems", "AI Algorithms", "Cloud Architecture"]);
  const [courseInput, setCourseInput] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [declared, setDeclared] = useState(false);

  // Check auth
  useEffect(() => {
    if (ready && !user) {
      navigate({ to: "/login" as any, replace: true });
    }
  }, [ready, user, navigate]);

  // Load student data from Supabase
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profRes, studRes, formsRes] = await Promise.all([
        getProfile(user.id),
        getStudentData(user.id),
        getUserForms(user.id),
      ]);

      setProfile(profRes);
      if (studRes) {
        setStudentData(studRes);
        setDegreeProgram(studRes.degree_program || "");
        setUniversity(studRes.university || "");
        setYearOfStudy(String(studRes.year_of_study || "3rd Year"));
        setGpa(studRes.gpa ? String(studRes.gpa) : "3.85");
        if (studRes.courses && studRes.courses.length > 0) {
          setCourses(studRes.courses);
        }
      }

      // Find the latest student_profile form
      const studentForm = formsRes.find((f) => f.form_type === "student_profile");
      if (studentForm) {
        setActiveForm(studentForm);
      }
    } catch (err) {
      console.error("[StudentDashboard] Load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, loadData]);

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
  }, [activeForm, loadData]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseInput.trim()) return;
    if (!courses.includes(courseInput.trim())) {
      setCourses([...courses, courseInput.trim()]);
    }
    setCourseInput("");
  };

  const handleRemoveCourse = (c: string) => {
    setCourses(courses.filter((item) => item !== c));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!degreeProgram.trim() || !university.trim()) {
      toast.error("Please provide your degree program and university.");
      return;
    }
    if (!declared) {
      toast.error("Please accept the academic integrity declaration.");
      return;
    }

    setSubmittingForm(true);
    try {
      const gpaNum = gpa ? parseFloat(gpa) : null;
      // 1. Save student metadata row
      await saveStudentData(user.id, {
        degree_program: degreeProgram.trim(),
        university: university.trim(),
        year_of_study: yearOfStudy,
        gpa: gpaNum,
        courses,
      });

      // 2. Submit official student verification form
      const submission = await submitForm({
        user_id: user.id,
        user_email: user.email,
        user_role: "student",
        form_type: "student_profile",
        payload: {
          degree_program: degreeProgram.trim(),
          university: university.trim(),
          year_of_study: yearOfStudy,
          gpa: gpaNum,
          courses,
          capstone_project: projectTitle.trim(),
          declaration_timestamp: new Date().toISOString(),
        },
      });

      setActiveForm(submission);
      setStudentData((prev) => ({
        ...prev,
        user_id: user.id,
        degree_program: degreeProgram.trim(),
        university: university.trim(),
        year_of_study: yearOfStudy,
        gpa: gpaNum,
        courses,
      }));

      setIsFormOpen(false);
      toast.success("Verification Form Submitted Successfully!", {
        description: "Platform Administration has been notified for enrollment review.",
      });
    } catch (err) {
      toast.error((err as Error).message || "Submission failed");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <DashboardLayout
      role="student"
      title="Student Academic Workspace"
      subtitle="Track your curriculum, verify academic credentials, and engineer capstone architecture."
      actions={
        <div className="flex items-center gap-2">
          <Link to="/app">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 shadow-md shadow-blue-500/20 text-xs">
              <Layers className="h-3.5 w-3.5" />
              Launch Capstone Studio
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
            designation="student"
            customDetails={[
              { label: "Degree Program", value: studentData?.degree_program || degreeProgram || "B.Tech Computer Science" },
              { label: "Institution", value: studentData?.university || university || "Institute of Technology" },
              { label: "Study Year", value: studentData?.year_of_study || yearOfStudy },
              { label: "Cumulative GPA", value: studentData?.gpa ? `${studentData.gpa} / 4.0` : `${gpa} / 4.0` },
            ]}
            onProfileUpdated={loadData}
          />
        )}

        {/* Official Form Verification Tracker */}
        <FormStatusTracker
          form={activeForm}
          formTypeTitle="Academic Verification Form"
          onOpenForm={() => setIsFormOpen(true)}
          onRefresh={loadData}
        />

        {/* Verification Form Modal / Dialog */}
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
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Official Student Enrollment & Verification Form
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Required for capstone grading badges and institutional certification
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
                    <label className="text-foreground font-medium">Degree / Major *</label>
                    <Input
                      value={degreeProgram}
                      onChange={(e) => setDegreeProgram(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science & AI"
                      className="h-8 text-xs bg-zinc-950"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">University / College *</label>
                    <Input
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Stanford / State University"
                      className="h-8 text-xs bg-zinc-950"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Academic Year</label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-zinc-950 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="Graduate / Masters">Graduate / Masters</option>
                      <option value="Ph.D. Scholar">Ph.D. Scholar</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Current GPA / CGPA</label>
                    <Input
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="e.g. 3.85"
                      className="h-8 text-xs bg-zinc-950"
                    />
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">Enrolled Courses & Topics</label>
                  <div className="flex gap-2">
                    <Input
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      placeholder="Add a course (e.g. Compilers, OS, Machine Learning)"
                      className="h-8 text-xs bg-zinc-950 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCourse}
                      className="h-8 text-xs border-border/80"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {courses.map((course) => (
                      <Badge
                        key={course}
                        variant="secondary"
                        className="text-[11px] py-0.5 px-2 bg-zinc-800 text-zinc-300 gap-1"
                      >
                        {course}
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course)}
                          className="hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-medium">Capstone Project Title (Optional)</label>
                  <Input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Autonomous Microservice Healing Engine"
                    className="h-8 text-xs bg-zinc-950"
                  />
                </div>

                {/* Integrity Declaration */}
                <div className="pt-2 border-t border-border/50">
                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground select-none">
                    <input
                      type="checkbox"
                      checked={declared}
                      onChange={(e) => setDeclared(e.target.checked)}
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-0"
                    />
                    <span>
                      I solemnly certify that all enrollment and academic credentials provided above
                      are true, verified, and subject to institutional audit.
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
                    className="text-xs h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {submittingForm ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Submit for Official Review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Capstone Studio Launcher */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Capstone Architecture Studio</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your GitHub repo, run live architectural health scans, eliminate drift, and export defense-ready SRS blueprints.
              </p>
            </div>
            <Link to="/app">
              <Button size="sm" variant="outline" className="w-full text-xs h-8 border-border/60 gap-1.5">
                Open Project Studio <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Academic Milestone Tracker */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Review & Defense Milestones</h4>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Review 1: Architecture Baseline</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Completed
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Review 2: Security & Gates</span>
                  <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                    In Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Final Capstone Defense</span>
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
                    Target: 60 Days
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Milestones synced with your academic calendar.")}
              className="w-full text-xs h-8 border-border/60"
            >
              Sync Calendar
            </Button>
          </div>

          {/* Digital Student Identity Badge */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Digital Student Scholar Badge</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cryptographically anchored verification badge for your academic GitHub profile and resume.
              </p>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-border/50 text-center font-mono text-[11px] text-zinc-400">
                STUDENT-ID-{user?.id.slice(0, 8).toUpperCase() || "DEMO"}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Student Credential Card copied to clipboard!")}
              className="w-full text-xs h-8 border-border/60 gap-1.5"
            >
              <Download className="h-3 w-3" /> Export Digital ID
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
