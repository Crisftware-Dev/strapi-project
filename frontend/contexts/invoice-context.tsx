"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Invoice } from "@/types/invoice";
import { Balance } from "@/types/balance";
import { useBalanceContext } from "@/contexts/balance-context";
import { ClientContext } from "@/contexts/client-context";
import {
  createInvoiceAction,
  updateBalanceAction,
  deleteBalanceAction,
} from "@/actions/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useInvoiceById } from "@/hooks/useInvoiceById";
import { useUser } from "@/hooks/useUser";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface InvoiceNotification {
  message: string;
  type: "success" | "error" | "warning";
}

export type InvoiceFormData = {
  /** Monto total de la factura a crear */
  amount: number | "";
  detail?: string;
};

interface InvoiceContextType {
  invoices: Invoice[] | null;

  // ─── Estado de formulario ───
  formData: InvoiceFormData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceFormData>>;
  handleField: (field: keyof InvoiceFormData, value: number | string) => void;
  resetFormData: () => void;

  // ─── Resumen de saldos del cliente ───
  /** Total de saldo pendiente disponible del cliente */
  totalPendingBalance: number;
  /** Saldos ordenados del más antiguo al más reciente */
  sortedBalances: Balance[];

  // ─── Crear factura ───
  isCreatingInvoice: boolean;
  /** Crea la factura descontando los saldos pendientes del más antiguo al más nuevo */
  handleCreateInvoice: () => Promise<boolean>;

  // ─── Notificaciones ───
  notification: InvoiceNotification | null;
  showNotification: (
    message: string,
    type: "success" | "error" | "warning",
  ) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

const initialFormData: InvoiceFormData = {
  amount: "",
  detail: "",
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export function InvoiceProvider({ children }: InvoiceProviderProps) {
  const clientContext = useContext(ClientContext);
  const { data: user } = useUser();
  const { data: invoices = [] } = useInvoiceById(
    clientContext?.selectedClientId || "",
  );
  const { balances, refetchBalances } = useBalanceContext();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [notification, setNotification] = useState<InvoiceNotification | null>(
    null,
  );


  // ─── Saldos ordenados del más antiguo al más reciente ───────────────────────
  const sortedBalances = useMemo<Balance[]>(() => {
    if (!balances || balances.length === 0) return [];
    return [...balances]
      .filter((b) => b.balance > 0)
      .sort(
        (a, b) =>
          new Date(a.issued ?? a.createdAt).getTime() -
          new Date(b.issued ?? b.createdAt).getTime(),
      );
  }, [balances]);

  // ─── Total de saldo pendiente disponible ─────────────────────────────────────
  const totalPendingBalance = useMemo(
    () => sortedBalances.reduce((sum, b) => sum + (b.balance ?? 0), 0),
    [sortedBalances],
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "warning") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    [],
  );

  const handleField = useCallback(
    (field: keyof InvoiceFormData, value: number | string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  // ─── Lógica principal: crear factura y descontar saldos ──────────────────────
  /**
   * Algoritmo:
   * 1. Validar que el monto sea > 0 y <= totalPendingBalance.
   * 2. Ordenar saldos de más antiguo a más reciente.
   * 3. Iterar: por cada saldo, restar el monto restante de la factura.
   *    - Si el saldo queda en 0 → eliminarlo (DELETE).
   *    - Si el saldo queda con valor parcial → actualizarlo (PUT).
   *    - Continuar con el siguiente saldo si aún queda monto por cubrir.
   * 4. Crear la factura en Strapi.
   * 5. Refrescar cache de balances.
   */
  const handleCreateInvoice = useCallback(async (): Promise<boolean> => {
    const invoiceAmount =
      typeof formData.amount === "number" ? formData.amount : 0;
    const detail = (formData.detail ?? "").trim();

    // ── Validaciones ────────────────────────────────────────────────────────
    if (!invoiceAmount || invoiceAmount <= 0) {
      showNotification(
        "El monto de la factura debe ser mayor a cero.",
        "error",
      );
      return false;
    }

    if (invoiceAmount > totalPendingBalance) {
      showNotification(
        `El monto ($${invoiceAmount.toLocaleString("es-CO")}) supera el saldo pendiente disponible del cliente ($${totalPendingBalance.toLocaleString("es-CO")}).`,
        "error",
      );
      return false;
    }

    if (sortedBalances.length === 0) {
      showNotification(
        "El cliente no tiene saldos pendientes para facturar.",
        "error",
      );
      return false;
    }

    setIsCreatingInvoice(true);

    try {
      // ── Paso 1: Descontar saldos del más antiguo al más reciente ──────────
      let remaining = invoiceAmount;
      const balanceOps: Array<Promise<unknown>> = [];

      for (const balance of sortedBalances) {
        if (remaining <= 0) break;

        const currentBalance = balance.balance ?? 0;
        if (currentBalance <= 0) continue;

        if (!balance.documentId) {
          console.warn(
            `Balance ${balance.id_balance} sin documentId, omitiendo.`,
          );
          continue;
        }

        if (remaining >= currentBalance) {
          // Este saldo queda en 0 → eliminarlo
          balanceOps.push(deleteBalanceAction(balance.documentId));
          remaining -= currentBalance;
        } else {
          // Este saldo se reduce parcialmente
          const newBalance = currentBalance - remaining;
          const newPaid = (balance.paid ?? 0) + remaining;
          balanceOps.push(
            updateBalanceAction(balance.documentId, {
              balance: newBalance,
              paid: newPaid,
            }),
          );
          remaining = 0;
        }
      }

      // Ejecutar todas las operaciones sobre saldos en paralelo
      await Promise.all(balanceOps);

      // ── Paso 2: Crear la factura en Strapi ────────────────────────────────
      const clientId = clientContext?.selectedClientId ?? null;

      await createInvoiceAction({
        invoice_nro: `INV-${Date.now()}`,
        issue_date: new Date().toISOString().split("T")[0],
        subtotal: invoiceAmount / 1.15,
        taxes: (invoiceAmount * 0.15),
        total: invoiceAmount,
        paid: invoiceAmount,
        detail: detail || undefined,
        users_permissions_user: user,
        ...(clientId ? { cliente: { documentId: clientId } as never } : {}),
      });

      // ── Paso 3: Refrescar cache ────────────────────────────────────────────
      await refetchBalances();
      await queryClient.invalidateQueries({ queryKey: ["balances"] });
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });

      showNotification("Factura creada y saldos actualizados.", "success");
      resetFormData();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear la factura.";
      showNotification(message, "error");
      return false;
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [
    formData.amount,
    formData.detail,
    totalPendingBalance,
    sortedBalances,
    clientContext?.selectedClientId,
    refetchBalances,
    queryClient,
    showNotification,
    resetFormData,
  ]);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        // ─── Formulario ───
        formData,
        setFormData,
        handleField,
        resetFormData,

        // ─── Saldos ───
        totalPendingBalance,
        sortedBalances,

        // ─── Crear factura ───
        isCreatingInvoice,
        handleCreateInvoice,

        // ─── Notificaciones ───
        notification,
        showNotification,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

// ─── Hook de consumo ─────────────────────────────────────────────────────────

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoiceContext must be used within an InvoiceProvider");
  }
  return context;
}
