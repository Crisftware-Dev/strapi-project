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
import { FormError } from "../ui/feedback";
import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const styles = {
  container: "w-full max-w-md",
  togglePassword:
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors",
  strapiError: "text-pink-600 dark:text-pink-400 text-xs italic text-center",
  button:
    "w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
  prompt: "mt-6 text-center text-sm text-gray-600 dark:text-gray-400",
  link: "ml-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors",
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
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
                defaultValue={formState.data?.identifier ?? ""}
              />
              <FormError error={formState.zodErrors?.identifier} />
            </div>
            <div className="space-y-2">
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
                  className={styles.togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <FormError error={formState.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className={styles.button}>Sign In</Button>
            {formState.strapiErrors && (
              <p className={styles.strapiError}>
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
