import React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./search";
import { Button } from "./button";

interface CompactTableProps {
  children?: React.ReactNode;
  className?: string;
}

export interface PaymentRowData {
  no: number | string;
  obligacion: string;
  total: number;
  pagado: number;
  saldo: number;
  ref: string;
  noFactura: string;
  emitida: string;
  dsctos: number;
  detalle?: string;
  id?: string | number;
}

interface TableSearchHeaderProps {
  ariaLabel: string;
  type: string;
  id: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  children?: React.ReactNode;
}

const styles = {
  actionButton:
    "h-auto px-3 py-1 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/30 rounded text-[10px] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 transition-colors",
};

interface CompactTableProps {
  children?: React.ReactNode;
  className?: string;
  gridCols?: string;
}

export const CompactTable: React.FC<CompactTableProps> = ({
  children,
  className,
  gridCols,
}) => {
  return (
    <div
      className={cn("flex flex-col w-full", className)}
      style={gridCols ? { display: "grid", gridTemplateColumns: gridCols } : {}}
    >
      {children}
    </div>
  );
};

export function TableSearchHeader({
  ariaLabel,
  type,
  id,
  placeholder,
  value,
  onChange,
  onFocus,
  children,
  className,
}: TableSearchHeaderProps & { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30",
        className,
      )}
    >
      <div className="flex gap-1 p-1 w-full items-center">
        <SearchInput
          ariaLabel={ariaLabel}
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          className="flex-1"
        />
        <Button className={cn(styles.actionButton, "shrink-0")}>
          {children}
        </Button>
      </div>
    </div>
  );
}

export function Headers({ headers, className }: { headers: React.ReactNode[], className?: string }) {
  return (
    <div className={cn("grid grid-cols-subgrid col-span-full bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30", className)}>
      {headers.map((header, index) => (
        <div
          key={index}
          className={cn(
            "text-center font-bold text-[10px] text-indigo-900/60 dark:text-indigo-300/60 tracking-wider uppercase py-2 border-r border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center",
            index === headers.length - 1 && "border-r-0",
          )}
        >
          {header}
        </div>
      ))}
    </div>
  );
}

export function PaymentRow({ cells, className }: { cells: React.ReactNode[], className?: string }) {
  return (
    <div className={cn("grid grid-cols-subgrid col-span-full hover:bg-indigo-50/10 transition-colors border-b border-indigo-50 dark:border-indigo-900/20", className)}>
      {cells.map((cell, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-center text-center text-xs border-r border-indigo-100 dark:border-indigo-900/30",
            index === cells.length - 1 && "border-r-0",
          )}
        >
          {cell}
        </div>
      ))}
    </div>
  );
}
