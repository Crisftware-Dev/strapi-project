export type MethodPayment = "TRANSFERENCIA" | "EFECTIVO" | "TARJETA";

export interface InvoiceItem {
  id?: number;
  description: string;
  amount: number;
  unit_price: number;
}

export interface InvoicePayment {
  id?: number;
  amount: number;
  payment_date: string;
  method_payment: MethodPayment;
}

export interface InvoicePersona {
  fullname?: string;
  username?: string;
  lastname?: string;
  nombres?: string;
  apellidos?: string;
  identificacion?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  logoUrl?: string;
}

export interface Invoice {
  id: number;
  documentId: string;
  invoice_nro: string;
  issue_date: string;
  subtotal: number;
  taxes?: number;
  total: number;
  currency?: string;
  paid?: number;
  payments?: InvoicePayment[];
  discounts?: number;
  detail?: string;
  payment_date?: string;
  issuer_data?: InvoicePersona | null;
  invoice_item?: InvoiceItem[];
  cliente?: InvoicePersona | null;
}