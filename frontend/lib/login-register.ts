import qs from "qs";
import { FORBIDDEN_MESSAGE } from "./http-errors";
import type { StrapiMedia } from "@/types/typesDB";

interface LoginData {
  identifier: string;
  password: string;
}

interface RegisterData {
  fullname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

type UserData = LoginData | RegisterData;

export const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

interface LoginSectionData {
  __component: "layout.login-section";
  label: string;
  images_demostratives: StrapiMedia[];
}

interface LoginPageData {
  title?: string;
  description?: string;
  sections: LoginSectionData[];
}

interface StrapiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

const QUERY_LOGIN_PAGE = {
  fields: ["title", "description"],
  populate: {
    sections: {
      on: {
        "layout.login-section": {
          populate: {
            images_demostratives: {
              fields: ["url", "alternativeText", "width", "height", "formats"],
            },
          },
        },
      },
    },
  },
};

export async function getLoginPage(): Promise<LoginPageData | null> {
  const query = qs.stringify(QUERY_LOGIN_PAGE);
  const response = await getStrapiData<LoginPageData>(`/api/login-page?${query}`);

  const data = response?.data ?? null;
  if (data?.sections) {
    data.sections.forEach((section) => {
      section.images_demostratives.forEach((img) => {
        if (img.url && !img.url.startsWith("http")) {
          img.url = `${STRAPI_BASE_URL}${img.url}`;
        }
        if (img.formats) {
          (Object.keys(img.formats) as (keyof typeof img.formats)[]).forEach(
            (key) => {
              const format = img.formats?.[key];
              if (format?.url && !format.url.startsWith("http")) {
                format.url = `${STRAPI_BASE_URL}${format.url}`;
              }
            },
          );
        }
      });
    });
  }

  return data;
}

export async function getStrapiData<T>(url: string): Promise<StrapiResponse<T> | null> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}${url}`, {
      next: {
        revalidate: 300,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as StrapiResponse<T>;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  fullname?: string;
  lastname?: string;
}

interface StrapiAuthSuccess {
  jwt: string;
  user: StrapiUser;
  error?: never;
}

interface StrapiAuthError {
  data?: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  };
  jwt?: never;
  user?: never;
}

type StrapiAuthResponse = StrapiAuthSuccess | StrapiAuthError;

export async function fetchAuth(
  endpoint: string,
  userData: UserData,
): Promise<StrapiAuthResponse> {
  const url = new URL(`${STRAPI_BASE_URL}/api/auth/${endpoint}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = (await response.json()) as StrapiAuthResponse;

    if (!response.ok) {
      if (response.status === 403) {
        return {
          error: {
            status: 403,
            name: "ForbiddenError",
            message: FORBIDDEN_MESSAGE,
          },
        };
      }
      if (data.error && data.error.message) {
        return data;
      }
      return {
        error: {
          status: response.status,
          name: "HTTPError",
          message: `HTTP error! status: ${response.status}`,
        },
      };
    }

    return data;
  } catch (error) {
    return {
      error: {
        status: 0,
        name: "NetworkError",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export const loginUserService = (data: LoginData): Promise<StrapiAuthResponse> =>
  fetchAuth("local", data);
export const registerUserService = (
  data: RegisterData,
): Promise<StrapiAuthResponse> => fetchAuth("local/register", data);
