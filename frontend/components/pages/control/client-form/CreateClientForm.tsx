"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/typesDB";
import { createClientAction } from "@/actions/mutations";
import { styles } from "@/app/styles/styles";
import { Select } from "@/components/ui/primitives";

export default function NewClient({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState<Partial<Client>>({
    estado: "PROSPECTO",
    tipoCliente: "RESIDENCIAL",
    tipoPlan: "FIBRA ÓPTICA",
    automaticCut: false,
    withholdingAgent: false,
    automaticInvoice: false,
    relatedClient: false,
    creditButt: false,
    discardButt: false,
    hasDucts: false,
    planPrincipal: false,
    valores: 0,

    scoreCredit: 0,
    contact: { telephone: "", phoneSms: "", phoneTwo: "" },
    location: { latitude: "", longitude: "" },
    discountLaw: { disability: false, oldAge: false },
    reference: [],
    plans: [],
    files: [],
  });

  const [loading, setLoading] = useState(false);

  const handleField = (field: keyof Client, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContact = (field: keyof Client["contact"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value } as any,
    }));
  };

  const handleLocation = (field: keyof Client["location"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value } as any,
    }));
  };

  const handleDiscountLaw = (field: keyof NonNullable<Client["discountLaw"]>, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      discountLaw: { ...prev.discountLaw, [field]: value } as any,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClientAction(formData);
      alert("Cliente creado exitosamente");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al crear cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">Crear Nuevo Cliente</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Identificación y Nombres */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Identificación *</Label>
          <Input required type="text" className={styles.input} value={formData.identificacion || ""} onChange={(e) => handleField("identificacion", e.target.value)} />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Nombres *</Label>
          <Input required type="text" className={styles.input} value={formData.nombres || ""} onChange={(e) => handleField("nombres", e.target.value)} />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Apellidos *</Label>
          <Input required type="text" className={styles.input} value={formData.apellidos || ""} onChange={(e) => handleField("apellidos", e.target.value)} />
        </div>

        {/* Fechas y Demografía */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Fecha de Nacimiento *</Label>
          <Input required type="date" className={styles.input} value={formData.currentAge || ""} onChange={(e) => handleField("currentAge", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Ciudad *</Label>
          <Input required type="text" className={styles.input} value={formData.ciudad || ""} onChange={(e) => handleField("ciudad", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Email *</Label>
          <Input required type="email" className={styles.input} value={formData.email || ""} onChange={(e) => handleField("email", e.target.value)} />
        </div>

        {/* Contacto */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Teléfono Fijo *</Label>
          <Input required type="text" className={styles.input} value={formData.contact?.telephone || ""} onChange={(e) => handleContact("telephone", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Celular SMS *</Label>
          <Input required type="text" className={styles.input} value={formData.contact?.phoneSms || ""} onChange={(e) => handleContact("phoneSms", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Celular Alternativo *</Label>
          <Input required type="text" className={styles.input} value={formData.contact?.phoneTwo || ""} onChange={(e) => handleContact("phoneTwo", e.target.value)} />
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Latitud (Ubicación) *</Label>
          <Input required type="text" className={styles.input} value={formData.location?.latitude || ""} onChange={(e) => handleLocation("latitude", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Longitud (Ubicación) *</Label>
          <Input required type="text" className={styles.input} value={formData.location?.longitude || ""} onChange={(e) => handleLocation("longitude", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Estado *</Label>
          <Select required className={styles.input} value={formData.estado || ""} onChange={(e) => handleField("estado", e.target.value)}>
            <option value="PROSPECTO">PROSPECTO</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="CORTADO">CORTADO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
            <option value="TERMINADO">TERMINADO</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Entidad *</Label>
          <Select required className={styles.input} value={formData.entity || ""} onChange={(e) => handleField("entity", e.target.value)}>
            <option value="">Seleccione</option>
            <option value="PRIVADA">PRIVADA</option>
            <option value="PUBLICA">PUBLICA</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Tipo de Cliente *</Label>
          <Select required className={styles.input} value={formData.tipoCliente || ""} onChange={(e) => handleField("tipoCliente", e.target.value)}>
            <option value="RESIDENCIAL">RESIDENCIAL</option>
            <option value="CORPORATIVO">CORPORATIVO</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Medio de Plan *</Label>
          <Select required className={styles.input} value={formData.tipoPlan || ""} onChange={(e) => handleField("tipoPlan", e.target.value)}>
            <option value="COBRE">COBRE</option>
            <option value="MEDIO INALÁMBRICO">MEDIO INALÁMBRICO</option>
            <option value="FIBRA ÓPTICA">FIBRA ÓPTICA</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Valores *</Label>
          <Input required type="number" step="0.01" className={styles.input} value={formData.valores || ""} onChange={(e) => handleField("valores", Number(e.target.value))} />
        </div>
        
        {/* Fechas de Instalación y Traspaso */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Fecha de Instalación *</Label>
          <Input required type="date" className={styles.input} value={formData.installationDate || ""} onChange={(e) => handleField("installationDate", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Fecha de Traspaso *</Label>
          <Input required type="date" className={styles.input} value={formData.transferDate || ""} onChange={(e) => handleField("transferDate", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Cliente Desde *</Label>
          <Input required type="date" className={styles.input} value={formData.sinceCustomer || ""} onChange={(e) => handleField("sinceCustomer", e.target.value)} />
        </div>
        
        {/* Datos Adicionales */}
        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Actividad Económica *</Label>
          <Input required type="text" className={styles.input} value={formData.economicActivity || ""} onChange={(e) => handleField("economicActivity", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Tipo de Vivienda *</Label>
          <Input required type="text" className={styles.input} value={formData.typeOfHousing || ""} onChange={(e) => handleField("typeOfHousing", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label className={styles.inputLabel}>Score Crediticio *</Label>
          <Input required type="number" className={styles.input} value={formData.scoreCredit || ""} onChange={(e) => handleField("scoreCredit", Number(e.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-indigo-50 dark:bg-indigo-950 p-4 rounded-md">
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.automaticCut} onChange={(e) => handleField("automaticCut", e.target.checked)} />
          Corte Automático
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.automaticInvoice} onChange={(e) => handleField("automaticInvoice", e.target.checked)} />
          Factura Automática
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.withholdingAgent} onChange={(e) => handleField("withholdingAgent", e.target.checked)} />
          Agente de Retención
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.relatedClient} onChange={(e) => handleField("relatedClient", e.target.checked)} />
          Cliente Relacionado
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.creditButt} onChange={(e) => handleField("creditButt", e.target.checked)} />
          Buró de Crédito
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.discardButt} onChange={(e) => handleField("discardButt", e.target.checked)} />
          Descartar Buró
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.hasDucts} onChange={(e) => handleField("hasDucts", e.target.checked)} />
          Tiene Ductos
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.discountLaw?.disability} onChange={(e) => handleDiscountLaw("disability", e.target.checked)} />
          Dscto. Discapacidad
        </Label>
        <Label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.discountLaw?.oldAge} onChange={(e) => handleDiscountLaw("oldAge", e.target.checked)} />
          Dscto. Tercera Edad
        </Label>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700" disabled={loading}>
          {loading ? "Guardando..." : "Crear Cliente"}
        </Button>
      </div>
    </form>
  );
}
