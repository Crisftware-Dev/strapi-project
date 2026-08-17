"use client";

import { LiOptionClient } from "@/components/ui/nav-items";
import { SearchInput } from "@/components/ui/search";
import { useClientContext } from "@/contexts/client-context";
import { Client } from "@/types/typesDB";
import { useClients } from "@/hooks/useClients";
import { useClientByContrato } from "@/hooks/useClientByContrato";
import { useState, useEffect } from "react";
import {
  FaMoneyBill1Wave,
  FaMoneyCheckDollar,
  FaNfcDirectional,
  FaUser,
} from "react-icons/fa6";
import { SearchNames } from "@/components/ui/search";
import ModalIdentificator from "./Modal";

export default function HeaderSearch() {
  const { activeTab, setActiveTab, trySelectClient, selectedClientId } =
    useClientContext();

  const [identifierInput, setIdentifierInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [contratoInput, setContratoInput] = useState("");

  const [nameResults, setNameResults] = useState<Client[]>([]);
  const [idResults, setIdResults] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetchEnabled, setIsFetchEnabled] = useState(false);
  const [searchContrato, setSearchContrato] = useState("");

  const { data, isLoading } = useClients(isFetchEnabled);
  const clients = data || [];

  const { data: contratoResults, isLoading: isContratoLoading } =
    useClientByContrato(searchContrato, searchContrato.length > 0);

  useEffect(() => {
    if (!searchContrato || isContratoLoading) return;

    const client = contratoResults?.[0];
    if (client) {
      trySelectClient(client.documentId);
      setContratoInput("");
      setShowError(false);
    } else {
      showErrorMessage("No se encontró ningún cliente con ese contrato");
    }
  }, [contratoResults, isContratoLoading, searchContrato, trySelectClient]);

  const handleIdentifierSearch = () => {
    if (!identifierInput.trim()) return;

    const found = clients.filter((c) =>
      c.identificacion.includes(identifierInput),
    );

    if (found.length === 1) {
      trySelectClient(found[0].documentId);
    } else {
      setIdResults(found);
      setIsModalOpen(true);
    }
  };

  const handleContratoSearch = () => {
    if (!contratoInput.trim()) return;
    setSearchContrato(contratoInput.trim());
  };

  const handleNameSearch = (value: string) => {
    setNameInput(value);

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
    setIdentifierInput("");
    setIsModalOpen(false);
    setShowError(false);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const activePageClient = (id: string) => {
    if (selectedClientId) {
      setActiveTab(id);
    } else {
      showErrorMessage("Debe seleccionar un cliente");
    }
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
          <ModalIdentificator
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            resultados={idResults}
            handleClientSelect={handleClientSelect}
          />
        </div>
      </header>

      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <LiOptionClient
            id="cliente"
            label="Cliente"
            icon={<FaUser className={styles.icon} aria-hidden="true" />}
            isActive={activeTab === "cliente"}
            onClick={activePageClient}
          />
          <LiOptionClient
            id="direccion"
            label="Dirección"
            icon={<FaNfcDirectional className={styles.icon} aria-hidden="true" />}
            isActive={activeTab === "direccion"}
            onClick={activePageClient}
          />
          <LiOptionClient
            id="pagosPendientes"
            label="Pagos pendientes"
            icon={<FaMoneyBill1Wave className={styles.icon} aria-hidden="true" />}
            isActive={activeTab === "pagosPendientes"}
            onClick={activePageClient}
          />
          <LiOptionClient
            id="pagosRealizados"
            label="Pagos realizados"
            icon={<FaMoneyCheckDollar className={styles.icon} aria-hidden="true" />}
            isActive={activeTab === "pagosRealizados"}
            onClick={activePageClient}
          />
        </ul>
      </nav>
    </>
  );
}
