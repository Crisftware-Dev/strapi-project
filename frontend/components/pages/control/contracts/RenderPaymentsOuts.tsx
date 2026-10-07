import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { CompactTable, Headers } from "@/components/ui/compact-table";
import { Label } from "@/components/ui/label";
import Payments from "@/components/ui/payments";
import { useBalanceContext } from "@/contexts/balance-context";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import ModalGeneral from "@/components/ui/ModalGeneral";

export default function RenderPaymentsOuts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedClientId } = useClientContext();

  const {
    data: client,
    isLoading,
    error,
  } = useClientById(selectedClientId || "");

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
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors disabled:opacity-50"
              >
                + Crear Saldo
              </button>,
            ]}
          />
          <Label className="col-span-full p-2 bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
            Contrato No.: {client.contrato} -{" "}
            {"PLAN RESIDENCIAL ONE CONNECTION 600 MBPS / CORTE 15"}- ESTADO{" "}
            {client.estado}
          </Label>
          <Payments />
        </CompactTable>
      </main>

      <CreateBalance
        selectedClientId={selectedClientId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </article>
  );
}

function CreateBalance({
  selectedClientId,
  isModalOpen,
  setIsModalOpen,
}: {
  selectedClientId: string | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) {
  const {
    formData,
    handleCreateBalance,
    handleField,
    resetFormData,
    isCreatingBalance,
  } = useBalanceContext();

  const handleSubmit = async () => {
    const created = await handleCreateBalance();
    if (!created) return;
    resetFormData();
  };

  return (
    <ModalGeneral
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Nuevo Saldo"
      onSave={handleSubmit}
      validator={isCreatingBalance}
      formId="create-balance"
    >
      <form
        id="create-balance"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="modal-body">
          <div className="flex flex-col gap-1">
            <Label className={styles.inputLabel}>Saldo *</Label>
            <Input
              required
              step="0.01"
              type="number"
              className={styles.input}
              value={formData.balance ?? ""}
              onChange={(e) => handleField("balance", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className={styles.inputLabel}>Descripción *</Label>
            <Input
              required
              type="text"
              className={styles.input}
              value={formData.description ?? ""}
              onChange={(e) => handleField("description", e.target.value)}
              placeholder="Descripción de la deuda"
            />
          </div>
        </div>
      </form>
    </ModalGeneral>
  );
}

// REALIZAR LA SECCIÓN DE PAGOS, DEBE CONTENER UN FORMULARIO PARA REGISTRAR PAGOS, UN BOTÓN PARA AGREGAR UN PAGO Y UNA TABLA PARA MOSTRAR LOS PAGOS PENDIENTES.
