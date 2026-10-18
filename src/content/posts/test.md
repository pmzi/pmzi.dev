---
title: Test
date: 2026-10-14
layer: browser
tldr: "Builds are slow where you aren't looking. Profile first, turn on a filesystem cache, swap in a faster compiler, then delete what you no longer need. 70s became 600ms."
---

<!-- PLACEHOLDER POST: replace with the real article. -->

When I joined, a production build took seventy seconds. Nobody complained, because nobody remembered it being faster. That is how slow builds survive: they become weather.

## Measure before you guess

The first step was a flame graph, not a hunch. Most of the time sat in two places, and neither was where we had been looking.

```js title="webpack.config.js"
module.exports = {
  cache: { type: 'filesystem' },
  module: { rules: [swcLoader] },
}
```

Caching and a faster compiler got us most of the way. The rest was deleting things we no longer needed.

## What I would do again

- Write the number down before touching anything.
- Change one thing at a time and re-measure.
- Keep the fast path fast: a `watch` mode is worth more than a clever build.
