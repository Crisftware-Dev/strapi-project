import { fetchAppliedDiscount } from "@/lib/endpoint-api";
import { useQuery } from "@tanstack/react-query";
import { AppliedDiscount } from "@/types/typesDB";

export function useAppliedDiscount(enabled: boolean = true) {
  return useQuery({
    queryKey: ["applied-discounts"],
    queryFn: fetchAppliedDiscount,
    staleTime: 1000 * 60 * 10,
    enabled,
    select: (response: { data: AppliedDiscount[] }) => response.data,
  });
}