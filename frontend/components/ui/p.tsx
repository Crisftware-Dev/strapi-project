import * as React from "react";
import { cn } from "@/lib/utils";

const P = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "flex items-center h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs dark:bg-input/30 md:text-base font-medium text-foreground overflow-hidden whitespace-nowrap text-ellipsis",
        className
      )}
      {...props}
    />
  );
});
P.displayName = "P";

export { P };
