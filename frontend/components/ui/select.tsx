import * as React from "react";

import { cn } from "@/lib/utils";

export default function Select({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
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