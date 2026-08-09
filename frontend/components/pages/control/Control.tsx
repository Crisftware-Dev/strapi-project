"use client";

import { Suspense } from "react";
import DynamicTabs from "./DynamicTabs";
import AddPlans from "./plans/AddPlans";
import SoporteContratos from "./SoporteContratos";
import BusquedaContratos from "./search/BusquedaContratos";
import Contratos from "./contracts/Contratos";
import { useTabsControl } from "@/contexts/control-context";
import { NewClienteProvider } from "@/contexts/new-cliente-context";
import NewClient from "./client-form/CreateClientForm";

// ─── Inner component (necesita acceder al context) ────────────────────────────
function ContratosInner() {
  const { activeSubControls, addKey } = useTabsControl();

  return (
    <>
      <DynamicTabs />
      <div key={`contratos-${addKey("contratos")}`} style={{ display: activeSubControls === "contratos" ? "block" : "none" }}>
        <Contratos />
      </div>
      <div key={`busqueda-${addKey("busqueda")}`} style={{ display: activeSubControls === "busqueda" ? "block" : "none" }}>
        <BusquedaContratos />
      </div>
      <div key={`add-plans-${addKey("add-plans")}`} style={{ display: activeSubControls === "add-plans" ? "block" : "none" }}>
        <AddPlans />
      </div>
      <div key={`soporte-${addKey("soporte")}`} style={{ display: activeSubControls === "soporte" ? "block" : "none" }}>
        <SoporteContratos />
      </div>
      <div key={`new-client-${addKey("new-client")}`} style={{ display: activeSubControls === "new-client" ? "block" : "none" }}>
        <NewClienteProvider>
          <NewClient />
        </NewClienteProvider>
      </div>
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
