"use server";

import { Client, User } from "@/types/typeClients";
import { strapiJson } from "./api";

export async function fetchClients(): Promise<{ data: Client[] }> {
  try {
    const getClients = await strapiJson<Client[]>('/api/clientes');

    console.log(getClients);

    return { data: getClients };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
}

export async function fetchUser() {
  try {
    const getUser = await strapiJson<User>('/api/users/me');

    return { fullname: getUser.fullname, lastname: getUser.lastname };

  } catch (error) {
    console.error("Error fetching user data:", error);
    return { fullname: "", lastname: "" };
  }
}

