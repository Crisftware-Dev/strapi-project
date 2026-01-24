"use client";

import Link from "next/link";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormState } from "@/validations/auth";
import { useActionState } from "react";
import { actions } from "@/actions";
import { FormError } from "./form-error";
import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
  data: {
    identifier: "",
    password: "",
  },
};

export function SigninForm() {
  const [formState, formAction] = useActionState(
    actions.auth.loginUserAction,
    INITIAL_STATE,
  );
  const { showPassword, togglePassword, inputType } = usePasswordToggle();

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
                defaultValue={formState.data?.identifier ?? ""}
              />
              <FormError error={formState.zodErrors?.identifier} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={inputType}
                  placeholder="password"
                  defaultValue={formState.data?.password ?? ""}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <FormError error={formState.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign In</Button>
            {formState.strapiErrors && (
              <p className="text-pink-500 text-xs italic mt-1 py-2">
                {formState.strapiErrors.message}
              </p>
            )}
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Don&apos;t have an account?
          <Link className={styles.link} href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
