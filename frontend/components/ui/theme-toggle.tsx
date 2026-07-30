"use client";

import { useTheme } from "@/contexts/theme-context";
import { MoonI, SunI } from "@/components/icons/Icons";
import { useEffect, useState } from "react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ThemeToggleProps {
  /** Variante visual: 'icon' (solo ícono) | 'label' (ícono + texto, para menú) */
  variant?: "icon" | "label";
  className?: string;
}

// ─── Etiquetas accesibles ─────────────────────────────────────────────────────

const LABELS = {
  light: "Cambiar a modo oscuro",
  dark: "Cambiar a modo claro",
} as const;

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * ThemeToggle
 *
 * Botón accesible WCAG 2.2 para alternar entre modo claro y oscuro.
 *
 * - `variant="icon"` → solo el ícono (para zonas compactas, ej. auth)
 * - `variant="label"` → ícono + texto (para usar dentro de un menú `<li>`)
 *
 * Cumple:
 *  - 1.4.3 Contraste suficiente
 *  - 2.1.1 Operabilidad por teclado (Enter / Space nativos en <button>)
 *  - 2.4.7 Foco visible (:focus-visible)
 *  - 2.5.8 Tamaño mínimo de objetivo (44×44 en `icon`, 24×24 min en `label`)
 *  - 4.1.2 Nombre, función, valor (aria-label + aria-pressed)
 */
export default function ThemeToggle({
  variant = "icon",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;
  const label = mounted ? LABELS[theme] : "Cambiar tema";

  if (variant === "label") {
    return (
      <button
        id="theme-toggle-label"
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        aria-label={label}
        title={label}
        suppressHydrationWarning
        className={[
          "flex items-center gap-1 w-full text-left",
          "min-h-6",
          "rounded transition-colors cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
          className,
        ].join(" ")}
      >
        {isDark ? (
          <SunI className="text-indigo-400 w-4 h-4" />
        ) : (
          <MoonI className="text-indigo-400 w-4 h-4" />
        )}
        <span suppressHydrationWarning>{isDark ? "Modo Claro" : "Modo Oscuro"}</span>
      </button>
    );
  }

  /* variant === "icon" */
  return (
    <button
      id="theme-toggle-icon"
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      className={[
        "inline-flex items-center justify-center",
        "w-11 h-11 rounded-full",
        "bg-white/10 dark:bg-gray-800/60 backdrop-blur-sm",
        "border border-gray-200 dark:border-gray-700",
        "text-gray-700 dark:text-gray-200",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      {isDark ? (
        <SunI className="w-5 h-5 text-amber-400" />
      ) : (
        <MoonI className="w-5 h-5 text-indigo-600" />
      )}
      <span className="sr-only" suppressHydrationWarning>
        {label}
      </span>
    </button>
  );
}
