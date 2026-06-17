"use client";

import HeaderSearch from "@/components/pages/header-search";
import RenderAddress from "@/components/pages/control/contratos/RenderAddress";
import ClientDataDisplay from "@/components/pages/control/contratos/RenderClient";
import RenderPaymentsOuts from "@/components/pages/control/contratos/RenderPaymentsOuts";
import RenderPaymentsHistory from "@/components/pages/control/contratos/RenderPaymetsHistory";
import { useClientContext } from "@/contexts/client-context";
import { useEffect, useRef } from "react";

export default function DashboardRoute() {
  const { selectedClientId, activeTab, setActiveTab } = useClientContext();
  const prevClientId = useRef(selectedClientId);

  useEffect(() => {
    if (selectedClientId !== prevClientId.current) {
      prevClientId.current = selectedClientId;
      setActiveTab("cliente");
    }
  }, [selectedClientId, setActiveTab]);

  return (
    <>
      <HeaderSearch />
      <>
        {activeTab === "cliente" && <ClientDataDisplay />}
        {activeTab === "direccion" && <RenderAddress />}
        {activeTab === "pagosPendientes" && <RenderPaymentsOuts />}
        {activeTab === "pagosRealizados" && <RenderPaymentsHistory />}
      </>
    </>
  );
}