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
}

export interface User {
  username: string;
  email: string;
}