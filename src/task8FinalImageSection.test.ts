import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteCopy } from "./content/siteCopy";
import spanishPage from "./pages/index.astro?raw";
import englishPage from "./pages/en/index.astro?raw";
import css from "./styles/global.css?raw";

const componentPath = new URL("./components/sections/FinalImageSection.astro", import.meta.url);
const imagePath = new URL("../public/images/sun-h-alpha.png", import.meta.url);

const readComponent = () => readFileSync(componentPath, "utf8");

describe("Task 8 final H-alpha image section", () => {
  it("keeps final image copy centralized and synchronized", () => {
    for (const copy of [siteCopy.es.sections.finalImage, siteCopy.en.sections.finalImage]) {
      expect(copy).toEqual({
        eyebrow: expect.any(String),
        heading: expect.any(String),
        lead: expect.any(String),
        alt: expect.any(String),
        caption: expect.any(String),
      });
    }
  });

  it("adds the real solar image asset", () => {
    expect(existsSync(imagePath)).toBe(true);
  });

  it("renders a localized figure and caption from FinalImageSection", () => {
    expect(existsSync(componentPath)).toBe(true);

    const component = readComponent();

    expect(component).toContain('id="image"');
    expect(component).toContain("siteCopy[locale].sections.finalImage");
    expect(component).toContain('src="/images/sun-h-alpha.png"');
    expect(component).toContain("alt={finalImage.alt}");
    expect(component).toContain("{finalImage.caption}");
    expect(component).not.toContain("El Sol real en H-alpha");
    expect(component).not.toContain("The real Sun in H-alpha");
  });

  it("wires the final image section last on both localized pages", () => {
    expect(spanishPage).toMatch(/import FinalImageSection from "\.\.\/components\/sections\/FinalImageSection\.astro";/);
    expect(spanishPage).toMatch(/<SafetySection locale="es" \/>\s*<FinalImageSection locale="es" \/>\s*<\/BaseLayout>/);
    expect(englishPage).toMatch(/import FinalImageSection from "\.\.\/\.\.\/components\/sections\/FinalImageSection\.astro";/);
    expect(englishPage).toMatch(/<SafetySection locale="en" \/>\s*<FinalImageSection locale="en" \/>\s*<\/BaseLayout>/);
  });

  it("adds final image section styles that preserve image aspect ratio", () => {
    expect(css).toMatch(/\.final-image-section\s*\{/);
    expect(css).toMatch(/\.final-image-section__figure\s*\{/);
    expect(css).toMatch(/\.final-image-section__figure\s+img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;/s);
    expect(css).toMatch(/\.final-image-section__figure\s+figcaption\s*\{/);
  });
});
