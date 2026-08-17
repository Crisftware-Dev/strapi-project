import { FaSearch } from "react-icons/fa";
import { Input } from "./input";
import { Client, Plan } from "@/types/typesDB";
import { Li } from "./list";
import { Ul } from "./list";

// ─── SearchInput ──────────────────────────────────────────────────────────────

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ariaLabel: string;
}

const inputStyles = {
  searchField: "relative flex w-full sm:w-64 lg:w-72 min-w-70",
  input:
    "flex-1 h-6 px-3 text-xs placeholder:text-xs text-center bg-gray-50/70 dark:bg-gray-900/70 shadow-none focus-visible:ring-1 focus-visible:ring-offset-0 border-none outline-none rounded-l-none",
  searchButton:
    "h-6 px-3 text-black-400/80 text-xs border-r border-gray-300 dark:border-gray-700 cursor-pointer flex items-center justify-center bg-gray-50/70 dark:bg-gray-900/70 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors rounded-l",
  icon: "text-indigo-500 dark:text-indigo-400",
};

export function SearchInput({
  ariaLabel,
  className,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const handleButtonClick = () => {
    if (onKeyDown) {
      // Simulate Enter key press
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });
      onKeyDown(enterEvent as unknown as React.KeyboardEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`${inputStyles.searchField} ${className || ""}`}>
      <button
        aria-label={ariaLabel}
        className={inputStyles.searchButton}
        type="button"
        onClick={handleButtonClick}
      >
        <FaSearch className={inputStyles.icon} aria-hidden="true" />
      </button>
      <Input
        {...props}
        onKeyDown={onKeyDown}
        className={inputStyles.input}
        autoComplete="off"
      />
    </div>
  );
}

// ─── SearchNames ──────────────────────────────────────────────────────────────

interface SearchNamesProps {
  showError: boolean;
  errorMessage: string;
  nameResults: Client[];
  isLoading: boolean;
  handleClientSelect: (client: Client) => void;
}

export function SearchNames({
  showError,
  errorMessage,
  nameResults,
  isLoading,
  handleClientSelect,
}: SearchNamesProps) {
  return (
    <div className="absolute left-72 w-82 z-100 top-15">
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

// ─── SearchPlans ──────────────────────────────────────────────────────────────

interface SearchPlansProps {
  plansResults: Plan[];
  handleAddPlan: (plan: Plan) => void;
}

export function SearchPlans({ plansResults, handleAddPlan }: SearchPlansProps) {
  return (
    <div className="absolute left-0 w-auto z-100 top-20">
      <div className="mt-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm max-h-64 overflow-y-auto">
        <Ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {plansResults.map((plan) => (
            <Li
              key={plan.documentId}
              onClick={() => handleAddPlan(plan)}
              className="px-3 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {plan.plan}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tipo: {plan.type} • Corte: {plan.cut}
                </p>
              </div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                ${plan.valor}
              </div>
            </Li>
          ))}
        </Ul>
      </div>
    </div>
  );
}
