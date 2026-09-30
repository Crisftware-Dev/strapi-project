export interface Balance {
  documentId?: string;
  id_balance: string;
  total: number;
  paid?: number;
  balance: number;
  description: string;
  issued: string;
  discounts: number;
  cliente: string;
  createdAt: string;
  updatedAt?: string;
}
