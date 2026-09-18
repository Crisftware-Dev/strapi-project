import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { CompactTable, Headers } from "@/components/ui/compact-table";
import { Label } from "@/components/ui/label";
import Payments from "@/components/ui/payments";
import { useBalanceById } from "@/hooks/useBalanceById";
import { createBalanceAction } from "@/actions/mutations";

export default function RenderPaymentsOuts() {
  const { selectedClientId } = useClientContext();
  const queryClient = useQueryClient();
  const [isCreatingBalance, setIsCreatingBalance] = useState(false);

  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

  const { data: balances } = useBalanceById(selectedClientId || "");

  // ─── Prototipo base para crear un saldo manualmente ─────────────────────────
  const handleCreateBalance = async () => {
    if (!selectedClientId) return;

    setIsCreatingBalance(true);
    try {
      const newBalance = {
        id_balance: `BAL-${Date.now()}`,
        total: 0,
        paid: 0,
        balance: 0,
        issued: new Date().toISOString().split("T")[0],
        discounts: 0,
      };

      await createBalanceAction(newBalance);

      // Refrescar caché de React Query para actualizar la UI
      await queryClient.invalidateQueries({
        queryKey: ["balances", selectedClientId],
      });

      console.log("Saldo creado exitosamente");
    } catch (err) {
      console.error("Error al crear el saldo:", err);
    } finally {
      setIsCreatingBalance(false);
    }
  };

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
      <header className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Saldos pendientes</h2>
      </header>

      <main className={styles.mainGrid}>
        <CompactTable
          className="min-w-300"
          gridCols="repeat(8, minmax(max-content, 1fr)) 120px"
        >
          <Headers
            headers={[
              "No.",
              "Total",
              "Pagado",
              "Saldo",
              "No. Factura",
              "Emitida",
              "Dsctos",
              "Acción",
              <button
                onClick={handleCreateBalance}
                disabled={isCreatingBalance}
                className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors disabled:opacity-50"
              >
                {isCreatingBalance ? "Creando..." : "+ Crear Saldo"}
              </button>,
            ]}
          />
          <Label className="col-span-full p-2 bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            Contrato No.: {client.contrato} -{" "}
            {"PLAN RESIDENCIAL ONE CONNECTION 600 MBPS / CORTE 15"}- ESTADO{" "}
            {client.estado}
          </Label>
          <Payments balances={balances} />
        </CompactTable>
      </main>
    </article>
  );
}

// REALIZAR LA SECCIÓN DE PAGOS, DEBE CONTENER UN FORMULARIO PARA REGISTRAR PAGOS, UN BOTÓN PARA AGREGAR UN PAGO Y UNA TABLA PARA MOSTRAR LOS PAGOS PENDIENTES.
