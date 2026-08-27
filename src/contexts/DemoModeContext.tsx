import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: false,
  setDemoMode: () => {},
  toggleDemoMode: () => {},
});

const STORAGE_KEY = "brahma_demo_mode_active";

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) === "true";
    }
    return false;
  });

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, val ? "true" : "false");
    }
  };

  const toggleDemoMode = () => {
    setDemoMode(!isDemoMode);
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, setDemoMode, toggleDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
