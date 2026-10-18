import type { APIRoute } from 'astro';
import { renderCard, pngResponse } from '../../lib/og';

export const GET: APIRoute = async () =>
  pngResponse(await renderCard({
    prompt: '$ ls -t',
    title: 'Notes on the way down the stack',
    meta: 'front-end · Node · Rails · payments',
  }));
