# VOGLER CONSULTING

> Swiss consulting firm for AI, agentic AI, analytics, and data.
> Live at **[vogler-consulting.ch](https://vogler-consulting.ch)**.

[![Deploy](https://img.shields.io/github/actions/workflow/status/danielvogler/vogler-consulting-website/deploy.yml?branch=main&label=deploy&logo=github)](https://github.com/danielvogler/vogler-consulting-website/actions)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fvogler-consulting.ch&up_message=live&down_message=down&label=site)](https://vogler-consulting.ch)
[![Astro](https://img.shields.io/badge/Astro-6.3-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

Static, bilingual (DE / EN) marketing site. Zero JavaScript framework, self-hosted fonts, no third-party tracking. Built with Astro and Tailwind v4, deployed via GitHub Actions to GitHub Pages, served from a Swiss `.ch` custom domain.

## Build pipeline

```mermaid
flowchart LR
    md[Markdown content<br/>DE · EN] --> astro[Astro 6<br/>static build]
    comp[Astro components<br/>Tailwind v4] --> astro
    astro --> dist[dist/]
    dist --> ci[GitHub Actions<br/>deploy-pages]
    ci --> pages[GitHub Pages]
    pages --> domain((vogler-consulting.ch))
```

## Stack

| Layer | Choice |
|---|---|
| Framework | [Astro 6](https://astro.build) (static output) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Icons | [Simple Icons](https://simpleicons.org) via `astro-icon` |
| Fonts | Self-hosted Inter Variable ([Fontsource](https://fontsource.org)) |
| Content typing | Astro Content Collections + Zod |
| i18n | Astro built-in routing (DE default, EN at `/en/`) |
| Image opt. | Astro `<Image>` + `sharp` |
| Sitemap | `@astrojs/sitemap` with hreflang alternates |
| Type checking | TypeScript 5 (strict) |
| CI | GitHub Actions → [`deploy.yml`](.github/workflows/deploy.yml) |
| Hosting | GitHub Pages |
| Runtime (build) | Node 22.12+ (see [`.nvmrc`](.nvmrc)) |
| Package manager | pnpm 9 |

## Local development

```bash
nvm use            # Node 22.12+ from .nvmrc
pnpm install
pnpm dev           # http://localhost:4321
```

Other scripts:

```bash
pnpm check         # astro check + tsc strict
pnpm build         # produces ./dist
pnpm preview       # serves ./dist locally on :4321
pnpm format        # prettier --write .
```

## Environment

Copy [`.env.example`](.env.example) to `.env.local` for local overrides. Production values are injected by GitHub Actions; the only required runtime variable is `SITE_URL` (set in the workflow). `CONTACT_EMAIL` falls back to `info@vogler-consulting.ch` if not set (see [`src/data/contact.ts`](src/data/contact.ts), the single place the address is defined).

## Project layout

```
public/               static assets (favicon, og.png, robots, llms.txt, CNAME)
src/
  pages/              .astro routes (DE at /, EN at /en/)
  layouts/            BaseLayout
  components/         Hero, Header, Footer, ServiceCard, LogoConveyor, ...
  content/            Markdown for services / team / partners (typed via content.config.ts)
  data/               carousel logo list
  i18n/               typed string tables (de.ts, en.ts)
  styles/global.css   Tailwind v4 @theme tokens + accent palette
scripts/              build-time helpers (OG image generation via sharp)
.github/workflows/    CI definition
```

## Deployment

`main` is the deploy branch. Every push triggers [`deploy.yml`](.github/workflows/deploy.yml):

1. Install dependencies (pnpm, frozen lockfile)
2. `astro check && astro build`
3. Upload `dist/` as a Pages artifact
4. Publish via `actions/deploy-pages`

The artifact contains `public/CNAME`, which keeps `vogler-consulting.ch` wired to the deployment across runs.

## SEO and LLM indexing

- JSON-LD `ProfessionalService` schema on every page
- Sitemap with hreflang alternates (`@astrojs/sitemap`)
- [`public/robots.txt`](public/robots.txt) explicitly allowlists major AI crawlers (Anthropic, OpenAI, Perplexity, Google-Extended, etc.)
- [`public/llms.txt`](public/llms.txt) for LLM-friendly site indexing

## License

Copyright © 2026 Daniel Vogler / VOGLER CONSULTING. All rights reserved. See [`LICENSE`](./LICENSE).

Source is published for transparency. No usage, redistribution, or derivative-work rights are granted without explicit written permission. Third-party logos in the tech-stack carousel are trademarks of their respective owners, used under [Simple Icons](https://simpleicons.org) CC0 for nominative reference only.
