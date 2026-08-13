import { createFileRoute } from "@tanstack/react-router";
import {
  Cable,
  CheckCircle2,
  ChevronRight,
  Database,
  Github,
  Globe,
  Loader2,
  Mail,
  Play,
  Plug,
  Plus,
  Slack,
  Sparkles,
  Terminal,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/brahma/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/studio/$id/integrations")({
  head: () => ({
    meta: [
      { title: "Integration Studio — BRAHMA AI Studio" },
      {
        name: "description",
        content: "Manage external database connections, AI providers, and webhooks.",
      },
    ],
  }),
  component: IntegrationStudioPage,
});

const mockIntegrations = [
  {
    id: "github",
    name: "GitHub Repository",
    category: "Devops",
    desc: "Commit and trigger automatic builds.",
    status: "Connected",
  },
  {
    id: "supabase",
    name: "Supabase DB",
    category: "Database",
    desc: "Sync tables, auth sessions, and file stores.",
    status: "Connected",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Database",
    desc: "Direct client connection config.",
    status: "Disconnected",
  },
  {
    id: "openai",
    name: "OpenAI Platform",
    category: "AI Models",
    desc: "Configure API limits for GPT models.",
    status: "Connected",
  },
  {
    id: "gemini",
    name: "Gemini Pro",
    category: "AI Models",
    desc: "Enable multimodal logic contexts.",
    status: "Connected",
  },
  {
    id: "stripe",
    name: "Stripe Gateway",
    category: "Payments",
    desc: "Handle checkout routes and customer portals.",
    status: "Disconnected",
  },
  {
    id: "slack",
    name: "Slack Channels",
    category: "Utilities",
    desc: "Push notification alert webhooks.",
    status: "Connected",
  },
  {
    id: "email",
    name: "SMTP Email",
    category: "Utilities",
    desc: "Dispatch patient or student booking links.",
    status: "Error",
  },
  {
    id: "zapier",
    name: "Zapier Workflows",
    category: "Utilities",
    desc: "Trigger external logic routines.",
    status: "Disconnected",
  },
];

function IntegrationStudioPage() {
  const { id } = Route.useParams();

  const [activeTab, setActiveTab] = useState("All");
  const [integrationsList, setIntegrationsList] = useState(mockIntegrations);
  const [editingIntegration, setEditingIntegration] = useState<(typeof mockIntegrations)[0] | null>(
    null,
  );
  const [testLoading, setTestLoading] = useState(false);

  const filtered =
    activeTab === "All"
      ? integrationsList
      : integrationsList.filter((item) => item.category === activeTab);

  const handleTestConnection = async () => {
    setTestLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setTestLoading(false);

    if (editingIntegration?.id === "email") {
      toast.error("Connection Failed", {
        description: "SMTP handshake timed out on port 587. Check credentials.",
      });
    } else {
      toast.success("Connection Successful", {
        description: "Brahma successfully authenticated API handshake responses.",
      });
    }
  };

  const toggleConnect = (intId: string) => {
    setIntegrationsList((prev) =>
      prev.map((item) => {
        if (item.id !== intId) return item;
        const nextStatus = item.status === "Connected" ? "Disconnected" : "Connected";
        toast.success(`Integration status updated`, {
          description: `${item.name} is now ${nextStatus.toLowerCase()}.`,
        });
        return { ...item, status: nextStatus };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cable className="size-5 text-primary" /> Connected Integrations
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure backend variables, database endpoints, and webhooks triggers.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1.5">
          {["All", "Database", "AI Models", "Devops", "Payments", "Utilities"].map((cat) => (
            <Button
              key={cat}
              variant={activeTab === cat ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-[10px]"
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const isConnected = item.status === "Connected";
          const isError = item.status === "Error";

          return (
            <Card
              key={item.id}
              className="surface flex flex-col justify-between overflow-hidden transition-all hover:border-primary/30"
            >
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded bg-secondary text-primary shrink-0">
                      {item.category === "Database" && <Database className="size-4" />}
                      {item.category === "AI Models" && <Sparkles className="size-4" />}
                      {item.category === "Devops" && <Github className="size-4" />}
                      {item.category === "Utilities" && <Slack className="size-4" />}
                      {item.category === "Payments" && <Plug className="size-4" />}
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono mt-0.5">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isConnected && "bg-[var(--success)]"
                      } ${isError && "bg-[var(--critical)]"} ${
                        item.status === "Disconnected" && "bg-muted-foreground/40"
                      }`}
                    />
                    <span className="text-[10px] text-muted-foreground">{item.status}</span>
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.desc}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-[10px] text-primary"
                    onClick={() => setEditingIntegration(item)}
                  >
                    Configure <ChevronRight className="ml-0.5 size-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={isConnected ? "outline" : "default"}
                    className="h-7 text-[10px]"
                    onClick={() => toggleConnect(item.id)}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Slider Panel/Drawer Mock */}
      {editingIntegration && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md h-full bg-zinc-950 border-l border-border p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Manage {editingIntegration.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Parameters & Credentials Setup
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingIntegration(null)}>
                  Close
                </Button>
              </div>

              {/* Mock fields */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="int-key">API Secret Token Key</Label>
                  <Input
                    id="int-key"
                    type="password"
                    value="••••••••••••••••••••••••••••••••"
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="int-endpoint">Endpoint Target Host</Label>
                  <Input
                    id="int-endpoint"
                    placeholder="https://api.external.com/v1"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="int-env">Target Environment Profile</Label>
                  <select
                    id="int-env"
                    className="h-8 text-xs border border-border bg-background rounded-lg px-2 text-foreground font-mono outline-none"
                  >
                    <option value="development">development</option>
                    <option value="staging">staging</option>
                    <option value="production">production</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-6 border-t border-border/50 mt-6">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={handleTestConnection}
                disabled={testLoading}
              >
                {testLoading ? (
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                ) : (
                  <Terminal className="mr-2 size-3.5" />
                )}{" "}
                Test Connection
              </Button>
              <Button
                className="flex-1 text-xs bg-primary text-primary-foreground"
                onClick={() => {
                  toast.success("Settings updated successfully.");
                  setEditingIntegration(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
