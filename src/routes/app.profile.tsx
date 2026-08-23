import { createFileRoute } from "@tanstack/react-router";
import { ProfileCenterShell } from "@/components/brahma/profile-center";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile Center — PROJECT BRAHMA" },
      {
        name: "description",
        content: "Manage your academic persona, engineering DNA, and privacy controls.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return <ProfileCenterShell readOnly={false} />;
}
