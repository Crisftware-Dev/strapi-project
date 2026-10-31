import { fetchTickets } from "@/lib/endpoint-api";
import { Ticket } from "@/types/ticket";
import { useQuery } from "@tanstack/react-query";

export function useTickets(enabled: boolean = false) {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
    enabled,
    select: (response: { data: Ticket[] }) => response.data,
  });
}