'use client';

import { Client } from "@/types/typeClients";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultados: Client[];
  handleClientSelect: (item: Client) => void;
}

export default function ModalIdentificator({ isOpen, onClose, resultados, handleClientSelect }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">El cliente tiene varios contratos</h2>
        </div>

        <div className="overflow-auto flex-1 p-4 space-y-2">
          {resultados.map((client) => (
            <button
              key={client.documentId}
              onClick={() => handleClientSelect(client)}
              className="w-full cursor-pointer text-left p-5 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-center">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Contrato</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {client.contrato}
                  </span>
                </div>
                {client.nombres && (
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Nombres completos</span>
                    <span className="text-gray-800 font-medium text-base">
                      {client.nombres} {client.apellidos}
                    </span>
                  </div>
                )}
                {client.estado && (
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Estado</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                      client.estado.toLowerCase().includes('activ')
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : client.estado.toLowerCase().includes('inactiv')
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : client.estado.toLowerCase().includes('suspend')
                        ? 'bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      {client.estado}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}