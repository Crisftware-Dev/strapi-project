"use client";

import Link from "next/link";
import { actions } from "@/actions";
import { useActionState } from "react";
import { type FormState } from "@/validations/auth";
import { FormError } from "./form-error";
import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const styles = {
  container: "w-full max-w-md",
  togglePassword: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors",
  strapiError: "text-pink-600 dark:text-pink-400 text-xs italic text-center",
  button: "w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
  prompt: "mt-6 text-center text-sm text-gray-600 dark:text-gray-400",
  link: "ml-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
  data: {
    username: "",
    password: "",
    email: "",
  },
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE,
  );

  const { showPassword, togglePassword, inputType } = usePasswordToggle();

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                defaultValue={formState.data?.username ?? ""}
              />
              <FormError error={formState.zodErrors?.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                defaultValue={formState.data?.email ?? ""}
              />
              <FormError error={formState.zodErrors?.email} />
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                defaultValue={formState.data?.password ?? ""}
              />
              <FormError error={formState.zodErrors?.confirmPassword} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className={styles.button}>
              Sign Up
            </Button>
            {formState.strapiErrors && (
              <p className={styles.strapiError}>
                {formState.strapiErrors.message}
              </p>
            )}
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link
            className={styles.link}
            href="signin"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
