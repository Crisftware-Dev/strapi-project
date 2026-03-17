"use server";

import { Client, User, Plan } from "@/types/typeClients";
import { strapiJson } from "./api";

export async function fetchClients(): Promise<{ data: Client[] }> {
  try {
    const response = await strapiJson<{
      data: Client[];
      meta: Record<string, unknown>;
    }>("/api/clientes");

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
    }>(`/api/clientes/${documentId}`);

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

export async function updateClientById(
  documentId: string,
  data: Partial<Omit<Client, "documentId">>
): Promise<{ data: Client }> {
  try {
    const response = await strapiJson<{
      data: Client;
      meta: Record<string, unknown>;
    }>(`/api/clientes/${documentId}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });

    return { data: response.data };
  } catch (error) {
    console.error("Error updating client by ID:", error);
    throw new Error("Error updating client by ID");
  }
}
