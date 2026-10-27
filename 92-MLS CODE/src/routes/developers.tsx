import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Terminal,
  Key,
  Shield,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Database,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrahmaLogo } from "@/components/brahma/logo";
import { toast } from "sonner";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [{ title: "Developer Portal & SDKs — PROJECT BRAHMA" }],
  }),
  component: DeveloperPortalPage,
});

function DeveloperPortalPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Code snippet copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const jsSnippet = `import { BrahmaClient } from "@brahma/sdk";

const brahma = new BrahmaClient({
  apiKey: process.env.BRAHMA_API_KEY,
  environment: "production"
});

// Run automated codebase verification
const result = await brahma.verifyProject({
  projectId: "proj_8821941",
  gatePreset: "strict-defense"
});

console.log("Health Score:", result.scores.codeHealth);
console.log("Publish Gate Pass:", result.gatekeeper.passed);`;

  const pySnippet = `from brahma import BrahmaClient
import os

client = BrahmaClient(
    api_key=os.environ.get("BRAHMA_API_KEY"),
    environment="production"
)

# Run automated codebase verification
result = client.verify_project(
    project_id="proj_8821941",
    gate_preset="strict-defense"
)

print(f"Health Score: {result.scores.code_health}")
print(f"Publish Gate Pass: {result.gatekeeper.passed}")`;

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] p-6 md:p-12 font-sans">
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-border/40 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <BrahmaLogo />
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            DEVELOPER PORTAL
          </Badge>
        </div>
        <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
          <Link to="/app">Dashboard</Link>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            API Reference & SDK Quickstart
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Programmatically query code health metrics, trigger automated verification pipelines,
            and manage release gates.
          </p>
        </div>

        {/* SDK Quickstart Tabs */}
        <Card className="surface">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Code2 className="size-4 text-primary" /> Official SDKs
            </CardTitle>
            <CardDescription className="text-xs">
              Install our official TypeScript or Python client libraries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="js">
              <TabsList className="grid w-48 grid-cols-2 bg-muted/60">
                <TabsTrigger value="js" className="text-xs">
                  TypeScript
                </TabsTrigger>
                <TabsTrigger value="py" className="text-xs">
                  Python
                </TabsTrigger>
              </TabsList>
              <TabsContent value="js" className="mt-3 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 text-xs"
                  onClick={() => copyCode(jsSnippet, "js")}
                >
                  {copied === "js" ? (
                    <Check className="size-3.5 mr-1" />
                  ) : (
                    <Copy className="size-3.5 mr-1" />
                  )}
                  {copied === "js" ? "Copied" : "Copy"}
                </Button>
                <pre className="p-4 rounded-lg bg-black/50 border border-border/40 font-mono text-xs overflow-x-auto text-cyan-300">
                  {jsSnippet}
                </pre>
              </TabsContent>
              <TabsContent value="py" className="mt-3 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 text-xs"
                  onClick={() => copyCode(pySnippet, "py")}
                >
                  {copied === "py" ? (
                    <Check className="size-3.5 mr-1" />
                  ) : (
                    <Copy className="size-3.5 mr-1" />
                  )}
                  {copied === "py" ? "Copied" : "Copy"}
                </Button>
                <pre className="p-4 rounded-lg bg-black/50 border border-border/40 font-mono text-xs overflow-x-auto text-indigo-300">
                  {pySnippet}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* OpenAPI Endpoints Table */}
        <Card className="surface">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Terminal className="size-4 text-primary" /> Core REST Endpoints (OpenAPI 3.1)
            </CardTitle>
            <CardDescription className="text-xs">
              Live HTTP interfaces exposed by the backend analysis engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground text-left">
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Endpoint</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Rate Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="py-2 px-3 font-bold text-[var(--success)]">GET</td>
                    <td className="py-2 px-3 text-foreground">/api/v1/projects/:id/scores</td>
                    <td className="py-2 px-3 text-muted-foreground font-sans">
                      Retrieve composite score gauges and factor weights
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">1,200 req/min</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-primary">POST</td>
                    <td className="py-2 px-3 text-foreground">/api/v1/projects/:id/verify</td>
                    <td className="py-2 px-3 text-muted-foreground font-sans">
                      Execute full 7-point publish gate verification
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">120 req/min</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-indigo-400">POST</td>
                    <td className="py-2 px-3 text-foreground">/api/v1/webhooks/github</td>
                    <td className="py-2 px-3 text-muted-foreground font-sans">
                      Ingest signed HMAC-SHA256 repository push events
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">Unlimited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
