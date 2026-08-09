import { fetchClientByContrato } from "@/lib/endpoint-api";
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/typesDB";

export function useClientByContrato(contrato: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ["clientByContrato", contrato],
    queryFn: () => fetchClientByContrato(contrato),
    staleTime: 1000 * 30,
    enabled,
    select: (response: { data: Client[] }) => response.data,
  });
}
