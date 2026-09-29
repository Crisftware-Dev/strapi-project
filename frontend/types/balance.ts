export interface Balance {
  id?: number;
  documentId?: string;
  id_balance: string;
  total: number;
  paid: number;
  balance: number;
  issued: string;
  discounts: number;
  cliente?: unknown;
  createdAt?: string;
  updatedAt?: string;
}
