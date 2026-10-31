import { fetchTicketById } from "@/lib/endpoint-api";
import { Ticket } from "@/types/ticket";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTicketById(documentId: string) {
  return useQuery({
    queryKey: ["ticketById", documentId],
    queryFn: () => fetchTicketById(documentId),
    enabled: !!documentId,
    placeholderData: keepPreviousData,
    select: (response: { data: Ticket }) => response.data,
  });
}