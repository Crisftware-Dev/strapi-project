"use client";

import { useEffect, useRef, useState } from "react";
import { FileItem } from "@/types/typesDB";
import { styles } from "@/app/styles/styles";
import { Button } from "./button";
import { Select } from "./primitives";
import { DeleteI } from "../icons/Icons";
import { CompactTable, Headers, PaymentRow } from "./compact-table";
import { STRAPI_BASE_URL } from "@/lib/login-register";

export const Files: FileItem[] = [
  { name: "-- Selecciona una opción --", filename: "" },
  { name: "CONTRATO FIRMADO", filename: "CONTRATO_FIRMADO.pdf" },
  { name: "AUTORIZACION DEBITO", filename: "AUTORIZACION_DEBITO.pdf" },
  { name: "AUDIO DE APROBACION", filename: "AUDIO_DE_APROBACION.mp3" },
  { name: "AUDIO DE UPGRADE", filename: "AUDIO_DE_UPGRADE.mp3" },
  { name: "ARCHIVO DE UPGRADE", filename: "ARCHIVO_DE_UPGRADE.pdf" },
  { name: "CONTRATO CAMARAS", filename: "CONTRATO_CAMARAS.pdf" },
  { name: "AUDIO CAMARAS", filename: "AUDIO_CAMARAS.mp3" },
  {
    name: "CONTRATO FACTURACION ELECTRONICA",
    filename: "CONTRATO_FACTURACION_ELECTRONICA.pdf",
  },
  {
    name: "AUDIO FACTURACION ELECTRONICA",
    filename: "AUDIO_FACTURACION_ELECTRONICA.mp3",
  },
  {
    name: "FINALIZACION DE CONTRATO",
    filename: "FINALIZACION_DE_CONTRATO.pdf",
  },
  { name: "BURO CREDITICIO", filename: "BURO_CREDITICIO.pdf" },
  { name: "CAMBIO DE TITULARIDAD", filename: "CAMBIO_DE_TITULARIDAD.pdf" },
  { name: "SUSPENSION TEMPORAL", filename: "SUSPENSION_TEMPORAL.pdf" },
  { name: "ARCHIVO DE RETENCION", filename: "ARCHIVO_DE_RETENCION.pdf" },
  {
    name: "AUDIO RENOVACION DE CONTRATO",
    filename: "AUDIO_RENOVACION_DE_CONTRATO.mp3",
  },
  {
    name: "ARCHIVO DE RENOVACION DE CONTRATO",
    filename: "ARCHIVO_DE_RENOVACION_DE_CONTRATO.pdf",
  },
  { name: "AUDIO DE RETENCION", filename: "AUDIO_DE_RETENCION.mp3" },
  { name: "ARCHIVO DE RETENCION", filename: "ARCHIVO_DE_RETENCION.pdf" },
  { name: "VALIDACION DE DEBITO", filename: "VALIDACION_DE_DEBITO.pdf" },
  { name: "STREAMING AUDIO", filename: "STREAMING_AUDIO.mp3" },
  { name: "CONTRATO STREAMING", filename: "CONTRATO_STREAMING.pdf" },
  { name: "CONTRATO ZONA MESH", filename: "CONTRATO_ZONA_MESH.pdf" },
  { name: "AUDIO ZONA MESH", filename: "AUDIO_ZONA_MESH.mp3" },
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return "El archivo excede el tamaño máximo de 5 MB.";
  }
  return null;
}

function getFileViewUrl(fileItem: FileItem): string | null {
  if (fileItem.pendingFile) {
    return URL.createObjectURL(fileItem.pendingFile);
  }
  const media = fileItem.file?.[0];
  if (media?.url) {
    return media.url.startsWith("/")
      ? `${STRAPI_BASE_URL}${media.url}`
      : media.url;
  }
  return null;
}

interface FileUploaderProps {
  files: FileItem[];
  onFilesChange: (updater: (prev: FileItem[]) => FileItem[]) => void;
  isEditing?: boolean;
  filesList?: FileItem[];
  className?: string;
}

export default function FileUploader({
  files,
  onFilesChange,
  isEditing = true,
  filesList = Files,
  className,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const handleLoadFile = (fileItem: FileItem) => {
    if (!fileItem || !isEditing) return;

    const input = document.createElement("input");
    input.type = "file";

    if (fileItem?.filename?.endsWith(".pdf")) {
      input.accept = "application/pdf";
    } else {
      input.accept = "audio/mp3,audio/mpeg,.mp3,.wav";
    }

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const error = validateFile(file);
        if (error) {
          setValidationError(error);
          return;
        }
        setValidationError(null);

        const renamedFile = new File([file], fileItem.name, {
          type: file.type,
          lastModified: file.lastModified,
        });

        onFilesChange((prev) => {
          const filtered = prev.filter((f) => f.name !== fileItem.name);
          return [
            ...filtered,
            {
              name: fileItem.name,
              filename: fileItem.filename,
              pendingFile: renamedFile,
            },
          ];
        });
      }
    };

    input.click();
  };

  const handleRemoveFile = (index: number) => {
    onFilesChange((prev) => prev.filter((_, i) => i !== index));
    if (viewingIndex === index) {
      setViewingIndex(null);
      setPreviewUrl(null);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    }
  };

  const handleToggleView = (index: number) => {
    if (viewingIndex === index) {
      setViewingIndex(null);
      setPreviewUrl(null);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    } else {
      const file = files[index];
      const url = file ? getFileViewUrl(file) : null;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setPreviewUrl(url);
      if (url && url.startsWith("blob:")) {
        blobUrlRef.current = url;
      }
      setViewingIndex(index);
    }
  };

  return (
    <div className={`p-4 flex flex-col gap-3 ${className ?? ""}`}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Subir Archivos
        </label>
        <div className="flex gap-2">
          <Select
            onChange={(e) => {
              setValidationError(null);
              setSelectedFile(
                filesList.find((file) => file.name === e.target.value) || null,
              );
            }}
          >
            {filesList.map((file, index) => (
              <option key={index} value={file.name}>
                {file.name}
              </option>
            ))}
          </Select>
          <Button
            className={styles.uploadButton}
            onClick={() => handleLoadFile(selectedFile!)}
            disabled={!isEditing}
          >
            CARGAR
          </Button>
        </div>
        {validationError && (
          <p className="text-xs text-red-500 mt-1">{validationError}</p>
        )}
      </div>

      <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-lg bg-white dark:bg-gray-950 flex-1 overflow-hidden shadow-sm flex flex-col min-h-80">
        <CompactTable className="w-full text-left" gridCols="5fr 1fr 2fr">
          <Headers
            className="h-10 sticky top-0 bg-indigo-50/50 dark:bg-indigo-900/20 z-10"
            headers={["Archivo", "Tipo", "Opción"]}
          />
          <div className="contents">
            {files.map((file, index) => {
              const isPdf = file.filename?.endsWith(".pdf");
              const isAudio =
                file.filename?.endsWith(".mp3") ||
                file.filename?.endsWith(".wav");
              const viewUrl = viewingIndex === index ? previewUrl : null;
              // const viewUrl =
              //   viewingIndex === index ? getFileViewUrl(file) : null;

              return (
                <PaymentRow
                  className="col-span-3 h-10 align-top border-b border-gray-100 dark:border-gray-800 last:border-none"
                  key={file.documentId || `file-${index}`}
                  cells={[
                    `${isPdf ? "📄" : "🎵"} ${file.name}`,
                    `${isPdf ? "PDF" : isAudio ? "AUDIO" : "OTRO"}`,
                    <div
                      key={`actions-${index}`}
                      className="flex justify-center gap-2"
                    >
                      <Button
                        className="px-2 py-0.5 text-xs bg-white hover:bg-red-50 border border-red-200 text-red-400 hover:text-red-600 hover:border-red-300 rounded-lg transition-all duration-200"
                        onClick={() => handleRemoveFile(index)}
                        disabled={!isEditing}
                      >
                        <DeleteI className="w-2 h-2" />
                      </Button>
                      <Button
                        className="px-2 py-0.5 text-xs bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-400 hover:text-indigo-600 hover:border-indigo-300 rounded-lg transition-all duration-200"
                        onClick={() => handleToggleView(index)}
                      >
                        {viewingIndex === index ? "Cerrar" : "Ver"}
                      </Button>
                      {viewUrl &&
                        (isPdf ? (
                          <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`pdf-dialog-${index}`}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                          >
                            <div className="bg-white dark:bg-gray-900 w-11/12 max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                              <div className="flex justify-between items-center p-3 px-4 border-b border-gray-200 dark:border-gray-800 relative z-10 bg-white dark:bg-gray-900">
                                <span
                                  id={`pdf-dialog-${index}`}
                                  className="font-semibold truncate"
                                >
                                  {file.name}
                                </span>
                                <Button
                                  onClick={() => handleToggleView(index)}
                                  variant="outline"
                                  className="py-1 h-auto"
                                >
                                  Cerrar
                                </Button>
                              </div>
                              <div className="flex-1 w-full relative bg-gray-100 dark:bg-gray-950">
                                <iframe
                                  src={`${viewUrl}#zoom=100`}
                                  className="absolute inset-0 w-full h-full border-none"
                                  title={`Preview ${file.name}`}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`audio-dialog-${index}`}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                          >
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl flex flex-col gap-5 items-center w-full max-w-sm">
                              <h3
                                id={`audio-dialog-${index}`}
                                className="font-semibold text-lg text-center"
                              >
                                {file.name}
                              </h3>
                              <div className="w-full bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex justify-center">
                                <audio
                                  controls
                                  src={viewUrl}
                                  autoPlay
                                  className="w-full"
                                />
                              </div>
                              <Button
                                onClick={() => handleToggleView(index)}
                                variant="outline"
                                className="w-full"
                              >
                                Cerrar Vista Previa
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>,
                  ]}
                />
              );
            })}
          </div>
        </CompactTable>
      </div>
    </div>
  );
}
