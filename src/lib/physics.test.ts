import { describe, expect, it } from "vitest";
import {
  H_ALPHA_NM,
  gaussian,
  transmissionWindow,
  contrastUnderWindow,
  classifyView,
  nearestLine,
} from "./physics";

describe("physics helpers", () => {
  it("knows the H-alpha wavelength", () => {
    expect(H_ALPHA_NM).toBeCloseTo(656.28, 2);
  });

  it("gaussian peaks at its center", () => {
    expect(gaussian(0, 0, 1)).toBeCloseTo(1, 5);
    expect(gaussian(0, 0, 1)).toBeGreaterThan(gaussian(1, 0, 1));
  });

  it("transmission window is symmetric around its center", () => {
    const left = transmissionWindow(-0.2, { centerOffset: 0, fwhm: 0.5 });
    const right = transmissionWindow(0.2, { centerOffset: 0, fwhm: 0.5 });
    expect(left).toBeCloseTo(right, 6);
  });

  it("narrower windows yield higher disk contrast than wide ones", () => {
    const narrow = contrastUnderWindow({ centerOffset: 0, fwhm: 0.3 });
    const wide = contrastUnderWindow({ centerOffset: 0, fwhm: 1.2 });
    expect(narrow).toBeGreaterThan(wide);
  });

  it("classifies a centered narrow window as disk detail", () => {
    expect(classifyView({ centerOffset: 0, fwhm: 0.4 })).toBe("disk");
  });

  it("classifies a wide window as washed out", () => {
    expect(classifyView({ centerOffset: 0, fwhm: 1.2 })).toBe("washed");
  });

  it("classifies an off-band window as prominences", () => {
    expect(classifyView({ centerOffset: 0.4, fwhm: 0.4 })).toBe("prominence");
  });

  it("nearestLine: 656 nm identifies Hα with n=3→n=2 transition", () => {
    const line = nearestLine(656);
    expect(line).not.toBeNull();
    expect(line!.label).toBe("Hα");
    expect(line!.element).toBe("H");
    expect(line!.transition).toEqual({ from: 3, to: 2 });
  });

  it("nearestLine: 486 nm identifies Hβ with n=4→n=2 transition", () => {
    const line = nearestLine(486);
    expect(line).not.toBeNull();
    expect(line!.label).toBe("Hβ");
    expect(line!.element).toBe("H");
    expect(line!.transition).toEqual({ from: 4, to: 2 });
  });

  it("nearestLine: 589 nm identifies Na D (not hydrogen)", () => {
    const line = nearestLine(589);
    expect(line).not.toBeNull();
    expect(line!.element).toBe("Na");
    expect(line!.transition).toBeUndefined();
  });

  it("nearestLine: 550 nm (far from any line) returns null", () => {
    expect(nearestLine(550)).toBeNull();
  });
});
