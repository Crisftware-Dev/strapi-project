import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { CompactTable, Headers, PaymentRow } from "@/components/ui/compact-table";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LiControlHeader } from "@/components/ui/nav-items";
import { ArrowRigthI, CircleI, DeleteI, DetailsI, HandsI, MoneyI, PercentI } from "@/components/icons/Icons";
import { Li } from "@/components/ui/list";

export default function RenderPaymentsOuts() {
  const [active, setActive] = useState("");
  const { selectedClientId, setActiveTab } = useClientContext();
  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

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
              "Obligación",
              "Total",
              "Pagado",
              "Saldo",
              "Ref",
              "No. Factura",
              "Emitida",
              "Dsctos",
              "Detalle",
              "Acción",
            ]}
          />
          <Label className="col-span-full p-2 bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            Contrato No.: {client.contrato} -{" "}
            {"PLAN RESIDENCIAL ONE CONNECTION 600 MBPS / CORTE 15"}- ESTADO{" "}
            {client.estado}
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
              "",
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
                    <MoneyI className={styles.icon} />
                    <span>Cobrar</span>
                  </Li>
                  <Li>
                    <DetailsI className={styles.icon} />
                    <span>Detalles</span>
                  </Li>
                  <Li>
                    <HandsI className={styles.icon} />
                    <span>Diferir</span>
                  </Li>
                  <Li>
                    <PercentI className={styles.icon} />
                    <span>Descuentos</span>
                  </Li>
                  <Li>
                    <DeleteI className={styles.icon} />
                    <span>Eliminar</span>
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

// REALIZAR LA SECCIÓN DE PAGOS, DEBE CONTENER UN FORMULARIO PARA REGISTRAR PAGOS, UN BOTÓN PARA AGREGAR UN PAGO Y UNA TABLA PARA MOSTRAR LOS PAGOS PENDIENTES.
