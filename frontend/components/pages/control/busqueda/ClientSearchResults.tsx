"use client";

import { useSort } from "@/hooks/useSort";
import { Client } from "@/types/typesDB";
import { UserI } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

interface ClientSearchResultsProps {
  results: Client[];
  isLoading?: boolean;
}

export default function ClientSearchResults({
  results,
  isLoading = false,
}: ClientSearchResultsProps) {
  const { sortedData, sortConfig, requestSort } = useSort(results);

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVO":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
      case "CORTADO":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
      case "SUSPENDIDO":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
      case "TERMINADO":
        return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800";
      case "PROSPECTO":
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50";
    }
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) {
      return (
        <span className="ml-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
          ↕
        </span>
      );
    }

    return sortConfig.direction === "asc" ? (
      <span className="ml-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
        ▲
      </span>
    ) : (
      <span className="ml-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
        ▼
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-950 border border-indigo-100 dark:border-indigo-900/30 rounded-xl shadow-xs mt-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Buscando clientes...
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-950 border border-indigo-100 dark:border-indigo-900/30 rounded-xl shadow-xs mt-6 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center justify-center mb-3">
          <UserI className="w-6 h-6 text-indigo-400 opacity-60" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          No se encontraron clientes
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
          Ajusta los filtros de búsqueda y presiona <strong>Buscar</strong> para
          intentar de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950 border border-indigo-100 dark:border-indigo-900/30 rounded-xl shadow-xs overflow-hidden mt-6 transition-all duration-300">
      <div className="p-4 border-b border-indigo-50 dark:border-indigo-900/20 flex justify-between items-center bg-indigo-50/10">
        <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
          Resultados de Búsqueda ({results.length})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50/20 dark:bg-indigo-950/10 border-b border-indigo-100 dark:border-indigo-900/30">
              <th
                className="px-4 py-3 text-[10px] font-bold text-indigo-900/70 dark:text-indigo-300/70 tracking-wider uppercase cursor-pointer hover:bg-indigo-100/30 dark:hover:bg-indigo-950/30 transition-colors select-none group"
                onClick={() => requestSort("contrato")}
              >
                <div className="flex items-center">
                  Contrato {getSortIndicator("contrato")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-[10px] font-bold text-indigo-900/70 dark:text-indigo-300/70 tracking-wider uppercase cursor-pointer hover:bg-indigo-100/30 dark:hover:bg-indigo-950/30 transition-colors select-none group"
                onClick={() => requestSort("apellidos")}
              >
                <div className="flex items-center">
                  Nombres Completos {getSortIndicator("apellidos")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-[10px] font-bold text-indigo-900/70 dark:text-indigo-300/70 tracking-wider uppercase cursor-pointer hover:bg-indigo-100/30 dark:hover:bg-indigo-950/30 transition-colors select-none group"
                onClick={() => requestSort("contact")}
              >
                <div className="flex items-center">
                  Teléfono {getSortIndicator("contact")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-[10px] font-bold text-indigo-900/70 dark:text-indigo-300/70 tracking-wider uppercase cursor-pointer hover:bg-indigo-100/30 dark:hover:bg-indigo-950/30 transition-colors select-none group"
                onClick={() => requestSort("plans")}
              >
                <div className="flex items-center">
                  Plan(es) {getSortIndicator("plans")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-[10px] font-bold text-indigo-900/70 dark:text-indigo-300/70 tracking-wider uppercase cursor-pointer hover:bg-indigo-100/30 dark:hover:bg-indigo-950/30 transition-colors select-none group"
                onClick={() => requestSort("estado")}
              >
                <div className="flex items-center">
                  Estado {getSortIndicator("estado")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50/50 dark:divide-indigo-900/10">
            {sortedData.map((client) => {
              const fullNames =
                `${client.apellidos || ""} ${client.nombres || ""}`
                  .trim()
                  .toUpperCase();

              const plansText =
                client.plans && client.plans.length > 0
                  ? client.plans.map((p) => p.plan).join(", ")
                  : "Sin Plan";

              const phoneText =
                client.contact?.telephone ||
                client.contact?.phoneSms ||
                client.contact?.phoneTwo ||
                "N/A";

              return (
                <tr
                  key={client.documentId}
                  className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-colors duration-150 group"
                >
                  <td className="px-4 py-3 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {client.contrato || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-800 dark:text-gray-200">
                    {fullNames || "SIN NOMBRE"}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                    {phoneText}
                  </td>
                  <td
                    className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 max-w-[200px] truncate"
                    title={plansText}
                  >
                    {plansText}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-semibold border rounded-full inline-block uppercase tracking-wider",
                        getStatusStyle(client.estado),
                      )}
                    >
                      {client.estado || "PROSPECTO"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
