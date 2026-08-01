import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/contexts/theme-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: {
    default: "Sistema de Gestión de Clientes",
    template: "%s | Sistema de Gestión de Clientes",
  },
  description:
    "Gestione sus clientes de manera eficiente y sencilla con Strapi.",
  keywords: ["Gestión", "Clientes", "CRM", "Strapi", "Next.js"],
  authors: [{ name: "CJZN" }],
  creator: "CJZN",
  publisher: "CJZN",
  openGraph: {
    title: "Sistema de Gestión de Clientes",
    description:
      "Gestione sus clientes de manera eficiente y sencilla con Strapi.",
    url: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
    siteName: "Sistema de Gestión de Clientes",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Gestión de Clientes",
    description:
      "Gestione sus clientes de manera eficiente y sencilla con Strapi.",
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
