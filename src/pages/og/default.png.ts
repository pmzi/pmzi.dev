import type { APIRoute } from 'astro';
import { renderCard, pngResponse } from '../../lib/og';

// Share card for the hand-written home page (public/index.html).
export const GET: APIRoute = async () =>
  pngResponse(await renderCard({
    brand: 'pmzi.dev',
    prompt: '$ whoami',
    title: 'Pouya MozaffarMagham, software engineer',
    meta: 'Started at the pixels, kept going down.',
  }));
