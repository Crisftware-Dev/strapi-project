import React from "react";
import { ClientDataRow } from "./client-data-row";
import { Input } from "./input";
import Select from "./select";
import { cn } from "@/lib/utils";

interface DataFieldProps {
  label: string;
  className?: string;
  rowClassName?: string;
}

export const DataInput: React.FC<
  DataFieldProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, rowClassName, className, ...props }) => (
  <ClientDataRow label={label} className={rowClassName}>
    <Input
      className={cn(
        "w-full bg-transparent border-none p-0 h-6 text-xs focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-700 dark:text-gray-200",
        className,
      )}
      {...props}
    />
  </ClientDataRow>
);

export const DataSelect: React.FC<
  DataFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ label, children, rowClassName, className, ...props }) => (
  <ClientDataRow label={label} className={rowClassName}>
    <Select className={className} {...props}>
      {children}
    </Select>
  </ClientDataRow>
);

export const DataToggle: React.FC<
  DataFieldProps & {
    isOn?: boolean;
    onToggle?: () => void;
    activeLabel?: string;
    inactiveLabel?: string;
    size?: "sm" | "md";
    children?: React.ReactNode;
  }
> = ({
  label,
  isOn,
  onToggle,
  activeLabel = "SI",
  inactiveLabel = "NO",
  size = "md",
  children,
  rowClassName,
}) => (
  <ClientDataRow label={label} className={rowClassName}>
    <div className="flex items-center gap-3">
      {children ? (
        children
      ) : (
        <span
          className={cn(
            "text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm border transition-colors",
            isOn
              ? "bg-green-100/80 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-400 border-gray-200",
          )}
        >
          {isOn ? activeLabel : inactiveLabel}
        </span>
      )}
      <div
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none cursor-pointer",
          isOn ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700",
          size === "sm" && "scale-75 origin-left",
        )}
      >
        <span
          className={cn(
            "inline-block h-3 w-3 transform rounded-full bg-white transition shadow-sm",
            isOn ? "translate-x-4" : "translate-x-1",
          )}
        />
      </div>
    </div>
  </ClientDataRow>
);

interface RadioOption {
  label: string;
  value: string;
}

export const DataRadioGroup: React.FC<
  DataFieldProps & {
    options: RadioOption[];
    value: string;
    onChange: (val: string) => void;
    name: string;
  }
> = ({ label, options, value, onChange, name, rowClassName }) => (
  <ClientDataRow label={label} className={rowClassName}>
    <div className="flex items-center gap-6">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <input
            type="radio"
            name={name}
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span
            className={cn(
              "text-[11px] transition-colors",
              value === opt.value
                ? "font-semibold text-indigo-600"
                : "text-gray-400 group-hover:text-gray-500",
            )}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  </ClientDataRow>
);
