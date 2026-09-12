/**
 * PROJECT BRAHMA — APP CHAT ROUTE (FL-03-A)
 * Dedicated full-screen route for Brahma Intelligence Copilot.
 */

import { createFileRoute } from "@tanstack/react-router";
import { ChatShell } from "@/components/chat/ChatShell";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Brahma Intelligence Copilot — PROJECT BRAHMA" },
      {
        name: "description",
        content:
          "Dual-mode AI Copilot for architectural analysis, static code review, and release gate governance.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="h-[calc(100vh-80px)] p-4 max-w-5xl mx-auto">
      <ChatShell />
    </div>
  );
}
