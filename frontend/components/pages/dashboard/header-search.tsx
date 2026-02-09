import LiOptionClient from "@/components/ui/li-option-client";
import SearchInput from "@/components/ui/searchInput";
import { useState } from "react";
import {
  FaMoneyBill1Wave,
  FaMoneyCheckDollar,
  FaNfcDirectional,
  FaUser,
} from "react-icons/fa6";

export default function HeaderSearch() {
  const [activeTab, setActiveTab] = useState("cliente");

  const styles = {
    header:
      "w-full bg-gray-200 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-1.5 top-0 z-20 shadow-sm",
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
              placeholder="RUC, Cédula o Pasaporte del cliente"
            />
            <SearchInput
              ariaLabel="Buscar por nombres y apellidos"
              type="text"
              id="nombres-apellidos"
              placeholder="Nombres y apellidos completos del cliente"
            />
            <SearchInput
              ariaLabel="Buscar por contrato"
              type="text"
              id="contrato"
              placeholder="Número de contrato del cliente"
            />
          </div>
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
