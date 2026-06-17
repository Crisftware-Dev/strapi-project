"use client";

import { useState } from "react";
import { PencilModifYI, SearchI } from "@/components/icons/Icons";

const MOCK_CONTRATOS = [
  {
    id: "CTR-00101",
    cliente: "Pérez García, Juan",
    plan: "Plan Premium",
    estado: "Activo",
    valor: "$45.00",
  },
  {
    id: "CTR-00098",
    cliente: "López Torres, Ana",
    plan: "Plan Estándar",
    estado: "Activo",
    valor: "$30.00",
  },
  {
    id: "CTR-00085",
    cliente: "Ramírez Castro, Carlos",
    plan: "Plan Básico",
    estado: "Pendiente",
    valor: "$20.00",
  },
];

const ESTADO_COLOR: Record<string, string> = {
  Activo:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactivo: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Pendiente:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Cancelado: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function ModificarContratos() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MOCK_CONTRATOS.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.cliente.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40">
          <PencilModifYI className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Modificar Contratos
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Selecciona un contrato de la lista para editarlo.
          </p>
        </div>
      </div>

      {/* ── Buscador ───────────────────────────────────────────────────────── */}
      <div className="relative">
        <SearchI className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          id="modificar-search"
          type="text"
          placeholder="Buscar por número o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full pl-8 pr-3 py-1.5 text-xs
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            rounded-lg text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 focus:outline-none
            focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400
            transition-all duration-150
          "
        />
      </div>

      {/* ── Tabla ──────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
              {["N° Contrato", "Cliente", "Plan", "Estado", "Valor", "Acción"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-400 dark:text-gray-500"
                >
                  No se encontraron contratos.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className={`
                    hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-100
                    ${selected === c.id ? "bg-amber-50 dark:bg-amber-900/10" : ""}
                  `}
                >
                  <td className="px-4 py-2 font-mono text-indigo-600 dark:text-indigo-400">
                    {c.id}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {c.cliente}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    {c.plan}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ESTADO_COLOR[c.estado]}`}
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {c.valor}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      id={`modificar-btn-${c.id}`}
                      type="button"
                      onClick={() => setSelected(c.id)}
                      className="
                        flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium
                        bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400
                        border border-amber-200 dark:border-amber-700
                        hover:bg-amber-100 dark:hover:bg-amber-900/40
                        transition-colors duration-150
                      "
                    >
                      <PencilModifYI className="w-3 h-3" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Panel edición inline ────────────────────────────────────────────── */}
      {selected && (
        <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-xl shadow-sm p-4">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
            Editando contrato:{" "}
            <span className="font-mono">{selected}</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            Formulario de edición — conectar con endpoint de actualización.
          </p>
          <div className="flex justify-end mt-4">
            <button
              id="modificar-cancel"
              type="button"
              onClick={() => setSelected(null)}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
