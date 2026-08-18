import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchClientById } from "@/lib/endpoint-api";
import { Client } from "@/types/typesDB";

export function useClientById(documentId: string) {
  return useQuery({
    queryKey: ["clientById", documentId],
    queryFn: () => fetchClientById(documentId),
    // staleTime: 1000 * 60 * 5,
    enabled: !!documentId,
    placeholderData: keepPreviousData,
    select: (response: { data: Client }) => response.data,
  });
}
