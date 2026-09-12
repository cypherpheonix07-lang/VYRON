import { useState, useEffect, useCallback } from "react";
import { copilotStore, CopilotState, CopilotMessage, AIModelType } from "./copilotStore";
import { useAppMode } from "../mode/useAppMode";

export function useCopilot() {
  const { mode } = useAppMode();
  const [copilotState, setCopilotState] = useState<CopilotState>(() => copilotStore.getState());

  useEffect(() => {
    return copilotStore.subscribe((newState) => {
      setCopilotState({ ...newState });
    });
  }, []);

  const currentSession = mode === "NORMAL" ? copilotState.normalSession : copilotState.demoSession;

  const setDrawerOpen = useCallback((isOpen: boolean) => {
    copilotStore.setDrawerOpen(isOpen);
  }, []);

  const setModel = useCallback(
    (model: AIModelType) => {
      copilotStore.setModel(mode, model);
    },
    [mode],
  );

  const sendMessage = useCallback(
    (text: string, metadata?: CopilotMessage["metadata"]) => {
      copilotStore.addMessage(mode, {
        sender: "USER",
        text,
        metadata,
      });
    },
    [mode],
  );

  const addAssistantMessage = useCallback(
    (text: string, metadata?: CopilotMessage["metadata"]) => {
      return copilotStore.addMessage(mode, {
        sender: "ASSISTANT",
        text,
        metadata,
      });
    },
    [mode],
  );

  const setLoading = useCallback(
    (isLoading: boolean) => {
      copilotStore.setLoading(mode, isLoading);
    },
    [mode],
  );

  const clearMessages = useCallback(() => {
    copilotStore.clearMessages(mode);
  }, [mode]);

  return {
    mode,
    isDrawerOpen: copilotState.isDrawerOpen,
    session: currentSession,
    messages: currentSession.messages,
    isLoading: currentSession.isLoading,
    activeModel: currentSession.activeModel,
    setDrawerOpen,
    setModel,
    sendMessage,
    addAssistantMessage,
    setLoading,
    clearMessages,
  };
}
