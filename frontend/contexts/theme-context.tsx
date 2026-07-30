"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

interface ThemeContextType {
  /** Tema activo */
  theme: Theme;
  /** Alterna entre light y dark */
  toggleTheme: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─── Constantes ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "app-theme";
const DARK_CLASS = "dark";

// ─── Helpers (funciones puras, fáciles de testear) ────────────────────────────

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDOM(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  /** Inicialización: leer preferencia guardada / sistema y activar transiciones */
  useEffect(() => {
    const initial = getStoredTheme();
    setTheme(initial);
    applyThemeToDOM(initial);
    document.documentElement.classList.add("theme-ready");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyThemeToDOM(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
