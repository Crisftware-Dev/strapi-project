"use server";

import { loginUserService, registerUserService } from "@/lib/login-register";
import {
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
  cookieStore.set("jwt", response.jwt, cookieConfig);
  redirect("/dashboard");
}

export async function logoutUserAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");

  redirect("/signin");
}
