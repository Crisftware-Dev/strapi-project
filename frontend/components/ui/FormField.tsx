import { ReactNode } from "react";

// ─── Clase base reutilizable (mismo estilo visual que AddPlans) ───────────────

const INPUT_BASE =
  "px-3 py-1.5 text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all";

const LABEL_BASE =
  "text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  as?: "input";
  label: string;
  name: string;
  icon?: ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  children?: never;
};

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> & {
  as: "select";
  label: string;
  name: string;
  icon?: ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  children: ReactNode;
};

type FormFieldProps = InputProps | SelectProps;

// ─── Componente ───────────────────────────────────────────────────────────────

export default function FormField(props: FormFieldProps) {
  const { label, name, icon, as = "input", children, onChange, ...rest } = props;

  const wrapperClass = icon ? "relative" : undefined;
  const inputClass = `${INPUT_BASE} ${icon ? "pl-8" : ""} ${rest.className ?? ""}`.trim();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={LABEL_BASE}>
        {label}
      </label>

      <div className={wrapperClass}>
        {icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}

        {as === "select" ? (
          <select
            id={name}
            name={name}
            className={inputClass}
            onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
            {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            className={`w-full ${inputClass}`}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    </div>
  );
}
