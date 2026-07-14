import * as React from "react";

import { cn } from "@/lib/utils";

export function Ul({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="ul"
      className={cn("rounded whitespace-nowrap", className)}
      {...props}
    >
      {props.children}
    </ul>
  );
}

export function Li({
  className,
  label,
  ...props
}: React.ComponentProps<"li"> & { label?: string }) {
  return (
    <li
      data-slot="li"
      className={cn(
        "flex items-center gap-1 px-2 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {props.children}
      {label && <span>{label}</span>}
    </li>
  );
}
