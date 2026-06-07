import { describe, expect, it } from "vitest";
import { siteCopy } from "./siteCopy";

const locales = ["es", "en"] as const;

describe("site copy contract", () => {
  it("has Spanish and English", () => {
    expect(Object.keys(siteCopy)).toEqual(["es", "en"]);
  });

  it("keeps section keys synchronized across locales", () => {
    expect(Object.keys(siteCopy.es.sections)).toEqual(Object.keys(siteCopy.en.sections));
  });

  it("every section has base narrative body paragraphs", () => {
    for (const locale of locales) {
      for (const [key, section] of Object.entries(siteCopy[locale].sections)) {
        expect(section.body.length, `${locale}.${key}.body`).toBeGreaterThan(0);
      }
    }
  });

  it("deep-dive sections stay in sync across locales", () => {
    const esWithDeep = Object.entries(siteCopy.es.sections)
      .filter(([, s]) => s.deepDive).map(([k]) => k);
    const enWithDeep = Object.entries(siteCopy.en.sections)
      .filter(([, s]) => s.deepDive).map(([k]) => k);
    expect(esWithDeep).toEqual(enWithDeep);
  });

  it("keeps glossary keys synchronized", () => {
    expect(Object.keys(siteCopy.es.glossary)).toEqual(Object.keys(siteCopy.en.glossary));
  });

  it("has the same number of evergreen safety rules in both languages", () => {
    expect(siteCopy.es.safety.rules.length).toEqual(siteCopy.en.safety.rules.length);
    expect(siteCopy.es.safety.rules.length).toBe(7);
  });

  it("keeps the seasonal callout configurable in both languages", () => {
    expect(siteCopy.es.safety.seasonalCallout.enabled).toBe(true);
    expect(siteCopy.en.safety.seasonalCallout.date).toBe("2026-08-12");
  });

  it("uses matching final-image annotation ids across locales", () => {
    const esIds = siteCopy.es.finalImage.annotations.map((a) => a.id).sort();
    const enIds = siteCopy.en.finalImage.annotations.map((a) => a.id).sort();
    expect(esIds).toEqual(enIds);
    expect(esIds.length).toBeGreaterThanOrEqual(3);
  });

  it("keeps diagram label groups synchronized", () => {
    expect(Object.keys(siteCopy.es.diagrams)).toEqual(Object.keys(siteCopy.en.diagrams));
  });
});
