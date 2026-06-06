import { describe, expect, it } from "vitest";
import spanishPage from "./pages/index.astro?raw";
import englishPage from "./pages/en/index.astro?raw";
import siteNav from "./components/SiteNav.astro?raw";
import languageToggle from "./components/LanguageToggle.astro?raw";
import css from "./styles/global.css?raw";

const localizedPages = [
  { locale: "es", source: spanishPage },
  { locale: "en", source: englishPage },
] as const;

describe("Task 3 bilingual navigation foundation", () => {
  it("renders hero copy from the shared copy module on both localized pages", () => {
    for (const { locale, source } of localizedPages) {
      expect(source).toMatch(new RegExp(`<HeroSection locale="${locale}" />`));
    }
  });

  it("anchors the current hero section as the physics target", () => {
    expect(siteNav).toMatch(/href="#physics"[^>]*>\{copy\.nav\.physics\}/);
  });

  it("uses localized nav metadata and home paths", () => {
    expect(siteNav).toMatch(/import\s+\{[^}]*getLocalizedPath[^}]*\}\s+from\s+"..\/i18n\/routes";/);
    expect(siteNav).toMatch(/navAriaLabel\s*=\s*locale\s*===\s*"es"\s*\?\s*"Principal"\s*:\s*"Primary"/);
    expect(siteNav).toMatch(/href={getLocalizedPath\(locale\)}/);
    expect(siteNav).toMatch(/<nav\b[^>]*aria-label={navAriaLabel}[^>]*>/);
    expect(siteNav).toMatch(/href="#physics"[^>]*>\{copy\.nav\.physics\}/);
    expect(siteNav).toMatch(/href="#filters"[^>]*>\{copy\.nav\.filters\}/);
    expect(siteNav).toMatch(/href="#safety"[^>]*>\{copy\.nav\.safety\}/);
    expect(siteNav).toMatch(/href="#image"[^>]*>\{copy\.nav\.image\}/);
  });

  it("describes the target language link for assistive tech and alternate-language metadata", () => {
    expect(languageToggle).toMatch(/targetLocale\s*=\s*locale\s*===\s*"es"\s*\?\s*"en"\s*:\s*"es"/);
    expect(languageToggle).toMatch(/ariaLabel\s*=\s*targetLocale\s*===\s*"en"\s*\?\s*"Switch to English"\s*:\s*"Cambiar a español"/);
    expect(languageToggle).toMatch(/<a\b[^>]*aria-label={ariaLabel}[^>]*>/);
    expect(languageToggle).toMatch(/<a\b[^>]*lang={targetLocale}[^>]*>/);
    expect(languageToggle).toMatch(/<a\b[^>]*hreflang={targetLocale}[^>]*>/);
  });

  it("keeps brand and language toggle on the first mobile nav row", () => {
    expect(css).toMatch(/\.site-nav__brand\s*\{[^}]*color:\s*var\(--solar-deep\);/s);
    expect(css).toMatch(/@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*\.site-nav\s*\{[^}]*grid-template-columns:\s*1fr auto;/);
    expect(css).toMatch(/\.site-nav__brand\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*1;/s);
    expect(css).toMatch(/\.language-toggle\s*\{[^}]*grid-column:\s*2;[^}]*grid-row:\s*1;/s);
    expect(css).toMatch(/\.site-nav nav\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*grid-row:\s*2;/s);
  });
});
