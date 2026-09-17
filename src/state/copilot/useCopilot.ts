import { useState, useEffect, useCallback } from "react";
import {
  copilotStore,
  CopilotState,
  CopilotMessage,
  AIModelType,
  CopilotViewMode,
  CopilotTab,
  CopilotAction,
} from "./copilotStore";
import { useAppMode } from "../mode/useAppMode";
import { copilotDispatcher } from "@/services/copilot/copilotDispatcher";

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

  const setViewMode = useCallback((vMode: CopilotViewMode) => {
    copilotStore.setViewMode(vMode);
  }, []);

  const setActiveTab = useCallback((tab: CopilotTab) => {
    copilotStore.setActiveTab(tab);
  }, []);

  const setModel = useCallback(
    (model: AIModelType) => {
      copilotStore.setModel(mode, model);
    },
    [mode],
  );

  const submitPrompt = useCallback(
    async (text: string, options?: import("@/services/copilot/copilotDispatcher").DispatchOptions) => {
      await copilotDispatcher.dispatch(text, { mode, ...options });
    },
    [mode],
  );

  const sendMessage = useCallback(
    (text: string, metadata?: CopilotMessage["metadata"]) => {
      void copilotDispatcher.dispatch(text, { mode, metadata });
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

  const setPendingApproval = useCallback(
    (action: CopilotAction | null) => {
      copilotStore.setPendingApproval(mode, action);
    },
    [mode],
  );

  const setActivePlan = useCallback(
    (plan: import("@/services/copilot/copilotPlanner").DynamicExecutionPlan | null) => {
      copilotStore.setActivePlan(mode, plan);
    },
    [mode],
  );

  const updatePlanStep = useCallback(
    (stepId: string, updates: Partial<import("@/services/copilot/copilotPlanner").PlanStep>) => {
      copilotStore.updatePlanStep(mode, stepId, updates);
    },
    [mode],
  );

  const setExecutionStatus = useCallback(
    (status: typeof currentSession.executionStatus) => {
      copilotStore.setExecutionStatus(mode, status);
    },
    [mode],
  );

  const clearMessages = useCallback(() => {
    copilotStore.clearMessages(mode);
  }, [mode]);

  return {
    mode,
    isDrawerOpen: copilotState.isDrawerOpen,
    viewMode: copilotState.viewMode,
    activeTab: copilotState.activeTab,
    session: currentSession,
    messages: currentSession.messages,
    isLoading: currentSession.isLoading,
    activeModel: currentSession.activeModel,
    activeSpecialist: currentSession.activeSpecialist,
    thinkingMode: currentSession.thinkingMode,
    thinkingDepth: currentSession.thinkingDepth,
    responseDetail: currentSession.responseDetail,
    evidenceMode: currentSession.evidenceMode,
    toolDepth: currentSession.toolDepth,
    activeSkills: currentSession.activeSkills,
    activeConnectors: currentSession.activeConnectors,
    pendingApproval: currentSession.pendingApproval,
    activePlan: currentSession.activePlan,
    executionStatus: currentSession.executionStatus,
    setDrawerOpen,
    setViewMode,
    setActiveTab,
    setModel,
    sendMessage,
    submitPrompt,
    addAssistantMessage,
    setLoading,
    setPendingApproval,
    setActivePlan,
    updatePlanStep,
    setExecutionStatus,
    setThinkingMode: (tm: import("./copilotStore").ThinkingState) => copilotStore.setThinkingMode(mode, tm),
    setThinkingDepth: (td: import("./copilotStore").ThinkingDepthLevel) => copilotStore.setThinkingDepth(mode, td),
    setResponseDetail: (rd: import("./copilotStore").ResponseDetailLevel) => copilotStore.setResponseDetail(mode, rd),
    setEvidenceMode: (em: import("./copilotStore").EvidenceMode) => copilotStore.setEvidenceMode(mode, em),
    setToolDepth: (td: number) => copilotStore.setToolDepth(mode, td),
    setActiveSkills: (skills: string[]) => copilotStore.setActiveSkills(mode, skills),
    toggleActiveSkill: (skillId: string) => copilotStore.toggleActiveSkill(mode, skillId),
    setActiveConnectors: (conns: string[]) => copilotStore.setActiveConnectors(mode, conns),
    toggleActiveConnector: (connId: string) => copilotStore.toggleActiveConnector(mode, connId),
    clearMessages,
  };
}

