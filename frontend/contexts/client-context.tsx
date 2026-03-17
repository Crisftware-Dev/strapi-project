"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
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
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("cliente");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditableClientData>({});

  const resetFormData = useCallback((client?: Client) => {
    if (client) {
      setFormData({
        nombres: client.nombres,
        apellidos: client.apellidos,
        identificacion: client.identificacion,
        ciudad: client.ciudad,
        email: client.email,
        telefono: client.telefono,
        estado: client.estado,
        valores: client.valores,
      });
    } else {
      setFormData({});
    }
    setIsEditing(false);
  }, []);

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