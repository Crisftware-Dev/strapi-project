"use server";

import type {
  Client,
  User,
  Plan,
  AppliedDiscount,
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
].join("&");

export async function fetchClients(): Promise<{ data: Client[] }> {
  const response = await strapiJson<{
    data: Client[];
    meta: Record<string, unknown>;
  }>(`/api/clientes?${CLIENT_SEARCH_PARAMS}`);

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
