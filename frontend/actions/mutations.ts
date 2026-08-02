"use server";

import type { Client, Plan, StrapiMedia } from "@/types/typesDB";
import { strapiJson } from "@/lib/api";
import { isRedirectError } from "@/lib/jwt";
import { sanitizeClientPayload } from "@/lib/utils";

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
