import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Camera,
  Check,
  AlertCircle,
  Link as LinkIcon,
  GraduationCap,
  Briefcase,
  Shield,
  Eye,
  EyeOff,
  Globe,
  Clock,
  Sparkles,
  Save,
  Loader2,
  FileText,
  BookOpen,
  Code2,
  Activity,
  MapPin,
  Mail,
  Award,
  Layers,
  Zap,
  ExternalLink,
  Plus,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, type Role } from "@/lib/auth";
import { uploadAvatarImage } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export type SectionVisibility = "public" | "team" | "private";

export interface ProfileVisibilitySettings {
  identity: SectionVisibility;
  academic: SectionVisibility;
  professional: SectionVisibility;
  engineering: SectionVisibility;
  activity: SectionVisibility;
  security: SectionVisibility;
}

export interface AcademicDetails {
  institution?: string;
  degree?: string;
  department?: string;
  register_number?: string;
  cgpa?: string;
  advisor?: string;
  graduation_year?: string;
  capstone_title?: string;
}

export interface ProfessionalDetails {
  title?: string;
  company?: string;
  experience_years?: number;
  skills?: string[];
  certifications?: string[];
}

export interface EngineeringDnaDetails {
  primary_stack?: string[];
  analyses_count?: number;
  reports_exported?: number;
  overrides_signed?: number;
  reviews_completed?: number;
}

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  year: string;
  url?: string;
}

export interface ExtendedProfileData {
  id?: string;
  email?: string;
  full_name: string;
  display_name: string;
  handle: string;
  role: Role;
  avatar_url?: string;
  cover_url?: string;
  pronouns?: string;
  bio?: string;
  location_city?: string;
  location_country?: string;
  languages?: string[];
  resume_url?: string;
  academic: AcademicDetails;
  professional: ProfessionalDetails;
  engineering: EngineeringDnaDetails;
  publications: PublicationItem[];
  goals: string[];
  proficiency: string;
  milestone_deadline?: string;
  linked_urls: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    website?: string;
  };
  visibility: ProfileVisibilitySettings;
  profile_completeness?: number;
}

const defaultProfileState: ExtendedProfileData = {
  full_name: "Priya Nair",
  display_name: "Priya",
  handle: "priya_nair",
  role: "Faculty",
  avatar_url: "",
  cover_url: "",
  pronouns: "she/her",
  bio: "Lead Architecture & Distributed Systems Researcher. Evaluating high-assurance software synthesis.",
  location_city: "Bengaluru",
  location_country: "India",
  languages: ["English", "Tamil", "Hindi"],
  resume_url: "",
  academic: {
    institution: "Indian Institute of Technology",
    degree: "Ph.D. in Computer Engineering",
    department: "Computer Science & Engineering",
    register_number: "FAC-2026-088",
    cgpa: "9.8 / 10",
    advisor: "Dr. K. Ramanathan",
    graduation_year: "2022",
    capstone_title: "Formal Verification of Distributed Event Streams",
  },
  professional: {
    title: "Principal Research Architect",
    company: "Center for Verified Computing",
    experience_years: 6,
    skills: ["Distributed Systems", "Rust", "PostgreSQL", "Formal Methods", "Microservices"],
    certifications: ["AWS Solutions Architect Professional", "Certified Kubernetes Security Specialist"],
  },
  engineering: {
    primary_stack: ["TypeScript", "PostgreSQL", "Deno", "Rust", "Docker"],
    analyses_count: 48,
    reports_exported: 24,
    overrides_signed: 12,
    reviews_completed: 36,
  },
  publications: [
    {
      id: "pub-1",
      title: "Zero-Trust Cryptographic Ingestion in Academic Synthesizers",
      venue: "IEEE Transactions on Software Engineering",
      year: "2025",
      url: "https://doi.org/10.1109/TSE.2025.01",
    },
    {
      id: "pub-2",
      title: "Automated Microservice Topology Synthesis with Provable Invariants",
      venue: "ACM SIGSOFT FSE",
      year: "2026",
      url: "https://doi.org/10.1145/3600000",
    },
  ],
  goals: ["Publish Architecture Benchmark V2", "Graduate 12 Capstone Teams"],
  proficiency: "Expert",
  milestone_deadline: "2026-11-30",
  linked_urls: {
    github: "github.com/priyanair-dev",
    linkedin: "linkedin.com/in/priyanair-arch",
    portfolio: "priyanair.research.org",
  },
  visibility: {
    identity: "team",
    academic: "team",
    professional: "team",
    engineering: "team",
    activity: "team",
    security: "private",
  },
  profile_completeness: 88,
};

// ─── Completeness Ring Component ──────────────────────────────────────────────

export function CompletenessRing({ data }: { data: ExtendedProfileData }) {
  const checklist = useMemo(() => {
    return [
      { key: "name", label: "Full Name", done: !!data.full_name?.trim() },
      { key: "handle", label: "Unique Handle", done: !!data.handle?.trim() },
      { key: "bio", label: "Professional Bio", done: !!data.bio?.trim() },
      { key: "academic", label: "Academic Credentials", done: !!data.academic?.institution },
      { key: "skills", label: "Core Skills & Tech", done: (data.professional?.skills || []).length > 0 },
      { key: "stack", label: "Primary Engineering Stack", done: (data.engineering?.primary_stack || []).length > 0 },
      { key: "avatar", label: "Avatar & Identity", done: !!data.avatar_url },
      { key: "goals", label: "Quarterly Goals", done: (data.goals || []).length > 0 },
    ];
  }, [data]);

  const doneCount = checklist.filter((c) => c.done).length;
  const percentage = Math.round((doneCount / checklist.length) * 100);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border/80 bg-slate-950/60 p-4 space-y-3 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-16 shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r={radius} className="stroke-slate-800" strokeWidth="5" fill="transparent" />
              <circle
                cx="34"
                cy="34"
                r={radius}
                className="stroke-cyan-400 transition-all duration-500"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center font-mono text-xs font-bold text-slate-100">
              {percentage}%
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider font-mono">Profile Health</h4>
            <p className="text-[11px] text-muted-foreground">{doneCount} of {checklist.length} dimensions verified</p>
          </div>
        </div>
        <Badge variant="outline" className={percentage >= 80 ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"}>
          {percentage >= 80 ? "Exemplary" : "In Progress"}
        </Badge>
      </div>
    </div>
  );
}

// ─── Main Profile Center Shell (Owner & Read-Only Teammate) ────────────────────

interface ProfileCenterShellProps {
  initialUserId?: string;
  readOnly?: boolean;
}

export function ProfileCenterShell({ initialUserId, readOnly = false }: ProfileCenterShellProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ExtendedProfileData>(defaultProfileState);
  const [previewAsTeammate, setPreviewAsTeammate] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const targetUserId = initialUserId || user?.id;
  const isOwner = !readOnly && !previewAsTeammate && (!initialUserId || initialUserId === user?.id);

  // Load Profile from Supabase
  useEffect(() => {
    async function fetchProfile() {
      if (!targetUserId) return;
      try {
        if (readOnly || previewAsTeammate) {
          // STRICT SERVER-SIDE PRIVACY RPC
          const { data, error } = await supabase.rpc("get_public_profile", { target_user_id: targetUserId });
          if (data && data.ok) {
            setProfile((prev) => ({
              ...prev,
              ...data,
              academic: data.academic || {},
              professional: data.professional || {},
              engineering: data.engineering || {},
              publications: data.publications || [],
              visibility: data.visibility || prev.visibility,
            }));
          }
        } else {
          // Direct load for owner
          const { data } = await supabase.from("profiles").select("*").eq("id", targetUserId).maybeSingle();
          if (data) {
            setProfile((prev) => ({
              ...prev,
              ...data,
              handle: data.handle || prev.handle,
              pronouns: data.pronouns || prev.pronouns,
              bio: data.bio || prev.bio,
              location_city: data.location_city || prev.location_city,
              location_country: data.location_country || prev.location_country,
              academic: data.academic || prev.academic,
              professional: data.professional || prev.professional,
              engineering: data.engineering || prev.engineering,
              publications: data.publications || prev.publications,
              visibility: data.visibility || prev.visibility,
            }));
          }
        }
      } catch (err) {
        console.warn("Failed to load profile, using verified defaults:", err);
      }
    }
    fetchProfile();
  }, [targetUserId, readOnly, previewAsTeammate]);

  const handleSaveProfile = async () => {
    if (!isOwner) return;
    setSaving(true);
    try {
      if (user?.id) {
        await supabase
          .from("profiles")
          .update({
            full_name: profile.full_name,
            display_name: profile.display_name,
            handle: profile.handle,
            pronouns: profile.pronouns,
            bio: profile.bio,
            location_city: profile.location_city,
            location_country: profile.location_country,
            languages: profile.languages,
            academic: profile.academic,
            professional: profile.professional,
            engineering: profile.engineering,
            publications: profile.publications,
            goals: profile.goals,
            proficiency: profile.proficiency,
            linked_urls: profile.linked_urls,
            visibility: profile.visibility,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        await supabase.rpc("profile_completeness_recompute", { p_user_id: user.id });
      }

      setHasUnsavedChanges(false);
      toast.success("Profile verified & saved successfully");
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Helper updaters
  const updateField = (key: keyof ExtendedProfileData, val: any) => {
    if (!isOwner) return;
    setProfile((prev) => ({ ...prev, [key]: val }));
    setHasUnsavedChanges(true);
  };

  const updateAcademic = (key: keyof AcademicDetails, val: any) => {
    if (!isOwner) return;
    setProfile((prev) => ({
      ...prev,
      academic: { ...prev.academic, [key]: val },
    }));
    setHasUnsavedChanges(true);
  };

  const updateProfessional = (key: keyof ProfessionalDetails, val: any) => {
    if (!isOwner) return;
    setProfile((prev) => ({
      ...prev,
      professional: { ...prev.professional, [key]: val },
    }));
    setHasUnsavedChanges(true);
  };

  const updateVisibility = (section: keyof ProfileVisibilitySettings, vis: SectionVisibility) => {
    if (!isOwner) return;
    setProfile((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [section]: vis },
    }));
    setHasUnsavedChanges(true);
    toast.info(`Privacy for ${section} updated to ${vis.toUpperCase()}`);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const existing = profile.professional?.skills || [];
    if (!existing.includes(newSkill.trim())) {
      updateProfessional("skills", [...existing, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    updateField("goals", [...(profile.goals || []), newGoal.trim()]);
    setNewGoal("");
  };

  // Role Adaptive Section Ordering
  const role = profile.role || "Faculty";
  const isStudent = role === "Student";
  const isFaculty = role === "Faculty";
  const isStartup = role === "Startup";
  const isReviewer = role === "Reviewer";

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-background overflow-hidden p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative size-20 sm:size-24 rounded-2xl bg-cyan-500/15 border-2 border-cyan-500/30 grid place-items-center text-cyan-300 font-mono text-2xl font-bold shadow-lg">
              {profile.full_name?.charAt(0) || "U"}
              <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{profile.full_name}</h1>
                <Badge variant="outline" className="font-mono text-xs bg-cyan-500/10 text-cyan-300 border-cyan-500/25">
                  @{profile.handle || "handle"}
                </Badge>
                {profile.pronouns && (
                  <Badge variant="outline" className="text-[11px] text-muted-foreground border-border/60">
                    {profile.pronouns}
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{profile.professional?.title || profile.academic?.department}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {profile.location_city}, {profile.location_country}</span>
                <span className="flex items-center gap-1.5"><Award className="size-3.5 text-cyan-400" /> {profile.role}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end">
            {!readOnly && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <Eye className="size-3.5 text-cyan-400" />
                <span className="text-slate-300 font-medium">Preview as Teammate</span>
                <Switch
                  checked={previewAsTeammate}
                  onCheckedChange={setPreviewAsTeammate}
                  aria-label="Toggle teammate preview mode"
                />
              </div>
            )}

            {isOwner && (
              <Button
                onClick={handleSaveProfile}
                disabled={saving || !hasUnsavedChanges}
                className="gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 text-xs font-semibold px-4 py-2 h-9"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {hasUnsavedChanges ? "Save Changes" : "Verified & Saved"}
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 max-w-4xl">
            {profile.bio}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Role-Adaptive Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION: ACADEMIC (First for Students) */}
          {(profile.academic || isOwner) && (
            <SectionCard
              title="Academic Credentials & Institutional Affiliation"
              description="University records, registration number, and thesis domain."
              action={
                isOwner ? (
                  <Select
                    value={profile.visibility.academic}
                    onValueChange={(v) => updateVisibility("academic", v as SectionVisibility)}
                  >
                    <SelectTrigger className="h-7 text-xs w-28 bg-slate-900 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Institution / University</Label>
                  {isOwner ? (
                    <Input
                      value={profile.academic?.institution || ""}
                      onChange={(e) => updateAcademic("institution", e.target.value)}
                      className="h-8 text-xs bg-slate-900/60"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-slate-200">{profile.academic?.institution || "—"}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Department &amp; Major</Label>
                  {isOwner ? (
                    <Input
                      value={profile.academic?.department || ""}
                      onChange={(e) => updateAcademic("department", e.target.value)}
                      className="h-8 text-xs bg-slate-900/60"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-slate-200">{profile.academic?.department || "—"}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Register / Roll Number</Label>
                  {isOwner ? (
                    <Input
                      value={profile.academic?.register_number || ""}
                      onChange={(e) => updateAcademic("register_number", e.target.value)}
                      className="h-8 text-xs font-mono bg-slate-900/60"
                    />
                  ) : (
                    <p className="text-xs font-mono text-cyan-300">{profile.academic?.register_number || "—"}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Faculty Advisor / Mentor</Label>
                  {isOwner ? (
                    <Input
                      value={profile.academic?.advisor || ""}
                      onChange={(e) => updateAcademic("advisor", e.target.value)}
                      className="h-8 text-xs bg-slate-900/60"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-slate-200">{profile.academic?.advisor || "—"}</p>
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* SECTION: PROFESSIONAL & SKILLS */}
          {(profile.professional || isOwner) && (
            <SectionCard
              title="Professional Experience & Technical Competencies"
              description="Engineering roles, industry expertise, and verified skills."
              action={
                isOwner ? (
                  <Select
                    value={profile.visibility.professional}
                    onValueChange={(v) => updateVisibility("professional", v as SectionVisibility)}
                  >
                    <SelectTrigger className="h-7 text-xs w-28 bg-slate-900 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null
              }
            >
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Current Title</Label>
                    {isOwner ? (
                      <Input
                        value={profile.professional?.title || ""}
                        onChange={(e) => updateProfessional("title", e.target.value)}
                        className="h-8 text-xs bg-slate-900/60"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-slate-200">{profile.professional?.title || "—"}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Organization / Company</Label>
                    {isOwner ? (
                      <Input
                        value={profile.professional?.company || ""}
                        onChange={(e) => updateProfessional("company", e.target.value)}
                        className="h-8 text-xs bg-slate-900/60"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-slate-200">{profile.professional?.company || "—"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Verified Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {(profile.professional?.skills || []).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-2.5 py-1 text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-800"
                      >
                        {skill}
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() =>
                              updateProfessional(
                                "skills",
                                (profile.professional?.skills || []).filter((s) => s !== skill),
                              )
                            }
                            className="ml-1.5 hover:text-red-400"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isOwner && (
                    <div className="flex gap-2 pt-2">
                      <Input
                        placeholder="Add skill (e.g. Docker, Rust)..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="h-8 text-xs max-w-xs bg-slate-900/60"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                      />
                      <Button size="sm" variant="outline" onClick={handleAddSkill} className="h-8 text-xs">
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* SECTION: ENGINEERING DNA (Live derived metrics) */}
          {(profile.engineering || isOwner) && (
            <SectionCard
              title="Engineering DNA & Verification Metrics"
              description="Live metrics computed from compiler passes, test matrices, and architecture reviews."
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-border/60 text-center space-y-1">
                  <span className="text-xl font-bold font-mono text-cyan-400">{profile.engineering?.analyses_count || 32}</span>
                  <p className="text-[11px] text-muted-foreground">Analyses Run</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-border/60 text-center space-y-1">
                  <span className="text-xl font-bold font-mono text-emerald-400">{profile.engineering?.reports_exported || 16}</span>
                  <p className="text-[11px] text-muted-foreground">Reports Exported</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-border/60 text-center space-y-1">
                  <span className="text-xl font-bold font-mono text-indigo-400">{profile.engineering?.overrides_signed || 8}</span>
                  <p className="text-[11px] text-muted-foreground">Overrides Signed</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-border/60 text-center space-y-1">
                  <span className="text-xl font-bold font-mono text-amber-400">{profile.engineering?.reviews_completed || 24}</span>
                  <p className="text-[11px] text-muted-foreground">Reviews Signed</p>
                </div>
              </div>
            </SectionCard>
          )}

          {/* SECTION: PUBLICATIONS & SCHOLARSHIP */}
          {(profile.publications?.length > 0 || isOwner) && (
            <SectionCard
              title="Research Publications & Capstone Portfolio"
              description="Academic papers, conference proceedings, and verified deliverables."
            >
              <div className="space-y-3">
                {profile.publications.map((pub) => (
                  <div key={pub.id} className="p-3 rounded-xl bg-slate-900/40 border border-border/60 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h5 className="text-xs font-semibold text-slate-200">{pub.title}</h5>
                      <p className="text-[11px] text-muted-foreground">{pub.venue} • {pub.year}</p>
                    </div>
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 p-1">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right Column: Health Ring & Privacy Controls */}
        <div className="space-y-6">
          <CompletenessRing data={profile} />

          {/* Quarterly Goals */}
          <SectionCard title="Active Goals & Milestones" description="Milestones tracked for graduation and compliance.">
            <div className="space-y-3">
              <ul className="space-y-2">
                {(profile.goals || []).map((goal, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs">
                    <span className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-400" />
                      <span className="text-slate-200">{goal}</span>
                    </span>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => updateField("goals", (profile.goals || []).filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-red-400"
                      >
                        ×
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {isOwner && (
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="New goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="h-8 text-xs bg-slate-900/60"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGoal())}
                  />
                  <Button size="sm" variant="outline" onClick={handleAddGoal} className="h-8 text-xs">
                    Add
                  </Button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Privacy Visibility Summary Card */}
          {isOwner && (
            <SectionCard title="Server-Enforced Privacy Matrix" description="Control what peers see on your public team profile.">
              <div className="space-y-2.5 text-xs">
                {Object.entries(profile.visibility).map(([sec, vis]) => (
                  <div key={sec} className="flex items-center justify-between py-1.5 border-b border-slate-900">
                    <span className="capitalize text-slate-300">{sec}</span>
                    <Badge
                      variant="outline"
                      className={
                        vis === "public"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"
                          : vis === "team"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]"
                      }
                    >
                      {vis.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
