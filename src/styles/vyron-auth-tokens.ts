/**
 * VYRON / ATHER — Premium Authentication Design System Tokens
 * Figma-Informed Token Architecture: Midnight Coral, Indigo Aurora, Suspended Identity Flow, and Workspace Accents.
 */

export const VYRON_GLOBAL_TOKENS = {
  bg: "#070C0B",
  surface: "#101A18",
  elevated: "#162321",
  border: "#2A3A35",
  textPrimary: "#F3F7F5",
  textSecondary: "#BAC8C0",
  focus: "#79D9F7",
  success: "#78E0B8",
  warning: "#FACC75",
  error: "#FC9E9E",
} as const;

export const SIGN_IN_TOKENS = {
  themeName: "Royal Smoke",
  bg: "#0B0B0B",
  surface: "rgba(26, 26, 26, 0.48)",
  elevated: "#1A1A1A",
  accent: "#0F969C",
  accentHover: "#0C7075",
  accentGlow: "rgba(15, 150, 156, 0.35)",
  primaryText: "#E2E8F0",
  secondaryText: "#94A3B8",
  btnForeground: "#EDEDED",
  border: "rgba(109, 165, 192, 0.28)",
} as const;

export const SIGN_UP_TOKENS = {
  themeName: "Obsidian Glow",
  bg: "#0B0B0B",
  surface: "rgba(15, 23, 42, 0.48)",
  elevated: "#0F172A",
  accent: "#0C7075",
  accentHover: "#0F969C",
  accentGlow: "rgba(12, 112, 117, 0.35)",
  supportingAccent: "#6DA5C0",
  primaryText: "#E2E8F0",
  secondaryText: "#94A3B8",
  btnForeground: "#EDEDED",
  border: "rgba(109, 165, 192, 0.28)",
} as const;

export const SUSPENDED_THREAD_TOKENS = {
  anchorLine: "rgba(226, 232, 240, 0.15)",
  thread1: {
    id: "identity",
    title: "1. IDENTIFY",
    subtitle: "Cyber Teal Credentials & SSO",
    accent: "#0F969C",
    glow: "rgba(15, 150, 156, 0.35)",
  },
  thread2: {
    id: "authenticate",
    title: "2. AUTHENTICATE",
    subtitle: "Obsidian Monochrome Verification",
    accent: "#0C7075",
    glow: "rgba(12, 112, 117, 0.35)",
  },
  thread3: {
    id: "workspace",
    title: "3. ENTER WORKSPACE",
    subtitle: "Steel-Teal Role Entitlements",
    accent: "#294D61",
    glow: "rgba(41, 77, 97, 0.35)",
  },
} as const;

export const AUTH_MOTION_TIMINGS = {
  threadProgressMs: 260,
  outgoingCardMs: 160,
  incomingCardMs: 320,
  orbitalCompletionMs: 360,
  nodeActivationMs: 200,
  ambientGlowMs: 450,
  volumetricRevealMs: 320,
  portalSlideMs: 380,
} as const;

export const FIVE_STAGE_ONBOARDING_TOKENS = {
  stage1: {
    number: "01",
    id: "identity",
    name: "Identity",
    fullName: "01 — Identity",
    summary: "Account credentials and SSO",
    accent: "#0F969C",
    glow: "rgba(15, 150, 156, 0.40)",
    border: "rgba(15, 150, 156, 0.35)",
  },
  stage2: {
    number: "02",
    id: "verification",
    name: "Verification",
    fullName: "02 — Verification",
    summary: "Email OTP & cryptographic confirmation",
    accent: "#0C7075",
    glow: "rgba(12, 112, 117, 0.40)",
    border: "rgba(12, 112, 117, 0.35)",
  },
  stage3: {
    number: "03",
    id: "workspace",
    name: "Workspace",
    fullName: "03 — Workspace",
    summary: "Role context & organizational tenancy",
    accent: "#294D61",
    glow: "rgba(41, 77, 97, 0.40)",
    border: "rgba(41, 77, 97, 0.35)",
  },
  stage4: {
    number: "04",
    id: "security",
    name: "Security",
    fullName: "04 — Security",
    summary: "MFA enrollment, passkeys & recovery key",
    accent: "#6DA5C0",
    glow: "rgba(109, 165, 192, 0.40)",
    border: "rgba(109, 165, 192, 0.35)",
  },
  stage5: {
    number: "05",
    id: "personalization",
    name: "Launch",
    fullName: "05 — Launch",
    summary: "Engineering focus, telemetry & studio launch",
    accent: "#00C896",
    glow: "rgba(0, 200, 150, 0.40)",
    border: "rgba(0, 200, 150, 0.35)",
  },
} as const;

export const WORKSPACE_ROLE_TOKENS = {
  student: {
    role: "Student",
    title: "Student Workspace",
    accent: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.25)",
    meaning: "Exploration, learning, research and creative prototyping",
    destinations: ["Project Workspaces", "SRS & Requirements", "Architecture Studio", "Learning Lab"],
    icon: "GraduationCap",
  },
  faculty: {
    role: "Faculty",
    title: "Faculty Workspace",
    accent: "#00C896",
    glow: "rgba(0, 200, 150, 0.25)",
    meaning: "Guidance, structured review, rubric grading and academic oversight",
    destinations: ["Project Supervision", "Student Progress Ledger", "Review Workflows", "Rubric Evaluation"],
    icon: "BookOpen",
  },
  professional: {
    role: "Working Professional",
    title: "Professional Workspace",
    accent: "#6DA5C0",
    glow: "rgba(109, 165, 192, 0.35)",
    meaning: "Delivery execution, production engineering, code health and SLA governance",
    destinations: ["12-Stage Forensics", "Architecture Drift", "Release Gates", "CI/CD Pipeline"],
    icon: "Briefcase",
  },
  admin: {
    role: "Admin",
    title: "Platform Admin Console",
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.25)",
    meaning: "Privileged governance, organization settings, security audit and SLO control",
    destinations: ["Command Centre", "Audit Ledger", "Policy-as-Code", "Model Governance"],
    icon: "ShieldAlert",
    requiresPrivilege: true,
  },
} as const;

export const SHOWCASE_TOKENS = {
  themeName: "18-Shade Volumetric Glass",
  bg: "#0B0B0B",
  surface: "rgba(15, 23, 42, 0.50)",
  elevated: "#1A1A1A",
  cyanAccent: "#0F969C",
  coralDetail: "#6DA5C0",
  primaryText: "#F8FAFC",
  secondaryText: "#E2E8F0",
  border: "rgba(109, 165, 192, 0.28)",
} as const;

export type VyronTheme =
  | "royal-smoke"
  | "navy"
  | "obsidian-glow"
  | "neon-dusk"
  | "emerald-dark";

export const VYRON_FIVE_THEMES: Record<
  VyronTheme,
  {
    id: VyronTheme;
    name: string;
    identity: string;
    bg: string;
    surface: string;
    primary: string;
    primaryForeground: string;
    focus: string;
    gradient: string;
  }
> = {
  navy: {
    id: "navy",
    name: "Midnight Slate Dusk",
    identity: "Global application foundation, engineering dashboards, workspace shell",
    bg: "#0F172A",
    surface: "rgba(51, 65, 85, 0.54)",
    primary: "#64748B",
    primaryForeground: "#EDEDED",
    focus: "#94A3B8",
    gradient: "linear-gradient(180deg, #64748B 0%, #334155 50%, #0F172A 100%)",
  },
  "royal-smoke": {
    id: "royal-smoke",
    name: "Royal Smoke (Steel-Teal & Obsidian)",
    identity: "AI, ATHER Copilot, intelligence dashboards, model ops",
    bg: "#0B0B0B",
    surface: "rgba(41, 77, 97, 0.52)",
    primary: "#6DA5C0",
    primaryForeground: "#0B0B0B",
    focus: "#6DA5C0",
    gradient: "linear-gradient(180deg, #6DA5C0 0%, #294D61 50%, #0B0B0B 100%)",
  },
  "obsidian-glow": {
    id: "obsidian-glow",
    name: "Obsidian Monochrome Glass",
    identity: "ATLAS, system architecture, agent orchestration, simulations, digital twins",
    bg: "#0B0B0B",
    surface: "rgba(26, 26, 26, 0.62)",
    primary: "#D9D9D9",
    primaryForeground: "#0B0B0B",
    focus: "#EDEDED",
    gradient: "linear-gradient(180deg, #333333 0%, #1A1A1A 50%, #0B0B0B 100%)",
  },
  "neon-dusk": {
    id: "neon-dusk",
    name: "Neon Dusk Cyber Teal",
    identity: "Integrations, deployment platforms, observability, release pipelines, system flow",
    bg: "#05161A",
    surface: "rgba(7, 46, 51, 0.58)",
    primary: "#0F969C",
    primaryForeground: "#EDEDED",
    focus: "#0F969C",
    gradient: "linear-gradient(180deg, #0F969C 0%, #072E33 50%, #05161A 100%)",
  },
  "emerald-dark": {
    id: "emerald-dark",
    name: "Emerald Dark",
    identity: "Sign-up, onboarding, WorkPulse, collaboration, workspace setup",
    bg: "#040404",
    surface: "rgba(28, 28, 28, 0.45)",
    primary: "#00C896",
    primaryForeground: "#040404",
    focus: "#00C896",
    gradient: "linear-gradient(180deg, #00C896 0%, #040404 100%)",
  },
};

export const VYRON_MULTI_PALETTES = {
  navy: VYRON_FIVE_THEMES.navy,
  midnight: VYRON_FIVE_THEMES.navy, // Alias
  emeraldDark: VYRON_FIVE_THEMES["emerald-dark"],
  royalSmoke: VYRON_FIVE_THEMES["royal-smoke"],
  obsidianGlow: VYRON_FIVE_THEMES["obsidian-glow"],
  neonDusk: VYRON_FIVE_THEMES["neon-dusk"],
} as const;

export type VyronThemeId = keyof typeof VYRON_MULTI_PALETTES;

