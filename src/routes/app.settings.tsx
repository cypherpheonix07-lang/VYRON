import { createFileRoute } from "@tanstack/react-router";
import { Bell, Github, Key, Laptop, Moon, Save, Sun, User, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useTheme, type Role, type Theme } from "@/lib/auth";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Manage profile, workspace integrations, notifications, and appearance settings.",
      },
      { property: "og:title", content: "Settings — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "Configure account and workspace settings for engineering intelligence.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Profile Form States
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Student" as Role,
  });

  // Load user data once authenticated
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  // Integration States
  const [gitConnected, setGitConnected] = useState(true);

  // API Key States
  const [apiKey, setApiKey] = useState("sk-brahma-••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState({
    analysisCompleted: true,
    securityAlert: true,
    reportReady: false,
    deliveryRiskWarning: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Your preferences and profile details have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your personal profile, workspace integrations, alert notifications, and layout theme."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList
          className="w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0"
          aria-label="Settings configuration tabs"
        >
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <User className="mr-2 size-4" aria-hidden /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Globe className="mr-2 size-4" aria-hidden /> Integrations
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Bell className="mr-2 size-4" aria-hidden /> Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Sun className="mr-2 size-4" aria-hidden /> Appearance
          </TabsTrigger>
          <TabsTrigger
            value="apikeys"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Key className="mr-2 size-4" aria-hidden /> API Keys
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-4 outline-none">
            <SectionCard title="Profile details" description="Update your default account context.">
              <div className="grid gap-4 max-w-xl">
                <div className="grid gap-2">
                  <Label htmlFor="prof-name">Full name</Label>
                  <Input
                    id="prof-name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prof-email">Email address</Label>
                  <Input
                    id="prof-email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Enter your work email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prof-role">Workspace role</Label>
                  <Select
                    value={profile.role}
                    onValueChange={(v) => setProfile((p) => ({ ...p, role: v as Role }))}
                  >
                    <SelectTrigger id="prof-role">
                      <SelectValue placeholder="Select workspace role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-fit mt-2" onClick={handleSave}>
                  <Save className="mr-2 size-4" aria-hidden /> Save profile
                </Button>
              </div>
            </SectionCard>
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="space-y-4 outline-none">
            <SectionCard
              title="Integrations"
              description="Manage third-party code hosting credentials."
            >
              <div className="divide-y divide-border/60">
                <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-secondary text-foreground">
                      <Github className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">GitHub OAuth Integration</p>
                      <p className="text-xs text-muted-foreground">
                        Required to pull repositories for Code Health & Security analysis.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={gitConnected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => {
                      setGitConnected(!gitConnected);
                      toast.info(
                        gitConnected
                          ? "GitHub integration disconnected"
                          : "GitHub OAuth connected successfully",
                      );
                    }}
                  >
                    {gitConnected ? "Disconnect" : "Connect Account"}
                  </Button>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-4 outline-none">
            <SectionCard
              title="Notification settings"
              description="Control which updates are triggered to your feed."
            >
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Analysis completed</p>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when codebase metrics calculation finishes.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.analysisCompleted}
                    onCheckedChange={(v) =>
                      setNotifications((n) => ({ ...n, analysisCompleted: v }))
                    }
                    aria-label="Analysis completed notifications"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Security alert</p>
                    <p className="text-xs text-muted-foreground">
                      Notify immediately upon detecting Critical or High severity findings.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlert}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, securityAlert: v }))}
                    aria-label="Security alert notifications"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Report ready</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when generated PDF reports are ready for export.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.reportReady}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, reportReady: v }))}
                    aria-label="Report ready notifications"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Delivery risk warning</p>
                    <p className="text-xs text-muted-foreground">
                      Alert when timeline slip projections exceed 7 business days.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.deliveryRiskWarning}
                    onCheckedChange={(v) =>
                      setNotifications((n) => ({ ...n, deliveryRiskWarning: v }))
                    }
                    aria-label="Delivery risk warning notifications"
                  />
                </div>
                <Button className="w-fit mt-2" onClick={handleSave}>
                  <Save className="mr-2 size-4" aria-hidden /> Save preferences
                </Button>
              </div>
            </SectionCard>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent value="appearance" className="space-y-4 outline-none">
            <SectionCard
              title="Appearance Theme"
              description="Switch between workspace layout aesthetics."
            >
              <div className="grid gap-4 sm:grid-cols-3 max-w-xl">
                {[
                  {
                    id: "light" as Theme,
                    name: "Light Mode",
                    icon: Sun,
                    desc: "Clean and bright canvas",
                  },
                  {
                    id: "dark" as Theme,
                    name: "Dark Mode",
                    icon: Moon,
                    desc: "Aesthetic deep navy console",
                  },
                  {
                    id: "system" as Theme,
                    name: "System",
                    icon: Laptop,
                    desc: "Sync with OS preferences",
                  },
                ].map((item) => {
                  const active = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTheme(item.id);
                        toast.success(`Theme set to ${item.name}`);
                      }}
                      className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/8 shadow-[0_0_0_1px_var(--primary)]"
                          : "border-border hover:border-primary/40 hover:bg-secondary/40"
                      }`}
                    >
                      <item.icon
                        className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                        aria-hidden
                      />
                      <div className="mt-2">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          </TabsContent>

          {/* API KEYS TAB */}
          <TabsContent value="apikeys" className="space-y-4 outline-none">
            <SectionCard
              title="LLM provider API key"
              description="Customize LLM endpoints for requirement extraction."
            >
              <div className="space-y-4 max-w-xl">
                <div className="grid gap-2">
                  <Label htmlFor="apikey-input">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apikey-input"
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter OpenAI or Gemini API Key"
                      className="font-mono"
                    />
                    <Button variant="secondary" onClick={() => setShowKey(!showKey)}>
                      {showKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Required for parsing SRS files and generating system architectures on custom
                    templates.
                  </p>
                </div>
                <Button className="w-fit" onClick={handleSave}>
                  <Save className="mr-2 size-4" aria-hidden /> Save API Keys
                </Button>
              </div>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
