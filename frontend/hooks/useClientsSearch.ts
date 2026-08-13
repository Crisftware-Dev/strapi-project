import { fetchClientsSearch } from "@/lib/endpoint-api";
import { useQuery } from "@tanstack/react-query";
import {
  ClientSearchFilters,
  ClientSearchResponse,
} from "@/types/typesDB";

export function useClientsSearch(
  filters: ClientSearchFilters,
  page: number,
  enabled: boolean = false,
) {
  return useQuery<ClientSearchResponse>({
    queryKey: ["clientsSearch", filters, page],
    queryFn: () => fetchClientsSearch(filters, page),
    staleTime: 1000 * 30,
    enabled,
  });
}
