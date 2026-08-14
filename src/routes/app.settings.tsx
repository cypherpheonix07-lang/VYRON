import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Github,
  Key,
  Laptop,
  Moon,
  Save,
  Sun,
  User,
  Globe,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useTheme } from "@/lib/auth";
import { ProfileCenterShell } from "@/components/brahma/profile-center";
import { SecuritySessionsTab } from "@/components/brahma/security-sessions";
import { IntegrationsCenterHub } from "@/components/brahma/integrations-hub";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Manage profile, workspace integrations, security sessions, and appearance settings.",
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

  // API Key States
  const [apiKey, setApiKey] = useState("sk-brahma-••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState({
    analysisCompleted: true,
    securityAlert: true,
    reportReady: false,
    deliveryRiskWarning: true,
    pushEventReceived: true,
  });

  // Workspace States
  const [workspaceName, setWorkspaceName] = useState("Brahma Engineering Workspace");
  const [allowGuestAccess, setAllowGuestAccess] = useState(false);

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated.");
  };

  const handleSaveWorkspace = () => {
    toast.success("Workspace configuration saved.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Workspace Governance"
        description="Configure your personal profile, security & active sessions, integrations, and preferences."
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
            <User className="mr-2 size-4" aria-hidden /> Profile Center
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <ShieldCheck className="mr-2 size-4" aria-hidden /> Security & Sessions
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
          <TabsTrigger
            value="workspace"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Building className="mr-2 size-4" aria-hidden /> Workspace
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* PROFILE CENTER TAB */}
          <TabsContent value="profile" className="space-y-4 outline-none">
            <ProfileCenterShell />
          </TabsContent>

          {/* SECURITY & SESSIONS TAB */}
          <TabsContent value="security" className="space-y-4 outline-none">
            <SecuritySessionsTab />
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="space-y-4 outline-none">
            <IntegrationsCenterHub />
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-4 outline-none">
            <SectionCard
              title="Notification Matrix"
              description="Control real-time and email alerts triggered by engineering intelligence."
            >
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between border-b border-border/60 py-3">
                  <div>
                    <p className="text-sm font-semibold">Analysis completed</p>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts when code health, security or architecture analyses finish.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.analysisCompleted}
                    onCheckedChange={(c) =>
                      setNotifications((n) => ({ ...n, analysisCompleted: c }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-b border-border/60 py-3">
                  <div>
                    <p className="text-sm font-semibold">Security vulnerabilities</p>
                    <p className="text-xs text-muted-foreground">
                      Urgent push notification when High or Critical CWE vulnerabilities are
                      detected.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlert}
                    onCheckedChange={(c) => setNotifications((n) => ({ ...n, securityAlert: c }))}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-border/60 py-3">
                  <div>
                    <p className="text-sm font-semibold">Delivery risk warnings</p>
                    <p className="text-xs text-muted-foreground">
                      Warn when project velocity or technical debt drops below threshold.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.deliveryRiskWarning}
                    onCheckedChange={(c) =>
                      setNotifications((n) => ({ ...n, deliveryRiskWarning: c }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold">Realtime push event commits</p>
                    <p className="text-xs text-muted-foreground">
                      Show in-app toasts when branches receive new commits from GitHub webhooks.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushEventReceived}
                    onCheckedChange={(c) =>
                      setNotifications((n) => ({ ...n, pushEventReceived: c }))
                    }
                  />
                </div>

                <Button className="w-fit mt-2" onClick={handleSaveNotifications}>
                  <Save className="mr-2 size-4" /> Save Notification Preferences
                </Button>
              </div>
            </SectionCard>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent value="appearance" className="space-y-4 outline-none">
            <SectionCard title="Interface Theme" description="Choose your active interface theme.">
              <div className="space-y-4 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setTheme("dark")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-lg bg-zinc-900 text-zinc-100">
                        <Moon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Dark Mode</p>
                        <p className="text-xs text-muted-foreground">Deep navy blueprint UI</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setTheme("light")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-lg bg-zinc-100 text-zinc-900">
                        <Sun className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Light Mode</p>
                        <p className="text-xs text-muted-foreground">Clean high-contrast theme</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* API KEYS TAB */}
          <TabsContent value="apikeys" className="space-y-4 outline-none">
            <SectionCard
              title="Platform API Access Keys"
              description="Manage tokens for the BRAHMA CLI and CI/CD pipeline automation."
            >
              <div className="space-y-4 max-w-xl">
                <div className="grid gap-2">
                  <Label htmlFor="api-key-val">Personal Access Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key-val"
                      type={showKey ? "text" : "password"}
                      value={showKey ? "sk-brahma-98af21d09e84b81c4e72" : apiKey}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)}>
                      {showKey ? "Hide" : "Reveal"}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText("sk-brahma-98af21d09e84b81c4e72");
                      toast.success("API key copied to clipboard.");
                    }}
                  >
                    Copy Key
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setApiKey("sk-brahma-••••••••••••••••••••");
                      setShowKey(false);
                      toast.success("API key rotated. Old key revoked immediately.");
                    }}
                  >
                    Rotate Secret Key
                  </Button>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* WORKSPACE TAB */}
          <TabsContent value="workspace" className="space-y-4 outline-none">
            <SectionCard
              title="Workspace Organization"
              description="Configure workspace domain and collaborator permissions."
            >
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <Label htmlFor="wsName" className="text-xs">
                    Workspace Name
                  </Label>
                  <Input
                    id="wsName"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="text-xs bg-background/50"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Guest Preview Mode</p>
                    <p className="text-[10px] text-muted-foreground">
                      Allow reviewers to inspect blueprints without write permissions.
                    </p>
                  </div>
                  <Switch checked={allowGuestAccess} onCheckedChange={setAllowGuestAccess} />
                </div>

                <Button className="w-fit mt-2" onClick={handleSaveWorkspace}>
                  <Save className="mr-2 size-4" /> Save Workspace Settings
                </Button>
              </div>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
