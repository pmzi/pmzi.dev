import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Share-card renderer (1200x630, the size Telegram, Slack, X and iMessage expect).
// Same palette as the site: ground #111111, ink #E6E6E6, muted #8C8C8C, primary #8FA8E8.
const C = { ground: '#111111', ink: '#E6E6E6', muted: '#8C8C8C', primary: '#8FA8E8', line: '#333333' };

const fontDir = join(process.cwd(), 'node_modules/@fontsource/jetbrains-mono/files');
const fonts = [400, 700].map((weight) => ({
  name: 'JetBrains Mono',
  weight: weight as 400 | 700,
  style: 'normal' as const,
  data: readFileSync(join(fontDir, `jetbrains-mono-latin-${weight}-normal.woff`)),
}));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style: { display: 'flex', boxSizing: 'border-box', ...style }, children },
});

export interface Card {
  prompt: string; // e.g. "$ cat why-my-build.md"
  title: string;
  meta?: string; // e.g. "2026-10-14 · browser · 6 min read"
  brand?: string; // top-left wordmark
}

export async function renderCard({ prompt, title, meta, brand = 'pmzi.dev ~/notes' }: Card): Promise<Uint8Array> {
  const size = title.length > 60 ? 52 : title.length > 36 ? 64 : 76;
  const tree = h('div', {
    width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between',
    background: C.ground, padding: '72px 80px', fontFamily: 'JetBrains Mono', color: C.ink,
  }, [
    h('div', { fontSize: 28, fontWeight: 700, color: C.primary }, brand),
    h('div', { flexDirection: 'column', gap: 28, width: '100%' }, [
      h('div', { fontSize: 26, color: C.primary }, prompt),
      h('div', { width: '100%', fontSize: size, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', wordBreak: 'break-word' }, title),
    ]),
    h('div', {
      justifyContent: 'space-between', alignItems: 'center', paddingTop: 28,
      borderTop: `2px solid ${C.line}`, width: '100%', fontSize: 26, color: C.muted,
    }, [h('div', {}, meta ?? ''), h('div', {}, 'Pouya MozaffarMagham')]),
  ]);

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

export const pngResponse = (png: Uint8Array) =>
  new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
