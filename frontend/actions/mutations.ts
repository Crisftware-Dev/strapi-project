"use server";

import type { Client, Plan, StrapiMedia } from "@/types/typesDB";
import { strapiJson } from "@/lib/api";
import { isRedirectError } from "@/lib/jwt";
import { sanitizeClientPayload } from "@/lib/utils";
import { Balance } from "@/types/balance";

export async function createClientAction(
  data: Partial<Omit<Client, "documentId" | "contrato">>,
): Promise<{ data: Client }> {
  try {
    const payload = sanitizeClientPayload(data);
    const response = await strapiJson<{
      data: Client;
      meta: Record<string, unknown>;
    }>("/api/clientes", {
      method: "POST",
      body: JSON.stringify({ data: payload }),
    });
    return { data: response.data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error creating client:", error);
    throw new Error(
      error instanceof Error
        ? `Error al crear el cliente: ${error.message}`
        : "Error al crear el cliente",
    );
  }
}

export async function updateClientAction(
  documentId: string,
  data: Partial<Omit<Client, "documentId">>,
): Promise<{ data: Client }> {
  if (!documentId) {
    throw new Error("El documentId es requerido para actualizar el cliente");
  }

  try {
    const payload = sanitizeClientPayload(data);
    const response = await strapiJson<{
      data: Client;
      meta: Record<string, unknown>;
    }>(`/api/clientes/${documentId}`, {
      method: "PUT",
      body: JSON.stringify({ data: payload }),
    });
    return { data: response.data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error updating client:", error);
    throw new Error(
      error instanceof Error
        ? `Error al actualizar el cliente: ${error.message}`
        : "Error al actualizar el cliente",
    );
  }
}

export async function uploadFileAction(
  formData: FormData,
): Promise<StrapiMedia[]> {
  try {
    return await strapiJson<StrapiMedia[]>("/api/upload", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error uploading file:", error);
    throw new Error(
      error instanceof Error
        ? `Error al subir el archivo: ${error.message}`
        : "Error al subir el archivo",
    );
  }
}

export async function createPlanAction(
  data: Partial<Plan>,
): Promise<{ data: Plan }> {
  try {
    return await strapiJson<{ data: Plan }>("/api/plans", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error creating plan:", error);
    throw new Error(
      error instanceof Error
        ? `Error al crear el plan: ${error.message}`
        : "Error al crear el plan",
    );
  }
}

export async function createBalanceAction(
  data: Partial<Balance>,
): Promise<{ data: Balance }> {
  try {
    return await strapiJson<{ data: Balance }>("/api/balances", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error creating balance:", error);
    throw new Error(
      error instanceof Error
        ? `Error al crear el balance: ${error.message}`
        : "Error al crear el balance",
    );
  }
}

export async function updateBalanceAction(
  documentId: string,
  data: Partial<Omit<Balance, "documentId" | "id_balance">>,
): Promise<{ data: Balance }> {
  if (!documentId) {
    throw new Error("El documentId es requerido para actualizar el balance");
  }

  try {
    return await strapiJson<{ data: Balance }>(`/api/balances/${documentId}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error updating balance:", error);
    throw new Error(
      error instanceof Error
        ? `Error al actualizar el balance: ${error.message}`
        : "Error al actualizar el balance",
    );
  }
}

export async function deleteBalanceAction(
  documentId: string,
): Promise<{ data: Balance | null }> {
  if (!documentId) {
    throw new Error("El documentId es requerido para eliminar el balance");
  }

  try {
    return await strapiJson<{ data: Balance | null }>(`/api/balances/${documentId}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error deleting balance:", error);
    throw new Error(
      error instanceof Error
        ? `Error al eliminar el balance: ${error.message}`
        : "Error al eliminar el balance",
    );
  }
}

