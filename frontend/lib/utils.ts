import { applied_discount, Client, FileItem, Plan } from "@/types/typesDB";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function sanitizeClientPayload(data: Partial<Omit<Client, "documentId">>) {
  const payload = { ...data };

  // Relaciones de solo lectura
  // const readOnly = ['seller_user', 'assigned_installer'];
  // readOnly.forEach(key => delete payload[key as keyof typeof payload]);

  // Relations
  if (payload.plans) {
    payload.plans = payload.plans.map(p => p.documentId) as unknown as Plan[];
  }

  if (payload.applied_discount) {
    payload.applied_discount = (payload.applied_discount.documentId || null) as unknown as applied_discount;
  }

  // Componentes
  if (payload.discountLaw) {
    if (!payload.discountLaw.disability && !payload.discountLaw.oldAge) {
      payload.discountLaw = null;
    } else {
      payload.discountLaw = {
        disability: payload.discountLaw.disability,
        oldAge: payload.discountLaw.oldAge,
      };
    }
  }

  if (payload.contact) {
    payload.contact = {
      telephone: payload.contact.telephone ?? "",
      phoneSms: payload.contact.phoneSms ?? "",
      phoneTwo: payload.contact.phoneTwo ?? "",
    };
  }

  if (payload.location) {
    payload.location = {
      latitude: payload.location.latitude ?? "",
      longitude: payload.location.longitude ?? "",
    };
  }

  if (payload.reference) {
    payload.reference = payload.reference.map(ref => ({
      identificacion: ref.identificacion ?? "",
      fullnames: ref.fullnames ?? "",
      relationship: ref.relationship ?? "",
      phone: ref.phone ?? 0,
    }));
  }

  // Files
  if (payload.files?.length) {
    payload.files = payload.files.map((f: FileItem) => ({
      name: f.name,
      filename: f.filename,
      file: f.file?.[0]?.id ? [f.file[0].id] : [],
    }))as unknown as FileItem[];
    }

  return payload;
}
