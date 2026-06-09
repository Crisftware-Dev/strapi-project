import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { CompactTable, Headers, PaymentRow } from "@/components/ui/compact-table";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import LiControlHeader from "@/components/ui/li-control-header";
import { useState } from "react";
import { ArrowRigthI, CircleI, DeleteI, DetailsI, DocumentI, PrintI, XMLI } from "@/components/icons/Icons";
import { Li } from "@/components/ui/li";

export default function RenderPaymentsHistory() {
  const [active, setActive] = useState("");
  const { selectedClientId, setActiveTab } = useClientContext();
  const { data: user } = useUser();
  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

  const firstChar = user?.fullname
    ?.split(" ")[0]
    .split("")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const lastname = user?.lastname?.split(" ")[0]?.toUpperCase();

  const usuario = firstChar?.concat(lastname || "");

  if (!selectedClientId) {
    setActiveTab("cliente");
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
        <CompactTable
          className="min-w-[1200px]"
          gridCols="repeat(10, minmax(max-content, 1fr)) 120px"
        >
          <Headers
            headers={[
              "No.",
              "Emision",
              "Total",
              "Fecha de Pago",
              "Valor",
              "Forma de Pago",
              "Fecha de Deposito",
              "Documento",
              "Dsctos",
              `Usuario`,
              "Acción",
            ]}
          />
          <Label className="col-span-full p-2 bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            Contrato No.: {client.contrato}
          </Label>
          <PaymentRow
            cells={[
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              usuario,
              <div key="options">
                <LiControlHeader
                  id="opciones"
                  text="Opciones"
                  isActive={active === "opciones"}
                  icon={<CircleI className={styles.icon} />}
                  caret={
                    <ArrowRigthI
                      className={` ${styles.caret} ${active === "opciones" ? "rotate-90" : "rotate-0"}`}
                    />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((prev) =>
                      prev === "opciones" ? "" : "opciones",
                    );
                  }}
                >
                  <Li>
                    <DeleteI className={styles.icon} />
                    <span>Eliminar</span>
                  </Li>
                  <Li>
                    <DetailsI className={styles.icon} />
                    <span>Detalles</span>
                  </Li>
                  <Li>
                    <PrintI className={styles.icon} />
                    <span>Imprimir</span>
                  </Li>
                  <Li>
                    <DocumentI className={styles.icon} />
                    <span>Descargar RIDE</span>
                  </Li>
                  <Li>
                    <XMLI className={styles.icon} />
                    <span>Descargar XML</span>
                  </Li>
                </LiControlHeader>
              </div>,
            ]}
          />
        </CompactTable>
      </main>
    </article>
  );
}
