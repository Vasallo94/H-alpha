import { describe, expect, it } from "vitest";
import { siteCopy } from "./siteCopy";

const keysOf = (value: unknown) => Object.keys(value as Record<string, unknown>).sort();

const expectCopyShapeToMatch = (spanish: unknown, english: unknown) => {
  expect(Array.isArray(spanish)).toBe(Array.isArray(english));

  if (Array.isArray(spanish) && Array.isArray(english)) {
    expect(spanish).toHaveLength(english.length);

    spanish.forEach((spanishItem, index) => {
      expectCopyShapeToMatch(spanishItem, english[index]);
    });
    return;
  }

  if (
    spanish &&
    english &&
    typeof spanish === "object" &&
    typeof english === "object"
  ) {
    expect(keysOf(spanish)).toEqual(keysOf(english));

    for (const key of keysOf(spanish)) {
      expectCopyShapeToMatch(
        (spanish as Record<string, unknown>)[key],
        (english as Record<string, unknown>)[key],
      );
    }
  }
};

describe("site copy", () => {
  it("has Spanish and English content", () => {
    expect(Object.keys(siteCopy)).toEqual(["es", "en"]);
  });

  it("keeps glossary keys synchronized", () => {
    expect(Object.keys(siteCopy.es.glossary).sort()).toEqual(Object.keys(siteCopy.en.glossary).sort());
  });

  it("keeps narrative section keys synchronized", () => {
    expectCopyShapeToMatch(siteCopy.es.sections, siteCopy.en.sections);
  });

  it("keeps interactive spectrum and filter copy centralized in both languages", () => {
    expect(siteCopy.es.sections.spectrum.explorer).toEqual(
      expect.objectContaining({
        ariaLabel: expect.any(String),
        body: expect.any(String),
        label: expect.any(String),
        lineLabel: expect.any(String),
        markerDescription: expect.any(String),
      }),
    );
    expect(siteCopy.en.sections.spectrum.explorer).toEqual(
      expect.objectContaining({
        ariaLabel: expect.any(String),
        body: expect.any(String),
        label: expect.any(String),
        lineLabel: expect.any(String),
        markerDescription: expect.any(String),
      }),
    );
    expect(siteCopy.es.sections.filters.cards).toHaveLength(3);
    expect(siteCopy.en.sections.filters.cards).toHaveLength(3);
  });

  it("keeps bandpass tuning simulator copy centralized in both languages", () => {
    for (const copy of [siteCopy.es.sections.bandpass, siteCopy.en.sections.bandpass]) {
      expect(copy).toEqual(
        expect.objectContaining({
          heading: expect.any(String),
          lead: expect.any(String),
          simulator: expect.objectContaining({
            ariaLabel: expect.any(String),
            widthLabel: expect.any(String),
            offsetLabel: expect.any(String),
            widthReadoutLabel: expect.any(String),
            offsetReadoutLabel: expect.any(String),
            resultReadoutLabel: expect.any(String),
            centerLabel: expect.any(String),
            windowLabel: expect.any(String),
            results: expect.objectContaining({
              offBand: expect.any(String),
              narrow: expect.any(String),
              wide: expect.any(String),
            }),
          }),
        }),
      );
    }
  });

  it("keeps seasonal callout configurable in both languages", () => {
    expect(siteCopy.es.seasonalSafetyCallout.enabled).toBe(true);
    expect(siteCopy.en.seasonalSafetyCallout.enabled).toBe(true);
    expect(siteCopy.es.seasonalSafetyCallout.date).toBe("2026-08-12");
    expect(siteCopy.en.seasonalSafetyCallout.date).toBe("2026-08-12");
  });
});
