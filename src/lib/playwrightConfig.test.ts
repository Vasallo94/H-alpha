import { describe, expect, it, vi } from "vitest";

async function loadPlaywrightConfig(basePath: string) {
  vi.resetModules();
  vi.stubEnv("PUBLIC_BASE_PATH", basePath);
  const { default: config } = await import("../../playwright.config");
  vi.unstubAllEnvs();
  return config;
}

describe("playwright config", () => {
  it("waits for and navigates to the configured static base path", async () => {
    const config = await loadPlaywrightConfig("/H-alpha");

    expect(config.use?.baseURL).toBe("http://127.0.0.1:4321/H-alpha/");
    expect(config.webServer).toMatchObject({
      command: "pnpm run dev --host 127.0.0.1",
      url: "http://127.0.0.1:4321/H-alpha/",
    });
  });
});
