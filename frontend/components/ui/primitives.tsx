import * as React from "react";

import { cn } from "@/lib/utils";

// ─── Select ───────────────────────────────────────────────────────────────────

export function Select({
  className,
  value,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      value={value === null ? "" : value}
      className={cn(
        "w-full p-0 text-xs focus:ring-0 dark:text-gray-200 cursor-pointer border-none dark:border-indigo-800 rounded px-2 py-1 h-6 bg-indigo-100/30 font-semibold text-indigo-800",
        className,
      )}
      {...props}
    >
      {props.children}
    </select>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

export function Separator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="separator"
      className={cn(
        "w-[2px] h-5 bg-indigo-100 dark:bg-indigo-900/30 mx-2",
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}
