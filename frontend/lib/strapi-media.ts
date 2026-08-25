import { STRAPI_BASE_URL } from "@/lib/login-register";
import type { StrapiMedia } from "@/types/typesDB";

export type StrapiImageFormat = "thumbnail" | "small" | "medium" | "large";

export function getStrapiMediaUrl(
  media: Pick<StrapiMedia, "url" | "formats"> | null | undefined,
  format: StrapiImageFormat = "medium",
): string | null {
  if (!media?.url) return null;

  const formatUrl = media.formats?.[format]?.url;
  const rawUrl = formatUrl ?? media.url;

  return rawUrl.startsWith("http")
    ? rawUrl
    : `${STRAPI_BASE_URL}${rawUrl}`;
}
