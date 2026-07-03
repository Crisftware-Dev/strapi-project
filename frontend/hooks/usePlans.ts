import { fetchPlans, createPlan } from "@/lib/endpoint-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plan } from "@/types/typeClients";

export function usePlans(enabled: boolean = true) {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Plan>) => createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}