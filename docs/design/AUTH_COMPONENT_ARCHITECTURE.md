# AUTHENTICATION COMPONENT ARCHITECTURE & INTERFACE SPECIFICATION

**Project**: VYRON / ATHER — Engineering Intelligence Platform  
**Component Directory**: `src/components/auth/`  

---

## 1. Component Hierarchy & Flow

```
[ PremiumAuthShell.tsx ]
├── Top Branding Header (BrahmaLogo & Status)
├── SuspendedIdentityThreads.tsx (Anchor & 3 Hanging Threads)
│   ├── Thread 1: Sign In (#79D9F7)
│   ├── Thread 2: Create Account (#BCA8FF)
│   └── Thread 3: Choose Workspace (#78E0B8)
├── Active State Renderer:
│   ├── [Mode == "signin"]    -> MidnightCoralSignIn.tsx
│   ├── [Mode == "signup"]    -> IndigoAuroraSignUp.tsx (3 Stages)
│   └── [Mode == "workspace"] -> WorkspaceSelectionModal.tsx
└── GraphiteOceanShowcase.tsx (Right-Column Product Preview)
    ├── Architecture Diagram Simulation View
    └── Interactive 4-Capability Tab Switcher
```

---

## 2. Component Specifications

### 2.1 `SuspendedIdentityThreads.tsx`
- **Props**:
  - `activeMode: "signin" | "signup" | "workspace"`
  - `onSelectMode: (mode: AuthThreadMode) => void`
  - `completedStages?: { signin?: boolean; signup?: boolean; workspace?: boolean }`
- **Features**:
  - Upper anchor horizontal beam with gradient opacity.
  - Three vertical cords (active: dynamic colored glow; inactive: muted border).
  - Hanging cards with hover lift (-2px translation), active top colored border, and completion badges.
  - Full keyboard accessibility: tab-stops and enter/space activation.

### 2.2 `MidnightCoralSignIn.tsx`
- **Props**:
  - `onSuccess: (destination?: string) => void`
  - `onSwitchToSignUp: () => void`
  - `onSwitchToWorkspace?: () => void`
- **Features**:
  - Email & password inputs with custom show/hide toggle.
  - "Forgot password?" modal/view with live reset instructions.
  - Real OAuth buttons (Google, GitHub) connected to `authService`.
  - Demo access button for isolated god-mode testing without network blockers.

### 2.3 `IndigoAuroraSignUp.tsx`
- **Props**:
  - `onSuccess: (destination?: string) => void`
  - `onSwitchToSignIn: () => void`
  - `onSwitchToWorkspace?: () => void`
- **Features**:
  - Stage 1 (Identity): Full Name, Email, Password with real-time strength bar.
  - Stage 2 (Role & Workspace): Student, Faculty, Professional, Admin cards; Organization input; Workspace slug.
  - Stage 3 (Launch): Primary Focus selection (AST Forensics, Digital Twin, CI/CD, Agent Command), confirmation card, and one-click launch via `authService.signUp()`.
  - State preservation across forward and backward step transitions.

### 2.4 `WorkspaceSelectionModal.tsx`
- **Props**:
  - `onSelectWorkspace: (role: Role, workspaceId?: string) => void`
- **Features**:
  - Role-specific cards with dedicated accents.
  - Displays relevant destinations for each workspace.
  - Server-side privilege check: Blocks non-admins from claiming Admin command centre.
  - Resolves destination using `resolvePostLoginRoute(role)`.

### 2.5 `GraphiteOceanShowcase.tsx`
- **Features**:
  - Real product capabilities (12-Stage Forensics & AST, 18 BRAHMA Systems, Architecture Drift, 25-Gate Verification).
  - Real-time simulated telemetry node preview (AST, Twin, Gate).
  - Zero false metrics, zero synthetic passes.
