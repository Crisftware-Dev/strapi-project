"use client";

import { ClientProvider } from "@/contexts/client-context";
import { ControlProvider } from "@/contexts/control-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [clientById] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={clientById}>
      <ClientProvider>
        <ControlProvider>{children}</ControlProvider>
      </ClientProvider>
    </QueryClientProvider>
  );
}
