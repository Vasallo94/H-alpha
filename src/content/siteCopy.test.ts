import { describe, expect, it } from "vitest";
import { siteCopy } from "./siteCopy";

describe("site copy", () => {
  it("has Spanish and English content", () => {
    expect(Object.keys(siteCopy)).toEqual(["es", "en"]);
  });

  it("keeps glossary keys synchronized", () => {
    expect(Object.keys(siteCopy.es.glossary).sort()).toEqual(Object.keys(siteCopy.en.glossary).sort());
  });

  it("keeps seasonal callout configurable in both languages", () => {
    expect(siteCopy.es.seasonalSafetyCallout.enabled).toBe(true);
    expect(siteCopy.en.seasonalSafetyCallout.enabled).toBe(true);
    expect(siteCopy.es.seasonalSafetyCallout.date).toBe("2026-08-12");
    expect(siteCopy.en.seasonalSafetyCallout.date).toBe("2026-08-12");
  });
});
