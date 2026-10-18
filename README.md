# pmzi.dev

Personal site. The home page (`/`) and `/mocha-or-latte/` are hand-written HTML in `public/`.
The blog is an [Astro](https://astro.build) static site: Markdown posts in `src/content/posts/`
built to plain HTML. Posts live at `pmzi.dev/notes/<slug>/`. The post index is at `/notes/`.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (types)
```

## Writing a post

Create `src/content/posts/<slug>.md`. **The filename is the URL slug** (lowercase kebab-case):
`why-my-build-got-fast.md` is published at `pmzi.dev/why-my-build-got-fast/`.

````md
---
title: Why my build went from 70s to 600ms
date: 2026-10-14
layer: browser            # browser | node | rails | core | beyond
tldr: "One or two sentences. Shown as the quote at the top of the post. Quote it if it contains a colon."
description: Optional. Used for meta tags and RSS; defaults to the tldr.
draft: false              # optional; drafts are hidden from builds (visible in `npm run dev`)
---

Body in Markdown. `## Heading` renders as `# Heading`. Code fences can take a file label:

```js title="webpack.config.js"
module.exports = {}
```
````

The build **fails** if a slug isn't lowercase kebab-case. MDX (`.mdx`) and React are
installed, so a post can import components later; nothing uses them yet.

The one post in `src/content/posts/` is a **test post** (it starts with a `PLACEHOLDER POST`
comment). It exercises the TL;DR, headings and a code block. Delete it before publishing real writing.

## Deployment (Cloudflare Pages)

Single project on pmzi.dev. Framework preset: Astro (or None). Build command: `npm run build`.
Build output directory: `dist`. Files in `public/` (home, `mocha-or-latte/`, `404.html`,
`_headers`, `robots.txt`, `assets/`) are copied into `dist/` unchanged. The sitemap is generated
at `/sitemap-index.xml` (the home page is added by hand in `astro.config.mjs`;
`/mocha-or-latte/` is `noindex`, so it is left out).

## Deploy (GitHub Actions to Cloudflare Pages)

`.github/workflows/deploy.yml` runs on every push: `npm ci`, `npm run check`, `npm run build`, then
publishes `dist/` to Cloudflare Pages. `main` is production (pmzi.dev); other branches get a preview URL.

One-time setup:

1. In Cloudflare, create a Pages project of type **Direct Upload** (named `pmzi-dev`, or set the repo
   variable `CLOUDFLARE_PAGES_PROJECT` to the name you used) and attach the `pmzi.dev` custom domain.
   Its production branch must be `main`.
2. Create an API token with **Account > Cloudflare Pages > Edit**.
3. In the GitHub repo (Settings > Secrets and variables > Actions) add secrets `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`.

A Pages project connected to Git builds on its own; use a Direct Upload project instead, or the site is
built twice.
