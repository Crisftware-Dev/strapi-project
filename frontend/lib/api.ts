"use server";

import { Client, User } from "@/types/typeClients";
import { STRAPI_BASE_URL } from "./login-register";
import { cookies } from "next/headers";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("jwt")?.value ?? null;
}

export async function fetchClients(): Promise<{ data: Client[] }> {
  try {
    const token = await getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const getClients = await fetch(`${STRAPI_BASE_URL}/api/clientes`, {
      headers,
    });

    const resultFetchClients = await getClients.json();

    if (!getClients.ok) {
      throw new Error(`HTTP error! status: ${getClients.status}`);
    }

    return resultFetchClients;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
}

export async function fetchUser(): Promise<User> {
  try {
    const token = await getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const getUser = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers,
    });

    const resultFetchUser = await getUser.json();

    const { username, email } = resultFetchUser;

    return { username, email };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}