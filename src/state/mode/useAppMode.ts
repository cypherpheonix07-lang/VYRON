import { useState, useEffect } from "react";
import { modeStore, type AppMode, type ModeState } from "./modeStore";

export function useAppMode() {
  const [modeState, setModeState] = useState<ModeState>(() => modeStore.getState());

  useEffect(() => {
    return modeStore.subscribe((newState) => {
      setModeState(newState);
    });
  }, []);

  return {
    mode: modeState.mode,
    isDemo: modeState.mode === "DEMO",
    isNormal: modeState.mode === "NORMAL",
    isTransitioning: modeState.isTransitioning,
    demoScenario: modeState.demoScenario,
    setMode: (mode: AppMode) => modeStore.setMode(mode),
    toggleMode: () => modeStore.toggleMode(),
    setDemoScenario: (scenario: string) => modeStore.setDemoScenario(scenario),
  };
}
