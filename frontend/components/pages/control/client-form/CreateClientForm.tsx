"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClientAction, uploadFileAction } from "@/actions/mutations";
import { styles } from "@/app/styles/styles";
import { Select } from "@/components/ui/primitives";
import { useNewClienteContext } from "@/contexts/new-cliente-context";
import { useQueryClient } from "@tanstack/react-query";

const TODAY = new Date().toISOString().slice(0, 10);

const EMPTY_REFERENCE = {
  fullnames: "",
  relationship: "",
  phone: "",
};

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
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [reference, setReference] = useState(EMPTY_REFERENCE);

  const handleContractFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setContractFile(file);

    if (file) {
      setFormData((prev) => ({
        ...prev,
        files: [
          { name: "CONTRATO FIRMADO", filename: file.name, pendingFile: file },
        ],
      }));
    } else {
      setFormData((prev) => ({ ...prev, files: [] }));
    }
  };

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
      // Archivo de contrato obligatorio
      if (!contractFile) {
        setError("El archivo de contrato es obligatorio.");
        return;
      }

      // Referencia familiar obligatoria (al menos una)
      if (!formData.reference || formData.reference.length === 0) {
        setError("Debe agregar al menos una referencia familiar.");
        return;
      }

      // Subir archivos pendientes (contrato)
      const pendingFiles = (formData.files || []).filter(
        (f) => f.pendingFile,
      );
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
        files,
        installationDate: formData.installationDate || TODAY,
      };

      await createClientAction(payload);
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      setSuccess("Cliente creado correctamente.");
      resetFormData();
      setContractFile(null);
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
      className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow w-full max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">
        Crear Nuevo Cliente
      </h2>

      {error && (
        <div className="rounded-md border border-pink-200 bg-pink-50 dark:bg-pink-950/40 dark:border-pink-900/50 p-3 text-xs text-pink-600 dark:text-pink-400">
          <p>{error}</p>
          {errorHint && <p className="mt-1">{errorHint}</p>}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-950/40 dark:border-green-900/50 p-3 text-xs text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      {isExistingClient && existingClient && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900/50 p-3 text-xs text-amber-600 dark:text-amber-400">
          Cliente existente detectado: {existingClient.nombres}{" "}
          {existingClient.apellidos}. Los campos de nombres y apellidos
          quedaron bloqueados.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Identificación y Nombres */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Identificación *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.identificacion || ""}
            onChange={(e) => handleField("identificacion", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Nombres *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.nombres || ""}
            onChange={(e) => handleField("nombres", e.target.value)}
            disabled={isFieldLocked("nombres")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Apellidos *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.apellidos || ""}
            onChange={(e) => handleField("apellidos", e.target.value)}
            disabled={isFieldLocked("apellidos")}
          />
        </div>

        {/* Fechas y Demografía */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Fecha de Nacimiento *</Label>
          <Input
            required
            type="date"
            className={styles.input}
            value={formData.currentAge || ""}
            onChange={(e) => handleField("currentAge", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Ciudad *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.ciudad || ""}
            onChange={(e) => handleField("ciudad", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Email *</Label>
          <Input
            required
            type="email"
            className={styles.input}
            value={formData.email || ""}
            onChange={(e) => handleField("email", e.target.value)}
          />
        </div>

        {/* Contacto */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Teléfono Fijo *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.contact?.telephone || ""}
            onChange={(e) => handleContact("telephone", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Celular SMS</Label>
          <Input
            type="text"
            className={styles.input}
            value={formData.contact?.phoneSms || ""}
            onChange={(e) => handleContact("phoneSms", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Celular Alternativo</Label>
          <Input
            type="text"
            className={styles.input}
            value={formData.contact?.phoneTwo || ""}
            onChange={(e) => handleContact("phoneTwo", e.target.value)}
          />
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Latitud (Ubicación) *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.location?.latitude || ""}
            onChange={(e) => handleLocation("latitude", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Longitud (Ubicación) *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.location?.longitude || ""}
            onChange={(e) => handleLocation("longitude", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Entidad *</Label>
          <Select
            required
            className={styles.input}
            value={formData.entity || ""}
            onChange={(e) => handleField("entity", e.target.value)}
          >
            <option value="">Seleccione</option>
            <option value="PRIVADA">PRIVADA</option>
            <option value="PUBLICA">PUBLICA</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Tipo de Cliente *</Label>
          <Select
            required
            className={styles.input}
            value={formData.tipoCliente || ""}
            onChange={(e) => handleField("tipoCliente", e.target.value)}
          >
            <option value="RESIDENCIAL">RESIDENCIAL</option>
            <option value="CORPORATIVO">CORPORATIVO</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Medio de Plan *</Label>
          <Select
            required
            className={styles.input}
            value={formData.tipoPlan || ""}
            onChange={(e) => handleField("tipoPlan", e.target.value)}
          >
            <option value="COBRE">COBRE</option>
            <option value="MEDIO INALÁMBRICO">MEDIO INALÁMBRICO</option>
            <option value="FIBRA ÓPTICA">FIBRA ÓPTICA</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Plan Contratado *</Label>
          <Select
            required
            className={styles.input}
            value={formData.plans?.[0]?.documentId || ""}
            onChange={(e) => handleField("plans", e.target.value)}
            onFocus={() => setPlansEnabled(true)}
          >
            <option value="">Seleccione</option>
            {plansResults?.map((plan) => (
              <option key={plan.documentId} value={plan.documentId}>
                {plan.plan}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Valores *</Label>
          <Input
            required
            type="number"
            step="0.01"
            className={styles.input}
            value={formData.valores || ""}
            onChange={(e) => handleField("valores", Number(e.target.value))}
          />
        </div>

        {/* Fecha de Instalación — fecha actual por defecto y no editable */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Fecha de Instalación *</Label>
          <Input
            required
            type="date"
            readOnly
            className={styles.input}
            value={formData.installationDate || TODAY}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Cliente Desde *</Label>
          <Input
            required
            type="date"
            className={styles.input}
            value={formData.sinceCustomer || ""}
            onChange={(e) => handleField("sinceCustomer", e.target.value)}
          />
        </div>

        {/* Datos Adicionales */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Actividad Económica *</Label>
          <Input
            required
            type="text"
            className={styles.input}
            value={formData.economicActivity || ""}
            onChange={(e) => handleField("economicActivity", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Tipo de Vivienda *</Label>
          <Select
            required
            className={styles.input}
            value={formData.typeOfHousing || ""}
            onChange={(e) => handleField("typeOfHousing", e.target.value)}
          >
            <option value="PROPIA">PROPIA</option>
            <option value="ALQUILADA">ALQUILADA</option>
            <option value="FAMILIAR">FAMILIAR</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Score Crediticio *</Label>
          <Input
            required
            type="number"
            className={styles.input}
            value={formData.scoreCredit || ""}
            onChange={(e) => handleField("scoreCredit", Number(e.target.value))}
          />
        </div>

        {/* Archivo de Contrato — obligatorio */}
        <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
          <Label className={styles.inputLabel}>Archivo de Contrato *</Label>
          <Input
            required
            type="file"
            accept=".pdf"
            className={styles.input}
            onChange={handleContractFile}
          />
          {contractFile && (
            <p className="text-[10px] text-green-600 dark:text-green-400 px-2">
              Archivo cargado: {contractFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Referencias Familiares — al menos una */}
      <div className="mt-4 rounded-md border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/40 dark:bg-indigo-950/30 p-4">
        <Label className="mb-2 block text-sm font-semibold text-indigo-700 dark:text-indigo-400">
          Referencia Familiar * (al menos una)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            type="text"
            placeholder="Nombre completo"
            className={styles.input}
            value={reference.fullnames}
            onChange={(e) =>
              setReference((prev) => ({
                ...prev,
                fullnames: e.target.value,
              }))
            }
          />
          <Input
            type="text"
            placeholder="Relación"
            className={styles.input}
            value={reference.relationship}
            onChange={(e) =>
              setReference((prev) => ({
                ...prev,
                relationship: e.target.value,
              }))
            }
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Teléfono"
              className={styles.input}
              value={reference.phone}
              onChange={(e) =>
                setReference((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <Button
              type="button"
              onClick={addReference}
              className={styles.uploadButton}
            >
              Agregar
            </Button>
          </div>
        </div>

        {formData.reference && formData.reference.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {formData.reference.map((ref, index) => (
              <div
                key={`${ref.fullnames}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-900 px-3 py-2 text-xs"
              >
                <span className="text-gray-700 dark:text-gray-200">
                  {ref.fullnames} — {ref.relationship} — {ref.phone}
                </span>
                <Button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-red-50 border border-red-200 text-red-400 hover:text-red-600 rounded-md transition-colors"
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-indigo-50 dark:bg-indigo-950 p-4 rounded-md">
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.automaticCut)}
            onChange={(e) => handleField("automaticCut", e.target.checked)}
          />
          Corte Automático
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.automaticInvoice)}
            onChange={(e) => handleField("automaticInvoice", e.target.checked)}
          />
          Factura Automática
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.withholdingAgent)}
            onChange={(e) => handleField("withholdingAgent", e.target.checked)}
          />
          Agente de Retención
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.relatedClient)}
            onChange={(e) => handleField("relatedClient", e.target.checked)}
          />
          Cliente Relacionado
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.creditButt)}
            onChange={(e) => handleField("creditButt", e.target.checked)}
          />
          Buró de Crédito
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.discardButt)}
            onChange={(e) => handleField("discardButt", e.target.checked)}
          />
          Descartar Buró
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.hasDucts)}
            onChange={(e) => handleField("hasDucts", e.target.checked)}
          />
          Tiene Ductos
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.discountLaw?.disability)}
            onChange={(e) => handleDiscountLaw("disability", e.target.checked)}
          />
          Dscto. Discapacidad
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.discountLaw?.oldAge)}
            onChange={(e) => handleDiscountLaw("oldAge", e.target.checked)}
          />
          Dscto. Tercera Edad
        </Label>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear Cliente"}
        </Button>
      </div>
    </form>
  );
}
