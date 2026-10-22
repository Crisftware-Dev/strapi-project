"use client";

import React, { useState } from "react";
import FormField from "@/components/ui/FormField";
import FormButton from "@/components/ui/FormButton";
import { Button } from "@/components/ui/button";
import { createClientAction, uploadFileAction } from "@/actions/mutations";
import { toNumber } from "@/lib/form-value";
import { useNewClienteContext } from "@/contexts/new-cliente-context";
import { useQueryClient } from "@tanstack/react-query";
import FileUploader, { Files } from "@/components/ui/files";
import { CompactTable, Headers, PaymentRow } from "@/components/ui/compact-table";
import { DeleteI } from "@/components/icons/Icons";

const TODAY = new Date().toISOString().slice(0, 10);

const EMPTY_REFERENCE = {
  fullnames: "",
  relationship: "",
  phone: "",
};

const parentescos = [
  "HIJO/A",
  "PADRE/MADRE",
  "ESPOSO/A",
  "HERMANO/A",
  "ABUELO/A",
  "OTRO",
] as const;

export default function NewClient({ onSuccess }: { onSuccess?: () => void }) {
  const {
    formData,
    setFormData,
    handleField,
    handleContact,
    handleLocation,
    handleDiscountLaw,
    resetFormData,
    existingClient,
    isExistingClient,
    isFieldLocked,
    plansResults,
    setPlansEnabled,
  } = useNewClienteContext();

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [reference, setReference] = useState(EMPTY_REFERENCE);

  const addReference = () => {
    if (
      !reference.fullnames.trim() ||
      !reference.relationship.trim() ||
      !reference.phone.trim()
    ) {
      setError("Complete nombre, relación y teléfono de la referencia.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      reference: [
        ...(prev.reference || []),
        {
          identificacion: "",
          fullnames: reference.fullnames.trim(),
          relationship: reference.relationship.trim(),
          phone: Number(reference.phone),
        },
      ],
    }));
    setReference(EMPTY_REFERENCE);
    setError(null);
  };

  const removeReference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reference: (prev.reference || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    setErrorHint(null);

    try {
      if (!formData.files || formData.files.length === 0) {
        setError("El archivo de contrato es obligatorio.");
        return;
      }

      if (!formData.reference || formData.reference.length === 0) {
        setError("Debe agregar al menos una referencia familiar.");
        return;
      }

      const pendingFiles = (formData.files || []).filter((f) => f.pendingFile);
      let files = [...(formData.files || [])];

      if (pendingFiles.length > 0) {
        const uploadData = new FormData();
        pendingFiles.forEach((f) => {
          if (f.pendingFile) uploadData.append("files", f.pendingFile);
        });

        const uploaded = await uploadFileAction(uploadData);

        let mediaIndex = 0;
        files = files.map((f) => {
          if (f.pendingFile && mediaIndex < uploaded.length) {
            const { ...rest } = f;
            mediaIndex += 1;
            return { ...rest, file: [uploaded[mediaIndex - 1]] };
          }
          return f;
        });
      }

      const payload = {
        ...formData,
        valores: toNumber(formData.valores),
        scoreCredit: toNumber(formData.scoreCredit),
        files,
        installationDate: formData.installationDate || TODAY,
      };

      await createClientAction(payload);
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      setSuccess("Cliente creado correctamente.");
      resetFormData();
      setReference(EMPTY_REFERENCE);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Error al crear el cliente. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-sm w-full"
    >

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-3 text-xs">
          <p>{error}</p>
          {errorHint && <p className="mt-1">{errorHint}</p>}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300 p-3 text-xs">
          {success}
        </div>
      )}

      {isExistingClient && existingClient && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 p-3 text-xs">
          Cliente existente detectado: {existingClient.nombres}{" "}
          {existingClient.apellidos}. Los campos de nombres y apellidos quedaron bloqueados.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Identificación y Nombres */}
        <FormField
          label="Identificación *"
          name="identificacion"
          value={formData.identificacion || ""}
          onChange={(e) => handleField("identificacion", e.target.value)}
          required
        />

        <FormField
          label="Nombres *"
          name="nombres"
          value={formData.nombres || ""}
          onChange={(e) => handleField("nombres", e.target.value)}
          disabled={isFieldLocked("nombres")}
          required
        />

        <FormField
          label="Apellidos *"
          name="apellidos"
          value={formData.apellidos || ""}
          onChange={(e) => handleField("apellidos", e.target.value)}
          disabled={isFieldLocked("apellidos")}
          required
        />

        {/* Fechas y Demografía */}
        <FormField
          label="Fecha de Nacimiento *"
          name="currentAge"
          type="date"
          value={formData.currentAge || ""}
          onChange={(e) => handleField("currentAge", e.target.value)}
          required
        />

        <FormField
          label="Ciudad *"
          name="ciudad"
          value={formData.ciudad || ""}
          onChange={(e) => handleField("ciudad", e.target.value)}
          required
        />

        <FormField
          label="Email *"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleField("email", e.target.value)}
          required
        />

        {/* Contacto */}
        <FormField
          label="Teléfono Fijo *"
          name="telephone"
          value={formData.contact?.telephone || ""}
          onChange={(e) => handleContact("telephone", e.target.value)}
          required
        />

        <FormField
          label="Celular SMS"
          name="phoneSms"
          value={formData.contact?.phoneSms || ""}
          onChange={(e) => handleContact("phoneSms", e.target.value)}
        />

        <FormField
          label="Celular Alternativo"
          name="phoneTwo"
          value={formData.contact?.phoneTwo || ""}
          onChange={(e) => handleContact("phoneTwo", e.target.value)}
        />

        {/* Ubicación */}
        <FormField
          label="Latitud (Ubicación) *"
          name="latitude"
          value={formData.location?.latitude || ""}
          onChange={(e) => handleLocation("latitude", e.target.value)}
          required
        />

        <FormField
          label="Longitud (Ubicación) *"
          name="longitude"
          value={formData.location?.longitude || ""}
          onChange={(e) => handleLocation("longitude", e.target.value)}
          required
        />

        <FormField
          as="select"
          label="Entidad *"
          name="entity"
          value={formData.entity || ""}
          onChange={(e) => handleField("entity", e.target.value)}
          required
        >
          <option value="">Seleccione</option>
          <option value="PRIVADA">PRIVADA</option>
          <option value="PUBLICA">PUBLICA</option>
        </FormField>

        <FormField
          as="select"
          label="Tipo de Cliente *"
          name="tipoCliente"
          value={formData.tipoCliente || ""}
          onChange={(e) => handleField("tipoCliente", e.target.value)}
          required
        >
          <option value="RESIDENCIAL">RESIDENCIAL</option>
          <option value="CORPORATIVO">CORPORATIVO</option>
        </FormField>

        <FormField
          as="select"
          label="Medio de Plan *"
          name="tipoPlan"
          value={formData.tipoPlan || ""}
          onChange={(e) => handleField("tipoPlan", e.target.value)}
          required
        >
          <option value="COBRE">COBRE</option>
          <option value="MEDIO INALÁMBRICO">MEDIO INALÁMBRICO</option>
          <option value="FIBRA ÓPTICA">FIBRA ÓPTICA</option>
        </FormField>

        <FormField
          as="select"
          label="Plan Contratado *"
          name="plans"
          value={formData.plans?.[0]?.documentId || ""}
          onChange={(e) => handleField("plans", e.target.value)}
          onFocus={() => setPlansEnabled(true)}
          required
        >
          <option value="">Seleccione</option>
          {plansResults?.map((plan) => (
            <option key={plan.documentId} value={plan.documentId}>
              {plan.plan}
            </option>
          ))}
        </FormField>

        <FormField
          label="Valores *"
          name="valores"
          type="number"
          step="0.01"
          value={formData.valores ?? ""}
          onChange={(e) => handleField("valores", e.target.value)}
          required
        />

        <FormField
          label="Fecha de Instalación *"
          name="installationDate"
          type="date"
          value={formData.installationDate || TODAY}
          onChange={() => {}}
          readOnly
          required
        />

        <FormField
          label="Cliente Desde *"
          name="sinceCustomer"
          type="date"
          value={formData.sinceCustomer || ""}
          onChange={(e) => handleField("sinceCustomer", e.target.value)}
          required
        />

        <FormField
          label="Actividad Económica *"
          name="economicActivity"
          value={formData.economicActivity || ""}
          onChange={(e) => handleField("economicActivity", e.target.value)}
          required
        />

        <FormField
          as="select"
          label="Tipo de Vivienda *"
          name="typeOfHousing"
          value={formData.typeOfHousing || ""}
          onChange={(e) => handleField("typeOfHousing", e.target.value)}
          required
        >
          <option value="PROPIA">PROPIA</option>
          <option value="ALQUILADA">ALQUILADA</option>
          <option value="FAMILIAR">FAMILIAR</option>
        </FormField>

        <FormField
          label="Score Crediticio *"
          name="scoreCredit"
          type="number"
          value={formData.scoreCredit ?? ""}
          onChange={(e) => handleField("scoreCredit", e.target.value)}
          required
        />

        {/* Archivos y Referencias Familiares — lado a lado y a la misma altura */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Archivo de Contrato */}
          <div className="flex flex-col h-80 rounded-xl border border-border bg-muted/20 overflow-hidden">
            <FileUploader
              files={formData.files || []}
              onFilesChange={(updater) =>
                setFormData((prev) => ({
                  ...prev,
                  files: updater(prev.files || []),
                }))
              }
              filesList={[Files[0], Files[1]]}
              className="h-50 flex-1"
            />
          </div>

          {/* Referencias Familiares */}
          <div className="flex flex-col h-80 rounded-xl border border-border bg-muted/20 p-4 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Referencia Familiar * (al menos una)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="px-3 py-1.5 text-xs bg-white dark:bg-gray-950 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={reference.fullnames}
                  onChange={(e) =>
                    setReference((prev) => ({
                      ...prev,
                      fullnames: e.target.value,
                    }))
                  }
                />
                <select
                  className="px-3 py-1.5 text-xs bg-white dark:bg-gray-950 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={reference.relationship}
                  onChange={(e) =>
                    setReference((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                >
                  <option value="">Parentesco...</option>
                  {parentescos.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="Teléfono"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-950 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    value={reference.phone}
                    onChange={(e) =>
                      setReference((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="button"
                    onClick={addReference}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-medium transition-all shadow-sm"
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg bg-card flex-1 overflow-hidden shadow-sm flex flex-col min-h-50">
              <CompactTable className="w-full text-left" gridCols="4fr 3fr 3fr 2fr">
                <Headers
                  className="h-10 sticky top-0 bg-muted/50 border-b border-border z-10"
                  headers={["Nombre", "Parentesco", "Teléfono", "Opción"]}
                />
                <div className="contents">
                  {formData.reference && formData.reference.length > 0 ? (
                    formData.reference.map((ref, index) => (
                      <PaymentRow
                        className="col-span-4 h-10 align-top border-b border-border last:border-none"
                        key={`${ref.fullnames}-${index}`}
                        cells={[
                          <span
                            key="name"
                            className="px-2 truncate text-foreground"
                            title={ref.fullnames}
                          >
                            {ref.fullnames}
                          </span>,
                          <span
                            key="rel"
                            className="px-2 text-muted-foreground"
                          >
                            {ref.relationship}
                          </span>,
                          <span
                            key="phone"
                            className="px-2 text-muted-foreground"
                          >
                            {ref.phone}
                          </span>,
                          <div key="action" className="flex justify-center">
                            <Button
                              type="button"
                              className="px-2 py-0.5 text-xs bg-card hover:bg-destructive/10 border border-destructive/20 text-destructive rounded-lg transition-all"
                              onClick={() => removeReference(index)}
                            >
                              <DeleteI className="w-2.5 h-2.5" />
                            </Button>
                          </div>,
                        ]}
                      />
                    ))
                  ) : (
                    <div className="col-span-4 py-16 text-center text-xs text-muted-foreground">
                      No hay referencias familiares agregadas
                    </div>
                  )}
                </div>
              </CompactTable>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-muted/30">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.automaticCut)}
            onChange={(e) => handleField("automaticCut", e.target.checked)}
          />
          Corte Automático
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.automaticInvoice)}
            onChange={(e) => handleField("automaticInvoice", e.target.checked)}
          />
          Factura Automática
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.withholdingAgent)}
            onChange={(e) => handleField("withholdingAgent", e.target.checked)}
          />
          Agente de Retención
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.relatedClient)}
            onChange={(e) => handleField("relatedClient", e.target.checked)}
          />
          Cliente Relacionado
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.creditButt)}
            onChange={(e) => handleField("creditButt", e.target.checked)}
          />
          Buró de Crédito
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.discardButt)}
            onChange={(e) => handleField("discardButt", e.target.checked)}
          />
          Descartar Buró
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.hasDucts)}
            onChange={(e) => handleField("hasDucts", e.target.checked)}
          />
          Tiene Ductos
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.discountLaw?.disability)}
            onChange={(e) => handleDiscountLaw("disability", e.target.checked)}
          />
          Dscto. Discapacidad
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground font-medium">
          <input
            type="checkbox"
            className="rounded border-border text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            checked={Boolean(formData.discountLaw?.oldAge)}
            onChange={(e) => handleDiscountLaw("oldAge", e.target.checked)}
          />
          Dscto. Tercera Edad
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <FormButton
          isPending={loading}
          label="Crear Cliente"
          pendingLabel="Guardando..."
          className="bg-indigo-600 hover:bg-indigo-700 text-sm px-6 py-2"
        />
      </div>
    </form>
  );
}

