export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromPath(pathname: string): Locale {
  return pathname.replace(/\/+$/, "").startsWith("/en") ? "en" : "es";
}

export function getLocalizedPath(locale: Locale): string {
  return locale === "es" ? "/" : "/en/";
}
