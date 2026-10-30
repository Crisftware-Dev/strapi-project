import { Client, User } from "./typesDB";

export interface SupportReason {
  reason_name: string;
  slug: string;
  active: boolean;
}

export interface TypeSupport {
  name_support: string;
  slug: string;
  active: boolean;
  support_reasons: SupportReason[];
}

export interface Ticket {
  nro_ticket: number;
  description: string;
  ticket_detail: string;
  priority: string;
  ticket_status: string;
  subject: string;
  scheduled_date: Date;
  scheduled_time: string;
  ticket_closure: Date;
  scaled_to: string;
  type_support: TypeSupport;
  support_reason: SupportReason;
  assigned_to: User;
  client: Client;
}