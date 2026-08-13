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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [
      { title: "Workspace Integrations — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Connect your version control, tracking boards, and storage adapters.",
      },
    ],
  }),
  component: WorkspaceIntegrationsPage,
});

interface Integration {
  id: string;
  name: string;
  desc: string;
  connected: boolean;
  icon: React.ElementType;
  category: "VCS" | "Chat" | "Design" | "Infrastructure";
}

const initialIntegrations: Integration[] = [
  {
    id: "github",
    name: "GitHub Repository Auth",
    desc: "Sync repositories, code health check runs, and PR branch hooks.",
    connected: true,
    icon: Github,
    category: "VCS",
  },
  {
    id: "slack",
    name: "Slack Notifications",
    desc: "Stream critical alerts, security breaches, and blueprint releases.",
    connected: false,
    icon: Slack,
    category: "Chat",
  },
  {
    id: "figma",
    name: "Figma Design Assets",
    desc: "Import wireframe vector nodes and translate layout nodes directly.",
    connected: false,
    icon: Globe,
    category: "Design",
  },
  {
    id: "aws-s3",
    name: "Amazon S3 Adapter",
    desc: "Store compiled PDF reports, requirements documents, and specs.",
    connected: true,
    icon: Database,
    category: "Infrastructure",
  },
];

function WorkspaceIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggle = (id: string, current: boolean) => {
    setToggling(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, connected: !current } : item)),
      );
      setToggling(null);
      toast.success(
        current
          ? `Disconnected ${id.toUpperCase()} integration.`
          : `Connected ${id.toUpperCase()} integration successfully.`,
      );
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Integrations"
        description="Link third-party platforms to synchronize design vectors, source code, and release packages."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((item) => (
          <Card
            key={item.id}
            className="surface border border-border/60 hover:border-primary/20 transition-all duration-200"
          >
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary/80 text-primary shrink-0">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
                      {item.name}
                      {item.connected ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] h-4">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[8px] h-4">
                          Inactive
                        </Badge>
                      )}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/30 pt-3">
                <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground/60">
                  Category: {item.category}
                </span>

                <Button
                  size="sm"
                  variant={item.connected ? "outline" : "default"}
                  className={cn(
                    "h-7 text-[10px] min-w-[90px]",
                    !item.connected && "bg-primary text-primary-foreground hover:bg-primary/95",
                  )}
                  disabled={toggling === item.id}
                  onClick={() => handleToggle(item.id, item.connected)}
                >
                  {toggling === item.id ? (
                    <Loader2 className="size-3 animate-spin mr-1.5" />
                  ) : item.connected ? (
                    "Disconnect"
                  ) : (
                    "Connect Account"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
