import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  Key,
  Laptop,
  Building2,
  Users2,
  Check,
  AlertTriangle,
  AlertCircle,
  Play,
  HelpCircle,
  User,
  Award,
  Flame,
  FileCode,
  CheckCircle,
  RefreshCw,
  Zap,
  Mail,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { BrahmaLogo } from "../brahma/logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { type Role } from "../../lib/auth";

// Types for components
export type LayoutVariant = "A" | "B" | "C";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  showFocusToggle?: boolean;
}

// 1. AuthLayout component
export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
  showFocusToggle = true,
}: AuthLayoutProps) {
  const [variant, setVariant] = useState<LayoutVariant>("A");

  useEffect(() => {
    // Read from localStorage to persist user's variant preference
    const saved = localStorage.getItem("brahma.auth_variant") as LayoutVariant | null;
    if (saved) {
      setVariant(saved);
    }
  }, []);

  const toggleVariant = () => {
    const next: LayoutVariant = variant === "A" ? "C" : variant === "C" ? "A" : "A";
    setVariant(next);
    localStorage.setItem("brahma.auth_variant", next);
  };

  return (
    <div className="relative flex min-h-screen w-screen bg-[var(--surface-base)] text-[var(--text-primary)] overflow-hidden font-sans">
      {/* Background grids */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--surface-base)] via-[var(--surface-sunken)]/95 to-[var(--surface-overlay)]/40"
        aria-hidden
      />

      {/* Variant A (Split Screen) and Variant C (Focus Mode) layouts */}
      <div className="flex w-full min-h-screen relative z-10">
        {/* Left Side: Auth Forms */}
        <div
          className={cn(
            "flex flex-col justify-between p-6 sm:p-12 overflow-y-auto min-h-screen transition-all duration-500 ease-in-out",
            variant === "A"
              ? "w-full lg:w-[45%]"
              : variant === "C"
                ? "w-full lg:w-[92%]"
                : "w-full lg:w-1/2",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <BrahmaLogo />
            {showFocusToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVariant}
                className="text-xs font-semibold text-slate-400 hover:text-cyan-400 border border-slate-800/80 bg-slate-950/20 hover:bg-slate-900/40 rounded-lg px-2.5 py-1"
                aria-label="Toggle focus mode layout"
              >
                {variant === "C" ? "Exit Focus Mode" : "Focus Mode"}
              </Button>
            )}
          </div>

          {/* Form wrapper */}
          <div className="my-auto py-8 max-w-md w-full mx-auto">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
              <p className="text-slate-400 text-sm">{subtitle}</p>
            </div>

            <div className="mt-8 relative p-6 sm:p-8 bg-slate-950/40 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-2xl">
              {children}
            </div>
          </div>

          {/* Footer container */}
          <div className="mt-auto pt-6 text-center text-xs text-slate-500 border-t border-slate-900">
            {footer || <TrustFooter />}
          </div>
        </div>

        {/* Right Side: Showcase panel (Variant A) or Side Rail (Variant C) */}
        {variant !== "B" && (
          <div
            className={cn(
              "hidden lg:flex relative flex-col justify-center border-l border-slate-900 transition-all duration-500 ease-in-out overflow-hidden bg-slate-950/20",
              variant === "A" ? "w-[55%]" : "w-[8%]",
            )}
          >
            {variant === "A" ? (
              <ShowcasePanel />
            ) : (
              // Variant C Brand Rail
              <div className="flex flex-col items-center justify-between py-12 h-full mx-auto text-slate-500">
                <div className="text-cyan-500/50 hover:text-cyan-400 transition-colors cursor-pointer">
                  <BrahmaLogo compact />
                </div>
                <div className="flex flex-col gap-8 items-center text-slate-500">
                  <div className="flex flex-col items-center text-center group cursor-help">
                    <span className="text-xs font-bold text-cyan-400/70 group-hover:text-cyan-400 transition-colors">
                      38
                    </span>
                    <span className="text-[9px] uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                      Blueprints
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center group cursor-help">
                    <span className="text-xs font-bold text-green-400/70 group-hover:text-green-400 transition-colors">
                      82%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                      Health
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center group cursor-help">
                    <span className="text-xs font-bold text-red-400/70 group-hover:text-red-400 transition-colors">
                      2
                    </span>
                    <span className="text-[9px] uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                      Alerts
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono select-none">v1.0</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. ShowcasePanel component
const stats = [
  {
    text: "38 software blueprints generated this week",
    icon: FileCode,
    accent: "text-cyan-400 border-cyan-500/20",
  },
  {
    text: "Average codebase quality health score at 82%",
    icon: Award,
    accent: "text-green-400 border-green-500/20",
  },
  {
    text: "2 critical security vulnerabilities flagged today",
    icon: Flame,
    accent: "text-red-400 border-red-500/20",
  },
];

const reviewerQuotes = [
  {
    quote:
      "Project Brahma bridges the gap between requirements and clean, scaffolded software architecture in seconds. A game-changer for final year capstones.",
    author: "Dr. Arjun Mehta, Reviewer Board Panelist",
  },
  {
    quote:
      "Continuous traceability mapping directly connects business KPIs to the AST code metrics. It allows founders to justify refactoring directly to investors.",
    author: "Priya Nair, CTO & Incubator Lead",
  },
  {
    quote:
      "Students stop guessing what to build first. The release validation gate keeps projects scope-restricted and deployment-ready.",
    author: "Prof. Satish Kumar, CSE Department Head",
  },
];

export function ShowcasePanel() {
  const [statIndex, setStatIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const statTimer = setInterval(() => {
      setStatIndex((prev) => (prev + 1) % stats.length);
    }, 6000);

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % reviewerQuotes.length);
    }, 8500);

    return () => {
      clearInterval(statTimer);
      clearInterval(quoteTimer);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between h-full p-12 relative z-10 select-none">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Top Section: Animated SVG Blueprint Node Graph */}
      <div className="relative h-[250px] w-full border border-slate-800/60 rounded-xl bg-slate-950/60 flex items-center justify-center overflow-hidden group backdrop-blur-md">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-mono text-slate-500">
          <Zap className="size-3 text-cyan-400 animate-pulse" />
          <span>Interactive Blueprint Graph</span>
        </div>
        <svg width="100%" height="100%" className="opacity-80">
          {/* Connecting Lines */}
          <line
            x1="80"
            y1="125"
            x2="220"
            y2="70"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <line
            x1="80"
            y1="125"
            x2="220"
            y2="180"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <line x1="220" y1="70" x2="360" y2="125" stroke="#334155" strokeWidth="1.5" />
          <line x1="220" y1="180" x2="360" y2="125" stroke="#334155" strokeWidth="1.5" />
          <line
            x1="360"
            y1="125"
            x2="480"
            y2="125"
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="5 3"
          />

          {/* Node 1: Requirements Input */}
          <circle cx="80" cy="125" r="22" className="fill-slate-900 stroke-slate-700 stroke-2" />
          <circle cx="80" cy="125" r="4" className="fill-cyan-400 animate-ping" />
          <circle cx="80" cy="125" r="3" className="fill-cyan-400" />
          <text
            x="80"
            y="162"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            className="font-mono"
          >
            User Prompt
          </text>

          {/* Node 2: AST Parser */}
          <circle cx="220" cy="70" r="24" className="fill-slate-900 stroke-cyan-500/60 stroke-2" />
          <path
            d="M 214 70 L 226 70 M 220 64 L 220 76"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
          />
          <text
            x="220"
            y="108"
            textAnchor="middle"
            fill="var(--text-secondary)"
            fontSize="10"
            className="font-mono"
          >
            AST Extractor
          </text>

          {/* Node 3: LLM Refiner */}
          <circle
            cx="220"
            cy="180"
            r="24"
            className="fill-slate-900 stroke-indigo-500/60 stroke-2"
          />
          <circle cx="220" cy="180" r="6" className="fill-indigo-400/20" />
          <circle cx="220" cy="180" r="2" className="fill-indigo-400" />
          <text
            x="220"
            y="218"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            className="font-mono"
          >
            LLM Planner
          </text>

          {/* Node 4: Traceability Matrix */}
          <circle
            cx="360"
            cy="125"
            r="26"
            className="fill-slate-900 stroke-green-500/60 stroke-2"
          />
          <path d="M 352 125 L 357 130 L 368 120" stroke="#22c55e" strokeWidth="2" fill="none" />
          <text
            x="360"
            y="167"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            className="font-mono"
          >
            Traceability
          </text>

          {/* Node 5: Deployment Target */}
          <circle cx="480" cy="125" r="20" className="fill-slate-900 stroke-slate-800 stroke-2" />
          <circle cx="480" cy="125" r="3" className="fill-slate-600" />
          <text
            x="480"
            y="160"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            className="font-mono"
          >
            Sync Target
          </text>
        </svg>
      </div>

      {/* Middle Section: Rotating Stat Card + Live Publish Checklist */}
      <div className="space-y-6 my-auto max-w-lg">
        {/* Rotating Stats */}
        <div className="h-16 relative">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 flex items-center gap-4 p-4 border rounded-xl bg-slate-950/40 backdrop-blur-sm transition-all duration-700 ease-in-out",
                  i === statIndex
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-y-2 scale-95 pointer-events-none",
                )}
              >
                <div className={cn("p-2 rounded-lg bg-slate-900 border", stat.accent)}>
                  <Icon className="size-5" />
                </div>
                <p className="text-slate-200 font-medium text-sm">{stat.text}</p>
              </div>
            );
          })}
        </div>

        {/* Live Publish Gate checklist */}
        <PublishGateAnimation />
      </div>

      {/* Bottom Section: Rotating Quote */}
      <div className="h-32 relative border-t border-slate-900 pt-6">
        {reviewerQuotes.map((q, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              i === quoteIndex
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-4 pointer-events-none",
            )}
          >
            <blockquote className="text-slate-400 italic text-sm leading-relaxed">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <cite className="block mt-2 text-xs font-mono font-semibold text-cyan-400 not-italic">
              &mdash; {q.author}
            </cite>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. RotatingStatCard - rendered inside ShowcasePanel lists
export function RotatingStatCard({
  text,
  icon: Icon,
  accentClass,
}: {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-900 rounded-lg">
      <div className={cn("p-1.5 rounded bg-slate-900 border border-slate-800", accentClass)}>
        <Icon className="size-4" />
      </div>
      <span className="text-xs text-slate-300">{text}</span>
    </div>
  );
}

// 4. PublishGateAnimation (Checklist animation loop)
const checklistItems = [
  "Requirements mapping integrity check",
  "AST blueprint architecture scan",
  "Lizard complexity analysis execution",
  "Bandit vulnerability scanner search",
  "Rubric criteria matrix match validation",
  "Supabase synchronization validation",
  "Production release certificate signoff",
];

export function PublishGateAnimation() {
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % (checklistItems.length + 1));
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-5 border border-slate-800/80 bg-slate-950/40 backdrop-blur-md rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-400">
          Release Gate Checklist
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
          Running Live
        </span>
      </div>

      <div className="space-y-2 h-[160px] overflow-hidden">
        {checklistItems.map((item, idx) => {
          const isPassed = idx < activeItem || activeItem === checklistItems.length;
          const isRunning = idx === activeItem;

          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 text-xs transition-all duration-300",
                isPassed
                  ? "text-slate-400"
                  : isRunning
                    ? "text-cyan-400 font-medium"
                    : "text-slate-600",
              )}
            >
              {isPassed ? (
                <CheckCircle2 className="size-4 text-green-400 shrink-0" />
              ) : isRunning ? (
                <Loader2 className="size-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <div className="size-4 rounded-full border border-slate-800 shrink-0" />
              )}
              <span className="truncate">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. AuthMethodTabs
interface AuthMethodTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function AuthMethodTabs({ activeTab, onChange }: AuthMethodTabsProps) {
  const tabs = [
    { id: "password", label: "Password", icon: Lock },
    { id: "magic", label: "Magic Link", icon: Mail },
    { id: "sso", label: "SSO", icon: Building2 },
    { id: "passkey", label: "Passkey", icon: Key },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-1 p-1 bg-slate-900/60 border border-slate-800 rounded-xl"
      role="tablist"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 text-[10px] sm:text-xs font-semibold rounded-lg transition-all duration-200",
              isActive
                ? "bg-slate-950 text-cyan-400 border border-slate-800/80 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/20",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// 6. PasswordInput
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string | undefined;
  showCapsLockWarning?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label = "Password", error, showCapsLockWarning = true, className, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (showCapsLockWarning) {
        if (e.getModifierState("CapsLock")) {
          setCapsLock(true);
        } else {
          setCapsLock(false);
        }
      }
      if (props.onKeyDown) props.onKeyDown(e);
    };

    return (
      <div className="space-y-1.5 w-full">
        <div className="flex justify-between items-center">
          <Label htmlFor={id} className="text-slate-300 font-medium text-xs">
            {label}
          </Label>
          {capsLock && (
            <span
              className="text-[10px] font-mono text-amber-400 flex items-center gap-1 animate-pulse"
              role="alert"
            >
              <AlertTriangle className="size-3" /> Caps Lock Active
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            id={id}
            type={show ? "text" : "password"}
            ref={ref}
            className={cn(
              "pr-10 bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm",
              error && "border-red-500 focus-visible:ring-red-500",
              className,
            )}
            onKeyDown={handleKeyDown}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error && (
          <span id={`${id}-error`} className="text-[10px] font-medium text-red-400" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

// 7. StrengthMeter & ChecklistChips
export function StrengthMeter({ score }: { score: number }) {
  // score ranges from 0 to 4
  const colors = [
    "bg-slate-800", // 0
    "bg-red-500", // 1
    "bg-amber-500", // 2
    "bg-lime-500", // 3
    "bg-green-500", // 4
  ];

  const labels = ["Weak", "Poor", "Fair", "Good", "Excellent"];

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-semibold">
        <span className="text-slate-500">Password Strength:</span>
        <span
          className={cn(
            score === 1 && "text-red-400",
            score === 2 && "text-amber-400",
            score === 3 && "text-lime-400",
            score === 4 && "text-green-400",
          )}
        >
          {labels[score]}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              score >= step ? colors[score] : "bg-slate-800/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ChecklistChips({
  value,
  requirements = [
    { label: "8+ chars", test: (v: string) => v.length >= 8 },
    { label: "1 number", test: (v: string) => /\d/.test(v) },
    { label: "1 special symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
    { label: "Casing check", test: (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  ],
}: {
  value: string;
  requirements?: Array<{ label: string; test: (v: string) => boolean }>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {requirements.map((req, idx) => {
        const isMatched = req.test(value);
        return (
          <span
            key={idx}
            className={cn(
              "text-[9px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all duration-300",
              isMatched
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-slate-900/30 text-slate-500 border-slate-800",
            )}
          >
            {isMatched ? (
              <Check className="size-2.5 shrink-0" />
            ) : (
              <div className="size-1 rounded-full bg-slate-600 shrink-0" />
            )}
            {req.label}
          </span>
        );
      })}
    </div>
  );
}

// 8. OtpInput
interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string | undefined;
}

export function OtpInput({ value, onChange, error }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const updateRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const focusInput = (index: number) => {
    const nextInput = inputRefs.current[index];
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      focusInput(index - 1);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const val = e.currentTarget.value.replace(/[^0-9]/g, ""); // Only allow digits
    if (!val) return;

    const chars = value.split("");
    // Take the last typed character
    chars[index] = val[val.length - 1] ?? "";
    const nextVal = chars.join("");
    onChange(nextVal);

    if (index < 5) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .trim()
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (pasteData.length === 6) {
      onChange(pasteData);
      focusInput(5);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-between">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const char = value[index] || "";
          return (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              ref={updateRef(index)}
              value={char}
              onChange={() => {}} // Controlled manually via onInput
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={cn(
                "size-12 bg-slate-900 border border-slate-800 text-center font-mono text-xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded-lg",
                error && "border-red-500 focus:ring-red-500",
              )}
              aria-label={`Digit ${index + 1}`}
            />
          );
        })}
      </div>
      {error && (
        <span className="text-[10px] text-red-400 block text-center font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// 9. TwoFactorStep & BackupCodeInput
interface TwoFactorStepProps {
  onVerify: (code: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TwoFactorStep({ onVerify, onCancel, loading }: TwoFactorStepProps) {
  const [code, setCode] = useState("");
  const [showBackup, setShowBackup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    onVerify(code);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto size-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Shield className="size-6" />
        </div>
        <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
        <p className="text-xs text-slate-400">
          {showBackup
            ? "Enter one of your 8-character backup recovery codes."
            : "Open your authenticator app and enter the 6-digit verification code."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {showBackup ? (
          <BackupCodeInput value={code} onChange={setCode} error={error} />
        ) : (
          <OtpInput value={code} onChange={setCode} error={error} />
        )}

        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg py-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Verify Identity"}
          </Button>
          <div className="flex justify-between items-center text-[11px]">
            <button
              type="button"
              onClick={() => {
                setCode("");
                setError("");
                setShowBackup(!showBackup);
              }}
              className="text-slate-400 hover:text-cyan-400 underline"
            >
              {showBackup ? "Use Authenticator App" : "Use Backup Recovery Code"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function BackupCodeInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="backup" className="text-slate-300 font-medium text-xs">
        Backup Recovery Code
      </Label>
      <Input
        id="backup"
        placeholder="XXXX-XXXX"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        maxLength={9}
        className={cn(
          "bg-slate-900 border-slate-800 text-center font-mono font-bold tracking-widest text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg",
          error && "border-red-500 focus-visible:ring-red-500",
        )}
      />
      {error && (
        <span className="text-[10px] text-red-400 block text-center font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// 10. SsoForm & PasskeyButton
export function SsoForm({
  onSubmit,
  loading,
}: {
  onSubmit: (domain: string) => void;
  loading?: boolean;
}) {
  const [domain, setDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    onSubmit(domain);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="ssoDomain" className="text-slate-300 font-medium text-xs">
          Organization Email Domain
        </Label>
        <div className="relative">
          <Input
            id="ssoDomain"
            placeholder="corp.company.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm"
            required
          />
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full border border-slate-800 bg-slate-900 hover:bg-slate-850 text-white font-semibold rounded-lg py-2"
      >
        {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : "Access via Single-Sign-On"}
      </Button>
    </form>
  );
}

export function PasskeyButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full border border-slate-850 bg-slate-900/40 hover:bg-slate-900/80 text-cyan-400 hover:text-cyan-300 font-semibold rounded-lg py-2 flex items-center justify-center gap-2 group transition-all duration-200"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <Key className="size-4 group-hover:scale-110 transition-transform text-cyan-400" />
          <span>Authenticate with Passkey / WebAuthn</span>
        </>
      )}
    </Button>
  );
}

// 11. MagicLinkSent & RateLimitBanner
export function MagicLinkSent({
  email,
  countdown,
  onResend,
}: {
  email: string;
  countdown: number;
  onResend: () => void;
}) {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto size-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 animate-bounce">
        <Mail className="size-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-white">Check Your Mail</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          We sent a passwordless magic link to <strong className="text-slate-200">{email}</strong>.
          Click it to log in instantly.
        </p>
      </div>

      <div className="pt-2">
        {countdown > 0 ? (
          <p className="text-xs font-mono text-slate-500">
            Resend magic link in <strong className="text-slate-400">{countdown}s</strong>
          </p>
        ) : (
          <Button
            onClick={onResend}
            variant="outline"
            size="sm"
            className="border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-900 text-xs"
          >
            Resend Confirmation Email
          </Button>
        )}
      </div>
    </div>
  );
}

export function RateLimitBanner({ errorMsg }: { errorMsg: string }) {
  return (
    <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-lg flex gap-2 items-start animate-shake">
      <AlertTriangle className="size-4 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">Security Alert: Rate Limit Exceeded</p>
        <p className="text-slate-400 mt-0.5">{errorMsg}</p>
      </div>
    </div>
  );
}

// 12. RoleCardGrid
interface RoleCard {
  id: Role;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function RoleCardGrid({
  selected,
  onChange,
}: {
  selected: Role;
  onChange: (role: Role) => void;
}) {
  const cards: RoleCard[] = [
    {
      id: "Student",
      label: "Student",
      desc: "For final-year engineering projects & thesis blueprints.",
      icon: User,
    },
    {
      id: "Faculty",
      label: "Faculty",
      desc: "For reviewing students, rubric scoring, and template controls.",
      icon: Award,
    },
    {
      id: "Startup",
      label: "Startup / Founder",
      desc: "For MVP scoping, compliance prep, and investor reviews.",
      icon: Flame,
    },
    {
      id: "Reviewer",
      label: "External Reviewer",
      desc: "For blind peer reviews, external grading, and rubric validation.",
      icon: Laptop,
    },
    {
      id: "Admin",
      label: "Administrator",
      desc: "Full workspace configuration, logs, and billing controls.",
      icon: Lock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSel = selected === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onChange(card.id)}
            className={cn(
              "flex flex-col items-start text-left p-4 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
              isSel
                ? "bg-slate-900/60 border-cyan-500/80 shadow-[0_0_15px_rgba(34,211,238,0.08)] text-white"
                : "bg-slate-950/20 border-slate-850 text-slate-400 hover:border-slate-800 hover:bg-slate-900/10",
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-lg border mb-3 shrink-0",
                isSel
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  : "bg-slate-900 border-slate-800 text-slate-500",
              )}
            >
              <Icon className="size-4" />
            </div>
            <h4 className="text-xs uppercase tracking-wider font-mono font-semibold">
              {card.label}
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

// 13. GoalChipSelector
export function GoalChipSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const goals = [
    "Final Year Thesis Scoping",
    "Startup MVP Scaffold",
    "Static Code Audit Prep",
    "Rubric Criteria Compliance",
    "Security Analysis Audit",
    "Investor Technical Review",
    "Rubric Model Controls",
    "Multi-repo Scan Mapping",
  ];

  const toggle = (goal: string) => {
    if (selected.includes(goal)) {
      onChange(selected.filter((g) => g !== goal));
    } else {
      onChange([...selected, goal]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300 font-medium text-xs">Primary Workspace Goals</Label>
      <div className="flex flex-wrap gap-1.5">
        {goals.map((goal) => {
          const isSel = selected.includes(goal);
          return (
            <button
              key={goal}
              type="button"
              onClick={() => toggle(goal)}
              className={cn(
                "text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all duration-150 focus:outline-none",
                isSel
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "bg-slate-900/30 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300",
              )}
            >
              {goal}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 14. TeamSizeSelector
export function TeamSizeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    "Solo operator (1)",
    "Small cohort (2-5)",
    "Team size (6-15)",
    "Corporate (16+)",
  ];

  return (
    <div className="space-y-1.5">
      <Label htmlFor="teamSize" className="text-slate-300 font-medium text-xs">
        Team Size & Scale
      </Label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSel = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "p-2.5 border text-[11px] font-semibold rounded-lg text-center transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-cyan-500/30",
                isSel
                  ? "bg-slate-900 border-cyan-500/80 text-cyan-400 shadow-md"
                  : "bg-slate-950/20 border-slate-850 text-slate-500 hover:border-slate-800 hover:bg-slate-900/10",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 15. WorkspaceSlugField & InviteTeammatesField
export function WorkspaceSlugField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="workspaceName" className="text-slate-300 font-medium text-xs">
        Workspace Name & ID Slug
      </Label>
      <Input
        id="workspaceName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Brahma Sandbox Project"
        className={cn(
          "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm",
          error && "border-red-500 focus-visible:ring-red-500",
        )}
      />
      <div className="text-[10px] font-mono text-slate-500">
        Slug URL Preview:{" "}
        <span className="text-cyan-400">
          brahma.dev/ws/
          {value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")}
        </span>
      </div>
      {error && (
        <span className="text-[10px] text-red-400 font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function InviteTeammatesField({
  emails,
  onChange,
}: {
  emails: string[];
  onChange: (vals: string[]) => void;
}) {
  const [val, setVal] = useState("");

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && val.trim()) {
      e.preventDefault();
      const trimmed = val.trim().replace(/,/g, "");
      if (trimmed.includes("@") && !emails.includes(trimmed)) {
        onChange([...emails, trimmed]);
        setVal("");
      }
    }
  };

  const remove = (emailToRemove: string) => {
    onChange(emails.filter((e) => e !== emailToRemove));
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor="inviteEmails" className="text-slate-300 font-medium text-xs">
        Invite Co-Workers / Team (comma separated)
      </Label>
      <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap gap-1.5 min-h-[42px] items-center">
        {emails.map((e) => (
          <span
            key={e}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-850 flex items-center gap-1.5 select-none"
          >
            {e}
            <button
              type="button"
              onClick={() => remove(e)}
              className="text-slate-500 hover:text-red-400 font-bold focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="inviteEmails"
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleAdd}
          placeholder={emails.length === 0 ? "dev@company.com, qa@company.com" : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none"
        />
      </div>
    </div>
  );
}

// 16. InviteCodeField
export function InviteCodeField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const formatCode = (val: string) => {
    // Standard validation formatting: BRH-XXXX-XXXX
    let cleaned = val
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 11)
      .toUpperCase();
    if (cleaned.startsWith("BRH")) {
      if (cleaned.length > 7) {
        cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
      } else if (cleaned.length > 3) {
        cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      }
    } else {
      cleaned = "BRH-" + cleaned;
    }
    onChange(cleaned);
  };

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[11px] font-semibold text-cyan-400/80 hover:text-cyan-400 underline focus:outline-none select-none"
      >
        {isOpen
          ? "Hide Invitation Code Code Input"
          : "Do you have a project invite code? (BRH-XXXX-XXXX)"}
      </button>

      {isOpen && (
        <div className="pt-1.5 animate-fadeIn">
          <Input
            id="inviteCode"
            placeholder="BRH-XXXX-XXXX"
            value={value}
            onChange={(e) => formatCode(e.target.value)}
            className={cn(
              "bg-slate-900 border-slate-800 text-center font-mono font-bold tracking-wider text-white placeholder-slate-600 focus-visible:ring-cyan-500 rounded-lg text-sm",
              error && "border-red-500 focus-visible:ring-red-500",
            )}
            maxLength={13}
          />
          {error && (
            <span
              className="text-[10px] text-red-400 block text-center font-medium mt-1"
              role="alert"
            >
              {error}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// 17. WizardProgressRail
export function WizardProgressRail({
  currentStep,
  totalSteps = 5,
}: {
  currentStep: number;
  totalSteps?: number;
}) {
  const steps = [
    { label: "Account" },
    { label: "Role" },
    { label: "Goals" },
    { label: "Workspace" },
    { label: "Verify" },
  ];

  return (
    <div className="w-full space-y-2 select-none">
      {/* ProgressBar */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-full flex-1 transition-all duration-500",
              idx + 1 <= currentStep ? "bg-cyan-400" : "bg-slate-900 border-l border-slate-950",
            )}
          />
        ))}
      </div>

      {/* Label Matrix */}
      <div className="flex justify-between items-center text-[9px] font-mono font-semibold uppercase text-slate-500">
        {steps.slice(0, totalSteps).map((step, idx) => (
          <span
            key={idx}
            className={cn(
              "transition-colors duration-350",
              idx + 1 === currentStep
                ? "text-cyan-400 font-bold"
                : idx + 1 < currentStep
                  ? "text-slate-400"
                  : "text-slate-600",
            )}
          >
            {idx + 1}. {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// 18. TrustFooter
export function TrustFooter() {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-950/20 py-2 border border-slate-900/60 rounded-xl">
      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
        <Lock className="size-3 text-cyan-500/60" />
        <span>End-to-End Encrypted Secure Gateway</span>
      </div>
      <div className="text-[9px] text-slate-600 leading-normal">
        All AST code analyses & structural blueprints are audited under SOC-2 & ISO/IEC 27001
        guidelines.
      </div>
    </div>
  );
}

// 19. DemoAccessButton
export function DemoAccessButton({
  onSelect,
}: {
  onSelect: (role: "Admin" | "Faculty" | "Student") => void;
}) {
  return (
    <div className="space-y-3 pt-3 border-t border-slate-900 bg-slate-950/20 p-4 rounded-xl border">
      <div className="text-center text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center justify-center gap-1">
        <Zap className="size-3 text-amber-500" />
        <span>Explore Local Demo Workspace</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect("Student")}
          className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-cyan-400 text-xs font-semibold py-1 px-2 rounded-lg"
        >
          Student
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect("Faculty")}
          className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-green-400 text-xs font-semibold py-1 px-2 rounded-lg"
        >
          Faculty
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect("Admin")}
          className="border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-purple-400 text-xs font-semibold py-1 px-2 rounded-lg"
        >
          Admin
        </Button>
      </div>
    </div>
  );
}

// 20. ResendCountdown
export function ResendCountdown({
  initialSeconds = 30,
  onTrigger,
}: {
  initialSeconds?: number;
  onTrigger: () => void;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
    return;
  }, [seconds]);

  if (seconds > 0) {
    return (
      <span className="text-xs text-slate-500 font-mono">
        Resend code in <strong className="text-slate-400">{seconds}s</strong>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setSeconds(initialSeconds);
        onTrigger();
      }}
      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline focus:outline-none"
    >
      Resend Verification Code
    </button>
  );
}

// 21. FieldError
export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-red-400" role="alert">
      <AlertCircle className="size-3 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}
