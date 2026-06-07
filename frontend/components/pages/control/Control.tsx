"use client";

import { Suspense } from "react";
import DynamicTabs from "./components/DynamicTabs";
import BusquedaContratos from "./components/BusquedaContratos";

import ModificarContratos from "./components/ModificarContratos";
import SoporteContratos from "./components/SoporteContratos";
import Contratos from "./components/Contratos";
import { useTabsControl } from "@/contexts/control-context";

// ─── Inner component (necesita acceder al context) ────────────────────────────
function ContratosInner() {
  const { activeSubControls } = useTabsControl();

  return (
    <>
      <DynamicTabs />
      <>
        {activeSubControls === "contratos" && <Contratos />}
        {activeSubControls === "busqueda" && <BusquedaContratos />}
        {activeSubControls === "modificar" && <ModificarContratos />}
        {activeSubControls === "soporte" && <SoporteContratos />}
      </>
    </>
  );
}

// ─── Componente principal exportado ───────────────────────────────────────────
export default function Control() {
  return (
    <Suspense
      fallback={<div className="text-xs text-gray-400">Cargando...</div>}
    >
      <ContratosInner />
    </Suspense>
  );
}
