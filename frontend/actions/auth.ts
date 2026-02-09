"use server";

import { fetchStrapi } from "@/lib/api";
import {
  loginUserService,
  registerUserService,
  STRAPI_BASE_URL,
} from "@/lib/login-register";
import {
  ChangePasswordFormSchema,
  SigninFormSchema,
  SignupFormSchema,
  type FormState,
} from "@/validations/auth";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  domain: process.env.HOST ?? "localhost",
};

export async function registerUserAction(
  prevState: FormState,
  formdData: FormData,
): Promise<FormState> {
  const fields = {
    fullname: formdData.get("fullname") as string,
    lastname: formdData.get("lastname") as string,
    username: formdData.get("username") as string,
    email: formdData.get("email") as string,
    password: formdData.get("password") as string,
    confirmPassword: formdData.get("confirmPassword") as string,
  };

  const validateFields = SignupFormSchema.safeParse(fields);

  if (!validateFields.success) {
    const flattenedErrors = z.flattenError(validateFields.error);

    return {
      success: false,
      message: "Validation error",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const response = await registerUserService({
    fullname: validateFields.data.fullname,
    lastname: validateFields.data.lastname,
    username: validateFields.data.username,
    email: validateFields.data.email,
    password: validateFields.data.password,
  });

  if (!response || response.error) {
    return {
      success: false,
      message: "Registration error",
      strapiErrors: response?.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", response.jwt, cookieConfig);
  redirect("/dashboard");
}

export async function loginUserAction(
  prevState: FormState,
  formdData: FormData,
): Promise<FormState> {
  const fields = {
    identifier: formdData.get("identifier") as string,
    password: formdData.get("password") as string,
  };

  const validateFields = SigninFormSchema.safeParse(fields);

  if (!validateFields.success) {
    const flattenedErrors = z.flattenError(validateFields.error);

    return {
      success: false,
      message: "Validation error",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const response = await loginUserService(validateFields.data);

  if (!response || response.error) {
    return {
      success: false,
      message: "Login error",
      strapiErrors: response?.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", response.jwt);
  redirect("/dashboard");
}

//  CHANGE PASSWORD

export async function changePasswordAction(
  prevState: FormState,
  formdData: FormData,
) {

  const fields = {
    oldPassword: formdData.get("oldPassword") as string,
    password: formdData.get("password") as string,
    confirmPassword: formdData.get("confirmPassword") as string,
  };

  const validateFields = ChangePasswordFormSchema.safeParse(fields);

  if (!validateFields.success) {
    const flattenedErrors = z.flattenError(validateFields.error);

    return {
      success: false,
      message: "Validation error",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  try {
    const res = await fetchStrapi("/api/auth/local/change-password", {
      body: JSON.stringify({
        validateFields,
      }),
    });


    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.error?.message || "Error changing password",
      };
    }

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
  }
}

// LOGOUT

export async function logoutUserAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");

  redirect("/signin");
}

export async function logoutGlobalUserAction(): Promise<void> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (jwt) {
    fetch(`${STRAPI_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error("Revoke falló:", err));
  }

  cookieStore.set({
    name: "jwt",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  redirect("/signin");
}
