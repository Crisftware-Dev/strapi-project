import { STRAPI_BASE_URL } from "@/lib/login-register";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  header:
    "relative h-screen min-h-[400px]  overflow-hidden",
  backgroundImage: "object-cover",
  overlay:
    "relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-gradient-to-b from-black/70 via-black/40 to-black/20",
  heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
  button:
    "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors",
};

interface HeroData {
  heading?: string;
  subHeading?: string;
  link?: { href: string; label: string };
  image?: { url: string; alternativeText?: string };
}

export function HeroSection({
  data,
  className,
  priority = true,
}: {
  readonly data?: HeroData | null;
  readonly className?: string;
  readonly priority?: boolean;
}) {
  if (!data?.image?.url) return null;

  const { heading, subHeading, link } = data;

  const imageUrl = data.image.url.startsWith("http")
    ? data.image.url
    : `${STRAPI_BASE_URL}${data.image.url}`;
  const altText = data.image.alternativeText || "Fondo de portada";

  return (
    <header className={cn(styles.header, className)}>
      <Image
        alt={altText}
        className={styles.backgroundImage}
        fill
        priority={priority}
        sizes="100vw"
        src={imageUrl}
      />
      <div className={styles.overlay}>
        {heading && <h1 className={styles.heading}>{heading}</h1>}
        {subHeading && <p className={styles.subheading}>{subHeading}</p>}
        {link?.href && (
          <Link className={styles.button} href={link.href}>
            {link.label}
          </Link>
        )}
      </div>
    </header>
  );
}
