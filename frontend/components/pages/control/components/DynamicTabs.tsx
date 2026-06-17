"use client";

import {
  SearchI,
  UserI,
  PencilModifYI,
  SupportI,
  CloseI,
} from "@/components/icons/Icons";
import { useTabsControl } from "@/contexts/control-context";
import { JSX } from "react";

const TAB_ICONS: Record<string, JSX.Element> = {
  busqueda: <SearchI className="w-3 h-3 shrink-0 text-indigo-500 dark:text-indigo-400" />,
  contratos: <UserI className="w-3 h-3 shrink-0 text-indigo-500 dark:text-indigo-400" />,
  modificar: <PencilModifYI className="w-3 h-3 shrink-0 text-amber-500 dark:text-amber-400" />,
  soporte: <SupportI className="w-3 h-3 shrink-0 text-purple-500 dark:text-purple-400" />,
};

export default function DynamicTabs() {
  const { openTabs, activeSubControls, setActiveSubControls, closeTab } =
    useTabsControl();

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-8 z-1000">
      <div
        role="tablist"
        aria-label="Pestañas de contratos"
        className="flex items-end gap-0 overflow-x-auto px-2 pt-1"
      >
        {/* ── Pestañas abiertas ──────────────────────────────────────────── */}
        {openTabs.map((tab) => {
          const isActive = tab.id === activeSubControls;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-btn-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveSubControls(tab.id)}
              className={`
                group relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                whitespace-nowrap select-none outline-none
                border border-b-0 rounded-t-md transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
                ${
                  isActive
                    ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 shadow-sm -mb-px z-10"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                }
              `}
            >
              {/* Barra de color activa arriba */}
              {isActive && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500 rounded-t-md" />
              )}

              {TAB_ICONS[tab.id]}
              <span>{tab.label}</span>

              {/* Botón X — solo si es closable */}
              {tab.closable && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter" || e.key === " ") {
                  //     e.preventDefault();
                  //     e.stopPropagation();
                  //     closeTab(tab.id);
                  //   }
                  // }}
                  className="
                    ml-0.5 flex items-center justify-center w-4 h-4 rounded
                    opacity-0 group-hover:opacity-100 transition-opacity duration-100
                    hover:bg-red-100 hover:text-red-600
                    dark:hover:bg-red-900/30 dark:hover:text-red-400
                    focus-visible:opacity-100 focus-visible:outline-none
                  "
                >
                  <CloseI className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
