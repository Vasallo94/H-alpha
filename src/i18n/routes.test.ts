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
});
