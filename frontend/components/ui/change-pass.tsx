"use client";

import { FormState } from "@/validations/auth";
import { useActionState } from "react";
import { actions } from "@/actions";
import { FormError } from "./form-error";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

const styles = {
  form: "bg-white p-12 rounded-lg flex flex-col items-center shadow-lg",
  pss: "text-indigo-600 uppercase tracking-wider font-bold text-xl mb-8",
  main: "w-full fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm",
  close:
    "absolute top-3 right-3 text-primary hover:text-primary/80 transition-colors text-xl cursor-pointer",
  inputContainer: "mb-6 w-full space-y-2",
  buttonChangePass:
    "w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
  data: {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  },
};

interface ChangePassProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ChangePass({ isOpen, setIsOpen }: ChangePassProps) {
  const [formState, formAction, isPending] = useActionState(
    actions.auth.changePasswordAction,
    INITIAL_STATE,
  );

  return (
    isOpen && (
      <main className={styles.main}>
        <button
          className={styles.close}
          onClick={() => setIsOpen(false)}
          type="button"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <form className={styles.form} action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.inputContainer}>
                <Label htmlFor="oldPassword">Current password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Current password"
                />
                <FormError error={formState.zodErrors?.oldPassword} />
              </div>
              <div className={styles.inputContainer}>
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                />
                <FormError error={formState.zodErrors?.password} />
              </div>
              <div className={styles.inputContainer}>
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
                <FormError error={formState.zodErrors?.confirmPassword} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isPending}
                className={styles.buttonChangePass}
              >
                {isPending ? "Cambiando..." : "Cambiar contraseña"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    )
  );
}

//
