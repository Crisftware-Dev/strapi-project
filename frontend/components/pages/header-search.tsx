"use client";

import LiOptionClient from "@/components/ui/li-option-client";
import SearchInput from "@/components/ui/searchInput";
import { useClientContext } from "@/contexts/client-context";
import { Client } from "@/types/typeClients";
import { useClients } from "@/hooks/useClients";
import { useState } from "react";
import {
  FaMoneyBill1Wave,
  FaMoneyCheckDollar,
  FaNfcDirectional,
  FaUser,
} from "react-icons/fa6";
import SearchNames from "../ui/searchParams";

export default function HeaderSearch() {
  const { activeTab, setActiveTab, trySelectClient } = useClientContext();

  const [identifierInput, setIdentifierInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [contratoInput, setContratoInput] = useState("");

  const [nameResults, setNameResults] = useState<Client[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetchEnabled, setIsFetchEnabled] = useState(false);

  const { data, isLoading } = useClients(isFetchEnabled);
  const clients = data?.data || [];

  const handleIdentifierSearch = () => {
    if (!identifierInput.trim()) return;

    const client = clients.find(
      (c) => c.identificacion === identifierInput.trim(),
    );

    if (client) {
      trySelectClient(client.documentId);
      setIdentifierInput("");
      setShowError(false);
    } else {
      showErrorMessage("No se encontró ningún cliente con esa identificación");
    }
  };

  const handleContratoSearch = () => {
    if (!contratoInput.trim()) return;

    const client = clients.find(
      (c) => c.contrato.toString() === contratoInput.trim(),
    );

    if (client) {
      trySelectClient(client.documentId);
      setContratoInput("");
      setShowError(false);
    } else {
      showErrorMessage("No se encontró ningún cliente con ese contrato");
    }
  };

  const handleNameSearch = (value: string) => {
    setNameInput(value);
    if (!isFetchEnabled) setIsFetchEnabled(true);

    if (!value.trim()) {
      setNameResults([]);
      return;
    }

    const filtered = clients.filter((client) => {
      const fullName = `${client.apellidos} ${client.nombres}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    });

    if (value.length > 2) {
      setNameResults(filtered);
    } else {
      setNameResults([]);
    }
  };

  const handleClientSelect = (client: Client) => {
    trySelectClient(client.documentId);
    setNameInput("");
    setNameResults([]);
    setShowError(false);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const styles = {
    header:
      "w-full bg-gray-200 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-1.5 sticky top-8 z-2000 shadow-sm",
    container: "max-w-7xl",
    searchRow:
      "flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-start",
    nav: "w-full border-b pt-1.5 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/80",
    ul: "flex items-center justify-start gap-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 border-gray-200 bg-gray-200 dark:bg-gray-900/50",
    icon: "text-indigo-500 dark:text-indigo-400",
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.searchRow}>
            <SearchInput
              ariaLabel="Buscar por identificación"
              type="text"
              id="identifier"
              placeholder="RUC, Cédula o Pasaporte"
              value={identifierInput}
              onChange={(e) => setIdentifierInput(e.target.value)}
              onFocus={() => setIsFetchEnabled(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleIdentifierSearch();
                }
              }}
            />

            <SearchInput
              ariaLabel="Buscar por nombres y apellidos"
              type="text"
              id="name"
              placeholder="Buscar por Apellidos y Nombres"
              value={nameInput}
              onChange={(e) => handleNameSearch(e.target.value)}
              onFocus={() => setIsFetchEnabled(true)}
            />

            <SearchInput
              ariaLabel="Buscar por contrato"
              type="text"
              id="contract"
              placeholder="Contrato"
              value={contratoInput}
              onChange={(e) => setContratoInput(e.target.value)}
              onFocus={() => setIsFetchEnabled(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleContratoSearch();
                }
              }}
            />
          </div>

          <SearchNames
            showError={showError}
            errorMessage={errorMessage}
            nameResults={nameResults}
            isLoading={isLoading}
            handleClientSelect={handleClientSelect}
          />
        </div>
      </header>

      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <LiOptionClient
            id="cliente"
            label="Cliente"
            icon={<FaUser className={styles.icon} />}
            isActive={activeTab === "cliente"}
            onClick={() => setActiveTab("cliente")}
          />
          <LiOptionClient
            id="Dirección"
            label="Dirección"
            icon={<FaNfcDirectional className={styles.icon} />}
            isActive={activeTab === "direccion"}
            onClick={() => setActiveTab("direccion")}
          />
          <LiOptionClient
            id="pagosPendientes"
            label="Pagos pendientes"
            icon={<FaMoneyBill1Wave className={styles.icon} />}
            isActive={activeTab === "pagosPendientes"}
            onClick={() => setActiveTab("pagosPendientes")}
          />
          <LiOptionClient
            id="pagosRealizados"
            label="Pagos realizados"
            icon={<FaMoneyCheckDollar className={styles.icon} />}
            isActive={activeTab === "pagosRealizados"}
            onClick={() => setActiveTab("pagosRealizados")}
          />
        </ul>
      </nav>
    </>
  );
}
