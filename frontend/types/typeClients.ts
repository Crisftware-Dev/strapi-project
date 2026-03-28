export interface Client {
  documentId: string;
  nombres: string;
  apellidos: string;
  currentAge: string;
  identificacion: string;
  contrato: number;
  ciudad: string;
  email: string;
  telefono: number;
  estado: string;
  valores: number;
  plans: Plan[];
  tipoPlan: string;
  planPrincipal: boolean;
  tipoCliente: string;
  reference: Reference[];
  automaticCut: boolean;
  discountLaw: DiscountLaw;
}

export interface DiscountLaw {
  disability: boolean;
  oldAge: boolean;
}

export interface Reference {
  identificacion: string;
  fullnames: string;
  relationship: string;
  phone: number;
}

export interface User {
  fullname: string;
  lastname: string;
}

export interface Plan {
  documentId: string;
  type: string;
  plan: string;
  cut: number;
  valor: number;
  descuento: number;
  meses: number;
}
