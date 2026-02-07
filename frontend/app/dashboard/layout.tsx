import HeaderControl from "@/components/pages/dashboard/header-control";
import { fetchUser } from "@/lib/api";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let user = null;

  try {
    user = await fetchUser();
  } catch (err) {
    console.error("Error fetching user in dashboard layout:", err);
  }

  return (
    <>
      <HeaderControl initialUser={user} />
      <main>{children}</main>
    </>
  );
}