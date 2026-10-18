import type { APIRoute } from 'astro';
import { getPosts, readingMinutes, isoDay } from '../../../lib/posts';
import { renderCard, pngResponse } from '../../../lib/og';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
  const { title, date, layer } = post.data;
  return pngResponse(await renderCard({
    prompt: `$ cat ${post.id}.md`,
    title,
    meta: `${isoDay(date)} · ${layer} · ${readingMinutes(post.body)} min read`,
  }));
};
