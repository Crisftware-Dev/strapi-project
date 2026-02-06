"use client";

import HeaderSearch from "@/components/pages/dashboard/header-search";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import ClientsList from "@/components/ui/clients";

// const queryClient = new QueryClient();

export default function DashboardRoute() {
  return (
    // <QueryClientProvider client={queryClient}>
    // <ClientsList />
    // </QueryClientProvider>
    <>
      <HeaderSearch />
    </>
  );
}