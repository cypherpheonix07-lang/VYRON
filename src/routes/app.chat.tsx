/**
 * PROJECT BRAHMA — FULL-SCREEN COPILOT INTELLIGENCE STUDIO ROUTE
 * Dedicated command center for Brahma AI Copilot.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CopilotFullScreenStudio } from "@/components/copilot/CopilotFullScreenStudio";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "ATHER Chatbot Studio — VYRON" },
      {
        name: "description",
        content:
          "Conversational command center for ATHER Chatbot: live project intelligence, natural dialogue, grounded evidence, and real-time execution governance.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <CopilotFullScreenStudio />
    </div>
  );
}
