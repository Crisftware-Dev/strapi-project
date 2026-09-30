import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { CompactTable, Headers } from "@/components/ui/compact-table";
import { Label } from "@/components/ui/label";
import Payments from "@/components/ui/payments";
import { useBalanceContext } from "@/contexts/balance-context";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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

      <ModalPaymentsOuts
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedClientId={selectedClientId}
      />
    </article>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClientId: string | null;
}

function ModalPaymentsOuts({ isOpen, onClose, selectedClientId }: ModalProps) {
  if (!isOpen) return null;

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
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-payments-outs-title"
        className="modal-container w-full max-w-lg"
      >
        <div className="modal-header">
          <h2 id="modal-payments-outs-title" className="modal-title">
            Nueva Deuda
          </h2>
        </div>

        <form
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

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreatingBalance}
              className="px-8 py-3 text-indigo-600 hover:bg-indigo-100 rounded-xl font-medium"
            >
              {isCreatingBalance ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// REALIZAR LA SECCIÓN DE PAGOS, DEBE CONTENER UN FORMULARIO PARA REGISTRAR PAGOS, UN BOTÓN PARA AGREGAR UN PAGO Y UNA TABLA PARA MOSTRAR LOS PAGOS PENDIENTES.
