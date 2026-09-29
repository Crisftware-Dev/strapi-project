"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Balance } from "@/types/balance";
import { useBalanceById } from "@/hooks/useBalanceById";
import {
  createBalanceAction,
  updateBalanceAction,
  deleteBalanceAction,
} from "@/actions/mutations";
import { ClientContext } from "@/contexts/client-context";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface BalanceNotification {
  message: string;
  type: "success" | "error";
}

interface BalanceContextType {
  balances: Balance[] | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedBalance: Balance | null;
  setSelectedBalance: (balance: Balance | null) => void;
  isCreatingBalance: boolean;
  isUpdatingBalance: boolean;
  isDeletingBalance: boolean;
  isPending: boolean;
  notification: BalanceNotification | null;
  showNotification: (message: string, type: "success" | "error") => void;
  handleCreateBalance: (
    customData?: Partial<Balance>,
  ) => Promise<Balance | undefined>;
  handleUpdateBalance: (
    documentId: string,
    data: Partial<Omit<Balance, "documentId" | "id_balance">>,
  ) => Promise<Balance | undefined>;
  handleDeleteBalance: (documentId: string) => Promise<void>;
  refetchBalances: () => Promise<unknown>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

interface BalanceProviderProps {
  children: ReactNode;
  clientId?: string;
}

export function BalanceProvider({ children, clientId }: BalanceProviderProps) {
  const queryClient = useQueryClient();
  const clientContext = useContext(ClientContext);

  const effectiveClientId = clientId ?? clientContext?.selectedClientId ?? null;

  const {
    data: balances,
    isLoading,
    error,
    refetch: refetchBalances,
  } = useBalanceById(effectiveClientId || "");

  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const [isCreatingBalance, setIsCreatingBalance] = useState(false);
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
  const [isDeletingBalance, setIsDeletingBalance] = useState(false);
  const [notification, setNotification] = useState<BalanceNotification | null>(
    null,
  );

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
    },
    [],
  );

  const handleCreateBalance = useCallback(
    async (customData?: Partial<Balance>): Promise<Balance | undefined> => {
      if (!effectiveClientId) {
        showNotification(
          "No hay un cliente seleccionado para registrar el saldo.",
          "error",
        );
        return;
      }

      setIsCreatingBalance(true);
      try {
        const newBalance: Partial<Balance> = {
          id_balance: `BAL-${Date.now()}`,
          total: 0,
          paid: 0,
          balance: 0,
          issued: new Date().toISOString().split("T")[0],
          discounts: 0,
          ...(effectiveClientId ? { cliente: effectiveClientId } : {}),
          ...customData,
        };

        const response = await createBalanceAction(newBalance);

        await queryClient.invalidateQueries({
          queryKey: ["balances", effectiveClientId],
        });

        showNotification("Saldo creado exitosamente.", "success");
        return response.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al crear el saldo.";
        showNotification(message, "error");
        throw err;
      } finally {
        setIsCreatingBalance(false);
      }
    },
    [effectiveClientId, queryClient, showNotification],
  );

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
          await queryClient.invalidateQueries({
            queryKey: ["balances", effectiveClientId],
          });
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
    [effectiveClientId, queryClient, showNotification],
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
          await queryClient.invalidateQueries({
            queryKey: ["balances", effectiveClientId],
          });
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
      queryClient,
      selectedBalance?.documentId,
      showNotification,
    ],
  );

  const isPending = isCreatingBalance || isUpdatingBalance || isDeletingBalance;

  return (
    <BalanceContext.Provider
      value={{
        balances,
        isLoading,
        error: (error as Error) || null,
        selectedBalance,
        setSelectedBalance,
        isCreatingBalance,
        isUpdatingBalance,
        isDeletingBalance,
        isPending,
        notification,
        showNotification,
        handleCreateBalance,
        handleUpdateBalance,
        handleDeleteBalance,
        refetchBalances,
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
