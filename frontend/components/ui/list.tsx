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
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors whitespace-nowrap",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-1 w-full focus:outline-none cursor-pointer"
        >
          {children}
          {label && <span>{label}</span>}
        </button>
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
