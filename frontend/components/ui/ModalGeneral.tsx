import { useEffect } from "react";
import { CloseI } from "../icons/Icons";
import { styles } from "@/app/styles/styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title?: string;
  children: React.ReactNode;
  validator?: boolean;
  formId?: string;
}

export default function ModalGeneral({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  validator,
  formId,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 sm:p-6 overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-general-title"
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <h2
            id="modal-general-title"
            className="text-xl font-semibold text-gray-800 dark:text-gray-100"
          >
            {title || ""}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <CloseI className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 w-full h-full text-gray-800 dark:text-gray-200">
          {children}
        </div>
        {onSave && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end shrink-0 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form={formId}
              disabled={validator}
              className="px-8 py-3 text-indigo-600 hover:bg-indigo-100 rounded-xl font-medium"
            >
              {validator ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
