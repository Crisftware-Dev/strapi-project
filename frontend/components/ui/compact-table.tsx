import React from "react";
import { cn } from "@/lib/utils";

interface CompactTableProps {
  leftHeaderElement?: React.ReactNode;
  headers: React.ReactNode[];
  rows: {
    title: React.ReactNode;
    cells: React.ReactNode[];
  }[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export const CompactTable: React.FC<CompactTableProps> = ({
  leftHeaderElement,
  headers,
  rows,
  className,
  headerClassName,
  rowClassName,
}) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* Header / Search Area */}
      <section
        className={cn(
          "w-full flex bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30",
          headerClassName,
        )}
      >
        <div className="w-1/2 flex items-center">{leftHeaderElement}</div>
        <div className="w-1/2 flex items-center">
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
      </section>

      {/* Data Area */}
      <div className="w-full">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "flex w-full items-center border-b border-indigo-50 dark:border-indigo-900/20 hover:bg-indigo-50/20 transition-colors",
              rowClassName,
            )}
          >
            <div className="w-1/2 px-3 py-2 text-xs font-medium text-indigo-900 dark:text-indigo-200 truncate">
              {row.title}
            </div>
            <div className="w-1/2 flex items-center">
              {row.cells.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={cn(
                    "flex-1 text-center text-xs py-2 px-1",
                    cellIndex === row.cells.length - 1 && "w-[120px] flex-none",
                  )}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="p-8 text-center text-gray-400 italic text-[11px]">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
};
