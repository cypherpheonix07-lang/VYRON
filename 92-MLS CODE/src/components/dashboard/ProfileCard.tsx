import React, { useState } from "react";
import {
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  Loader2,
  Sparkles,
  GraduationCap,
  BookOpen,
  Briefcase,
  Building,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateProfile } from "@/lib/db/profiles";
import type { Designation, UserProfileRow } from "@/lib/db/types";

export interface ProfileCardProps {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  profile: Partial<UserProfileRow> | null;
  designation: Designation;
  customDetails?: {
    label: string;
    value: string | number | undefined;
  }[];
  onProfileUpdated?: () => void;
}

export function ProfileCard({
  user,
  profile,
  designation,
  customDetails = [],
  onProfileUpdated,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || user.name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");

  // Compute profile completion score
  const calculateCompletion = () => {
    let score = 30; // base for email + account
    if (fullName.trim()) score += 20;
    if (avatarUrl.trim()) score += 10;
    if (profile?.designation) score += 20;
    if (customDetails.length > 0 && customDetails.some((d) => d.value)) score += 20;
    return Math.min(score, 100);
  };

  const completionScore = calculateCompletion();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      toast.error((err as Error).message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getDesignationBadge = () => {
    switch (designation) {
      case "student":
        return {
          label: "Student Scholar",
          icon: GraduationCap,
          className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        };
      case "faculty":
        return {
          label: "Faculty Educator",
          icon: BookOpen,
          className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        };
      case "professional":
        return {
          label: "Working Professional",
          icon: Briefcase,
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "admin":
        return {
          label: "Platform Admin",
          icon: Building,
          className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
      default:
        return {
          label: "Verified User",
          icon: UserIcon,
          className: "bg-zinc-800 text-zinc-300 border-zinc-700",
        };
    }
  };

  const badge = getDesignationBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="rounded-xl border border-border/60 bg-zinc-900/40 backdrop-blur-sm p-6 relative overflow-hidden group">
      {/* Background ambient corner glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border/40">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName || user.email}
                className="h-16 w-16 rounded-xl object-cover border-2 border-border shadow-md"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-border flex items-center justify-center text-xl font-bold text-foreground">
                {(fullName || user.email).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-zinc-950 stroke-[3]" />
            </div>
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {fullName || "Personalize Name"}
              </h2>
              <Badge variant="outline" className={`text-xs py-0.5 px-2 flex items-center gap-1 ${badge.className}`}>
                <BadgeIcon className="h-3 w-3" />
                {badge.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Mail className="h-3 w-3 text-muted-foreground/80" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Action Toggle */}
        <div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs h-8 gap-1.5 border-border/60 hover:bg-zinc-800"
            >
              <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs h-8 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="text-xs h-8 gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editing Drawer / Inputs */}
      {isEditing && (
        <div className="my-4 p-4 rounded-lg bg-zinc-950/60 border border-border/60 space-y-3 animate-in fade-in-50 duration-200">
          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Quick Edit Basic Info
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="h-8 text-xs bg-zinc-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Avatar URL (Optional)</label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-8 text-xs bg-zinc-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Meter */}
      <div className="mt-4 pt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            Profile Strength
            {completionScore === 100 ? (
              <span className="text-emerald-400 font-semibold">(Verified Complete)</span>
            ) : (
              <span className="text-amber-400 font-semibold">(Action Required)</span>
            )}
          </span>
          <span className="font-bold text-foreground">{completionScore}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              completionScore === 100
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                : "bg-gradient-to-r from-amber-500 to-cyan-500"
            }`}
            style={{ width: `${completionScore}%` }}
          />
        </div>
      </div>

      {/* Custom Contextual Details */}
      {customDetails.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {customDetails.map((detail, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/40 border border-border/30">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                {detail.label}
              </span>
              <span className="font-semibold text-foreground truncate block mt-0.5">
                {detail.value || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
