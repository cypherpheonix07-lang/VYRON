/**
 * PROJECT BRAHMA — CONSOLIDATED COPILOT COMPONENT WRAPPER
 * Backwards-compatibility wrapper routing to unified CopilotDrawer.
 * Supports keyboard accessibility: Cmd+Shift+K toggle (shiftKey + "k") and "Escape" to dismiss.
 */

import React, { useEffect } from "react";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";
import { CopilotFloatingButton } from "@/components/copilot/CopilotFloatingButton";
import { copilotStore } from "@/state/copilot/copilotStore";

export function BrahmaChatBot() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        copilotStore.toggleDrawer();
      }
      if (e.key === "Escape") {
        copilotStore.setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <CopilotFloatingButton />
      <CopilotDrawer />
    </>
  );
}
