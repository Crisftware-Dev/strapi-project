"use client";

import { useState } from "react";
import { UserI } from "@/components/icons/Icons";

interface ContratoFormData {
  numeroContrato: string;
  cliente: string;
  identificacion: string;
  fechaInicio: string;
  fechaFin: string;
  plan: string;
  estado: string;
  valor: string;
  observaciones: string;
}

const ESTADOS = ["Activo", "Inactivo", "Pendiente", "Cancelado"];
const PLANES = ["Plan Básico", "Plan Estándar", "Plan Premium", "Plan Empresarial"];

const INITIAL_FORM: ContratoFormData = {
  numeroContrato: "",
  cliente: "",
  identificacion: "",
  fechaInicio: "",
  fechaFin: "",
  plan: "",
  estado: "Activo",
  valor: "",
  observaciones: "",
};

export default function ContratoForm() {
  const [form, setForm] = useState<ContratoFormData>(INITIAL_FORM);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la llamada al backend
    setSaved(true);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setSaved(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
          <UserI className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Nuevo Contrato
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Completa los campos para registrar un contrato.
          </p>
        </div>
      </div>

      {/* ── Formulario ─────────────────────────────────────────────────────── */}
      <form
        id="contrato-form"
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
      >
        {/* Sección: Datos del contrato */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Datos del Contrato
          </p>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Número de Contrato */}
          <Field label="Número de Contrato" htmlFor="numeroContrato">
            <input
              id="numeroContrato"
              name="numeroContrato"
              type="text"
              value={form.numeroContrato}
              onChange={handleChange}
              placeholder="Ej: CTR-00123"
              required
              className={inputCls}
            />
          </Field>

          {/* Estado */}
          <Field label="Estado" htmlFor="estado">
            <select
              id="estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className={inputCls}
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </Field>

          {/* Cliente */}
          <Field label="Nombre del Cliente" htmlFor="cliente">
            <input
              id="cliente"
              name="cliente"
              type="text"
              value={form.cliente}
              onChange={handleChange}
              placeholder="Apellidos y Nombres"
              required
              className={inputCls}
            />
          </Field>

          {/* Identificación */}
          <Field label="Identificación" htmlFor="identificacion">
            <input
              id="identificacion"
              name="identificacion"
              type="text"
              value={form.identificacion}
              onChange={handleChange}
              placeholder="RUC / Cédula / Pasaporte"
              className={inputCls}
            />
          </Field>

          {/* Fecha inicio */}
          <Field label="Fecha de Inicio" htmlFor="fechaInicio">
            <input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={form.fechaInicio}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          {/* Fecha fin */}
          <Field label="Fecha de Fin" htmlFor="fechaFin">
            <input
              id="fechaFin"
              name="fechaFin"
              type="date"
              value={form.fechaFin}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>

          {/* Plan */}
          <Field label="Plan" htmlFor="plan">
            <select
              id="plan"
              name="plan"
              value={form.plan}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">-- Seleccionar plan --</option>
              {PLANES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>

          {/* Valor */}
          <Field label="Valor Mensual ($)" htmlFor="valor">
            <input
              id="valor"
              name="valor"
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={handleChange}
              placeholder="0.00"
              className={inputCls}
            />
          </Field>

          {/* Observaciones */}
          <div className="sm:col-span-2">
            <Field label="Observaciones" htmlFor="observaciones">
              <textarea
                id="observaciones"
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={3}
                placeholder="Notas adicionales sobre el contrato..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </div>

        {/* ── Footer con acciones ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800">
          <button
            id="contrato-form-reset"
            type="button"
            onClick={handleReset}
            className="
              px-3 py-1.5 text-xs font-medium rounded-lg
              text-gray-600 dark:text-gray-300
              border border-gray-200 dark:border-gray-600
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors duration-150
            "
          >
            Limpiar
          </button>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium animate-pulse">
                ✓ Contrato guardado
              </span>
            )}
            <button
              id="contrato-form-submit"
              type="submit"
              className="
                px-5 py-1.5 text-xs font-semibold rounded-lg
                bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                text-white transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
              "
            >
              Guardar Contrato
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Componente auxiliar Field ────────────────────────────────────────────────
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-gray-600 dark:text-gray-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Clases reutilizables del input ───────────────────────────────────────────
const inputCls = `
  w-full px-3 py-1.5 text-xs
  bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
  rounded-lg text-gray-900 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
  transition-all duration-150
`;
