import { cn } from "@/lib/utils";
import type { ReactNode, MouseEvent } from "react";

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

interface LiProps {
  className?: string;
  label?: string;
  id?: string;
  onClick?: (e: MouseEvent) => void;
  children?: ReactNode;
}

export function Li({ className, label, id, onClick, children }: LiProps) {
  if (onClick) {
    return (
      <li
        id={id}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e as unknown as MouseEvent);
          }
        }}
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          className,
        )}
      >
        {children}
        {label && <span>{label}</span>}
      </li>
    );
  }

  return (
    <li
      id={id}
      className={cn(
        "flex items-center gap-1 px-2 py-1.5 whitespace-nowrap",
        className,
      )}
    >
      {children}
      {label && <span>{label}</span>}
    </li>
  );
}
