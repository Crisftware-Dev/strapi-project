import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { Invoice } from "@/types/invoice";
import { STRAPI_BASE_URL } from "@/lib/login-register";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_POPULATE = [
  "populate[cliente][fields][0]=nombres",
  "populate[cliente][fields][1]=apellidos",
  "populate[cliente][fields][2]=identificacion",
  "populate[cliente][fields][3]=email",
  "populate[cliente][fields][4]=ciudad",
  "populate[pdf]=true",
].join("&");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;

  if (!documentId) {
    return new Response("El documentId es requerido", { status: 400 });
  }

  const disposition =
    new URL(request.url).searchParams.get("download") === "1"
      ? "attachment"
      : "inline";

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    const upstream = await fetch(
      `${STRAPI_BASE_URL}/api/invoices/${documentId}?${PDF_POPULATE}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      },
    );

    if (!upstream.ok) {
      const status = upstream.status === 404 ? 404 : 502;
      return new Response("No se pudo obtener la factura", { status });
    }

    const { data } = (await upstream.json()) as { data: Invoice };

    if (!data?.pdf?.url) {
      return new Response("La factura no tiene un PDF adjunto", {
        status: 404,
      });
    }

    const pdfUrl = data.pdf.url.startsWith("http")
      ? data.pdf.url
      : `${STRAPI_BASE_URL}${data.pdf.url}`;

    const pdfResponse = await fetch(pdfUrl, { cache: "no-store" });
    if (!pdfResponse.ok) {
      return new Response("No se pudo obtener el PDF desde el servidor", {
        status: 502,
      });
    }

    const buffer = await pdfResponse.arrayBuffer();
    const filename = data.pdf.name || `factura-${data.invoice_nro}.pdf`;

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Error al obtener el PDF de la factura", {
      status: 500,
    });
  }
}
