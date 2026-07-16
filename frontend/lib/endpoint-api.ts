"use server";

import type {
  Client,
  User,
  Plan,
  StrapiMedia,
  applied_discount,
} from "@/types/typesDB";
import { strapiJson } from "./api";
import { sanitizeClientPayload } from "./utils";

/** Deep populate query for client with nested media in file components */
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
  try {
    const response = await strapiJson<{
      data: Client[];
      meta: Record<string, unknown>;
    }>("/api/clientes?populate=*");

    return { data: response.data };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
}

export async function fetchClientById(
  documentId: string,
): Promise<{ data: Client }> {
  try {
    const response = await strapiJson<{
      data: Client;
      meta: Record<string, unknown>;
    }>(`/api/clientes/${documentId}?${CLIENT_POPULATE}`);

    return { data: response.data };
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    throw new Error("Error fetching client by ID");
  }
}

export async function fetchUser() {
  try {
    const getUser = await strapiJson<User>("/api/users/me");

    return { fullname: getUser.fullname, lastname: getUser.lastname };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { fullname: "", lastname: "" };
  }
}

export async function fetchPlans() {
  try {
    const response = await strapiJson<{
      data: Plan[];
      meta: Record<string, unknown>;
    }>("/api/plans");

    return { data: response.data };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { data: [] };
  }
}

export async function fetchAppliedDiscount() {
  try {
    const response = await strapiJson<{
      data: applied_discount[];
      meta: Record<string, unknown>;
    }>("/api/applied-discounts");

    return { data: response.data };
  } catch (error) {
    console.error("Error fetching applied discounts:", error);
    return { data: [] };
  }
}

export async function updateClientById(
  documentId: string,
  data: Partial<Omit<Client, "documentId">>,
): Promise<{ data: Client }> {
  try {
    const payload = sanitizeClientPayload(data);

    const response = await strapiJson<{
      data: Client;
      meta: Record<string, unknown>;
    }>(`/api/clientes/${documentId}?${CLIENT_POPULATE}`, {
      method: "PUT",
      body: JSON.stringify({ data: payload }),
    });

    return { data: response.data };
  } catch (error) {
    console.error("Error updating client by ID:", error);
    throw new Error("Error updating client by ID");
  }
}

export async function createPlan(data: Partial<Plan>): Promise<{ data: Plan }> {
  try {
    return await strapiJson<{ data: Plan }>(`/api/plans`, {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    throw new Error("Error creating plan");
  }
}

export async function createClient(
  data: Partial<Omit<Client, "documentId" | "contrato">>,
): Promise<{ data: Client }> {
  try {
    const lastContract = await getLastContractNumber("contrato");

    const contratoNumber = (lastContract || 0) + 1;

    const payload = sanitizeClientPayload({ ...data, contrato: contratoNumber });

    const response = await strapiJson<{
      data: Client;
      meta: Record<string, unknown>;
    }>(`/api/clientes`, {
      method: "POST",
      body: JSON.stringify({ data: payload }),
    });

    return { data: response.data };
  } catch (error) {
    console.error("Error updating client by ID:", error);
    throw new Error("Error al crear el cliente");
  }
}

export async function uploadFileToStrapi(
  formData: FormData,
): Promise<StrapiMedia[]> {
  try {
    return await strapiJson<StrapiMedia[]>("/api/upload", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Error uploading file to Strapi:", error);
    throw new Error("Error uploading file to Strapi");
  }
}

export async function getLastContractNumber<K extends keyof Client>(
  field: K = "contrato" as K
): Promise<Client[K] | 0> {
  try {
    const response = await strapiJson<{
      data: Record<string, Client[K]>[];
      meta: Record<string, unknown>;
    }>(`/api/clientes?sort[0]=${String(field)}:desc&pagination[limit]=1&fields[0]=${String(field)}`);

    if (response.data && response.data.length > 0) {
      return response.data[0][field as string] ?? 0;
    }
    return 0;
  } catch (error) {
    console.error(`Error fetching last ${String(field)}:`, error);
    return 0;
  }
}
