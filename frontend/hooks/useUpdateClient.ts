import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientById, uploadFileToStrapi } from "@/lib/endpoint-api";
import { Client, StrapiMedia } from "@/types/typesDB";

interface UpdateClientParams {
  documentId: string;
  data: Partial<Omit<Client, "documentId">>;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  const uploadFiles = useMutation({
    mutationFn: (formData: FormData): Promise<StrapiMedia[]> =>
      uploadFileToStrapi(formData),
  });

  const updateClient = useMutation({
    mutationFn: ({ documentId, data }: UpdateClientParams) =>
      updateClientById(documentId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientById", variables.documentId],
      });
    },
  });

  return { uploadFiles, updateClient };
}
