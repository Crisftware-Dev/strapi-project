export type MetodoPago = "TRANSFERENCIA" | "EFECTIVO" | "TARJETA";

export interface InvoiceParty {
  nombre: string;
  identificacion: string;
  direccion?: string;
  email?: string;
  telefono?: string;
}

export interface InvoiceItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

export interface InvoicePayment {
  monto: number;
  fechaPago: string;
  metodoPago: MetodoPago;
}

export interface InvoiceData {
  invoice_nro: string;
  issue_date: string;
  fechaVencimiento?: string;
  currency?: string;
  issuer_data: InvoiceParty & { logoUrl?: string };
  cliente: InvoiceParty;
  invoice_item: InvoiceItem[];
  subtotal: number;
  taxes?: number;
  total: number;
  paid?: InvoicePayment[];
  detail?: string;
}
