"use server";

import type {
  Client,
  User,
  Plan,
  FileItem,
  StrapiMedia,
  applied_discount,
} from "@/types/typeClients";
import { strapiJson } from "./api";

/** Deep populate query for client with nested media in file components */
const CLIENT_POPULATE = [
  "populate[plans]=true",
  "populate[reference]=true",
  "populate[discountLaw]=true",
  "populate[contact]=true",
  "populate[files][populate][file]=true",
  "populate[applied_discount]=true",
  "populate[seller_user]=true",
  "populate[assigned_installer]=true",
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
    const payload = { ...data };
    
    // Remove read-only relations to avoid Strapi v5 validation errors (Invalid key documentId)
    delete payload.seller_user;
    delete payload.assigned_installer;

    if (payload.plans) {
      payload.plans = payload.plans.map(
        (plan) => plan.documentId,
      ) as unknown as Plan[];
    }

    if (payload.reference) {
      payload.reference = payload.reference.map((ref) => ({
        identificacion: ref.identificacion ?? "",
        fullnames: ref.fullnames ?? "",
        relationship: ref.relationship ?? "",
        phone: ref.phone ?? 0,
      }));
    }

    if (payload.discountLaw) {
      if (!payload.discountLaw.disability && !payload.discountLaw.oldAge) {
        payload.discountLaw = null;
      } else {
        // Strip internal Strapi component id before sending
        payload.discountLaw = {
          disability: payload.discountLaw.disability,
          oldAge: payload.discountLaw.oldAge,
        };
      }
    }

    // Strip internal Strapi component id from contact before sending
    if (payload.contact) {
      payload.contact = {
        telephone: payload.contact.telephone ?? "",
        phoneSms: payload.contact.phoneSms ?? "",
        phoneTwo: payload.contact.phoneTwo ?? "",
      };
    }

    // Strip internal Strapi component id from location before sending
    if (payload.location) {
      payload.location = {
        latitude: payload.location.latitude ?? "",
        longitude: payload.location.longitude ?? "",
      };
    }

    if ("applied_discount" in payload) {
      payload.applied_discount = (payload.applied_discount?.documentId || null) as unknown as applied_discount;
    }

    // Serialize file components: send media ID reference instead of full object
    if (payload.files && Array.isArray(payload.files)) {
      payload.files = payload.files.map((f: FileItem) => ({
        name: f.name,
        filename: f.filename,
        // multiple: true requires an array of IDs
        file: f.file?.[0]?.id ? [f.file[0].id] : [],
      })) as unknown as FileItem[];
    }

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
