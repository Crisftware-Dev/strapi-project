"use server";

import type {
  Client,
  User,
  Plan,
  applied_discounts,
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
].join("&");

export async function fetchClients(): Promise<{ data: Client[] }> {
  const response = await strapiJson<{
    data: Client[];
    meta: Record<string, unknown>;
  }>(`/api/clientes?${CLIENT_POPULATE}`);

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
    data: applied_discounts[];
    meta: Record<string, unknown>;
  }>("/api/applied-discounts");

  return { data: response.data };
}
