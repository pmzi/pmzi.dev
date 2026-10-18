// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import terminalTheme from './src/lib/shiki-theme.mjs';

export default defineConfig({
  site: 'https://pmzi.dev',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    react(),
    // The home page (/) is hand-written HTML in public/, so Astro can't see it.
    // /mocha-or-latte/ is deliberately left out: it is noindex.
    sitemap({ customPages: ['https://pmzi.dev/'] }),
  ],
  markdown: {
    shikiConfig: {
      theme: terminalTheme,
      wrap: false,
      transformers: [
        {
          // ```js title="webpack.config.js" -> <pre data-title="webpack.config.js">
          pre(node) {
            const raw = this.options.meta?.__raw ?? '';
            const m = raw.match(/title="([^"]+)"/);
            if (m) node.properties['data-title'] = m[1];
          },
        },
      ],
    },
  },
});
