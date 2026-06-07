"use client";

import {
  createContext,
  useState,
  ReactNode,
  useContext,
} from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Tab {
  id: string;
  label: string;
  closable: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface ControlContextType {
  activeControls: string;
  activeSubControls: string;
  openTabs: Tab[];
  openTab: (id: string, label: string, closable?: boolean) => void;
  closeTab: (id: string) => void;
  setActiveControls: (id: string) => void;
  setActiveSubControls: (id: string) => void;
}

const ControlContext = createContext<ControlContextType | undefined>(
  undefined,
);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ControlProvider({ children }: { children: ReactNode }) {
  const [openTabs, setOpenTabs] = useState<Tab[]>([
  ]);
  const [activeControls, setActiveControls] = useState("");
  const [activeSubControls, setActiveSubControls] = useState("");

  const openTab = (id: string, label: string, closable: boolean = true) => {
    if (openTabs.some((t) => t.id === id)) {
      setActiveSubControls(id);
      return;
    } else {
      const newTab: Tab = {
        id,
        label,
        closable,
      };
      setOpenTabs((prev) => [...prev, newTab]);
      setActiveControls(id);
    }
  };

  const closeTab = (id: string) => {
    setOpenTabs((prev) => prev.filter((t) => t.id !== id));

    if (id === activeControls) {
      const remainingTabs = openTabs.filter((t) => t.id !== id);
      setActiveSubControls(
        remainingTabs.length > 0
          ? remainingTabs[remainingTabs.length - 1].id
          : "inicio",
      );
    }
  };

  return (
    <ControlContext.Provider
      value={{
        openTabs,
        activeControls,
        activeSubControls,
        openTab,
        closeTab,
        setActiveControls,
        setActiveSubControls,
      }}
    >
      {children}
    </ControlContext.Provider>
  );
}

export const useTabsControl = () => {
  const context = useContext(ControlContext);
  if (!context) {
    throw new Error('useTabs debe usarse dentro de un ControlProvider');
  }
  return context;
};
