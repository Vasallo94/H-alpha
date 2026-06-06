import { describe, expect, it } from "vitest";
import spanishPage from "./pages/index.astro?raw";
import englishPage from "./pages/en/index.astro?raw";
import heroSection from "./components/sections/HeroSection.astro?raw";
import spectrumSection from "./components/sections/SpectrumSection.astro?raw";
import opticalSystemSection from "./components/sections/OpticalSystemSection.astro?raw";
import safetySection from "./components/sections/SafetySection.astro?raw";
import css from "./styles/global.css?raw";

describe("Task 5 narrative sections", () => {
  it("renders the hero from localized site copy with the decorative sun", () => {
    expect(heroSection).toContain('class="section hero-section"');
    expect(heroSection).toContain('id="physics"');
    expect(heroSection).toContain('class="section__inner hero-section__grid"');
    expect(heroSection).toContain("{copy.hero.eyebrow}");
    expect(heroSection).toContain("{copy.hero.title}");
    expect(heroSection).toContain("{copy.hero.intro}");
    expect(heroSection).toContain('class="hero-section__sun"');
    expect(heroSection).toContain('aria-hidden="true"');
  });

  it("keeps spectrum copy localized and uses the shared bandpass glossary entry", () => {
    expect(spectrumSection).toContain('id="spectrum"');
    expect(spectrumSection).toContain('id="bandpass-spectrum"');
    expect(spectrumSection).toContain("copy.glossary.bandpass");
    expect(spectrumSection).toContain("copy.sections.spectrum");
    expect(spectrumSection).toContain("{spectrum.eyebrow}");
    expect(spectrumSection).toContain("{spectrum.heading}");
    expect(spectrumSection).toContain("{spectrum.leadStart}");
    expect(spectrumSection).toContain("{spectrum.leadEnd}");
    expect(spectrumSection).not.toContain("H-alpha es una línea, no solo un color");
    expect(spectrumSection).not.toContain("H-alpha is a line, not just a color");
  });

  it("keeps optical copy localized and gives each glossary tooltip a stable id", () => {
    expect(opticalSystemSection).toContain('id="optics"');
    expect(opticalSystemSection).toContain('id="etalon-optical-system"');
    expect(opticalSystemSection).toContain('id="blocking-filter-optical-system"');
    expect(opticalSystemSection).toContain("copy.glossary.etalon");
    expect(opticalSystemSection).toContain("copy.glossary.blockingFilter");
    expect(opticalSystemSection).toContain("copy.sections.opticalSystem");
    expect(opticalSystemSection).toContain("{opticalSystem.eyebrow}");
    expect(opticalSystemSection).toContain("{opticalSystem.heading}");
    expect(opticalSystemSection).toContain("{opticalSystem.leadStart}");
    expect(opticalSystemSection).toContain("{opticalSystem.leadMiddle}");
    expect(opticalSystemSection).toContain("{opticalSystem.leadEnd}");
    expect(opticalSystemSection).not.toContain("Cadena óptica");
    expect(opticalSystemSection).not.toContain("Optical chain");
  });

  it("renders localized safety copy with the seasonal callout in a warning", () => {
    expect(safetySection).toContain('id="safety"');
    expect(safetySection).toContain("copy.sections.safety");
    expect(safetySection).toContain("{safety.eyebrow}");
    expect(safetySection).toContain("{safety.heading}");
    expect(safetySection).not.toContain("Seguridad solar");
    expect(safetySection).not.toContain("Solar safety");
    expect(safetySection).toContain("copy.seasonalSafetyCallout.enabled");
    expect(safetySection).toContain('role="note"');
    expect(safetySection).toContain('aria-labelledby={seasonalSafetyTitleId}');
    expect(safetySection).toContain('<h3 id={seasonalSafetyTitleId}>');
    expect(safetySection).toContain("{copy.seasonalSafetyCallout.title}");
    expect(safetySection).toContain("{copy.seasonalSafetyCallout.body}");
  });

  it("wires all narrative sections into both localized pages", () => {
    expect(spanishPage).toMatch(/import HeroSection from "\.\.\/components\/sections\/HeroSection\.astro";/);
    expect(spanishPage).toMatch(/<HeroSection locale="es" \/>[\s\S]*<SpectrumSection locale="es" \/>[\s\S]*<OpticalSystemSection locale="es" \/>[\s\S]*<SafetySection locale="es" \/>/);
    expect(englishPage).toMatch(/import HeroSection from "\.\.\/\.\.\/components\/sections\/HeroSection\.astro";/);
    expect(englishPage).toMatch(/<HeroSection locale="en" \/>[\s\S]*<SpectrumSection locale="en" \/>[\s\S]*<OpticalSystemSection locale="en" \/>[\s\S]*<SafetySection locale="en" \/>/);
  });

  it("adds the planned hero layout styles", () => {
    expect(css).toMatch(/\.hero-section\s*\{[^}]*min-height:\s*calc\(100vh - 80px\);[^}]*display:\s*grid;[^}]*align-items:\s*center;/s);
    expect(css).toMatch(/\.hero-section__grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.1fr\) minmax\(240px,\s*0\.7fr\);/s);
    expect(css).toMatch(/\.hero-section__sun\s*\{[^}]*aspect-ratio:\s*1;[^}]*border-radius:\s*50%;[^}]*radial-gradient/s);
    expect(css).toMatch(/@media\s*\(max-width:\s*780px\)\s*\{[\s\S]*\.hero-section\s*\{[^}]*min-height:\s*auto;/s);
    expect(css).toMatch(/\.section\s*\{[^}]*scroll-margin-top:\s*96px;/s);
    expect(css).toMatch(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*\.section\s*\{[^}]*scroll-margin-top:\s*132px;/s);
  });
});
