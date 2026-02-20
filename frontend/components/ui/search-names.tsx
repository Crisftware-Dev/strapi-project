import { Client } from "@/types/typeClients";
import { Li } from "./li";
import { Ul } from "./ul";

interface SearchNamesProps {
  showError: boolean;
  errorMessage: string;
  nameResults: Client[];
  isLoading: boolean;
  handleClientSelect: (client: Client) => void;
}

export default function SearchNames({
  showError,
  errorMessage,
  nameResults,
  isLoading,
  handleClientSelect,
}: SearchNamesProps) {
  return (
    <div className="absolute left-72 w-82 top-15">
      {showError && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center animate-in fade-in">
          <p className="text-sm text-red-800 dark:text-red-200">
            {errorMessage}
          </p>
        </div>
      )}

      {nameResults.length > 0 && (
        <div className="mt-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm max-h-64 overflow-y-auto">
          <Ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {nameResults.map((client) => (
              <Li
                key={client.documentId}
                onClick={() => handleClientSelect(client)}
                className="px-3 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {client.apellidos} {client.nombres}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {client.identificacion} • Contrato: {client.contrato}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {client.ciudad}
                  </div>
                </div>
              </Li>
            ))}
          </Ul>
        </div>
      )}

      {isLoading && (
        <div className="mt-3 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Cargando clientes...
          </p>
        </div>
      )}
    </div>
  );
}
