"use server";

import type {
  Client,
  User,
  Plan,
  AppliedDiscount,
  ClientSearchFilters,
  ClientSearchResponse,
} from "@/types/typesDB";
import { strapiJson } from "./api";

const CLIENT_POPULATE = [
  "populate[plans]=true",
  "populate[reference]=true",
  "populate[discountLaw]=true",
  "populate[contact]=true",
  "populate[files][populate][file]=true",
  "populate[applied_discount]=true",
  "populate[location]=true",
  "populate[seller_user]=true",
  "populate[assigned_installer]=true",
].join("&");

const CLIENT_SEARCH_PARAMS = [
  "fields[0]=nombres",
  "fields[1]=apellidos",
  "fields[2]=identificacion",
  "fields[3]=contrato",
  "fields[4]=ciudad",
  "fields[5]=estado",
  "fields[6]=tipoPlan",
  "populate[contact][fields][0]=telephone",
  "populate[contact][fields][1]=phoneSms",
  "populate[contact][fields][2]=phoneTwo",
  "populate[plans][fields][0]=plan",
  "pagination[pageSize]=500",
].join("&");

const CLIENT_SEARCH_FIELDS = [
  "fields[0]=nombres",
  "fields[1]=apellidos",
  "fields[2]=identificacion",
  "fields[3]=contrato",
  "fields[4]=ciudad",
  "fields[5]=estado",
  "fields[6]=tipoPlan",
  "populate[contact][fields][0]=telephone",
  "populate[contact][fields][1]=phoneSms",
  "populate[contact][fields][2]=phoneTwo",
  "populate[plans][fields][0]=plan",
].join("&");


const CLIENT_INVOICE_POPULATE = [
  "populate[invoices][fields][0]=issuer_data",
  "populate[invoices][fields][1]=cliente",
  "populate[invoices][fields][2]=invoice_item",
  "populate[invoices][fields][3]=paid",
].join("&");

const SEARCH_PAGE_SIZE = 20;

export async function fetchClients(): Promise<{ data: Client[] }> {
  const response = await strapiJson<{
    data: Client[];
    meta: Record<string, unknown>;
  }>(`/api/clientes?${CLIENT_SEARCH_PARAMS}`);

  return { data: response.data };
}

export async function fetchClientsSearch(
  filters: ClientSearchFilters,
  page = 1,
  pageSize = SEARCH_PAGE_SIZE,
): Promise<ClientSearchResponse> {
  const queryParams = [CLIENT_SEARCH_FIELDS];

  let andIdx = 0;

  if (filters.nombres) {
    const value = encodeURIComponent(filters.nombres);
    queryParams.push(
      `filters[$and][${andIdx}][$or][0][nombres][$containsi]=${value}`,
      `filters[$and][${andIdx}][$or][1][apellidos][$containsi]=${value}`,
    );
    andIdx++;
  }

  if (filters.telefono) {
    const value = encodeURIComponent(filters.telefono);
    queryParams.push(
      `filters[$and][${andIdx}][$or][0][contact][telephone][$containsi]=${value}`,
      `filters[$and][${andIdx}][$or][1][contact][phoneSms][$containsi]=${value}`,
      `filters[$and][${andIdx}][$or][2][contact][phoneTwo][$containsi]=${value}`,
    );
    andIdx++;
  }

  if (filters.estado) {
    queryParams.push(
      `filters[$and][${andIdx}][estado][$eq]=${encodeURIComponent(filters.estado)}`,
    );
    andIdx++;
  }

  if (filters.plan) {
    queryParams.push(
      `filters[$and][${andIdx}][plans][plan][$eq]=${encodeURIComponent(filters.plan)}`,
    );
    andIdx++;
  }

  if (filters.medio) {
    queryParams.push(
      `filters[$and][${andIdx}][tipoPlan][$eq]=${encodeURIComponent(filters.medio)}`,
    );
    andIdx++;
  }

  queryParams.push(
    `pagination[page]=${page}`,
    `pagination[pageSize]=${pageSize}`,
  );

  const response = await strapiJson<ClientSearchResponse>(
    `/api/clientes?${queryParams.join("&")}`,
  );

  return response;
}

export async function fetchClientByContrato(
  contrato: string,
): Promise<{ data: Client[] }> {
  const params = [
    CLIENT_SEARCH_PARAMS,
    `filters[contrato][$eq]=${encodeURIComponent(contrato)}`,
    "pagination[pageSize]=10",
  ].join("&");

  const response = await strapiJson<{
    data: Client[];
    meta: Record<string, unknown>;
  }>(`/api/clientes?${params}`);

  return { data: response.data };
}

export async function fetchClientById(
  documentId: string,
): Promise<{ data: Client }> {
  if (!documentId) {
    throw new Error("El documentId es requerido para obtener el cliente");
  }

  const response = await strapiJson<{
    data: Client;
    meta: Record<string, unknown>;
  }>(`/api/clientes/${documentId}?${CLIENT_POPULATE}`);

  return { data: response.data };
}

export async function fetchUser() {
  const getUser = await strapiJson<User>("/api/users/me");

  return { fullname: getUser.fullname, lastname: getUser.lastname };
}

export async function fetchPlans() {
  const response = await strapiJson<{
    data: Plan[];
    meta: Record<string, unknown>;
  }>("/api/plans");

  return { data: response.data };
}

export async function fetchAppliedDiscount() {
  const response = await strapiJson<{
    data: AppliedDiscount[];
    meta: Record<string, unknown>;
  }>("/api/applied-discounts");

  return { data: response.data };
}

export async function fecthInvoicesByClient(documentId: string) {
  const response = await strapiJson<{ data: Client[] }>(
    `/api/clientes/${documentId}?${CLIENT_INVOICE_POPULATE}`,
  );

  return { data: response.data };
}
