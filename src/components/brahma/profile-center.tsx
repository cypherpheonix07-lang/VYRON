import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Camera,
  Check,
  AlertCircle,
  Link as LinkIcon,
  GraduationCap,
  Briefcase,
  Shield,
  Eye,
  Globe,
  Clock,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/brahma/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, type Role } from "@/lib/auth";
import { uploadAvatarImage } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";

export interface ProfileFormData {
  full_name: string;
  display_name: string;
  email: string;
  role: Role;
  title: string;
  department: string;
  register_number: string;
  timezone: string;
  avatar_url?: string;
  goals: string[];
  proficiency: string;
  milestone_deadline?: string;
  linked_urls: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    resume?: string;
  };
  privacy: {
    visibility: "workspace" | "admin";
    showEmail: boolean;
    showActivity: boolean;
  };
}

// 1. Completeness Ring & Checklist
export function CompletenessRing({ data }: { data: ProfileFormData }) {
  const checklist = useMemo(() => {
    return [
      { key: "full_name", label: "Full Name", done: !!data.full_name.trim() },
      { key: "display_name", label: "Display Name", done: !!data.display_name.trim() },
      { key: "title", label: "Professional Title", done: !!data.title.trim() },
      { key: "department", label: "Department / Org", done: !!data.department.trim() },
      { key: "register_number", label: "Register Number", done: !!data.register_number.trim() },
      { key: "avatar_url", label: "Avatar Photo", done: !!data.avatar_url },
      { key: "github", label: "GitHub Profile", done: !!data.linked_urls.github },
      { key: "linkedin", label: "LinkedIn URL", done: !!data.linked_urls.linkedin },
      { key: "goals", label: "Project Goals", done: (data.goals || []).length > 0 },
    ];
  }, [data]);

  const completedCount = checklist.filter((c) => c.done).length;
  const percentage = Math.round((completedCount / checklist.length) * 100);

  // SVG ring math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-xl border border-border/80 bg-zinc-950/40 p-4 space-y-4">
      <div className="flex items-center gap-3.5">
        <div className="relative size-20 shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 76 76">
            <circle
              cx="38"
              cy="38"
              r={radius}
              className="stroke-secondary/60"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="38"
              cy="38"
              r={radius}
              className="stroke-primary transition-all duration-700 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-extrabold text-foreground">{percentage}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Profile Health
          </h4>
          <p className="text-xs font-medium text-foreground">
            {completedCount} of {checklist.length} items complete
          </p>
          <p className="text-[10px] text-muted-foreground">
            {percentage === 100
              ? "Profile fully optimized!"
              : "Complete remaining items to unlock verified badge."}
          </p>
        </div>
      </div>

      <div className="border-t border-border/40 pt-3 space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
          Completeness Checklist
        </p>
        {checklist.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-xs py-0.5">
            <span className={item.done ? "text-muted-foreground" : "text-foreground font-medium"}>
              {item.label}
            </span>
            {item.done ? (
              <span className="flex items-center text-[11px] text-[var(--success)] font-medium">
                <Check className="size-3 mr-1" /> Done
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/60 font-mono">Missing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Avatar Uploader
export function AvatarUploader({
  avatarUrl,
  onUploadSuccess,
  userId,
}: {
  avatarUrl?: string | undefined;
  onUploadSuccess: (url: string) => void;
  userId: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(avatarUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size exceeds 2MB limit.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadAvatarImage(file, userId);
      setPreview(url);
      onUploadSuccess(url);
      toast.success("Avatar image updated successfully.");
    } catch (err) {
      toast.error((err as Error).message || "Failed to upload avatar image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative group size-16 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 bg-secondary/60">
        {preview ? (
          <img src={preview} alt="Avatar" className="size-full object-cover" />
        ) : (
          <div className="size-full grid place-items-center text-muted-foreground">
            <User className="size-8" />
          </div>
        )}
        <label
          htmlFor="avatar-input"
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="avatar-input"
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          {uploading ? "Uploading..." : "Upload new photo"}
        </label>
        <p className="text-[10px] text-muted-foreground">
          Recommended: 400x400 JPG/PNG. Maximum size 2MB.
        </p>
      </div>
    </div>
  );
}

// 3. Profile Center Main Shell
export function ProfileCenterShell() {
  const { user, refresh } = useAuth();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    display_name: "",
    email: "",
    role: "Student",
    title: "Software Engineering Student",
    department: "Computer Science & Engineering",
    register_number: "21CS084",
    timezone: "Asia/Kolkata",
    avatar_url: "",
    goals: ["Build Startup MVP", "Learn Architecture"],
    proficiency: "Intermediate",
    linked_urls: {
      github: "https://github.com/brahma-developer",
      linkedin: "https://linkedin.com/in/brahma-developer",
      portfolio: "https://brahma.dev",
      resume: "",
    },
    privacy: {
      visibility: "workspace",
      showEmail: true,
      showActivity: true,
    },
  });

  // Load from current user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.name || prev.full_name,
        display_name: user.name || prev.display_name,
        email: user.email || prev.email,
        role: user.role || prev.role,
        avatar_url: user.avatarUrl || prev.avatar_url || "",
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user?.id && !user.isDemo) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            display_name: formData.display_name,
            title: formData.title,
            department: formData.department,
            register_number: formData.register_number,
            timezone: formData.timezone,
            avatar_url: formData.avatar_url,
            goals: formData.goals,
            proficiency: formData.proficiency,
            linked_urls: formData.linked_urls,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) throw error;
      }

      // Also persist to demo local storage if in demo mode
      if (user) {
        const updated = {
          ...user,
          name: formData.display_name || formData.full_name,
          avatarUrl: formData.avatar_url,
        };
        localStorage.setItem("brahma.demo_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      }

      await refresh();
      toast.success("Profile saved successfully.", {
        description: "All identity details, academic records, and privacy preferences are updated.",
      });
    } catch (err) {
      toast.error((err as Error).message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Form Sections */}
      <div className="lg:col-span-2 space-y-6">
        {/* Section 1: Identity */}
        <SectionCard
          title="Personal Identity"
          description="Your public name, avatar, and timezone."
        >
          <div className="space-y-4">
            <AvatarUploader
              avatarUrl={formData.avatar_url}
              userId={user?.id || "guest"}
              onUploadSuccess={(url) => setFormData((f) => ({ ...f, avatar_url: url }))}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs">
                  Full Legal Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.full_name}
                  onChange={(e) => setFormData((f) => ({ ...f, full_name: e.target.value }))}
                  className="text-xs bg-background/50"
                  placeholder="e.g. Phanindra Sharma"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-xs">
                  Display Handle / Alias
                </Label>
                <Input
                  id="displayName"
                  value={formData.display_name}
                  onChange={(e) => setFormData((f) => ({ ...f, display_name: e.target.value }))}
                  className="text-xs bg-background/50"
                  placeholder="e.g. phanindra"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  Primary Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="text-xs bg-secondary/40 cursor-not-allowed opacity-80"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs">
                  Timezone (Audit rendering)
                </Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(tz) => setFormData((f) => ({ ...f, timezone: tz }))}
                >
                  <SelectTrigger id="timezone" className="text-xs">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST -05:00)</SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      America/Los_Angeles (PST -08:00)
                    </SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT +00:00)</SelectItem>
                    <SelectItem value="Asia/Singapore">Asia/Singapore (SGT +08:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Academic / Professional */}
        <SectionCard
          title="Academic & Professional Context"
          description="Institutional credentials and linked portfolio URLs."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs">
                  Workspace Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(r) => setFormData((f) => ({ ...f, role: r as Role }))}
                >
                  <SelectTrigger id="role" className="text-xs">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Reviewer">Reviewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs">
                  Professional Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  className="text-xs bg-background/50"
                  placeholder="e.g. Lead Architect"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regNo" className="text-xs">
                  Register / Roll Number
                </Label>
                <Input
                  id="regNo"
                  value={formData.register_number}
                  onChange={(e) => setFormData((f) => ({ ...f, register_number: e.target.value }))}
                  className="text-xs bg-background/50"
                  placeholder="e.g. 21CS084"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs">
                Department / Organization
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData((f) => ({ ...f, department: e.target.value }))}
                className="text-xs bg-background/50"
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <div className="border-t border-border/40 pt-3 space-y-3">
              <p className="text-xs font-semibold text-foreground">Linked Professional URLs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ghUrl" className="text-[11px] text-muted-foreground">
                    GitHub Profile
                  </Label>
                  <Input
                    id="ghUrl"
                    value={formData.linked_urls.github || ""}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        linked_urls: { ...f.linked_urls, github: e.target.value },
                      }))
                    }
                    className="text-xs bg-background/50"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="liUrl" className="text-[11px] text-muted-foreground">
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="liUrl"
                    value={formData.linked_urls.linkedin || ""}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        linked_urls: { ...f.linked_urls, linkedin: e.target.value },
                      }))
                    }
                    className="text-xs bg-background/50"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Privacy & Visibility */}
        <SectionCard
          title="Privacy & Sharing"
          description="Control what information is visible to workspace peers."
        >
          <div className="space-y-3 divide-y divide-border/40">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-medium text-foreground">Public Workspace Visibility</p>
                <p className="text-[10px] text-muted-foreground">
                  Allow team members to view your blueprint activity.
                </p>
              </div>
              <Switch
                checked={formData.privacy.visibility === "workspace"}
                onCheckedChange={(checked) =>
                  setFormData((f) => ({
                    ...f,
                    privacy: { ...f.privacy, visibility: checked ? "workspace" : "admin" },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-medium text-foreground">Display Email Address</p>
                <p className="text-[10px] text-muted-foreground">
                  Show your verified work email in team directory.
                </p>
              </div>
              <Switch
                checked={formData.privacy.showEmail}
                onCheckedChange={(checked) =>
                  setFormData((f) => ({
                    ...f,
                    privacy: { ...f.privacy, showEmail: checked },
                  }))
                }
              />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-5"
          >
            {saving ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Save className="mr-2 size-3.5" />
            )}
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Right Col: Completeness & Health Ring */}
      <div>
        <CompletenessRing data={formData} />
      </div>
    </div>
  );
}
