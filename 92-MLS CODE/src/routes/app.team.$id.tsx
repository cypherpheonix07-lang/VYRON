import { createFileRoute } from "@tanstack/react-router";
import { ProfileCenterShell } from "@/components/brahma/profile-center";

export const Route = createFileRoute("/app/team/$id")({
  head: () => ({
    meta: [
      { title: "Team Member Profile — PROJECT BRAHMA" },
      {
        name: "description",
        content: "View verified academic credentials and engineering competencies of team members.",
      },
    ],
  }),
  component: TeamMemberProfilePage,
});

function TeamMemberProfilePage() {
  const { id } = Route.useParams();
  return <ProfileCenterShell initialUserId={id} readOnly={true} />;
}
