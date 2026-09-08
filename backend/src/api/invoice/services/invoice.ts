/**
 * invoice service
 */

import { factories } from '@strapi/strapi';

export class InvoicePaymentError extends Error {}

const CURRENCY = 'USD';
const IVA_RATE = 0.15;
const LEY_DISCOUNT_RATE = 0.5;

type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA';

interface PaymentInput {
  amount?: number;
  payment_method?: PaymentMethod;
  payment_date?: string;
}

const round2 = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export default factories.createCoreService('api::invoice.invoice', ({ strapi }) => {
  const invoiceUid = 'api::invoice.invoice' as const;
  const clienteUid = 'api::cliente.cliente' as const;

  const calculateInvoiceForClient = (client: any, plan: any) => {
    const base = Number(plan.valor ?? 0);
    const descuentoPlan = Number(plan.descuento ?? 0);
    const ley = client.discountLaw ?? null;
    const aplicaLey = Boolean(ley && (ley.disability || ley.oldAge));
    const descuentoLey = aplicaLey
      ? round2(Math.max(base - descuentoPlan, 0) * LEY_DISCOUNT_RATE)
      : 0;
    const descuentoPromocion = Number(client.applied_discount?.value ?? 0);
    const discounts = round2(descuentoPlan + descuentoLey + descuentoPromocion);
    const subtotal = round2(Math.max(base - discounts, 0));
    const taxes = client.withholdingAgent ? 0 : round2(subtotal * IVA_RATE);
    const total = round2(subtotal + taxes);
    const invoice_item = [
      {
        description: `${plan.type} - ${plan.plan}`,
        amount: 1,
        unit_price: subtotal,
      },
    ];
    return { base, discounts, subtotal, taxes, total, invoice_item };
  };

  const generateInvoiceNumber = async (generationDate = new Date()) => {
    const year = generationDate.getFullYear();
    const prefix = `F-${year}-`;
    const latest = await strapi.documents(invoiceUid).findMany({
      fields: ['invoice_nro'],
      sort: { invoice_nro: 'desc' },
      pagination: { limit: 1 },
    });
    const lastNro = latest[0]?.invoice_nro ?? '';
    let sequence = 1;
    if (lastNro.startsWith(prefix)) {
      const parsed = Number.parseInt(lastNro.slice(prefix.length), 10);
      if (Number.isFinite(parsed)) {
        sequence = parsed + 1;
      }
    }
    return `${prefix}${String(sequence).padStart(6, '0')}`;
  };

  const monthlyInvoiceExists = async (
    clientDocumentId: string,
    year: number,
    month: number,
  ) => {
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 1).toISOString();
    const found = await strapi.documents(invoiceUid).findFirst({
      fields: ['documentId'],
      filters: {
        cliente: { documentId: { $eq: clientDocumentId } },
        issue_date: { $gte: start, $lt: end },
      },
    });
    return Boolean(found);
  };

  const createMonthlyInvoice = async (
    client: any,
    plan: any,
    forDate: Date,
  ) => {
    const year = forDate.getFullYear();
    const month = forDate.getMonth();
    const invoice_nro = await generateInvoiceNumber(new Date(year, month, 1));
    const calculation = calculateInvoiceForClient(client, plan);
    const dateLabel = new Intl.DateTimeFormat('es-EC', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month, 1));

    return strapi.documents(invoiceUid).create({
      data: {
        invoice_nro,
        issue_date: new Date(year, month, 1).toISOString(),
        subtotal: calculation.subtotal,
        taxes: calculation.taxes,
        total: calculation.total,
        currency: CURRENCY,
        paid: 0,
        discounts: calculation.discounts,
        state: 'PENDIENTE',
        detail: `Cuota mensual ${dateLabel} - ${plan.plan}`,
        invoice_item: calculation.invoice_item,
        cliente: { documentId: client.documentId },
        pagos: [],
      },
    });
  };

  return {
    calculateInvoice: async (client: any, plan: any, _opts: Record<string, unknown> = {}) =>
      calculateInvoiceForClient(client, plan),

    generateInvoiceNumber: async (generationDate = new Date()) =>
      generateInvoiceNumber(generationDate),

    createMonthlyInvoices: async (forDate = new Date()) => {
      const year = forDate.getFullYear();
      const month = forDate.getMonth();
      const clients = await strapi.documents(clienteUid).findMany({
        filters: {
          estado: { $eq: 'ACTIVO' },
          automaticInvoice: { $eq: true },
        },
        populate: {
          plans: true,
          discountLaw: true,
          applied_discount: true,
        },
        pagination: { limit: 1000 },
      });

      const result = { created: 0, skipped: 0 };

      for (const client of clients) {
        const plan = client.plans?.[0];
        if (!plan) {
          result.skipped += 1;
          continue;
        }
        const exists = await monthlyInvoiceExists(
          client.documentId,
          year,
          month,
        );
        if (exists) {
          result.skipped += 1;
          continue;
        }
        await createMonthlyInvoice(client, plan, forDate);
        result.created += 1;
      }

      return result;
    },

    registerPayment: async (documentId: string, input: PaymentInput = {}) => {
      const invoice = await strapi.documents(invoiceUid).findOne({
        documentId,
        populate: { payments: true },
      });
      if (!invoice) {
        throw new InvoicePaymentError('Factura no encontrada');
      }

      const amount = round2(Number(input.amount));
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new InvoicePaymentError('El monto del pago debe ser mayor que 0');
      }

      const payment_method = input.payment_method ?? 'EFECTIVO';
      const payment_date = input.payment_date ?? new Date().toISOString();
      const total = Number(invoice.total ?? 0);
      const paid = round2(Number(invoice.paid ?? 0));
      const saldo = round2(total - paid);
      if (amount > saldo) {
        throw new InvoicePaymentError(
          `El monto supera el saldo pendiente (${saldo.toFixed(2)})`,
        );
      }

      const newPaid = round2(paid + amount);
      const payments: Array<{
        amount: number;
        payment_date: string;
        payment_method: PaymentMethod;
      }> = Array.isArray(invoice.payments)
        ? invoice.payments.map((p) => ({
            amount: Number(p.amount),
            payment_date: String(p.payment_date),
            payment_method: (p.payment_method ?? 'EFECTIVO') as PaymentMethod,
          }))
        : [];
      payments.push({ amount, payment_date, payment_method });

      const remaining = round2(total - newPaid);
      const state = remaining <= 0.005 ? 'PAGADA' : 'PARCIAL';

      const updated = await strapi.documents(invoiceUid).update({
        documentId,
        data: {
          paid: newPaid,
          state,
          payments,
          payment_date,
          payment_method,
        },
        populate: {
          cliente: true,
          invoice_item: true,
          payments: true,
        },
      });

      return updated;
    },
  };
});