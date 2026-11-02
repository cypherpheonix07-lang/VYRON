# AUTHENTICATION BACKEND INTEGRATION & SESSION LIFECYCLE REPORT

**Project**: VYRON / ATHER — Engineering Intelligence Platform  
**Integration Scope**: Supabase Client SDK, OAuth Handlers, Profile Creation, and Offline Demo Guard  

---

## 1. Backend Service Layer (`authService.ts`)

- **Law 1**: Exclusive integration with Supabase Auth via parameterized SDK calls; zero raw string SQL interpolation.
- **Law 2**: No method throws unhandled exceptions; all methods return deterministic `AuthResponse<T>`.
- **OAuth Providers**:
  - Google OAuth (`authService.signInWithGoogle`)
  - GitHub OAuth (`authService.signInWithGithub`)
  - GitLab OAuth (`authService.signInWithGitlab`)
- **Offline Fallback Guard**:
  - Cloud Supabase rate limits or key pause scenarios are automatically isolated into the local session fallback mode.
  - Zero synthetic green badges; isolation is truthfully recorded.

---

## 2. Session Persistence & Profile Bootstrapping

- Client-safe profile synchronization executes via `ensureProfile()` in `src/lib/auth.ts`.
- Destination routing resolved deterministically via `resolvePostLoginRoute(role)`:
  - Student -> `/dashboard/student`
  - Faculty -> `/dashboard/faculty`
  - Professional -> `/dashboard/professional`
  - Admin -> `/admin/command-centre` (strictly validated against server record)
