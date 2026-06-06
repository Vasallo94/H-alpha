# H-alpha Educational Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual static educational site that explains H-alpha solar telescope physics, safety, and the final real solar image.

**Architecture:** Use Astro as a static-first content shell with React islands only for the interactive simulators. Keep all educational copy, glossary text, safety warnings, and the seasonal eclipse callout in typed content files so Spanish and English stay synchronized.

**Tech Stack:** Astro, TypeScript, React islands, CSS modules/global CSS, Vitest for content helpers, Playwright for browser smoke tests, static deployment via GitHub Pages or Cloudflare Pages.

---

## File Structure

Create the Astro app in the repository root.

```text
astro.config.mjs
package.json
tsconfig.json
src/
  components/
    GlossaryTerm.astro
    LanguageToggle.astro
    SiteNav.astro
    sections/
      BandpassSection.astro
      FinalImageSection.astro
      FilterComparisonSection.astro
      HeroSection.astro
      OpticalSystemSection.astro
      SafetySection.astro
      SpectrumSection.astro
    interactive/
      BandpassTuningSimulator.tsx
      FilterComparison.tsx
      SpectrumExplorer.tsx
  content/
    siteCopy.ts
    siteCopy.test.ts
  i18n/
    routes.ts
    routes.test.ts
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    en/
      index.astro
  styles/
    global.css
tests/
  h-alpha-site.spec.ts
public/
  images/
    sun-h-alpha.png
.github/
  workflows/
    deploy-pages.yml
```

Responsibilities:

- `siteCopy.ts`: all bilingual educational content, glossary entries, warnings, image annotations, and seasonal callout.
- `routes.ts`: locale helpers and canonical routes.
- Astro section components: static narrative and layout.
- React interactive components: small client-only modules for spectrum, filters, and bandpass/tuning.
- Tests: content consistency, route helpers, desktop/mobile rendering, language switching, and interactive controls.

## Task 1: Scaffold Astro Static App

**Files:**
- Create/Modify: `package.json`
- Create/Modify: `astro.config.mjs`
- Create/Modify: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Scaffold the app**

Run:

```bash
npm create astro@latest . -- --template minimal --install --typescript strict --no-git
```

Expected: Astro creates `package.json`, `astro.config.mjs`, `tsconfig.json`, and `src/pages/index.astro` without reinitializing git.

- [ ] **Step 2: Add React and test dependencies**

Run:

```bash
npm install @astrojs/react react react-dom
npm install -D @playwright/test vitest
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Configure Astro for static output, React islands, and i18n**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  output: "static",
  integrations: [react()],
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

- [ ] **Step 4: Add scripts**

Ensure `package.json` contains these scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run && playwright test",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 5: Verify build baseline**

Run:

```bash
npm run build
```

Expected: PASS and `dist/` is generated.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tsconfig.json src
git commit -m "chore: scaffold Astro static site"
```

## Task 2: Add Locale Routes And Typed Content Contract

**Files:**
- Create: `src/i18n/routes.ts`
- Create: `src/i18n/routes.test.ts`
- Create: `src/content/siteCopy.ts`
- Create: `src/content/siteCopy.test.ts`

- [ ] **Step 1: Write route helper tests**

Create `src/i18n/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getLocaleFromPath, getLocalizedPath, locales } from "./routes";

describe("i18n routes", () => {
  it("supports Spanish and English", () => {
    expect(locales).toEqual(["es", "en"]);
  });

  it("uses Spanish for the root path", () => {
    expect(getLocaleFromPath("/")).toBe("es");
  });

  it("detects English from /en", () => {
    expect(getLocaleFromPath("/en/")).toBe("en");
  });

  it("builds localized paths", () => {
    expect(getLocalizedPath("es")).toBe("/");
    expect(getLocalizedPath("en")).toBe("/en/");
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test:unit -- src/i18n/routes.test.ts
```

Expected: FAIL because `src/i18n/routes.ts` does not exist.

- [ ] **Step 3: Implement route helpers**

Create `src/i18n/routes.ts`:

```ts
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromPath(pathname: string): Locale {
  return pathname.replace(/\/+$/, "").startsWith("/en") ? "en" : "es";
}

export function getLocalizedPath(locale: Locale): string {
  return locale === "es" ? "/" : "/en/";
}
```

- [ ] **Step 4: Write content consistency tests**

Create `src/content/siteCopy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteCopy } from "./siteCopy";

describe("site copy", () => {
  it("has Spanish and English content", () => {
    expect(Object.keys(siteCopy)).toEqual(["es", "en"]);
  });

  it("keeps glossary keys synchronized", () => {
    expect(Object.keys(siteCopy.es.glossary)).toEqual(Object.keys(siteCopy.en.glossary));
  });

  it("keeps seasonal callout configurable in both languages", () => {
    expect(siteCopy.es.seasonalSafetyCallout.enabled).toBe(true);
    expect(siteCopy.en.seasonalSafetyCallout.enabled).toBe(true);
    expect(siteCopy.es.seasonalSafetyCallout.date).toBe("2026-08-12");
    expect(siteCopy.en.seasonalSafetyCallout.date).toBe("2026-08-12");
  });
});
```

- [ ] **Step 5: Run tests and verify failure**

Run:

```bash
npm run test:unit -- src/content/siteCopy.test.ts
```

Expected: FAIL because `src/content/siteCopy.ts` does not exist.

- [ ] **Step 6: Implement initial typed content**

Create `src/content/siteCopy.ts`:

```ts
import type { Locale } from "../i18n/routes";

type GlossaryEntry = {
  term: string;
  short: string;
  detail: string;
};

type SeasonalSafetyCallout = {
  enabled: boolean;
  date: "2026-08-12";
  title: string;
  body: string;
};

type SiteCopy = {
  meta: { title: string; description: string };
  nav: { physics: string; filters: string; safety: string; image: string };
  languageLabel: string;
  hero: { eyebrow: string; title: string; intro: string };
  glossary: Record<string, GlossaryEntry>;
  seasonalSafetyCallout: SeasonalSafetyCallout;
};

export const siteCopy: Record<Locale, SiteCopy> = {
  es: {
    meta: {
      title: "Cómo funciona un telescopio H-alpha",
      description: "Una guía visual sobre la física, seguridad y óptica de los telescopios solares H-alpha.",
    },
    nav: { physics: "Física", filters: "Filtros", safety: "Seguridad", image: "Imagen real" },
    languageLabel: "English",
    hero: {
      eyebrow: "Sol en una sola línea espectral",
      title: "Cómo un telescopio H-alpha revela la cromosfera",
      intro: "Una explicación visual, segura y bilingüe de la línea H-alpha, los etalones, el tuning y los filtros solares.",
    },
    glossary: {
      angstrom: {
        term: "angstrom",
        short: "Unidad de longitud muy pequeña usada en espectroscopía.",
        detail: "Un angstrom equivale a 0,1 nanómetros. En H-alpha se usa para hablar de anchuras de banda extremadamente estrechas.",
      },
      bandpass: {
        term: "bandpass",
        short: "La anchura de longitudes de onda que deja pasar un filtro.",
        detail: "En H-alpha, un bandpass menor de 0,5 A ayuda a aislar la cromosfera y aumentar el contraste de filamentos y protuberancias.",
      },
      etalon: {
        term: "etalon",
        short: "Filtro interferencial que selecciona una ventana espectral muy estrecha.",
        detail: "Un etalon usa interferencia entre superficies ópticas para dejar pasar longitudes de onda concretas y rechazar muchas otras.",
      },
      blockingFilter: {
        term: "blocking filter",
        short: "Filtro de seguridad que bloquea luz residual peligrosa.",
        detail: "En un telescopio H-alpha visual o de imagen, el blocking filter forma parte del sistema seguro. No debe retirarse ni sustituirse por piezas improvisadas.",
      },
    },
    seasonalSafetyCallout: {
      enabled: true,
      date: "2026-08-12",
      title: "Contexto 2026: eclipse total del 12 de agosto",
      body: "Las gafas de eclipse sirven para mirar el Sol sin aumento cuando cumplen ISO 12312-2 y vienen de proveedores fiables. No sirven para mirar a través de telescopios, prismáticos o cámaras.",
    },
  },
  en: {
    meta: {
      title: "How an H-alpha Telescope Works",
      description: "A visual guide to the physics, safety, and optics of H-alpha solar telescopes.",
    },
    nav: { physics: "Physics", filters: "Filters", safety: "Safety", image: "Real image" },
    languageLabel: "Español",
    hero: {
      eyebrow: "The Sun in one spectral line",
      title: "How an H-alpha telescope reveals the chromosphere",
      intro: "A visual, safe, bilingual explanation of the H-alpha line, etalons, tuning, and solar filters.",
    },
    glossary: {
      angstrom: {
        term: "angstrom",
        short: "A very small length unit used in spectroscopy.",
        detail: "One angstrom is 0.1 nanometers. In H-alpha observing, it describes extremely narrow filter bandwidths.",
      },
      bandpass: {
        term: "bandpass",
        short: "The range of wavelengths a filter allows through.",
        detail: "In H-alpha, a bandpass below 0.5 A helps isolate the chromosphere and increase contrast in filaments and prominences.",
      },
      etalon: {
        term: "etalon",
        short: "An interference filter that selects a very narrow spectral window.",
        detail: "An etalon uses interference between optical surfaces to transmit selected wavelengths and reject many others.",
      },
      blockingFilter: {
        term: "blocking filter",
        short: "A safety filter that blocks dangerous residual light.",
        detail: "In visual or imaging H-alpha telescopes, the blocking filter is part of the safe system. It must not be removed or replaced with improvised parts.",
      },
    },
    seasonalSafetyCallout: {
      enabled: true,
      date: "2026-08-12",
      title: "2026 Context: August 12 Total Solar Eclipse",
      body: "Eclipse glasses are for unmagnified solar viewing when they comply with ISO 12312-2 and come from reliable suppliers. They are not for use through telescopes, binoculars, or cameras.",
    },
  },
};
```

- [ ] **Step 7: Run unit tests**

Run:

```bash
npm run test:unit -- src/i18n/routes.test.ts src/content/siteCopy.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/i18n src/content
git commit -m "feat: add bilingual content contract"
```

## Task 3: Add Base Layout, Navigation, And Global Visual System

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteNav.astro`
- Create: `src/components/LanguageToggle.astro`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Create global styles**

Create `src/styles/global.css` with a clear textbook-plus-instrument visual system:

```css
:root {
  color-scheme: light;
  --ink: #182026;
  --muted: #5c6872;
  --paper: #f8f5ee;
  --surface: #ffffff;
  --line: #d9dedf;
  --solar: #d94332;
  --solar-deep: #9d241c;
  --instrument: #182b36;
  --accent: #2d7d8f;
  --shadow: 0 18px 45px rgba(22, 31, 38, 0.11);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  line-height: 1.6;
}

a { color: inherit; }

button, input { font: inherit; }

.page-shell {
  min-height: 100vh;
}

.section {
  padding: clamp(56px, 8vw, 108px) clamp(20px, 5vw, 72px);
}

.section__inner {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--solar-deep);
  font-size: 0.78rem;
  font-weight: 760;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-title {
  max-width: 780px;
  margin: 0;
  font-size: clamp(2rem, 5vw, 4.6rem);
  line-height: 1.02;
  letter-spacing: 0;
}

.lead {
  max-width: 720px;
  color: var(--muted);
  font-size: clamp(1.05rem, 2vw, 1.32rem);
}

.instrument-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.warning {
  border-left: 5px solid var(--solar);
  background: #fff7f3;
  padding: 18px 20px;
}

@media (max-width: 720px) {
  .section {
    padding: 44px 18px;
  }
}
```

- [ ] **Step 2: Create language toggle**

Create `src/components/LanguageToggle.astro`:

```astro
---
import type { Locale } from "../i18n/routes";
import { getLocalizedPath } from "../i18n/routes";

interface Props {
  locale: Locale;
  label: string;
}

const { locale, label } = Astro.props;
const targetLocale = locale === "es" ? "en" : "es";
---

<a class="language-toggle" href={getLocalizedPath(targetLocale)} aria-label={label}>
  {label}
</a>
```

- [ ] **Step 3: Create site nav**

Create `src/components/SiteNav.astro`:

```astro
---
import type { Locale } from "../i18n/routes";
import { siteCopy } from "../content/siteCopy";
import LanguageToggle from "./LanguageToggle.astro";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const copy = siteCopy[locale];
---

<header class="site-nav">
  <a class="site-nav__brand" href={locale === "es" ? "/" : "/en/"}>H-alpha</a>
  <nav aria-label="Primary">
    <a href="#physics">{copy.nav.physics}</a>
    <a href="#filters">{copy.nav.filters}</a>
    <a href="#safety">{copy.nav.safety}</a>
    <a href="#image">{copy.nav.image}</a>
  </nav>
  <LanguageToggle locale={locale} label={copy.languageLabel} />
</header>
```

- [ ] **Step 4: Create base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import type { Locale } from "../i18n/routes";
import { siteCopy } from "../content/siteCopy";
import SiteNav from "../components/SiteNav.astro";
import "../styles/global.css";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const copy = siteCopy[locale];
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={copy.meta.description} />
    <title>{copy.meta.title}</title>
  </head>
  <body>
    <div class="page-shell">
      <SiteNav locale={locale} />
      <main>
        <slot />
      </main>
    </div>
  </body>
</html>
```

- [ ] **Step 5: Add nav styles**

Append to `src/styles/global.css`:

```css
.site-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 14px clamp(18px, 5vw, 56px);
  border-bottom: 1px solid rgba(24, 32, 38, 0.1);
  background: rgba(248, 245, 238, 0.92);
  backdrop-filter: blur(16px);
}

.site-nav__brand {
  color: var(--solar);
  font-weight: 820;
  text-decoration: none;
}

.site-nav nav {
  display: flex;
  justify-content: center;
  gap: clamp(14px, 3vw, 34px);
  color: var(--muted);
  font-size: 0.95rem;
}

.site-nav nav a,
.language-toggle {
  text-decoration: none;
}

.language-toggle {
  min-width: 78px;
  color: var(--instrument);
  font-weight: 700;
  text-align: right;
}

@media (max-width: 760px) {
  .site-nav {
    grid-template-columns: 1fr auto;
  }

  .site-nav nav {
    grid-column: 1 / -1;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 2px;
  }
}
```

- [ ] **Step 6: Wire pages to layout**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout locale="es">
  <section class="section">
    <div class="section__inner">
      <p class="eyebrow">Sol en H-alpha</p>
      <h1 class="section-title">Cómo funciona un telescopio H-alpha</h1>
      <p class="lead">Una guía visual sobre la física, seguridad y óptica que hacen visible la cromosfera solar.</p>
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/en/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
---

<BaseLayout locale="en">
  <section class="section">
    <div class="section__inner">
      <p class="eyebrow">The Sun in H-alpha</p>
      <h1 class="section-title">How an H-alpha telescope works</h1>
      <p class="lead">A visual guide to the physics, safety, and optics that make the solar chromosphere visible.</p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 7: Verify build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "feat: add bilingual layout and navigation"
```

## Task 4: Build Glossary Tooltips

**Files:**
- Create: `src/components/GlossaryTerm.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/sections/*.astro` in later tasks

- [ ] **Step 1: Create tooltip component**

Create `src/components/GlossaryTerm.astro`:

```astro
---
interface Props {
  term: string;
  short: string;
  detail: string;
}

const { term, short, detail } = Astro.props;
---

<span class="glossary-term">
  <button class="glossary-term__trigger" type="button" aria-describedby={`glossary-${term}`}>
    <slot>{term}</slot>
  </button>
  <span class="glossary-term__popover" id={`glossary-${term}`} role="tooltip">
    <strong>{short}</strong>
    <span>{detail}</span>
  </span>
</span>
```

- [ ] **Step 2: Add tooltip styles**

Append to `src/styles/global.css`:

```css
.glossary-term {
  position: relative;
  display: inline-flex;
}

.glossary-term__trigger {
  border: 0;
  border-bottom: 2px dotted color-mix(in srgb, var(--solar), transparent 20%);
  background: transparent;
  color: var(--solar-deep);
  cursor: help;
  padding: 0 1px;
}

.glossary-term__popover {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  z-index: 30;
  display: grid;
  gap: 6px;
  width: min(300px, calc(100vw - 36px));
  transform: translateX(-50%);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow);
  color: var(--ink);
  font-size: 0.92rem;
  line-height: 1.45;
  opacity: 0;
  pointer-events: none;
  padding: 12px 14px;
  transition: opacity 160ms ease;
}

.glossary-term__trigger:hover + .glossary-term__popover,
.glossary-term__trigger:focus + .glossary-term__popover {
  opacity: 1;
}

@media (max-width: 620px) {
  .glossary-term__popover {
    left: 0;
    transform: none;
  }
}
```

- [ ] **Step 3: Verify build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/GlossaryTerm.astro src/styles/global.css
git commit -m "feat: add accessible glossary tooltips"
```

## Task 5: Implement Narrative Sections

**Files:**
- Create: `src/components/sections/HeroSection.astro`
- Create: `src/components/sections/SpectrumSection.astro`
- Create: `src/components/sections/OpticalSystemSection.astro`
- Create: `src/components/sections/SafetySection.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Create hero section**

Create `src/components/sections/HeroSection.astro`:

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";

interface Props {
  locale: Locale;
}

const copy = siteCopy[Astro.props.locale];
---

<section class="section hero-section" id="physics">
  <div class="section__inner hero-section__grid">
    <div>
      <p class="eyebrow">{copy.hero.eyebrow}</p>
      <h1 class="section-title">{copy.hero.title}</h1>
      <p class="lead">{copy.hero.intro}</p>
    </div>
    <div class="hero-section__sun" aria-hidden="true"></div>
  </div>
</section>
```

- [ ] **Step 2: Create spectrum section shell**

Create `src/components/sections/SpectrumSection.astro`:

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";
import GlossaryTerm from "../GlossaryTerm.astro";

const copy = siteCopy[Astro.props.locale as Locale];
---

<section class="section" id="spectrum">
  <div class="section__inner">
    <p class="eyebrow">656.28 nm</p>
    <h2 class="section-title">H-alpha is a line, not just a color</h2>
    <p class="lead">
      The telescope selects a narrow <GlossaryTerm {...copy.glossary.bandpass}>bandpass</GlossaryTerm>
      around hydrogen-alpha, revealing structures in the solar chromosphere.
    </p>
  </div>
</section>
```

- [ ] **Step 3: Create optical system section shell**

Create `src/components/sections/OpticalSystemSection.astro`:

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";
import GlossaryTerm from "../GlossaryTerm.astro";

const copy = siteCopy[Astro.props.locale as Locale];
---

<section class="section" id="optics">
  <div class="section__inner">
    <p class="eyebrow">Optical chain</p>
    <h2 class="section-title">A safe H-alpha telescope is a system</h2>
    <p class="lead">
      The <GlossaryTerm {...copy.glossary.etalon}>etalon</GlossaryTerm> selects the spectral line,
      while the <GlossaryTerm {...copy.glossary.blockingFilter}>blocking filter</GlossaryTerm>
      keeps dangerous residual light out of the final image path.
    </p>
  </div>
</section>
```

- [ ] **Step 4: Create safety section shell**

Create `src/components/sections/SafetySection.astro`:

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";

const copy = siteCopy[Astro.props.locale as Locale];
---

<section class="section" id="safety">
  <div class="section__inner">
    <p class="eyebrow">Solar safety</p>
    <h2 class="section-title">Solar filters are not interchangeable</h2>
    {copy.seasonalSafetyCallout.enabled && (
      <aside class="warning">
        <strong>{copy.seasonalSafetyCallout.title}</strong>
        <p>{copy.seasonalSafetyCallout.body}</p>
      </aside>
    )}
  </div>
</section>
```

- [ ] **Step 5: Add section styles**

Append to `src/styles/global.css`:

```css
.hero-section {
  min-height: calc(100vh - 80px);
  display: grid;
  align-items: center;
}

.hero-section__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(240px, 0.7fr);
  gap: clamp(32px, 6vw, 86px);
  align-items: center;
}

.hero-section__sun {
  aspect-ratio: 1;
  width: min(420px, 100%);
  justify-self: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at 42% 38%, #ffd1ad 0 7%, #e6533f 32%, #8f2119 66%, #54100c 100%);
  box-shadow: 0 0 80px rgba(217, 67, 50, 0.28);
}

@media (max-width: 780px) {
  .hero-section {
    min-height: auto;
  }

  .hero-section__grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Wire sections into both pages**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import HeroSection from "../components/sections/HeroSection.astro";
import SpectrumSection from "../components/sections/SpectrumSection.astro";
import OpticalSystemSection from "../components/sections/OpticalSystemSection.astro";
import SafetySection from "../components/sections/SafetySection.astro";
---

<BaseLayout locale="es">
  <HeroSection locale="es" />
  <SpectrumSection locale="es" />
  <OpticalSystemSection locale="es" />
  <SafetySection locale="es" />
</BaseLayout>
```

Replace `src/pages/en/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import HeroSection from "../../components/sections/HeroSection.astro";
import SpectrumSection from "../../components/sections/SpectrumSection.astro";
import OpticalSystemSection from "../../components/sections/OpticalSystemSection.astro";
import SafetySection from "../../components/sections/SafetySection.astro";
---

<BaseLayout locale="en">
  <HeroSection locale="en" />
  <SpectrumSection locale="en" />
  <OpticalSystemSection locale="en" />
  <SafetySection locale="en" />
</BaseLayout>
```

- [ ] **Step 7: Verify build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "feat: add core narrative sections"
```

## Task 6: Add Interactive Spectrum And Filter Modules

**Files:**
- Create: `src/components/interactive/SpectrumExplorer.tsx`
- Create: `src/components/interactive/FilterComparison.tsx`
- Create: `src/components/sections/FilterComparisonSection.astro`
- Modify: `src/components/sections/SpectrumSection.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Create spectrum explorer**

Create `src/components/interactive/SpectrumExplorer.tsx`:

```tsx
export function SpectrumExplorer() {
  return (
    <div className="instrument-panel spectrum-explorer" aria-label="H-alpha spectrum explorer">
      <div className="spectrum-explorer__bar">
        <span className="spectrum-explorer__line" />
      </div>
      <p>
        H-alpha sits at <strong>656.28 nm</strong>, deep in the red part of the visible spectrum.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create filter comparison**

Create `src/components/interactive/FilterComparison.tsx`:

```tsx
const filters = [
  {
    name: "Eclipse glasses",
    output: "Safe unmagnified solar disk",
    detail: "Reduces intensity for direct viewing without optics.",
  },
  {
    name: "White-light telescope filter",
    output: "Photosphere and sunspots",
    detail: "Fits over the front aperture of an optical instrument.",
  },
  {
    name: "H-alpha telescope",
    output: "Chromosphere, filaments, prominences",
    detail: "Combines energy rejection, etalon selection, tuning, and blocking filter safety.",
  },
];

export function FilterComparison() {
  return (
    <div className="filter-comparison" aria-label="Solar filter comparison">
      {filters.map((filter) => (
        <article className="instrument-panel filter-comparison__card" key={filter.name}>
          <h3>{filter.name}</h3>
          <strong>{filter.output}</strong>
          <p>{filter.detail}</p>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Add filter section**

Create `src/components/sections/FilterComparisonSection.astro`:

```astro
---
import { FilterComparison } from "../interactive/FilterComparison";
---

<section class="section" id="filters">
  <div class="section__inner">
    <p class="eyebrow">Filters</p>
    <h2 class="section-title">Eclipse glasses and H-alpha telescopes solve different problems</h2>
    <p class="lead">One protects unaided eyes from brightness. The other is a complete optical system for isolating chromospheric light.</p>
    <FilterComparison client:load />
  </div>
</section>
```

- [ ] **Step 4: Embed spectrum explorer**

Modify `src/components/sections/SpectrumSection.astro` to import and render the explorer after the lead:

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";
import GlossaryTerm from "../GlossaryTerm.astro";
import { SpectrumExplorer } from "../interactive/SpectrumExplorer";

const copy = siteCopy[Astro.props.locale as Locale];
---

<section class="section" id="spectrum">
  <div class="section__inner">
    <p class="eyebrow">656.28 nm</p>
    <h2 class="section-title">H-alpha is a line, not just a color</h2>
    <p class="lead">
      The telescope selects a narrow <GlossaryTerm {...copy.glossary.bandpass}>bandpass</GlossaryTerm>
      around hydrogen-alpha, revealing structures in the solar chromosphere.
    </p>
    <SpectrumExplorer client:load />
  </div>
</section>
```

- [ ] **Step 5: Add styles**

Append to `src/styles/global.css`:

```css
.spectrum-explorer {
  margin-top: 30px;
  padding: 22px;
}

.spectrum-explorer__bar {
  position: relative;
  height: 76px;
  border-radius: 8px;
  background: linear-gradient(90deg, #542d87, #2556c7, #1aa675, #f3d44b, #f08324, #c72d2d);
}

.spectrum-explorer__line {
  position: absolute;
  top: -10px;
  bottom: -10px;
  left: 84%;
  width: 4px;
  border-radius: 99px;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(217, 67, 50, 0.8);
}

.filter-comparison {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.filter-comparison__card {
  padding: 20px;
}

.filter-comparison__card h3 {
  margin-top: 0;
}

@media (max-width: 860px) {
  .filter-comparison {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Add filter section to pages**

Import `FilterComparisonSection` in both page files and place it between `SpectrumSection` and `OpticalSystemSection`.

- [ ] **Step 7: Verify build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src
git commit -m "feat: add spectrum and filter interactions"
```

## Task 7: Add Bandpass Tuning Simulator

**Files:**
- Create: `src/components/interactive/BandpassTuningSimulator.tsx`
- Create: `src/components/sections/BandpassSection.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create simulator**

Create `src/components/interactive/BandpassTuningSimulator.tsx`:

```tsx
import { useMemo, useState } from "react";

export function BandpassTuningSimulator() {
  const [width, setWidth] = useState(0.5);
  const [offset, setOffset] = useState(0);

  const label = useMemo(() => {
    if (Math.abs(offset) > 0.25) return "Off-band: prominences and wing detail change";
    if (width <= 0.5) return "Narrow band: chromosphere contrast increases";
    return "Wide band: more photospheric light leaks through";
  }, [offset, width]);

  return (
    <div className="instrument-panel bandpass-sim">
      <div className="bandpass-sim__plot" aria-hidden="true">
        <span className="bandpass-sim__center" />
        <span
          className="bandpass-sim__window"
          style={{
            width: `${Math.max(16, width * 80)}px`,
            transform: `translateX(calc(-50% + ${offset * 80}px))`,
          }}
        />
      </div>
      <label>
        Bandpass: {width.toFixed(2)} A
        <input min="0.3" max="1.2" step="0.05" type="range" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
      </label>
      <label>
        Tuning offset: {offset.toFixed(2)} A
        <input min="-0.5" max="0.5" step="0.05" type="range" value={offset} onChange={(event) => setOffset(Number(event.target.value))} />
      </label>
      <p>{label}</p>
    </div>
  );
}
```

- [ ] **Step 2: Create bandpass section**

Create `src/components/sections/BandpassSection.astro`:

```astro
---
import { BandpassTuningSimulator } from "../interactive/BandpassTuningSimulator";
---

<section class="section" id="bandpass">
  <div class="section__inner">
    <p class="eyebrow">Bandpass and tuning</p>
    <h2 class="section-title">Tiny spectral changes make visible differences</h2>
    <p class="lead">Pressure tuning shifts the passband slightly. That is why disk detail and prominences often have different sweet spots.</p>
    <BandpassTuningSimulator client:load />
  </div>
</section>
```

- [ ] **Step 3: Add simulator styles**

Append to `src/styles/global.css`:

```css
.bandpass-sim {
  display: grid;
  gap: 18px;
  margin-top: 30px;
  padding: 22px;
}

.bandpass-sim__plot {
  position: relative;
  height: 160px;
  border-left: 2px solid var(--instrument);
  border-bottom: 2px solid var(--instrument);
  background:
    linear-gradient(180deg, transparent 64%, rgba(217, 67, 50, 0.16) 64% 66%, transparent 66%),
    linear-gradient(90deg, rgba(217, 67, 50, 0.03), rgba(217, 67, 50, 0.12), rgba(217, 67, 50, 0.03));
}

.bandpass-sim__center {
  position: absolute;
  left: 50%;
  top: 18px;
  bottom: 0;
  width: 2px;
  background: var(--solar);
}

.bandpass-sim__window {
  position: absolute;
  left: 50%;
  top: 22px;
  bottom: 14px;
  border-left: 3px solid var(--solar);
  border-right: 3px solid var(--solar);
  background: rgba(217, 67, 50, 0.2);
}

.bandpass-sim label {
  display: grid;
  gap: 8px;
  color: var(--instrument);
  font-weight: 700;
}
```

- [ ] **Step 4: Add section to pages**

Import `BandpassSection` in both page files and place it after `OpticalSystemSection`.

- [ ] **Step 5: Verify build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add bandpass tuning simulator"
```

## Task 8: Add Real Solar Image Section

**Files:**
- Create: `src/components/sections/FinalImageSection.astro`
- Copy: `/Users/enriquebook/Personal/Astronomía/Procesado/2026-05-28-Sol/master1_disco_FINAL.png` to `public/images/sun-h-alpha.png`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Copy source image**

Run:

```bash
mkdir -p public/images
cp "/Users/enriquebook/Personal/Astronomía/Procesado/2026-05-28-Sol/master1_disco_FINAL.png" public/images/sun-h-alpha.png
```

Expected: `public/images/sun-h-alpha.png` exists.

- [ ] **Step 2: Create final image section**

Create `src/components/sections/FinalImageSection.astro`:

```astro
---
interface Props {
  locale: "es" | "en";
}

const isSpanish = Astro.props.locale === "es";
---

<section class="section final-image-section" id="image">
  <div class="section__inner">
    <p class="eyebrow">{isSpanish ? "Imagen real" : "Real image"}</p>
    <h2 class="section-title">{isSpanish ? "De la física a una imagen H-alpha" : "From physics to an H-alpha image"}</h2>
    <p class="lead">
      {isSpanish
        ? "Esta imagen fue tomada con un Sky-Watcher HelioStar 100Ha. La textura del disco es la cromosfera seleccionada por el sistema H-alpha."
        : "This image was captured with a Sky-Watcher HelioStar 100Ha. The disk texture is the chromosphere selected by the H-alpha system."}
    </p>
    <figure class="final-image-section__figure">
      <img src="/images/sun-h-alpha.png" alt={isSpanish ? "Disco solar capturado en H-alpha" : "Solar disk captured in H-alpha"} loading="lazy" />
      <figcaption>
        {isSpanish ? "HelioStar 100Ha, bandpass menor de 0,5 A." : "HelioStar 100Ha, bandpass below 0.5 A."}
      </figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 3: Add image styles**

Append to `src/styles/global.css`:

```css
.final-image-section {
  background: #101417;
  color: #f8f5ee;
}

.final-image-section .lead {
  color: #cbd2d2;
}

.final-image-section__figure {
  margin: 34px 0 0;
}

.final-image-section__figure img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
}

.final-image-section__figure figcaption {
  color: #b8c0c0;
  margin-top: 12px;
}
```

- [ ] **Step 4: Add final section to pages**

Import `FinalImageSection` in both page files and place it last.

- [ ] **Step 5: Verify build**

Run:

```bash
npm run build
```

Expected: PASS and final page includes `/images/sun-h-alpha.png`.

- [ ] **Step 6: Commit**

```bash
git add public/images/sun-h-alpha.png src
git commit -m "feat: add real H-alpha solar image"
```

## Task 9: Add Playwright Smoke Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/h-alpha-site.spec.ts`

- [ ] **Step 1: Install Playwright browsers**

Run:

```bash
npx playwright install chromium
```

Expected: Chromium browser is installed for Playwright.

- [ ] **Step 2: Add Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

- [ ] **Step 3: Add smoke tests**

Create `tests/h-alpha-site.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("Spanish homepage renders the educational story", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /H-alpha|cromosfera/i })).toBeVisible();
  await expect(page.getByText(/eclipse total del 12 de agosto/i)).toBeVisible();
  await expect(page.getByAltText(/Disco solar capturado/i)).toBeVisible();
});

test("English homepage renders through language route", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { name: /H-alpha|chromosphere/i })).toBeVisible();
  await expect(page.getByText(/August 12 Total Solar Eclipse/i)).toBeVisible();
});

test("bandpass simulator responds to controls", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator('input[type="range"]').first();
  await slider.fill("0.3");
  await expect(page.getByText(/Narrow band|banda/i)).toBeVisible();
});
```

- [ ] **Step 4: Run e2e tests**

Run:

```bash
npm run test:e2e
```

Expected: PASS on desktop and mobile projects.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests package.json package-lock.json
git commit -m "test: add browser smoke coverage"
```

## Task 10: Add Static Deployment Workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Leave unchanged: `astro.config.mjs`

- [ ] **Step 1: Add GitHub Pages workflow**

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Chromium
        run: npx playwright install chromium --with-deps
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Keep deployment root-compatible**

Use the root-compatible `astro.config.mjs` from Task 1 for the first deployment. This works for Cloudflare Pages and for GitHub Pages when deployed at a root domain or custom domain. If the project is later deployed under a GitHub Pages repository subpath, add the exact `site` and `base` values only after the final public URL is known.

- [ ] **Step 3: Verify build and tests**

Run:

```bash
npm test && npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy-pages.yml astro.config.mjs
git commit -m "ci: add static Pages deployment"
```

## Task 11: Final Verification And Polish

**Files:**
- Modify only files needed to fix verification findings.

- [ ] **Step 1: Run full local verification**

Run:

```bash
npm test && npm run build
```

Expected: PASS.

- [ ] **Step 2: Start local dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: site is available at `http://127.0.0.1:4321/`.

- [ ] **Step 3: Check browser views**

Open these URLs:

```text
http://127.0.0.1:4321/
http://127.0.0.1:4321/en/
```

Verify:

- Desktop and mobile layouts do not overflow.
- Navigation anchors work.
- Tooltips are visible on hover/focus and usable on mobile tap.
- Spectrum module renders a visible H-alpha line.
- Filter comparison cards stack cleanly on mobile.
- Bandpass slider changes explanatory text.
- Final image loads and is not distorted.
- Seasonal eclipse callout is visible in both languages.

- [ ] **Step 4: Review safety wording**

Confirm the site clearly states:

- Eclipse glasses are for unmagnified direct viewing only.
- Optical devices require proper front-mounted solar filters or dedicated solar systems.
- An H-alpha telescope must not be used without its matching blocking filter/solar diagonal.
- Improvised filters are unsafe.

- [ ] **Step 5: Commit final fixes**

If verification required changes:

```bash
git add src tests public .github package.json package-lock.json astro.config.mjs
git commit -m "fix: polish H-alpha site verification findings"
```

If no changes were needed, do not create an empty commit.

## Self-Review

- Spec coverage: covered static deployment, bilingual content, educational narrative, glossary/tooltips, filter comparison, bandpass/tuning simulator, seasonal eclipse callout, real image, safety copy, and verification.
- Placeholder scan: executable steps contain concrete commands, code, paths, and expected outcomes.
- Type consistency: locale keys are `es` and `en`; `siteCopy`, `Locale`, and component prop names are consistent across tasks.
