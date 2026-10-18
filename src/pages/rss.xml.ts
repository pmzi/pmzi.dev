import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'pmzi.dev notes',
    description: 'Notes on the way down the stack: front-end, Node, Rails, payments.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? post.data.tldr,
      link: `/notes/${post.id}/`,
      categories: [post.data.layer],
    })),
    customData: '<language>en-ca</language>',
  });
}
