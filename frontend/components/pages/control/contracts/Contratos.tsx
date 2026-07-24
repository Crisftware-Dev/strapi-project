"use client";

import HeaderSearch from "@/components/pages/control/contracts/header-search";
import RenderAddress from "@/components/pages/control/contracts/RenderAddress";
import ClientDataDisplay from "@/components/pages/control/contracts/RenderClient";
import RenderPaymentsOuts from "@/components/pages/control/contracts/RenderPaymentsOuts";
import RenderPaymentsHistory from "@/components/pages/control/contracts/RenderPaymetsHistory";
import { ClientProvider, useClientContext } from "@/contexts/client-context";
import FooterControl from "./FooterControl";

function DashboardRoute() {
  const { activeTab } = useClientContext();

  return (
    <>
      <HeaderSearch />
      <>
        {activeTab === "cliente" && <ClientDataDisplay />}
        {activeTab === "direccion" && <RenderAddress />}
        {activeTab === "pagosPendientes" && <RenderPaymentsOuts />}
        {activeTab === "pagosRealizados" && <RenderPaymentsHistory />}
      </>
      <FooterControl />
    </>
  );
}

export default function Contratos() {
  return (
    <ClientProvider>
      <DashboardRoute />
    </ClientProvider>
  );
}
