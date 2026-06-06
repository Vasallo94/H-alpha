export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromPath(pathname: string): Locale {
  const normalizedPathname = pathname.replace(/\/+$/, "");
  return normalizedPathname === "/en" || normalizedPathname.startsWith("/en/") ? "en" : "es";
}

export function getLocalizedPath(locale: Locale): string {
  return locale === "es" ? "/" : "/en/";
}
