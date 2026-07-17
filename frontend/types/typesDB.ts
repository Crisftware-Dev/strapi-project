export interface Client {
  documentId: string;
  nombres: string;
  apellidos: string;
  currentAge: string;
  identificacion: string;
  contrato: number;
  ciudad: string;
  email: string;
  estado: string;
  valores: number;
  plans: Plan[];
  tipoPlan: string;
  planPrincipal: boolean;
  tipoCliente: string;
  reference: Reference[];
  automaticCut: boolean;
  discountLaw: DiscountLaw | null;
  withholdingAgent: boolean;
  files: FileItem[];
  automaticInvoice: boolean;
  contact: Contact;
  entity: string;
  applied_discount: applied_discounts;
  installationDate: string;
  transferDate: string;
  sinceCustomer: string;
  scoreCredit: number;
  seller_user: User;
  assigned_installer: User;
  location: Location;
  economicActivity: string | undefined;
  typeOfHousing: string | undefined;
  relatedClient: boolean;
  creditButt: boolean;
  discardButt: boolean;
  hasDucts: boolean;
}

export interface Location {
  latitude: string;
  longitude: string;
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

export interface Contact {
  telephone: string;
  phoneSms: string;
  phoneTwo: string;
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
  CREATEDBY: string;
}

export interface applied_discounts {
  documentId: string;
  name: string;
  value: number;
  description: string;
}

export interface StrapiMedia {
  id: number;
  documentId?: string;
  url: string;
  name: string;
  mime: string;
}

export interface FileItem {
  id?: number;
  documentId?: string;
  name: string;
  filename?: string;
  file?: StrapiMedia[] | null;
  pendingFile?: File;
}
