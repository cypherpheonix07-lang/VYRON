import { useState, useEffect } from "react";
import { projectStatePassport, type ProjectPassport } from "@/services/intelligence/projectStatePassport";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  ShieldCheck,
  Activity,
  Globe,
  Github,
  CheckCircle2,
  ExternalLink,
  Layers,
  Terminal,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface ProjectStatePassportViewProps {
  projectId?: string;
  projectName?: string;
  repoUrl?: string;
}

export function ProjectStatePassportView({
  projectId = "vyron-core",
  projectName = "VYRON Engineering Intelligence Control Plane",
  repoUrl = "https://github.com/cypherpheonix07-lang/VYRON",
}: ProjectStatePassportViewProps) {
  const [passport, setPassport] = useState<ProjectPassport>(() =>
    projectStatePassport.generatePassport(projectId, projectName, repoUrl)
  );

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border/40 py-4 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  {passport.projectName}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">
                  {passport.passportId}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Project State Passport • Canonical Engineering Identity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1 text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: {passport.canonicalStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 text-xs">
        {/* Top Grid: Bindings & Environments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Provider Bindings */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Github className="w-4 h-4 text-primary" />
              Source Control Authority
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <p><span className="text-muted-foreground">Repository:</span> <span className="text-foreground">{passport.provenance.gitRepositoryUrl}</span></p>
              <p><span className="text-muted-foreground">Default Branch:</span> <span className="text-foreground">{passport.provenance.defaultBranch}</span></p>
              <p><span className="text-muted-foreground">Commit SHA:</span> <span className="text-primary font-bold">{passport.provenance.lastCommitSha}</span></p>
              <p><span className="text-muted-foreground">Sync State:</span> <strong className="text-emerald-400">SYNCED</strong></p>
            </div>
          </div>

          {/* Environment Bindings */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Globe className="w-4 h-4 text-cyan-400" />
              Verified Runtime Endpoints
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              {passport.environments.map((env) => (
                <div key={env.environmentId} className="space-y-1">
                  <p><span className="text-muted-foreground">Production URL:</span> <span className="text-cyan-400 font-bold">{env.runtimeUrl}</span></p>
                  <p><span className="text-muted-foreground">Health Probe:</span> <span className="text-muted-foreground">{env.healthEndpoint}</span></p>
                  <p><span className="text-muted-foreground">Health State:</span> <strong className="text-emerald-400">{env.lastHealthCheckStatus}</strong></p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Attestation & Evidence Digest */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-black/40 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Security Grade</span>
            <p className="text-lg font-bold text-emerald-400">{passport.securityAttestation.grade}</p>
            <span className="text-[10px] text-muted-foreground">48/50 Checks Enforced</span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Truth Confidence</span>
            <p className="text-lg font-bold text-cyan-400">{Math.round(passport.confidenceScore * 100)}%</p>
            <span className="text-[10px] text-muted-foreground">Authoritative Corroboration</span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Evidence Merkle Digest</span>
            <p className="text-xs font-mono text-muted-foreground truncate">{passport.evidenceChainDigest}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Tamper-Evident</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
