export interface Client {
  // Identificación y datos personales
  documentId: string;
  nombres: string;
  apellidos: string;
  currentAge: string;
  identificacion: string;
  ciudad: string;
  email: string;
  entity: string;
  economicActivity: string | undefined;
  typeOfHousing: string | undefined;
  installationDate: string;
  transferDate: string;
  sinceCustomer: string;

  // Contrato y estado financiero
  contrato: number;
  estado: string;
  valores: number;
  tipoPlan: string;
  planPrincipal: boolean;
  tipoCliente: string;
  scoreCredit: number;
  relatedClient: boolean;
  creditButt: boolean;
  discardButt: boolean;
  hasDucts: boolean;
  automaticCut: boolean;
  automaticInvoice: boolean;
  withholdingAgent: boolean;

  // Relaciones y componentes
  plans: Plan[];
  reference: Reference[];
  discountLaw: DiscountLaw | null;
  files: FileItem[];
  contact: Contact;
  applied_discount: AppliedDiscount;
  seller_user: User;
  assigned_installer: User;
  location: Location;
}

// Geolocalización
export interface Location {
  latitude: string;
  longitude: string;
}

// Ley de descuento (discapacidad / tercera edad)
export interface DiscountLaw {
  disability: boolean;
  oldAge: boolean;
}

// Referencias personales del cliente
export interface Reference {
  identificacion: string;
  fullnames: string;
  relationship: string;
  phone: number;
}

// Datos de contacto
export interface Contact {
  telephone: string;
  phoneSms: string;
  phoneTwo: string;
}

// Usuario (vendedor / instalador)
export interface User {
  fullname: string;
  lastname: string;
}

// Plan contratado
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

// Descuento aplicado
export interface AppliedDiscount {
  documentId: string;
  name: string;
  value: number;
  description: string;
}

// Archivo multimedia de Strapi
export interface StrapiMedia {
  id: number;
  documentId?: string;
  url: string;
  name: string;
  mime: string;
}

// Ítem de archivo (puede tener uno o varios adjuntos)
export interface FileItem {
  id?: number;
  documentId?: string;
  name: string;
  filename?: string;
  file?: StrapiMedia[] | null;
  pendingFile?: File;
}

// Buscador de clientes
export interface ClientSearchFilters {
  nombres?: string;
  telefono?: string;
  estado?: string;
  plan?: string;
  medio?: string;
}

export interface ClientSearchPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ClientSearchResponse {
  data: Client[];
  meta: { pagination: ClientSearchPagination };
}