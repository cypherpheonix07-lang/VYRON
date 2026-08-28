import { ToolFeature } from "./previewData";
import {
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Boxes,
  MessageSquare,
  GitBranch,
  Database,
  FileCode,
  Zap,
  Bot,
  Globe,
  Layout,
  Code2,
  Palette,
  Activity,
  ListChecks,
  Keyboard,
  GitPullRequest,
  Table,
  ShieldCheck,
  Smartphone,
  Search,
  CloudUpload,
  ShieldAlert,
  MousePointer,
  GitFork,
  Figma,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, typeof Sparkles> = {
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Boxes,
  MessageSquare,
  GitBranch,
  Database,
  FileCode,
  Zap,
  Bot,
  Globe,
  Layout,
  Code2,
  Palette,
  Activity,
  ListChecks,
  Keyboard,
  GitPullRequest,
  Table,
  ShieldCheck,
  Smartphone,
  Search,
  CloudUpload,
  ShieldAlert,
  MousePointer,
  GitFork,
  Figma,
};

interface PreviewFeatureGridProps {
  features: ToolFeature[];
  accentColor: string;
}

export function PreviewFeatureGrid({ features, accentColor }: PreviewFeatureGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-cyan-400" /> Signature Capabilities &amp; Architecture
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground">
          {features.length} core features
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feature, idx) => {
          const Icon = ICON_MAP[feature.icon] || Sparkles;
          return (
            <div
              key={feature.id}
              className="group relative p-4 rounded-xl border border-border/80 bg-zinc-950/40 hover:bg-zinc-900/60 transition-all duration-200 hover:border-cyan-500/40 hover:shadow-lg space-y-2"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="size-8 rounded-lg flex items-center justify-center border border-zinc-800 bg-zinc-900 group-hover:scale-105 transition-transform"
                  style={{ color: accentColor || "var(--color-primary)" }}
                >
                  <Icon className="size-4" />
                </div>
                {feature.interactiveType && (
                  <Badge
                    variant="outline"
                    className="text-[9px] font-mono border-cyan-500/30 text-cyan-400 bg-cyan-950/30 px-1.5"
                  >
                    Interactive
                  </Badge>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-foreground group-hover:text-cyan-300 transition-colors">
                  {feature.name}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
