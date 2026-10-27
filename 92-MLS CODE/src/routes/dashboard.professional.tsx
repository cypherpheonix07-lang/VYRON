import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Building,
  Award,
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
  ShieldCheck,
  Cpu,
  TrendingUp,
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
  getProfessionalData,
  saveProfessionalData,
} from "@/lib/db/professionals";
import {
  getUserForms,
  submitForm,
} from "@/lib/db/forms";
import { getProfile } from "@/lib/db/profiles";
import type { ProfessionalDataRow, FormSubmissionRow, UserProfileRow } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/professional")({
  head: () => ({
    meta: [
      { title: "Working Professional Workspace — VYRON" },
      {
        name: "description",
        content: "Professional engineering command hub, enterprise verification, and production release readiness.",
      },
    ],
  }),
  component: ProfessionalDashboardPage,
});

function ProfessionalDashboardPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<UserProfileRow> | null>(null);
  const [professionalData, setProfessionalData] = useState<Partial<ProfessionalDataRow> | null>(null);
  const [activeForm, setActiveForm] = useState<FormSubmissionRow | null>(null);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("Enterprise SaaS / Cloud");
  const [yearsExperience, setYearsExperience] = useState("5-8 Years");
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "PostgreSQL",
    "Kubernetes",
    "Event-Driven Architecture",
    "Terraform",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([
    "AWS Certified Solutions Architect",
  ]);
  const [certInput, setCertInput] = useState("");
  const [declared, setDeclared] = useState(false);

  // Check auth
  useEffect(() => {
    if (ready && !user) {
      navigate({ to: "/login" as any, replace: true });
    }
  }, [ready, user, navigate]);

  // Load professional data from Supabase
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profRes, proDataRes, formsRes] = await Promise.all([
        getProfile(user.id),
        getProfessionalData(user.id),
        getUserForms(user.id),
      ]);

      setProfile(profRes);
      if (proDataRes) {
        setProfessionalData(proDataRes);
        setCompany(proDataRes.company || "");
        setJobTitle(proDataRes.job_title || "");
        setIndustry(proDataRes.industry || "Enterprise SaaS / Cloud");
        setYearsExperience(
          proDataRes.years_experience ? `${proDataRes.years_experience} Years` : "5-8 Years"
        );
        if (proDataRes.skills && proDataRes.skills.length > 0) {
          setSkills(proDataRes.skills);
        }
        if (proDataRes.certifications && proDataRes.certifications.length > 0) {
          const names = proDataRes.certifications
            .map((c: any) => (typeof c === "string" ? c : c.name || ""))
            .filter(Boolean);
          if (names.length > 0) setCertifications(names);
        }
      }

      // Find the latest professional_profile form
      const proForm = formsRes.find((f) => f.form_type === "professional_profile");
      if (proForm) {
        setActiveForm(proForm);
      }
    } catch (err) {
      console.error("[ProfessionalDashboard] Load error:", err);
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

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    if (!certifications.includes(certInput.trim())) {
      setCertifications([...certifications, certInput.trim()]);
    }
    setCertInput("");
  };

  const handleRemoveCert = (c: string) => {
    setCertifications(certifications.filter((item) => item !== c));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!company.trim() || !jobTitle.trim()) {
      toast.error("Please provide your company name and job title.");
      return;
    }
    if (!declared) {
      toast.error("Please accept the industry verification declaration.");
      return;
    }

    setSubmittingForm(true);
    try {
      const expNum = parseInt(yearsExperience, 10) || 5;
      // 1. Save professional metadata row
      await saveProfessionalData(user.id, {
        company: company.trim(),
        job_title: jobTitle.trim(),
        industry,
        years_experience: expNum,
        skills,
        certifications,
      });

      // 2. Submit official professional verification form
      const submission = await submitForm({
        user_id: user.id,
        user_email: user.email,
        user_role: "professional",
        form_type: "professional_profile",
        payload: {
          company: company.trim(),
          job_title: jobTitle.trim(),
          industry,
          years_experience: expNum,
          skills,
          certifications,
          declaration_timestamp: new Date().toISOString(),
        },
      });

      setActiveForm(submission);
      setProfessionalData((prev) => ({
        ...prev,
        user_id: user.id,
        company: company.trim(),
        job_title: jobTitle.trim(),
        industry,
        years_experience: expNum,
        skills,
        certifications,
      }));

      setIsFormOpen(false);
      toast.success("Professional Verification Form Submitted!", {
        description: "Administrative Control Plane has received your enterprise verification.",
      });
    } catch (err) {
      toast.error((err as Error).message || "Submission failed");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <DashboardLayout
      role="professional"
      title="Working Professional Workspace"
      subtitle="Architect scalable cloud microservices, enforce enterprise release gates, and manage compliance."
      actions={
        <div className="flex items-center gap-2">
          <Link to="/app">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow-md shadow-emerald-500/20 text-xs">
              <Layers className="h-3.5 w-3.5" />
              Launch Enterprise Studio
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
            designation="professional"
            customDetails={[
              { label: "Company", value: professionalData?.company || company || "Global Cloud Systems" },
              { label: "Job Title", value: professionalData?.job_title || jobTitle || "Staff Cloud Architect" },
              { label: "Industry", value: professionalData?.industry || industry },
              { label: "Experience", value: professionalData?.years_experience ? `${professionalData.years_experience} Years` : yearsExperience },
            ]}
            onProfileUpdated={loadData}
          />
        )}

        {/* Official Form Verification Tracker */}
        <FormStatusTracker
          form={activeForm}
          formTypeTitle="Industry Accreditation & Enterprise Verification Form"
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
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Industry Accreditation & Enterprise Verification Form
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Unlocks enterprise production blueprints, compliance gates, and verified architectural badges
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
                    <label className="text-foreground font-medium">Company / Employer *</label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Cloud Corp / Stripe / Google"
                      className="h-8 text-xs bg-zinc-950"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Job Title / Role *</label>
                    <Input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Principal Systems Architect"
                      className="h-8 text-xs bg-zinc-950"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Industry Domain</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-zinc-950 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Enterprise SaaS / Cloud">Enterprise SaaS / Cloud</option>
                      <option value="FinTech / Banking Infrastructure">FinTech / Banking Infrastructure</option>
                      <option value="HealthTech / BioInformatics">HealthTech / BioInformatics</option>
                      <option value="Cybersecurity / DevSecOps">Cybersecurity / DevSecOps</option>
                      <option value="AI / Machine Learning Systems">AI / Machine Learning Systems</option>
                      <option value="E-Commerce & High-Scale Retail">E-Commerce & High-Scale Retail</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground font-medium">Experience Level</label>
                    <select
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-zinc-950 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="1-3 Years">Early Career (1-3 Years)</option>
                      <option value="3-5 Years">Mid-Level (3-5 Years)</option>
                      <option value="5-8 Years">Senior (5-8 Years)</option>
                      <option value="8-12 Years">Staff / Lead (8-12 Years)</option>
                      <option value="12+ Years">Principal / Fellow (12+ Years)</option>
                    </select>
                  </div>
                </div>

                {/* Core Skills */}
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">Core Technical Stack & Competencies</label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add stack competency (e.g. Go, Rust, Kafka, gRPC)"
                      className="h-8 text-xs bg-zinc-950 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSkill}
                      className="h-8 text-xs border-border/80"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-[11px] py-0.5 px-2 bg-zinc-800 text-zinc-300 gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">Professional Certifications</label>
                  <div className="flex gap-2">
                    <Input
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      placeholder="Add certification (e.g. CKS, CISSP, AWS Pro)"
                      className="h-8 text-xs bg-zinc-950 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCert}
                      className="h-8 text-xs border-border/80"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {certifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant="secondary"
                        className="text-[11px] py-0.5 px-2 bg-zinc-800 text-zinc-300 gap-1"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => handleRemoveCert(cert)}
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
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-0"
                    />
                    <span>
                      I certify that my employment details, technical certifications, and corporate
                      affiliations provided above are accurate and authentic.
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
                    className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    {submittingForm ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Submit Industry Verification
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Professional Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Microservice Architecture Studio */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Production Blueprint Studio</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Synthesize multi-region topologies, inspect real-time architecture drift, and run automated STRIDE threat modeling.
              </p>
            </div>
            <Link to="/app">
              <Button size="sm" variant="outline" className="w-full text-xs h-8 border-border/60 gap-1.5">
                Launch Enterprise Studio <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Release Readiness & Security Gates */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Release Control & Gateways</h4>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Zero Critical CVE Mandate</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Compliant (0 CVEs)
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Architecture Drift Score</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Minimal (&lt; 2%)
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>SOC2 & PCI-DSS Audit Gate</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            <Link to="/app">
              <Button size="sm" variant="outline" className="w-full text-xs h-8 border-border/60">
                View Release Surfaces
              </Button>
            </Link>
          </div>

          {/* Industry Portfolio & Architectural Seal */}
          <div className="rounded-xl border border-border/60 bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Verified Architect Credential</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cryptographically verifiable proof of system architectures, benchmark scores, and production readiness attestations.
              </p>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-border/50 text-center font-mono text-[11px] text-zinc-400">
                PRO-ARCH-{user?.id.slice(0, 8).toUpperCase() || "DEMO"}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Architect Credential copied to clipboard!")}
              className="w-full text-xs h-8 border-border/60 gap-1.5"
            >
              <Download className="h-3 w-3" /> Export Architect Seal
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
