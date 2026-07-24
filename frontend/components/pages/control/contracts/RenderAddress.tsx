import {
  useClientContext,
  EditableClientData,
} from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { ClientDataRow } from "@/components/ui/client-data-row";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/ui/stars";
import { CompactTable } from "@/components/ui/compact-table";
import FormFamily from "@/components/ui/formFamily";
import { useCallback } from "react";
import CurrentAge from "@/components/pages/control/contracts/current-age";
import type { Location } from "@/types/typesDB";
import RenderMap from "@/components/pages/control/contracts/RenderMap";
import {
  DataInput,
  DataSelect,
  DataToggle,
} from "@/components/ui/client-data-fields";
import { P } from "@/components/ui/p";

export default function RenderAddress() {
  const { selectedClientId, isEditing, formData, setFormData, setActiveTab } =
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

  if (!selectedClientId) {
    setActiveTab("cliente");
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

    const currentLocation =
      formData.location || client?.location || ({} as Partial<Location>);

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
            <CurrentAge
              date={formData.installationDate || client.installationDate}
              text="Cliente por:"
            />
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
            <P>
              {client.seller_user?.fullname +
                " " +
                client.seller_user?.lastname}
            </P>
          </ClientDataRow>
          <ClientDataRow label="Instalador Asignado">
            <P>
              {client.assigned_installer?.fullname +
                " " +
                client.assigned_installer?.lastname}
            </P>
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
              value={isEditing ? formData.ciudad : client.ciudad}
              readOnly={!isEditing}
              onChange={(e) => handleField("ciudad", e.target.value)}
            />
          </ClientDataRow>
          <ClientDataRow label="Ubicación GPS">
            <Input
              type="text"
              className={styles.input}
              value={
                (isEditing
                  ? formData.location?.latitude
                  : client.location?.latitude) || ""
              }
              onChange={(e) => handleLocation("latitude", e.target.value)}
              readOnly={!isEditing}
            />
            <Input
              type="text"
              className={styles.input}
              value={
                (isEditing
                  ? formData.location?.longitude
                  : client.location?.longitude) || ""
              }
              onChange={(e) => handleLocation("longitude", e.target.value)}
              readOnly={!isEditing}
            />
            <RenderMap
              latitude={
                isEditing
                  ? formData.location?.latitude
                  : client.location?.latitude
              }
              longitude={
                isEditing
                  ? formData.location?.longitude
                  : client.location?.longitude
              }
              isEditing={isEditing}
              onLocationSelect={(lat, lon) => {
                handleLocation("latitude", lat.toString());
                handleLocation("longitude", lon.toString());
              }}
            />
          </ClientDataRow>

          <ClientDataRow label="" />
          <DataInput
            label="Actividad Económica"
            className="uppercase font-medium"
            value={
              isEditing ? formData.economicActivity : client.economicActivity
            }
            readOnly={!isEditing}
            onChange={(e) => handleField("economicActivity", e.target.value)}
          />
          <DataSelect
            label="LA VIVIENDA ES"
            value={isEditing ? formData.typeOfHousing : client.typeOfHousing}
            disabled={!isEditing}
            onChange={(e) => handleField("typeOfHousing", e.target.value)}
          >
            <option value="PROPIA">PROPIA</option>
            <option value="ALQUILADA">ALQUILADA</option>
            <option value="FAMILIAR">FAMILIAR</option>
          </DataSelect>
          <ClientDataRow label="" />
          <DataToggle
            label="Cliente Relacionado"
            onToggle={() =>
              handleField("relatedClient", !formData.relatedClient)
            }
            isOn={Boolean(
              isEditing ? formData.relatedClient : client.relatedClient,
            )}
          />
          <DataToggle
            label="A buró crediticio"
            onToggle={() => handleField("creditButt", !formData.creditButt)}
            isOn={Boolean(isEditing ? formData.creditButt : client.creditButt)}
          />
          <DataToggle
            label="Descartar Buro"
            onToggle={() => handleField("discardButt", !formData.discardButt)}
            isOn={Boolean(
              isEditing ? formData.discardButt : client.discardButt,
            )}
          />
          <ClientDataRow label="" />
          <ClientDataRow label="Pisos de la Edificación">
            <Input type="text" className={styles.input} value={1} readOnly />
          </ClientDataRow>
          <DataToggle
            label="Posee Ductos"
            onToggle={() => handleField("hasDucts", !formData.hasDucts)}
            isOn={Boolean(isEditing ? formData.hasDucts : client.hasDucts)}
          />
          <ClientDataRow label="Ejecutivo de Cuenta:">
            <Input type="text" className={styles.input} value={""} readOnly />
          </ClientDataRow>
        </section>
      </main>
    </article>
  );
}
