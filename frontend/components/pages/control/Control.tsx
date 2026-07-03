"use client";

import { Suspense } from "react";
import DynamicTabs from "./components/DynamicTabs";
import AddPlans from "./components/AddPlans";
import SoporteContratos from "./components/SoporteContratos";
import BusquedaContratos from "./busqueda/BusquedaContratos";
import Contratos from "./contratos/Contratos";
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
        {activeSubControls === "add-plans" && <AddPlans />}
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
