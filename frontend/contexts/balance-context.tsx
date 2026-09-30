"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Balance } from "@/types/balance";
import { NumericInput, toNumber } from "@/lib/form-value";
import { useBalanceById } from "@/hooks/useBalanceById";
import {
  createBalanceAction,
  updateBalanceAction,
  deleteBalanceAction,
} from "@/actions/mutations";
import { ClientContext } from "@/contexts/client-context";
import { useQueryClient } from "@tanstack/react-query";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface BalanceNotification {
  message: string;
  type: "success" | "error";
}

export type BalanceData = {
  total?: NumericInput;
  paid?: NumericInput;
  balance?: NumericInput;
  issued?: string;
  discounts?: NumericInput;
  description?: string;
};

export type FieldValue = string | number | boolean | null;

interface BalanceContextType {
  // ─── Shared / Common ───
  balances: Balance[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isPending: boolean;
  notification: BalanceNotification | null;
  showNotification: (message: string, type: "success" | "error") => void;
  refetchBalances: () => Promise<unknown>;

  // ─── Create ───
  formData: BalanceData;
  setFormData: React.Dispatch<React.SetStateAction<BalanceData>>;
  handleField: (field: keyof BalanceData, value: FieldValue) => void;
  resetFormData: () => void;
  isCreatingBalance: boolean;
  handleCreateBalance: () => Promise<boolean>;

  // ─── Update ───
  selectedBalance: Balance | null;
  setSelectedBalance: (balance: Balance | null) => void;
  isUpdatingBalance: boolean;
  handleUpdateBalance: (
    documentId: string,
    data: Partial<Omit<Balance, "documentId" | "id_balance">>,
  ) => Promise<Balance | undefined>;

  // ─── Delete ───
  isDeletingBalance: boolean;
  handleDeleteBalance: (documentId: string) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

const initialData: BalanceData = {
  total: "",
  paid: "",
  balance: "",
  issued: "",
  discounts: "",
  description: "",
};

interface BalanceProviderProps {
  children: ReactNode;
  clientId: string;
}

export function BalanceProvider({ children, clientId }: BalanceProviderProps) {
  const clientContext = useContext(ClientContext);

  const effectiveClientId: string | null =
    clientContext?.selectedClientId ?? clientId ?? null;

  const {
    data: balances,
    isLoading,
    error,
    refetch: refetchBalances,
  } = useBalanceById(effectiveClientId || "");

  const queryClient = useQueryClient();

  const [isCreatingBalance, setIsCreatingBalance] = useState(false);
  const [formData, setFormData] = useState<BalanceData>(initialData);

  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
  const [isDeletingBalance, setIsDeletingBalance] = useState(false);
  const [notification, setNotification] = useState<BalanceNotification | null>(
    null,
  );

  const handleField = useCallback(
    (field: keyof BalanceData, value: FieldValue) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
    },
    [],
  );

  const handleCreateBalance = useCallback(async (): Promise<boolean> => {
    const amount = toNumber(formData.balance);
    const description = (formData.description ?? "").trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      showNotification("El saldo debe ser un monto mayor a cero.", "error");
      return false;
    }

    if (!description) {
      showNotification("La descripción es requerida.", "error");
      return false;
    }

    setIsCreatingBalance(true);
    try {
      await createBalanceAction({
        id_balance: `BAL-${Date.now()}`,
        total: amount,
        paid: 0,
        balance: amount,
        description,
        issued: new Date().toISOString().split("T")[0],
        discounts: toNumber(formData.discounts),
        cliente: effectiveClientId,
      });

      await refetchBalances();
      await queryClient.invalidateQueries({ queryKey: ["balances"] });

      showNotification("Saldo creado exitosamente.", "success");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear el saldo.";
      showNotification(message, "error");
      return false;
    } finally {
      setIsCreatingBalance(false);
    }
  }, [
    effectiveClientId,
    formData.balance,
    formData.description,
    formData.discounts,
    queryClient,
    refetchBalances,
    showNotification,
  ]);

  const resetFormData = useCallback(() => {
    setFormData(initialData);
  }, []);

  const handleUpdateBalance = useCallback(
    async (
      documentId: string,
      data: Partial<Omit<Balance, "documentId" | "id_balance">>,
    ): Promise<Balance | undefined> => {
      if (!documentId) {
        showNotification(
          "El identificador del saldo es requerido para actualizar.",
          "error",
        );
        return;
      }

      setIsUpdatingBalance(true);
      try {
        const response = await updateBalanceAction(documentId, data);

        if (effectiveClientId) {
          await refetchBalances();
        }

        showNotification("Saldo actualizado exitosamente.", "success");
        return response.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al actualizar el saldo.";
        showNotification(message, "error");
        throw err;
      } finally {
        setIsUpdatingBalance(false);
      }
    },
    [effectiveClientId, showNotification, refetchBalances],
  );

  const handleDeleteBalance = useCallback(
    async (documentId: string): Promise<void> => {
      if (!documentId) {
        showNotification(
          "El identificador del saldo es requerido para eliminar.",
          "error",
        );
        return;
      }

      setIsDeletingBalance(true);
      try {
        await deleteBalanceAction(documentId);

        if (effectiveClientId) {
          await refetchBalances();
        }

        if (selectedBalance?.documentId === documentId) {
          setSelectedBalance(null);
        }

        showNotification("Saldo eliminado exitosamente.", "success");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al eliminar el saldo.";
        showNotification(message, "error");
        throw err;
      } finally {
        setIsDeletingBalance(false);
      }
    },
    [
      effectiveClientId,
      selectedBalance?.documentId,
      showNotification,
      refetchBalances,
    ],
  );

  const isPending = isCreatingBalance || isUpdatingBalance || isDeletingBalance;

  return (
    <BalanceContext.Provider
      value={{
        // ─── Shared / Common ───
        balances,
        isLoading,
        error: (error as Error) || null,
        isPending,
        notification,
        showNotification,
        refetchBalances,

        // ─── Create ───
        formData,
        setFormData,
        handleField,
        resetFormData,
        isCreatingBalance,
        handleCreateBalance,

        // ─── Update ───
        selectedBalance,
        setSelectedBalance,
        isUpdatingBalance,
        handleUpdateBalance,

        // ─── Delete ───
        isDeletingBalance,
        handleDeleteBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

// ─── Hook de consumo ─────────────────────────────────────────────────────────

export function useBalanceContext() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalanceContext must be used within a BalanceProvider");
  }
  return context;
}
