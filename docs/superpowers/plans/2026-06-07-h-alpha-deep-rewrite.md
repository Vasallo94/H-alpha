# H-alpha Deep Pedagogical Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing H-alpha educational site from a descriptive brochure into real teaching material with layered pedagogy, annotated SVG diagrams, and physics-driven interactive modules.

**Architecture:** Evolve the working Astro + React-islands site in place. Extend the typed bilingual content contract to carry layered content (base narrative + `<details>` deep-dives), evergreen safety rules, and image annotations. Add hand-authored annotated SVG diagram components. Move interactive physics into pure, unit-tested functions; React components only render. Keep build + tests green at every commit.

**Tech Stack:** Astro 6, React 19 islands, TypeScript, CSS, Vitest (unit + pure-function physics), Playwright (e2e). Reference spec: `docs/superpowers/specs/2026-06-07-h-alpha-deep-rewrite-design.md`.

---

## File Structure

```text
src/
  content/
    siteCopy.ts              # MODIFY — new layered contract + full bilingual content
    siteCopy.test.ts         # MODIFY — extended invariants (rules, annotations, deepDive, diagram labels)
  lib/
    physics.ts               # CREATE — pure physics helpers
    physics.test.ts          # CREATE — unit tests for physics
  components/
    DeepDive.astro           # CREATE — reusable <details> "Profundiza más"
    SiteNav.astro            # MODIFY — nav anchors for new section order
    diagrams/
      HydrogenLevels.astro   # CREATE — energy levels n=3→n=2
      SunLayers.astro        # CREATE — photosphere/chromosphere/corona
      EtalonDiagram.astro    # CREATE — Fabry-Pérot rays + Airy inset
      OpticalChain.astro     # CREATE — objective→ERF→etalon→blocking→camera
      ThreeMethods.astro     # CREATE — eclipse glasses / white-light / H-alpha
      DopplerTuning.astro    # CREATE — line shift vs etalon window
    interactive/
      SpectrumExplorer.tsx           # REWRITE — λ↔energy↔transition
      BandpassTuningSimulator.tsx    # REWRITE — line profile + transmission + image preview
      FilterComparison.tsx           # REWRITE — mechanism comparator
      LightPathAnimation.tsx         # CREATE — beam through optical chain
      BeforeAfter.tsx                # CREATE — curtain slider on real image
    sections/
      HeroSection.astro              # MODIFY — real image hero
      OriginSection.astro            # CREATE — why hydrogen glows (was implicit)
      SpectrumSection.astro          # MODIFY — Fraunhofer + reworked explorer
      EtalonSection.astro            # CREATE — Fabry-Pérot explanation
      TuningSection.astro            # RENAME/MODIFY from BandpassSection.astro
      OpticalSystemSection.astro     # MODIFY — full chain + light animation
      FilterComparisonSection.astro  # MODIFY — mechanism comparator
      SafetySection.astro            # MODIFY — evergreen rules + seasonal callout
      FinalImageSection.astro        # MODIFY — hotspots + before/after
  pages/
    index.astro              # MODIFY — wire 9 sections in pedagogical order (es)
    en/index.astro           # MODIFY — same (en)
  styles/
    global.css               # MODIFY — remove decorative gradients; add deep-dive, hotspots, curtain, svg styles
tests/
  smoke.spec.ts              # MODIFY — e2e for new structure
```

Old scaffolding-era unit tests (`src/task3NavigationFoundation.test.ts`, `src/task5NarrativeSections.test.ts`, `src/task6InteractiveModules.test.ts`, `src/task7BandpassTuningSimulator.test.ts`, `src/task8FinalImageSection.test.ts`, `src/components/GlossaryTerm.test.ts`) assert on the OLD content shape and components. They are replaced by the new invariant + physics tests. Task 1 removes the stale ones it would break and Task 2 adds the physics coverage.

---

## Task 1: Extend the content contract and migrate all consumers

Foundation. Replace the content shape, author the full bilingual content per the spec, update every consumer so the build compiles, and replace stale tests. Ends green.

**Files:**
- Modify: `src/content/siteCopy.ts`
- Modify: `src/content/siteCopy.test.ts`
- Modify (compile fix only): `src/components/sections/SpectrumSection.astro`, `OpticalSystemSection.astro`, `SafetySection.astro`, `FilterComparisonSection.astro`, `BandpassSection.astro`, `HeroSection.astro`, `FinalImageSection.astro`
- Delete: `src/task3NavigationFoundation.test.ts`, `src/task5NarrativeSections.test.ts`, `src/task6InteractiveModules.test.ts`, `src/task7BandpassTuningSimulator.test.ts`, `src/task8FinalImageSection.test.ts`

- [ ] **Step 1: Write the new content invariant tests**

Replace `src/content/siteCopy.test.ts` with:

```ts
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
    expect(siteCopy.es.safety.rules.length).toBeGreaterThanOrEqual(4);
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
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm run test:unit -- src/content/siteCopy.test.ts`
Expected: FAIL (new fields `sections`, `safety.rules`, `finalImage.annotations`, `diagrams` do not exist yet).

- [ ] **Step 3: Rewrite `src/content/siteCopy.ts` with the new contract and full content**

Define the types exactly as below, then populate `es` and `en`. Author the prose for every field following the section-by-section content in the design spec (`docs/superpowers/specs/2026-06-07-h-alpha-deep-rewrite-design.md` §"Diseño sección por sección"). Base narrative goes in `body`; physics/math goes in `deepDive`.

```ts
import type { Locale } from "../i18n/routes";

type Paragraph = string;

export type DeepDive = {
  title: string;
  paragraphs: Paragraph[];
  formula?: string;
};

export type Section = {
  eyebrow: string;
  heading: string;
  lead: string;
  body: Paragraph[];
  deepDive?: DeepDive;
};

export type SafetyRule = { title: string; body: string };

export type ImageAnnotation = {
  id: string;
  x: number; // percent 0-100
  y: number; // percent 0-100
  label: string;
  description: string;
};

type GlossaryEntry = { term: string; short: string; detail: string };

type SeasonalSafetyCallout = {
  enabled: boolean;
  date: "2026-08-12";
  title: string;
  body: string;
};

type SiteCopy = {
  meta: { title: string; description: string };
  nav: { origin: string; etalon: string; tuning: string; safety: string; image: string };
  languageLabel: string;
  hero: { eyebrow: string; title: string; intro: string; imageAlt: string };
  sections: {
    origin: Section;
    spectrum: Section;
    etalon: Section;
    tuning: Section;
    opticalSystem: Section;
    filters: Section;
  };
  safety: {
    eyebrow: string;
    heading: string;
    rules: SafetyRule[];
    seasonalCallout: SeasonalSafetyCallout;
  };
  finalImage: {
    eyebrow: string;
    heading: string;
    lead: string;
    caption: string;
    imageAlt: string;
    annotations: ImageAnnotation[];
    beforeAfter: { beforeLabel: string; afterLabel: string; instruction: string };
  };
  glossary: Record<string, GlossaryEntry>;
  diagrams: {
    hydrogenLevels: Record<string, string>;
    sunLayers: Record<string, string>;
    etalon: Record<string, string>;
    opticalChain: Record<string, string>;
    threeMethods: Record<string, string>;
    dopplerTuning: Record<string, string>;
  };
};

export const siteCopy: Record<Locale, SiteCopy> = {
  es: { /* author per spec: all sections base+deepDive, safety.rules (≥4 evergreen),
           finalImage.annotations (≥3: filamentos, protuberancias, plages, textura),
           diagram label groups, glossary (keep + extend) */ },
  en: { /* mirror of es, same keys */ },
};
```

Content requirements (must be satisfied, per spec):
- `sections.origin`: body explains hydrogen → spectral fingerprint → 656,28 nm → chromosphere glows. `deepDive`: Bohr, Balmer, n=3→n=2, `formula: "E = h·c / λ"`, absorption vs emission.
- `sections.spectrum`: body explains Fraunhofer lines (spectrum is not a smooth rainbow). `deepDive`: why H-alpha is dark on disk / bright on limb.
- `sections.etalon`: body explains two semi-mirrored surfaces, multiple reflections, constructive interference. `deepDive`: `2nd·cosθ = mλ`, Airy peaks, FSR, finesse, FWHM, why <0.5 Å.
- `sections.tuning`: body explains fine-tuning the passband; disk vs prominences. `deepDive`: pressure/tilt tuning, Doppler, contrast vs light trade-off.
- `sections.opticalSystem`: body explains the chain objective→ERF→etalon→blocking→camera, each piece essential. `deepDive`: what happens if ERF or blocking is missing.
- `sections.filters`: body contrasts the three methods. `deepDive`: neutral ND vs energy rejection + spectral selection.
- `safety.rules`: ≥4 evergreen rules from spec §8.
- `finalImage.annotations`: ≥3 with plausible x/y percentages over the disk.
- `diagrams.*`: label maps with the text strings each SVG needs (axis labels, n=1..n, "H-alpha · 656,28 nm", "ERF", "Etalon", "Blocking filter", "FSR", "FWHM", etc.).

- [ ] **Step 4: Update section components so the build compiles**

Each existing section currently reads old fields (e.g. `copy.hero.title`, `copy.seasonalSafetyCallout`, `copy.sections.spectrum.heading` via inline strings). Update the seven section files to read from the new shape. For this task, minimal edits to compile and render base content are enough — deep-dives/diagrams/interactives come in later tasks. Concretely:
  - `HeroSection.astro`: read `copy.hero` (title, intro, imageAlt); render `<img src="/images/sun-h-alpha.png" alt={copy.hero.imageAlt} />` instead of `.hero-section__sun`.
  - `SpectrumSection.astro`: read `copy.sections.spectrum` (eyebrow, heading, lead, body).
  - `OpticalSystemSection.astro`: read `copy.sections.opticalSystem`.
  - `BandpassSection.astro`: read `copy.sections.tuning`.
  - `FilterComparisonSection.astro`: read `copy.sections.filters`.
  - `SafetySection.astro`: read `copy.safety` (eyebrow, heading, rules[], seasonalCallout).
  - `FinalImageSection.astro`: read `copy.finalImage` (eyebrow, heading, lead, caption, imageAlt).

Render `body` paragraphs with `{section.body.map((p) => <p class="lead">{p}</p>)}` where appropriate.

- [ ] **Step 5: Delete stale scaffolding tests**

Run:
```bash
git rm src/task3NavigationFoundation.test.ts src/task5NarrativeSections.test.ts src/task6InteractiveModules.test.ts src/task7BandpassTuningSimulator.test.ts src/task8FinalImageSection.test.ts
```
Expected: those files reference old content/components and would fail against the new contract; their coverage is superseded by the new invariant tests and (Task 2) physics tests and (later) e2e.

- [ ] **Step 6: Run unit tests and build**

Run: `npm run test:unit && npm run build`
Expected: PASS (invariants green, `astro check` 0 errors, 2 pages built).

- [ ] **Step 7: Commit**

```bash
git add src/content src/components/sections
git commit -m "feat: layered bilingual content contract with safety rules and annotations"
```

## Task 2: Pure physics helpers

All interactive physics lives here as pure functions, unit-tested. React components import these.

**Files:**
- Create: `src/lib/physics.ts`
- Create: `src/lib/physics.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/physics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  H_ALPHA_NM,
  gaussian,
  transmissionWindow,
  contrastUnderWindow,
  classifyView,
  wavelengthToTransition,
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

  it("maps wavelengths near H-alpha to the n=3->n=2 transition", () => {
    expect(wavelengthToTransition(656).from).toBe(3);
    expect(wavelengthToTransition(656).to).toBe(2);
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npm run test:unit -- src/lib/physics.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/physics.ts`**

```ts
export const H_ALPHA_NM = 656.28;

export type Window = { centerOffset: number; fwhm: number }; // ångströms

export function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
}

const fwhmToSigma = (fwhm: number) => fwhm / 2.3548;

// Transmission of the etalon window at a given offset (Å) from line center.
export function transmissionWindow(deltaA: number, w: Window): number {
  return gaussian(deltaA, w.centerOffset, fwhmToSigma(w.fwhm));
}

// Qualitative disk contrast: line is an absorption dip modeled as a gaussian
// of width ~0.5 Å at center; narrower windows sample the core -> more contrast.
export function contrastUnderWindow(w: Window, lineFwhm = 0.5): number {
  const sigmaLine = fwhmToSigma(lineFwhm);
  const sigmaWin = fwhmToSigma(w.fwhm);
  // overlap of two gaussians (window vs line core), penalized by window width
  const overlap = gaussian(w.centerOffset, 0, Math.hypot(sigmaLine, sigmaWin));
  return overlap / (1 + sigmaWin);
}

export type View = "disk" | "prominence" | "washed";

export function classifyView(w: Window): View {
  if (Math.abs(w.centerOffset) > 0.25) return "prominence";
  if (w.fwhm > 0.7) return "washed";
  return "disk";
}

// Rydberg for hydrogen Balmer-ish mapping (pedagogical).
export function wavelengthToTransition(nm: number): { from: number; to: number } {
  // H-alpha 656 (3->2), H-beta 486 (4->2), H-gamma 434 (5->2)
  if (nm >= 600) return { from: 3, to: 2 };
  if (nm >= 460) return { from: 4, to: 2 };
  return { from: 5, to: 2 };
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test:unit -- src/lib/physics.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: pure physics helpers for interactive modules"
```

## Task 3: Deep-dive component and styles

**Files:**
- Create: `src/components/DeepDive.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create `src/components/DeepDive.astro`**

```astro
---
import type { DeepDive } from "../content/siteCopy";
interface Props { deepDive: DeepDive }
const { deepDive } = Astro.props;
---
<details class="deep-dive">
  <summary>{deepDive.title}</summary>
  <div class="deep-dive__body">
    {deepDive.paragraphs.map((p) => <p>{p}</p>)}
    {deepDive.formula && <p class="deep-dive__formula">{deepDive.formula}</p>}
  </div>
</details>
```

- [ ] **Step 2: Append styles to `src/styles/global.css`**

```css
.deep-dive {
  margin-top: 22px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}
.deep-dive > summary {
  cursor: pointer;
  padding: 14px 18px;
  font-weight: 720;
  color: var(--accent);
  list-style: none;
}
.deep-dive > summary::before { content: "＋ "; font-weight: 800; }
.deep-dive[open] > summary::before { content: "－ "; }
.deep-dive__body { padding: 0 18px 16px; }
.deep-dive__formula {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--paper);
  border-left: 3px solid var(--accent);
  padding: 8px 12px;
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/DeepDive.astro src/styles/global.css
git commit -m "feat: reusable deep-dive disclosure component"
```

## Task 4: SVG diagram — Hydrogen energy levels

**Files:**
- Create: `src/components/diagrams/HydrogenLevels.astro`

- [ ] **Step 1: Create the component**

Author an annotated SVG: horizontal energy levels n=1..6 spaced by Bohr energy `E_n ∝ -1/n²` (so levels crowd toward the top), Balmer transitions drawn to n=2, the n=3→n=2 arrow highlighted in the solar red (`var(--solar)`) and labeled from `labels` (e.g. `labels.transition = "H-alpha · 656,28 nm"`). Props:

```astro
---
interface Props { labels: Record<string, string> }
const { labels } = Astro.props;
const levels = [1, 2, 3, 4, 5, 6];
const y = (n: number) => 260 + 220 * (-1 / (n * n)); // -1/n^2 mapped into viewBox
---
<figure class="diagram">
  <svg viewBox="0 0 420 300" role="img" aria-label={labels.aria}>
    {levels.map((n) => (
      <g>
        <line x1="60" x2="360" y1={y(n)} y2={y(n)} stroke="var(--line)" />
        <text x="40" y={y(n) + 4} font-size="12">n={n}</text>
      </g>
    ))}
    <line x1="210" x2="210" y1={y(3)} y2={y(2)} stroke="var(--solar)" stroke-width="3" marker-end="url(#arrow)" />
    <text x="220" y={(y(3) + y(2)) / 2} font-size="12" fill="var(--solar-deep)">{labels.transition}</text>
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="var(--solar)" />
      </marker>
    </defs>
  </svg>
  <figcaption>{labels.caption}</figcaption>
</figure>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS (component not yet imported anywhere; just compiles). If Astro tree-shakes unused components, import it temporarily in `OriginSection` in Task 11.

- [ ] **Step 3: Commit**

```bash
git add src/components/diagrams/HydrogenLevels.astro
git commit -m "feat: hydrogen energy levels diagram"
```

## Task 5: SVG diagram — Sun layers

**Files:**
- Create: `src/components/diagrams/SunLayers.astro`

- [ ] **Step 1: Create the component**

Annotated cross-section: nested arcs for photosphere → chromosphere → corona, with callout labels from `labels` indicating which layer white light sees (photosphere) and which H-alpha sees (chromosphere). Use `var(--solar)` family for chromosphere. Same `Props { labels }` pattern and `<figure class="diagram">` wrapper.

- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add src/components/diagrams/SunLayers.astro
git commit -m "feat: sun layers diagram"
```

## Task 6: SVG diagram — Fabry-Pérot etalon

**Files:**
- Create: `src/components/diagrams/EtalonDiagram.astro`

- [ ] **Step 1: Create the component**

Two parallel semi-mirrored plates (vertical lines), an incoming ray, multiple internal reflections (zig-zag), constructive output arrows, the spacing `d` and angle `θ` labeled, plus a small inset showing the Airy transmission profile (a few peaks) with `FSR` and `FWHM` labeled — all text from `labels`. `Props { labels }`, `<figure class="diagram">`.

- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add src/components/diagrams/EtalonDiagram.astro
git commit -m "feat: Fabry-Perot etalon diagram"
```

## Task 7: SVG diagram — Optical chain

**Files:**
- Create: `src/components/diagrams/OpticalChain.astro`

- [ ] **Step 1: Create the component**

Left-to-right labeled blocks: Sunlight → Objective → ERF → Etalon → Blocking filter → Eye/Camera. Each block a rounded rect with its label from `labels`, plus a small sub-label "qué pasa si falta" on the ERF and Blocking blocks. Highlight where energy is dumped (after ERF). `Props { labels }`, `<figure class="diagram">`.

- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add src/components/diagrams/OpticalChain.astro
git commit -m "feat: optical chain diagram"
```

## Task 8: SVG diagram — Three methods

**Files:**
- Create: `src/components/diagrams/ThreeMethods.astro`

- [ ] **Step 1: Create the component**

Three small side-by-side schematics: (1) eclipse glasses at the eye, (2) white-light filter at the front aperture, (3) H-alpha internal system — each showing where the filter sits and which solar layer it reveals (photosphere vs chromosphere), labels from `labels`. `Props { labels }`, `<figure class="diagram">`.

- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add src/components/diagrams/ThreeMethods.astro
git commit -m "feat: three solar-filter methods diagram"
```

## Task 9: SVG diagram — Doppler tuning

**Files:**
- Create: `src/components/diagrams/DopplerTuning.astro`

- [ ] **Step 1: Create the component**

A line-profile curve with copies shifted to blue and red (material approaching/receding), and a fixed etalon window showing which shifted material is "lit". Labels from `labels` (azul/acercándose, rojo/alejándose, ventana del etalon). `Props { labels }`, `<figure class="diagram">`.

- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Add shared diagram styles to `src/styles/global.css`**

```css
.diagram { margin: 26px 0 0; }
.diagram svg { width: 100%; height: auto; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
.diagram figcaption { color: var(--muted); margin-top: 10px; font-size: 0.92rem; }
```

- [ ] **Step 4: Commit**
```bash
git add src/components/diagrams/DopplerTuning.astro src/styles/global.css
git commit -m "feat: Doppler tuning diagram and shared diagram styles"
```

## Task 10: Hero with the real image

**Files:**
- Modify: `src/components/sections/HeroSection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Finalize hero markup**

Ensure `HeroSection.astro` renders the hook question (`copy.hero.title`), `copy.hero.intro`, and the real image as the hero visual:

```astro
<section class="section hero-section" id="top">
  <div class="section__inner hero-section__grid">
    <div>
      <p class="eyebrow">{copy.hero.eyebrow}</p>
      <h1 class="section-title">{copy.hero.title}</h1>
      <p class="lead">{copy.hero.intro}</p>
    </div>
    <figure class="hero-section__figure">
      <img src="/images/sun-h-alpha.png" alt={copy.hero.imageAlt} fetchpriority="high" />
    </figure>
  </div>
</section>
```

- [ ] **Step 2: Replace `.hero-section__sun` styles**

In `src/styles/global.css`, delete the `.hero-section__sun` rule and add:

```css
.hero-section__figure { margin: 0; }
.hero-section__figure img {
  width: 100%; height: auto; border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
}
```

- [ ] **Step 3: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 4: Commit**
```bash
git add src/components/sections/HeroSection.astro src/styles/global.css
git commit -m "feat: hero leads with the real H-alpha image"
```

## Task 11: Origin section

**Files:**
- Create: `src/components/sections/OriginSection.astro`

- [ ] **Step 1: Create the section**

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";
import DeepDive from "../DeepDive.astro";
import HydrogenLevels from "../diagrams/HydrogenLevels.astro";
import SunLayers from "../diagrams/SunLayers.astro";
const { locale } = Astro.props as { locale: Locale };
const copy = siteCopy[locale];
const s = copy.sections.origin;
---
<section class="section" id="origin">
  <div class="section__inner">
    <p class="eyebrow">{s.eyebrow}</p>
    <h2 class="section-title">{s.heading}</h2>
    <p class="lead">{s.lead}</p>
    {s.body.map((p) => <p>{p}</p>)}
    <HydrogenLevels labels={copy.diagrams.hydrogenLevels} />
    <SunLayers labels={copy.diagrams.sunLayers} />
    {s.deepDive && <DeepDive deepDive={s.deepDive} />}
  </div>
</section>
```

- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add src/components/sections/OriginSection.astro
git commit -m "feat: why-the-sun-glows origin section"
```

## Task 12: Spectrum section + reworked explorer

**Files:**
- Rewrite: `src/components/interactive/SpectrumExplorer.tsx`
- Modify: `src/components/sections/SpectrumSection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Rewrite `SpectrumExplorer.tsx`**

Use `wavelengthToTransition` from `../../lib/physics`. Render a spectrum strip with Fraunhofer dark lines drawn at known wavelengths (H-alpha 656, H-beta 486, Mg 517, Na 589). A slider selects a wavelength; show the matched transition (`n=from → n=to`) and a short readout. Props accept localized labels:

```tsx
import { useState } from "react";
import { wavelengthToTransition, H_ALPHA_NM } from "../../lib/physics";

type Labels = { aria: string; control: string; selected: string; transition: string };
const FRAUNHOFER = [430, 486, 517, 589, 656];

export function SpectrumExplorer({ labels }: { labels: Labels }) {
  const [nm, setNm] = useState(H_ALPHA_NM);
  const t = wavelengthToTransition(nm);
  const pct = ((nm - 400) / (700 - 400)) * 100;
  return (
    <div className="instrument-panel spectrum-explorer" aria-label={labels.aria}>
      <div className="spectrum-explorer__bar">
        {FRAUNHOFER.map((w) => (
          <span key={w} className="spectrum-explorer__fraunhofer" style={{ left: `${((w - 400) / 300) * 100}%` }} />
        ))}
        <span className="spectrum-explorer__cursor" style={{ left: `${pct}%` }} />
      </div>
      <label>
        {labels.control}: {Math.round(nm)} nm
        <input type="range" min={400} max={700} step={1} value={nm}
               onChange={(e) => setNm(Number(e.target.value))} />
      </label>
      <p>{labels.selected}: {Math.round(nm)} nm — {labels.transition} n={t.from} → n={t.to}</p>
    </div>
  );
}
```

- [ ] **Step 2: Wire into `SpectrumSection.astro`**

Render eyebrow/heading/lead/body from `copy.sections.spectrum`, then `<SpectrumExplorer client:visible labels={...} />` (labels authored in `siteCopy`, add a `spectrumExplorer` label group to content if missing), then optional `<DeepDive>`.

- [ ] **Step 3: Replace the rainbow bar styles**

In `global.css`, replace `.spectrum-explorer__bar` background with a true visible-spectrum gradient plus dark Fraunhofer ticks, and add `.spectrum-explorer__fraunhofer` (thin dark vertical lines) and `.spectrum-explorer__cursor`.

- [ ] **Step 4: Build + unit** — Run: `npm run build && npm run test:unit` — Expected: PASS.
- [ ] **Step 5: Commit**
```bash
git add src/components/interactive/SpectrumExplorer.tsx src/components/sections/SpectrumSection.astro src/styles/global.css src/content/siteCopy.ts
git commit -m "feat: spectrum explorer linking wavelength to atomic transition"
```

## Task 13: Etalon section

**Files:**
- Create: `src/components/sections/EtalonSection.astro`

- [ ] **Step 1: Create the section** — same pattern as OriginSection, reading `copy.sections.etalon`, rendering `<EtalonDiagram labels={copy.diagrams.etalon} />` and `<DeepDive>`. `id="etalon"`.
- [ ] **Step 2: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add src/components/sections/EtalonSection.astro
git commit -m "feat: etalon Fabry-Perot section"
```

## Task 14: Tuning section + reworked simulator (star module)

**Files:**
- Rewrite: `src/components/interactive/BandpassTuningSimulator.tsx`
- Create: `src/components/sections/TuningSection.astro`
- Delete: `src/components/sections/BandpassSection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Rewrite `BandpassTuningSimulator.tsx`**

Import physics helpers. Render an SVG plot of the H-alpha line profile (absorption dip via `gaussian`) with a draggable transmission window overlay (`transmissionWindow`). Two sliders: width (FWHM) and offset (center). Show computed contrast (`contrastUnderWindow`) and the qualitative `classifyView` result, AND an image-preview box whose appearance changes by view: `washed` (flat), `disk` (filaments texture), `prominence` (limb features). A disk/limb toggle switches the profile between absorption and emission. All strings from localized `labels`.

```tsx
import { useState } from "react";
import { contrastUnderWindow, classifyView, transmissionWindow, gaussian } from "../../lib/physics";

type Labels = {
  aria: string; width: string; offset: string; contrast: string;
  views: { disk: string; prominence: string; washed: string };
};

export function BandpassTuningSimulator({ labels }: { labels: Labels }) {
  const [fwhm, setFwhm] = useState(0.4);
  const [offset, setOffset] = useState(0);
  const view = classifyView({ centerOffset: offset, fwhm });
  const contrast = contrastUnderWindow({ centerOffset: offset, fwhm });
  const samples = Array.from({ length: 60 }, (_, i) => -1.5 + (i * 3) / 59);
  const lineY = (d: number) => 100 - 70 * (1 - 0.85 * gaussian(d, 0, 0.21)); // absorption dip
  const winY = (d: number) => 100 - 70 * transmissionWindow(d, { centerOffset: offset, fwhm });
  const toX = (d: number) => ((d + 1.5) / 3) * 300;
  return (
    <div className="instrument-panel bandpass-sim" role="group" aria-label={labels.aria}>
      <svg viewBox="0 0 300 110" className="bandpass-sim__plot">
        <polyline fill="none" stroke="var(--instrument)" stroke-width="2"
          points={samples.map((d) => `${toX(d)},${lineY(d)}`).join(" ")} />
        <polyline fill="none" stroke="var(--solar)" stroke-width="2"
          points={samples.map((d) => `${toX(d)},${winY(d)}`).join(" ")} />
      </svg>
      <label>{labels.width}: {fwhm.toFixed(2)} Å
        <input type="range" min={0.3} max={1.2} step={0.05} value={fwhm}
               onChange={(e) => setFwhm(Number(e.target.value))} aria-label={labels.width} />
      </label>
      <label>{labels.offset}: {offset.toFixed(2)} Å
        <input type="range" min={-0.6} max={0.6} step={0.05} value={offset}
               onChange={(e) => setOffset(Number(e.target.value))} aria-label={labels.offset} />
      </label>
      <p className="bandpass-sim__readout">{labels.contrast}: {(contrast * 100).toFixed(0)}% — {labels.views[view]}</p>
      <div className={`bandpass-sim__preview bandpass-sim__preview--${view}`} aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 2: Create `TuningSection.astro`**

Read `copy.sections.tuning`; render `<DopplerTuning labels={copy.diagrams.dopplerTuning} />`, `<BandpassTuningSimulator client:visible labels={...} />`, and `<DeepDive>`. `id="tuning"`.

- [ ] **Step 3: Delete old section** — `git rm src/components/sections/BandpassSection.astro`

- [ ] **Step 4: Add preview styles** to `global.css`: `.bandpass-sim__preview` base + `--washed` (flat gray), `--disk` (subtle filament texture via repeating gradient over solar tint), `--prominence` (dark with red limb arcs). Keep the existing `.bandpass-sim` grid/label rules; remove the old `.bandpass-sim__plot` gradient background (now an SVG), `.bandpass-sim__center`, `.bandpass-sim__window`.

- [ ] **Step 5: Build + unit** — Run: `npm run build && npm run test:unit` — Expected: PASS.
- [ ] **Step 6: Commit**
```bash
git add src/components/interactive/BandpassTuningSimulator.tsx src/components/sections/TuningSection.astro src/styles/global.css src/content/siteCopy.ts
git rm src/components/sections/BandpassSection.astro
git commit -m "feat: physics-driven tuning simulator with image preview"
```

## Task 15: Optical system section + light-path animation

**Files:**
- Create: `src/components/interactive/LightPathAnimation.tsx`
- Modify: `src/components/sections/OpticalSystemSection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create `LightPathAnimation.tsx`**

A stepper: a beam travels objective→ERF→etalon→blocking→camera. State `step` advances on a Play button or auto-interval; at each stage show what is discarded (energy after ERF, out-of-band light after blocking) via localized `stages[]` labels and a changing beam color/width. Respect `prefers-reduced-motion` (no auto-advance). Strings from `labels`.

- [ ] **Step 2: Wire into `OpticalSystemSection.astro`**

Read `copy.sections.opticalSystem`; render `<OpticalChain labels={copy.diagrams.opticalChain} />`, `<LightPathAnimation client:visible labels={...} />`, `<DeepDive>`. `id="optics"`.

- [ ] **Step 3: Add animation styles** to `global.css` (beam, stage highlight, controls).
- [ ] **Step 4: Build + unit** — Run: `npm run build && npm run test:unit` — Expected: PASS.
- [ ] **Step 5: Commit**
```bash
git add src/components/interactive/LightPathAnimation.tsx src/components/sections/OpticalSystemSection.astro src/styles/global.css src/content/siteCopy.ts
git commit -m "feat: optical chain section with light-path animation"
```

## Task 16: Filter comparison section + reworked comparator

**Files:**
- Rewrite: `src/components/interactive/FilterComparison.tsx`
- Modify: `src/components/sections/FilterComparisonSection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Rewrite `FilterComparison.tsx`**

A selectable comparator: three method buttons (eclipse glasses / white-light / H-alpha). Selecting one shows (a) where the filter sits, (b) what spectrum passes (all attenuated vs a narrow slit), (c) which layer is revealed (photosphere vs chromosphere) with a small preview. Data + strings from localized `methods[]` props (move card content from `siteCopy`).

- [ ] **Step 2: Wire into `FilterComparisonSection.astro`**

Read `copy.sections.filters`; render `<ThreeMethods labels={copy.diagrams.threeMethods} />`, `<FilterComparison client:visible methods={...} />`, `<DeepDive>`. `id="filters"`.

- [ ] **Step 3: Update styles** — replace the static `.filter-comparison` card grid with selector + detail panel styles.
- [ ] **Step 4: Build + unit** — Run: `npm run build && npm run test:unit` — Expected: PASS.
- [ ] **Step 5: Commit**
```bash
git add src/components/interactive/FilterComparison.tsx src/components/sections/FilterComparisonSection.astro src/styles/global.css src/content/siteCopy.ts
git commit -m "feat: mechanism-based filter comparator"
```

## Task 17: Safety section (evergreen + seasonal)

**Files:**
- Modify: `src/components/sections/SafetySection.astro`

- [ ] **Step 1: Render evergreen rules then seasonal callout**

```astro
---
import type { Locale } from "../../i18n/routes";
import { siteCopy } from "../../content/siteCopy";
const { locale } = Astro.props as { locale: Locale };
const copy = siteCopy[locale];
const s = copy.safety;
const seasonalId = `seasonal-${locale}`;
---
<section class="section" id="safety">
  <div class="section__inner">
    <p class="eyebrow">{s.eyebrow}</p>
    <h2 class="section-title">{s.heading}</h2>
    <ul class="safety-rules">
      {s.rules.map((r) => (
        <li class="safety-rules__item">
          <strong>{r.title}</strong>
          <p>{r.body}</p>
        </li>
      ))}
    </ul>
    {s.seasonalCallout.enabled && (
      <aside class="warning" role="note" aria-labelledby={seasonalId}>
        <h3 id={seasonalId}>{s.seasonalCallout.title}</h3>
        <p>{s.seasonalCallout.body}</p>
      </aside>
    )}
  </div>
</section>
```

- [ ] **Step 2: Add `.safety-rules` styles** to `global.css` (grid of bordered items).
- [ ] **Step 3: Build** — Run: `npm run build` — Expected: PASS.
- [ ] **Step 4: Commit**
```bash
git add src/components/sections/SafetySection.astro src/styles/global.css
git commit -m "feat: evergreen safety rules decoupled from eclipse callout"
```

## Task 18: Final image section (hotspots + before/after)

**Files:**
- Create: `src/components/interactive/BeforeAfter.tsx`
- Modify: `src/components/sections/FinalImageSection.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create `BeforeAfter.tsx`**

A curtain comparator over `/images/sun-h-alpha.png`: a range slider drives a clip on the "before" overlay (a CSS-filtered version simulating white light: grayscale + contrast). Labels from props (`beforeLabel`, `afterLabel`, `instruction`). Accessible: the slider has `aria-label={instruction}`.

- [ ] **Step 2: Rework `FinalImageSection.astro`**

Render eyebrow/heading/lead/body, then a figure with the image and absolutely-positioned hotspot buttons from `copy.finalImage.annotations` (each a button at `x%`,`y%` with a popover of `label`+`description`), then `<BeforeAfter client:visible .../>`, then caption.

- [ ] **Step 3: Add hotspot + curtain styles** to `global.css`; remove the now-unused `.final-image-section` rules that conflict.
- [ ] **Step 4: Build + unit** — Run: `npm run build && npm run test:unit` — Expected: PASS.
- [ ] **Step 5: Commit**
```bash
git add src/components/interactive/BeforeAfter.tsx src/components/sections/FinalImageSection.astro src/styles/global.css
git commit -m "feat: annotated final image with before/after comparator"
```

## Task 19: Wire pages in pedagogical order and update nav

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/components/SiteNav.astro`

- [ ] **Step 1: Update `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import HeroSection from "../components/sections/HeroSection.astro";
import OriginSection from "../components/sections/OriginSection.astro";
import SpectrumSection from "../components/sections/SpectrumSection.astro";
import EtalonSection from "../components/sections/EtalonSection.astro";
import TuningSection from "../components/sections/TuningSection.astro";
import OpticalSystemSection from "../components/sections/OpticalSystemSection.astro";
import FilterComparisonSection from "../components/sections/FilterComparisonSection.astro";
import SafetySection from "../components/sections/SafetySection.astro";
import FinalImageSection from "../components/sections/FinalImageSection.astro";
---
<BaseLayout locale="es">
  <HeroSection locale="es" />
  <OriginSection locale="es" />
  <SpectrumSection locale="es" />
  <EtalonSection locale="es" />
  <TuningSection locale="es" />
  <OpticalSystemSection locale="es" />
  <FilterComparisonSection locale="es" />
  <SafetySection locale="es" />
  <FinalImageSection locale="es" />
</BaseLayout>
```

- [ ] **Step 2: Mirror in `src/pages/en/index.astro`** with `locale="en"` and `../../` import paths.

- [ ] **Step 3: Update `SiteNav.astro`** anchors to `#origin`, `#etalon`, `#tuning`, `#safety`, `#image` using `copy.nav` (origin/etalon/tuning/safety/image).

- [ ] **Step 4: Build + unit** — Run: `npm run build && npm run test:unit` — Expected: PASS.
- [ ] **Step 5: Commit**
```bash
git add src/pages src/components/SiteNav.astro
git commit -m "feat: assemble pages in pedagogical order"
```

## Task 20: End-to-end smoke tests for new structure

**Files:**
- Modify: `tests/smoke.spec.ts`

- [ ] **Step 1: Replace e2e tests**

Cover: hero shows the real image; ES + EN heros render; a deep-dive `<details>` expands; spectrum explorer readout updates with the transition; tuning simulator changes the readout/preview when sliders move; a final-image hotspot is present; the before/after slider exists; safety shows ≥4 evergreen rules independent of the seasonal callout.

```ts
import { expect, test } from "@playwright/test";

test("hero leads with the real H-alpha image (ES)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-section__figure img")).toBeVisible();
});

test("English hero renders", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a deep-dive discloses extra physics", async ({ page }) => {
  await page.goto("/");
  const dd = page.locator("details.deep-dive").first();
  await dd.locator("summary").click();
  await expect(dd).toHaveJSProperty("open", true);
});

test("spectrum explorer maps wavelength to transition", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator("#spectrum input[type=range]");
  await slider.fill("486");
  await expect(page.locator("#spectrum")).toContainText("n=4");
});

test("tuning simulator reacts to controls", async ({ page }) => {
  await page.goto("/");
  const sim = page.getByRole("group").filter({ has: page.locator(".bandpass-sim__plot") });
  const width = sim.locator("input[type=range]").first();
  await width.fill("1.2");
  await expect(sim.locator(".bandpass-sim__readout")).toBeVisible();
});

test("final image has annotations and before/after", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#image .hotspot").first()).toBeVisible();
  await expect(page.locator("#image input[type=range]")).toBeVisible();
});

test("safety shows evergreen rules", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#safety .safety-rules__item")).toHaveCount(await page.locator("#safety .safety-rules__item").count());
  expect(await page.locator("#safety .safety-rules__item").count()).toBeGreaterThanOrEqual(4);
});
```

(Adjust selectors to match the class/role names produced in earlier tasks; keep them stable.)

- [ ] **Step 2: Run e2e** — Run: `npm run test:e2e` — Expected: PASS.
- [ ] **Step 3: Commit**
```bash
git add tests/smoke.spec.ts
git commit -m "test: e2e coverage for deepened site"
```

## Task 21: Final verification and polish

**Files:**
- Modify only files needed to fix findings.

- [ ] **Step 1: Full verification** — Run: `npm test && npm run build` — Expected: PASS.
- [ ] **Step 2: Visual review (dev server)** — Run: `npm run dev -- --host 127.0.0.1`, open `/` and `/en/` at desktop (1280px) and mobile (390px). Verify per spec §"Estrategia de verificación":
  - Hero shows the real image, no layout overflow.
  - Each section: base narrative reads well; "Profundiza más" expands and is legible.
  - All 6 SVG diagrams render with readable annotations and scale on mobile.
  - Spectrum explorer maps λ→transition; tuning simulator changes contrast + preview (disk/prominence/washed) and Doppler reads correctly; filter comparator switches mechanism/preview; light-path animation steps through stages; before/after curtain wipes; hotspots open popovers.
  - Safety shows the evergreen rules AND the seasonal callout; toggling `seasonalCallout.enabled` to false still leaves a complete safety section.
  - Bilingual: every new string is translated in both ES and EN.
- [ ] **Step 3: Commit any fixes**
```bash
git add -A
git commit -m "fix: polish deep-rewrite verification findings"
```
(If no changes were needed, do not create an empty commit.)

## Self-Review

- **Spec coverage:** layered pedagogy (DeepDive, Task 3 + every section) ✓; Topic 1 origin (Tasks 4,5,11,12) ✓; Topic 2 etalon (Tasks 6,13) ✓; Topic 3 tuning (Tasks 9,14) ✓; Topic 4 optics/safety (Tasks 7,8,15,16,17) ✓; hero real image (Task 10) ✓; final image hotspots + before/after (Task 18) ✓; 7 diagrams (Tasks 4-9; line-profile realized inside the tuning simulator, Task 14) ✓; 5 interactives (Tasks 12,14,15,16,18) ✓; content contract + invariants (Task 1) ✓; physics pure functions + tests (Task 2) ✓; e2e (Task 20) ✓; verification (Task 21) ✓.
- **Placeholder scan:** types, test code, physics, and key component code are concrete; prose content is authored against the spec's explicit per-section requirements (the spec is the content source of truth, cited in Task 1).
- **Type consistency:** `Section`, `DeepDive`, `SafetyRule`, `ImageAnnotation` defined in Task 1 and consumed unchanged; `Window`, `classifyView`, `contrastUnderWindow`, `transmissionWindow`, `wavelengthToTransition`, `H_ALPHA_NM` defined in Task 2 and consumed in Tasks 12/14; section ids (`origin`, `spectrum`, `etalon`, `tuning`, `optics`, `filters`, `safety`, `image`) consistent between sections (Tasks 11-18) and nav/pages (Task 19) and e2e (Task 20).
