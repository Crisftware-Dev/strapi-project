import type { Metadata } from "next";
import ThemeToggle from "@/components/ui/theme-toggle";
import { getLoginPageCached, noIndexMeta } from "@/lib/seo";
import { DescSection } from "@/components/ui/login-section";

export async function generateMetadata(): Promise<Metadata> {
  const strapiData = await getLoginPageCached();
  return {
    title: strapiData?.title ?? "Acceder",
    description: strapiData?.description,
    ...noIndexMeta,
  };
}


export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const strapiData = await getLoginPageCached();
  const [loginSection] = strapiData?.sections || [];

  const defaultIdentifier = process.env.USER_PRUEBA;
  const defaultPassword = process.env.PASSWORD_PRUEBA;

  return (
    <div className="relative flex min-h-screen flex-col lg:h-screen lg:flex-row">
      {/* Hero — 2/3 en desktop, arriba en móvil */}
      <div className="lg:w-2/3">
        <DescSection
          data={loginSection}
          className="h-[45vh] min-h-75 lg:h-full lg:min-h-0 lg:max-h-none"
          defaultIdentifier={defaultIdentifier}
          defaultPassword={defaultPassword}
        />
      </div>
      {/* Formulario — 1/3 en desktop, abajo en móvil */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:w-1/3 lg:overflow-y-auto lg:px-8">
        <main className="w-full max-w-md">{children}</main>
      </div>
      {/* Botón de tema flotante — accesible desde login/register */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle variant="icon" />
      </div>
    </div>
  );
}
