/**
 * Generación y adjuntado del PDF de la factura.
 *
 * El PDF se genera en el backend (no en el frontend) para cubrir las dos vías
 * de creación: la manual (POST /api/invoices) y la automática mensual
 * (createMonthlyInvoices -> strapi.documents().create).
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from './react-pdf';

const INVOICE_UID = 'api::invoice.invoice' as const;

const COMPANY_NAME = 'Crisftware-Dev';

interface InvoiceItem {
  description?: string;
  amount?: number;
  unit_price?: number;
}

interface InvoicePayment {
  amount?: number;
  payment_date?: string;
  payment_method?: string;
}

interface InvoicePersona {
  username?: string;
  fullname?: string;
  lastname?: string;
  identificacion?: string;
  email?: string;
  ciudad?: string;
}

export interface InvoicePdfData {
  documentId?: string;
  invoice_nro?: string;
  issue_date?: string;
  subtotal?: number;
  taxes?: number;
  total?: number;
  currency?: string;
  paid?: number;
  discounts?: number;
  detail?: string;
  issuer_data?: InvoicePersona | null;
  invoice_item?: InvoiceItem[];
  payments?: InvoicePayment[];
  cliente?: InvoicePersona | null;
}

const BRAND = {
  primary: '#0f766e',
  primaryDark: '#115e59',
  accent: '#f59e0b',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e7eb',
  tableHead: '#0f766e',
  tableRowAlt: '#f8fafc',
};

const round2 = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const formatCurrency = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date);
};

const itemSubtotal = (item: InvoiceItem) =>
  round2(Number(item.amount ?? 0) * Number(item.unit_price ?? 0));

const sumPayments = (payments?: InvoicePayment[]) =>
  round2((payments ?? []).reduce((acc, p) => acc + Number(p.amount ?? 0), 0));

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: BRAND.text,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: BRAND.primary,
    paddingBottom: 12,
    marginBottom: 16,
  },
  emisor: { maxWidth: 320 },
  emisorName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primaryDark,
    marginBottom: 4,
  },
  metaLine: { fontSize: 9, color: BRAND.muted, marginBottom: 1 },
  logo: { width: 90, height: 90, objectFit: 'contain' },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    color: BRAND.muted,
    fontSize: 9,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primary,
    letterSpacing: 1,
  },
  facturaNo: { fontSize: 10, color: BRAND.muted, marginTop: 2 },
  badges: { alignItems: 'flex-end' },
  badge: {
    backgroundColor: BRAND.accent,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  parties: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  partyBox: { width: '48%' },
  partyLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  partyLine: { fontSize: 9, color: BRAND.muted, marginBottom: 1 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BRAND.tableHead,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: 'row',
    fontSize: 9,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  tableRowAlt: { backgroundColor: BRAND.tableRowAlt },
  colDesc: { width: '50%', paddingRight: 8 },
  colQty: { width: '15%', textAlign: 'right', paddingRight: 8 },
  colPrice: { width: '17.5%', textAlign: 'right', paddingRight: 8 },
  colTotal: { width: '17.5%', textAlign: 'right' },
  totals: { alignItems: 'flex-end', marginTop: 14 },
  totalsBox: { width: 260 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    paddingVertical: 3,
  },
  totalLabel: { color: BRAND.muted },
  totalValue: { fontFamily: 'Helvetica-Bold' },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: BRAND.primary,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  section: { marginTop: 22 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.primaryDark,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.accent,
    paddingBottom: 4,
    marginBottom: 8,
  },
  payRow: {
    flexDirection: 'row',
    fontSize: 9,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  payRowAlt: { backgroundColor: BRAND.tableRowAlt },
  payDate: { width: '33%' },
  payMethod: { width: '34%' },
  payAmount: { width: '33%', textAlign: 'right' },
  methodChip: {
    backgroundColor: BRAND.primary,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  saldoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: BRAND.accent,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  notes: { fontSize: 9, color: BRAND.muted, lineHeight: 1.5 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    paddingTop: 8,
    fontSize: 8,
    color: BRAND.muted,
    textAlign: 'center',
  },
});

let cachedLogo: Buffer | null | undefined;

const getLogoPng = async (): Promise<Buffer | null> => {
  if (cachedLogo !== undefined) return cachedLogo;
  try {
    const svgPath = path.join(process.cwd(), 'public', 'crisftware-logo.svg');
    const svg = fs.readFileSync(svgPath);
    cachedLogo = await sharp(svg).resize(300, 300, { fit: 'contain' }).png().toBuffer();
  } catch (error) {
    cachedLogo = null;
  }
  return cachedLogo;
};

function InvoiceDocument({ data, logo }: { data: InvoicePdfData; logo: Buffer | null }) {
  const currency = data.currency ?? 'USD';
  const totalPagado = round2(Number(data.paid ?? sumPayments(data.payments)));
  const saldoPendiente = Math.max(round2(Number(data.total ?? 0)) - totalPagado, 0);

  const issuerName =
    data.issuer_data?.fullname || data.issuer_data?.username || COMPANY_NAME;

  const clientName =
    [data.cliente?.fullname, data.cliente?.lastname]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Cliente';

  const clientAddress = data.cliente?.ciudad;

  return (
    <Document title={`Factura ${data.invoice_nro ?? ''}`}>
      <Page size="A4" style={styles.page}>
        {/* Cabecera emisor + logo */}
        <View style={styles.header}>
          <View style={styles.emisor}>
            <Text style={styles.emisorName}>{issuerName}</Text>
            {data.issuer_data?.identificacion && (
              <Text style={styles.metaLine}>{data.issuer_data.identificacion}</Text>
            )}
            {data.issuer_data?.email && (
              <Text style={styles.metaLine}>{data.issuer_data.email}</Text>
            )}
          </View>
          {logo ? (
            <Image style={styles.logo} src={logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text>{COMPANY_NAME}</Text>
            </View>
          )}
        </View>

        {/* Título y número */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>FACTURA</Text>
            <Text style={styles.facturaNo}>No. {data.invoice_nro ?? '—'}</Text>
          </View>
          <View style={styles.badges}>
            <Text style={styles.badge}>{currency}</Text>
          </View>
        </View>

        {/* Cliente (dirección de facturación = dirección del cliente) y datos */}
        <View style={styles.parties}>
          <View style={styles.partyBox}>
            <Text style={styles.partyLabel}>Facturar a</Text>
            <Text style={styles.partyName}>{clientName}</Text>
            {data.cliente?.identificacion && (
              <Text style={styles.partyLine}>{data.cliente.identificacion}</Text>
            )}
            {clientAddress && (
              <Text style={styles.partyLine}>Dirección: {clientAddress}</Text>
            )}
            {data.cliente?.email && (
              <Text style={styles.partyLine}>{data.cliente.email}</Text>
            )}
          </View>
          <View style={styles.partyBox}>
            <Text style={styles.partyLabel}>Detalles</Text>
            <Text style={styles.partyLine}>Emisión: {formatDate(data.issue_date)}</Text>
            <Text style={styles.partyLine}>Moneda: {currency}</Text>
          </View>
        </View>

        {/* Ítems */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción</Text>
          <Text style={styles.colQty}>Cant.</Text>
          <Text style={styles.colPrice}>P. Unit.</Text>
          <Text style={styles.colTotal}>Subtotal</Text>
        </View>
        {(data.invoice_item ?? []).map((item, i) => (
          <View
            key={i}
            style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : undefined]}
          >
            <Text style={styles.colDesc}>{item.description ?? '—'}</Text>
            <Text style={styles.colQty}>{item.amount ?? 0}</Text>
            <Text style={styles.colPrice}>
              {formatCurrency(Number(item.unit_price ?? 0), currency)}
            </Text>
            <Text style={styles.colTotal}>
              {formatCurrency(itemSubtotal(item), currency)}
            </Text>
          </View>
        ))}

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(Number(data.subtotal ?? 0), currency)}
              </Text>
            </View>
            {typeof data.taxes === 'number' && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Impuestos</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(data.taxes, currency)}
                </Text>
              </View>
            )}
            <View style={styles.grandTotal}>
              <Text>TOTAL</Text>
              <Text>{formatCurrency(Number(data.total ?? 0), currency)}</Text>
            </View>
          </View>
        </View>

        {/* Pagos / Abonos parciales */}
        {data.payments && data.payments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagos / Abonos</Text>
            {data.payments.map((p, i) => (
              <View
                key={i}
                style={[styles.payRow, i % 2 === 1 ? styles.payRowAlt : undefined]}
              >
                <Text style={styles.payDate}>{formatDate(p.payment_date)}</Text>
                <Text style={styles.payMethod}>
                  <Text style={styles.methodChip}>
                    {p.payment_method ?? 'EFECTIVO'}
                  </Text>
                </Text>
                <Text style={styles.payAmount}>
                  {formatCurrency(Number(p.amount ?? 0), currency)}
                </Text>
              </View>
            ))}
            <View style={styles.saldoBox}>
              <Text>SALDO PENDIENTE</Text>
              <Text>{formatCurrency(saldoPendiente, currency)}</Text>
            </View>
          </View>
        )}

        {/* Notas */}
        {data.detail && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notes}>{data.detail}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>
            {issuerName} · {data.invoice_nro ?? ''} · Generado electrónicamente
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  const logo = await getLogoPng();
  return renderToBuffer(<InvoiceDocument data={data} logo={logo} />);
}

export async function attachInvoicePdf(strapi: any, documentId: string): Promise<void> {
  if (!documentId) return;

  const invoice = await strapi.documents(INVOICE_UID).findOne({
    documentId,
    populate: {
      cliente: true,
      invoice_item: true,
      payments: true,
      issuer_data: true,
      pdf: true,
    },
  });

  if (!invoice || invoice.pdf) return;

  const buffer = await generateInvoicePdf(invoice as InvoicePdfData);
  const fileName = `factura-${invoice.invoice_nro ?? documentId}.pdf`;
  const tmpPath = path.join(os.tmpdir(), `${Date.now()}-${fileName}`);

  fs.writeFileSync(tmpPath, buffer);

  try {
    const uploaded = await strapi.plugin('upload').service('upload').upload({
      data: {
        fileInfo: {
          name: fileName,
          alternativeText: `Factura ${invoice.invoice_nro ?? documentId}`,
        },
      },
      files: {
        filepath: tmpPath,
        originalFilename: fileName,
        mimetype: 'application/pdf',
        size: buffer.length,
      } as any,
    });

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    if (!file?.id) throw new Error('La subida del PDF no devolvió un archivo');

    await strapi.documents(INVOICE_UID).update({
      documentId,
      data: { pdf: file.id },
    });
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}
