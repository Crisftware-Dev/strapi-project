"use client";

import {
  useClientContext,
  EditableClientData,
} from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { useState, useCallback } from "react";
import { SearchI, UserI } from "@/components/icons/Icons";
import { ClientDataRow } from "@/components/ui/client-data-row";
import { cn } from "@/lib/utils";
import Separator from "../ui/separator";
import Select from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  TableSearchHeader,
  CompactTable,
  Headers,
  PaymentRow,
} from "../ui/compact-table";
import {
  DataInput,
  DataSelect,
  DataToggle,
  DataRadioGroup,
} from "../ui/client-data-fields";
import { Input } from "../ui/input";
import { styles } from "@/app/styles/styles";
import { usePlans } from "@/hooks/usePlans";
import { Contact, DiscountLaw, Plan } from "@/types/typeClients";
import { SearchPlans } from "../ui/searchParams";
import CurrentAge from "./current-age";
import FileUploader from "../ui/files";

export default function RenderClient() {
  const { selectedClientId, isEditing, formData, setFormData } =
    useClientContext();
  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

  const handleField = useCallback(
    <K extends keyof EditableClientData>(
      field: K,
      value: EditableClientData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData],
  );

  const [searchPlan, setSearchPlan] = useState("");
  const [plansResults, setPlansResults] = useState<Plan[]>([]);
  const [isFetchEnabled, setIsFetchEnabled] = useState(false);

  const { data: plans } = usePlans(isFetchEnabled);
  const plansData = plans?.data || [];

  const activePlans =
    (isEditing ? formData.plans || client?.plans : client?.plans) || [];
  const hasPrincipal = isEditing
    ? formData.planPrincipal !== undefined
      ? formData.planPrincipal
      : client?.planPrincipal
    : client?.planPrincipal;

  const handlePlansSearch = (value: string) => {
    setSearchPlan(value);
    if (!isFetchEnabled) setIsFetchEnabled(true);

    if (!value.trim()) {
      setIsFetchEnabled(false);
      setPlansResults([]);
      return;
    }

    const filtered = plansData.filter((plan) => {
      const media = `${plan.type}`.toLowerCase();
      const search = searchPlan.toLowerCase();

      if (formData.tipoPlan) {
        if (media.includes(formData.tipoPlan.toLowerCase())) {
          return plan.plan.toLowerCase().includes(search);
        }
      }
    });

    setPlansResults(filtered);
  };

  const handleAddPlan = (plan: Plan) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const current = prev.plans || client?.plans || [];
      if (current.some((p) => p.documentId === plan.documentId)) return prev;

      const newPlans = [...current, plan];
      return { ...prev, plans: newPlans, planPrincipal: newPlans.length > 0 };
    });
    setSearchPlan("");
    setPlansResults([]);
    setIsFetchEnabled(false);
  };

  const handleRemovePlan = (index: number) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const current = prev.plans || client?.plans || [];
      const newPlans = current.filter((_, i) => i !== index);
      return { ...prev, plans: newPlans, planPrincipal: newPlans.length > 0 };
    });
  };

  const handleTogglePrincipal = (planId: string) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const current = prev.plans || client?.plans || [];
      const selectedIndex = current.findIndex((p) => p.documentId === planId);
      if (selectedIndex <= 0) return { ...prev, planPrincipal: true };

      const newPlans = [...current];
      const [selected] = newPlans.splice(selectedIndex, 1);
      newPlans.unshift(selected);

      return {
        ...prev,
        plans: newPlans,
        planPrincipal: true,
      };
    });
  };

  const handleToggleDiscount = (field: keyof DiscountLaw) => {
    if (!isEditing) return;

    const current =
      formData.discountLaw !== undefined
        ? formData.discountLaw
        : client?.discountLaw;

    const isCurrentlyActive = current?.[field];

    if (isCurrentlyActive) {
      handleField("discountLaw", {
        disability: false,
        oldAge: false,
      });
    } else {
      handleField("discountLaw", {
        disability: field === "disability",
        oldAge: field === "oldAge",
      });
    }
  };

  const handleContact = (field: keyof Contact, value: string) => {
    if (!isEditing) return;

    const currentContact =
      formData.contact || client?.contact || ({} as Partial<Contact>);

    const newContact = { ...currentContact, [field]: value } as Contact;
    handleField("contact", newContact);
  };

  if (!selectedClientId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-gray-400 dark:text-gray-600">
        <UserI className="text-6xl mb-4 opacity-20" />
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
    <article className={styles.container} key={selectedClientId}>
      <main className={styles.mainGrid}>
        <section className={cn(styles.leftColumn, "w-3/4")}>
          <ClientDataRow label="Venta">
            <div className="flex w-full items-center">
              <p className={styles.select}>Venta Tradicional</p>
              <Separator />
              <p className="w-32 text-center text-indigo-600 text-sm">
                {client.contrato}
              </p>
            </div>
            <Separator />
            <div className="flex w-md gap-2">
              <Select
                value={isEditing ? formData.estado : client.estado}
                disabled={!isEditing}
                onChange={(e) => handleField("estado", e.target.value)}
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
              </Select>
            </div>
          </ClientDataRow>

          <ClientDataRow label="Identificación">
            <div className="flex gap-2 w-full items-center">
              <Select className="w-auto text-xs border-r dark:border-indigo-900/30 font-medium">
                {(isEditing ? formData.identificacion : client.identificacion)
                  ?.length === 10 ? (
                  <option>CEDULA</option>
                ) : (isEditing
                    ? formData.identificacion
                    : client.identificacion
                  )?.length === 13 ? (
                  <option>RUC</option>
                ) : (
                  <option>PASAPORTE</option>
                )}
              </Select>
              <Input
                type="text"
                className={cn(styles.input, "font-mono font-medium")}
                value={
                  isEditing
                    ? (formData.identificacion ?? "")
                    : client.identificacion
                }
                readOnly={!isEditing}
                maxLength={13}
                onChange={(e) => handleField("identificacion", e.target.value)}
              />
              {isEditing &&
                formData.identificacion &&
                ![8, 10, 13].includes(formData.identificacion.length) && (
                  <span className="text-[10px] text-amber-600 whitespace-nowrap">
                    ⚠ 8, 10 o 13 caracteres
                  </span>
                )}
            </div>
          </ClientDataRow>

          <DataInput label="Razón Social" placeholder="Nombre de empresa" />

          <DataInput
            label="Cédula Rep.Legal"
            value={
              isEditing
                ? (formData.identificacion ?? "")
                : client.identificacion
            }
            readOnly
          />

          <DataInput
            label="Apellidos"
            value={isEditing ? (formData.apellidos ?? "") : client.apellidos}
            readOnly={!isEditing}
            className="uppercase font-medium"
            onChange={(e) => handleField("apellidos", e.target.value)}
          />

          <DataInput
            label="Nombres"
            value={isEditing ? (formData.nombres ?? "") : client.nombres}
            readOnly={!isEditing}
            className="uppercase font-medium"
            onChange={(e) => handleField("nombres", e.target.value)}
          />

          <ClientDataRow label="Contacto">
            <section className="flex flex-1 justify-between items-center gap-2">
              <div className="flex flex-1 items-center gap-2">
                <Label className={styles.inputLabel}>Telf:</Label>
                <Input
                  type="text"
                  className={cn(styles.input, "font-mono")}
                  value={
                    (isEditing ? formData.contact?.telephone : client.contact?.telephone) ?? ""
                  }
                  readOnly={!isEditing}
                  onChange={(e) => handleContact("telephone", e.target.value)}
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Label className={styles.inputLabel}>Celular SMS:</Label>
                <Input
                  type="text"
                  className={cn(styles.input, "font-mono")}
                  value={
                    (isEditing ? formData.contact?.phoneSms : client.contact?.phoneSms) ?? ""
                  }
                  readOnly={!isEditing}
                  onChange={(e) => handleContact("phoneSms", e.target.value)}
                  placeholder="0999999999"
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Label className={styles.inputLabel}>Celular(2):</Label>
                <Input
                  type="text"
                  className={cn(styles.input, "font-mono")}
                  value={
                    (isEditing ? formData.contact?.phoneTwo : client.contact?.phoneTwo) ?? ""
                  }
                  readOnly={!isEditing}
                  onChange={(e) => handleContact("phoneTwo", e.target.value)}
                  placeholder="0999999999"
                />
              </div>
            </section>
          </ClientDataRow>

          <DataInput
            label="Email"
            value={isEditing ? (formData.email ?? "") : client.email}
            readOnly={!isEditing}
            onChange={(e) => handleField("email", e.target.value)}
          />

          <DataInput
            label="Dirección Fac."
            className="uppercase"
            value={
              isEditing
                ? (formData.ciudad ?? "")
                : `${client.ciudad} - DIRECCION REFERENCIAL`
            }
            readOnly={!isEditing}
            onChange={(e) => handleField("ciudad", e.target.value)}
          />

          <ClientDataRow label="Fecha Nacimiento">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={
                  isEditing
                    ? formData.currentAge
                      ? new Date(formData.currentAge)
                          .toISOString()
                          .split("T")[0]
                      : ""
                    : client.currentAge
                      ? new Date(client.currentAge).toISOString().split("T")[0]
                      : ""
                }
                readOnly={!isEditing}
                onChange={(e) => handleField("currentAge", e.target.value)}
                className="bg-transparent text-xs text-gray-600 dark:text-gray-300"
              />
              <CurrentAge date={formData.currentAge || client.currentAge} />
            </div>
          </ClientDataRow>

          <DataRadioGroup
            label="Medio Plan"
            name="media"
            value={isEditing ? (formData.tipoPlan ?? "") : client.tipoPlan}
            onChange={(value) => handleField("tipoPlan", value)}
            options={[
              { label: "COBRE", value: "COBRE" },
              { label: "MEDIO INALÁMBRICO", value: "MEDIO INALÁMBRICO" },
              { label: "FIBRA ÓPTICA", value: "FIBRA ÓPTICA" },
            ]}
          />

          <ClientDataRow label="Planes Mensuales">
            <CompactTable gridCols="minmax(max-content, 2fr) repeat(4, minmax(max-content, 1fr)) 120px">
              <div className="grid grid-cols-subgrid col-span-full">
                <TableSearchHeader
                  ariaLabel="Planes Disponibles"
                  type="text"
                  id="planes"
                  placeholder="Busque aquí el plan"
                  value={searchPlan}
                  onChange={(e) =>
                    isEditing && handlePlansSearch(e.target.value)
                  }
                  onFocus={() => isEditing && setIsFetchEnabled(true)}
                  className="col-span-1"
                >
                  <SearchPlans
                    plansResults={plansResults}
                    handleAddPlan={handleAddPlan}
                  />
                  + Añadir (Principal)
                </TableSearchHeader>
                <div className="grid grid-cols-subgrid col-span-5">
                  <Headers
                    headers={[
                      "Valor",
                      "Principal",
                      "$Dscto.",
                      "Meses",
                      "Opción",
                    ]}
                  />
                </div>
              </div>

              {activePlans.length > 0 ? (
                activePlans.map((plan, index) => (
                  <PaymentRow
                    key={`${plan.documentId || "new"}-${index}`}
                    cells={[
                      `${plan.plan} - corte ${plan.cut}`,
                      plan.valor?.toString() || "0",
                      <DataToggle
                        key={`principal-${index}`}
                        label=""
                        isOn={index === 0 && !!hasPrincipal}
                        onToggle={() =>
                          plan.documentId &&
                          handleTogglePrincipal(plan.documentId)
                        }
                      />,
                      plan.descuento?.toString() || ".00",
                      plan.meses?.toString() || "0",
                      <div
                        key={`actions-${index}`}
                        className="flex justify-center gap-2"
                      >
                        <Button
                          disabled={!isEditing}
                          onClick={() => handleRemovePlan(index)}
                          className="px-1.5 py-0.5 text-xs bg-white text-red-600 hover:bg-red-50 border border-red-200 rounded disabled:opacity-50"
                        >
                          Elim.
                        </Button>
                        <Button
                          disabled={!isEditing}
                          className="px-1.5 py-0.5 text-xs bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded disabled:opacity-50"
                        >
                          $ Desc.
                        </Button>
                      </div>,
                    ]}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500 col-span-full">
                  No hay planes asignados. Busque y seleccione uno.
                </div>
              )}
            </CompactTable>
          </ClientDataRow>

          <DataSelect label="Es una entidad">
            <option>PRIVADA</option>
            <option>PUBLICA</option>
          </DataSelect>

          <DataSelect label="Rubro Instalación">
            <option>INSTALACION RESIDENCIAL F.O | 178.2522</option>
          </DataSelect>

          <ClientDataRow label="Descuento Aplicado">
            <div className="flex-1 flex items-center">
              <Select className={cn("w-3/4")}>
                <option>Ninguno</option>
              </Select>
              <div className="flex items-center px-4 border-l border-indigo-100 dark:border-indigo-900/30 text-[11px] text-gray-500 bg-indigo-50/20 h-full">
                A Cancelar:{" "}
                <span className="ml-2 font-bold text-indigo-700 dark:text-indigo-300 font-mono text-xs">
                  178.2522
                </span>
              </div>
            </div>
          </ClientDataRow>
          <DataToggle
            label="Corte Automático"
            onToggle={() => handleField("automaticCut", !formData.automaticCut)}
            isOn={Boolean(
              isEditing ? formData.automaticCut : client.automaticCut,
            )}
          />

          <ClientDataRow label="Aplica Dscto.">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-[11px]">
                  Por Discapacidad:
                </span>
                <DataToggle
                  label=""
                  onToggle={() => handleToggleDiscount("disability")}
                  isOn={Boolean(
                    isEditing
                      ? formData.discountLaw?.disability
                      : client.discountLaw?.disability,
                  )}
                  size="sm"
                  rowClassName="border-none bg-transparent hover:bg-transparent min-h-0 p-0"
                />
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-[11px]">
                  Por Tercera Edad:
                </span>
                <DataToggle
                  label=""
                  onToggle={() => handleToggleDiscount("oldAge")}
                  isOn={Boolean(
                    isEditing
                      ? formData.discountLaw?.oldAge
                      : client.discountLaw?.oldAge,
                  )}
                  size="sm"
                  rowClassName="border-none bg-transparent hover:bg-transparent min-h-0 p-0"
                />
              </div>
            </div>
          </ClientDataRow>
        </section>

        <section className={cn(styles.rightColumn, "w-1/4 flex flex-col")}>
          <DataToggle
            label="¿Es agente de retención?"
            onToggle={() =>
              handleField("withholdingAgent", !formData.withholdingAgent)
            }
            isOn={Boolean(
              isEditing ? formData.withholdingAgent : client.withholdingAgent,
            )}
            rowClassName="border-none bg-transparent hover:bg-transparent min-h-0 p-0"
          />
          <FileUploader
            files={isEditing ? formData.files : client.files || []}
          />

          <div className="border-t border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-950">
            <DataSelect
              label="Cliente"
              value={isEditing ? formData.tipoCliente : client.tipoCliente}
              disabled={!isEditing}
              onChange={(e) => handleField("tipoCliente", e.target.value)}
            >
              <option value="RESIDENCIAL">RESIDENCIAL</option>
              <option value="CORPORATIVO">CORPORATIVO</option>
            </DataSelect>

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

            <DataToggle
              label="Factura auto."
              onToggle={() =>
                handleField("automaticInvoice", !formData.automaticInvoice)
              }
              isOn={Boolean(
                isEditing ? formData.automaticInvoice : client.automaticInvoice,
              )}
            />

            <ClientDataRow label="Referencia">
              <span className="text-gray-400 italic text-[10px]">
                NO HABILITADO
              </span>
            </ClientDataRow>
          </div>
        </section>
      </main>
    </article>
  );
}
