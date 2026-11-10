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
  bg: "#050505",
  surface: "rgba(28, 28, 28, 0.45)",
  elevated: "#1C1C1C",
  accent: "#6A0DAD",
  accentHover: "#7E12CF",
  accentGlow: "rgba(106, 13, 173, 0.35)",
  primaryText: "#F8FAFC",
  secondaryText: "#CBD5E1",
  btnForeground: "#FFFFFF",
  border: "rgba(255, 255, 255, 0.10)",
} as const;

export const SIGN_UP_TOKENS = {
  themeName: "Obsidian Glow",
  bg: "#050505",
  surface: "rgba(20, 20, 30, 0.45)",
  elevated: "#14141E",
  accent: "#3A0CA3",
  accentHover: "#4C14CE",
  accentGlow: "rgba(58, 12, 163, 0.35)",
  supportingAccent: "#6A0DAD",
  primaryText: "#F8FAFC",
  secondaryText: "#CBD5E1",
  btnForeground: "#FFFFFF",
  border: "rgba(255, 255, 255, 0.10)",
} as const;

export const SUSPENDED_THREAD_TOKENS = {
  anchorLine: "rgba(255, 255, 255, 0.12)",
  thread1: {
    id: "identity",
    title: "1. IDENTIFY",
    subtitle: "Royal Smoke Credentials & SSO",
    accent: "#6A0DAD",
    glow: "rgba(106, 13, 173, 0.35)",
  },
  thread2: {
    id: "authenticate",
    title: "2. AUTHENTICATE",
    subtitle: "Obsidian Glow Verification",
    accent: "#3A0CA3",
    glow: "rgba(58, 12, 163, 0.35)",
  },
  thread3: {
    id: "workspace",
    title: "3. ENTER WORKSPACE",
    subtitle: "Velvet Role Entitlements",
    accent: "#4A1478",
    glow: "rgba(74, 20, 120, 0.35)",
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
    accent: "#6A0DAD",
    glow: "rgba(106, 13, 173, 0.35)",
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
  themeName: "Obsidian & Royal Smoke",
  bg: "#050505",
  surface: "rgba(28, 28, 28, 0.50)",
  elevated: "#1C1C1C",
  cyanAccent: "#3A0CA3",
  coralDetail: "#6A0DAD",
  primaryText: "#F8FAFC",
  secondaryText: "#CBD5E1",
  border: "rgba(255, 255, 255, 0.10)",
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
    name: "Dark & Elegant Navy",
    identity: "Global application foundation, engineering dashboards, workspace shell",
    bg: "#0A1A2F",
    surface: "#1F1F1F",
    primary: "#00D4FF",
    primaryForeground: "#020024",
    focus: "#00D4FF",
    gradient: "linear-gradient(180deg, #1F1F1F 0%, #0A1A2F 100%)",
  },
  "royal-smoke": {
    id: "royal-smoke",
    name: "Royal Smoke",
    identity: "AI, ATHER Copilot, intelligence dashboards, model ops",
    bg: "#1C1C1C",
    surface: "#1F1F1F",
    primary: "#6A0DAD",
    primaryForeground: "#FFFFFF",
    focus: "#00D4FF",
    gradient: "linear-gradient(180deg, #6A0DAD 0%, #1C1C1C 100%)",
  },
  "obsidian-glow": {
    id: "obsidian-glow",
    name: "Obsidian Glow",
    identity: "ATLAS, system architecture, agent orchestration, simulations, digital twins",
    bg: "#050505",
    surface: "#1C1C1C",
    primary: "#3A0CA3",
    primaryForeground: "#FFFFFF",
    focus: "#00D4FF",
    gradient: "linear-gradient(180deg, #3A0CA3 0%, #050505 100%)",
  },
  "neon-dusk": {
    id: "neon-dusk",
    name: "Neon Dusk",
    identity: "Integrations, deployment platforms, observability, release pipelines, system flow",
    bg: "#020024",
    surface: "#0A1A2F",
    primary: "#00D4FF",
    primaryForeground: "#020024",
    focus: "#00D4FF",
    gradient: "linear-gradient(180deg, #00D4FF 0%, #020024 100%)",
  },
  "emerald-dark": {
    id: "emerald-dark",
    name: "Emerald Dark",
    identity: "Sign-up, onboarding, WorkPulse, collaboration, workspace setup",
    bg: "#040404",
    surface: "#1F1F1F",
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

