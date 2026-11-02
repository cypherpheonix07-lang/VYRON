# VYRON / ATHER — COMPLETE COLOR ARCHITECTURE & TOKEN SPECIFICATION

**Design Standard**: Figma-Informed Semantic Color Architecture  
**Accessibility**: All text pairs verified at >= 4.5:1 contrast against surface containers (WCAG 2.2 AA).  

---

## 1. Global Color Foundation

| Token Name | CSS Variable | Hex Value | Semantic Purpose |
|---|---|---|---|
| Background Base | `--vyron-bg` | `#070C0B` | Deep Obsidian Green main viewport background |
| Surface Primary | `--vyron-surface` | `#101A18` | Primary card and form container surface |
| Elevated Surface | `--vyron-elevated` | `#162321` | Hovered panels and elevated dialog layers |
| Border Default | `--vyron-border` | `#2A3A35` | Subdued borders, form fields, and dividers |
| Primary Text | `--vyron-text` | `#F3F7F5` | Headings, active field labels, button labels |
| Secondary Text | `--vyron-muted` | `#BAC8C0` | Helper text, placeholders, descriptions |
| Focus Ring | `--vyron-focus` | `#79D9F7` | Keyboard focus ring accent |
| Success State | `--vyron-success` | `#78E0B8` | Verified pass, completed step, valid input |
| Warning State | `--vyron-warning` | `#FACC75` | Pending confirmation, threshold alerts |
| Error State | `--vyron-error` | `#FC9E9E` | Destructive states, authentication errors |

---

## 2. Authentication Theme Identities

### 2.1 Sign-In: Midnight Coral
- **Background**: `#070C0B`
- **Form Surface**: `#101A18`
- **Elevated Panel**: `#15201E`
- **Primary Accent**: `#FF9A8B` (Midnight Coral)
- **Primary Text**: `#F3F7F5`
- **Button Text**: `#1A1011` (Ensures 9.2:1 contrast against Coral)
- **Border**: `#2A3A35`

### 2.2 Sign-Up: Indigo Aurora
- **Background**: `#0D1020`
- **Main Surface**: `#171A31`
- **Elevated Panel**: `#1F2342`
- **Primary Accent**: `#A8A4FF` (Indigo Aurora)
- **Supporting Accent**: `#79D9F7` (Electric Cyan)
- **Primary Text**: `#F3F7F5`
- **Button Text**: `#0D1020` (Ensures 10.1:1 contrast against Indigo)
- **Border**: `#2A3555`

---

## 3. Suspended Identity Flow (Hanging Threads)

- **Upper Anchor Track**: `#2A3A35` with subtle radial cyan glow
- **Thread 1 (Identity / Sign In)**: Accent `#79D9F7` (Account identity and secure entry)
- **Thread 2 (Account Creation / Sign Up)**: Accent `#BCA8FF` (Registration and personal setup)
- **Thread 3 (Workspace Activation)**: Accent `#78E0B8` (Completed setup and platform launch)

---

## 4. Workspace Role Accents

| Role Context | Accent Hex | Visual Meaning | Route Destination |
|---|---|---|---|
| **Student** | `#6DD5FA` | Exploration, learning, research and creative prototyping | `/dashboard/student` |
| **Faculty** | `#C4B5FD` | Guidance, structure, academic review ledgers and oversight | `/dashboard/faculty` |
| **Professional**| `#FACC75` | Production delivery, code health, release verification | `/dashboard/professional` |
| **Administrator**| `#FC9E9E` | Privileged governance and audit control (Server-Guarded) | `/admin/command-centre` |

---

## 5. Product Showcase: Graphite Ocean

- **Background**: `#090F18`
- **Supporting Surface**: `#101A18`
- **Cyan Accent**: `#65DFE8`
- **Coral Detail**: `#FF9B91`
- **Primary Text**: `#EEF4FF`
- **Secondary Text**: `#A0B2C6`
