export type ToolCategory =
  "UI Builder" | "Code Agent" | "Design AI" | "Full Stack" | "Productivity & Ops";

export interface ToolFeature {
  id: string;
  name: string;
  desc: string;
  icon: string;
  highlight?: string;
  interactiveType?:
    | "prompt"
    | "filetree"
    | "chat"
    | "editor"
    | "canvas"
    | "kanban"
    | "table"
    | "diff"
    | "token"
    | "sandbox";
}

export interface CodeSnippet {
  language: string;
  title: string;
  code: string;
  description: string;
}

export interface ComparisonData {
  bestFor: string;
  closestCompetitor: string;
  keyDifference: string;
  strengths: string[];
  weaknesses: string[];
  ratings: {
    speed: number;
    codeQuality: number;
    designFidelity: number;
    ecosystem: number;
  };
}

export interface ExternalResource {
  id: string;
  title: string;
  type: "template" | "release" | "component" | "guide";
  url: string;
  stars?: number;
  updatedAt: string;
}

export interface AIToolItem {
  id: string;
  name: string;
  tagline: string;
  category: ToolCategory;
  officialUrl: string;
  logo: string;
  badgeColor: string;
  accentColor: string;
  isOpenSource: boolean;
  hasApi: boolean;
  hasGithubSync: boolean;
  hasFramerOrFigmaSync: boolean;
  hasRealtimePreview: boolean;
  pricing: "Free" | "Freemium" | "Paid" | "Open Source";
  summary: string;
  features: ToolFeature[];
  codeSnippets: CodeSnippet[];
  comparison: ComparisonData;
  resources: ExternalResource[];
  changelog: { version: string; date: string; summary: string }[];
}

export const AI_TOOL_CATALOG: AIToolItem[] = [
  {
    id: "v0-vercel",
    name: "v0 by Vercel",
    tagline: "Generative UI system powered by React, Tailwind CSS, and shadcn/ui",
    category: "UI Builder",
    officialUrl: "https://v0.dev",
    logo: "https://v0.dev/assets/icon.svg",
    badgeColor: "bg-black text-white border-zinc-700",
    accentColor: "#000000",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: true,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "Vercel's component synthesis engine that turns natural language prompts into production-ready React components using Radix UI primitives and Tailwind CSS.",
    features: [
      {
        id: "v0-f1",
        name: "Prompt-to-Component",
        desc: "Generates semantic JSX components with full Tailwind CSS styling in seconds.",
        icon: "Sparkles",
        interactiveType: "prompt",
      },
      {
        id: "v0-f2",
        name: "Shadcn/ui Native",
        desc: "Adheres strictly to Radix UI accessibility standards and copy-paste design patterns.",
        icon: "Layers",
      },
      {
        id: "v0-f3",
        name: "Interactive Preview Sandbox",
        desc: "Isolated iframe runner with viewport scaling (Mobile, Tablet, Desktop).",
        icon: "Smartphone",
        interactiveType: "sandbox",
      },
      {
        id: "v0-f4",
        name: "One-Click npx Install",
        desc: "Instantly adds generated components into local projects via `npx v0 add`.",
        icon: "Terminal",
      },
      {
        id: "v0-f5",
        name: "Figma Layer Importer",
        desc: "Converts Figma frames and SVG vectors directly into clean React code.",
        icon: "Figma",
      },
      {
        id: "v0-f6",
        name: "Version Forking & Diffs",
        desc: "Iteratively prompts for adjustments with visual side-by-side branch comparison.",
        icon: "GitFork",
      },
    ],
    codeSnippets: [
      {
        language: "bash",
        title: "CLI Component Installation",
        description: "Pull component directly into your local React repository",
        code: "npx v0 add b_7x9QzK8w9Y --yes",
      },
      {
        language: "tsx",
        title: "Generated Card Primitive",
        description: "Pure Tailwind + Radix primitive output",
        code: `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <Card className="bg-zinc-950/60 border-zinc-800 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
        <p className="text-xs text-emerald-400 font-medium mt-1">+{change} this week</p>
      </CardContent>
    </Card>
  );
}`,
      },
    ],
    comparison: {
      bestFor: "Rapid React & Tailwind UI component generation and prototyping",
      closestCompetitor: "Bolt.new",
      keyDifference:
        "Focuses exclusively on isolated component blocks rather than full-stack node runtimes.",
      strengths: ["Clean copy-paste code", "Radix UI accessibility", "Instant CLI sync"],
      weaknesses: ["No backend database provisioning", "No persistent Node runtime"],
      ratings: { speed: 95, codeQuality: 92, designFidelity: 96, ecosystem: 90 },
    },
    resources: [
      {
        id: "v0-r1",
        title: "E-Commerce Checkout Drawer",
        type: "component",
        url: "https://v0.dev/t/checkout-drawer",
        stars: 1240,
        updatedAt: "2h ago",
      },
      {
        id: "v0-r2",
        title: "SaaS Analytics Bento Grid",
        type: "template",
        url: "https://v0.dev/t/analytics-bento",
        stars: 3410,
        updatedAt: "5h ago",
      },
    ],
    changelog: [
      {
        version: "v2.8",
        date: "2026-08-10",
        summary: "Added Tailwind v4 @theme support and direct Vercel deployment.",
      },
      {
        version: "v2.7",
        date: "2026-07-28",
        summary: "Introduced Figma-to-v0 vector synchronization.",
      },
    ],
  },
  {
    id: "bolt-new",
    name: "Bolt.new",
    tagline: "In-browser full-stack AI development sandbox powered by WebContainers",
    category: "Full Stack",
    officialUrl: "https://bolt.new",
    logo: "https://bolt.new/favicon.ico",
    badgeColor: "bg-blue-600 text-white border-blue-400",
    accentColor: "#2563EB",
    isOpenSource: true,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: false,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "StackBlitz's browser-native development environment executing Node.js, Vite, package installations, and terminal commands directly inside the client browser.",
    features: [
      {
        id: "bolt-f1",
        name: "Browser WebContainers",
        desc: "Runs real Node.js and npm builds inside client WASM without server virtual machines.",
        icon: "Cpu",
        interactiveType: "filetree",
      },
      {
        id: "bolt-f2",
        name: "Full-Stack Bootstrapping",
        desc: "Instantly installs Next.js, Remix, Vite, Supabase, and Tailwind dependencies.",
        icon: "Boxes",
      },
      {
        id: "bolt-f3",
        name: "Live Terminal Execution",
        desc: "Executes bash scripts, database migrations, and hot module replacements.",
        icon: "Terminal",
      },
      {
        id: "bolt-f4",
        name: "One-Click Netlify / Supabase Push",
        desc: "Deploys full production bundles and provisions live Supabase tables in one step.",
        icon: "CloudUpload",
      },
      {
        id: "bolt-f5",
        name: "Interactive Error Self-Healing",
        desc: "Intercepts browser console errors and automatically edits files to fix exceptions.",
        icon: "ShieldAlert",
      },
    ],
    codeSnippets: [
      {
        language: "json",
        title: "WebContainer Environment Definition",
        description: "Zero-config in-browser runtime container configuration",
        code: `{
  "name": "bolt-vite-starter",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "lucide-react": "^0.450.0"
  }
}`,
      },
    ],
    comparison: {
      bestFor: "End-to-end full-stack app creation with active terminal and package installations",
      closestCompetitor: "Lovable.dev / Replit Agent",
      keyDifference:
        "Zero backend container cost by running WebAssembly Node.js directly in your browser tab.",
      strengths: ["Client-side execution", "Instant npm package install", "Real terminal"],
      weaknesses: ["Memory limits on huge repositories", "No native Docker daemon support"],
      ratings: { speed: 90, codeQuality: 88, designFidelity: 86, ecosystem: 94 },
    },
    resources: [
      {
        id: "bolt-r1",
        title: "Fullstack Supabase CRM Template",
        type: "template",
        url: "https://bolt.new/templates/supabase-crm",
        stars: 4820,
        updatedAt: "1d ago",
      },
    ],
    changelog: [
      {
        version: "v1.9",
        date: "2026-08-14",
        summary: "Added deep GitHub PR creation and automated git rebase support.",
      },
    ],
  },
  {
    id: "lovable-dev",
    name: "Lovable.dev",
    tagline: "GPT Engineer-powered conversational full-stack web software builder",
    category: "Full Stack",
    officialUrl: "https://lovable.dev",
    logo: "https://lovable.dev/favicon.ico",
    badgeColor: "bg-pink-600 text-white border-pink-400",
    accentColor: "#DB2777",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: true,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "Enterprise conversational AI platform that iteratively builds and iterates modern React, Supabase, and Tailwind applications through chat conversations with full GitHub bi-directional sync.",
    features: [
      {
        id: "lov-f1",
        name: "Conversational Architecture",
        desc: "Instruct changes in natural language; Lovable modifies multiple files concurrently.",
        icon: "MessageSquare",
        interactiveType: "chat",
      },
      {
        id: "lov-f2",
        name: "Bi-directional GitHub Sync",
        desc: "Every prompt creates clean git commits; local git pushes reflect immediately in preview.",
        icon: "GitBranch",
      },
      {
        id: "lov-f3",
        name: "Native Supabase Auth & DB",
        desc: "Auto-generates database schemas, RLS policies, and Edge Functions.",
        icon: "Database",
      },
      {
        id: "lov-f4",
        name: "Visual Click-to-Edit",
        desc: "Click any preview element to scope AI editing instructions directly to that component.",
        icon: "MousePointer",
      },
    ],
    codeSnippets: [
      {
        language: "typescript",
        title: "TanStack Router + Supabase Auth Guard",
        description: "Canonical route guard architecture generated by Lovable",
        code: `import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/lib/supabaseClient';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: '/dashboard' } });
    }
    return { session };
  },
});`,
      },
    ],
    comparison: {
      bestFor: "Non-engineers and product teams building production apps with clean git sync",
      closestCompetitor: "v0 / Bolt.new",
      keyDifference:
        "True two-way GitHub repository synchronization and native Supabase integration.",
      strengths: [
        "True Git bidirectional sync",
        "Click-to-edit DOM inspector",
        "Supabase automation",
      ],
      weaknesses: ["Slightly higher prompt latency on multi-file refactors"],
      ratings: { speed: 88, codeQuality: 94, designFidelity: 92, ecosystem: 92 },
    },
    resources: [
      {
        id: "lov-r1",
        title: "AI Knowledge Base & Support Portal",
        type: "template",
        url: "https://lovable.dev/templates/support-hub",
        stars: 2190,
        updatedAt: "3d ago",
      },
    ],
    changelog: [
      {
        version: "v3.2",
        date: "2026-08-18",
        summary: "Introduced Multi-file visual diff inspection and rollbacks.",
      },
    ],
  },
  {
    id: "cursor-ai",
    name: "Cursor AI",
    tagline: "The AI-first code editor built for hyper-productive software engineers",
    category: "Code Agent",
    officialUrl: "https://cursor.com",
    logo: "https://cursor.com/favicon.ico",
    badgeColor: "bg-zinc-800 text-white border-zinc-600",
    accentColor: "#52525B",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: false,
    hasRealtimePreview: false,
    pricing: "Paid",
    summary:
      "A fork of VS Code engineered from the ground up for LLM pair programming, intelligent multi-file editing (Composer), and whole-repository semantic indexing.",
    features: [
      {
        id: "cur-f1",
        name: "Composer Multi-File Agent",
        desc: "Edits dozens of files simultaneously using full codebase AST indexing.",
        icon: "FileCode",
        interactiveType: "editor",
      },
      {
        id: "cur-f2",
        name: "Inline Cursor Tab Predictions",
        desc: "Predicts your next 5 lines of code based on recent cursor movements and edits.",
        icon: "Zap",
      },
      {
        id: "cur-f3",
        name: "Semantic Codebase Search (@codebase)",
        desc: "Vectorized embeddings across your entire repo for instant context retrieval.",
        icon: "Search",
      },
      {
        id: "cur-f4",
        name: "Terminal Command Auto-Run",
        desc: "Synthesizes terminal commands and self-executes with user permission.",
        icon: "Terminal",
      },
    ],
    codeSnippets: [
      {
        language: "markdown",
        title: ".cursorrules Context Config",
        description:
          "Project-level agent instructions for strict TypeScript and Supabase standards",
        code: `# Cursor Agent Guidelines
- Always use strict TypeScript with zero \`any\` types.
- Follow Supabase RLS security standards: never query sensitive tables without auth.uid().
- Enforce Tailwind CSS v4 design tokens via @theme.`,
      },
    ],
    comparison: {
      bestFor:
        "Professional developers demanding deep local VS Code integration and fast autocompletion",
      closestCompetitor: "GitHub Copilot / Windsurf",
      keyDifference:
        "Full multi-file Composer agent that directly writes to your local filesystem.",
      strengths: ["Lightning autocomplete", "Full repository indexing", "Zero cloud lock-in"],
      weaknesses: ["Desktop application only — no browser-only preview"],
      ratings: { speed: 98, codeQuality: 96, designFidelity: 80, ecosystem: 98 },
    },
    resources: [
      {
        id: "cur-r1",
        title: "Official Cursor Rules Repository",
        type: "guide",
        url: "https://cursor.directory",
        stars: 15400,
        updatedAt: "6h ago",
      },
    ],
    changelog: [
      {
        version: "v0.45",
        date: "2026-08-20",
        summary: "Added Claude 3.7 Sonnet hybrid reasoning support in Composer.",
      },
    ],
  },
  {
    id: "replit-agent",
    name: "Replit Agent",
    tagline: "Autonomous end-to-end software engineer deploying live cloud applications",
    category: "Full Stack",
    officialUrl: "https://replit.com",
    logo: "https://replit.com/favicon.ico",
    badgeColor: "bg-red-600 text-white border-red-400",
    accentColor: "#DC2626",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: false,
    hasRealtimePreview: true,
    pricing: "Paid",
    summary:
      "An autonomous AI agent that scopes requirements, provisions PostgreSQL databases, writes frontend and backend code, fixes bugs, and deploys to production URLs on the Replit cloud.",
    features: [
      {
        id: "rep-f1",
        name: "Autonomous Scaffolding",
        desc: "Converts natural language ideas into full multi-tier web applications.",
        icon: "Bot",
      },
      {
        id: "rep-f2",
        name: "Cloud PostgreSQL Provisioning",
        desc: "Instantly spins up managed PostgreSQL instances connected to your backend.",
        icon: "Database",
      },
      {
        id: "rep-f3",
        name: "Live Deployment Pipeline",
        desc: "Deploys to high-availability HTTPS custom domains with SSL certificates.",
        icon: "Globe",
      },
    ],
    codeSnippets: [
      {
        language: "python",
        title: "FastAPI Backend Generated by Replit Agent",
        description: "Standard Python microservice backend configuration",
        code: `from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, Project

app = FastAPI(title="Project Brahma Engine")

@app.get("/api/projects")
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()`,
      },
    ],
    comparison: {
      bestFor: "Building and hosting full Python / Node apps without managing cloud infrastructure",
      closestCompetitor: "Bolt.new / Lovable.dev",
      keyDifference:
        "Complete native cloud container hosting and PostgreSQL provisioning included.",
      strengths: ["Managed database hosting", "Zero-devops deploy", "Mobile app support"],
      weaknesses: ["Proprietary hosting runtime", "Higher subscription tier"],
      ratings: { speed: 85, codeQuality: 86, designFidelity: 84, ecosystem: 90 },
    },
    resources: [
      {
        id: "rep-r1",
        title: "Autonomous Agent Documentation",
        type: "guide",
        url: "https://docs.replit.com/agent",
        stars: 3200,
        updatedAt: "4d ago",
      },
    ],
    changelog: [
      {
        version: "v2.1",
        date: "2026-08-05",
        summary: "Added automated database schema migration rollbacks.",
      },
    ],
  },
  {
    id: "tempo-labs",
    name: "Tempo Labs",
    tagline: "WYSIWYG visual React editor generating clean production TypeScript code",
    category: "UI Builder",
    officialUrl: "https://tempolabs.ai",
    logo: "https://tempolabs.ai/favicon.ico",
    badgeColor: "bg-purple-600 text-white border-purple-400",
    accentColor: "#9333EA",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: true,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "Visual React IDE that bridges the gap between designers and developers by providing a canvas to drag, drop, and edit live React components while committing clean TypeScript to GitHub.",
    features: [
      {
        id: "tmp-f1",
        name: "Visual React Canvas",
        desc: "Direct-manipulation canvas rendering live compiled React components.",
        icon: "Layout",
        interactiveType: "canvas",
      },
      {
        id: "tmp-f2",
        name: "Zero-Abstraction Code",
        desc: "Writes standard React 19 + Tailwind CSS without proprietary runtime wrappers.",
        icon: "Code2",
      },
      {
        id: "tmp-f3",
        name: "Design Token Sync",
        desc: "Synchronizes typography, colors, and shadows directly with Tailwind configs.",
        icon: "Palette",
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "Clean React Component Output",
        description: "Zero proprietary tags; clean standard React and Tailwind",
        code: `export function PricingCard({ tier, price, features }: PricingCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-cyan-400">{tier}</h3>
        <div className="mt-4 text-3xl font-extrabold text-white">{price}</div>
      </div>
      <button className="mt-6 w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-zinc-950">Get Started</button>
    </div>
  );
}`,
      },
    ],
    comparison: {
      bestFor:
        "Frontend teams wanting visual drag-and-drop design that outputs human-quality React code",
      closestCompetitor: "Builder.io / Subframe",
      keyDifference: "Runs directly on your existing React codebase without an external SDK.",
      strengths: ["High visual fidelity", "Clean code output", "Figma design parity"],
      weaknesses: ["Focused purely on frontend UI"],
      ratings: { speed: 89, codeQuality: 95, designFidelity: 98, ecosystem: 85 },
    },
    resources: [
      {
        id: "tmp-r1",
        title: "Enterprise Dashboard Kit",
        type: "template",
        url: "https://tempolabs.ai/templates/enterprise-kit",
        stars: 1840,
        updatedAt: "1w ago",
      },
    ],
    changelog: [
      {
        version: "v1.4",
        date: "2026-07-22",
        summary: "Added direct Tailwind v4 theme property editor.",
      },
    ],
  },
  {
    id: "framer-ai",
    name: "Framer AI",
    tagline: "Interactive web design and publication engine powered by generative AI",
    category: "Design AI",
    officialUrl: "https://framer.com",
    logo: "https://framer.com/favicon.ico",
    badgeColor: "bg-cyan-600 text-white border-cyan-400",
    accentColor: "#0891B2",
    isOpenSource: false,
    hasApi: false,
    hasGithubSync: false,
    hasFramerOrFigmaSync: true,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "World-class design tool that generates responsive marketing websites, interactive scroll animations, and localized content with instant global CDN publication.",
    features: [
      {
        id: "fra-f1",
        name: "Prompt-to-Website",
        desc: "Generates multi-page responsive sites with custom palettes and copy in 30 seconds.",
        icon: "Sparkles",
      },
      {
        id: "fra-f2",
        name: "Interactive Spring Physics",
        desc: "60fps micro-animations, scroll effects, and hover transitions built in.",
        icon: "Activity",
      },
      {
        id: "fra-f3",
        name: "Global Edge CDN Publishing",
        desc: "One-click deployment with built-in SEO, analytics, and localization.",
        icon: "Globe",
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "Framer Motion Spring Component",
        description: "Physics-based animation snippet exported from Framer",
        code: `import { motion } from "framer-motion";

export function AnimatedHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-4xl font-extrabold text-white"
    >
      Engineered for Speed
    </motion.div>
  );
}`,
      },
    ],
    comparison: {
      bestFor: "High-impact marketing pages, landing pages, and interactive product showcases",
      closestCompetitor: "Webflow AI",
      keyDifference: "Unmatched ease of animation, spring physics, and visual design fidelity.",
      strengths: ["World-class animations", "Instant CDN hosting", "Stunning design quality"],
      weaknesses: ["Not intended for complex SaaS backend dashboards"],
      ratings: { speed: 96, codeQuality: 75, designFidelity: 99, ecosystem: 88 },
    },
    resources: [
      {
        id: "fra-r1",
        title: "SaaS Product Launch Template",
        type: "template",
        url: "https://framer.com/templates/saas-launch",
        stars: 9200,
        updatedAt: "2d ago",
      },
    ],
    changelog: [
      {
        version: "v5.2",
        date: "2026-08-12",
        summary: "Added automated AI SEO metadata and sitemap optimization.",
      },
    ],
  },
  {
    id: "linear-ai",
    name: "Linear AI",
    tagline: "Precision product management and issue tracking with intelligence automation",
    category: "Productivity & Ops",
    officialUrl: "https://linear.app",
    logo: "https://linear.app/favicon.ico",
    badgeColor: "bg-indigo-600 text-white border-indigo-400",
    accentColor: "#4F46E5",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: true,
    hasRealtimePreview: false,
    pricing: "Freemium",
    summary:
      "The gold standard in developer issue tracking and engineering operations, featuring AI duplicate detection, automatic issue triage, and bi-directional GitHub PR automation.",
    features: [
      {
        id: "lin-f1",
        name: "AI Issue Triage & Summaries",
        desc: "Auto-categorizes user bug reports, extracts stack traces, and detects duplicate tickets.",
        icon: "ListChecks",
        interactiveType: "kanban",
      },
      {
        id: "lin-f2",
        name: "Lightning Fast Keyboard UX",
        desc: "Every action is mapped to hotkeys with zero network latency UI optimistic updates.",
        icon: "Keyboard",
      },
      {
        id: "lin-f3",
        name: "Bi-directional Git Sync",
        desc: "Branch creation, PR status updates, and auto-closing of issues on merge.",
        icon: "GitPullRequest",
      },
    ],
    codeSnippets: [
      {
        language: "graphql",
        title: "Linear GraphQL API Query",
        description: "Fetch active sprint issues with priority ratings",
        code: `query GetActiveSprint {
  issues(filter: { state: { name: { eq: "In Progress" } } }) {
    nodes {
      id
      title
      priority
      estimate
      assignee { name }
    }
  }
}`,
      },
    ],
    comparison: {
      bestFor:
        "Engineering teams demanding peak productivity, keyboard shortcuts, and issue tracking",
      closestCompetitor: "Jira / GitHub Projects",
      keyDifference:
        "Sub-50ms optimistic UI updates, flawless keyboard shortcuts, and modern aesthetics.",
      strengths: ["Extreme speed", "Keyboard-first workflow", "Flawless GitHub sync"],
      weaknesses: ["Focused purely on issue management, not code generation"],
      ratings: { speed: 99, codeQuality: 98, designFidelity: 98, ecosystem: 95 },
    },
    resources: [
      {
        id: "lin-r1",
        title: "Linear Method Workflows",
        type: "guide",
        url: "https://linear.app/method",
        stars: 18200,
        updatedAt: "1w ago",
      },
    ],
    changelog: [
      {
        version: "v2026.8",
        date: "2026-08-16",
        summary: "Added automated AI PR summary generation linked to issues.",
      },
    ],
  },
  {
    id: "subframe",
    name: "Subframe",
    tagline: "UI component builder that generates high-fidelity production React and Tailwind",
    category: "UI Builder",
    officialUrl: "https://subframe.com",
    logo: "https://subframe.com/favicon.ico",
    badgeColor: "bg-emerald-600 text-white border-emerald-400",
    accentColor: "#059669",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: true,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "Visual component builder designed specifically for engineers, creating pixel-perfect design systems, data tables, and navigation bars exported as standard Tailwind CSS.",
    features: [
      {
        id: "sub-f1",
        name: "Design System Token Engine",
        desc: "Visual token manager generating typed React props and Tailwind v4 themes.",
        icon: "Layers",
        interactiveType: "token",
      },
      {
        id: "sub-f2",
        name: "Complex Data Grid Builder",
        desc: "Creates accessible data tables with sorting, filtering, and pagination.",
        icon: "Table",
        interactiveType: "table",
      },
    ],
    codeSnippets: [
      {
        language: "tsx",
        title: "Subframe Design System Token Component",
        description: "Strongly-typed React component using tokens",
        code: `import * as SubframeCore from "@subframe/core";

export function StatusPill({ status }: { status: "active" | "failed" | "pending" }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  }[status];

  return <span className={\`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border \${styles}\`}>{status}</span>;
}`,
      },
    ],
    comparison: {
      bestFor: "Building enterprise design systems and structured data tables",
      closestCompetitor: "v0 / Tempo Labs",
      keyDifference: "Structured design token governance and strict layout component hierarchies.",
      strengths: ["Strict design tokens", "Flawless table components", "Direct code sync"],
      weaknesses: ["Component-focused; no backend orchestration"],
      ratings: { speed: 92, codeQuality: 96, designFidelity: 97, ecosystem: 86 },
    },
    resources: [
      {
        id: "sub-r1",
        title: "Financial Dashboard Component Kit",
        type: "template",
        url: "https://subframe.com/components/financial",
        stars: 3100,
        updatedAt: "3d ago",
      },
    ],
    changelog: [
      {
        version: "v2.0",
        date: "2026-08-01",
        summary: "Added native support for React 19 forwardRef removal.",
      },
    ],
  },
  {
    id: "retool-ai",
    name: "Retool AI",
    tagline: "Fastest way to build internal tools and enterprise business logic workflows",
    category: "Productivity & Ops",
    officialUrl: "https://retool.com",
    logo: "https://retool.com/favicon.ico",
    badgeColor: "bg-zinc-700 text-white border-zinc-500",
    accentColor: "#3F3F46",
    isOpenSource: false,
    hasApi: true,
    hasGithubSync: true,
    hasFramerOrFigmaSync: false,
    hasRealtimePreview: true,
    pricing: "Freemium",
    summary:
      "Enterprise low-code platform connecting SQL databases, REST APIs, and AI vectors into internal dashboards, customer support portals, and administrative panels.",
    features: [
      {
        id: "ret-f1",
        name: "Direct SQL & API Connectors",
        desc: "Connects securely to Postgres, Snowflake, REST, GraphQL, and Supabase.",
        icon: "Database",
      },
      {
        id: "ret-f2",
        name: "AI Query Generator",
        desc: "Converts natural language into optimized SQL queries with parameter safety.",
        icon: "Sparkles",
      },
      {
        id: "ret-f3",
        name: "Granular RBAC & Audit Logs",
        desc: "Enterprise SSO, role-based access control, and complete change tracking.",
        icon: "ShieldCheck",
      },
    ],
    codeSnippets: [
      {
        language: "sql",
        title: "Retool Parameterized SQL Query",
        description: "Safe database querying with role check",
        code: `SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE role = {{ roleFilter.value }} 
ORDER BY created_at DESC 
LIMIT {{ tablePagination.pageSize }};`,
      },
    ],
    comparison: {
      bestFor: "Internal administrative dashboards and database operations tooling",
      closestCompetitor: "AppSmith AI",
      keyDifference:
        "Unmatched enterprise security, audit logging, and native database connectors.",
      strengths: ["Fast database connection", "Enterprise RBAC", "50+ pre-built components"],
      weaknesses: ["Proprietary runtime; not suited for public consumer frontends"],
      ratings: { speed: 91, codeQuality: 82, designFidelity: 80, ecosystem: 94 },
    },
    resources: [
      {
        id: "ret-r1",
        title: "Customer Support Portal Template",
        type: "template",
        url: "https://retool.com/templates/support",
        stars: 7600,
        updatedAt: "1w ago",
      },
    ],
    changelog: [
      {
        version: "v3.80",
        date: "2026-08-09",
        summary: "Added automated vector semantic search across connected Postgres tables.",
      },
    ],
  },
];
