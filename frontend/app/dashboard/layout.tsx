import HeaderControl from "@/components/pages/header-control";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel de control para la gestión de clientes.",
  robots: {
    index: false,
    follow: false,
  },
};

import Providers from "@/components/providers/query-provider";
import FooterControl from "@/components/pages/FooterControl";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <HeaderControl />
        <main className="flex-1 flex flex-col">{children}</main>
        <FooterControl />
      </div>
    </Providers>
  );
}
