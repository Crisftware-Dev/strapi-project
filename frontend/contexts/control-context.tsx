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
  addKey: (key: string) => void;
  removeKey: (key: string) => void;
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
  const [tabKeys, setTabKeys] = useState<Record<string, number>>({});

  const addKey = (key: string) => tabKeys[key] || 0;

  const removeKey = (key: string) => {
    setTabKeys((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

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
    setOpenTabs((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (id === activeSubControls) {
        setActiveSubControls(
          remaining.length > 0
            ? remaining[remaining.length - 1].id
            : "inicio",
        );
      }
      return remaining;
    });
  };

  return (
    <ControlContext.Provider
      value={{
        openTabs,
        activeControls,
        activeSubControls,
        addKey,
        removeKey,
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
