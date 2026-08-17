import HeaderControl from "@/components/pages/header-control";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchUser } from "@/lib/endpoint-api";
import DashboardTitle from "@/components/pages/dashboard-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: "Dashboard | Sistema de Gestión de Clientes" },
    description: "Panel de control para la gestión de clientes.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

import Providers from "@/contexts/app-providers";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  let userName = "";
  try {
    const user = await fetchUser();
    if (user.fullname) userName = user.fullname;
  } catch {}

  return (
    <Providers>
      <DashboardTitle userName={userName} />
      <div className="flex flex-col min-h-screen">
        <HeaderControl />
        <main className="flex-1 flex flex-col">
          <h1 className="sr-only">Panel de Control</h1>
          {children}
        </main>
      </div>
    </Providers>
  );
}
