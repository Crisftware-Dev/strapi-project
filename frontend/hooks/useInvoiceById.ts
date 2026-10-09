import { useQuery } from "@tanstack/react-query";
import { fecthInvoicesById } from "@/lib/endpoint-api";
import { Invoice } from "@/types/invoice";

export function useInvoiceById(documentId: string) {
  return useQuery({
    queryKey: ["invoices", documentId],
    queryFn: () => fecthInvoicesById(documentId),
    staleTime: 1000 * 60 * 10,
    enabled: !!documentId,
    select: (response: { data: Invoice[] }) => response.data,
  });
}