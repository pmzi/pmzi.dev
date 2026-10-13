# pmzi.dev: "Down the Stack" design

Date: 2026-10-12
Status: draft, awaiting review

## Purpose

A playful personal site for Pouya MozaffarMagham. **Playground first**: a memorable, fun experience that shows who they are. Career details are discovered by exploring, with a plain fast path for recruiters. **Mobile is a first-class target**, not an afterthought.

Audience (assumed): recruiters, peers, friends. English only.

## Concept

The visitor descends through the layers of a software stack. This mirrors the career arc: front-end engineer, then full-stack, then backend/payments software engineer. One vertical page, six layers, scroll = descend.

## Structure

| # | Layer | Content | Mood |
|---|---|---|---|
| 0 | Surface: pixels and DOM | Name, hook ("started at the pixels, kept going down"), plain Resume link | Sunny, soft, rounded |
| 1 | Browser: JS and React | Cafe Bazaar, Balad, Divar; build 70s to 600ms, FCP 2.4s to 1.5s, 40M+ users, team of 5 | Bright, cooling |
| 2 | Node: tools and automation | BrowseAI (DOM mirroring, AI robot trainer), Bug Hunter AST scanners | Dim, terminal green |
| 3 | Rails: Ruby | Shopify, Payments and Cross Border | Deep, warm dark |
| 4 | Core: payments | Cross-border money movement, the "bottom" | Glowing, near black |
| 5 | Beyond the stack | Side quests (ZenCats, teaching, hardware store idea), contact links | Gentle return light |

Colour shifts per layer, so the palette itself communicates depth.

## Interaction

- Depth gauge pinned to the screen edge; tap a layer to jump.
- One signature toy per layer, tap/drag only (no hover dependence):
  - Surface: name letters are loose DOM nodes you can flick.
  - Browser: a build-time bar you can race.
  - Node: a small "mirror the DOM" trick.
  - Rails: a Ruby gem you can polish.
  - Core: coins fall with scroll.
- Hidden side quests (Theatre.js, Hackalran, Apple security acknowledgement) found by poking. Nothing essential is hidden behind them.

## Mobile and accessibility

- Designed at 390px first, scaled to 1440px.
- Single column, large tap targets.
- `prefers-reduced-motion`: toys become static scenes.
- Content is real DOM text, not canvas.
- Visible "skip the ride" link jumps to a plain resume summary.

## Implementation

Plain HTML, CSS and vanilla JS in the existing static repo (`index.html`). No framework, no build step. CSS scroll-driven animation plus a small canvas for toys. Alternative considered: Astro/Vite, rejected as unneeded tooling for one page.

## Deployment (Cloudflare Pages, one project)

Both the main site and the side project ship from this repo as a single Cloudflare Pages project on pmzi.dev:

- `pmzi.dev/` is the Down the Stack site.
- `pmzi.dev/mocha-or-latte` is the Mocha or Latte page for Darya, a separate Paper design with its own folder.

Layout: only a `public/` folder is deployed, so `docs/` (specs, plans) is never served.

```
public/
  index.html                  # Down the Stack
  mocha-or-latte/index.html   # Mocha or Latte
  assets/                     # shared fonts, images, small shared JS/CSS
  404.html
docs/                         # not deployed
```

Cloudflare Pages settings: framework preset None, build command empty, build output directory `public`. Pages serves `mocha-or-latte/index.html` at `/mocha-or-latte`. Use root-absolute paths for assets (`/assets/...`) so both pages resolve them.

Each page stays independent (own CSS/JS, no shared runtime), so the side project can move to its own project later without changes.

## Design deliverable (Paper)

New Paper file containing:
1. Design tokens: palette per layer, type scale, spacing.
2. Mobile (390) and desktop (1440) artboards for all six layers.
3. Toy-states page.

Order of work: spec review, then Paper design, then code.

## Open questions

- Which links to show (GitHub, LinkedIn, email).
- Photo or no photo.
- Whether the Bug Hunter / Apple acknowledgement story should appear as a side quest.
- Existing starfield/CRT homepage: replaced entirely (assumed).
