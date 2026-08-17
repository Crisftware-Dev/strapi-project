import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { getLoginPageCached } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const DEFAULT_TITLE = "Sistema de Gestión de Clientes";
const DEFAULT_DESCRIPTION =
  "Gestione sus clientes de manera eficiente y sencilla con Strapi.";

export async function generateMetadata(): Promise<Metadata> {
  const strapiData = await getLoginPageCached();
  const title = strapiData?.title ?? DEFAULT_TITLE;
  const description = strapiData?.description ?? DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
    title: {
      default: title,
      template: title,
    },
    description,
    keywords: ["Gestión", "Clientes", "CRM", "Strapi", "Next.js"],
    authors: [{ name: "CJZN" }],
    creator: "CJZN",
    publisher: "CJZN",
    openGraph: {
      title,
      description,
      url: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
      siteName: DEFAULT_TITLE,
      locale: "es_ES",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: DEFAULT_TITLE,
          type: "image/svg+xml",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.svg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} antialiased`}
    >
      <head>
        {/* Script anti-flash: aplica .dark ANTES de que React hidrate */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var t = localStorage.getItem('app-theme');
    if (!t) {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {}
})();
            `.trim(),
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sistema de Gestión de Clientes",
              url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
              logo: "https://your-logo-url.com/logo.png",
              sameAs: [
                "https://facebook.com/your-profile",
                "https://twitter.com/your-profile",
                "https://instagram.com/your-profile",
              ],
            }),
          }}
        />
        <ThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
