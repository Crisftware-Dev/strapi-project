"use client";

import { SearchI } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientContext } from "@/contexts/client-context";
import { useClients } from "@/hooks/useClients";
import { useState } from "react";

export default function BusquedaContratos() {
  const { activeTab, setActiveTab, trySelectClient } = useClientContext();
  const [isFetchEnabled, setIsFetchEnabled] = useState(false);
  const { data, isLoading } = useClients(isFetchEnabled);
  const clients = data?.data || [];

  return (
    <section>
      <header className="flex flex-1 flex-row gap-4 w-full bg-gray-100">
        <Input
          id="nombres"
          className="bg-white"
          type="text"
          placeholder="Nombres o Apellidos"
          value=""
          onChange={() => {}}
          onFocus={() => {}}
          onKeyDown={() => {}}
        />
        <Input
          id="contrato"
          className="bg-white"
          type="text"
          placeholder="Contrato"
          value=""
          onChange={() => {}}
          onFocus={() => {}}
          onKeyDown={() => {}}
        />
        <Input
          id="plan"
          className="bg-white"
          type="text"
          placeholder="Plan"
          value=""
          onChange={() => {}}
          onFocus={() => {}}
          onKeyDown={() => {}}
        />
        <Input
          id="estado"
          className="bg-white"
          type="select"
          placeholder="Estado"
          value=""
          onChange={() => {}}
          onFocus={() => {}}
          onKeyDown={() => {}}
        />
        <Input
          id="tipoPlan"
          className="bg-white"
          type="select"
          placeholder="Tipo de Plan"
          value=""
          onChange={() => {}}
          onFocus={() => {}}
          onKeyDown={() => {}}
        />

        <Button className="text-xs bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded disabled:opacity-50">
          <SearchI />
          Buscar
        </Button>
      </header>
    </section>
  );
}
