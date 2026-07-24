"use client";

import { useState } from "react";
import { SupportI } from "@/components/icons/Icons";

interface Ticket {
  id: string;
  asunto: string;
  prioridad: "Alta" | "Media" | "Baja";
  estado: "Abierto" | "En proceso" | "Cerrado";
  fecha: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    asunto: "Error en facturación",
    prioridad: "Alta",
    estado: "Abierto",
    fecha: "2026-06-01",
  },
  {
    id: "TKT-002",
    asunto: "Cambio de plan solicitado",
    prioridad: "Media",
    estado: "En proceso",
    fecha: "2026-05-28",
  },
  {
    id: "TKT-003",
    asunto: "Problema de conectividad",
    prioridad: "Alta",
    estado: "Cerrado",
    fecha: "2026-05-20",
  },
];

const PRIORIDAD_COLOR: Record<string, string> = {
  Alta: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Media:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Baja: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const ESTADO_COLOR: Record<string, string> = {
  Abierto: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "En proceso":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Cerrado: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function SoporteContratos() {
  const [showForm, setShowForm] = useState(false);
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<"Alta" | "Media" | "Baja">(
    "Media"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setAsunto("");
    setDescripcion("");
    setPrioridad("Media");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <SupportI className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Soporte
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gestión de tickets de soporte técnico.
            </p>
          </div>
        </div>
        <button
          id="soporte-nuevo-ticket"
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
        >
          {showForm ? "Cancelar" : "+ Nuevo ticket"}
        </button>
      </div>

      {/* ── Formulario nuevo ticket ─────────────────────────────────────────── */}
      {showForm && (
        <form
          id="soporte-ticket-form"
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-700 rounded-xl shadow-sm p-4 space-y-3"
        >
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
            Crear nuevo ticket
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="soporte-asunto"
                className="text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                Asunto
              </label>
              <input
                id="soporte-asunto"
                type="text"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Describe brevemente el problema"
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="soporte-prioridad"
                className="text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                Prioridad
              </label>
              <select
                id="soporte-prioridad"
                value={prioridad}
                onChange={(e) =>
                  setPrioridad(e.target.value as "Alta" | "Media" | "Baja")
                }
                className={inputCls}
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label
                htmlFor="soporte-descripcion"
                className="text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                Descripción
              </label>
              <textarea
                id="soporte-descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Detalla el problema..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              id="soporte-ticket-cancel"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="soporte-ticket-submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Enviar ticket
            </button>
          </div>
        </form>
      )}

      {/* ── Métricas ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Abiertos",
            value: "1",
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "En proceso",
            value: "1",
            color: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Cerrados",
            value: "1",
            color: "text-gray-500 dark:text-gray-400",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center shadow-sm"
          >
            <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Lista de tickets ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Tickets recientes
          </span>
        </div>
        <ul className="divide-y divide-gray-50 dark:divide-gray-800">
          {MOCK_TICKETS.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
            >
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 w-16 shrink-0">
                {t.id}
              </span>
              <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">
                {t.asunto}
              </span>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${PRIORIDAD_COLOR[t.prioridad]}`}
              >
                {t.prioridad}
              </span>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${ESTADO_COLOR[t.estado]}`}
              >
                {t.estado}
              </span>
              <span className="shrink-0 text-[11px] text-gray-400">
                {t.fecha}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const inputCls = `
  w-full px-3 py-1.5 text-xs
  bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
  rounded-lg text-gray-900 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400
  transition-all duration-150
`;
