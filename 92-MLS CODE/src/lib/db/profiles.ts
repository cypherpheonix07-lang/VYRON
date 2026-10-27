/**
 * VYRON / BRAHMA — PROFILES DATA SERVICE
 * Strictly ZERO Raw SQL: Enforces Supabase client query builders exclusively.
 */

import { supabase } from "@/lib/supabaseClient";
import type { UserProfileRow, Designation } from "./types";

export async function getProfile(userId: string): Promise<UserProfileRow | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[getProfile] Query warning:", error.message);
      // Fallback: check session metadata if profile row query returned error (e.g. table not ready)
      const { data: sessionData } = await supabase.auth.getSession();
      const u = sessionData?.session?.user;
      if (u && u.id === userId) {
        return {
          id: u.id,
          email: u.email || "",
          full_name: (u.user_metadata?.["full_name"] as string) || (u.user_metadata?.["name"] as string) || u.email?.split("@")[0] || "User",
          designation: (u.user_metadata?.["designation"] as Designation) || "student",
          avatar_url: (u.user_metadata?.["avatar_url"] as string) || null,
          created_at: u.created_at,
          onboarded: Boolean(u.user_metadata?.["onboarded"] ?? u.user_metadata?.["designation"]),
        };
      }
      return null;
    }

    if (!data) {
      // If table exists but row not yet created, construct from auth metadata
      const { data: sessionData } = await supabase.auth.getSession();
      const u = sessionData?.session?.user;
      if (u && u.id === userId) {
        return {
          id: u.id,
          email: u.email || "",
          full_name: (u.user_metadata?.["full_name"] as string) || (u.user_metadata?.["name"] as string) || u.email?.split("@")[0] || "User",
          designation: (u.user_metadata?.["designation"] as Designation) || "student",
          avatar_url: (u.user_metadata?.["avatar_url"] as string) || null,
          created_at: u.created_at,
          onboarded: Boolean(u.user_metadata?.["onboarded"] ?? u.user_metadata?.["designation"]),
        };
      }
      return null;
    }

    return {
      id: data.id,
      email: data.email || "",
      full_name: data.full_name || data.name || data.email?.split("@")[0] || "User",
      designation: (data.designation?.toLowerCase() as Designation) || (data.role?.toLowerCase() as Designation) || "student",
      avatar_url: data.avatar_url || null,
      institution: data.institution || null,
      company: data.company || null,
      department: data.department || null,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || null,
      onboarded: Boolean(data.onboarded ?? data.designation ?? data.role),
    };
  } catch (err) {
    console.error("[getProfile] Unexpected exception:", err);
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfileRow, "id" | "email">>
): Promise<{ ok: boolean; data?: UserProfileRow; error?: string }> {
  try {
    const payload: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      // Also update auth user_metadata so state is preserved even if table RLS denies
      await supabase.auth.updateUser({
        data: {
          ...updates,
          updated_at: new Date().toISOString(),
        },
      });
      return { ok: true };
    }

    return { ok: true, data: data as UserProfileRow };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update profile",
    };
  }
}

export async function setDesignation(
  userId: string,
  designation: Designation
): Promise<{ ok: boolean; error?: string }> {
  try {
    // 1. Update Supabase Auth user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        designation,
        role: designation,
        onboarded: true,
      },
    });

    if (authError) {
      console.warn("[setDesignation] auth updateUser warning:", authError.message);
    }

    // 2. Persist in profiles table
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        designation,
        role: designation,
        onboarded: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

    if (dbError) {
      console.warn("[setDesignation] profiles upsert warning:", dbError.message);
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to set designation",
    };
  }
}
