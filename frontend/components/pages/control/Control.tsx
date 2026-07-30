"use client";

import { Suspense } from "react";
import DynamicTabs from "./DynamicTabs";
import AddPlans from "./plans/AddPlans";
import SoporteContratos from "./SoporteContratos";
import BusquedaContratos from "./search/BusquedaContratos";
import Contratos from "./contracts/Contratos";
import { useTabsControl } from "@/contexts/control-context";
import NewClient from "./client-form/CreateClientForm";

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
        {activeSubControls === "new-client" && <NewClient />}
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
