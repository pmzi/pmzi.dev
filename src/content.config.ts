import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // id = filename without extension = the URL slug (pmzi.dev/notes/<slug>/)
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    layer: z.enum(['browser', 'node', 'rails', 'core', 'beyond']),
    tldr: z.string().min(1),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
