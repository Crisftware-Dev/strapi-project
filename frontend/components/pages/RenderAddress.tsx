import {
  useClientContext,
  EditableClientData,
} from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { UserI } from "../icons/Icons";
import { styles } from "@/app/styles/styles";
import { ClientDataRow } from "../ui/client-data-row";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import Select from "../ui/select";
import StarRating from "../ui/stars";
import { CompactTable } from "../ui/compact-table";
import FormFamily from "../ui/formFamily";
import { DataToggle } from "../ui/client-data-fields";
import { useState, useCallback } from "react";
import { Reference } from "@/types/typeClients";

export default function RenderAddress() {
  const { selectedClientId, isEditing, formData, setFormData } =
    useClientContext();
  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");


  const [toggles, setToggles] = useState({
    clienteRelacionado: false,
    buroCrediticio: true,
    descartarBuro: false,
    poseeDuctos: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleField = useCallback(
    (field: keyof EditableClientData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData],
  );

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const current = [...(prev.reference || client?.reference || [])];
      while (current.length <= index) {
        current.push({ identificacion: "", fullnames: "", relationship: "", phone: 0 } as unknown as Reference);
      }
      current[index] = { ...current[index], [field]: value };
      return { ...prev, reference: current };
    });
  };

  if (!selectedClientId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-150 text-gray-400 dark:text-gray-600">
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
        <section className={cn(styles.leftColumn, "w-3/5")}>
          <ClientDataRow label="Fecha de instalación">
            <p className={styles.select}>11-01-2026</p>
          </ClientDataRow>
          <ClientDataRow label="Fecha de Traslado">
            <p className={styles.select}>12-01-2026</p>
          </ClientDataRow>
          <ClientDataRow label="Cliente desde">
            <p className={styles.select}># años | # meses | # dias</p>
          </ClientDataRow>
          <ClientDataRow label="Cantón">
            <p className={styles.select}>{client.ciudad}</p>
          </ClientDataRow>
          <ClientDataRow label="Dirección de instalación">
            <Input
              type="text"
              className={styles.input}
              value={isEditing ? (formData.ciudad ?? "") : client.ciudad}
              readOnly={!isEditing}
              onChange={(e) => handleField("ciudad", e.target.value)}
            />
          </ClientDataRow>
          <ClientDataRow label="Dirección de Trabajo">
            <Input
              type="text"
              className={styles.input}
              value={isEditing ? (formData.ciudad ?? "") : client.ciudad}
              readOnly={!isEditing}
              onChange={(e) => handleField("ciudad", e.target.value)}
            />
          </ClientDataRow>
          <ClientDataRow label="La vivienda es_">
            <Select defaultValue={client.estado}>
              <option value="Propia">PROPIA</option>
              <option value="Alquilada">ALQUILADA</option>
              <option value="Familiar">FAMILIAR</option>
            </Select>
          </ClientDataRow>
          <ClientDataRow label="Referencia de la ubicación">
            <textarea
              className="min-h-10 w-full max-h-24 p-2 text-xs focus:ring-0 dark:text-gray-200 border-none"
              value={client.ciudad}
              readOnly
            />
          </ClientDataRow>
          <ClientDataRow label="Calificación Crediticia">
            <p className={styles.select}>0</p>
            <span>
              <StarRating score={500} />
            </span>
          </ClientDataRow>
          <ClientDataRow label="Referencias">
            <CompactTable>
              <section
                className={cn(
                  "w-full flex flex-col bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30",
                )}
              >
                <FormFamily references={isEditing ? (formData.reference || client?.reference || []) : (client?.reference || [])} isEditing={isEditing} updateReference={updateReference} />
              </section>
            </CompactTable>
          </ClientDataRow>
          <ClientDataRow label="Observación">
            <Input type="text" className={styles.input} value={""} readOnly />
          </ClientDataRow>
          <ClientDataRow label="Vendido por:">
            <Input type="text" className={styles.input} value={""} readOnly />
          </ClientDataRow>
          <ClientDataRow label="Instalador Asignado">
            <Input type="text" className={styles.input} value={""} readOnly />
          </ClientDataRow>
        </section>
        <section className={cn(styles.rightColumn, "w-2/5")}>
          <ClientDataRow label="Fecha de creación">
            <p className={styles.select}>10-01-2026</p>
          </ClientDataRow>
          <ClientDataRow label="Fecha de Terminado">
            <p className={styles.select}>00-00-0000</p>
          </ClientDataRow>
          <ClientDataRow label="" />
          <ClientDataRow label="Sector">
            <Input
              type="text"
              className={styles.input}
              value={isEditing ? (formData.ciudad ?? "") : client.ciudad}
              readOnly={!isEditing}
              onChange={(e) => handleField("ciudad", e.target.value)}
            />
          </ClientDataRow>
          <ClientDataRow label="Ubicación GPS">
            <Input
              type="text"
              className={styles.input}
              value="0.00000, 79.11111"
              readOnly
            />
          </ClientDataRow>
          <ClientDataRow label="" />
          <ClientDataRow label="Actividad Económica">
            <Input
              type="text"
              className={styles.input}
              value="TRABAJADOR"
              readOnly
            />
          </ClientDataRow>
          <ClientDataRow label="Extensión">
            <Input type="text" className={styles.input} value="" readOnly />
          </ClientDataRow>
          <ClientDataRow label="" />
          <DataToggle
            label="Cliente Relacionado"
            onToggle={() => handleToggle("clienteRelacionado")}
            isOn={toggles.clienteRelacionado}
          />
          <DataToggle
            label="A buró crediticio"
            onToggle={() => handleToggle("buroCrediticio")}
            isOn={toggles.buroCrediticio}
          />
          <DataToggle
            label="Descartar Buro"
            onToggle={() => handleToggle("descartarBuro")}
            isOn={toggles.descartarBuro}
          />
          <ClientDataRow label="" />
          <ClientDataRow label="Pisos de la Edificación">
            <Input type="text" className={styles.input} value={1} readOnly />
          </ClientDataRow>
          <DataToggle
            label="Posee Ductos"
            onToggle={() => handleToggle("poseeDuctos")}
            isOn={toggles.poseeDuctos}
          />
          <ClientDataRow label="Ejecutivo de Cuenta:">
            <Input type="text" className={styles.input} value={""} readOnly />
          </ClientDataRow>
        </section>
      </main>
    </article>
  );
}
