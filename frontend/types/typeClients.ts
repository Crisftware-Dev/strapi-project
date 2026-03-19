

export interface Client {
  documentId: string;
    nombres: string;
    apellidos: string;
    identificacion: string;
    contrato: number;
    ciudad: string;
    email: string;
    telefono: number;
    estado: string;
    valores: number;
    plans: Plan[];
    tipoCliente: string;
    references: Reference[];
}

export interface Reference {
  documentId: string;
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