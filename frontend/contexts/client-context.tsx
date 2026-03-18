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

  const resetFormData = useCallback((client?: Client) => {
    if (client) {
      const data: EditableClientData = {
        nombres: client.nombres,
        apellidos: client.apellidos,
        identificacion: client.identificacion,
        ciudad: client.ciudad,
        email: client.email,
        telefono: client.telefono,
        estado: client.estado,
        valores: client.valores,
        plans: client.plans,
        tipoCliente: client.tipoCliente,
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
    alert("Tiene cambios sin guardar. Guarde o cancele antes de cambiar de cliente.");
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