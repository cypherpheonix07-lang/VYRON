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
  themeName: "Midnight Coral",
  bg: "#070C0B",
  surface: "#101A18",
  elevated: "#15201E",
  accent: "#FF9A8B",
  accentHover: "#FFB0A4",
  accentGlow: "rgba(255, 154, 139, 0.25)",
  primaryText: "#F3F7F5",
  secondaryText: "#BAC8C0",
  btnForeground: "#1A1011",
  border: "#2A3A35",
} as const;

export const SIGN_UP_TOKENS = {
  themeName: "Indigo Aurora",
  bg: "#0D1020",
  surface: "#171A31",
  elevated: "#1F2342",
  accent: "#A8A4FF",
  accentHover: "#B9B5FF",
  accentGlow: "rgba(168, 164, 255, 0.25)",
  supportingAccent: "#79D9F7",
  primaryText: "#F3F7F5",
  secondaryText: "#BAC8C0",
  btnForeground: "#0D1020",
  border: "#2A3555",
} as const;

export const SUSPENDED_THREAD_TOKENS = {
  anchorLine: "rgba(255, 255, 255, 0.12)",
  thread1: {
    id: "identity",
    title: "1. SIGN IN",
    subtitle: "Identity & secure access",
    accent: "#79D9F7",
    glow: "rgba(121, 217, 247, 0.25)",
  },
  thread2: {
    id: "account",
    title: "2. CREATE ACCOUNT",
    subtitle: "Registration & setup",
    accent: "#BCA8FF",
    glow: "rgba(188, 168, 255, 0.25)",
  },
  thread3: {
    id: "workspace",
    title: "3. CHOOSE WORKSPACE",
    subtitle: "Environment activation",
    accent: "#78E0B8",
    glow: "rgba(120, 224, 184, 0.25)",
  },
} as const;

export const WORKSPACE_ROLE_TOKENS = {
  student: {
    role: "Student",
    title: "Student Workspace",
    accent: "#6DD5FA",
    glow: "rgba(109, 213, 250, 0.25)",
    meaning: "Exploration, learning, research and creative prototyping",
    destinations: ["Project Workspaces", "SRS & Requirements", "Architecture Studio", "Learning Lab"],
    icon: "GraduationCap",
  },
  faculty: {
    role: "Faculty",
    title: "Faculty Workspace",
    accent: "#C4B5FD",
    glow: "rgba(196, 181, 253, 0.25)",
    meaning: "Guidance, structured review, rubric grading and academic oversight",
    destinations: ["Project Supervision", "Student Progress Ledger", "Review Workflows", "Rubric Evaluation"],
    icon: "BookOpen",
  },
  professional: {
    role: "Working Professional",
    title: "Professional Workspace",
    accent: "#FACC75",
    glow: "rgba(250, 204, 117, 0.25)",
    meaning: "Delivery execution, production engineering, code health and SLA governance",
    destinations: ["12-Stage Forensics", "Architecture Drift", "Release Gates", "CI/CD Pipeline"],
    icon: "Briefcase",
  },
  admin: {
    role: "Admin",
    title: "Platform Admin Console",
    accent: "#FC9E9E",
    glow: "rgba(252, 158, 158, 0.25)",
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
