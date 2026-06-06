import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    css: {
      include: /.+/,
    },
    include: ["src/**/*.test.ts"],
  },
});
