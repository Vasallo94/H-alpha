import { describe, expect, it } from "vitest";
import { getLocaleFromPath, getLocalizedPath, locales } from "./routes";

describe("i18n routes", () => {
  it("supports Spanish and English", () => {
    expect(locales).toEqual(["es", "en"]);
  });

  it("uses Spanish for the root path", () => {
    expect(getLocaleFromPath("/")).toBe("es");
  });

  it("detects English from /en", () => {
    expect(getLocaleFromPath("/en/")).toBe("en");
  });

  it("builds localized paths", () => {
    expect(getLocalizedPath("es")).toBe("/");
    expect(getLocalizedPath("en")).toBe("/en/");
  });
});
