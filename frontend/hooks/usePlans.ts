import { fetchPlans } from "@/lib/endpoint-api";
import { createPlanAction } from "@/actions/mutations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plan } from "@/types/typesDB";

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
    mutationFn: (data: Partial<Plan>) => createPlanAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
