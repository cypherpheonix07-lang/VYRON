# THREE-STAGE ONBOARDING & WORKSPACE SELECTION FLOW

**Project**: VYRON / ATHER — Engineering Intelligence Platform  

---

## 1. Multi-Step Onboarding Architecture

```mermaid
flowchart TD
  A["Start: /register or Thread 2"] --> B["STAGE 01: IDENTITY"]
  B --> C{"Validated Input?"}
  C -->|No| B1["Display Field Error"]
  C -->|Yes| D["STAGE 02: ROLE & WORKSPACE"]
  D --> E{"Role Selected"}
  E -->|Student| E1["Student Persona (#6DD5FA)"]
  E -->|Faculty| E2["Faculty Persona (#C4B5FD)"]
  E -->|Professional| E3["Professional Persona (#FACC75)"]
  E -->|Admin| E4["Admin Guard (#FC9E9E)"]
  E1 --> F["STAGE 03: PERSONALIZATION & LAUNCH"]
  E2 --> F
  E3 --> F
  E4 --> F
  F --> G["Execute authService.signUp()"]
  G --> H{"Success?"}
  H -->|Yes| I["Redirect to Authorized Dashboard"]
  H -->|No| F1["Display Server Message & Allow Retry"]
```

---

## 2. Role Authorization Boundaries (Zero-Fiction)

1. **Student Role**:
   - Primary Focus: Learning, prototyping, SRS requirements, and architecture modeling.
   - Default Route: `/dashboard/student`
2. **Faculty Role**:
   - Primary Focus: Student progress ledgers, milestone review, and rubric assessments.
   - Default Route: `/dashboard/faculty`
3. **Working Professional Role**:
   - Primary Focus: Production systems, AST forensics, architecture drift, release verification.
   - Default Route: `/dashboard/professional`
4. **Administrator Role**:
   - Primary Focus: Organization settings, platform telemetry, policy-as-code, audit ledger.
   - Default Route: `/admin/command-centre`
   - **Security Invariant**: Client-side selection of Admin role alone NEVER grants administrative rights; server-side profile verification is strictly enforced by `useAuth()` and backend RLS policies.
