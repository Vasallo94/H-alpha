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

  it("detects English from paths under /en", () => {
    expect(getLocaleFromPath("/en/foo")).toBe("en");
  });

  it("does not treat Spanish paths beginning with en as English", () => {
    expect(getLocaleFromPath("/energia")).toBe("es");
  });

  it("builds localized paths", () => {
    expect(getLocalizedPath("es")).toBe("/");
    expect(getLocalizedPath("en")).toBe("/en/");
  });

  it("builds localized paths under a GitHub Pages base path", () => {
    expect(getLocalizedPath("es", "/H-alpha/")).toBe("/H-alpha/");
    expect(getLocalizedPath("en", "/H-alpha/")).toBe("/H-alpha/en/");
  });

  it("detects English under a GitHub Pages base path", () => {
    expect(getLocaleFromPath("/H-alpha/en/", "/H-alpha/")).toBe("en");
    expect(getLocaleFromPath("/H-alpha/", "/H-alpha/")).toBe("es");
  });
});
