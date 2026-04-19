"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Client } from "@/types/typeClients";

export type EditableClientData = Partial<Omit<Client, "documentId" | "contrato">>;

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
  trySelectClient: (id: string) => boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("cliente");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditableClientData>({});
  const [originalData, setOriginalData] = useState<EditableClientData>({});

  const hasUnsavedChanges = useMemo(() => {
    if (!isEditing) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [isEditing, formData, originalData]);

  const isValidToSave = useMemo(() => {
    if (!isEditing) return true;
    
    const currentTipoPlan = formData.tipoPlan !== undefined ? formData.tipoPlan : originalData.tipoPlan;
    const currentPlans = formData.plans !== undefined ? formData.plans : originalData.plans;
    
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
  }, [isEditing, formData.tipoPlan, formData.plans, originalData.tipoPlan, originalData.plans]);

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
        telefono: client.telefono,
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
      };
      setFormData(data);
      setOriginalData(data);
    } else {
      setFormData({});
      setOriginalData({});
    }
    setIsEditing(false);
  }, []);

  const trySelectClient = useCallback((id: string) => {
    if (!isEditing) {
      setSelectedClientId(id);
      return true;
    }
    if (!hasUnsavedChanges) {
      setIsEditing(false);
      setFormData({});
      setOriginalData({});
      setSelectedClientId(id);
      return true;
    }
    if (isEditing && hasUnsavedChanges) {
      alert("Tiene cambios sin guardar. Guarde o cancele antes de cambiar de cliente.");
      return false;
    }

    // if(formData.tipoPlan !== originalData.plans.map((plan) => plan.type)){
      
    // }
    return false;
  }, [isEditing, hasUnsavedChanges]);

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