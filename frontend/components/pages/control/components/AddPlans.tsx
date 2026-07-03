"use client";

import { usePlans, useCreatePlan } from "@/hooks/usePlans";
import { useState } from "react";
import { SearchI, MoneyI, AddI, UserI } from "@/components/icons/Icons";
import { useUser } from "@/hooks/useUser";

export default function AddPlans() {
  const { data: plansData, isLoading, isError } = usePlans(true);
  const createPlanMutation = useCreatePlan();

  const plans = plansData?.data || [];
  const { data: user } = useUser();
  
    const nameAndLastname =
      user?.fullname
        ?.split(" ")[0]
        .concat(" ", user?.lastname?.split(" ")[0])
        ?.toUpperCase() || "";

  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    plan: "",
    type: "",
    valor: "",
    cut: "",
    CREATEDBY: "",
  });

  const filteredPlans = plans.filter(
    (p) =>
      p.plan?.toLowerCase().includes(search.toLowerCase()) ||
      p.type?.toLowerCase().includes(search.toLowerCase())
  );

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valorNum = parseFloat(form.valor);
    const cutNum = parseInt(form.cut, 10);

    if (!form.plan.trim()) {
      showNotification("El nombre del plan no puede estar vacío.", "error");
      return;
    }

    if (isNaN(valorNum) || valorNum < 0) {
      showNotification("El valor debe ser un número positivo.", "error");
      return;
    }

    if (isNaN(cutNum) || cutNum < 1 || cutNum > 31) {
      showNotification("El día de corte debe estar entre 1 y 31.", "error");
      return;
    }

    try {
      await createPlanMutation.mutateAsync({
        plan: form.plan.trim(),
        type: form.type,
        valor: valorNum,
        cut: cutNum,
        CREATEDBY: nameAndLastname,
      });

      showNotification(`Plan "${form.plan}" creado con éxito en el sistema.`, "success");
      
      // Reset form
      setForm({
        plan: "",
        type: "",
        valor: "",
        cut: "",
        CREATEDBY: "",
      });
    } catch (error) {
      showNotification(`Error al registrar el plan en el backend: ${(error as Error).message}`, "error");
    }
  };

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
      {notification && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium shadow-lg transition-all duration-300 animate-slide-in-up ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-900 dark:text-green-300"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-900 dark:text-red-300"
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                    <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Nombre del Plan</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Tipo</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Corte (Día)</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Meses</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Descuento</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
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
                      <tr key={p.documentId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
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
                        <td className="px-4 py-2.5 text-gray-900 dark:text-gray-100 font-mono font-bold">${p.valor?.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO DE REGISTRO (5 de 12 columnas) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Registrar Nuevo Plan
          </h3>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4 space-y-4">
              
              {/* Nombre del Plan */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="plan" className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                  Nombre del Plan
                </label>
                <input
                  id="plan"
                  name="plan"
                  type="text"
                  placeholder="Ej: Plan Fibra Simétrica 200 Mbps"
                  value={form.plan}
                  onChange={handleInputChange}
                  required
                  className="
                    px-3 py-1.5 text-xs bg-white dark:bg-gray-950
                    border border-gray-200 dark:border-gray-800 rounded-lg
                    text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                    focus:ring-amber-500/20 focus:border-amber-500 transition-all
                  "
                />
              </div>

              {/* Tipo de Plan (Dropdown) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="type" className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                  Tipo de Servicio
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="
                    px-3 py-1.5 text-xs bg-white dark:bg-gray-950
                    border border-gray-200 dark:border-gray-800 rounded-lg
                    text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                    focus:ring-amber-500/20 focus:border-amber-500 transition-all
                  "
                >
                  <option value="">Seleccionar</option>
                  <option value="COBRE">COBRE</option>
                  <option value="MEDIO INALÁMBRICO">MEDIO INALÁMBRICO</option>
                  <option value="FIBRA ÓPTICA">FIBRA ÓPTICA</option>
                </select>
              </div>

              {/* Valor Mensual */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="valor" className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                    Valor Mensual ($)
                  </label>
                  <div className="relative">
                    <MoneyI className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.valor}
                      onChange={handleInputChange}
                      required
                      className="
                        w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-950
                        border border-gray-200 dark:border-gray-800 rounded-lg
                        text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                        focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono
                      "
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="createdBy" className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                    Creado por
                  </label>
                  <div className="relative">
                    <UserI className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      id="CREATEDBY"
                      name="CREATEDBY"
                      type="text"
                      value={nameAndLastname}
                      onChange={handleInputChange}
                      required
                      className="
                        w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-950
                        border border-gray-200 dark:border-gray-800 rounded-lg
                        text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                        focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono
                      "
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Día de Corte y Duración */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cut" className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                    Día de Corte
                  </label>
                  <select
                    id="cut"
                    name="cut"
                    value={form.cut}
                    onChange={handleInputChange}
                    required
                    className="
                      px-3 py-1.5 text-xs bg-white dark:bg-gray-950
                      border border-gray-200 dark:border-gray-800 rounded-lg
                      text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                      focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono
                    "
                  >
                    <option value="">Seleccionar</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Acciones de Envío */}
            <div className="bg-gray-50 dark:bg-gray-850/50 px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
              <button
                type="submit"
                disabled={createPlanMutation.isPending}
                className="
                  px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-amber-600 hover:bg-amber-700
                  disabled:bg-amber-600/50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-150
                "
              >
                {createPlanMutation.isPending ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creando...
                  </span>
                ) : (
                  "Crear Plan en Sistema"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
