import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientAction, uploadFileAction } from "@/actions/mutations";
import { Client, StrapiMedia } from "@/types/typesDB";

interface UpdateClientParams {
  documentId: string;
  data: Partial<Omit<Client, "documentId">>;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  const uploadFiles = useMutation({
    mutationFn: (formData: FormData): Promise<StrapiMedia[]> =>
      uploadFileAction(formData),
  });

  const updateClient = useMutation({
    mutationFn: ({ documentId, data }: UpdateClientParams) =>
      updateClientAction(documentId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientById", variables.documentId],
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return { uploadFiles, updateClient };
}
