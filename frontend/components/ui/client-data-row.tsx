import React from "react";
import { cn } from "@/lib/utils";

interface ClientDataRowProps {
  label: string;
  children?: React.ReactNode;
  value?: string | number;
  className?: string;
  readOnly?: boolean;
}

export const ClientDataRow: React.FC<ClientDataRowProps> = ({
  label,
  children,
  value,
  className,
  readOnly,
}) => {
  return (
    <div
      className={cn(
        "flex border-b border-indigo-100 dark:border-indigo-900/30 min-h-[32px] hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors",
        className,
      )}
    >
      {label && label.trim() !== "" && (
        <div className="w-32 px-3 py-1.5 text-[11px] font-semibold text-indigo-900/70 dark:text-indigo-300/70 flex items-center bg-indigo-50/50 dark:bg-indigo-950/30 border-r border-indigo-100 dark:border-indigo-900/30 shrink-0 uppercase tracking-wide">
          {label}
        </div>
      )}
      <div className="flex-1 px-3 py-1.5 flex items-center relative text-xs">
        {children ? (
          children
        ) : (
          <input
            type="text"
            className={cn(
              "w-full bg-transparent border-none p-0 h-6 text-xs focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-700 dark:text-gray-300",
              readOnly &&
                "cursor-default text-gray-500 dark:text-gray-500 font-medium",
            )}
            value={value}
            readOnly={readOnly}
            disabled={readOnly}
          />
        )}
      </div>
    </div>
  );
};
