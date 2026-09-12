import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Target,
  GraduationCap,
  Rocket,
  Building,
  Brain,
  Plus,
  X,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  Compass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/routes/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth, type Role } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Personalize Studio — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Complete onboarding to personalize your AI software engineering studio.",
      },
    ],
  }),
  component: OnboardingPage,
});

const steps = [
  { title: "Your Role & Persona", desc: "Confirm your primary workspace context" },
  { title: "Goals & Custom Objectives", desc: "What are you engineering with BRAHMA?" },
  { title: "Proficiency & Density", desc: "Tailor UI shortcuts and code suggestions" },
  { title: "Milestone Deadline", desc: "Set target review date for countdown tracking" },
];

const standardGoals = [
  {
    id: "learn",
    label: "Learn Software Architecture",
    icon: GraduationCap,
    desc: "Understand microservices boundaries, data schemas, and API contracts.",
  },
  {
    id: "mvp",
    label: "Build Startup MVP",
    icon: Rocket,
    desc: "Rapidly synthesize validated blueprints and production boilerplate.",
  },
  {
    id: "college",
    label: "Capstone / College Project",
    icon: Target,
    desc: "Generate academic SRS reports, UML architectures, and test matrices.",
  },
  {
    id: "enterprise",
    label: "Enterprise Tooling",
    icon: Building,
    desc: "Enforce STRIDE security rules, PCI-DSS compliance, and zero CVE gates.",
  },
  {
    id: "research",
    label: "AI Systems Research",
    icon: Brain,
    desc: "Explore autonomous agent reasoning and code health heuristics.",
  },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, ready, refresh } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form states
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["Learn Software Architecture"]);
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [proficiency, setProficiency] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );
  const [deadlinePreset, setDeadlinePreset] = useState("Review 1 (30 Days)");
  const [customDeadline, setCustomDeadline] = useState("");

  useEffect(() => {
    if (ready && !user) {
      navigate({ to: "/login", replace: true });
    } else if (ready && user) {
      setSelectedRole(user.role || "Student");
    }
  }, [ready, user, navigate]);

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoalInput.trim()) return;
    if (customGoals.length >= 3) {
      toast.error("Maximum 3 custom goals allowed.");
      return;
    }
    const val = customGoalInput.trim();
    if (!customGoals.includes(val) && !selectedGoals.includes(val)) {
      setCustomGoals((prev) => [...prev, val]);
      setSelectedGoals((prev) => [...prev, val]);
    }
    setCustomGoalInput("");
  };

  const handleRemoveCustomGoal = (goal: string) => {
    setCustomGoals((prev) => prev.filter((g) => g !== goal));
    setSelectedGoals((prev) => prev.filter((g) => g !== goal));
  };

  const toggleGoal = (label: string) => {
    if (selectedGoals.includes(label)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals((prev) => prev.filter((g) => g !== label));
      } else {
        toast.info("Please keep at least one active goal selected.");
      }
    } else {
      setSelectedGoals((prev) => [...prev, label]);
    }
  };

  const calculateTargetDate = () => {
    if (customDeadline) return customDeadline;
    const now = new Date();
    if (deadlinePreset.includes("Review 1")) now.setDate(now.getDate() + 30);
    else if (deadlinePreset.includes("Review 2")) now.setDate(now.getDate() + 60);
    else if (deadlinePreset.includes("Final Defense")) now.setDate(now.getDate() + 90);
    else now.setDate(now.getDate() + 45);
    return now.toISOString().split("T")[0];
  };

  const saveOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const milestoneDate = calculateTargetDate();

      if (user.isDemo) {
        const demoUser = {
          ...user,
          role: selectedRole,
          onboarded: true,
        };
        localStorage.setItem("brahma.demo_user", JSON.stringify(demoUser));
        localStorage.setItem(
          "brahma.user_preferences",
          JSON.stringify({
            goals: selectedGoals,
            proficiency,
            milestone_deadline: milestoneDate,
          }),
        );
        window.dispatchEvent(new Event("storage"));
      } else {
        // Real user database update
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({
            role: selectedRole.toLowerCase(),
            goals: selectedGoals,
            proficiency,
            milestone_deadline: milestoneDate,
            onboarded: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (profileErr) throw profileErr;
        await refresh();
      }

      toast.success("Workspace personalized successfully!", {
        description: `Templates, density, and countdown configured for ${selectedRole} persona.`,
      });
      navigate({ to: "/app" });
    } catch (err) {
      toast.error((err as Error).message || "Failed to save onboarding setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      await saveOnboarding();
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <AuthLayout
      title="Personalize your Studio"
      subtitle={`Step ${step + 1} of 4: ${steps[step]!.title} — ${steps[step]!.desc}`}
      footer={
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => saveOnboarding()}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
            disabled={loading}
          >
            Skip for now (apply default setup)
          </button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden /> Powered by Brahma
            Intelligence Engine
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex gap-2">
          {steps.map((s, idx) => (
            <div
              key={s.title}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx <= step ? "bg-primary" : "bg-secondary/60"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["Student", "Faculty", "Startup", "Admin", "Reviewer"] as Role[]).map((r) => (
                <div
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedRole === r
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border/80 bg-zinc-950/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{r}</span>
                    {selectedRole === r && <Check className="size-4 text-primary" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {r === "Student" && "Academic blueprints, code health & semester defense."}
                    {r === "Faculty" && "Rubric reviews, plagiarism analysis & student grading."}
                    {r === "Startup" && "Fast MVP synthesis, tech stack selection & KPI mapping."}
                    {r === "Admin" && "Full workspace governance, token caps & audit trails."}
                    {r === "Reviewer" && "Architecture audit pins, sign-offs & release gates."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: GOAL CHIPS + CUSTOM GOALS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Select Project Goals</label>
              <div className="space-y-2">
                {standardGoals.map((g) => {
                  const isSelected = selectedGoals.includes(g.label);
                  const Icon = g.icon;
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.label)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                          : "border-border/70 bg-zinc-950/30 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid size-8 place-items-center rounded-lg bg-secondary text-foreground">
                          <Icon className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{g.label}</p>
                          <p className="text-[10px] text-muted-foreground">{g.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`size-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected && <Check className="size-2.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Goal Input */}
            <div className="border-t border-border/40 pt-3 space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Add Custom Goals</span>
                <span className="text-[10px] text-muted-foreground">
                  {customGoals.length}/3 added
                </span>
              </label>
              <form onSubmit={handleAddCustomGoal} className="flex gap-2">
                <Input
                  placeholder="e.g. Real-time WebRTC Video Pipeline"
                  value={customGoalInput}
                  onChange={(e) => setCustomGoalInput(e.target.value)}
                  disabled={customGoals.length >= 3}
                  className="text-xs bg-background/50 h-8"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground"
                >
                  <Plus className="size-3.5 mr-1" /> Add
                </Button>
              </form>

              {customGoals.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customGoals.map((cg) => (
                    <Badge
                      key={cg}
                      variant="outline"
                      className="text-xs border-primary/40 text-primary py-1 pl-2.5 pr-1.5 flex items-center gap-1"
                    >
                      {cg}
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomGoal(cg)}
                        className="hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: PROFICIENCY & DENSITY */}
        {step === 2 && (
          <div className="space-y-3">
            {[
              {
                level: "Beginner" as const,
                title: "Beginner (Guided)",
                desc: "Interactive guided tours enabled. Detailed tooltips on every metric card.",
              },
              {
                level: "Intermediate" as const,
                title: "Intermediate (Balanced)",
                desc: "Standard layout with optional architectural hints and quick action shortcuts.",
              },
              {
                level: "Advanced" as const,
                title: "Advanced (High-Density)",
                desc: "Compact data grids, collapsed sidebars by default, and power-user keybindings.",
              },
            ].map((p) => (
              <div
                key={p.level}
                onClick={() => setProficiency(p.level)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  proficiency === p.level
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border/80 bg-zinc-950/40 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{p.title}</span>
                  {proficiency === p.level && <Check className="size-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* STEP 4: MILESTONE DEADLINE */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Target Review Milestone
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Review 1 (30 Days)",
                  "Review 2 (60 Days)",
                  "Final Defense (90 Days)",
                  "Custom Date",
                ].map((preset) => (
                  <div
                    key={preset}
                    onClick={() => setDeadlinePreset(preset)}
                    className={`cursor-pointer rounded-xl border p-3 text-xs font-medium transition-all flex items-center justify-between ${
                      deadlinePreset === preset
                        ? "border-primary bg-primary/10 ring-1 ring-primary text-foreground"
                        : "border-border/70 bg-zinc-950/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{preset}</span>
                    {deadlinePreset === preset && <Check className="size-3.5 text-primary" />}
                  </div>
                ))}
              </div>
            </div>

            {deadlinePreset === "Custom Date" && (
              <div className="space-y-1.5 pt-2">
                <label htmlFor="cDate" className="text-xs text-muted-foreground">
                  Pick exact target date
                </label>
                <Input
                  id="cDate"
                  type="date"
                  value={customDeadline}
                  onChange={(e) => setCustomDeadline(e.target.value)}
                  className="text-xs bg-background/50"
                />
              </div>
            )}

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex items-center gap-3">
              <Clock className="size-5 text-primary shrink-0" />
              <span>
                Your target deadline will power a real-time countdown card on your Engineering
                Dashboard.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 0 || loading}
            className="text-xs"
          >
            <ArrowLeft className="size-3.5 mr-1" /> Back
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin mr-1" />
            ) : step === 3 ? (
              "Complete Setup"
            ) : (
              "Next"
            )}
            {step < 3 && <ArrowRight className="size-3.5 ml-1" />}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
