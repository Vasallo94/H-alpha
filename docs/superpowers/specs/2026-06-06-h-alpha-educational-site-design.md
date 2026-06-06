# H-alpha Educational Site Design

## Context

Build a bilingual educational website that explains how H-alpha solar telescopes work. The site should be rigorous enough for astronomy and optics enthusiasts, but understandable for a general audience. It should also use Enrique's real H-alpha solar image as a final example of what the physics and instrument design make possible.

The site must remain simple and free to deploy. It should be a static website with no backend, database, authentication, paid services, or required runtime APIs.

Relevant equipment context from Obsidian:

- Telescope: Sky-Watcher HelioStar 100Ha
- Aperture: 100 mm
- Focal length: 760-800 mm
- Bandpass: < 0.5 A
- Tuning: pressure tuning + Trifid Tuner
- Blocking filter: 20 mm solar diagonal
- Camera context: ZWO ASI432MM
- Source image: `/Users/enriquebook/Personal/Astronomía/Procesado/2026-05-28-Sol/master1_disco_FINAL.png`

## Goals

- Teach the physics behind H-alpha solar observing through a narrative from solar light to final image.
- Explain the difference between white-light solar viewing, eclipse glasses, and H-alpha systems.
- Make technical terms approachable through contextual explanations, glossary entries, and optional deeper details.
- Include a configurable 2026 eclipse safety callout for the August 12, 2026 total solar eclipse, while keeping the main safety content evergreen.
- Keep the site static, fast, mobile-friendly, bilingual, and easy to deploy for free.

## Non-Goals

- No backend, CMS, database, accounts, comments, or dynamic server-rendered content.
- No complex professional optics simulator.
- No paid hosting or required third-party runtime services.
- No sprawling encyclopedia of solar physics beyond what supports H-alpha telescope education.

## Audience And Tone

The primary audience is broad: curious public, eclipse viewers, beginner astronomers, and amateur astrophotographers. The content should be technical but not gatekeeping. The main text uses plain language; difficult concepts appear with hover/tap explanations and optional "go deeper" panels.

The visual tone combines:

- Modern textbook clarity for the primary reading experience.
- Interactive instrument-style modules for spectrum, bandpass, tuning, and filter comparison.
- A more immersive finish around the real solar image.

## Narrative Structure

1. What are we trying to see?
   Explain that white light mostly reveals the photosphere, while H-alpha reveals chromospheric structures such as filaments, prominences, plages, and fine surface texture.

2. The H-alpha line
   Introduce 656.28 nm as a specific hydrogen spectral line, not just "red light." Use a simple spectrum visualization.

3. Eclipse glasses, white-light filters, and H-alpha
   Compare safe eclipse viewing, telescope white-light filters, and H-alpha telescopes. This section anchors the safety message and prepares readers for why H-alpha systems are specialized.

4. The problem: the Sun emits too much of everything
   Explain that an H-alpha telescope does not merely increase red color. It rejects almost all solar energy and selects an extremely narrow spectral window.

5. The H-alpha optical system
   Explain objective, etalon, tuning mechanism, blocking filter/solar diagonal, and eyepiece or camera as a chain of functions.

6. Bandpass and tuning
   Show how narrower bandpass increases chromospheric contrast and how small tuning changes move the passband toward the wings of H-alpha, affecting disk detail and prominences.

7. Solar safety
   Give clear, non-optional safety rules:
   - Do not use eclipse glasses with telescopes, binoculars, or cameras.
   - Do not improvise filters.
   - Do not use an H-alpha telescope without the correct blocking filter/solar diagonal.
   - Use projection-style solar finders rather than optical finders.

8. From physics to a real image
   Present Enrique's H-alpha image as the result of the preceding physics and instrument design. Annotate visible features where appropriate.

## Seasonal Safety Callout

The August 12, 2026 total solar eclipse should appear as a configurable seasonal content block, not as hardcoded core copy. This makes it easy to update, hide, or convert after the eclipse.

Initial state:

- Title: "Contexto 2026: eclipse total del 12 de agosto" / "2026 Context: August 12 Total Solar Eclipse"
- Purpose: explain safe eclipse viewing and the difference between eclipse glasses, white-light filters, and H-alpha telescopes.
- Placement: within or adjacent to the filter comparison and safety section.
- Content model: a structured `seasonalSafetyCallout` object with `enabled`, `date`, `title`, `body`, and localized copy.

After the eclipse:

- Either disable the seasonal callout.
- Or convert it into an evergreen "Eclipse glasses vs H-alpha telescopes" block without changing the site architecture.

## Interactions

The site should include lightweight client-side interactions:

- Contextual tooltips or tap cards for technical terms.
- A complete glossary panel or page.
- Spectrum module showing the H-alpha line in the visible spectrum.
- Filter comparison module for eclipse glasses, white-light filters, and H-alpha systems.
- Bandpass/tuning module with sliders for passband width and offset.
- Final image annotations with optional hotspots.

Interactions should be educational, not decorative. They must work on desktop and mobile, and should not require network APIs.

## Bilingual Content

The site is bilingual from the beginning with ES/EN language switching.

All visible copy should be content-driven rather than scattered through component internals:

- Section titles and body copy.
- Glossary entries.
- Tooltip text.
- Simulator labels.
- Safety warnings.
- Seasonal eclipse callout.
- Image annotation labels.

The default language should be Spanish, with an English toggle.

## Reference Sources

The safety and eclipse-date content should be based on reliable public sources, especially:

- NASA future eclipses page for the August 12, 2026 total solar eclipse visibility.
- NASA eclipse safety guidance for optical-device warnings and safe eclipse viewing.
- AAS eclipse safety and ISO 12312-2 guidance for solar viewers.

## Recommended Architecture

Use Astro for a static-first educational site with selective client-side interactive components.

Suggested structure:

```text
src/
  content/
    es/
    en/
  components/
    sections/
    interactive/
    glossary/
  i18n/
  pages/
public/
  images/
```

Responsibilities:

- `src/content/`: localized structured content, glossary, safety copy, and seasonal callout.
- `src/components/sections/`: narrative sections.
- `src/components/interactive/`: spectrum, filter comparison, and tuning modules.
- `src/components/glossary/`: accessible glossary and tooltip/popover components.
- `src/i18n/`: language helpers and route/content selection.
- `public/images/`: optimized image assets.

## Deployment

The production site should be static files generated at build time.

Recommended deployment options:

- GitHub Pages: simplest if the project lives in GitHub and public hosting is acceptable.
- Cloudflare Pages: also free for this use case and simple for static deployment, especially with a custom domain.

The implementation should avoid features that require serverless functions or paid platform capabilities.

## Testing And Verification

Before considering the implementation complete:

- Run the local build successfully.
- Check the site in desktop and mobile viewports.
- Verify all interactive modules render and respond to controls.
- Verify ES/EN changes all visible text.
- Verify glossary/tooltips work with mouse, keyboard, and touch.
- Verify text does not overlap or overflow on mobile.
- Verify color contrast is acceptable.
- Verify optimized image assets load correctly.
- Review solar safety copy for dangerous ambiguity.

## Maintenance

The eclipse callout should be a small content-only change after August 12, 2026. The glossary should support incremental additions. Future images or examples should be addable as content/assets without changing the core architecture.
