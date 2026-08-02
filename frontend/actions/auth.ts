"use server";

import { fetchStrapi } from "@/lib/api";
import { loginUserService, registerUserService } from "@/lib/login-register";
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
  formData: FormData,
): Promise<FormState> {
  const fields = {
    oldPassword: formData.get("oldPassword") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
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
    };
  }

  const data = {
    currentPassword: validateFields.data.oldPassword,
    password: validateFields.data.password,
    passwordConfirmation: validateFields.data.confirmPassword,
  };

  try {
    const res = await fetchStrapi("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const strapiErrorMessage = "The current password is incorrect. Please check it and try again.";

      return {
        success: false,
        message: strapiErrorMessage,
        strapiErrors: null,
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields,
        },
      };
    }

    const result = await res.json();

    if (result.jwt) {
      const cookieStore = await cookies();
      cookieStore.set("jwt", result.jwt, cookieConfig);
    }

    return {
      success: true,
      message: "Password changed successfully",
      data: undefined,
      strapiErrors: null,
      zodErrors: null,
    };
  } catch (error) {
    console.error("Error changing password:", error);

    return {
      success: false,
      message: "Error changing password",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }
}

// LOGOUT

export async function logoutUserAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");

  redirect("/");
}

export async function logoutGlobalUserAction(): Promise<void> {
  try {
    await fetchStrapi("/api/auth/logout", {
      method: "POST",
    });
  } catch(error) {
    console.error("Error logout global user:", error);
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: "jwt",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  redirect("/");
}
