import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import spanishPage from "./pages/index.astro?raw";
import englishPage from "./pages/en/index.astro?raw";
import spectrumSection from "./components/sections/SpectrumSection.astro?raw";
import siteNav from "./components/SiteNav.astro?raw";
import css from "./styles/global.css?raw";

const readSource = (path: string) => {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
};

const spectrumExplorer = readSource("./components/interactive/SpectrumExplorer.tsx");
const filterComparison = readSource("./components/interactive/FilterComparison.tsx");
const filterComparisonSection = readSource("./components/sections/FilterComparisonSection.astro");

describe("Task 6 interactive spectrum and filter modules", () => {
  it("adds the interactive source files", () => {
    expect(spectrumExplorer).not.toBe("");
    expect(filterComparison).not.toBe("");
    expect(filterComparisonSection).not.toBe("");
  });

  it("renders the spectrum explorer with localized props after the spectrum lead", () => {
    expect(spectrumSection).toContain('import SpectrumExplorer from "../interactive/SpectrumExplorer";');
    expect(spectrumSection).toMatch(/const\s+explorer\s*=\s*spectrum\.explorer;/);
    expect(spectrumSection).toMatch(/<SpectrumExplorer\s+copy=\{explorer\}\s+client:load\s+\/>/);
    expect(spectrumSection).not.toContain("Visible spectrum");
    expect(spectrumSection).not.toContain("Espectro visible");
  });

  it("adds a localized filter comparison section with the expected island", () => {
    expect(filterComparisonSection).toContain('id="filters"');
    expect(filterComparisonSection).toContain("copy.sections.filters");
    expect(filterComparisonSection).toContain("{filters.eyebrow}");
    expect(filterComparisonSection).toContain("{filters.heading}");
    expect(filterComparisonSection).toContain("{filters.lead}");
    expect(filterComparisonSection).toMatch(/<FilterComparison\s+ariaLabel=\{filters\.ariaLabel\}\s+cards=\{filters\.cards\}\s+client:load\s+\/>/);
    expect(filterComparisonSection).not.toContain("Eclipse glasses");
    expect(filterComparisonSection).not.toContain("Gafas de eclipse");
  });

  it("wires the filter section between spectrum and optics on both localized pages", () => {
    expect(spanishPage).toMatch(/import FilterComparisonSection from "\.\.\/components\/sections\/FilterComparisonSection\.astro";/);
    expect(spanishPage).toMatch(/<SpectrumSection locale="es" \/>[\s\S]*<FilterComparisonSection locale="es" \/>[\s\S]*<OpticalSystemSection locale="es" \/>/);
    expect(englishPage).toMatch(/import FilterComparisonSection from "\.\.\/\.\.\/components\/sections\/FilterComparisonSection\.astro";/);
    expect(englishPage).toMatch(/<SpectrumSection locale="en" \/>[\s\S]*<FilterComparisonSection locale="en" \/>[\s\S]*<OpticalSystemSection locale="en" \/>/);
  });

  it("points the filter navigation item to the dedicated filter section", () => {
    expect(siteNav).toMatch(/href="#filters"[^>]*>\{copy\.nav\.filters\}/);
  });

  it("adds stable styles for the spectrum explorer and filter card grid", () => {
    expect(css).toMatch(/\.spectrum-explorer\s*\{/);
    expect(css).toMatch(/\.spectrum-explorer__bar\s*\{[^}]*linear-gradient/s);
    expect(css).toMatch(/\.spectrum-explorer__line\s*\{/);
    expect(css).toMatch(/\.filter-comparison\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/s);
    expect(css).toMatch(/\.filter-comparison__card\s*\{/);
    expect(css).toMatch(/@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.filter-comparison\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  });
});
