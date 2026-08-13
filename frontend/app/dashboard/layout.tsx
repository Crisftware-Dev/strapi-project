import HeaderControl from "@/components/pages/header-control";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchUser } from "@/lib/endpoint-api";

export async function generateMetadata(): Promise<Metadata> {
  let name = "";
  try {
    const user = await fetchUser();
    if (user.fullname) name = `, ${user.fullname}`;
  } catch {}
  return {
    title: { absolute: `Hola${name} | Dashboard` },
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
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <HeaderControl />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </Providers>
  );
}
