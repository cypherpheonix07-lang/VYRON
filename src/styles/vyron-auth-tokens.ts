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
  themeName: "Dark Navy",
  bg: "#0A1A2F",
  surface: "#1F1F1F",
  elevated: "#262626",
  accent: "#00D4FF",
  accentHover: "#38BDF8",
  accentGlow: "rgba(0, 212, 255, 0.25)",
  primaryText: "#FFFFFF",
  secondaryText: "#CBD5E1",
  btnForeground: "#020024", /* Dark navy text on cyan: 11.54:1 contrast */
  border: "color-mix(in srgb, #FFFFFF 17%, #0A1A2F)",
} as const;

export const SIGN_UP_TOKENS = {
  themeName: "Emerald Dark",
  bg: "#040404",
  surface: "#1F1F1F",
  elevated: "#282828",
  accent: "#00C896",
  accentHover: "#05E2AA",
  accentGlow: "rgba(0, 200, 150, 0.25)",
  supportingAccent: "#00D4FF",
  primaryText: "#FFFFFF",
  secondaryText: "#CBD5E1",
  btnForeground: "#040404", /* Crucial contrast invariant: 9.47:1 */
  border: "color-mix(in srgb, #FFFFFF 17%, #040404)",
} as const;

export const SUSPENDED_THREAD_TOKENS = {
  anchorLine: "rgba(255, 255, 255, 0.15)",
  thread1: {
    id: "identity",
    title: "1. IDENTIFY",
    subtitle: "Dark Navy Credentials & SSO",
    accent: "#00D4FF",
    glow: "rgba(0, 212, 255, 0.25)",
  },
  thread2: {
    id: "authenticate",
    title: "2. AUTHENTICATE",
    subtitle: "Emerald Dark Verification",
    accent: "#00C896",
    glow: "rgba(0, 200, 150, 0.25)",
  },
  thread3: {
    id: "workspace",
    title: "3. ENTER WORKSPACE",
    subtitle: "Royal Smoke Role Entitlements",
    accent: "#6A0DAD",
    glow: "rgba(106, 13, 173, 0.35)",
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
  themeName: "Graphite Ocean",
  bg: "#090F18",
  surface: "#101A18",
  elevated: "#142120",
  cyanAccent: "#65DFE8",
  coralDetail: "#FF9B91",
  primaryText: "#EEF4FF",
  secondaryText: "#A0B2C6",
  border: "#1C2B38",
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

