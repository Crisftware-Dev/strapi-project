import { fetchAppliedDiscount } from "@/lib/endpoint-api";
import { useQuery } from "@tanstack/react-query";

export function useAppliedDiscount() {
  return useQuery({
    queryKey: ["applied-discounts"],
    queryFn: fetchAppliedDiscount,
    staleTime: 1000 * 60 * 5,
  });
}