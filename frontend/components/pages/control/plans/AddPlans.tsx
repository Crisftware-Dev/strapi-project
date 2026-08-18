"use client";

import { usePlans } from "@/hooks/usePlans";
import { useState } from "react";
import { SearchI, MoneyI, AddI, UserI } from "@/components/icons/Icons";
import { PlanProvider, usePlanContext, SERVICE_TYPES, CUT_OPTIONS } from "@/contexts/plan-context";
import { useCurrentUser } from "@/hooks/useUser";
import { useTabsControl } from "@/contexts/control-context";
import FormField from "@/components/ui/FormField";
import FormButton from "@/components/ui/FormButton";
import { Notification } from "@/components/ui/feedback";

// ─── Tabla de planes registrados ─────────────────────────────────────────────

function PlansTable() {
  const { activeSubControls } = useTabsControl();
  const { data: plansData, isLoading, isError } = usePlans(activeSubControls === "add-plans");
  const [search, setSearch] = useState("");

  const plans = plansData || [];
  const filteredPlans = plans.filter(
    (p) =>
      p.plan?.toLowerCase().includes(search.toLowerCase()) ||
      p.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Planes Registrados ({plans.length})
        </h3>

        <div className="relative w-48 sm:w-64">
          <SearchI className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            id="add-plans-search"
            type="text"
            placeholder="Filtrar por nombre o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-7 pr-2.5 py-1 text-[11px]
              bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
              rounded-lg text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 focus:outline-none focus:border-amber-400
              transition-all duration-150
            "
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                {["Nombre del Plan", "Tipo", "Corte (Día)", "Meses", "Descuento", "Valor"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span>Cargando planes del catálogo...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                    Error al cargar los planes del servidor.
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                    No se encontraron planes.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((p) => (
                  <tr
                    key={p.documentId}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100 font-semibold">{p.plan}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 text-[10px] font-medium">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-mono">{p.cut}</td>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-mono">{p.meses}</td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-mono">
                      {p.descuento > 0 ? (
                        <span className="text-green-600 dark:text-green-400">-${p.descuento.toFixed(2)}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100 font-mono font-bold">
                      ${p.valor?.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Formulario de creación ───────────────────────────────────────────────────

function PlanForm() {
  const { form, handleInputChange, handleSubmit, isPending } = usePlanContext();
  const { nameAndLastname } = useCurrentUser();

  return (
    <div className="lg:col-span-5 space-y-4">
      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        Registrar Nuevo Plan
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-4 space-y-4">

          <FormField
            label="Nombre del Plan"
            name="plan"
            type="text"
            placeholder="Ej: Plan Fibra Simétrica 200 Mbps"
            value={form.plan}
            onChange={handleInputChange}
            required
          />

          <FormField
            as="select"
            label="Tipo de Servicio"
            name="type"
            value={form.type}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar</option>
            {SERVICE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Valor Mensual ($)"
              name="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.valor}
              onChange={handleInputChange}
              icon={<MoneyI className="w-3.5 h-3.5" />}
              required
            />

            <FormField
              label="Creado por"
              name="CREATEDBY"
              type="text"
              value={nameAndLastname}
              onChange={handleInputChange}
              icon={<UserI className="w-3.5 h-3.5" />}
              readOnly
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              as="select"
              label="Día de Corte"
              name="cut"
              value={form.cut}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar</option>
              {CUT_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </FormField>
          </div>

        </div>

        <div className="bg-gray-50 dark:bg-gray-850/50 px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
          <FormButton
            isPending={isPending}
            label="Crear Plan en Sistema"
            pendingLabel="Creando..."
          />
        </div>
      </form>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AddPlans() {
  const { nameAndLastname } = useCurrentUser();

  return (
    <PlanProvider userName={nameAndLastname}>
      <AddPlansContent />
    </PlanProvider>
  );
}

function AddPlansContent() {
  const { notification } = usePlanContext();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40">
          <AddI />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Añadir Planes al Sistema
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Crea y cataloga los planes de servicio disponibles en el backend de Strapi.
          </p>
        </div>
      </div>

      <Notification notification={notification} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PlansTable />
        <PlanForm />
      </div>

    </div>
  );
}