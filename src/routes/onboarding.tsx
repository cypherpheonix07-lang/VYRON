import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ArrowRight, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/routes/login";
import { Button } from "@/components/ui/button";
import { useAuth, type Role } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Complete onboarding to personalize your AI software engineering studio.",
      },
    ],
  }),
  component: OnboardingPage,
});

const steps = [
  { title: "Your Role", desc: "Confirm your primary workspace context" },
  { title: "Your Goal", desc: "What are you building with BRAHMA?" },
  { title: "Your Domain", desc: "Select default project industry" },
  { title: "Technical Level", desc: "Help us tailor code suggestions" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, ready, refresh } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selections, setSelections] = useState({
    role: "Student" as Role,
    goal: "Learn",
    domain: "Developer Tools",
    techLevel: "Intermediate",
  });

  const roles = ["Student", "Faculty", "Startup", "Admin", "Reviewer"];
  const goals = ["Learn", "Build Startup MVP", "College Project", "Enterprise Tool", "Research"];
  const domains = [
    "Education",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Logistics",
    "Governance",
    "Developer Tools",
    "IoT",
  ];
  const techLevels = ["Beginner", "Intermediate", "Advanced"];

  // Guard: Redirect unauthenticated users
  useEffect(() => {
    if (ready && !user) {
      navigate({ to: "/login", replace: true });
    } else if (ready && user) {
      // Sync initial role from user session if set
      setSelections((s) => ({ ...s, role: user.role }));
    }
  }, [ready, user, navigate]);

  const saveOnboarding = async (finalSelections: typeof selections) => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.isDemo) {
        // DEMO local user path
        const demoUser = {
          ...user,
          role: finalSelections.role,
          onboarded: true,
        };
        localStorage.setItem("brahma.demo_user", JSON.stringify(demoUser));
        window.dispatchEvent(new Event("storage"));
      } else {
        // Real user database update path
        // 1. Call RPC function to set role securely
        const { error: roleErr } = await supabase.rpc("update_user_role", {
          user_id: user.id,
          new_role: finalSelections.role.toLowerCase(),
        });
        if (roleErr) console.error("RPC role update failed:", roleErr);

        // 2. Set onboarded status
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({ onboarded: true })
          .eq("id", user.id);
        if (profileErr) throw profileErr;

        // 3. Trigger session sync
        await refresh();
      }

      toast.success("Profile initialized", {
        description: "Welcome to Project Brahma. Your workspace is configured.",
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
      await saveOnboarding(selections);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSkip = async () => {
    // Save onboarding with default selections
    const defaultSelections = {
      role: user?.role || ("Student" as Role),
      goal: "Learn",
      domain: "Developer Tools",
      techLevel: "Intermediate",
    };
    await saveOnboarding(defaultSelections);
  };

  return (
    <AuthLayout
      title="Personalize your Studio"
      subtitle={`Step ${step + 1} of 4: ${steps[step]!.title} — ${steps[step]!.desc}`}
      footer={
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
            disabled={loading}
          >
            Skip for now (apply default settings)
          </button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden /> Powered by Brahma
            Intelligence Engine
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Step Indicator Progress Bar */}
        <div
          className="flex gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step + 1}
        >
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step Content cards */}
        <div>
          {step === 0 && (
            <div className="grid gap-2">
              {roles.map((r) => {
                const selected = selections.role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, role: r as Role }))}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                  >
                    <span className="text-sm font-semibold">{r}</span>
                    {selected && <Check className="size-4 text-primary" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-2">
              {goals.map((g) => {
                const selected = selections.goal === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, goal: g }))}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                  >
                    <span className="text-sm font-semibold">{g}</span>
                    {selected && <Check className="size-4 text-primary" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {domains.map((d) => {
                const selected = selections.domain === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, domain: d }))}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                  >
                    <span className="text-xs font-semibold">{d}</span>
                    {selected && <Check className="size-3.5 text-primary shrink-0" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-2">
              {techLevels.map((tl) => {
                const selected = selections.techLevel === tl;
                return (
                  <button
                    key={tl}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, techLevel: tl }))}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{tl}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tl === "Beginner" && "Guided wizard-heavy blueprints"}
                        {tl === "Intermediate" && "Balanced customization and guidance"}
                        {tl === "Advanced" && "Raw editor access and direct deployment config"}
                      </p>
                    </div>
                    {selected && <Check className="size-4 text-primary shrink-0" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
          <Button variant="outline" disabled={step === 0} onClick={handleBack}>
            <ArrowLeft className="mr-2 size-4" aria-hidden /> Back
          </Button>
          <Button onClick={handleNext} disabled={loading} className="min-w-28">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : step === 3 ? (
              <>
                Finish <Check className="ml-2 size-4" aria-hidden />
              </>
            ) : (
              <>
                Next <ArrowRight className="ml-2 size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
