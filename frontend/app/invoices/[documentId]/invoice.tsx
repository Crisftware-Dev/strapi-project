import { NextResponse } from "next/server";
import { fetchInvoiceById } from "@/lib/endpoint-api";
import { generateInvoicePdf } from "@/components/pdf/invoice-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
    if (!documentId) {
      return NextResponse.json(
        { error: "documentId requerido" },
        { status: 400 },
      );
    }

    const { data: invoice } = await fetchInvoiceById(documentId);
    const pdf = await generateInvoicePdf(invoice);
    const filename = `factura-${invoice.invoice_nro}.pdf`;

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdf.byteLength),
      },
    });
  } catch (error) {
    console.error("Error generando PDF de factura:", error);
    return NextResponse.json(
      { error: "No se pudo generar el PDF de la factura" },
      { status: 500 },
    );
  }
}