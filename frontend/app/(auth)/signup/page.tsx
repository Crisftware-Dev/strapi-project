import type { Metadata } from "next";
import { SignupForm } from "@/components/pages/sing-up-form";
import { noIndexMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Crear cuenta",
    description: "Regístrate para gestionar tus clientes de manera eficiente.",
    ...noIndexMeta,
  };
}

export default function SignUpRoute() {
  return <SignupForm />;
}
