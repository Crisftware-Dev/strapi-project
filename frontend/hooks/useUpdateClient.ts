import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientById } from "@/lib/endpoint-api";
import { Client } from "@/types/typeClients";

interface UpdateClientParams {
  documentId: string;
  data: Partial<Omit<Client, "documentId">>;
}


export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, data }: UpdateClientParams) =>
      updateClientById(documentId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientById", variables.documentId],
      });
    },
  });
}
