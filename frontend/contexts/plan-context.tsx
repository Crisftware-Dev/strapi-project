"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useCreatePlan } from "@/hooks/usePlans";

// ─── Constantes ─────────────────────────────────────────────────────────────

export const SERVICE_TYPES = [
  { value: "COBRE", label: "COBRE" },
  { value: "MEDIO INALÁMBRICO", label: "MEDIO INALÁMBRICO" },
  { value: "FIBRA ÓPTICA", label: "FIBRA ÓPTICA" },
] as const;

export const CUT_OPTIONS = [
  { value: 15, label: "15" },
  { value: 25, label: "25" },
] as const;

export const PLAN_INITIAL_STATE: PlanFormData = {
  plan: "",
  type: "",
  valor: "",
  cut: "",
};

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface PlanFormData {
  plan: string;
  type: string;
  valor: string;
  cut: string;
}

export interface PlanNotification {
  message: string;
  type: "success" | "error";
}

interface PlanContextType {
  form: PlanFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  isPending: boolean;
  notification: PlanNotification | null;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const PlanContext = createContext<PlanContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function PlanProvider({ children, userName }: { children: ReactNode; userName: string }) {
  const createPlanMutation = useCreatePlan();

  const [form, setForm] = useState<PlanFormData>(PLAN_INITIAL_STATE);
  const [notification, setNotification] = useState<PlanNotification | null>(
    null
  );

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(PLAN_INITIAL_STATE);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const valorNum = parseFloat(form.valor);
      const cutNum = parseInt(form.cut, 10);

      if (!form.plan.trim()) {
        showNotification("El nombre del plan no puede estar vacío.", "error");
        return;
      }

      if (isNaN(valorNum) || valorNum < 0) {
        showNotification("El valor debe ser un número positivo.", "error");
        return;
      }

      if (isNaN(cutNum) || cutNum < 1 || cutNum > 31) {
        showNotification(
          "El día de corte debe estar entre 1 y 31.",
          "error"
        );
        return;
      }

      try {
        await createPlanMutation.mutateAsync({
          plan: form.plan.trim(),
          type: form.type,
          valor: valorNum,
          cut: cutNum,
          CREATEDBY: userName,
        });

        showNotification(
          `Plan "${form.plan}" creado con éxito en el sistema.`,
          "success"
        );
        resetForm();
      } catch (error) {
        showNotification(
          `Error al registrar el plan: ${(error as Error).message}`,
          "error"
        );
      }
    },
    [form, userName, createPlanMutation, showNotification, resetForm]
  );

  return (
    <PlanContext.Provider
      value={{
        form,
        handleInputChange,
        handleSubmit,
        resetForm,
        isPending: createPlanMutation.isPending,
        notification,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

// ─── Hook de consumo ─────────────────────────────────────────────────────────

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlanContext must be used within a PlanProvider");
  }
  return context;
}
