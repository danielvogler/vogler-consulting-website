# AGENTS.md

Working notes for coding agents and new contributors on the VOGLER CONSULTING
website. Read this before making changes.

## What this is

A static, bilingual (DE / EN) marketing site built with Astro 6 and Tailwind CSS 4,
deployed by GitHub Actions to GitHub Pages behind the custom domain
`vogler-consulting.ch`. No client-side framework, no third-party tracking,
self-hosted fonts.

The repository is public and `main` deploys on push, so every merge publishes
immediately. Work accordingly.

## Branching and merging

- Never commit directly to `main`. Branch, then open a pull request, even when
  working alone. The PR diff is the last point at which a mistake is catchable
  before it is both public and live.
- Branch names: `feature/…`, `fix/…`, `content/…`, `chore/…`, `docs/…`.
- Conventional commit subjects: `feat:`, `fix:`, `content:`, `chore:`, `style:`,
  `docs:`.
- Never force-push `main`.
- Keep mechanical commits (formatting, renames, moves) separate from substantive
  ones so reviewers can skip the noise.
- Commits carry the maintainer's identity only. No agent or tool co-author
  trailers.

## Setup

Requires Node 22.12+ (see `.nvmrc`) and pnpm 9 (pinned via `packageManager` in
`package.json`).

```bash
nvm use
pnpm install
cp .env.example .env.local   # optional, for local overrides
```

## Commands

| Command        | What it does                                                  |
| -------------- | ------------------------------------------------------------- |
| `pnpm dev`     | Dev server with hot reload at http://localhost:4321           |
| `pnpm build`   | `astro check` (strict types) then a static build into `dist/` |
| `pnpm preview` | Serves the built `dist/` locally                              |
| `pnpm check`   | Type check only                                               |
| `pnpm format`  | `prettier --write .`                                          |

`pnpm build` is the real gate: it runs `astro check`, so it catches type errors
and content-schema violations that `pnpm dev` will happily ignore. Run it before
committing.

Editing `src/content.config.ts` requires a dev-server restart. Markdown content
hot-reloads.

## Layout

```
public/                 static assets: CNAME, robots.txt, llms.txt, favicons, og.png
src/
  pages/                routes. DE at /, EN mirrored under /en/
    services/[slug]     consulting engagement detail pages
    workshops/[slug]    workshop detail pages
  _drafts/              hidden pages. Astro ignores underscore-prefixed dirs
  layouts/BaseLayout.astro
  components/           Hero, Header, Footer, ServiceCard, ServiceDetail,
                        WorkshopDetail, Schema, ServiceSchema, CourseSchema, ...
  content/              Markdown collections: services, team, partners
  content.config.ts     Zod schemas for those collections
  data/                 contact.ts, service-groups.ts, service-details.ts,
                        workshops.ts, logos.ts, cities.ts
  i18n/{de,en,index}.ts typed string tables
  styles/global.css     Tailwind v4 @theme tokens
scripts/generate-og.mjs prebuild step, renders og.svg to og.png via sharp
.github/workflows/      deploy.yml
```

## Content model

Content lives in Markdown under `src/content/`, typed by Zod schemas in
`src/content.config.ts`. Every entry is single-language, named
`<slug>.<lang>.md`, and carries `lang` and `order` in its frontmatter. Pages
filter by locale and sort by `order`.

**DE and EN files are separate but must stay in sync**: same `track`, same
`order`, and the same set of frontmatter fields with the same number of list
items. A change to one locale is incomplete until the other matches.

### Services

`order` is a single sequence across all services and workshops, and it drives
the `NN / Group` eyebrow numbering on the services page. Inserting a service
means renumbering everything below it, in both locales.

Category groups live in `src/data/service-groups.ts`, which maps `track` values
to group labels. A new `track` must be added in three places: the enum in
`src/content.config.ts`, the group's `tracks` array in `service-groups.ts`, and
the frontmatter of the two Markdown files.

### Detail pages

Two distinct detail formats, deliberately different in shape:

- **Workshops** render at `/workshops/[slug]` from `WorkshopDetail.astro`:
  takeaways, audience, format, agenda, booking terms. Opt in by using one of the
  tracks in `WORKSHOP_TRACKS` (`src/data/workshops.ts`).
- **Consulting services** render at `/services/[slug]` from `ServiceDetail.astro`:
  situation, phased approach with a deliverable per phase, optional fields of
  action, outcomes, engagement frame. Opt in by defining `approach` in
  frontmatter (`hasServiceDetail` in `src/data/service-details.ts`).

Section labels for both are passed in from the route files, not read from
`src/i18n/`. Keep the DE and EN label sets aligned when adding a section.

The Markdown body is shared: it renders both as the card text on `/services` and
as the lead paragraph on the detail page. Keep it to a few sentences so it works
in both places, and put the longer narrative in `situation` and the structured
fields.

## Content rules

- **No em-dashes** anywhere in copy. Use commas, parentheses, or two sentences.
- **Swiss German orthography**: `ss`, never `ß`.
- **Formal address** in German copy (`Sie`).
- **No concrete engagement durations, day rates, or prices** on service pages.
  Describe scope instead, so a small engagement reads as welcome. Workshop
  durations are the deliberate exception: they are booking information.
- A change to German copy ships with its English counterpart in the same pull
  request, and the reverse. A half-translated site is a bug.
- Legal pages (Impressum, Datenschutz) change only deliberately and never as a
  side effect of a refactor.

## Code conventions

- Quote any YAML scalar containing a colon followed by a space, or the frontmatter
  will fail to parse.
- The public contact address is defined once, in `src/data/contact.ts`. Never
  reintroduce a hardcoded address elsewhere.
- Run `pnpm format` before committing. The repo is prettier-clean; keep it that way
  so diffs stay reviewable.

## Environment variables

`SITE_URL` and `CONTACT_EMAIL`, both optional locally (see `.env.example`).
Production sets `SITE_URL` in `deploy.yml`; `CONTACT_EMAIL` falls back to the
value in `src/data/contact.ts`.

Use `||` and not `??` for environment fallbacks. An unset GitHub Actions secret
expands to an empty string, which is not nullish, so `??` would let the empty
value through.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: pnpm install with a
frozen lockfile, `astro check && astro build`, then upload and publish `dist/` to
GitHub Pages. `public/CNAME` keeps the custom domain attached across runs.

Do not add a `version:` input to `pnpm/action-setup@v4`. It conflicts with the
`packageManager` field in `package.json` and fails the job.

## SEO and LLM indexing

Structured data, the sitemap and the crawler files are part of the product, not
an afterthought. When adding pages or services:

- JSON-LD: site-wide `ProfessionalService` and `Person` (`Schema.astro`),
  per-service `Service` on cards (`ServiceCard.astro`), `Service` plus
  `BreadcrumbList` on service detail pages (`ServiceSchema.astro`), and `Course`
  on workshop pages (`CourseSchema.astro`).
- `@astrojs/sitemap` picks up new routes automatically, with hreflang alternates.
- `public/llms.txt` is hand-maintained and will go stale unless updated alongside
  new or renamed pages.
- `public/robots.txt` explicitly allowlists major AI crawlers.

## Confidentiality

The working directory holds material that must never reach the repository.
`.env.local`, `tmp/`, `brand/`, and `workshops/` are gitignored and contain
credentials, client and partner source documents, and off-site brand assets.

- Nothing from those directories enters a commit. Prefer explicit paths over
  `git add -A`, and read the staged file list before committing.
- **Names of clients and partners taken from source material never appear in the
  repository**: not in page copy, not in code comments, not in commit messages,
  not in branch names. Source documents inform structure and approach only.
- Real partner logos and named references require written consent per partner.
  Anonymise until it is in hand.
- No personal email addresses, credentials, tokens, internal URLs, or ticket
  identifiers in committed files or rendered output.
- Keep the sensitive terms to grep for in `.leakwords`, one pattern per line.
  That file is gitignored precisely because the terms themselves are the secret.

## Definition of done

Before calling a piece of work finished, in this order:

```bash
pnpm build                    # astro check plus build, must pass
npx prettier --check .        # must be clean
git status --short            # nothing unexpected
git diff --cached --name-only | grep -E '^(tmp|brand|workshops)/|\.env'   # must be empty
grep -rn "—" src/ public/     # no em-dashes
grep -rniE "gmail\.com|github_pat_|xox[baprs]-|BEGIN [A-Z ]*PRIVATE KEY" src/ public/ *.md
grep -rniFf .leakwords src/ public/ *.md 2>/dev/null   # no client or partner names
```

Then confirm by hand:

- New or renamed routes appear in `public/llms.txt` and are reachable through the
  navigation, not only through the sitemap.
- New pages carry the appropriate JSON-LD.
- German and English are in sync: same fields, same list lengths, same `order`.
- `README.md` and this file still describe reality, including service counts,
  commands, layout and conventions.
- Any convention discovered while working is written into this file rather than
  left in a conversation.
- Background dev servers are stopped.

Run these checks quietly. Prefer `git diff --stat`, `grep -c`, or piping to
`tail` over commands that dump full diffs or whole files into the terminal, and
report the conclusion rather than the raw output. Show a diff only when it is
the thing being discussed, and then only the relevant hunk.
