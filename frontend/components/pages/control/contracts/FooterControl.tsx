"use client";

import { Button } from "@/components/ui/button";
import { useClientContext } from "@/contexts/client-context";
import { useTabsControl } from "@/contexts/control-context";
import { useClientById } from "@/hooks/useClientById";
import { useUpdateClient } from "@/hooks/useUpdateClient";


export default function FooterControl() {
  const {
    selectedClientId,
    isEditing,
    setIsEditing,
    formData,
    resetFormData,
    isValidToSave,
    validationError,
    notification,
  } = useClientContext();

  const { setActiveSubControls, openTab } = useTabsControl();

  const { data: client } = useClientById(selectedClientId || "");
  const { updateClient, uploadFiles } = useUpdateClient();

  const handleEdit = () => {
    if (client) {
      resetFormData(client);
      setIsEditing(true);
    }
  };

  /**
   * Save flow:
   * 1. Upload any pending files (pendingFile) to /api/upload
   * 2. Map uploaded media IDs back to the file component entries
   * 3. Update the client with all data including file references
   */
  const handleSave = async () => {
    if (!selectedClientId) return;

    const dataToSave = { ...formData };
    const currentFiles = [...(dataToSave.files || [])];

    // Step 1: Upload pending files
    const pendingFiles = currentFiles.filter((f) => f.pendingFile);

    if (pendingFiles.length > 0) {
      const uploadFormData = new FormData();
      pendingFiles.forEach((f) => {
        if (f.pendingFile) {
          uploadFormData.append("files", f.pendingFile);
        }
      });

      try {
        const uploadedMedia = await uploadFiles.mutateAsync(uploadFormData);

        // Step 2: Map uploaded media back to their corresponding file entries
        let uploadIdx = 0;
        dataToSave.files = currentFiles.map((f) => {
          if (f.pendingFile && uploadIdx < uploadedMedia.length) {
            const media = uploadedMedia[uploadIdx++];
            return {
              name: f.name,
              filename: f.filename,
              file: [media],
              pendingFile: undefined,
            };
          }
          return f;
        });
      } catch (error) {
        console.error("Error uploading files:", error);
        return; // Abort save if upload fails
      }
    }

    // Step 3: Update client with all data
    updateClient.mutate(
      { documentId: selectedClientId, data: dataToSave },
      { onSuccess: () => resetFormData(undefined) },
    );
  };

  const handleCancel = () => {
    resetFormData(client ?? undefined);
  };

  const hasClient = !!selectedClientId;
  const isSaving = updateClient.isPending || uploadFiles.isPending;


  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-indigo-100 dark:border-indigo-900/30 p-3 shadow-sm mt-auto">
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-7xl mx-auto">
        {isEditing ? (
          <>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isSaving || !isValidToSave}
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant={"outline"}
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-6"
              disabled
            >
              Guardar
            </Button>
            <Button
              variant={"outline"}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              onClick={handleEdit}
              disabled={!hasClient}
            >
              Editar
            </Button>
          </>
        )}
        <Button
          variant={"outline"}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
          onClick={() => {
            setActiveSubControls("new-client");
            openTab("new-client", "Nuevo Cliente");
          }}
        >
          Nuevo
        </Button>
        <Button
          variant={"outline"}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
        >
          + Añadir
        </Button>
        <Button
          variant={"outline"}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
        >
          Liberar
        </Button>
        <Button
          variant={"outline"}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
        >
          RE-ENVIAR PIN
        </Button>
        <Button
          variant={"outline"}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
        >
          Hist de Planes
        </Button>
        <Button
          variant={"outline"}
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
        >
          Enviar Contrato
        </Button>

        {notification && (
          <p className="w-full text-center text-xs text-red-600 mt-1 flex-1 basis-full font-medium">
            {notification}
          </p>
        )}
        {(updateClient.isError || uploadFiles.isError) && (
          <p className="w-full text-center text-xs text-red-500 mt-1 flex-1 basis-full">
            {uploadFiles.isError
              ? "Error al subir archivos. Intente nuevamente."
              : "Error al guardar. Intente nuevamente."}
          </p>
        )}
        {validationError && isEditing && (
          <p className="w-full text-center text-xs text-amber-600 mt-1 flex-1 basis-full font-medium">
            ⚠ {validationError}
          </p>
        )}
      </div>
    </footer>
  );
}
