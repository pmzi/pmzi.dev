import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('posts', (p) => import.meta.env.DEV || !p.data.draft);
  for (const post of entries) {
    if (!SLUG_RE.test(post.id)) {
      throw new Error(`Post "${post.id}": slug (filename) must be lowercase kebab-case.`);
    }
  }
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}
