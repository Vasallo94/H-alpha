import { normalizeBasePath, withBasePath } from "../lib/basePath";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromPath(pathname: string, basePath = import.meta.env.BASE_URL): Locale {
  const normalizedBase = normalizeBasePath(basePath).replace(/\/$/, "");
  const withoutBase =
    normalizedBase && normalizedBase !== "/" && pathname.startsWith(normalizedBase)
      ? pathname.slice(normalizedBase.length) || "/"
      : pathname;
  const normalizedPathname = withoutBase.replace(/\/+$/, "");
  return normalizedPathname === "/en" || normalizedPathname.startsWith("/en/") ? "en" : "es";
}

export function getLocalizedPath(locale: Locale, basePath = import.meta.env.BASE_URL): string {
  return withBasePath(locale === "es" ? "/" : "/en/", basePath);
}
