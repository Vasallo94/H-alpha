import { defineConfig } from "@playwright/test";
import { normalizeBasePath } from "./src/lib/basePath";

const localOrigin = "http://127.0.0.1:4321";
const localBaseURL = new URL(normalizeBasePath(process.env.PUBLIC_BASE_PATH), localOrigin).toString();

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  use: {
    baseURL: localBaseURL,
  },
  webServer: {
    command: "pnpm run dev --host 127.0.0.1",
    url: localBaseURL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
});
