import { fetchClients } from "@/lib/endpoint-api";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/typesDB";

export function useClients(enabled: boolean = false) {
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 1000 * 30,
    enabled,
    select: (response: { data: Client[] }) => response.data,
  });
}
