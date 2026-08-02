"use server";

import { cookies } from "next/headers";
import { STRAPI_BASE_URL } from "./login-register";
import { FORBIDDEN_MESSAGE, isForbiddenWrite } from "./http-errors";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("jwt")?.value || null;
}

export async function fetchStrapi(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  const authToken = await getAuthToken();

  const isFormData = options.body instanceof FormData;

  const headers = new Headers({
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  });

  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
  
  const fetchUrl = `${STRAPI_BASE_URL}${endpoint}`;

  const res = await fetch(fetchUrl, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if(res.status === 401 && retry && !endpoint.includes('/auth/refresh')) {
    const refreshRes = await fetch(`${STRAPI_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });

    if(refreshRes.ok) {
      const { jwt: newAuthToken } = await refreshRes.json();
      if(newAuthToken) {
        const cookieStore = await cookies();
        cookieStore.set('jwt', newAuthToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 5 * 60 * 60,
          path: '/',
        });
      }
      
      return fetchStrapi(endpoint, options, false);
    } else { 
      throw new Error('Sesión expirada, Inicia sesión nuevamente');
    }
  }

  return res;
}

export async function strapiJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetchStrapi(endpoint, options);
  if(!res.ok) {
    if (isForbiddenWrite(res.status, options.method)) {
      throw new Error(FORBIDDEN_MESSAGE);
    }
    const errorText = await res.text();
    throw new Error(errorText || 'Error al obtener datos');
  }

  return res.json() as Promise<T>;
}

// EN CONSTRUCCIÓN, ESTOY REALIZANDO LA FUNCION FETCH GLOBAL PARA PETICIONES COMO AL USER, CLIENTES, ETC.