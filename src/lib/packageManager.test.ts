import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../..", import.meta.url));
const read = (path: string) => readFileSync(`${root}/${path}`, "utf8");

describe("repository package manager", () => {
  it("uses pnpm as the only package manager", () => {
    const pkg = JSON.parse(read("package.json"));

    expect(pkg.packageManager).toMatch(/^pnpm@/);
    expect(existsSync(`${root}/pnpm-lock.yaml`)).toBe(true);
    expect(existsSync(`${root}/package-lock.json`)).toBe(false);
  });

  it("documents and runs pnpm commands in automation", () => {
    const text = [
      read("README.md"),
      read(".github/workflows/ci.yml"),
      read(".github/workflows/deploy-pages.yml"),
    ].join("\n");

    expect(text).toContain("pnpm install --frozen-lockfile");
    expect(text).toContain("pnpm test");
    expect(text).toContain("pnpm run build");
    expect(text).not.toMatch(/\bnpm (ci|install|test|run build)\b/);
  });
});
