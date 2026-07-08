"use client";

import { SearchI } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useClients } from "@/hooks/useClients";
import { usePlans } from "@/hooks/usePlans";
import { Client } from "@/types/typesDB";
import { useState } from "react";
import ClientSearchResults from "./ClientSearchResults";

export default function BusquedaContratos() {
  const [namesInput, setNamesInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [planInput, setPlanInput] = useState("");
  const [mediaInput, setMediaInput] = useState("");

  const [idResults, setIdResults] = useState<Client[]>([]);
  const [isFetchEnabled, setIsFetchEnabled] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading } = useClients(isFetchEnabled);
  const { data: plans } = usePlans(isFetchEnabled);

  const clients = data?.data || [];
  const plansData = plans?.data || [];

  const showClients = () => {
    if (!isFetchEnabled) setIsFetchEnabled(true);
    setHasSearched(true);

    const resultsClients = clients.filter((c) => {
      if (namesInput) {
        const fullNames = `${c.apellidos || ""} ${c.nombres || ""}`;
        if (!fullNames.includes(namesInput)) return false;
      }

      if (phoneInput) {
        const phone1 = c.contact?.telephone || "";
        const phone2 = c.contact?.phoneSms || "";
        const phone3 = c.contact?.phoneTwo || "";
        if (
          !phone1.includes(phoneInput) &&
          !phone2.includes(phoneInput) &&
          !phone3.includes(phoneInput)
        ) {
          return false;
        }
      }

      if (stateInput) {
        if (c.estado !== stateInput) return false;
      }
      if (planInput) {
        if (!c.plans || !c.plans.some((p) => p.plan === planInput))
          return false;
      }

      if (mediaInput) {
        if (c.tipoPlan !== mediaInput) return false;
      }

      return true;
    });

    setIdResults(resultsClients);
  };

  return (
    <section className="p-4 space-y-4">
      <header className="flex flex-wrap gap-4 w-full p-4 bg-gray-50/50 dark:bg-gray-900/10 border border-indigo-50 dark:border-indigo-900/20 rounded-xl items-end">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 uppercase">
            Nombres o Apellidos
          </label>
          <Input
            id="apellidos"
            className="bg-white dark:bg-gray-950 border-indigo-100 dark:border-indigo-900/50"
            type="text"
            placeholder="Nombres o Apellidos"
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && showClients()}
          />
        </div>

        <div className="w-[150px] flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 uppercase">
            Teléfono
          </label>
          <Input
            id="telefono"
            className="bg-white dark:bg-gray-950 border-indigo-100 dark:border-indigo-900/50 font-mono"
            type="text"
            placeholder="Teléfono"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && showClients()}
          />
        </div>

        <div className="w-[200px] flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 uppercase">
            Plan
          </label>
          <Select
            id="plan"
            className="bg-white dark:bg-gray-950 border-indigo-100 dark:border-indigo-900/50"
            value={planInput}
            onChange={(e) => setPlanInput(e.target.value)}
            onFocus={() => {
              setIsFetchEnabled(true);
            }}
          >
            <option value="">Seleccione Plan</option>
            {plansData.map((plan) => (
              <option key={plan.documentId} value={plan.plan}>
                {plan.plan}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-[130px] flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 uppercase">
            Estado
          </label>
          <Select
            id="estado"
            className="bg-white dark:bg-gray-950 border-indigo-100 dark:border-indigo-900/50"
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
          >
            <option value=""></option>
            <option value="PROSPECTO">PROSPECTO</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="CORTADO">CORTADO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
            <option value="TERMINADO">TERMINADO</option>
          </Select>
        </div>

        <div className="w-[150px] flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 uppercase">
            Medio
          </label>
          <Select
            id="tipoPlan"
            className="bg-white dark:bg-gray-950 border-indigo-100 dark:border-indigo-900/50"
            value={mediaInput}
            onChange={(e) => setMediaInput(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="COBRE">COBRE</option>
            <option value="MEDIO INALÁMBRICO">MEDIO INALÁMBRICO</option>
            <option value="FIBRA ÓPTICA">FIBRA ÓPTICA</option>
          </Select>
        </div>

        <Button
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 border border-indigo-500 rounded px-4 py-2 flex items-center gap-1.5 shadow-sm transition-all h-9 self-end"
          onClick={showClients}
        >
          <SearchI className="w-3.5 h-3.5" />
          Buscar
        </Button>
      </header>

      {hasSearched && (
        <ClientSearchResults results={idResults} isLoading={isLoading} />
      )}
    </section>
  );
}
