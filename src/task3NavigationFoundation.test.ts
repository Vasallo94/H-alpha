// @ts-expect-error Vitest runs in Node, but this Astro project intentionally has no Node ambient types.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import spanishPage from "./pages/index.astro?raw";
import englishPage from "./pages/en/index.astro?raw";
import siteNav from "./components/SiteNav.astro?raw";
import languageToggle from "./components/LanguageToggle.astro?raw";

const css = readFileSync(new URL("./styles/global.css", import.meta.url), "utf8");

describe("Task 3 bilingual navigation foundation", () => {
  it("renders hero copy from the shared copy module on both localized pages", () => {
    expect(spanishPage).toContain('import { siteCopy } from "../content/siteCopy";');
    expect(spanishPage).toContain('const copy = siteCopy["es"];');
    expect(spanishPage).toContain("{copy.hero.eyebrow}");
    expect(spanishPage).toContain("{copy.hero.title}");
    expect(spanishPage).toContain("{copy.hero.intro}");

    expect(englishPage).toContain('import { siteCopy } from "../../content/siteCopy";');
    expect(englishPage).toContain('const copy = siteCopy["en"];');
    expect(englishPage).toContain("{copy.hero.eyebrow}");
    expect(englishPage).toContain("{copy.hero.title}");
    expect(englishPage).toContain("{copy.hero.intro}");
  });

  it("anchors the current hero section as the physics target", () => {
    expect(spanishPage).toContain('<section id="physics" class="section">');
    expect(englishPage).toContain('<section id="physics" class="section">');
  });

  it("uses localized nav metadata and home paths", () => {
    expect(siteNav).toContain('import { getLocalizedPath, type Locale } from "../i18n/routes";');
    expect(siteNav).toContain('const navAriaLabel = locale === "es" ? "Principal" : "Primary";');
    expect(siteNav).toContain("href={getLocalizedPath(locale)}");
    expect(siteNav).toContain("aria-label={navAriaLabel}");
  });

  it("describes the target language link for assistive tech and alternate-language metadata", () => {
    expect(languageToggle).toContain('const ariaLabel = targetLocale === "en" ? "Switch to English" : "Cambiar a español";');
    expect(languageToggle).toContain("aria-label={ariaLabel}");
    expect(languageToggle).toContain("lang={targetLocale}");
    expect(languageToggle).toContain("hreflang={targetLocale}");
  });

  it("keeps brand and language toggle on the first mobile nav row", () => {
    expect(css).toContain("color: var(--solar-deep);");
    expect(css).toContain("grid-template-columns: 1fr auto;");
    expect(css).toContain("grid-column: 1;");
    expect(css).toContain("grid-column: 2;");
    expect(css).toContain("grid-row: 1;");
    expect(css).toContain("grid-column: 1 / -1;");
    expect(css).toContain("grid-row: 2;");
  });
});
