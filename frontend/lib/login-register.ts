import qs from "qs";
import { cacheLife } from "next/cache";

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

export const STRAPI_BASE_URL =
  process.env.STRAPI_BASE_URL || "http://localhost:1337";

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            link: {
              populate: true,
            },
          },
        },
      },
    },
  },
};

export async function getHomePage() {
  "use cache";
  cacheLife({ expire: 300 });

  const query = qs.stringify(QUERY_HOME_PAGE);
  const response = await getStrapiData(`/api/home-page?${query}`);
  return response?.data;
}

export async function getStrapiData(url: string) {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchAuth(endopoint: string, userData: UserData) {
  const url = new URL(`${STRAPI_BASE_URL}/api/auth/${endopoint}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error?.message || `HTTP error! status: ${response.status}`,
        ...data,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const loginUserService = (data: LoginData) => fetchAuth("local", data);
export const registerUserService = (data: RegisterData) => fetchAuth("local/register", data);