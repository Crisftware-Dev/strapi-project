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
import RoleBtn from "@/components/ui/role-btn";

// ─── Inner component (necesita acceder al context) ────────────────────────────
function ContratosInner() {
  const { activeSubControls, addKey } = useTabsControl();

  return (
    <>
      <DynamicTabs />
      {/* <div
        role="tabpanel"
        id="tabpanel-contratos"
        aria-labelledby="tab-btn-contratos"
        key={`contratos-${addKey("contratos")}`}
        style={{ display: activeSubControls === "contratos" ? "block" : "none" }}
      > */}
      <RoleBtn
        role="tabpanel"
        id="tabpanel-contratos"
        ariaLl="contratos"
        style={{ display: activeSubControls === "contratos" ? "block" : "none" }}
      >
        <Contratos />
      </RoleBtn>
      <RoleBtn
        role="tabpanel"
        id="tabpanel-busqueda"
        ariaLl="busqueda"
        style={{ display: activeSubControls === "busqueda" ? "block" : "none" }}
      >
        <BusquedaContratos enabled={activeSubControls === "busqueda" ? true : false} />
      </RoleBtn>
      <RoleBtn
        role="tabpanel"
        id="tabpanel-add-plans"
        ariaLl="add-plans"
        style={{ display: activeSubControls === "add-plans" ? "block" : "none" }}
      >
        <AddPlans />
      </RoleBtn>
      <RoleBtn
        role="tabpanel"
        id="tabpanel-soporte"
        aria-labelledby="tab-btn-soporte"
        key={`soporte-${addKey("soporte")}`}
        style={{ display: activeSubControls === "soporte" ? "block" : "none" }}
      >
        <SoporteContratos />
      </RoleBtn>
      <RoleBtn
        role="tabpanel"
        id="tabpanel-new-client"
        ariaLl="new-client"
        style={{ display: activeSubControls === "new-client" ? "block" : "none" }}
      >
        <NewClienteProvider enabled={activeSubControls === "new-client" ? true : false}>
          <NewClient />
        </NewClienteProvider>
      </RoleBtn>
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
