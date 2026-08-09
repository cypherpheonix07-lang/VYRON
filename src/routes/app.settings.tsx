import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/brahma/primitives";
import { ApiKeysTab } from "@/components/brahma/settings/api-keys-tab";
import { AppearanceTab } from "@/components/brahma/settings/appearance-tab";
import { DangerZoneTab } from "@/components/brahma/settings/danger-zone-tab";
import { IntegrationsTab } from "@/components/brahma/settings/integrations-tab";
import { NotificationsTab } from "@/components/brahma/settings/notifications-tab";
import { ProfileForm } from "@/components/brahma/settings/profile-form";
import { WorkspaceTab } from "@/components/brahma/settings/workspace-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Manage your BRAHMA profile, workspace team, integrations, notifications, appearance and API keys.",
      },
      { property: "og:title", content: "Settings — PROJECT BRAHMA" },
      {
        property: "og:description",
        content: "Profile, workspace, integrations, notifications, appearance, API keys and danger zone.",
      },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "workspace", label: "Workspace" },
  { id: "integrations", label: "Integrations" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
  { id: "api-keys", label: "API Keys" },
  { id: "danger", label: "Danger Zone" },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account, workspace and platform configuration for your BRAHMA workspace."
      />
      <Tabs defaultValue="profile" className="space-y-4">
        <div className="-mx-1 overflow-x-auto px-1">
          <TabsList className="w-max">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className={t.id === "danger" ? "data-[state=active]:text-[var(--critical)]" : ""}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="workspace">
          <WorkspaceTab />
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>
        <TabsContent value="danger">
          <DangerZoneTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
