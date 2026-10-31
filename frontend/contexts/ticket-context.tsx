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
import { createTicketAction, updateTicketAction } from "@/actions/mutations";
import { Ticket } from "@/types/ticket";
import { useTickets } from "@/hooks/useTickets";
import { useTicketById } from "@/hooks/useTicketById";

export type EditableTicketData = Partial<
  Omit<Ticket, "documentId" | "nro_ticket">
>;

export type FieldValue = string | number | boolean | null;

export interface TicketContextState {
  tickets: Ticket[];
  isLoadingTickets: boolean;

  selectedTicketId: Ticket | null;
  setSelectedTicketId: (ticket: Ticket | null) => void;
  isUpdatingTicket: boolean;
  canEdit: boolean;
  handleUpdateTicket: (documentId: string, data: EditableTicketData) => Promise<boolean>;
  
  formData: EditableTicketData;
  setFormData: React.Dispatch<React.SetStateAction<EditableTicketData>>;
  handleField: (field: keyof EditableTicketData, value: FieldValue) => void;
  resetFormData: (ticket?: Ticket) => void;
  isCreatingTicket: boolean;
  handleCreateTicket: () => Promise<boolean>;
  
  notification: string | null;
  setNotification: (msg: string | null) => void;
  refetchTickets: () => void;
}

export const TicketContext = createContext<TicketContextState | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [selectedTicketId, setSelectedTicketId] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState<EditableTicketData>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [isUpdatingTicket, setIsUpdatingTicket] = useState<boolean>(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState<boolean>(false);

  const {
    data: tickets = [],
    isLoading: isLoadingTickets,
    refetch: refetchTickets,
  } = useTickets(true);

  const { data: selectedTicket, isLoading: isLoadingDetail } = useTicketById(
    selectedTicketId?.documentId ?? "",
  );

  const handleField = useCallback(
    (field: keyof EditableTicketData, value: FieldValue) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleCreateTicket = useCallback(async (): Promise<boolean> => {
    setIsCreatingTicket(true);
    try{
      const res = await createTicketAction(formData);
      setNotification("Ticket creado correctamente");
      refetchTickets();
      return true;
    } catch (err) {
      console.error(err);
      setNotification("Error al crear ticket");
      return false;
    } finally {
      setIsCreatingTicket(false);
    }
  }, [formData, refetchTickets])

  const handleUpdateTicket = useCallback(async (documentId: string, data: EditableTicketData): Promise<boolean> => {
    setIsUpdatingTicket(true);
    try {
      await updateTicketAction(documentId, data);
      setNotification("Ticket actualizado correctamente");
      refetchTickets();
      return true;
    } catch (err) {
      console.error(err);
      setNotification("Error al actualizar ticket");
      return false;
    } finally {
      setIsUpdatingTicket(false);
    }
  }, [refetchTickets])

  const resetFormData = useCallback((ticket?: Ticket) => {
    if (ticket) {
      setFormData({
        description: ticket.description,
        ticket_detail: ticket.ticket_detail,
        priority: ticket.priority,
        ticket_status: ticket.ticket_status,
        subject: ticket.subject,
        scheduled_date: ticket.scheduled_date,
        scheduled_time: ticket.scheduled_time,
        ticket_closure: ticket.ticket_closure,
        scaled_to: ticket.scaled_to,
        type_support: ticket.type_support,
        support_reason: ticket.support_reason,
        assigned_to: ticket.assigned_to,
        client: ticket.client,
      });
    } else {
      setFormData({});
    }
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      resetFormData(selectedTicket);
    } else {
      resetFormData();
    }
  }, [selectedTicket, resetFormData]);

  const canEdit = useMemo(() => {
    if (!selectedTicket) return false;
    return selectedTicket.ticket_status !== "RESUELTO";
  }, [selectedTicket]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        isLoadingTickets,
        selectedTicketId,
        isCreatingTicket,
        isUpdatingTicket,
        setSelectedTicketId,
        formData,
        setFormData,
        resetFormData,
        handleField,
        handleCreateTicket,
        handleUpdateTicket,
        canEdit,
        notification,
        setNotification,
        refetchTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTicketContext must be used within a TicketProvider");
  }
  return context;
}



/// AUN FALTA HACER LA VALIDACION CORRECTA, SOLO POR EL MOMENTO NO QUISE DEJAR ERRORES DE VISTA