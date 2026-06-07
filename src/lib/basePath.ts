const externalPattern = /^[a-z][a-z0-9+.-]*:/i;

export function normalizeBasePath(basePath = "/"): string {
  if (!basePath || basePath === "/") return "/";
  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function withBasePath(path: string, basePath = import.meta.env.BASE_URL): string {
  if (!path || path.startsWith("#") || externalPattern.test(path)) return path;

  const normalizedBase = normalizeBasePath(basePath);
  if (normalizedBase === "/" || !path.startsWith("/")) return path;

  return `${normalizedBase.replace(/\/$/, "")}${path}`;
}
