"use client";

import { ControlProvider } from "@/contexts/control-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 2,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
        <ControlProvider>{children}</ControlProvider>
    </QueryClientProvider>
  );
}