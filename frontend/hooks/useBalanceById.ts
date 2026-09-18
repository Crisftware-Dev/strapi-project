import { useQuery } from "@tanstack/react-query";
import { fecthBalancesById } from "@/lib/endpoint-api";
import { Balance } from "@/types/balance";

export function useBalanceById(documentId: string) {
  return useQuery({
    queryKey: ["balances", documentId],
    queryFn: () => fecthBalancesById(documentId),
    staleTime: 1000 * 60 * 10,
    enabled: !!documentId,
    select: (response: { data: Balance[] }) => response.data,
  });
}
