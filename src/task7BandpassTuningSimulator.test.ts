import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import spanishPage from "./pages/index.astro?raw";
import englishPage from "./pages/en/index.astro?raw";
import css from "./styles/global.css?raw";

const readSource = (path: string) => {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
};

const bandpassSimulator = readSource("./components/interactive/BandpassTuningSimulator.tsx");
const bandpassSection = readSource("./components/sections/BandpassSection.astro");

describe("Task 7 bandpass tuning simulator", () => {
  it("adds the simulator and section source files", () => {
    expect(bandpassSimulator).not.toBe("");
    expect(bandpassSection).not.toBe("");
  });

  it("renders a localized static section with only the simulator hydrated", () => {
    expect(bandpassSection).toContain('id="bandpass"');
    expect(bandpassSection).toContain('import BandpassTuningSimulator from "../interactive/BandpassTuningSimulator";');
    expect(bandpassSection).toContain("copy.sections.bandpass");
    expect(bandpassSection).toContain("{bandpass.heading}");
    expect(bandpassSection).toContain("{bandpass.lead}");
    expect(bandpassSection).toMatch(/const\s+simulator\s*=\s*bandpass\.simulator;/);
    expect(bandpassSection).toMatch(/<BandpassTuningSimulator\s+copy=\{simulator\}\s+client:load\s+\/>/);
    expect(bandpassSection).not.toContain("Bandpass tuning");
    expect(bandpassSection).not.toContain("Ajuste de bandpass");
  });

  it("wires the simulator controls to unique labels, help text, and live readouts", () => {
    expect(bandpassSimulator).toContain("useId");
    expect(bandpassSimulator).toContain("aria-live=\"polite\"");
    expect(bandpassSimulator).toContain("aria-describedby={`${readoutId} ${descriptionId}`}");
    expect(bandpassSimulator).toContain("id={widthInputId}");
    expect(bandpassSimulator).toContain("id={offsetInputId}");
    expect(bandpassSimulator).toContain("copy.results.offBand");
    expect(bandpassSimulator).toContain("copy.results.narrow");
    expect(bandpassSimulator).toContain("copy.results.wide");
    expect(bandpassSimulator).not.toContain('id="bandpass-width"');
    expect(bandpassSimulator).not.toContain('id="bandpass-offset"');
  });

  it("wires the bandpass section after optics on both localized pages", () => {
    expect(spanishPage).toMatch(/import BandpassSection from "\.\.\/components\/sections\/BandpassSection\.astro";/);
    expect(spanishPage).toMatch(/<OpticalSystemSection locale="es" \/>[\s\S]*<BandpassSection locale="es" \/>[\s\S]*<SafetySection locale="es" \/>/);
    expect(englishPage).toMatch(/import BandpassSection from "\.\.\/\.\.\/components\/sections\/BandpassSection\.astro";/);
    expect(englishPage).toMatch(/<OpticalSystemSection locale="en" \/>[\s\S]*<BandpassSection locale="en" \/>[\s\S]*<SafetySection locale="en" \/>/);
  });

  it("adds stable styles for the bandpass simulator plot and controls", () => {
    expect(css).toMatch(/\.bandpass-sim\s*\{/);
    expect(css).toMatch(/\.bandpass-sim__plot\s*\{/);
    expect(css).toMatch(/\.bandpass-sim__center\s*\{/);
    expect(css).toMatch(/\.bandpass-sim__window\s*\{/);
    expect(css).toMatch(/\.bandpass-sim__labels\s*\{/);
    expect(css).toMatch(/\.bandpass-sim__controls\s*\{/);
  });
});
