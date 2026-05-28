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
// import Select from "../ui/select";
import StarRating from "../ui/stars";
import { CompactTable } from "../ui/compact-table";
import FormFamily from "../ui/formFamily";
import { DataToggle } from "../ui/client-data-fields";
import { useState, useCallback } from "react";
import CurrentAge from "./current-age";
import type { Location } from "@/types/typeClients";

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
    <K extends keyof EditableClientData>(
      field: K,
      value: EditableClientData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData],
  );

  if (!selectedClientId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-150 text-gray-400 dark:text-gray-600">
        <UserI className="text-6xl mb-4 opacity-20" />
        <p className="text-sm">Seleccione un cliente para ver su información</p>
      </div>
    );
  }

  const getDisplayValue = () => {
    const score = isEditing ? formData.scoreCredit : client?.scoreCredit;

    if (score === null || score === undefined) return "0";
    return score.toString();
  };

  const handleScoreChange = (value: string) => {
    if (value === "") {
      handleField("scoreCredit", 0);
    } else if (/^\d*$/.test(value)) {
      handleField("scoreCredit", Number(value));
    }
  };

  const handleBlur = () => {
    const score = isEditing ? formData.scoreCredit : client?.scoreCredit;

    if (score === null || score === undefined || score === 0) {
      handleField("scoreCredit", 0);
    }
  };

  const handleLocation = (field: keyof Location, value: string) => {
    if (!isEditing) return;

    const currentLocation = formData.location || client?.location || ({} as Partial<Location>);

    const newLocation = { ...currentLocation, [field]: value } as Location;
    handleField("location", newLocation);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs">Cargando datos...</div>;
  }
  if (error || !client)
    return (
      <div className="p-8 text-center text-xs text-red-500">
        Error al cargar datos
      </div>
  );

  return (
    <article className={styles.container} key={selectedClientId}>
      <main className={styles.mainGrid}>
        <section className={cn(styles.leftColumn, "w-3/5 flex flex-col")}>
          <ClientDataRow label="Fecha de instalación">
            <p className={styles.select}>
              {client.installationDate
                ? client.installationDate.replace("T", " ").substring(0, 16)
                : ""}
            </p>
          </ClientDataRow>
          <ClientDataRow label="Fecha de Traslado">
            <p className={styles.select}>
              {client.transferDate
                ? client.transferDate.replace("T", " ").substring(0, 16)
                : ""}
            </p>
          </ClientDataRow>
          <ClientDataRow label="Cliente desde">
            <CurrentAge date={formData.installationDate || client.installationDate} text="Cliente por:" />
          </ClientDataRow>
          <ClientDataRow label="Cantón">
            <p className={styles.select}>{client.ciudad}</p>
          </ClientDataRow>
          <ClientDataRow label="Dirección de instalación">
            <Input
              type="text"
              className={styles.input}
              value={client.ciudad || ""}
              readOnly
            />
          </ClientDataRow>
          <ClientDataRow label="Dirección de Trabajo">
            <Input type="text" className={styles.input} value="" readOnly />
          </ClientDataRow>
          <ClientDataRow label="La vivienda es_">
            {/* <Select
              value={isEditing ? (formData.estado ?? client.estado) : client.estado}
              disabled={!isEditing}
              onChange={(e) => handleField("estado", e.target.value)}
            >
              <option value="Propia">PROPIA</option>
              <option value="Alquilada">ALQUILADA</option>
              <option value="Familiar">FAMILIAR</option>
            </Select> */}
          </ClientDataRow>
          <ClientDataRow label="Referencia de la ubicación">
            <textarea
              className="min-h-10 w-full max-h-24 p-2 text-xs focus:ring-0 dark:text-gray-200 border-none"
              value={client.ciudad}
              readOnly
            />
          </ClientDataRow>
          <ClientDataRow label="Calificación Crediticia">
            <Input
              type="text" // Cambiado a text
              inputMode="numeric" // Teclado numérico en móviles
              className={styles.select}
              value={getDisplayValue()}
              readOnly={!isEditing}
              onChange={(e) => handleScoreChange(e.target.value)}
              onBlur={handleBlur}
            />
            <span>
              <StarRating
                score={
                  isEditing
                    ? (formData.scoreCredit ?? 0)
                    : (client.scoreCredit ?? 0)
                }
              />
            </span>
          </ClientDataRow>
          <ClientDataRow label="Referencias">
            <CompactTable>
              <section
                className={cn(
                  "w-full flex flex-col bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30",
                )}
              >
                <FormFamily
                  references={
                    isEditing
                      ? formData.reference || client?.reference || []
                      : client?.reference || []
                  }
                />
              </section>
            </CompactTable>
          </ClientDataRow>
          <ClientDataRow label="Observación">
            <Input type="text" className={styles.input} value={""} readOnly />
          </ClientDataRow>
          <ClientDataRow label="Vendido por:">
            <Input type="text" className={styles.input} value={client.seller_user?.fullname + " " + client.seller_user?.lastname} readOnly />
          </ClientDataRow>
          <ClientDataRow label="Instalador Asignado">
            <Input type="text" className={styles.input} value={client.assigned_installer?.fullname + " " + client.assigned_installer?.lastname} readOnly />
          </ClientDataRow>
        </section>
        <section className={cn(styles.rightColumn, "w-2/5 flex flex-col")}>
          <ClientDataRow label="Fecha de creación">
            <p className={styles.select}>
              {client.installationDate
                ? client.installationDate.replace("T", " ").substring(0, 10)
                : ""}
            </p>
          </ClientDataRow>
          <ClientDataRow label="Fecha de Terminado">
            <p className={styles.select}></p>
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
              value={(isEditing ? formData.location?.latitude : client.location?.latitude) || ""}
              onChange={(e) => handleLocation("latitude", e.target.value)}
              readOnly={!isEditing}
            />
            <Input
              type="text"
              className={styles.input}
              value={(isEditing ? formData.location?.longitude : client.location?.longitude) || ""}
              onChange={(e) => handleLocation("longitude", e.target.value)}
              readOnly={!isEditing}
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
