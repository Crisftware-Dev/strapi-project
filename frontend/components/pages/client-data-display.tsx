"use client";

import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa6";
import { SearchI } from "@/components/icons/Icons";
import { ClientDataRow } from "@/components/ui/client-data-row";
import { cn } from "@/lib/utils";

const styles = {
  container:
    "w-full bg-white dark:bg-gray-950 text-xs shadow-sm border border-indigo-100 dark:border-indigo-900/30 rounded-lg overflow-hidden",
  mainGrid: "grid grid-cols-[1fr_400px] gap-0",
  leftColumn: "border-r border-indigo-100 dark:border-indigo-900/30",
  rightColumn: "bg-gray-50/50 dark:bg-gray-900/20",

  input:
    "w-full bg-transparent border-none p-0 h-6 text-xs focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-700 dark:text-gray-200",
  select:
    "w-full bg-transparent border-none p-0 h-6 text-xs focus:ring-0 text-gray-700 dark:text-gray-200 cursor-pointer",

  searchInput:
    "w-full pl-8 pr-3 py-1.5 text-xs border border-indigo-100 dark:border-indigo-900/50 rounded bg-white dark:bg-gray-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm",

  radioGroup: "flex items-center gap-6",
  radioLabel: "flex items-center gap-2 cursor-pointer select-none group",
  radio: "w-3.5 h-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500",

  plusButton:
    "w-6 h-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-100 dark:border-indigo-900/30",
  uploadButton:
    "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-medium transition-all shadow-sm flex items-center gap-1.5",
  actionButton:
    "px-3 py-1 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/30 rounded text-[10px] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 transition-colors",

  tableHeader:
    "px-3 py-2.5 text-left text-[10px] font-bold text-indigo-900/60 dark:text-indigo-300/60 tracking-wider uppercase border-b border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/20",
  tableCell:
    "px-3 py-2 border-b border-indigo-50 dark:border-indigo-900/20 text-gray-600 dark:text-gray-300 text-xs",

  toggle:
    "relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer",
  toggleOn: "bg-green-500",
  toggleOff: "bg-gray-200 dark:bg-gray-700",
  toggleThumb:
    "inline-block h-3 w-3 transform rounded-full bg-white transition transition-transform shadow-sm",
  toggleThumbOn: "translate-x-4",
  toggleThumbOff: "translate-x-1",
};

export default function ClientDataDisplay() {
  const { selectedClientId, setActiveTab } = useClientContext();
  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

  const prevClientId = useRef(selectedClientId);

  useEffect(() => {
    if (selectedClientId !== prevClientId.current) {
      prevClientId.current = selectedClientId;
      setActiveTab("cliente");
    }
  }, [selectedClientId, setActiveTab]);

  if (!selectedClientId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-gray-400 dark:text-gray-600">
        <FaUser className="text-6xl mb-4 opacity-20" />
        <p className="text-sm">Seleccione un cliente para ver su información</p>
      </div>
    );
  }

  if (isLoading)
    return <div className="p-8 text-center text-xs">Cargando datos...</div>;
  if (error || !client)
    return (
      <div className="p-8 text-center text-xs text-red-500">
        Error al cargar datos
      </div>
    );

  return (
    <article className={styles.container}>
      <main className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <ClientDataRow label="Venta">
            <div className="flex w-full items-center">
              <select className={styles.select} defaultValue="tradicional">
                <option value="tradicional">Venta Tradicional</option>
              </select>
              <div className="w-px h-4 bg-indigo-100 dark:bg-indigo-900/30 mx-2" />
              <p className="w-32 text-right text-indigo-600 text-sm">
                {client.contrato}
              </p>
            </div>
          </ClientDataRow>

          <ClientDataRow label="Identificación">
            <div className="flex gap-2 w-full items-center">
              <select className="w-24 bg-transparent text-xs border-r border-indigo-100 dark:border-indigo-900/30 pr-2 font-medium text-indigo-700 dark:text-indigo-300">
                <option>CEDULA</option>
                <option>RUC</option>
              </select>
              <input
                type="text"
                className={cn(styles.input, "font-mono font-medium")}
                value={client.identificacion}
                readOnly
              />
              <button className={styles.plusButton}>+</button>
            </div>
          </ClientDataRow>

          <ClientDataRow label="Razón Social">
            <input
              type="text"
              className={styles.input}
              placeholder="Nombre de empresa"
            />
          </ClientDataRow>

          <ClientDataRow label="Cédula Rep.Legal">
            <input
              type="text"
              className={styles.input}
              defaultValue={client.identificacion}
            />
          </ClientDataRow>

          <ClientDataRow
            label="Apellidos"
            value={client.apellidos}
            readOnly
            className="uppercase font-medium"
          />
          <ClientDataRow
            label="Nombres"
            value={client.nombres}
            readOnly
            className="uppercase font-medium"
          />

          <ClientDataRow label="Telf. Conv.">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] flex-1 items-center gap-2">
              <input
                type="text"
                className={cn(styles.input, "font-mono")}
                value={"0" + client.telefono.toString()}
                readOnly
              />

              <div className="text-[10px] font-semibold text-indigo-900/60 dark:text-indigo-300/60 uppercase px-2 border-l border-indigo-100 dark:border-indigo-900/30">
                Celular SMS:
              </div>
              <input
                type="text"
                className={cn(styles.input, "font-mono")}
                placeholder="0999999999"
              />

              <div className="text-[10px] font-semibold text-indigo-900/60 dark:text-indigo-300/60 uppercase px-2 border-l border-indigo-100 dark:border-indigo-900/30">
                Celular(2):
              </div>
              <input type="text" className={cn(styles.input, "font-mono")} />
            </div>
          </ClientDataRow>

          <ClientDataRow label="Email" value={client.email} readOnly />

          <ClientDataRow label="Dirección Fac.">
            <input
              type="text"
              className={`uppercase ${styles.input}`}
              value={`${client.ciudad} - DIRECCION REFERENCIAL`}
              readOnly
            />
          </ClientDataRow>

          <ClientDataRow label="Fecha Nacimiento">
            <div className="flex items-center gap-4">
              <input
                type="date"
                className="bg-transparent text-xs text-gray-600 dark:text-gray-300"
                defaultValue="2000-01-01"
              />
              <div className="flex items-center gap-2 text-indigo-500/80 text-[11px] bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                <span>📅 Edad:</span>
                <span className="font-medium">24 años | 1 meses | 18 días</span>
              </div>
            </div>
          </ClientDataRow>

          <ClientDataRow label="Medio Plan">
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="media"
                  className={styles.radio}
                  disabled
                />
                <span className="text-gray-400 group-hover:text-gray-500 text-[11px]">
                  COBRE
                </span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="media"
                  className={styles.radio}
                  disabled
                />
                <span className="text-gray-400 group-hover:text-gray-500 text-[11px]">
                  MEDIO INALÁMBRICO
                </span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="media"
                  className={styles.radio}
                  defaultChecked
                />
                <span className="font-semibold text-indigo-600 text-[11px]">
                  FIBRA ÓPTICA
                </span>
              </label>
            </div>
          </ClientDataRow>

          {/* Planes Table Section */}
          <div className="border-b border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-950">
            <div className="flex items-center p-3 gap-3 bg-indigo-50/20 dark:bg-indigo-900/10">
              <div className="flex-1 relative group">
                <SearchI className="absolute left-2.5 top-2 w-3.5 h-3.5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="BUSQUE AQUI EL PLAN"
                />
              </div>
              <button className={styles.actionButton}>
                + Añadir (Principal)
              </button>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className={`w-[45%] ${styles.tableHeader}`}>
                    Planes Mensuales
                  </th>
                  <th className={styles.tableHeader}>Valor</th>
                  <th className={styles.tableHeader}>Principal</th>
                  <th className={styles.tableHeader}>$Dscto.</th>
                  <th className={styles.tableHeader}>Meses</th>
                  <th className={`${styles.tableHeader} w-[120px]`}>Opción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-indigo-50/20 transition-colors">
                  <td
                    className={cn(
                      styles.tableCell,
                      "font-medium text-xs text-indigo-900 dark:text-indigo-200",
                    )}
                  >
                    RESIDENCIAL ONE SOCIAL (200 MBPS){" "}
                    <span className="text-gray-400 font-normal">
                      / corte 25
                    </span>
                  </td>
                  <td className={cn(styles.tableCell, "font-mono")}>20.54</td>
                  <td className={styles.tableCell}>
                    <div className={`${styles.toggle} ${styles.toggleOn}`}>
                      <span
                        className={`${styles.toggleThumb} ${styles.toggleThumbOn}`}
                      />
                    </div>
                  </td>
                  <td className={cn(styles.tableCell, "text-gray-400")}>.00</td>
                  <td className={cn(styles.tableCell, "text-gray-400")}>-1</td>
                  <td className={styles.tableCell}>
                    <div className="flex gap-1.5 justify-end">
                      <button
                        className={cn(
                          styles.actionButton,
                          "px-2 text-red-500 hover:bg-red-50 border-red-100",
                        )}
                      >
                        Elim.
                      </button>
                      <button
                        className={cn(
                          styles.actionButton,
                          "px-2 text-indigo-600 hover:bg-indigo-50 border-indigo-100",
                        )}
                      >
                        $ Desc.
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ClientDataRow label="Es una entidad">
            <select className={styles.select}>
              <option>PRIVADA</option>
            </select>
          </ClientDataRow>

          <ClientDataRow label="Rubro Instalación">
            <select className={styles.select}>
              <option>INSTALACION RESIDENCIAL F.O | 178.2522</option>
            </select>
          </ClientDataRow>

          <ClientDataRow label="Descuento Aplicado">
            <div className="flex-1 flex items-center">
              <select className={cn(styles.select, "flex-1")}>
                <option>Ninguno</option>
              </select>
              <div className="flex items-center px-4 border-l border-indigo-100 dark:border-indigo-900/30 text-[11px] text-gray-500 bg-indigo-50/20 h-full">
                A Cancelar:{" "}
                <span className="ml-2 font-bold text-indigo-700 dark:text-indigo-300 font-mono text-xs">
                  178.2522
                </span>
              </div>
            </div>
          </ClientDataRow>

          <ClientDataRow label="Corte Automático">
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-green-100/80 text-green-700 px-2.5 py-0.5 rounded-full font-bold shadow-sm border border-green-200">
                SI
              </span>
              <div className={`${styles.toggle} ${styles.toggleOn}`}>
                <span
                  className={`${styles.toggleThumb} ${styles.toggleThumbOn}`}
                />
              </div>
            </div>
          </ClientDataRow>

          <ClientDataRow label="Aplica Dscto.">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-[11px]">
                  Por Discapacidad:
                </span>
                <div
                  className={`${styles.toggle} ${styles.toggleOff} scale-75 origin-left`}
                >
                  <span
                    className={`${styles.toggleThumb} ${styles.toggleThumbOff}`}
                  />
                </div>
                <span className="font-bold text-[10px] text-gray-400">NO</span>
              </div>
              <div className="w-px h-4 bg-indigo-100 dark:bg-indigo-900/30" />
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-[11px]">
                  Por Tercera Edad:
                </span>
                <div
                  className={`${styles.toggle} ${styles.toggleOff} scale-75 origin-left`}
                >
                  <span
                    className={`${styles.toggleThumb} ${styles.toggleThumbOff}`}
                  />
                </div>
                <span className="font-bold text-[10px] text-gray-400">NO</span>
              </div>
            </div>
          </ClientDataRow>
        </div>

        <div className={styles.rightColumn}>
          {/* Status Header */}
          <div className="p-4 border-b border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-950">
            <div className="flex gap-2 mb-3">
              <select
                defaultValue={client.estado}
                className={cn(
                  styles.select,
                  "border border-indigo-200 dark:border-indigo-800 rounded px-2 py-1 h-8 bg-indigo-50/30 font-semibold text-indigo-900",
                )}
              >
                <option value="PROSPECTO">PROSPECTO</option>
                <option value="ACTIVO" className="text-green-500">
                  ACTIVO
                </option>
                <option value="CORTADO" className="text-red-500">
                  CORTADO
                </option>
                <option value="SUSPENDIDO" className="text-yellow-500">
                  SUSPENDIDO
                </option>
                <option value="TERMINADO" className="text-gray-500">
                  TERMINADO
                </option>
              </select>
            </div>

            <div className="flex items-center gap-3 py-1 px-1">
              <div className={`${styles.toggle} ${styles.toggleOff} scale-90`}>
                <span
                  className={`${styles.toggleThumb} ${styles.toggleThumbOff}`}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">
                ¿Es agente de retención?
              </span>
            </div>
          </div>

          {/* Files Upload Section */}
          <div className="p-4 flex flex-col gap-3 h-[calc(100%-250px)]">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Subir Archivos
              </label>
              <div className="flex gap-2">
                <select className="flex-1 border border-indigo-100 rounded text-xs px-2 py-1.5 text-gray-600 bg-white shadow-sm focus:ring-1 focus:ring-indigo-500">
                  <option>Seleccione tipo de archivo</option>
                </select>
                <button className={styles.uploadButton}>CARGAR</button>
              </div>
            </div>

            <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-lg bg-white dark:bg-gray-950 flex-1 overflow-hidden shadow-sm flex flex-col">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-indigo-50/50 dark:bg-indigo-900/20 z-10">
                  <tr>
                    <th className={styles.tableHeader}>Archivo</th>
                    <th className={styles.tableHeader}>Tipo</th>
                    <th className={styles.tableHeader}>Opción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-gray-400 italic text-[11px]"
                    >
                      No hay archivos adjuntos
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column Bottom Fields */}
          <div className="border-t border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-950">
            <ClientDataRow label="Cliente">
              <select className={styles.select} defaultValue="RESIDENCIAL">
                <option>RESIDENCIAL</option>
                <option>CORPORATIVO</option>
              </select>
            </ClientDataRow>

            <ClientDataRow label="Promoción" />

            <ClientDataRow label="Referido por">
              <div className="relative w-full">
                <SearchI className="absolute left-0 top-0.5 w-3 h-3 text-gray-300" />
                <input
                  type="text"
                  className={cn(styles.input, "pl-5")}
                  placeholder="Buscar por nombres"
                />
              </div>
            </ClientDataRow>

            <ClientDataRow label="Motivo" />

            <ClientDataRow label="Factura auto.">
              <div className="flex items-center gap-2">
                <div
                  className={`${styles.toggle} ${styles.toggleOff} scale-75 origin-left`}
                >
                  <span
                    className={`${styles.toggleThumb} ${styles.toggleThumbOff}`}
                  />
                </div>
                <span className="font-bold text-[10px] text-gray-400">NO</span>
              </div>
            </ClientDataRow>

            <ClientDataRow label="Referencia">
              <span className="text-gray-400 italic text-[10px]">
                NO HABILITADO
              </span>
            </ClientDataRow>
          </div>
        </div>
      </main>
    </article>
  );
}
