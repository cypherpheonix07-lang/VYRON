# 05 — Fix Ledger & Implementation Log

## 1. Summary of Applied Patches
All patches applied adhere strictly to the Minimal Safe Scope principle. Zero raw SQL interpolation introduced; zero security bypasses applied.

---

## 2. Itemized File-by-File Change Ledger

### 1. `src/lib/db/types.ts`
- **Location**: Line 128
- **Change**: Added and exported `isValidUuid` helper function.
- **Diff**:
  ```diff
  +export function isValidUuid(id: string | null | undefined): boolean {
  +  if (!id || typeof id !== "string") return false;
  +  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  +}
  ```

### 2. `src/lib/db/profiles.ts`
- **Location**: Lines 9–25
- **Change**: Imported `isValidUuid` and bypassed remote PostgREST query when `userId` is non-UUID format.
- **Diff**:
  ```diff
   import { supabase } from "@/lib/supabaseClient";
  -import type { UserProfileRow, Designation } from "./types";
  +import { isValidUuid, type UserProfileRow, type Designation } from "./types";

   export async function getProfile(userId: string): Promise<UserProfileRow | null> {
     if (!userId) return null;
  +  if (!isValidUuid(userId)) {
  +    const { data: sessionData } = await supabase.auth.getSession();
  +    const u = sessionData?.session?.user;
  +    if (u && u.id === userId) {
  +      return { id: u.id, email: u.email || "", ... };
  +    }
  +    return null;
  +  }
  ```

### 3. `src/lib/db/students.ts`
- **Location**: Lines 12–25
- **Change**: Guarded `supabase.from("student_data")` query with `isValidUuid(userId)`.
- **Diff**:
  ```diff
  -  const { data, error } = await supabase.from("student_data").select("*").eq("user_id", userId).maybeSingle();
  +  if (isValidUuid(userId)) {
  +    const { data, error } = await supabase.from("student_data").select("*").eq("user_id", userId).maybeSingle();
  +    if (!error && data) { ... }
  +  }
  ```

### 4. `src/lib/db/faculty.ts`
- **Location**: Lines 12–25
- **Change**: Guarded `supabase.from("faculty_data")` query with `isValidUuid(userId)`.
- **Diff**:
  ```diff
  -  const { data, error } = await supabase.from("faculty_data").select("*").eq("user_id", userId).maybeSingle();
  +  if (isValidUuid(userId)) {
  +    const { data, error } = await supabase.from("faculty_data").select("*").eq("user_id", userId).maybeSingle();
  +    if (!error && data) { ... }
  +  }
  ```

### 5. `src/lib/db/professionals.ts`
- **Location**: Lines 12–25
- **Change**: Guarded `supabase.from("professional_data")` query with `isValidUuid(userId)`.
- **Diff**:
  ```diff
  -  const { data, error } = await supabase.from("professional_data").select("*").eq("user_id", userId).maybeSingle();
  +  if (isValidUuid(userId)) {
  +    const { data, error } = await supabase.from("professional_data").select("*").eq("user_id", userId).maybeSingle();
  +    if (!error && data) { ... }
  +  }
  ```

### 6. `src/lib/db/forms.ts`
- **Location**: Lines 185–200
- **Change**: Guarded `getUserForms` Supabase query with `isValidUuid(userId)`.
- **Diff**:
  ```diff
  -  const { data, error } = await supabase.from("forms").select("*").eq("created_by", userId);
  +  if (isValidUuid(userId)) {
  +    const { data, error } = await supabase.from("forms").select("*").eq("created_by", userId);
  +    if (!error && Array.isArray(data) && data.length > 0) { ... }
  +  }
  ```

### 7. `07 — BACKEND SERVICE MESH/vyron-engine/tests/test_endpoints.py`
- **Location**: Entire file
- **Change**: Refactored test cases to inherit from `unittest.TestCase`.
- **Diff**:
  ```diff
  +class VyronEndpointTests(unittest.TestCase):
  +    def test_health(self):
  +        response = client.get("/health")
  +        self.assertEqual(response.status_code, 200)
  +        self.assertEqual(response.json()["status"], "healthy")
  +    ...
  ```

### 8. `51 — TESTING PLATFORM/scripts/testing/run-two-phase-verification.mjs`
- **Location**: Line 239
- **Change**: Fixed `TEST-P1-07` entrypoint execution using `npx tsx` and root proxy script.

### 9. `.gitignore`
- **Location**: Lines 13–20
- **Change**: Added `.env`, `.venv/`, `__pycache__/`, and `*.pyc` to prevent accidental credential or artifact tracking.

### 10. `51 — TESTING PLATFORM/scripts/testing/verify-gates.js` & `05 — FRONTEND PLATFORM/verify-step1-8.mjs`
- **Location**: Lines 4–10
- **Change**: Safe `.env` file resolution using `fs.existsSync("./.env") ? "./.env" : fs.existsSync("./.env.example") ? "./.env.example" : null` with fallback to `process.env`. Eliminates ENOENT crash when running `npm test` and `npm run verify`.

### 11. `src/routes/app.search.tsx`
- **Location**: Lines 95–115
- **Change**: Removed `setExecutionTimeMs` and `performance.now()` invocations from inside `useMemo`. Resolves `react-hooks/set-state-in-render` and `react-hooks/purity` errors.

### 12. `src/routes/admin.command-centre.tsx`
- **Location**: Lines 830–836
- **Change**: Replaced impure `Date.now()` during render with deterministic fallback, and safely narrowed timestamp type for `new Date((log.created_at || log.timestamp) as string)`.

### 13. React 19 Hook Lifecycle & Dependency Alignments
- **Files**:
  - `src/contexts/LiveProjectContext.tsx`: Localized ref references prior to effect cleanup to guarantee immutable ref teardown.
  - `src/hooks/useProjects.ts`: Localized `requestVersion.current` ref reference prior to cleanup.
  - `src/routes/app.deployments.tsx`: Included `activeTab` in `useEffect` dependency array.
  - `src/routes/dashboard.student.tsx`: Imported `useCallback`, wrapped `loadData` in `useCallback(..., [user])`, and added `loadData` to effect dependency arrays.
  - `src/routes/dashboard.faculty.tsx`: Imported `useCallback`, wrapped `loadData` in `useCallback(..., [user])`, and added `loadData` to effect dependency arrays.
  - `src/routes/dashboard.professional.tsx`: Imported `useCallback`, wrapped `loadData` in `useCallback(..., [user])`, and added `loadData` to effect dependency arrays.
