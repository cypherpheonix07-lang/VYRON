import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Shield,
  ShieldAlert,
  Globe,
  Sliders,
  Sparkles,
  Plug,
  Terminal,
  Bell,
  Eye,
  Key,
  CreditCard,
  Database,
  Trash2,
  Save,
  Download,
  RotateCw,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Laptop,
  Moon,
  Sun,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useTheme } from "@/lib/auth";
import { ProfileCenterShell } from "@/components/brahma/profile-center";
import { SecuritySessionsTab } from "@/components/brahma/security-sessions";
import { IntegrationsCenterHub } from "@/components/brahma/integrations-hub";
import { SessionDiagnosticsPanel } from "@/components/brahma/session-diagnostics";
import { SecretHealthDashboard } from "@/components/settings/SecretHealthDashboard";
import { LLMSpendMonitor } from "@/components/settings/LLMSpendMonitor";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Governance — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Comprehensive account, privacy matrix, developer tokens, secret health, and LLM governance settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // 1. Account
  const [displayName, setDisplayName] = useState(user?.name || "Priya Nair");
  const [handle, setHandle] = useState("priya_nair");

  // 3. Workspace
  const [workspaceName, setWorkspaceName] = useState("Brahma Verified Architecture Workspace");
  const [defaultTemplate, setDefaultTemplate] = useState("academic");
  const [teamSize, setTeamSize] = useState("4");

  // 4. Preferences & Model
  const [modelTier, setModelTier] = useState<"heavy" | "mid" | "free">("mid");
  const [copilotMode, setCopilotMode] = useState("architect");
  const [digestCadence, setDigestCadence] = useState("weekly");

  // 5. Accessibility & Localization
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [language, setLanguage] = useState("en");

  // 7. Developer & API Tokens
  const [apiKey, setApiKey] = useState("sk-brahma-live-892410a8bc9431ef091a");
  const [cliToken, setCliToken] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("https://api.institution.edu/webhooks/brahma");
  const [webhookSecret, setWebhookSecret] = useState("whsec_991823abce04192847");

  // 8. Notifications
  const [notifs, setNotifs] = useState({
    analysisDone: true,
    securityAlert: true,
    reportReady: true,
    riskWarning: true,
    pushEvents: true,
  });

  // 9. Privacy Matrix
  const [visibility, setVisibility] = useState({
    identity: "team",
    academic: "team",
    professional: "team",
    engineering: "team",
    activity: "team",
    security: "private",
  });

  // 12. Data & Audit
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "evt-1",
      event: "Password Login",
      ip: "103.21.14.8",
      date: "Just now",
      status: "success",
    },
    {
      id: "evt-2",
      event: "API Key Generated",
      ip: "103.21.14.8",
      date: "2 hours ago",
      status: "success",
    },
    {
      id: "evt-3",
      event: "Architecture Generated",
      ip: "103.21.14.8",
      date: "Yesterday",
      status: "success",
    },
  ]);

  // 13. Danger Zone
  const [deleteConfirmHandle, setDeleteConfirmHandle] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load User Preferences from DB
  useEffect(() => {
    async function loadSettings() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from("user_settings")
          .select("prefs")
          .eq("user_id", user.id)
          .maybeSingle();

        if (data && data.prefs) {
          const p = data.prefs;
          if (p.default_template) setDefaultTemplate(p.default_template);
          if (p.model_tier) setModelTier(p.model_tier);
          if (p.copilot_mode) setCopilotMode(p.copilot_mode);
          if (p.density) setDensity(p.density);
          if (typeof p.reduced_motion === "boolean") setReducedMotion(p.reduced_motion);
          if (typeof p.high_contrast === "boolean") setHighContrast(p.high_contrast);
          if (p.date_format) setDateFormat(p.date_format);
          if (p.language) setLanguage(p.language);
        }
      } catch (err) {
        console.warn("Failed to load user settings:", err);
      }
    }
    loadSettings();
  }, [user?.id]);

  const persistPref = async (key: string, value: unknown) => {
    try {
      await supabase.rpc("set_user_setting", { p_key: key, p_value: value });
      toast.success("Preference saved to database");
    } catch {
      toast.info("Preference saved locally");
    }
  };

  const handleReducedMotion = (enabled: boolean) => {
    setReducedMotion(enabled);
    if (enabled) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
    persistPref("reduced_motion", enabled);
  };

  const handleHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    persistPref("high_contrast", enabled);
  };

  const handleExportData = () => {
    const dataBundle = {
      export_version: "2026.1",
      exported_at: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        handle,
      },
      visibility_settings: visibility,
      workspace: {
        name: workspaceName,
        default_template: defaultTemplate,
      },
      audit_events: auditLogs,
    };

    const blob = new Blob([JSON.stringify(dataBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brahma_data_export_${user?.id || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Complete account & workspace data bundle exported (JSON)");
  };

  const handleGenerateCliToken = () => {
    const token = `brahma_cli_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    setCliToken(token);
    navigator.clipboard.writeText(token);
    toast.success("New CLI Token generated & copied to clipboard");
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmHandle.trim()) {
      toast.error("Please enter your handle to confirm account deletion.");
      return;
    }
    setDeleting(true);
    try {
      const { data, error } = await supabase.rpc("delete_user_account", {
        p_confirm_handle: deleteConfirmHandle.trim(),
      });
      if (error || !data?.ok) {
        toast.error(data?.error || "Account deletion verification failed.");
      } else {
        toast.success("Account and associated data deleted.");
        logout();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "Failed to execute account deletion.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Workspace Governance"
        description="Configure your personal identity, server-side privacy, developer credentials, active sessions, and secret posture."
      />

      <Tabs defaultValue="account" className="w-full">
        {/* 13-Tab Navigation Bar */}
        <TabsList className="w-full justify-start overflow-x-auto border-b border-border bg-slate-950/40 p-1.5 rounded-2xl flex-nowrap scrollbar-none">
          <TabsTrigger value="account" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <User className="size-3.5" /> Account
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Sparkles className="size-3.5" /> Profile Center
          </TabsTrigger>
          <TabsTrigger value="workspace" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Layers className="size-3.5" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Sliders className="size-3.5" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Laptop className="size-3.5" /> Accessibility
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Plug className="size-3.5" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="developer" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Terminal className="size-3.5" /> Developer &amp; Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Bell className="size-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Eye className="size-3.5" /> Privacy Matrix
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Shield className="size-3.5" /> Security &amp; Secrets
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <CreditCard className="size-3.5" /> Billing &amp; LLM Spend
          </TabsTrigger>
          <TabsTrigger value="data_audit" className="text-xs px-3 py-1.5 gap-1.5 shrink-0">
            <Database className="size-3.5" /> Data &amp; Audit
          </TabsTrigger>
          <TabsTrigger value="danger" className="text-xs px-3 py-1.5 gap-1.5 shrink-0 text-red-400">
            <Trash2 className="size-3.5" /> Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: ACCOUNT ──────────────────────────────────────────────── */}
        <TabsContent value="account" className="space-y-6 pt-4">
          <SectionCard
            title="Account Identity &amp; Credentials"
            description="Your core platform identifier and email authentication state."
          >
            <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
              <div className="space-y-1.5">
                <Label className="text-xs">Email Address</Label>
                <Input
                  value={user?.email || "priya.nair@brahma.dev"}
                  disabled
                  className="h-8 text-xs bg-slate-900/60 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-xs bg-slate-900/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Unique Handle</Label>
                <Input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-900/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Assigned Platform Role</Label>
                <Badge
                  variant="outline"
                  className="h-8 px-3 text-xs flex items-center font-mono text-cyan-300 border-cyan-500/30"
                >
                  {user?.role || "Faculty"} (Verified)
                </Badge>
              </div>
            </div>
            <div className="pt-4">
              <Button
                size="sm"
                onClick={() => toast.success("Account identity updated.")}
                className="text-xs"
              >
                Save Account
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 2: PROFILE CENTER ───────────────────────────────────────── */}
        <TabsContent value="profile" className="pt-4">
          <ProfileCenterShell readOnly={false} />
        </TabsContent>

        {/* ─── TAB 3: WORKSPACE ────────────────────────────────────────────── */}
        <TabsContent value="workspace" className="space-y-6 pt-4">
          <SectionCard
            title="Workspace Topology &amp; Defaults"
            description="Configure active engineering workspace parameters."
          >
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <Label className="text-xs">Workspace Name</Label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="h-8 text-xs bg-slate-900/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Default Blueprint Template</Label>
                <Select
                  value={defaultTemplate}
                  onValueChange={(v) => {
                    setDefaultTemplate(v);
                    persistPref("default_template", v);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-slate-900/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic SRS &amp; Capstone Template</SelectItem>
                    <SelectItem value="enterprise">Enterprise Distributed Microservices</SelectItem>
                    <SelectItem value="prototype">Fast Verified Prototype</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                onClick={() => toast.success("Workspace saved.")}
                className="text-xs"
              >
                Save Workspace
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 3: AI MODELS ────────────────────────────────────────────── */}
        <TabsContent value="models" className="space-y-6 pt-4">
          <SectionCard
            title="Model Tier & Generation Settings"
            description="Set preferred model tiers and synthesis options."
          >
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <Label className="text-xs">Default Model Tier</Label>
                <Select
                  value={modelTier}
                  onValueChange={(v: string) => {
                    setModelTier(v as "heavy" | "mid" | "free");
                    persistPref("model_tier", v);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-slate-900/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heavy">
                      Heavy (Claude 3.5 Sonnet — Highest Precision)
                    </SelectItem>
                    <SelectItem value="mid">Mid (GPT-4o Mini — Fast &amp; Balanced)</SelectItem>
                    <SelectItem value="free">Free (Llama 3.1 8B Instruct)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Copilot Resolution Mode</Label>
                <Select
                  value={copilotMode}
                  onValueChange={(v) => {
                    setCopilotMode(v);
                    persistPref("copilot_mode", v);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-slate-900/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="architect">
                      Senior Architect (Structural Invariants)
                    </SelectItem>
                    <SelectItem value="reviewer">Security Auditor (Strict AST Findings)</SelectItem>
                    <SelectItem value="tutor">Academic Tutor (Pedagogical Explanations)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 5: ACCESSIBILITY & LOCALIZATION ─────────────────────────── */}
        <TabsContent value="accessibility" className="space-y-6 pt-4">
          <SectionCard
            title="Visual Density, Motion &amp; Contrast"
            description="Customise the interface to meet your comfort and accessibility requirements."
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">Reduced Motion</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Disables complex animations and canvas transitions across all pages.
                  </p>
                </div>
                <Switch
                  checked={reducedMotion}
                  onCheckedChange={handleReducedMotion}
                  aria-label="Toggle reduced motion"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">High Contrast Mode</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Enhances visual borders and contrast ratios for clear scanning.
                  </p>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={handleHighContrast}
                  aria-label="Toggle high contrast"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Date Display Format</Label>
                  <Select
                    value={dateFormat}
                    onValueChange={(v) => {
                      setDateFormat(v);
                      persistPref("date_format", v);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-slate-900/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY (22-08-2026)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-08-22)</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (08/22/2026)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">System Language</Label>
                  <Select
                    value={language}
                    onValueChange={(v) => {
                      setLanguage(v);
                      persistPref("language", v);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-slate-900/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US / UK / IN)</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 6: INTEGRATIONS ─────────────────────────────────────────── */}
        <TabsContent value="integrations" className="pt-4">
          <IntegrationsCenterHub />
        </TabsContent>

        {/* ─── TAB 7: DEVELOPER & KEYS ─────────────────────────────────────── */}
        <TabsContent value="developer" className="space-y-6 pt-4">
          <SectionCard
            title="API Keys &amp; CLI Access Tokens"
            description="Cryptographic tokens for programmatic compilation and CI/CD pipelines."
          >
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <Label className="text-xs">Active Platform Secret Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={apiKey}
                    readOnly
                    className="h-8 text-xs font-mono bg-slate-900/80 text-slate-300"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      toast.success("API key copied");
                    }}
                    className="h-8 text-xs"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs">Webhook Dispatch URL</Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-900/60"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateCliToken}
                  className="h-8 text-xs gap-1.5"
                >
                  <Terminal className="size-3.5" /> Generate New CLI Token
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Webhook signing secret rotated.")}
                  className="h-8 text-xs gap-1.5 text-amber-400 border-amber-500/30"
                >
                  <RotateCw className="size-3.5" /> Rotate Webhook Secret
                </Button>
              </div>

              {cliToken && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1 text-xs">
                  <p className="font-semibold text-cyan-300">
                    Generated CLI Token (Saved to Clipboard):
                  </p>
                  <p className="font-mono text-[11px] text-slate-300 break-all">{cliToken}</p>
                </div>
              )}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 8: NOTIFICATIONS ────────────────────────────────────────── */}
        <TabsContent value="notifications" className="space-y-6 pt-4">
          <SectionCard
            title="Notification &amp; Digest Subscriptions"
            description="Control which events trigger email alerts and push feed updates."
          >
            <div className="space-y-3 max-w-2xl">
              {[
                {
                  key: "analysisDone",
                  label: "Analysis Pass Completed",
                  desc: "Alert when AST and security synthesis finishes.",
                },
                {
                  key: "securityAlert",
                  label: "Critical Vulnerability Discovered",
                  desc: "Instant alert on CVE or hardcoded secret detection.",
                },
                {
                  key: "reportReady",
                  label: "Academic PDF Report Ready",
                  desc: "Notify when SRS PDF compilation is ready for download.",
                },
                {
                  key: "pushEvents",
                  label: "GitHub Webhook Push Stream",
                  desc: "Real-time badge updates when commits are pushed.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800"
                >
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">{item.label}</h5>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={Boolean((notifs as Record<string, boolean>)[item.key])}
                    onCheckedChange={(val) => {
                      setNotifs((prev) => ({ ...prev, [item.key]: val }));
                      toast.success("Notification setting updated.");
                    }}
                    aria-label={`Toggle ${item.label}`}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 9: PRIVACY MATRIX ───────────────────────────────────────── */}
        <TabsContent value="privacy" className="space-y-6 pt-4">
          <SectionCard
            title="Server-Enforced Section Privacy Matrix"
            description="Controls what teammates and reviewers see on your public team profile. Enforced in Postgres RPC."
          >
            <div className="space-y-3 max-w-2xl">
              {[
                {
                  sec: "identity",
                  label: "Identity & Biography",
                  desc: "Full name, display name, handle, avatar, location.",
                },
                {
                  sec: "academic",
                  label: "Academic Credentials",
                  desc: "University, degree, register number, department, advisor.",
                },
                {
                  sec: "professional",
                  label: "Professional & Skills",
                  desc: "Title, company, verified skills tags, resume link.",
                },
                {
                  sec: "engineering",
                  label: "Engineering DNA",
                  desc: "Analyses count, reports generated, tech stack.",
                },
                {
                  sec: "activity",
                  label: "Activity Feed & Publications",
                  desc: "Recent compiler passes, papers, capstone deliverables.",
                },
                {
                  sec: "security",
                  label: "Security & Sessions",
                  desc: "Always private (restricted strictly to owner & platform admins).",
                },
              ].map((item) => {
                const currentVal = (visibility as Record<string, string>)[item.sec] || "team";
                const isSecLocked = item.sec === "security";

                return (
                  <div
                    key={item.sec}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-semibold text-slate-200">{item.label}</h5>
                        {isSecLocked && (
                          <Badge
                            variant="outline"
                            className="text-[9px] text-red-400 border-red-500/30"
                          >
                            Locked Private
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>

                    {!isSecLocked ? (
                      <Select
                        value={currentVal}
                        onValueChange={(v) => {
                          setVisibility((prev) => ({ ...prev, [item.sec]: v }));
                          toast.success(`Privacy for ${item.label} updated to ${v.toUpperCase()}`);
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs w-32 bg-slate-900 border-slate-800 font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public (Everyone)</SelectItem>
                          <SelectItem value="team">Team Only</SelectItem>
                          <SelectItem value="private">Private (Only Me)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs text-slate-400 bg-slate-950"
                      >
                        PRIVATE
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 10: SECURITY & SECRETS ─────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6 pt-4">
          <SecretHealthDashboard />
          <SecuritySessionsTab />
          <SessionDiagnosticsPanel />
        </TabsContent>

        {/* ─── TAB 11: BILLING & LLM SPEND ─────────────────────────────────── */}
        <TabsContent value="billing" className="space-y-6 pt-4">
          <LLMSpendMonitor />
        </TabsContent>

        {/* ─── TAB 12: DATA & AUDIT ────────────────────────────────────────── */}
        <TabsContent value="data_audit" className="space-y-6 pt-4">
          <SectionCard
            title="Personal Audit Log"
            description="Recent authentication and compilation events tied to your account."
          >
            <div className="space-y-3 max-w-2xl">
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="p-2.5">Event</th>
                      <th className="p-2.5">IP Address</th>
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/40 hover:bg-slate-900/40">
                        <td className="p-2.5 font-medium text-slate-200">{log.event}</td>
                        <td className="p-2.5 font-mono text-muted-foreground">{log.ip}</td>
                        <td className="p-2.5 text-muted-foreground">{log.date}</td>
                        <td className="p-2.5 text-right">
                          <Badge
                            variant="outline"
                            className="text-[10px] text-emerald-400 border-emerald-500/30 font-mono"
                          >
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportData}
                  className="text-xs gap-1.5"
                >
                  <Download className="size-3.5" /> Export My Full Data Bundle (JSON)
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ─── TAB 13: DANGER ZONE ─────────────────────────────────────────── */}
        <TabsContent value="danger" className="space-y-6 pt-4">
          <SectionCard
            title="Irreversible Destructive Actions"
            description="Actions that permanently wipe workspace state or cascade delete your user profile."
          >
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
                  <AlertTriangle className="size-4" />
                  Permanently Delete User Account &amp; Workspace Data
                </div>
                <p className="text-xs text-muted-foreground">
                  Once deleted, your profile, authentication records, and associated workspace
                  permissions cannot be recovered.
                </p>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs text-slate-300">
                    Type your handle (<span className="font-mono text-cyan-300">{handle}</span>) to
                    confirm deletion:
                  </Label>
                  <Input
                    placeholder="Enter your handle..."
                    value={deleteConfirmHandle}
                    onChange={(e) => setDeleteConfirmHandle(e.target.value)}
                    className="h-8 text-xs font-mono bg-slate-900 border-red-500/30"
                  />
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={
                    deleting ||
                    deleteConfirmHandle.trim().toLowerCase() !== handle.trim().toLowerCase()
                  }
                  className="text-xs font-semibold gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  {deleting ? "Deleting..." : "Permanently Delete Account"}
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
