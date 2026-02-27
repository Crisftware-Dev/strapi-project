import React from "react";
import { cn } from "@/lib/utils";
import SearchInput from "./searchInput";
import { Button } from "./button";
import { DataToggle } from "./client-data-fields";

interface CompactTableProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableSearchHeaderProps {
  ariaLabel: string;
  type: string;
  id: string;
  placeholder: string;
  children?: React.ReactNode;
}

interface ServicioRow {
  title: string;
  corte?: number | string;          
  valor: number;
  esPrincipal: boolean;
  descuento: number;
  meses: number;
  id?: string | number;  
}

interface TwoColumnStatsProps {
  rows: ServicioRow[];
  onTogglePrincipal?: (id: string | number, nuevoValor: boolean) => void;
  onEliminar?: (id: string | number) => void;
  onAplicarDescuento?: (id: string | number) => void;
}

const styles = {
  actionButton:
    "h-auto px-3 py-1 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/30 rounded text-[10px] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 transition-colors",
};

export const CompactTable: React.FC<CompactTableProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {children}
    </div>
  );
};

export function TableSearchHeader({
  ariaLabel,
  type,
  id,
  placeholder,
  children,
}: TableSearchHeaderProps) {
  return (
    <div className="w-1/2 flex items-center">
      <div className="flex gap-1 p-1 w-full items-center">
        <SearchInput
          ariaLabel={ariaLabel}
          type={type}
          id={id}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button className={cn(styles.actionButton, "shrink-0")}>
          {children}
        </Button>
      </div>
    </div>
  );
}

export function Headers({ headers }: { headers: React.ReactNode[] }) {
  return (
    <div className="w-full flex items-center">
      {headers.map((header, index) => (
        <div
          key={index}
          className={cn(
            "flex-1 text-center font-bold text-[10px] text-indigo-900/60 dark:text-indigo-300/60 tracking-wider uppercase py-1",
            index === headers.length - 1 && "w-[120px] flex-none",
          )}
        >
          {header}
        </div>
      ))}
    </div>
  );
}


export function RowsStats({
  rows,
  onTogglePrincipal,
  onEliminar,
  onAplicarDescuento,
}: TwoColumnStatsProps) {
  return (
    <div className="divide-y divide-indigo-50 dark:divide-indigo-900/20">
      {rows.map((row, idx) => (
        <div
          key={row.id ?? idx}
          className="flex w-full items-center hover:bg-indigo-50/10 transition-colors"
        >
          <div className="w-1/2 px-3 py-2.5 text-xs font-medium text-indigo-900 dark:text-indigo-200">
            {row.title}
            {row.corte !== undefined && (
              <span className="text-gray-500 font-normal ml-1.5">
                / corte {row.corte}
              </span>
            )}
          </div>
          <div className="w-1/2 flex items-center">
            <div className="flex-1 text-center text-xs font-mono py-2.5">
              {row.valor.toFixed(2)}
            </div>
            <div className="flex-1 flex justify-center py-2.5">
              <DataToggle
                label=""
                isOn={row.esPrincipal}
                onToggle={() =>
                  onTogglePrincipal?.(row.id ?? idx, !row.esPrincipal)
                }
              />
            </div>

            <div className="flex-1 text-center text-xs text-gray-500 py-2.5">
              {row.descuento.toFixed(2)}
            </div>

            <div className="flex-1 text-center text-xs text-gray-500 py-2.5">
              {row.meses}
            </div>
            <div className="w-[140px] flex-none flex justify-center gap-2 py-2.5 px-2">
              <button
                onClick={() => onEliminar?.(row.id ?? idx)}
                className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded"
              >
                Elim.
              </button>
              <button
                onClick={() => onAplicarDescuento?.(row.id ?? idx)}
                className="px-2.5 py-1 text-xs text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded"
              >
                $ Desc.
              </button>
            </div>
          </div>
        </div>
      ))}

      {rows.length === 0 && (
        <div className="p-10 text-center text-gray-400 italic text-sm">
          No hay servicios agregados
        </div>
      )}
    </div>
  );
}
