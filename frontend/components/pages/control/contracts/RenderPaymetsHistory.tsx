import { useClientContext } from "@/contexts/client-context";
import { useClientById } from "@/hooks/useClientById";
import { styles } from "@/app/styles/styles";
import { CompactTable, Headers } from "@/components/ui/compact-table";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Invoices from "@/components/ui/payments";
import ModalGeneral from "@/components/ui/ModalGeneral";
import { Input } from "@/components/ui/input";
import { Notification } from "@/components/ui/feedback";
import { createInvoiceSchema } from "@/validations/invoice";
import { toNumber } from "@/lib/form-value";
import { useInvoiceContext } from "@/contexts/invoice-context";

export default function RenderPaymentsHistory() {
  const [active, setActive] = useState("");
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
          <Label className="col-span-full p-2 bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
            Contrato No.: {client.contrato}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors disabled:opacity-50"
            >
              + Crear Factura
            </button>
          </Label>
          <Invoices />
        </CompactTable>
      </main>

      <CreateInvoice
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </article>
  );
}


interface CreateInvoiceProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const currency = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function CreateInvoice({
  isModalOpen,
  setIsModalOpen,
}: CreateInvoiceProps) {
  const {
    formData,
    handleField,
    handleCreateInvoice,
    isCreatingInvoice,
    totalPendingBalance,
    notification,
    showNotification,
  } = useInvoiceContext();

  const [fieldErrors, setFieldErrors] = useState<{
    amount?: string[];
    detail?: string[];
  }>({});

  const handleSubmit = async () => {
    const result = createInvoiceSchema(totalPendingBalance).safeParse({
      amount: toNumber(formData.amount),
      detail: (formData.detail ?? "").trim() || undefined,
    });

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      showNotification(
        result.error.issues[0]?.message ?? "Datos de la factura inválidos.",
        "error",
      );
      return;
    }

    setFieldErrors({});
    const created = await handleCreateInvoice();
    if (!created) return;
    setIsModalOpen(false);
  };

  return (
    <ModalGeneral
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Nueva Factura"
      onSave={handleSubmit}
      validator={isCreatingInvoice}
      formId="create-invoice"
    >
      <form
        id="create-invoice"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="modal-body">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Saldo pendiente disponible:{" "}
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
              ${currency.format(totalPendingBalance)}
            </span>
          </p>
          <div className="flex flex-col gap-1">
            <Label className={styles.inputLabel}>Monto *</Label>
            <Input
              required
              step="0.01"
              min="0"
              type="number"
              className={styles.input}
              value={formData.amount ?? ""}
              onChange={(e) => handleField("amount", e.target.value)}
              placeholder="0.00"
            />
            {fieldErrors.amount?.map((err, i) => (
              <p key={i} className="text-pink-500 text-xs italic mt-1">
                {err}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <Label className={styles.inputLabel}>Detalle</Label>
            <Input
              type="text"
              className={styles.input}
              value={formData.detail ?? ""}
              onChange={(e) => handleField("detail", e.target.value)}
              placeholder="Concepto de la factura (opcional)"
            />
            {fieldErrors.detail?.map((err, i) => (
              <p key={i} className="text-pink-500 text-xs italic mt-1">
                {err}
              </p>
            ))}
          </div>
        </div>
      </form>
      <Notification
        notification={
          notification
            ? { message: notification.message, type: notification.type }
            : null
        }
      />
    </ModalGeneral>
  );
}