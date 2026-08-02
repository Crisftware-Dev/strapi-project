"use client";

import { actions } from "@/actions";
import { cn } from "@/lib/utils";
import { FormState } from "@/validations/auth";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface LoginData {
  label: string;
  images_demostratives: { url: string; alternativeText?: string }[];
}

const SLIDESHOW_INTERVAL = 4000;

const styles = {
  header: "relative h-screen min-h-[400px] overflow-hidden",
  backgroundImage: "object-fill",
  overlay:
    "absolute flex justify-center items-end pb-50 inset-0 z-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent",
  content: "absolute inset-0 z-30 flex items-center justify-center",
  heading: "text-xl font-bold md:text-3xl lg:text-xl",
  button:
    "inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors cursor-pointer",
};

const INITIAL_STATE: FormState = {
  data: {
    identifier: "",
    password: "",
  },
};

export function DescSection({
  data,
  className,
  defaultIdentifier,
  defaultPassword,
}: {
  readonly data?: LoginData | null;
  readonly className?: string;
  readonly defaultIdentifier?: string;
  readonly defaultPassword?: string;
}) {
  const { label, images_demostratives } = data || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formState, formAction] = useActionState(
    actions.auth.loginUserAction,
    {
      ...INITIAL_STATE,
      data: {
        identifier: defaultIdentifier ?? "",
        password: defaultPassword ?? "",
      },
    },
  );

  const images = (images_demostratives ?? []).map((img) => ({
    url: img.url,
    alt: img.alternativeText || label || "Imagen demostrativa",
  }));

  useEffect(() => {
    if (images.length < 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, SLIDESHOW_INTERVAL);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <header className={cn(styles.header, className)}>
      {images.map((image, index) => (
        <div
          key={image.url}
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            alt={image.alt}
            className={styles.backgroundImage}
            fill
            loading={index === currentIndex ? undefined : "lazy"}
            sizes="100vw"
            quality={90}
            src={image.url}
          />
        </div>
      ))}
      <form action={formAction} className={styles.overlay} aria-hidden="true">
        <Input
          type="hidden"
          name="identifier"
          defaultValue={formState.data?.identifier}
        />
        <Input
          type="hidden"
          name="password"
          defaultValue={formState.data?.password}
        />
        <Button className={styles.button}>{label}</Button>
      </form>
    </header>
  );
}
