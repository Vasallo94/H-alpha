# Hα Solar Telescope Explained

[![CI](https://github.com/Vasallo94/H-alpha/actions/workflows/ci.yml/badge.svg)](https://github.com/Vasallo94/H-alpha/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/Vasallo94/H-alpha/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Vasallo94/H-alpha/actions/workflows/deploy-pages.yml)

Educational bilingual website explaining how hydrogen-alpha solar telescopes work: the Hα spectral line, Fabry-Perot etalons, optical safety, solar filters, Doppler tuning, and what each structure means in a real Hα image of the Sun.

**Live site → [vasallo94.github.io/H-alpha](https://vasallo94.github.io/H-alpha/)**

## Features

- Spanish and English pages.
- Real Hα solar image with annotated structures.
- Accessible glossary popovers for difficult terms.
- Physics diagrams for hydrogen levels, solar layers, etalons, optical chain, filter comparison, and Doppler tuning.
- Solar safety section for eclipse and telescope use.
- Unit tests with Vitest and end-to-end smoke tests with Playwright.

## Tech Stack

- [Astro](https://astro.build/) static site
- React islands for interactive widgets
- KaTeX for math rendering
- Vitest for unit tests
- Playwright for browser smoke tests
- GitHub Actions and GitHub Pages for CI/deployment

## Local Development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:4321/`.

## Verification

```bash
pnpm test
pnpm run build
```

`pnpm test` runs Vitest and Playwright. The Playwright config starts the Astro dev server automatically.

## Deployment

GitHub Actions handles everything: `ci.yml` runs tests and the production build on every push and PR, while `deploy-pages.yml` deploys `dist/` to GitHub Pages from `main`.

The Pages project lives under a sub-path, so the deploy sets `PUBLIC_BASE_PATH=/H-alpha`. For a custom domain at the site root, drop that variable or set it to `/`.

## Author

Built by [Enrique Vasallo](https://www.linkedin.com/in/enrique-vasallo/).

- GitHub: [Vasallo94](https://github.com/Vasallo94)
- LinkedIn: [enrique-vasallo](https://www.linkedin.com/in/enrique-vasallo/)
