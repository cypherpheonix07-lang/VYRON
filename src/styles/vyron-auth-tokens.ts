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
  themeName: "Midnight",
  bg: "#0A1A2F",
  surface: "#1F1F1F",
  elevated: "#262626",
  accent: "#38BDF8",
  accentHover: "#7DD3FC",
  accentGlow: "rgba(56, 189, 248, 0.25)",
  primaryText: "#F8FAFC",
  secondaryText: "#94A3B8",
  btnForeground: "#0A1A2F",
  border: "#2D3748",
} as const;

export const SIGN_UP_TOKENS = {
  themeName: "Pastel Breeze / Emerald Dark",
  bg: "#040404",
  surface: "#1F1F1F",
  elevated: "#282828",
  accent: "#00C896",
  accentHover: "#05E2AA",
  accentGlow: "rgba(0, 200, 150, 0.25)",
  supportingAccent: "#86EFAC",
  primaryText: "#F0FDF4",
  secondaryText: "#86EFAC",
  btnForeground: "#040404", /* Crucial contrast invariant: 9.47:1 */
  border: "#243530",
} as const;

export const SUSPENDED_THREAD_TOKENS = {
  anchorLine: "rgba(255, 255, 255, 0.15)",
  thread1: {
    id: "identity",
    title: "1. IDENTIFY",
    subtitle: "Midnight Credentials & SSO",
    accent: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.25)",
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
    subtitle: "Velvet Role Entitlements",
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

export const VYRON_MULTI_PALETTES = {
  midnight: {
    id: "midnight",
    name: "Midnight",
    identity: "Sleek, professional, technical, sophisticated",
    bg: "#0A1A2F",
    surface: "#1F1F1F",
    elevated: "#262626",
    primary: "#38BDF8",
    primaryForeground: "#0A1A2F",
    border: "#2D3748",
    focus: "#22D3EE",
    contrastRatio: "14.88:1",
  },
  emeraldDark: {
    id: "emerald-dark",
    name: "Pastel Breeze / Emerald Dark",
    identity: "Calm, trustworthy, refreshing, human-centered",
    bg: "#040404",
    surface: "#1F1F1F",
    elevated: "#282828",
    primary: "#00C896",
    primaryForeground: "#040404", // Crucial contrast invariant 9.47:1
    border: "#243530",
    focus: "#34D399",
    contrastRatio: "9.47:1",
  },
  warmBreeze: {
    id: "warm-breeze",
    name: "Warm Breeze",
    identity: "Approachable, editorial, premium, warm",
    bg: "#EACEAA",
    surface: "#D39858",
    elevated: "#F5E5CF",
    primary: "#85431E",
    primaryForeground: "#EACEAA",
    textPrimary: "#34150F", // Espresso on cream: 11.04:1
    border: "#85431E",
    focus: "#85431E",
    contrastRatio: "11.04:1",
  },
  royalSmoke: {
    id: "royal-smoke",
    name: "Velvet / Royal Smoke",
    identity: "Intelligent, luxurious, creative, advanced",
    bg: "#1C1C1C",
    surface: "#242424",
    elevated: "#2E2E2E",
    primary: "#6A0DAD",
    primaryForeground: "#FFFFFF",
    border: "#4A1D7A",
    focus: "#C084FC",
    contrastRatio: "9.24:1",
  },
  obsidianGlow: {
    id: "obsidian-glow",
    name: "Velvet / Obsidian Glow",
    identity: "Cinematic, experimental, advanced computation",
    bg: "#050505",
    surface: "#14141E",
    elevated: "#1F1E33",
    primary: "#3A0CA3",
    primaryForeground: "#FFFFFF",
    border: "#2E1065",
    focus: "#818CF8",
    contrastRatio: "11.92:1",
  },
  neonDusk: {
    id: "neon-dusk",
    name: "Ocean Blue / Neon Dusk",
    identity: "Technical, futuristic, high-precision, operational",
    bg: "#020024",
    surface: "#0B0A33",
    elevated: "#14124A",
    primary: "#00D4FF",
    primaryForeground: "#020024", // Crucial contrast invariant 11.54:1
    border: "#1E1B6B",
    focus: "#38BDF8",
    contrastRatio: "11.54:1",
  },
} as const;

export type VyronThemeId = keyof typeof VYRON_MULTI_PALETTES;

