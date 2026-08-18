"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { Client } from "@/types/typesDB";

export type EditableClientData = Partial<
  Omit<Client, "documentId" | "contrato">
>;

interface ClientContextType {
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  formData: EditableClientData;
  setFormData: React.Dispatch<React.SetStateAction<EditableClientData>>;
  resetFormData: (client?: Client) => void;
  hasUnsavedChanges: boolean;
  isValidToSave: boolean;
  validationError: string | null;
  notification: string | null;
  trySelectClient: (id: string) => boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("cliente");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditableClientData>({});
  const [originalData, setOriginalData] = useState<EditableClientData>({});
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  const hasUnsavedChanges = useMemo(() => {
    if (!isEditing) return false;
    const keys = new Set([
      ...Object.keys(formData),
      ...Object.keys(originalData),
    ]);
    for (const key of keys) {
      if (formData[key as keyof EditableClientData] !== originalData[key as keyof EditableClientData]) {
        return true;
      }
    }
    return false;
  }, [isEditing, formData, originalData]);

  const isValidToSave = useMemo(() => {
    if (!isEditing) return true;

    const currentTipoPlan =
      formData.tipoPlan !== undefined
        ? formData.tipoPlan
        : originalData.tipoPlan;
    const currentPlans =
      formData.plans !== undefined ? formData.plans : originalData.plans;

    if (currentTipoPlan && currentPlans && currentPlans.length > 0) {
      const hasMismatch = currentPlans.some((plan) => {
        const planMedia = `${plan.type}`.toLowerCase();
        return !planMedia.includes(currentTipoPlan.toLowerCase());
      });

      if (hasMismatch) {
        return false;
      }
    }
    return true;
  }, [
    isEditing,
    formData.tipoPlan,
    formData.plans,
    originalData.tipoPlan,
    originalData.plans,
  ]);

  const validationError = useMemo(() => {
    if (!isValidToSave) {
      return "El Tipo de Plan seleccionado no coincide con los planes agregados. Cambie el tipo o elimine los planes incompatibles.";
    }
    return null;
  }, [isValidToSave]);

  
  const resetFormData = useCallback((client?: Client) => {
    if (client) {
      const data: EditableClientData = {
        nombres: client.nombres,
        apellidos: client.apellidos,
        identificacion: client.identificacion,
        currentAge: client.currentAge,
        ciudad: client.ciudad,
        email: client.email,
        estado: client.estado,
        valores: client.valores,
        plans: client.plans,
        tipoPlan: client.tipoPlan,
        planPrincipal: Boolean(client.planPrincipal),
        tipoCliente: client.tipoCliente,
        reference: client.reference,
        automaticCut: client.automaticCut,
        discountLaw: client.discountLaw,
        withholdingAgent: Boolean(client.withholdingAgent),
        files: client.files,
        automaticInvoice: client.automaticInvoice,
        contact: client.contact,
        entity: client.entity,
        applied_discount: client.applied_discount,
        installationDate: client.installationDate,
        transferDate: client.transferDate,
        sinceCustomer: client.sinceCustomer,
        scoreCredit: client.scoreCredit,
        seller_user: client.seller_user,
        assigned_installer: client.assigned_installer,
        location: client.location,
        economicActivity: client.economicActivity,
        typeOfHousing: client.typeOfHousing,
        relatedClient: Boolean(client.relatedClient),
        creditButt: Boolean(client.creditButt),
        discardButt: Boolean(client.discardButt),
        hasDucts: Boolean(client.hasDucts),
      };
      setFormData(data);
      setOriginalData(data);
    } else {
      setFormData({});
      setOriginalData({});
      setIsEditing(false);
    }
  }, []);

  const trySelectClient = useCallback(
    (id: string) => {
      if (!isEditing) {
        setSelectedClientId(id);
        setActiveTab("cliente");
        return true;
      }
      if (!hasUnsavedChanges) {
        setIsEditing(false);
        setFormData({});
        setOriginalData({});
        setSelectedClientId(id);
        setActiveTab("cliente");
        return true;
      }
      if (isEditing && hasUnsavedChanges) {
        setNotification(
          "Tiene cambios sin guardar. Guarde o cancele antes de cambiar de cliente.",
        );
        return false;
      }

      return false;
    },
    [isEditing, hasUnsavedChanges],
  );

  return (
    <ClientContext.Provider
      value={{
        selectedClientId,
        setSelectedClientId,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        formData,
        setFormData,
        resetFormData,
        hasUnsavedChanges,
        isValidToSave,
        validationError,
        notification,
        trySelectClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider");
  }
  return context;
}
